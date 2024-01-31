<script lang="ts">
  import type { KeyboardBlock } from '../../../types/keyboardContent'
  import { getUniqueStringBasedOnTimeStamp } from '../../../../../lib/components/time'
  import BlockOfKeycaps from './BlockOfKeycaps.svelte'
  import { GAP_BETWEEN_BLOCKS, SM_BREAKPOINT } from '../../../lib/sizes'
  import type { KeyCap } from '../../../types/keycap'
  import { keyboardBlocks } from '../../../layouts/keysBlocks'
  export let blocksList: KeyboardBlock[] = [
    keyboardBlocks.lengths,
    keyboardBlocks.areas,
    keyboardBlocks.volumes,
    keyboardBlocks.capacities
  ]
  export let clickKeycap: (data: KeyCap, event: MouseEvent) => void
  export let isInLine: boolean
  $: blockgapsize =
    innerWidth <= SM_BREAKPOINT ? GAP_BETWEEN_BLOCKS.sm : GAP_BETWEEN_BLOCKS.md
  /**
   * Pour retirer les accents et autres bizarrerie dans les chaînes
   * @see https://stackoverflow.com/a/37511463
   * @param s chaîne à transformer
   */
  const toRegularCharacters = (s: string): string =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const possibleBlocks = [
    ...blocksList.map((b) => toRegularCharacters(b.title))
  ] as const
  $: currentBlock = possibleBlocks[0]

  const switchToBlock = (newBlock: (typeof possibleBlocks)[number]) => {
    currentBlock = newBlock
  }
</script>

<div class="flex flex-col">
  <ul
    class="mb-1 flex list-none flex-row flex-wrap border-b-0 pl-0"
    style="--blockgapsize:{blockgapsize}"
    id="keysblocknav-{getUniqueStringBasedOnTimeStamp()}"
    role="tablist"
    data-te-nav-ref
  >
    {#each blocksList as block}
      <li role="presentation">
        <button
          type="button"
          class="mb-1 block border-x-0 border-b-2 border-t-0 px-2 pb-1 text-[0.7rem] font-light leading-tight {currentBlock === toRegularCharacters(block.title) ? 'text-coopmaths-struct border-coopmaths-struct dark:text-coopmathsdark-struct dark:border-coopmathsdark-struct' : 'text-coopmaths-action dark:text-coopmathsdark-action border-transparent'}   hover:text-coopmaths-action-lightest active:border-coopmaths-struct active:text-coopmaths-struct dark:hover:bg-transparent dark:active:border-coopmathsdark-struct dark:active:text-coopmathsdark-struct"
          id="tabs-{toRegularCharacters(block.title)}-tab"
          role="tab"
          aria-controls="tabs-{toRegularCharacters(block.title)}"
          on:click={(e) => {
            e.preventDefault()
            e.stopPropagation()
            switchToBlock(toRegularCharacters(block.title))
          }}
          on:mousedown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {block.title}
        </button>
      </li>
    {/each}
  </ul>
  <!--Blocks content-->
  <div class="flex  justify-center">
    {#each blocksList as block}
      <div
        class="{currentBlock === toRegularCharacters(block.title)
          ? 'flex opacity-100'
          : 'hidden opacity-0'} transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-{toRegularCharacters(block.title)}"
        role="tabpanel"
        aria-labelledby="tabs-{toRegularCharacters(block.title)}-tab"
      >
        <BlockOfKeycaps {block} {isInLine} {innerWidth} {clickKeycap} />
      </div>
    {/each}
  </div>
</div>
