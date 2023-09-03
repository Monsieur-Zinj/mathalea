<script lang="ts">
  import { exercicesParams } from "../store"

  export let nestedLevelCount: number
  export let section: string
  export let list: any
</script>

<div
  class="font-normal text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
>
  <button
    type="button"
    on:click={() => {
      console.log(list)
    }}>{section}</button
  >
</div>
