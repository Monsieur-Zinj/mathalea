<script lang="ts">
  import ButtonToggle from '../../../../shared/forms/ButtonToggle.svelte'

  export let isQuestionsShuffled: boolean
  export let updateQuestionsOrder: (isQuestionsShuffled: boolean) => void

</script>

<div class="pb-6">
  <div class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct">
    Ordre
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-ordre-questions-toggle"
      bind:value={isQuestionsShuffled}
      titles={[
        'Questions dans le désordre',
        "Questions dans l'ordre"
      ]}
      on:toggle={() => updateQuestionsOrder(isQuestionsShuffled)}
    />
  </div>
</div>
