<script lang="ts">
  import { derived, writable } from "svelte/store";
  import DialogContainer from "./components/DialogContainer.svelte";
  import type { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
  import { SETTING_ENUM } from "./libs/settings";
  const notes = writable<Array<string>>([]);
  const endpointBaseUrl = writable<string>(
    logseq.settings[SETTING_ENUM.apiUrl],
  );
  const shouldDisplayAllNotes = writable<boolean>(false);

  const apiUrl = derived(endpointBaseUrl, (endpointBaseUrl) => {
    return `${endpointBaseUrl}/api/v1/notes`;
  });

  const insertAllNotes = () => {
    fetch($apiUrl).then(async (res) => {
      (await res.json()).notes.forEach((note) => insertNote(note));
    });
  };

  const openSettings = () => {
    logseq.showSettingsUI();
  };

  const displayAllNotes = () => {
    if ($shouldDisplayAllNotes) {
      shouldDisplayAllNotes.set(false);
      return;
    }

    fetch($apiUrl + "?all").then(async (res) => {
      const allNotes = (await res.json()).notes;
      notes.set(allNotes);
      shouldDisplayAllNotes.set(true);
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

    const daysMatchTodaysDate = (await logseq.DB.datascriptQuery(`[
      :find (pull ?p [*])
      :where
      [?b :block/page ?p]
      [?p :block/journal? true]
      [?p :block/journal-day ?d]
      [(= ?d ${todaysDate})]
    ]`)) as PageEntity[][];
    const todayPage = daysMatchTodaysDate[0][0];

    logseq.Editor.insertBlock(
      todayPage.uuid,
      `${note} ${logseq.settings[SETTING_ENUM.tags]}`,
    );
  };

  logseq.onSettingsChanged((after, _before) => {
    endpointBaseUrl.set(after[SETTING_ENUM.apiUrl]);
  });
</script>

<DialogContainer>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <main
    class="mt-12 max-w-md h-min justify-self-end mr-8 p-4 rounded-md shadow-md"
    on:click|stopPropagation|preventDefault={() => undefined}
  >
    <div class="mb-4 flex justify-between items-center">
      {#if $endpointBaseUrl == ""}
        <p class="h-min mr-4">You need to setup the API →</p>
      {:else}
        <div class="flex justify-start gap-2 items-center">
          <button on:click={insertAllNotes}>Add notes from slipbox</button>
          <button on:click={displayAllNotes}>⋮</button>
        </div>
      {/if}
      <button on:click={openSettings}>⚙️</button>
    </div>

    {#if $shouldDisplayAllNotes}
      <div class="__notes_container grid gap-1 p-4 max-h-96 overflow-y-auto mb-4">
        {#each $notes as note}
          <div
            class="__note_item flex flex-row justify-between items-center p-4"
          >
            <p>{note}</p>
            <button on:click={() => insertNote(note)}>+</button>
          </div>
        {/each}
      </div>
    {/if}

    {#if $endpointBaseUrl != ""}
      <p class="diminished">
        <!-- svelte-ignore a11y-invalid-attribute -->
        Visit
        <a
          href="#"
          on:click|preventDefault={() => {
            window.open($endpointBaseUrl, "_blank");
          }}>{$endpointBaseUrl}</a
        > on your phone to add notes.
      </p>
    {/if}
  </main>
</DialogContainer>

<style>
  main {
    background-color: #0f0f14;
  }

  p.diminished {
    color: rgb(148, 148, 168);
  }

  .__notes_container {
    background-color: #1e1e2a;
  }

  .__note_item {
    background-color: #0f0f14;
  }

  @media (prefers-color-scheme: light) {
    main {
      background-color: #fff;
    }

    p.diminished {
      color: rgb(97, 97, 120);
    }

    .__note_item {
      background-color: #fff;
    }

    .__notes_container {
      background-color: #f9f9fe;
    }
  }
</style>
