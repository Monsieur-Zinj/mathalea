<script lang="ts">
  import ExerciceMathaleaVueEleve from './exerciceMathaleaVueEleve/ExerciceMathaleaVueEleve.svelte'
  import ExerciceMathaleaVueProf from './exerciceMathaleaVueProf/ExerciceMathaleaVueProf.svelte'
  import type TypeExercice from '../../../../exercices/Exercice'

  export let vue: ('prof' | 'eleve')
  export let exercise: TypeExercice
  export let exerciseIndex: number
  export let indiceLastExercice: number
  export let isCorrectionVisible: boolean = false

</script>

{#if vue === 'prof'}
<ExerciceMathaleaVueProf
  {exercise}
  {exerciseIndex}
  {indiceLastExercice}
  {isCorrectionVisible}
/>
{:else if vue === 'eleve'}
<ExerciceMathaleaVueEleve
  {exercise}
  {exerciseIndex}
  {indiceLastExercice}
  {isCorrectionVisible}
/>
{/if}
