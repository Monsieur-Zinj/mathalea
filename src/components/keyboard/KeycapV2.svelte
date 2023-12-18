<script lang="ts">
  import type { MathfieldElement } from 'mathlive'
  import { keyboard } from '../stores/generalStore'
  import type { KeyCap } from './layouts/keyboardTypes'
  export let data: KeyCap
  let button: HTMLButtonElement

function clickKeycap (event: MouseEvent) {
  if (event.target instanceof HTMLButtonElement) {
    const button = event.target
    button.classList.toggle('bg-coopmaths-action-light')
    setTimeout(() => {
      button.classList.toggle('bg-coopmaths-action-light')
    }, 200)
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
  class="bg-coopmaths-canvas-dark text-coopmaths-corpus py-2 px-4 text-center"
  on:click={clickKeycap}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.key}
</button>
