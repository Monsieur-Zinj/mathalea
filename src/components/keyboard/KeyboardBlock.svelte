<script lang="ts">
  import Key from './Keycap.svelte'
  import { keys } from './layouts/keycaps'
  import type { BlockLayout } from './types/keyboardContent'
  export let block: BlockLayout
  export let isSpecial: boolean = false
</script>

<div class="grid grid-cols-{block.layout.numOfCols} gap-1 md:gap-2 h-full">
  {#each Object.values(block.content) as key}
      <Key data={keys[key]} {isSpecial} />
  {/each}
</div>
