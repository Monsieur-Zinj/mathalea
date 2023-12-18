<script lang="ts">
  import type { MathfieldElement } from 'mathlive'
  import { keyboard } from '../stores/generalStore'

  export let insert = ''
  export let command: [string, string]|string = ['', '']
  let button: HTMLButtonElement

function clickKeycap (event: MouseEvent) {
  if (event.target instanceof HTMLButtonElement) {
    const button = event.target
    button.classList.toggle('bg-gray-200')
    setTimeout(() => {
      button.classList.toggle('bg-gray-200')
    }, 200)
    const idMathField = $keyboard.idMathField
    const mf = document.querySelector('#' + idMathField) as MathfieldElement
    console.log({ mf, idMathField, command, insert })
    if (mf != null) {
      mf.focus()
      if (command === 'closeKeyboard') {
        keyboard.update((value) => {
          value.isVisible = false
          value.idMathField = ''
          return value
        })
      } else if (command[0] !== '') {
        // @ts-expect-error : command doit être compatible avec MathLive
        mf.executeCommand(command)
      } else {
        console.log(insert)
        mf.executeCommand(['insert', insert || button.innerText])
      }
    }
  }
}
</script>

<button bind:this={button}
  class="bg-gray-700 text-white py-2 px-4 text-center"
  on:click={clickKeycap}>
  <slot></slot>
</button>
