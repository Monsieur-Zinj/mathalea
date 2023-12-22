<script lang="ts">
import Key from './Keycap.svelte'
  import { keys } from './layouts/keycaps'
  import type { KeyboardBlock } from './types/keyboardContent'
  export let block: KeyboardBlock
  export let isSpecial: boolean = false
  export let isInLine: boolean = false
</script>
{#if isInLine}
<div class="grid grid-cols-{block.keycaps.inline.length} gap-1 md:gap-2 h-full">
  {#each block.keycaps.inline as key}
      <Key data={keys[key]} {isSpecial} />
  {/each}
</div>
{:else}
<div class="grid grid-cols-{block.cols} gap-1 md:gap-2 h-full">
  {#each block.keycaps.block as key}
      <Key data={keys[key]} {isSpecial} />
  {/each}
</div>
{/if}
