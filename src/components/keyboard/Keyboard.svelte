<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { keyboardState } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import { fly } from 'svelte/transition'
  import {
    Keyboard,
    inLineBlockWidth,
    type KeyboardBlock
  } from './types/keyboardContent'
  import {
    fullOperations,
    numbers,
    variables,
    greek,

    trigo

  } from './layouts/keyboardBlocks'
  import KeyboardPage from './KeyboardPage.svelte'
  import { SM_BREAKPOINT, GAP_BETWEEN_BLOCKS } from './layouts/keycaps'

  let innerWidth: number = 0

  const myKeyboard = new Keyboard(fullOperations)
    .add(trigo)
    .add(numbers)
    .add(variables)
    .add(greek)
  const pages: KeyboardBlock[][] = []
  const blockList = [...myKeyboard.blocks].reverse()
  let currentPageIndex = 0
  let divKeyboard: HTMLDivElement
  let reduced: boolean = false

  let isVisible = false
  keyboardState.subscribe(async (value) => {
    isVisible = value.isVisible
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })

  const computePages = () => {
    pages.length = 0
    let pageWidth: number = 0
    let page: KeyboardBlock[] = []
    const mode = innerWidth < SM_BREAKPOINT ? 'sm' : 'md'
    while (blockList.length > 0) {
      const block = blockList.pop()
      pageWidth =
        pageWidth + inLineBlockWidth(block!, mode) + GAP_BETWEEN_BLOCKS[mode]
      page.push(block!)
      // console.log(
      //   'pageWidth: ' + pageWidth + ' / innerWidth * 0.7: ' + innerWidth * 0.7
      // )
      if (pageWidth > 0.7 * innerWidth) {
        pages.push(page.reverse())
        page = []
        pageWidth = 0
      }
    }
    if (page.length !== 0) {
      pages.push(page.reverse())
    }
  }

  onMount(() => {
    computePages()
  })
</script>

<svelte:window bind:innerWidth/>
{#if isVisible}
    <div
      transition:fly={{ y: '100%', opacity: 1 }}
      bind:this={divKeyboard}
      class="bg-coopmaths-struct dark:bg-coopmathsdark-struct-dark p-2 md:p-4 w-full fixed bottom-0 left-0 right-0 z-[9999]"
    >
      {#if !reduced}
        <div class="py-2 md:py-0">
          <KeyboardPage
            blocks={[...myKeyboard.blocks].reverse()}
            isInLine={false}
            {innerWidth}
          />
        </div>
      {:else}
        <div class="relative px-10">
          <KeyboardPage
            blocks={pages[currentPageIndex]}
            isInLine={true}
            {innerWidth}
          />

          <button
            class="absolute right-2 md:right-0 top-0 bottom-0 m-auto flex justify-center items-center h-8 w-8 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest disabled:text-opacity-0 dark:disabled:text-opacity-0"
            on:click={async () => {
              if (currentPageIndex !== 0) {
                currentPageIndex--
              }
              await tick()
              mathaleaRenderDiv(divKeyboard)
            }}
            disabled={pages.length === 1 || currentPageIndex === 0}
          >
            <i class="bx bx-chevron-right bx-lg" />
          </button>

          <button
            class="absolute left-2 md:left-0 top-0 bottom-0 m-auto flex justify-center items-center h-8 w-8 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest disabled:text-opacity-0 dark:disabled:text-opacity-0"
            on:click={async () => {
              if (currentPageIndex !== pages.length - 1) {
                currentPageIndex++
              }
              await tick()
              mathaleaRenderDiv(divKeyboard)
            }}
            disabled={pages.length === 1 ||
              currentPageIndex === pages.length - 1}
          >
            <i class="bx bx-chevron-left bx-lg" />
          </button>
        </div>
      {/if}
      <button
        type="button"
        class="z-[10000] absolute right-0 top-0 h-5 w-5 rounded-sm bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action-light dark:hover:bg-coopmathsdark-action-lightest text-coopmaths-canvas dark:text-coopmaths-canvas"
        on:click={async () => {
          reduced = !reduced
          await tick()
          mathaleaRenderDiv(divKeyboard)
        }}
      >
        <i class="bx {reduced ? 'bx-plus' : 'bx-minus'}" />
      </button>
    </div>
{/if}
