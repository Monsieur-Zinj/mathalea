<script lang='ts'>
  import { tick } from 'svelte'
  import { keyboard } from '../stores/generalStore'
  import { mathaleaRenderDiv } from '../../lib/mathalea'
  import Keycap from './Keycap.svelte'

let divKeyboard: HTMLDivElement

let isVisible = false
keyboard.subscribe(async (value) => {
  isVisible = value.isVisible
  await tick()
  mathaleaRenderDiv(divKeyboard)
})

</script>
{#if isVisible}
<!-- Espace vertical ajouté aux exercices pour que le clavier ne cache pas le dernier exercice
    Cela fonctionne avec Eleve.svelte mais pas Start.svelte
-->
<div class='h-[30vh]'>
  <div bind:this={divKeyboard} class="bg-black p-4 grid md:grid-cols-3 gap-6 w-full h-[30vh] fixed bottom-0 left-0 right-0 z-[9999]">
    <div class="grid grid-cols-3 gap-2 h-full">
        <Keycap>x</Keycap>
        <Keycap>y</Keycap>
        <Keycap>z</Keycap>
        <Keycap>a</Keycap>
        <Keycap>b</Keycap>
        <Keycap>c</Keycap>
    </div>
    <div class="grid grid-cols-4 gap-2 h-full">
        <Keycap>7</Keycap>
        <Keycap>8</Keycap>
        <Keycap>9</Keycap>
        <Keycap insert={'\\frac{#@}{#1}'}>/</Keycap>
        <Keycap>4</Keycap>
        <Keycap>5</Keycap>
        <Keycap>6</Keycap>
        <Keycap insert={'\\times'}>$\times$</Keycap>
        <Keycap>1</Keycap>
        <Keycap>2</Keycap>
        <Keycap>3</Keycap>
        <Keycap insert={'-'}>－</Keycap>
        <Keycap>0</Keycap>
        <Keycap>,</Keycap>
        <Keycap insert={'\\pi'}>π</Keycap>
        <Keycap insert={'+'}>+</Keycap>
    </div>
    <div class="grid grid-cols-3 gap-2 h-full">
        <Keycap insert={'\\sqrt{#@}'}>√</Keycap>
        <Keycap insert={'^2'}>²</Keycap>
        <Keycap insert={'#@^{#0}'}>x^n</Keycap>
        <Keycap>=</Keycap>
        <Keycap>oui</Keycap>
        <Keycap>non</Keycap>
        <Keycap command={['performWithFeedback', 'deleteBackward']}>&#x232b;</Keycap>
        <Keycap insert={'\\lparen'}>(</Keycap>
        <Keycap insert={'\\rparen'}>)</Keycap>
        <Keycap command={['performWithFeedback', 'moveToPreviousChar']}>⬅</Keycap>
        <Keycap command={['performWithFeedback', 'moveToNextChar']}>➡︎</Keycap>
        <Keycap command={'closeKeyboard'}>❌</Keycap>
    </div>
</div>
</div>

{/if}
