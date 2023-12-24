<script lang="ts">
  import { onMount } from 'svelte'
import Key from './Keycap.svelte'
  import { keys, GAP_BETWEEN_KEYS } from './layouts/keycaps'
  import type { KeyboardBlock } from './types/keyboardContent'
  export let innerWidth: number
  export let block: KeyboardBlock
  export let isSpecial: boolean = false
  export let isInLine: boolean = false
  $: gapsize = innerWidth <= 768 ? GAP_BETWEEN_KEYS.sm : GAP_BETWEEN_KEYS.md
  onMount(() => {
    console.log('innerWidth: ' + innerWidth)
    console.log('gapsize: ' + gapsize)
  })
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
