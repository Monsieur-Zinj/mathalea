<script lang="ts">
  import { exercicesParams, bibliothequeSectionContent } from "../store"
  import { toObject } from "../utils/toObj"
  import { getContext } from "svelte"
  export let nestedLevelCount: number
  export let section: string
  export let list: any
  export let pathToThisNode: string[] = []
  const { toggleBibliothequeChoiceDialog } = getContext("bibliothequeChoiceContext")
</script>

<div
  class="font-normal text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
>
  <button
    type="button"
    on:click={() => {
      // const obj = toObject(list)
      let content = []
      list.forEach((value) => {
        content.push(toObject(value))
      })
      $bibliothequeSectionContent = [...content]
      toggleBibliothequeChoiceDialog(pathToThisNode)
    }}
  >
    {section}
  </button>
</div>
