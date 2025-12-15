import { DockPanel, Widget } from "@lumino/widgets";

/** Tab node configuration */
export interface TabNodeConfig {
  readonly tab: HTMLElement;
  readonly view: Element | null;
  readonly widget: Widget | null;
  readonly closable: boolean;
}

/** Tab lifecycle callbacks */
export interface TabCallbacks {
  readonly onTabAdded?: (config: TabNodeConfig) => void;
  readonly onTabRemoved?: (config: TabNodeConfig) => void;
}

/** Extended DockPanel options */
export interface MyDockPanelOptions extends DockPanel.IOptions {
  readonly tabCallbacks?: TabCallbacks;
}

/** Custom DockPanel with tab node tracking and cleanup */
export default class MyDockPanel extends DockPanel {
  private tabNodes = new Map<string, TabNodeConfig>();
  private tabCallbacks: TabCallbacks;
  private observer: MutationObserver | null = null;

  constructor(options?: MyDockPanelOptions) {
    super(options);
    this.tabCallbacks = options?.tabCallbacks ?? {};
    this.setupObserver();
  }

  /** Get all tracked tab nodes */
  get nodes(): TabNodeConfig[] {
    return Array.from(this.tabNodes.values());
  }

  /** Handle tab mutation callback */
  private handleTabMutation = (
    type: "added" | "removed",
    data: { closable: boolean; node: HTMLElement }
  ): void => {
    const tabId = data.node.id;

    if (type === "added") {
      const view = document.querySelector(`[aria-labelledby="${tabId}"]`);
      // Find the widget that owns this tab by matching the view's id
      const widget = view?.id
        ? (Array.from(this.widgets()).find((w) => w.id === view.id) ?? null)
        : null;
      const config: TabNodeConfig = {
        tab: data.node,
        view,
        widget,
        closable: data.closable,
      };
      this.tabNodes.set(tabId, config);
      this.tabCallbacks.onTabAdded?.(config);
    } else {
      const config = this.tabNodes.get(tabId);
      if (config) {
        this.tabNodes.delete(tabId);
        this.tabCallbacks.onTabRemoved?.(config);
      }
    }
  };

  /** Setup the mutation observer for tab tracking */
  private setupObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (!node.classList.contains("lm-TabBar-tab")) return;
          this.handleTabMutation("added", {
            closable: node.classList.contains("closable"),
            node,
          });
        });

        mutation.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (!node.classList.contains("lm-TabBar-tab")) return;
          this.handleTabMutation("removed", {
            closable: node.classList.contains("closable"),
            node,
          });
        });
      }
    });

    this.observer.observe(this.node, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }

  /** Handle child widget removal */
  protected onChildRemoved(msg: Widget.ChildMessage): void {
    super.onChildRemoved(msg);

    // Clean up any orphaned tab entries by checking if tab still exists in DOM
    for (const [tabId, config] of this.tabNodes) {
      if (!this.node.contains(config.tab)) {
        this.tabNodes.delete(tabId);
        this.tabCallbacks.onTabRemoved?.(config);
      }
    }
  }

  /** Dispose and cleanup observer */
  dispose(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.tabNodes.clear();
    super.dispose();
  }
}
