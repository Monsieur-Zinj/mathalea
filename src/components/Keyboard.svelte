<script lang='ts'>
  import { tick } from 'svelte'
  import { keyboard } from './stores/generalStore'
  import { mathaleaRenderDiv } from '../lib/mathalea'
  import type { MathfieldElement } from 'mathlive'

let divKeyboard: HTMLDivElement
function clickKeycap (event: MouseEvent) {
  if (event.target instanceof HTMLButtonElement) {
    const button = event.target
    button.classList.toggle('bg-gray-200')
    setTimeout(() => {
      button.classList.toggle('bg-gray-200')
    }, 200)
    const key = button.innerText
    const idMathField = $keyboard.idMathField
    const mf = document.querySelector('#' + idMathField) as MathfieldElement
    if (mf != null) {
      mf.focus()
      switch (key) {
        case '/':
          mf.executeCommand(['insert', '\\frac{#@}{#1}'])
          break
        default:
          mf.executeCommand(['insert', key])
          break
      }
    }
  }
}

let isVisible = false
keyboard.subscribe(async (value) => {
  isVisible = value.isVisible
  await tick()
  mathaleaRenderDiv(divKeyboard)
})

</script>
{#if isVisible}
<div bind:this={divKeyboard} class="bg-black p-4 grid md:grid-cols-3 gap-6 w-full h-[30vh] fixed bottom-0 left-0 right-0 z-[9999]">
    <div class="grid grid-cols-3 gap-2 h-full">
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$x$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$y$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$z$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$a$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$b$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$c$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$o$</button>
    </div>
    <div class="grid grid-cols-4 gap-2 h-full">
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>7</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>8</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>9</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>/</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>4</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>5</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>6</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>x</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>1</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>2</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>3</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$-$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>0</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>,</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$\pi$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$+$</button>
    </div>
    <div class="grid grid-cols-3 gap-2 h-full">
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>√</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$x^2$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>$x^n$</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>=</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>oui</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>non</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>;</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>(</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>)</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>⬅</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>➡︎</button>
        <button class="bg-gray-700 text-white py-2 px-4 text-center" on:click={clickKeycap}>❌</button>
    </div>
</div>
{/if}
