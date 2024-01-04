<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { keyboardState } from './stores/keyboardStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import { fly } from 'svelte/transition'
  import {
    Keyboard,
    inLineBlockWidth,
    type KeyboardBlock,
    type Keys,
    type AlphanumericPages
  } from './types/keyboardContent'
  import { keyboardBlocks } from './layouts/keysBlocks'
  import KeyboardPage from './presentationalComponents/keyboardpage/KeyboardPage.svelte'
  import { SM_BREAKPOINT, GAP_BETWEEN_BLOCKS } from './lib/sizes'
  import type { KeyCap } from './types/keycap'
  import { MathfieldElement } from 'mathlive'
  import Alphanumeric from './presentationalComponents/alphanumeric/Alphanumeric.svelte'
  import { isPageKey } from './layouts/alphanumericRows'

  let innerWidth: number = 0

  const pages: KeyboardBlock[][] = []
  let currentPageIndex = 0
  let divKeyboard: HTMLDivElement
  let reduced: boolean = false
  let isVisible = false
  let pageType: AlphanumericPages = 'AlphaLow'
  let myKeyboard: Keyboard = new Keyboard()
  keyboardState.subscribe(async (value) => {
    isVisible = value.isVisible
    pageType = value.alphanumericLayout
    myKeyboard = new Keyboard()
    for (const block of value.blocks) {
      myKeyboard.add(keyboardBlocks[block])
    }
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })
  const blockList = [...myKeyboard.blocks].reverse()

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

  const clickKeycap = (key: KeyCap, event: MouseEvent, value?: Keys) => {
    if (value && isPageKey(value)) {
      // la touche est une touche du clavier alphanumeric pour changer de page
      switch (value) {
        case 'abc':
          $keyboardState.alphanumericLayout = 'AlphaLow'
          break
        case 'ABC':
          $keyboardState.alphanumericLayout = 'AlphaUp'
          break
        case 'NUM':
          $keyboardState.alphanumericLayout = 'Numeric'
          break
        default:
          $keyboardState.alphanumericLayout = 'AlphaLow'
          break
      }
    } else {
      if (event.currentTarget instanceof HTMLButtonElement) {
        const idMathField = $keyboardState.idMathField
        const mf = document.querySelector(('#' + idMathField).replace('-button', '')) as MathfieldElement
        console.log({
          mf,
          idMathField,
          command: `${key.command}`,
          insert: `${key.insert}`
        })
        if (mf != null) {
          mf.focus()
          if (key.command && key.command === 'closeKeyboard') {
            keyboardState.update((value) => {
              value.isVisible = false
              value.idMathField = ''
              return value
            })
          } else if (key.command && key.command[0] !== '') {
            // @ts-expect-error : command doit être compatible avec MathLive
            mf.executeCommand(key.command)
          } else {
            console.log(key.insert)
            mf.executeCommand(['insert', key.insert || key.display])
          }
        }
      }
    }
  }

  onMount(() => {
    computePages()
  })
</script>

<svelte:window bind:innerWidth />
{#if isVisible}
  <div
    transition:fly={{ y: '100%', opacity: 1 }}
    bind:this={divKeyboard}
    class="bg-coopmaths-struct dark:bg-coopmathsdark-struct-dark p-2 md:p-4 w-full fixed bottom-0 left-0 right-0 z-[9999]"
  >
    {#if $keyboardState.blocks.includes('alphanumeric')}
      <Alphanumeric {clickKeycap} {pageType} />
    {:else}
      {#if !reduced}
        <div class="py-2 md:py-0">
          <KeyboardPage
            blocks={[...myKeyboard.blocks].reverse()}
            isInLine={false}
            {innerWidth}
            {clickKeycap}
          />
        </div>
      {:else}
        <div class="relative px-10">
          <KeyboardPage
            blocks={pages[currentPageIndex]}
            isInLine={true}
            {innerWidth}
            {clickKeycap}
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
    {/if}
  </div>
{/if}
