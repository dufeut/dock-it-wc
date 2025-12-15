import "@lumino/widgets/style/index.css";
import "./style.css";
import MyWidget, { type RenderContext } from "./components/widget";
import { Docker } from "./docker";

const docker = new Docker({
  model: {
    CODE_EDITOR: {
      created: (widget) => console.log(`[created] ${widget.id}`),
      deleted: (widget) => console.log(`[deleted] ${widget.id}`),
    },
  },
  widgets: {
    CODE_EDITOR: (config) =>
      new MyWidget({
        id: config.id,
        label: config.label,
        icon: config.icon,
        closable: config.closable,
        kind: "CODE_EDITOR",
        render: (ctx: RenderContext) => `
          <h2>${ctx.label}</h2>
          <p>ID: ${ctx.id}</p>
          <p>Kind: ${ctx.kind}</p>
          <p>Closable: ${ctx.closable}</p>
        `,
      }),
  },
  onTabAdded: (config) => console.log(`[tab added]`, config.tab.id),
  onTabRemoved: (config) => console.log(`[tab removed]`, config.tab.id),
  tabsMovable: true,
  tabsConstrained: false,
  addButtonEnabled: false,
});

const appEl = document.getElementById("app");
if (!appEl) throw new Error("App element not found");

docker.attach(appEl);

const widgetA = docker.widget("CODE_EDITOR", {
  id: "widget-a",
  label: "Widget A",
  closable: true,
});
const widgetB = docker.widget("CODE_EDITOR", {
  id: "widget-b",
  label: "Widget B",
  icon: "fa fa-car",
  closable: true,
});
const widgetC = docker.widget("CODE_EDITOR", {
  id: "widget-c",
  label: "Widget C",
  closable: false,
});
const widgetD = docker.widget("CODE_EDITOR", {
  id: "widget-d",
  label: "Widget D",
  closable: false,
});

docker.add(widgetA);
docker.add(widgetB, { mode: "split-right", ref: widgetA });
docker.add(widgetC, { mode: "tab-after", ref: widgetB });
docker.add(widgetD, { mode: "tab-after", ref: widgetC });
docker.activate(widgetA);

const layout = docker.save();
//console.log("Layout as JSON:\n", docker.saveJSON());

// Demo: Dispose at 500ms, recreate at 3000ms
setTimeout(() => {
  console.log("\n=== HTMLElements DOCK ===");
  console.log(docker.nodes);
  console.log("\n=== DISPOSING DOCK ===");
  docker.dispose();
}, 500);

setTimeout(() => {
  console.log("\n=== RECREATING DOCK FROM JSON ===");
  docker.attach(appEl).load(layout);
  console.log("Dock recreated from JSON!");
}, 1000);

window.addEventListener("resize", () => docker.update());
