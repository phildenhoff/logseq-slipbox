<script lang="ts">
  const close = () => {
    logseq.hideMainUI();
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  id="clickOutCaptureContainer"
  class="grid"
  on:click={close}
  on:keydown={(event) => (event.key === "Escape" ? close() : () => {})}
>
  <slot />
</div>

<style>
  #clickOutCaptureContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
