<script lang="ts">
  export let isBackToTopButtonVisible = false
  export let backToTop: () => void

</script>

{#if isBackToTopButtonVisible}
  <button
    on:click={backToTop}
    type="button"
    data-te-ripple-init
    data-te-ripple-color="light"
    class="!fixed bottom-5 right-5 rounded-full bg-transparent p-3 text-xl font-medium uppercase leading-tight text-coopmaths-action shadow-md transition duration-150 ease-in-out hover:text-coopmaths-action-lightest hover:shadow-lg focus:text-coopmaths-action-lightest focus:shadow-lg focus:outline-none focus:ring-0 active:text-coopmaths-action-lightest active:shadow-lg"
    id="btn-back-to-top"
  >
    <i class="bx bx-chevrons-up" />
  </button>
{/if}
