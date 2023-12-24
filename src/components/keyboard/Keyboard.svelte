<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import { fly } from 'svelte/transition'
  import { Keyboard } from './types/keyboardContent'
  import { fullOperations, numeric, variables } from './layouts/keyboardBlocks'
  import KeyboardPage from './KeyboardPage.svelte'

  export let innerWidth: number

  const myKeyboard = new Keyboard()
  // const specialKeys: KeyboardBlock = myKeyboard.blocks[0]
  let divKeyboard: HTMLDivElement
  let reduced: boolean = false

  let isVisible = false
  keyboard.subscribe(async (value) => {
    isVisible = value.isVisible
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })
  onMount(() => {
    console.log('nb block: ' + myKeyboard.numberOfBlocks())
    console.log('nb keys: ' + myKeyboard.numberOfKeys())
    console.log('nb keys/block: ' + myKeyboard.numberOfKeysPerBlock())
    console.log(
      'nb keys(reduce): ' +
        myKeyboard
          .numberOfKeysPerBlock()
          .reduce((prev, current) => prev + current)
    )
  })
</script>

{#if isVisible}
  <div
    transition:fly={{ y: '100%', opacity: 1 }}
    bind:this={divKeyboard}
    class="bg-coopmaths-struct dark:bg-coopmathsdark-struct p-4 w-full fixed bottom-0 left-0 right-0 z-[9999]"
  >
    {#if !reduced}
      <KeyboardPage
        blocks={[...myKeyboard.blocks].reverse()}
        isInLine={false}
        {innerWidth}
      />
    {:else}
      <div class="relative px-10">
        <KeyboardPage
          blocks={[...myKeyboard.blocks].reverse()}
          isInLine={true}
          {innerWidth}
        />

      <button
      class="absolute right-0 top-0 bottom-0 m-auto text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
    >
      <i class="bx bx-chevrons-right bx-lg" />
    </button>

    <button
    class="absolute left-0 top-0 bottom-0 m-auto  text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
  >
    <i class="bx bx-chevrons-left bx-lg" />
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
