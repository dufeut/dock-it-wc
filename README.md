# @dufeut/dock-it

A powerful, resizable docking system built on [Lumino](https://github.com/jupyterlab/lumino) that enables IDE-like layouts with draggable tabs, splittable panels, and persistent layout serialization.

## Features

- **Tab Management** - Draggable, reorderable, closable tabs
- **Split Panels** - Divide the dock horizontally or vertically with resizable handles
- **Layout Serialization** - Save and restore layouts as JSON
- **Drag & Drop** - Drag tabs between areas dynamically
- **Theme Customization** - Full CSS variable support
- **Widget Lifecycle** - Creation/deletion hooks for each widget type
- **TypeScript** - Full type definitions included
- **Zero CSS Dependencies** - Styles injected automatically

## Installation

```bash
npm install @dufeut/dock-it
# or
pnpm add @dufeut/dock-it
```

## Quick Start

```typescript
import { Docker, Widget } from "@dufeut/dock-it";

const docker = new Docker({
  widgets: {
    EDITOR: (cfg) =>
      Widget.create({
        ...cfg,
        kind: "EDITOR",
        render: (ctx) =>
          `<div style="padding: 20px;"><h2>${ctx.label}</h2></div>`,
      }),
  },
  onTabAdded: (config) => console.log("Tab added:", config),
  onTabRemoved: (config) => console.log("Tab removed:", config),
});

// Attach to DOM
docker.attach(document.getElementById("app"));

// Create and add widgets
const widget1 = docker.widget("EDITOR", {
  id: "file-1",
  label: "index.js",
  closable: true,
});
const widget2 = docker.widget("EDITOR", {
  id: "file-2",
  label: "style.css",
  closable: true,
});

docker.add(widget1);
docker.add(widget2, { mode: "split-right", ref: widget1 });

// Handle resize
window.addEventListener("resize", () => docker.update());
```

### IIFE (Script Tag)

```html
<script src="./dist/lumino-easy.iife.js"></script>
<script>
  const { Docker, Widget } = window.DockIt;
  // ... same usage as above
</script>
```

## API Reference

### Docker API

```typescript
docker.attach(el: HTMLElement): this           // Attach to DOM
docker.widget(kind: string, options): Widget   // Create a widget
docker.add(widget, options?): this             // Add widget to dock
docker.activate(widget): this                  // Bring widget to front
docker.update(): this                          // Update layout
docker.save(): SerializedLayout                // Save layout
docker.saveJSON(): string                      // Save as JSON string
docker.load(layout): this                      // Load layout
docker.loadJSON(json): this                    // Load from JSON string
docker.dispose(): this                         // Clean up
```

### Add Options

```typescript
interface AddOptions {
  mode?:
    | "split-top"
    | "split-left"
    | "split-right"
    | "split-bottom"
    | "tab-before"
    | "tab-after";
  ref?: Widget; // Reference widget for positioning
}
```

### Widget Options

```typescript
interface WidgetOptions {
  id?: string; // Auto-generated if not provided
  label?: string; // Tab label
  icon?: string; // CSS class for icon
  closable?: boolean; // Allow closing the tab
  kind?: string; // Widget type for serialization
  render?: (ctx: RenderContext) => HTMLElement | string | void;
}
```

### Docker Config

```typescript
interface DockerConfig {
  model?: Record<
    string,
    {
      created?: (widget: Widget) => void;
      deleted?: (widget: Widget) => void;
    }
  >;
  widgets: Record<string, (config) => Widget>;
  tabsMovable?: boolean; // Default: true
  tabsConstrained?: boolean; // Default: false
  addButtonEnabled?: boolean; // Default: false
  onTabAdded?: (config) => void;
  onTabRemoved?: (config) => void;
}
```

## Theming

Customize the appearance using `setTheme`:

```typescript
import { setTheme } from "@dufeut/dock-it";

setTheme({
  panelBg: "#1e1e1e",
  tabBarBg: "#252526",
  tabBg: "#2d2d2d",
  tabBgActive: "#1e1e1e",
  tabTextColor: "#ccc",
  tabPaddingX: "8px",
  tabBarMinHeight: "30px",
  tabBarGap: "2px",
  handleBg: "#007acc",
  overlayBg: "#007acc",
  overlayOpacity: "0.3",
  iconLeftMargin: "10px",
  iconRightMargin: "20px",
  iconRightOpacity: "0.3",
});
```

## Layout Persistence

```typescript
// Save
localStorage.setItem("dock-layout", dock.saveJSON());

// Restore
const saved = localStorage.getItem("dock-layout");
if (saved) dock.loadJSON(container, saved);
```

## License

BSD-3-Clause
