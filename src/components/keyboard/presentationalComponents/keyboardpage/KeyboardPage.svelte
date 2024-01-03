<script lang="ts">
  import Block from './keyboardblock/KeyboardBlock.svelte'
  import type { KeyboardBlock } from '../../types/keyboardContent'
  import { GAP_BETWEEN_BLOCKS, SM_BREAKPOINT } from '../../lib/sizes'

  export let innerWidth: number
  export let blocks: KeyboardBlock[]
  export let isInLine: boolean
  $: blockgapsize =
    innerWidth <= SM_BREAKPOINT ? GAP_BETWEEN_BLOCKS.sm : GAP_BETWEEN_BLOCKS.md
</script>

<div
  class="bg-coopmaths-struct dark:bg-coopmathsdark-struct-dark flex flex-row blockgap items-start justify-center w-full"
  style="--blockgapsize:{blockgapsize}"
>
  {#each blocks as block}
    <Block {block} {isInLine} {innerWidth} />
  {/each}
</div>

<style>
  .blockgap {
    column-gap: calc(var(--blockgapsize) * 1px);
  }
</style>
