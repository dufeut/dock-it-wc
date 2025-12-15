/**
 * Bundle Entry Point
 */

import { Docker } from "./docker";
import Widget, { type MyWidgetOptions } from "./components/widget";
import { injectStyles, setTheme, type DockTheme, defaultTheme } from "./inject-styles";

// Auto-inject styles on import
injectStyles();
import type {
  DockerConfig,
  RenderContext,
  RenderFn,
  SerializedLayout,
} from "./docker";

// Export for ESM consumers
export { Docker, Widget, setTheme, defaultTheme };
export type {
  MyWidgetOptions,
  DockTheme,
  DockerConfig,
  RenderContext,
  RenderFn,
  SerializedLayout,
};

// Expose on window for IIFE consumers
if (typeof window !== "undefined") {
  (window as any).DockIt = {
    Docker,
    Widget,
    setTheme,
    defaultTheme,
  };
}
