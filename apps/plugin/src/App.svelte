<script lang="ts">
  import { writable } from "svelte/store";
  import DialogContainer from "./components/DialogContainer.svelte";
  import type { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
  const notes = writable<Array<string>>([]);

  const endpointUrl = "https://slipbox.beardie-cloud.ts.net/api/v1/notes";

  const a = () => {
    fetch(endpointUrl).then(async (res) => {
      notes.set((await res.json()).notes);
    });
  };

  const insertNote = async (note: string) => {
    // todays date, formatted as YYYYMMDD
    const todaysDate = new Date()
      .toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/-/g, "");

    console.log(todaysDate);
    const daysMatchTodaysDate = (await logseq.DB.datascriptQuery(`[
      :find (pull ?p [*])
      :where
      [?b :block/page ?p]
      [?p :block/journal? true]
      [?p :block/journal-day ?d]
      [(= ?d ${todaysDate})]
    ]`)) as PageEntity[][];
    console.log(daysMatchTodaysDate);
    const todayPage = daysMatchTodaysDate[0][0];

    logseq.Editor.insertBlock(todayPage.uuid, note);
  };

  notes.subscribe((next) => {
    next.forEach((note) => {
      insertNote(note);
    });
  });
</script>

<DialogContainer>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <main
    class="mt-12 bg-white max-w-md h-min justify-self-end mr-8 p-4 rounded-md shadow-md"
    on:click|stopPropagation|preventDefault={() => undefined}
  >
    <div class="mb-4">
      <button on:click={a}>Add notes from slipbox</button>
    </div>

    <p class=" text-gray-500">
      Visit <a href="https://slipbox">https://slipbox</a> on your phone to add notes.
    </p>
  </main>
</DialogContainer>

<style>
</style>
