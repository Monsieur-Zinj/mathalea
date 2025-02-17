<script lang="ts">
  import { tick } from 'svelte'
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
  import { GAP_BETWEEN_BLOCKS, getMode } from './lib/sizes'
  import type { KeyCap } from './types/keycap'
  import { MathfieldElement } from 'mathlive'
  import Alphanumeric from './presentationalComponents/alphanumeric/Alphanumeric.svelte'
  import { isPageKey } from './types/keycap'

  $: innerWidth = 0

  let pages: KeyboardBlock[][] = []
  let usualBlocks: KeyboardBlock[] = []
  let unitsBlocks: KeyboardBlock[] = []
  let currentPageIndex = 0
  let divKeyboard: HTMLDivElement
  let alphanumericDisplayed: boolean = false
  let isVisible = false
  let isInLine = false
  let pageType: AlphanumericPages = 'AlphaLow'
  const myKeyboard: Keyboard = new Keyboard()

  const computePages = () => {
    pages.length = 0
    let pageWidth: number = 0
    let page: KeyboardBlock[] = []
    const mode = getMode(innerWidth, true)
    const blockList = [...usualBlocks, ...unitsBlocks].reverse()
    while (blockList.length > 0) {
      const block = blockList.pop()
      const blockWidth = inLineBlockWidth(block!, mode) + GAP_BETWEEN_BLOCKS[mode]
      if (pageWidth + blockWidth > 0.8 * innerWidth) {
        // plus de places
        pages.push(page.reverse())
        page = []
        pageWidth = 0
      }
      page.push(block!)
      pageWidth = +blockWidth
    }
    if (page.length !== 0) {
      pages.push(page.reverse())
    }
  }

  keyboardState.subscribe(async (value) => {
    isVisible = value.isVisible
    isInLine = value.isInLine
    pageType = value.alphanumericLayout
    myKeyboard.empty()
    for (const block of value.blocks) {
      if (block !== 'alphanumeric') myKeyboard.add(keyboardBlocks[block])
    }
    myKeyboard.checkSmallLayoutAllowed()
    unitsBlocks.length = 0
    usualBlocks.length = 0
    for (const block of myKeyboard.blocks) {
      if (block && Object.prototype.hasOwnProperty.call(block, 'isUnits') && block.isUnits) {
        unitsBlocks.push(block)
      } else {
        usualBlocks.push(block)
      }
    }
    unitsBlocks = unitsBlocks
    usualBlocks = usualBlocks
    computePages()
    pages = pages
    if (currentPageIndex >= pages.length) currentPageIndex = 0
    alphanumericDisplayed = value.blocks.includes('alphanumeric')
    await tick()
    mathaleaRenderDiv(divKeyboard)
    // document.dispatchEvent(new window.Event('KeyboardUpdated', { bubbles: true }))
    // console.log('message envoyé: ' + 'KeyboardUpdated')
  })

  async function navRight (e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (currentPageIndex !== 0) {
      currentPageIndex--
    }
    // console.log('page à afficher n°' + currentPageIndex)
    // console.log(pages[currentPageIndex])
    await tick()
    mathaleaRenderDiv(divKeyboard)
  }

  async function navLeft (e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (currentPageIndex !== pages.length - 1) {
      currentPageIndex++
    }
    // console.log('page à afficher n°' + currentPageIndex)
    // console.log(pages[currentPageIndex])
    await tick()
    mathaleaRenderDiv(divKeyboard)
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
        const mf = document.querySelector(
          ('#' + idMathField).replace('-button', '')
        ) as MathfieldElement
        // console.log({
        //   mf,
        //   idMathField,
        //   command: `${key.command}`,
        //   insert: `${key.insert}`
        // })
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
            mf.executeCommand(['insert', key.insert || key.display])
          }
        }
      }
    }
  }
</script>

<svelte:window bind:innerWidth />
{#if isVisible}
  <div
    on:mousedown={(e) => {
      e.preventDefault()
      e.stopPropagation()
    }}
    role="none"
    transition:fly={{ y: '100%', opacity: 1 }}
    bind:this={divKeyboard}
    class=" bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark p-2 md:p-4 w-full fixed bottom-0 left-0 right-0 z-[9999] drop-shadow-[0_-3px_5px_rgba(130,130,130,0.25)] dark:drop-shadow-[0_-3px_5px_rgba(250,250,250,0.25)]"
  >
    {#if alphanumericDisplayed}
      <Alphanumeric {clickKeycap} {pageType} />
    {:else}
      <div class={isInLine ? 'relative px-10' : 'py-2 md:py-0'}>
        <KeyboardPage
          unitsBlocks={[...unitsBlocks].reverse()}
          usualBlocks={[...usualBlocks].reverse()}
          page={pages[currentPageIndex]}
          {isInLine}
          {innerWidth}
          {clickKeycap}
        />
        <!-- Boutons de navigation entre les pages : vers la DROITE -->
        <button
          id="kb-nav-right"
          class="absolute right-2 md:right-0 top-0 bottom-0 m-auto flex justify-center items-center h-8 w-8 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest disabled:text-opacity-0 dark:disabled:text-opacity-0"
          on:click={navRight}
          on:mousedown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          disabled={pages.length === 1 || currentPageIndex === 0 || !isInLine}
        >
          <i class="bx bx-chevron-right bx-lg" />
        </button>
        <!-- Boutons de navigation entre les pages : vers la GAUCHE -->
        <button
          id="kb-nav-left"
          class="absolute left-2 md:left-0 top-0 bottom-0 m-auto flex justify-center items-center h-8 w-8 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest disabled:text-opacity-0 dark:disabled:text-opacity-0"
          on:click={navLeft}
          on:mousedown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          disabled={pages.length === 1 ||
            currentPageIndex === pages.length - 1 ||
            !isInLine}
        >
          <i class="bx bx-chevron-left bx-lg" />
        </button>
      </div>
    {/if}
    <!-- Bouton de réduction du clavier -->
    <button
      id="kb-nav-reduced"
      type="button"
      class="z-[10000] absolute right-0 top-0 h-5 w-5 rounded-sm bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action-light dark:hover:bg-coopmathsdark-action-lightest text-coopmaths-canvas dark:text-coopmaths-canvas"
      on:click={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        computePages()
        $keyboardState.isInLine = !$keyboardState.isInLine
        await tick()
        mathaleaRenderDiv(divKeyboard)
      }}
      on:mousedown={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <i class="bx {isInLine ? 'bx-plus' : 'bx-minus'}" />
    </button>
    <!-- bouton de passage du clavier alphanumérique au clavier maths-->
    <button
      id="kb-nav-alpha"
      type="button"
      class="z-[10000] {$keyboardState.blocks.includes('alphanumeric')
        ? 'flex justify-center items-center'
        : 'hidden'} absolute right-0 top-6 h-5 w-5 rounded-sm bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action-light dark:hover:bg-coopmathsdark-action-lightest text-coopmaths-canvas dark:text-coopmaths-canvas"
      on:click={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        alphanumericDisplayed = !alphanumericDisplayed
        await tick()
        mathaleaRenderDiv(divKeyboard)
      }}
      on:mousedown={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <i class="bx {alphanumericDisplayed ? 'bx-math' : 'bx-font-family'}" />
    </button>
  </div>
{/if}
