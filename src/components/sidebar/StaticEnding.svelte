<script lang="ts">
  import type { JSONReferentielObject } from '../../lib/types/referentiels'
  import { bibliothequeDisplayedContent, bibliothequePathToSection, isModalForStaticsVisible } from '../store'

  export let pathToThisNode: string[] = []
  export let nestedLevelCount: number
  export let referentielToDisplay: JSONReferentielObject
  export let isEmpty: boolean = false
  const handleClick = () => {
    console.log(pathToThisNode)
    console.log(referentielToDisplay)
    $bibliothequeDisplayedContent = { ...referentielToDisplay }
    $isModalForStaticsVisible = true
    $bibliothequePathToSection = [...pathToThisNode]
  }
</script>

<div
  class="flex flex-row mr-4 items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  style="padding-left: {(nestedLevelCount * 2) / 6}rem"
>
  <button
    type="button"
    disabled={isEmpty}
    class="flex-1 hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest {isEmpty
      ? ''
      : 'cursor-pointer'}"
    on:click={handleClick}
    on:keydown={handleClick}
  >
    <div
      class="ml-[3px] pl-2 pr-4 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1"
    >
      <div
        class="text-start {isEmpty
          ? 'text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest'
          : 'text-coopmaths-corpus dark:text-coopmathsdark-corpus'}"
      >
        {pathToThisNode[pathToThisNode.length - 1]}
      </div>
    </div>
  </button>
</div>
