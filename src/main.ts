import { Docker, Widget, setTheme } from "./bundle";
import "./style.css";

setTheme({
  panelBg: "#1e1e1e",
  tabBarBg: "#252526",
  tabBg: "#2d2d2d",
  tabBgActive: "#1e1e1e",
  tabTextColor: "#ccc",
  tabPaddingX: "8px",
  tabBarMinHeight: "30px",
  tabBarGap: "2px",
  resizerBg: "#ccc",
  resizerHv: "#00ccccff",
  overlayBg: "#007acc",
  overlayOpacity: "0.3",
  iconLeftMargin: "10px",
  iconRightMargin: "20px",
  iconRightOpacity: "0.1",
});

Widget.icons = {
  close: { text: "✕", fontSize: "20px", marginTop: "0" }, // × X ✕
  dirty: { text: "◉", fontSize: "24px", marginTop: "2px" }, // ● ◉
};

Widget.handlers = {
  onClose: ({ close }) => {
    close(); // Just close
  },
  onDirtyClose: ({ widgetId, close }) => {
    // Show confirm dialog for dirty tabs
    if (confirm(`"${widgetId}" has unsaved changes. Close anyway?`)) {
      close();
    }
  },
};

const dock = new Docker({
  widgets: {
    editor: (cfg) => ({
      ...cfg,
      render: (ctx: any) =>
        `<div style="padding: 20px; color: #ccc;"><h2>${ctx.label}</h2></div>`,
    }),
  },
  onTabAdded: (config) => console.log("[tab added]", config.view?.id),
  onTabRemoved: (config) => console.log("[tab removed]", config.view?.id),
});

// Create widgets
const widget1 = dock.widget("editor", {
  id: "file-1",
  label: "index.js",
  icon: "fa fa-car",
});
const widget2 = dock.widget("editor", {
  id: "file-2",
  label: "style.css",
});
const widget3 = dock.widget("editor", {
  id: "file-3",
  label: "index.html",
  closable: false,
});

// Attach to DOM
const container = document.getElementById("dock");
dock.attach(container);

// Add widgets
dock.add(widget1);
dock.add(widget2, { mode: "split-right", ref: widget1 });
dock.add(widget3, { mode: "tab-after", ref: widget2 });

// Handle resize
window.addEventListener("resize", () => dock.update());

console.log("Docker initialized!", dock);

setTimeout(() => {
  Widget.setDirty("file-1", true);
}, 1000);

/*
// Save
localStorage.setItem("dock-layout", dock.saveJSON());
dock.dispose();
// Restore
setTimeout(() => {
  const saved = localStorage.getItem("dock-layout");
  if (saved) dock.loadJSON(container, saved);
}, 3000);
*/
