<script lang="ts">
  import type { MathfieldElement } from 'mathlive'
  import { keyboardState } from '../stores/generalStore'
  import type { KeyCap } from './types/keycap'
  import { KEYCAP_WIDTH, SM_BREAKPOINT } from './layouts/keycaps'
  export let innerWidth: number
  export let data: KeyCap
  export let isSpecial: boolean = false
  let button: HTMLButtonElement
  $: keycapwidth = innerWidth <= SM_BREAKPOINT ? KEYCAP_WIDTH.sm : KEYCAP_WIDTH.md
  function clickKeycap (event: MouseEvent) {
    if (event.currentTarget instanceof HTMLButtonElement) {
      const idMathField = $keyboardState.idMathField
      const mf = document.querySelector('#' + idMathField) as MathfieldElement
      console.log({
        mf,
        idMathField,
        command: `${data.command}`,
        insert: `${data.insert}`
      })
      if (mf != null) {
        mf.focus()
        if (data.command && data.command === 'closeKeyboard') {
          keyboardState.update((value) => {
            value.isVisible = false
            value.idMathField = ''
            return value
          })
        } else if (data.command && data.command[0] !== '') {
          // @ts-expect-error : command doit être compatible avec MathLive
          mf.executeCommand(data.command)
        } else {
          console.log(data.insert)
          mf.executeCommand(['insert', data.insert || data.key])
        }
      }
    }
  }
</script>

<button
  bind:this={button}
  class="customwidth h-full flex justify-center items-center text-xs md:text-xl text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light active:text-coopmaths-canvas dark:active:text-coopmathsdark-canvas  active:bg-coopmaths-action dark:active:bg-coopmathsdark-action {isSpecial ? 'bg-coopmaths-struct-lightest dark:bg-coopmathsdark-struct-lightest' : 'bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}  py-1.5 px-2 md:py-2 md:px-4 text-center rounded-md font-mono"
  style="--keycapwidth:{keycapwidth}"
  on:click={clickKeycap}
>
  <div id="key-{data.key}" class="relative">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <span>{@html data.key}</span>
  </div>
</button>
<style>
  .customwidth {
    width: calc( var(--keycapwidth) * 1px );
  }
</style>
