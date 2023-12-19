<script lang="ts">
  import Key from './KeycapV2.svelte'
  import { keys } from './keys/keycaps'
  import type { BlockLayout } from './types/KBContent'
  export let block: BlockLayout
  export let isSpecial: boolean = false
</script>

<div class="grid grid-cols-{block.layout.numOfCols} gap-1 md:gap-2 h-full">
  {#each Object.values(block.content) as key}
      <Key data={keys[key]} {isSpecial} />
  {/each}
</div>
