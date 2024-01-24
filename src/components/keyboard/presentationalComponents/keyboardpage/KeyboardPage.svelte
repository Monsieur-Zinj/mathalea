<script lang="ts">
  import Block from './keyboardblock/KeyboardBlock.svelte'
  import type { KeyboardBlock } from '../../types/keyboardContent'
  import { GAP_BETWEEN_BLOCKS, SM_BREAKPOINT } from '../../lib/sizes'
  import type { KeyCap } from '../../types/keycap'
  import KeyboardBlockPages from './keyboardblock/KeyboardBlockPages.svelte'

  export let innerWidth: number
  export let unitsBlocks: KeyboardBlock[]
  export let usualBlocks: KeyboardBlock[]
  export let page: KeyboardBlock[]
  const blocks: KeyboardBlock[] =
    unitsBlocks.length > 1 ? [...usualBlocks] : [...unitsBlocks, ...usualBlocks]
  export let clickKeycap: (data: KeyCap, event: MouseEvent) => void
  export let isInLine: boolean
  $: blockgapsize =
    innerWidth <= SM_BREAKPOINT ? GAP_BETWEEN_BLOCKS.sm : GAP_BETWEEN_BLOCKS.md
</script>

<div
  class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark flex flex-row blockgap items-start justify-center w-full"
  style="--blockgapsize:{blockgapsize}"
>
  {#if !isInLine}
    {#if unitsBlocks.length > 1}
      <KeyboardBlockPages blocksList={unitsBlocks} {isInLine} {clickKeycap} />
    {/if}

    {#each blocks as block}
      <Block {block} {isInLine} {innerWidth} {clickKeycap} />
    {/each}
  {:else}
    {#each page as block}
      <Block {block} {isInLine} {innerWidth} {clickKeycap} />
    {/each}
  {/if}
</div>

<style>
  .blockgap {
    column-gap: calc(var(--blockgapsize) * 1px);
  }
</style>
