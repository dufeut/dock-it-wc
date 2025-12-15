// Auto-inject styles on import
import { injectStyles } from "./inject-styles";
injectStyles();

// Core exports
export { Docker } from "./docker";
export type {
  DockerConfig,
  WidgetFactory,
  WidgetModel,
  AddOptions,
  WidgetConfig,
  SerializedLayout,
  TabNodeConfig,
  RenderContext,
  RenderFn,
} from "./docker";

// Widget exports
export { default as Widget } from "./components/widget";
export type { MyWidgetOptions } from "./components/widget";

// DockPanel exports (for advanced use)
export { default as DockPanel } from "./components/dock-panel";
export type { TabCallbacks, MyDockPanelOptions } from "./components/dock-panel";

// Layout serializer exports (for custom implementations)
export {
  serializeLayout,
  deserializeLayout,
  layoutToJSON,
  jsonToSerializedLayout,
} from "./layout-serializer";
export type {
  SerializedTabArea,
  SerializedSplitArea,
  SerializedArea,
} from "./layout-serializer";

// Style utilities (for advanced customization)
export {
  injectStyles,
  setTheme,
  stylesInjected,
  rawStyles,
  defaultTheme,
} from "./inject-styles";
export type { DockTheme } from "./inject-styles";
