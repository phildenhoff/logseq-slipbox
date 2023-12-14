import "./app.pcss";
import "@logseq/libs";
import App from "./App.svelte";

const main = async () => {
  new App({
    target: document.getElementById("app"),
  });

  const createModel = () => ({
    show: () => {
      console.log("showing");
      logseq.showMainUI();
    },
  });

  logseq.provideModel(createModel());

  logseq.App.registerUIItem("toolbar", {
    key: "slipbox",
    template: `<a data-on-click="show" id="slipbox" class="toolbar-button" >⌘</a>`,
  });
};

logseq.ready(main).catch(console.error);
