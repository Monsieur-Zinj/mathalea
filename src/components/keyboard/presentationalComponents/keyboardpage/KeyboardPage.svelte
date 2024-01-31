<script lang="ts">
  import BlockOfKeyCaps from './keyboardblock/BlockOfKeycaps.svelte'
  import type { KeyboardBlock } from '../../types/keyboardContent'
  import { GAP_BETWEEN_BLOCKS, SM_BREAKPOINT } from '../../lib/sizes'
  import type { KeyCap } from '../../types/keycap'
  import BlockOfKeycapsWithPagination from './keyboardblock/BlockOfKeycapsWithPagination.svelte'

  export let innerWidth: number
  export let unitsBlocks: KeyboardBlock[]
  export let usualBlocks: KeyboardBlock[]
  export let page: KeyboardBlock[]
  const blocks: KeyboardBlock[] =
    unitsBlocks.length > 1 ? [...usualBlocks] : [...unitsBlocks, ...usualBlocks]
  export let clickKeycap: (data: KeyCap, event: MouseEvent) => void
  export let isInLine: boolean
  // // $: blocksToBeDisplayed = isInLine ? [...page] : [...blocks]
  $: blockgapsize =
    innerWidth <= SM_BREAKPOINT ? GAP_BETWEEN_BLOCKS.sm : GAP_BETWEEN_BLOCKS.md
</script>

<div
  class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark flex flex-row blockgap items-center justify-center w-full"
  style="--blockgapsize:{blockgapsize}"
>
  {#if isInLine}
    <div id="kb-page" class="flex flex-row blockgap items-start justify-center">
      {#each page as block}
        <BlockOfKeyCaps {block} {isInLine} {innerWidth} {clickKeycap} />
      {/each}
    </div>
  {:else}
    <div class={unitsBlocks.length > 1 && !isInLine ? 'flex' : 'hidden'}>
      <BlockOfKeycapsWithPagination
        blocksList={unitsBlocks}
        {isInLine}
        {clickKeycap}
      />
    </div>
    <div
      id="kb-block"
      class="flex flex-row blockgap items-start justify-center"
    >
      {#each blocks as block}
        <BlockOfKeyCaps {block} {isInLine} {innerWidth} {clickKeycap} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .blockgap {
    column-gap: calc(var(--blockgapsize) * 1px);
  }
</style>
