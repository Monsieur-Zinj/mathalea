<script>
    import Exercice from '../exercices/Exercice.ts'
    import HeaderExerciceVueProf from '../components/shared/exercice/shared/headerExerciceVueProf/HeaderExerciceVueProf.svelte'
    import { ajouteChampTexteMathLive } from '../lib/interactif/questionMathLive'
    import { loadMathLive } from '../modules/loaders'
    import { afterUpdate } from 'svelte'
    import { KeyboardType, convertToKeyboardCategory, convertKeyboardTypeToBlocks } from '../lib/interactif/claviers/keyboard'

    export let indiceExercice
    export let indiceLastExercice

    export const titre = 'Test du clavier'
   // Cette ressource n'a pas d'uuid ou de ref
   // Son accès est défini dans uuidsRessources.json

    const headerExerciceProps = {
      title: '',
      isInteractif: false,
      settingsReady: false,
      interactifReady: false,
      randomReady: false,
      correctionReady: false
    }

    const exercice = new Exercice()
    exercice.id = 'clavierTest'
    exercice.numeroExercice = indiceExercice
    exercice.interactif = true
    const claviers = Object.values(KeyboardType)
    let clavierSelected = KeyboardType.clavierFullOperations

    afterUpdate(() => {
      loadMathLive()
    })
  </script>

  <HeaderExerciceVueProf
    {indiceExercice}
    {indiceLastExercice}
    id="clavier"
    {...headerExerciceProps}
  />

  <br>
  Les types de clavier:
  <select bind:value={clavierSelected}>
      {#each claviers as clavier}
          <option value={clavier}>
              {clavier}
          </option>
      {/each}
  </select>

  <br>Nombre de blocs de touches :  {convertKeyboardTypeToBlocks(convertToKeyboardCategory(clavierSelected)).length}
  <br>Liste de blocs : {convertKeyboardTypeToBlocks(convertToKeyboardCategory(clavierSelected)).join('; ')}

  <br><br>
  Exemple:
  <br><br><pre>ajouteChampTexteMathLive(exercice, i, KeyboardType.{clavierSelected}) </pre>
  <br><br>Et le résultat:
  <div>{@html ajouteChampTexteMathLive(exercice, 0, convertToKeyboardCategory(clavierSelected))}</div>
