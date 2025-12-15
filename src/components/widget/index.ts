import { Widget } from "@lumino/widgets";

/** Unique ID generator with collision prevention */
class IdGenerator {
  private counter = 0;
  private lastTimestamp = 0;
  private readonly group: string;
  private readonly machineId: number;

  constructor(group = "main") {
    this.group = group;
    this.machineId = Math.random() & 255;
  }

  generate(): string {
    const now = Date.now();
    this.counter = now === this.lastTimestamp ? (this.counter + 1) & 0xffff : 0;
    this.lastTimestamp = now;

    const hex = (v: number, len: number) => v.toString(16).padStart(len, "0");
    const rand = () => Math.random().toString(36).slice(2);

    return `widget-${this.group}-${rand()}${rand()}-${hex(now, 12)}${hex(
      this.machineId,
      2
    )}${hex(this.counter, 4)}${hex((Math.random() * 0xffff) | 0, 4)}`;
  }
}

const idGenerator = new IdGenerator("code-editor");

/** Context passed to render method */
export interface RenderContext {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly closable: boolean;
  readonly kind: string;
  readonly node: HTMLElement;
}

/** Render function type */
export type RenderFn = (ctx: RenderContext) => HTMLElement | string | void;

/** Widget options */
export interface MyWidgetOptions {
  readonly id?: string;
  readonly label?: string;
  readonly icon?: string;
  readonly closable?: boolean;
  readonly kind?: string;
  readonly render?: RenderFn;
}

/** Default render function */
const defaultRender: RenderFn = (ctx) => `
  <h2>${ctx.label}</h2>
  <button>Click me!</button>
  <p>Status: <span class="status">Idle</span></p>
`;

/** Custom widget with kind property for serialization */
class MyWidget extends Widget {
  readonly kind: string;
  private readonly _render: RenderFn;

  constructor({
    id = idGenerator.generate(),
    label = "",
    icon = "",
    closable = true,
    kind = "CODE_EDITOR",
    render = defaultRender,
  }: MyWidgetOptions = {}) {
    super();

    this.id = id;
    this.kind = kind;
    this._render = render;

    this.title.label = label;
    this.title.closable = false;
    this.title.className = `code-editor-widget-tab-class${
      closable ? " closable" : ""
    }`;
    this.title.iconClass = ["lumino-editor-icon", icon].join(" ");

    this.addClass("my-widget");
    this.node.dataset.closable = String(closable);

    const content = document.createElement("div");
    content.className = "code-editor-widget-content-class";

    const ctx: RenderContext = {
      id,
      label,
      icon,
      closable,
      kind,
      node: content,
    };
    const result = this._render(ctx);

    if (result instanceof HTMLElement) {
      content.appendChild(result);
    } else if (typeof result === "string") {
      content.innerHTML = result;
    }

    this.node.appendChild(content);
  }
}

/** Tab registry by widget ID */
const tabRegistry = new Map<string, HTMLElement>();

export default class Main {
  static create(options: MyWidgetOptions): Widget {
    return new MyWidget(options);
  }

  /** Icon style config */
  static icons = {
    close: { text: "×", fontSize: "26px", marginTop: "0" },
    dirty: { text: "●", fontSize: "32px", marginTop: "-2px" },
  };

  /** Click handler config */
  static handlers = {
    /** Called when clicking close on a clean tab. Return false to cancel. */
    onClose: (ctx: { widgetId: string; close: () => void }) => {
      ctx.close();
    },
    /** Called when clicking close on a dirty tab. Return false to cancel. */
    onDirtyClose: (ctx: { widgetId: string; close: () => void }) => {
      ctx.close();
    },
  };

  static closer(
    config: {
      tab: HTMLElement;
      closable: boolean;
      view?: Element | { id: string } | null;
      widget?: Widget | null;
    },
    render?: (ctx: {
      el: HTMLElement;
      setDirty: (dirty: boolean) => void;
      isDirty: () => boolean;
      close: () => void;
    }) => (() => void) | void
  ): void {
    const tab = config.tab;

    // Skip if close icon already exists
    if (tab.querySelector(".lumino-close-editor-icon")) {
      return;
    }

    const el = document.createElement("div");
    el.className = "lumino-close-editor-icon";
    const widgetId = (config.view as { id?: string } | null)?.id ?? "";

    // Hide if not closable (but keep space)
    if (!config.closable) {
      el.style.visibility = "hidden";
      tab.appendChild(el);
      return;
    }

    // Register tab by widget ID
    if (widgetId) {
      tabRegistry.set(widgetId, tab);
    }

    // Close function to dispose the widget
    const close = () => {
      config.widget?.dispose();
    };

    // Apply icon style helper
    const applyIcon = (icon: { text: string; fontSize: string; marginTop: string }) => {
      el.textContent = icon.text;
      el.style.fontSize = icon.fontSize;
      el.style.marginTop = icon.marginTop;
    };

    // Dirty state via dataset with auto-update
    const setDirty = (dirty: boolean) => {
      tab.dataset.dirty = String(dirty);
      applyIcon(dirty ? this.icons.dirty : this.icons.close);
    };

    const isDirty = () => tab.dataset.dirty === "true";

    // Initialize with close icon
    applyIcon(this.icons.close);

    // Default click handler using configured handlers
    const defaultClick = () => {
      const ctx = { widgetId, close };
      if (isDirty()) {
        this.handlers.onDirtyClose(ctx);
      } else {
        this.handlers.onClose(ctx);
      }
    };

    // Get click handler from render or use default
    const onClick = render?.({ el, setDirty, isDirty, close }) ?? defaultClick;

    // Attach click handler
    if (onClick) {
      el.addEventListener("click", onClick);
    }

    tab.appendChild(el);
  }

  /** Set dirty state by widget ID */
  static setDirty(widgetId: string, dirty: boolean): void {
    const tab = tabRegistry.get(widgetId);
    if (tab) {
      tab.dataset.dirty = String(dirty);
      // Update icon
      const el = tab.querySelector(".lumino-close-editor-icon") as HTMLElement;
      if (el) {
        const icon = dirty ? this.icons.dirty : this.icons.close;
        el.textContent = icon.text;
        el.style.fontSize = icon.fontSize;
        el.style.marginTop = icon.marginTop;
      }
    }
  }

  /** Check if a widget is dirty by ID */
  static isDirty(widgetId: string): boolean {
    return tabRegistry.get(widgetId)?.dataset.dirty === "true";
  }

  /** Get tab element by widget ID */
  static getTab(widgetId: string): HTMLElement | undefined {
    return tabRegistry.get(widgetId);
  }

  /** Unregister tab (call on tab removed) */
  static unregister(widgetId: string): void {
    tabRegistry.delete(widgetId);
  }
}
