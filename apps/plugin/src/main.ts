import "./app.pcss";
import "@logseq/libs";
import App from "./App.svelte";
import { SETTINGS_SCHEMA } from "./libs/settings";

const main = async () => {
  new App({
    target: document.getElementById("app"),
  });

  logseq.useSettingsSchema(SETTINGS_SCHEMA);

  const createModel = () => ({
    show: () => {
      console.log("showing");
      logseq.showMainUI();
    },
  });

  logseq.provideModel(createModel());

  logseq.App.registerUIItem("toolbar", {
    key: "slipbox",
    template: `<a data-on-click="show" id="slipbox" class="button">
      <img src="https://raw.githubusercontent.com/phildenhoff/logseq-slipbox/main/apps/plugin/public/logo.png" width="24" height="24" />
    </a>`,
  });
};

logseq.ready(main).catch(console.error);
