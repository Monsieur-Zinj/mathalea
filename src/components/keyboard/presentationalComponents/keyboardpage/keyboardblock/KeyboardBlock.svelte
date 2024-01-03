<script lang="ts">
import Key from './keyboardcap/Keycap.svelte'
  import { GAP_BETWEEN_KEYS, SM_BREAKPOINT } from '../../../lib/sizes'
  import type { KeyboardBlock } from '../../../types/keyboardContent'
  import { keys } from '../../../lib/keycaps'
  export let innerWidth: number
  export let block: KeyboardBlock
  export let isSpecial: boolean = false
  export let isInLine: boolean = false

  $: gapsize = innerWidth <= SM_BREAKPOINT ? GAP_BETWEEN_KEYS.sm : GAP_BETWEEN_KEYS.md
</script>
{#if isInLine}
<div class="grid grid-cols-{block.keycaps.inline.length} customgap h-full" style="--gapsize:{gapsize};">
  {#each block.keycaps.inline as key}
      <Key data={keys[key]} {isSpecial} {innerWidth} />
  {/each}
</div>
{:else}
<div class="grid grid-cols-{block.cols} customgap h-full" style="--gapsize:{gapsize};">
  {#each block.keycaps.block as key}
      <Key data={keys[key]} {isSpecial} {innerWidth}/>
  {/each}
</div>
{/if}
<style>
  .customgap {
    gap: calc( var(--gapsize) * 1px );
  }
</style>
