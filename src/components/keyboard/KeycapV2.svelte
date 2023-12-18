<script lang="ts">
  import type { MathfieldElement } from 'mathlive'
  import { keyboard } from '../stores/generalStore'
  import type { KeyCap } from './layouts/keyboardTypes'
  export let data: KeyCap
  let button: HTMLButtonElement

function clickKeycap (event: MouseEvent) {
  if (event.target instanceof HTMLButtonElement) {
    const idMathField = $keyboard.idMathField
    const mf = document.querySelector('#' + idMathField) as MathfieldElement
    console.log({ mf, idMathField, command: `${data.command}`, insert: `${data.insert}` })
    if (mf != null) {
      mf.focus()
      if (data.command && data.command === 'closeKeyboard') {
        keyboard.update((value) => {
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

<button bind:this={button}
  class="w-full h-full flex justify-center items-center text-coopmaths-corpus-light active:text-coopmaths-canvas bg-coopmaths-canvas-darkest active:bg-coopmaths-action border border-coopmaths-action py-2 px-4 text-center rounded-md"
  on:click={clickKeycap}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <div>{@html data.key}</div>
</button>
