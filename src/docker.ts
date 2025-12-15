import { Widget } from "@lumino/widgets";
import MyDockPanel, { type TabNodeConfig } from "./components/dock-panel";
import {
  serializeLayout,
  deserializeLayout,
  type SerializedLayout,
  type WidgetConfig,
} from "./layout-serializer";
import type { RenderContext, RenderFn } from "./components/widget";
import MyWidget from "./components/widget";

export type {
  WidgetConfig,
  SerializedLayout,
  TabNodeConfig,
  RenderContext,
  RenderFn,
};

/** Widget with kind property for serialization */
interface KindedWidget extends Widget {
  kind: string;
}

/** Widget factory function type - can return Widget or options object */
export type WidgetFactory = (
  config: Omit<WidgetConfig, "kind">
) => Widget | Omit<WidgetConfig, "kind">;

/** Lifecycle hooks for a widget kind */
export interface WidgetModel {
  readonly created?: (widget: Widget) => void;
  readonly deleted?: (widget: Widget) => void;
}

/** Docker configuration */
export interface DockerConfig {
  readonly model?: Readonly<Record<string, WidgetModel>>;
  readonly widgets: Readonly<Record<string, WidgetFactory>>;
  readonly tabsMovable?: boolean;
  readonly tabsConstrained?: boolean;
  readonly addButtonEnabled?: boolean;
  readonly onTabAdded?: (config: TabNodeConfig) => void;
  readonly onTabRemoved?: (config: TabNodeConfig) => void;
}

/** Add widget options */
export interface AddOptions {
  readonly mode?:
    | "split-top"
    | "split-left"
    | "split-right"
    | "split-bottom"
    | "tab-before"
    | "tab-after";
  readonly ref?: Widget;
}

/** Docker - A clean wrapper around Lumino DockPanel with JSON serialization */
export class Docker {
  private dock: MyDockPanel | null = null;
  private readonly config: DockerConfig;

  constructor(config: DockerConfig) {
    this.config = config;
  }

  /** Get all tracked tab nodes */
  get nodes(): TabNodeConfig[] {
    return this.dock?.nodes ?? [];
  }

  /** Attach the dock panel to a DOM element */
  attach(el: HTMLElement | null): this {
    this.dock = this.createDock();
    if (el) Widget.attach(this.dock, el);
    return this;
  }

  private createDock(): MyDockPanel {
    const dock = new MyDockPanel({
      tabsMovable: this.config.tabsMovable ?? true,
      tabsConstrained: this.config.tabsConstrained ?? false,
      addButtonEnabled: this.config.addButtonEnabled ?? false,
      tabCallbacks: {
        onTabAdded: (config) => {
          config.tab.dataset.id = config.view?.id;
          MyWidget.closer(config); // Auto-setup closer
          this.config.onTabAdded?.(config);
        },
        onTabRemoved: this.config.onTabRemoved,
      },
    });
    dock.id = "docker-main";
    return dock;
  }

  /** Create a widget of a specific kind */
  widget(kind: string, options: Omit<WidgetConfig, "kind">): Widget {
    const factory = this.config.widgets[kind];
    if (!factory) {
      throw new Error(`Unknown widget kind: ${kind}`);
    }

    const result = factory(options);

    // If factory returns options object, wrap with Widget.create()
    // Auto-set kind from the key name
    const widget = (
      result instanceof Widget ? result : MyWidget.create({ ...result, kind })
    ) as KindedWidget;
    widget.kind = kind;

    this.config.model?.[kind]?.created?.(widget);
    return widget;
  }

  /** Add a widget to the dock */
  add(widget: Widget, options?: AddOptions): this {
    if (!this.dock) {
      throw new Error("Docker not attached. Call attach() first.");
    }

    this.dock.addWidget(
      widget,
      options?.ref ? { mode: options.mode, ref: options.ref } : undefined
    );
    return this;
  }

  /** Activate a widget (bring to front) */
  activate(widget: Widget): this {
    this.dock?.activateWidget(widget);
    return this;
  }

  /** Update layout (call after resize) */
  update(): this {
    this.dock?.update();
    return this;
  }

  /** Save current layout to JSON-serializable object */
  save(): SerializedLayout {
    return this.dock ? serializeLayout(this.dock.saveLayout()) : { main: null };
  }

  /** Save layout as JSON string */
  saveJSON(): string {
    return JSON.stringify(this.save(), null, 2);
  }

  /** Load layout from serialized object */
  load(el: HTMLElement | null, layout: SerializedLayout): this {
    this.attach(el);
    if (!this.dock) {
      throw new Error("Docker not attached. Call attach() first.");
    }

    const widgetFactory = (config: WidgetConfig): Widget => {
      const factory = this.config.widgets[config.kind];
      if (!factory) {
        throw new Error(`Unknown widget kind: ${config.kind}`);
      }

      const result = factory({
        id: config.id,
        label: config.label,
        icon: config.icon,
        closable: config.closable,
      });

      // If factory returns options object, wrap with Widget.create()
      // Auto-set kind from config
      const widget = (
        result instanceof Widget
          ? result
          : MyWidget.create({ ...result, kind: config.kind })
      ) as KindedWidget;

      widget.kind = config.kind;
      this.config.model?.[config.kind]?.created?.(widget);
      return widget;
    };

    const restored = deserializeLayout(layout, widgetFactory);
    this.dock.restoreLayout(restored);
    return this;
  }

  /** Load layout from JSON string */
  loadJSON(el: HTMLElement | null, json: string): this {
    return this.load(el, JSON.parse(json) as SerializedLayout);
  }

  /** Dispose the dock panel */
  dispose(): this {
    if (this.dock) {
      for (const widget of this.dock.widgets()) {
        const kind = (widget as KindedWidget).kind;
        if (kind) {
          this.config.model?.[kind]?.deleted?.(widget);
        }
      }
      this.dock.dispose();
      this.dock = null;
    }
    return this;
  }

  /** Check if disposed */
  get isDisposed(): boolean {
    return this.dock === null || this.dock.isDisposed;
  }

  /** Get the underlying DockPanel (for advanced use) */
  get panel(): MyDockPanel | null {
    return this.dock;
  }
}
