/** Theme configuration */
export interface DockTheme {
  readonly panelBg?: string;
  readonly tabBarBg?: string;
  readonly tabBg?: string;
  readonly tabBgActive?: string;
  readonly tabTextColor?: string;
  readonly tabPaddingX?: string;
  readonly tabBarMinHeight?: string;
  readonly tabBarGap?: string;
  readonly resizerBg?: string;
  readonly resizerHv?: string;
  readonly overlayBg?: string;
  readonly overlayOpacity?: string;
  readonly iconLeftMargin?: string;
  readonly iconRightMargin?: string;
  readonly iconRightOpacity?: string;
}

/** Default theme values */
export const defaultTheme: Required<DockTheme> = {
  panelBg: "#1e1e1e",
  tabBarBg: "#252526",
  tabBg: "#2d2d2d",
  tabBgActive: "#1e1e1e",
  tabTextColor: "#ccc",
  tabPaddingX: "8px",
  tabBarMinHeight: "30px",
  tabBarGap: "2px",
  resizerBg: "#007acc",
  resizerHv: "yellow",
  overlayBg: "#007acc",
  overlayOpacity: "0.3",
  iconLeftMargin: "10px",
  iconRightMargin: "20px",
  iconRightOpacity: "0.3",
};

/** Build CSS variables from theme */
function buildCssVars(theme: DockTheme): string {
  const t = { ...defaultTheme, ...theme };
  return `--dock-panel-bg:${t.panelBg};--dock-tab-bar-bg:${t.tabBarBg};--dock-tab-bg-color:${t.tabBg};--dock-tab-bg-active:${t.tabBgActive};--dock-tab-text-color:${t.tabTextColor};--dock-tab-padding-x:${t.tabPaddingX};--dock-tab-bar-min-height:${t.tabBarMinHeight};--dock-tab-bar-gap:${t.tabBarGap};--dock-handle-bg:${t.resizerBg};--dock-handle-hv:${t.resizerHv};--dock-overlay-bg:${t.overlayBg};--dock-overlay-opacity:${t.overlayOpacity};--editor-icon-left-margin:${t.iconLeftMargin};--editor-icon-right-margin:${t.iconRightMargin};--editor-icon-right-opacity:${t.iconRightOpacity}`;
}

/**
 * Lumino required CSS (minified) - widget, dockpanel, splitpanel, tabbar
 * These are essential for the DockPanel to function correctly
 */
const LUMINO_CSS = `.lm-Widget{box-sizing:border-box;position:relative}.lm-Widget.lm-mod-hidden{display:none!important}.lm-DockPanel{z-index:0}.lm-DockPanel-widget{z-index:0}.lm-DockPanel-tabBar{z-index:1}.lm-DockPanel-handle{z-index:2}.lm-DockPanel-handle.lm-mod-hidden{display:none!important}.lm-DockPanel-handle:after{position:absolute;top:0;left:0;width:100%;height:100%;content:''}.lm-DockPanel-handle[data-orientation='horizontal']{cursor:ew-resize}.lm-DockPanel-handle[data-orientation='vertical']{cursor:ns-resize}.lm-DockPanel-handle[data-orientation='horizontal']:after{left:50%;min-width:8px;transform:translateX(-50%)}.lm-DockPanel-handle[data-orientation='vertical']:after{top:50%;min-height:8px;transform:translateY(-50%)}.lm-DockPanel-overlay{z-index:3;box-sizing:border-box;pointer-events:none}.lm-DockPanel-overlay.lm-mod-hidden{display:none!important}.lm-SplitPanel-child{z-index:0}.lm-SplitPanel-handle{z-index:1}.lm-SplitPanel-handle.lm-mod-hidden{display:none!important}.lm-SplitPanel-handle:after{position:absolute;top:0;left:0;width:100%;height:100%;content:''}.lm-SplitPanel[data-orientation='horizontal']>.lm-SplitPanel-handle{cursor:ew-resize}.lm-SplitPanel[data-orientation='vertical']>.lm-SplitPanel-handle{cursor:ns-resize}.lm-SplitPanel[data-orientation='horizontal']>.lm-SplitPanel-handle:after{left:50%;min-width:8px;transform:translateX(-50%)}.lm-SplitPanel[data-orientation='vertical']>.lm-SplitPanel-handle:after{top:50%;min-height:8px;transform:translateY(-50%)}.lm-TabBar{display:flex;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.lm-TabBar[data-orientation='horizontal']{flex-direction:row;align-items:flex-end}.lm-TabBar[data-orientation='vertical']{flex-direction:column;align-items:flex-end}.lm-TabBar-content{margin:0;padding:0;display:flex;flex:1 1 auto;list-style-type:none}.lm-TabBar[data-orientation='horizontal']>.lm-TabBar-content{flex-direction:row}.lm-TabBar[data-orientation='vertical']>.lm-TabBar-content{flex-direction:column}.lm-TabBar-tab{display:flex;flex-direction:row;box-sizing:border-box;overflow:hidden;touch-action:none}.lm-TabBar-tabIcon,.lm-TabBar-tabCloseIcon{flex:0 0 auto}.lm-TabBar-tabLabel{flex:1 1 auto;overflow:hidden;white-space:nowrap}.lm-TabBar-tabInput{user-select:all;width:100%;box-sizing:border-box}.lm-TabBar-tab.lm-mod-hidden{display:none!important}.lm-TabBar-addButton.lm-mod-hidden{display:none!important}.lm-TabBar.lm-mod-dragging .lm-TabBar-tab{position:relative}.lm-TabBar.lm-mod-dragging[data-orientation='horizontal'] .lm-TabBar-tab{left:0;transition:left 150ms ease}.lm-TabBar.lm-mod-dragging[data-orientation='vertical'] .lm-TabBar-tab{top:0;transition:top 150ms ease}.lm-TabBar.lm-mod-dragging .lm-TabBar-tab.lm-mod-dragging{transition:none}`;

/** Custom theme styles */
const THEME_STYLES = `.lm-DockPanel{background-color:var(--dock-panel-bg);height:100%;width:100%}.lm-DockPanel .lm-TabBar{min-height:var(--dock-tab-bar-min-height);background-color:var(--dock-tab-bar-bg)}.lm-TabBar-content{height:100%;column-gap:var(--dock-tab-bar-gap)}.lm-TabBar-tab{background-color:var(--dock-tab-bg-color);color:var(--dock-tab-text-color);align-items:center;padding:0 var(--dock-tab-padding-x)}.lm-DockPanel-handle{background-color:var(--dock-handle-bg)}.lm-DockPanel-overlay{background-color:var(--dock-overlay-bg);opacity:var(--dock-overlay-opacity)}.lm-mod-current{background-color:var(--dock-tab-bg-active)}.lumino-editor-icon{margin-right:var(--editor-icon-left-margin)}.lumino-close-editor-icon{margin-left:var(--editor-icon-right-margin);cursor:pointer;opacity:var(--editor-icon-right-opacity)}.lumino-close-editor-icon:hover{opacity:1}.lm-DockPanel-handle:hover {background-color: var(--dock-handle-hv);}`;

let injected = false;
let styleEl: HTMLStyleElement | null = null;

/** Inject styles into document head (called automatically on import) */
export function injectStyles(theme?: DockTheme): void {
  if (typeof document === "undefined") return;

  const cssVars = buildCssVars(theme ?? {});
  const fullStyles = `:root{${cssVars}}${LUMINO_CSS}${THEME_STYLES}`;

  if (!injected) {
    styleEl = document.createElement("style");
    styleEl.id = "lumino-easy-styles";
    styleEl.textContent = fullStyles;
    document.head.appendChild(styleEl);
    injected = true;
  } else if (styleEl) {
    styleEl.textContent = fullStyles;
  }
}

/** Update theme without re-injecting */
export function setTheme(theme: DockTheme): void {
  if (!injected) {
    injectStyles(theme);
    return;
  }

  if (styleEl) {
    const cssVars = buildCssVars(theme);
    styleEl.textContent = `:root{${cssVars}}${LUMINO_CSS}${THEME_STYLES}`;
  }
}

/** Check if styles are already injected */
export function stylesInjected(): boolean {
  return injected;
}

/** Raw CSS string for manual injection */
export const rawStyles = `:root{${buildCssVars(
  {}
)}}${LUMINO_CSS}${THEME_STYLES}`;
