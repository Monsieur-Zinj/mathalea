<script lang="ts">
  import Key from './keycap/Keycap.svelte'
  import { GAP_BETWEEN_KEYS, SM_BREAKPOINT, getMode } from '../../../lib/sizes'
  import type { KeyboardBlock } from '../../../types/keyboardContent'
  import { keys } from '../../../lib/keycaps'
  import { type KeyCap, isSpecialKey } from '../../../types/keycap'
  export let innerWidth: number
  export let block: KeyboardBlock
  export let isInLine: boolean = false
  export let clickKeycap: (data: KeyCap, event: MouseEvent) => void

  $: gapsize = GAP_BETWEEN_KEYS[getMode(innerWidth, isInLine)]

</script>

{#if block !== undefined}
<div id='kb-block-{block.title.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(' ', '-')}'>
  {#if isInLine}
    <div
      class="grid grid-cols-{block.keycaps.inline.length} customgap h-full"
      style="--gapsize:{gapsize};"
    >
      {#each block.keycaps.inline as key}
        <Key keyName={key} key={keys[key]} isSpecial={isSpecialKey(key)} {isInLine} {innerWidth} {clickKeycap} />
      {/each}
    </div>
  {:else}
    <div
      class="grid grid-cols-{block.cols} customgap h-full"
      style="--gapsize:{gapsize};"
    >
      {#each block.keycaps.block as key}
        <Key keyName={key} key={keys[key]} isSpecial={isSpecialKey(key)} {isInLine} {innerWidth} {clickKeycap} />
      {/each}
    </div>
  {/if}
</div>

{/if}

<style>
  .customgap {
    gap: calc(var(--gapsize) * 1px);
  }
</style>
