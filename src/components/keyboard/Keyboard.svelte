<script lang="ts">
  import { tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import KeyboardBlock from './KeyboardBlock.svelte'
  import { fly } from 'svelte/transition'
  import { Keyboard } from './types/keyboardContent'
  import { variables } from './layouts/keyboardBlocks'

  const myKeyboard = new Keyboard().add(variables)
  // const specialKeys: KeyboardBlock = myKeyboard.blocks[0]
  let divKeyboard: HTMLDivElement
  let reducted: boolean = false

  let isVisible = false
  keyboard.subscribe(async (value) => {
    isVisible = value.isVisible
    await tick()
    mathaleaRenderDiv(divKeyboard)
  })
</script>

{#if isVisible}
  <div
    transition:fly={{ y: '100%', opacity: 1 }}
    bind:this={divKeyboard}
    class="bg-coopmaths-struct dark:bg-coopmathsdark-struct p-4 flex flex-row space-x-12 items-start justify-center w-full fixed bottom-0 left-0 right-0 z-[9999]"
  >
    {#if !reducted}
      {#each [...myKeyboard.blocks].reverse() as block}
        <KeyboardBlock {block} isInLine={reducted} />
      {/each}
    {:else}
      <KeyboardBlock block={myKeyboard.blocks[1]} isInLine={reducted} />
    {/if}
    <button
      type="button"
      class="absolute right-3 top-3 text-coopmaths-action-light"
      on:click={async () => {
        reducted = !reducted
        await tick()
        mathaleaRenderDiv(divKeyboard)
      }}
    >
      <i class="bx bx-minus" />
    </button>
  </div>
{/if}
