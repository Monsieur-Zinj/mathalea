<script lang='ts'>
  import { onMount } from 'svelte'
  import HeaderExercice from './HeaderExercice.svelte'
  import type TypeExercice from '../utils/typeExercice'
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number

  let divExercice: HTMLDivElement

  let headerExerciceProps = {
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

  $ : {
    headerExerciceProps.indiceExercice = indiceExercice
    headerExerciceProps.indiceLastExercice = indiceLastExercice
  }
  
</script>

<HeaderExercice {...headerExerciceProps}/>
<section class="m-10">
  <div bind:this={divExercice}></div>
</section>