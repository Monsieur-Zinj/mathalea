<script lang='ts'>
  import { onMount } from 'svelte'
  import HeaderExercice from './HeaderExercice.svelte'
  import type TypeExercice from '../utils/typeExercice'
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let divExercice: HTMLDivElement

  const headerExerciceProps = {
    title: exercice.titre,
    indiceExercice,
    indiceLastExercice,
    interactifReady: false,
    randomReady: true,
    settingsReady: false,
    correctionReady: false
}

  onMount(async () => {
    divExercice.appendChild(exercice.html)
  })
  
</script>

<HeaderExercice {...headerExerciceProps}}/>
<section class="m-10">
  <h1>Mon exercice en HTML</h1>
  <div bind:this={divExercice}></div>
</section>