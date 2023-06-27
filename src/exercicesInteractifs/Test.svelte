<script>
  import HeaderExercice from "../components/exercice/HeaderExercice.svelte"
  export let indiceExercice
  export let indiceLastExercice
  const headerExerciceProps = {
    title: "",
    isInteractif: false,
    settingsReady: false,
    interactifReady: false,
    randomReady: false,
    correctionReady: false,
  };
  
  let a = new Date().getSeconds()
</script>

<HeaderExercice
  {indiceExercice}
  {indiceLastExercice}
  id="spline"
  {...headerExerciceProps}
/>

<div>{a}</div>
