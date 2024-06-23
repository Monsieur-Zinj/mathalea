<script lang="ts">
  import FullscreenButton from '../../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'

  export let goToOverview: () => void

</script>

<div class="flex flex-row justify-start items-center pb-6">
  <div
    class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct"
  >
    Aperçu
    <div class="flex flex-row px-4 justify-start">
      <div
        class="tooltip tooltip-bottom tooltip-neutral"
        data-tip="Aperçu des questions/réponses"
      >
        <button
          type="button"
          id="diaporama-apercu"
          class="mr-4 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
          on:click={goToOverview}
        >
          <i class="bx text-2xl bx-detail" />
        </button>
      </div>
    </div>
  </div>
  <FullscreenButton/>
</div>
