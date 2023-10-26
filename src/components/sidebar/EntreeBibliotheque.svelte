<script lang="ts">
  import { exercicesParams, bibliothequeSectionContent } from '../stores/generalStore'
  import { toObject } from '../utils/toObj'
  import { getContext } from 'svelte'
  export let nestedLevelCount: number
  export let section: string
  export let list: any
  export let pathToThisNode: string[] = []
  const { toggleBibliothequeChoiceDialog } = getContext(
    'bibliothequeChoiceContext'
  )
  const handleClick = () => {
    // const obj = toObject(list)
    const content = []
    list.forEach((value) => {
      content.push(toObject(value))
    })
    $bibliothequeSectionContent = [...content]
    toggleBibliothequeChoiceDialog(pathToThisNode)
  }
</script>

<div
  class="flex flex-row mr-4 items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-{nestedLevelCount *
    2}"
>
  <div
    class="flex-1 hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
    on:click={handleClick}
    on:keydown={handleClick}
    role="presentation"
  >
    <div
      class="ml-[3px] pl-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1"
    >
      <div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
        {section}
      </div>
    </div>
  </div>
</div>
