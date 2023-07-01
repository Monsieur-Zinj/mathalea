<script>
  import { fixeBordures, mathalea2d } from '../modules/2dGeneralites'
  import HeaderExercice from '../components/exercice/HeaderExercice.svelte'
  import { repere } from '../modules/2d'
  import { spline } from '../modules/mathFonctions/Spline.js'
  export let indiceExercice
  export let indiceLastExercice
  const headerExerciceProps = {
    title: '',
    isInteractif: false,
    settingsReady: false,
    interactifReady: false,
    randomReady: false,
    correctionReady: false
  }
  let noeuds = [
    { x: -3, y: -2, deriveeGauche: 2, deriveeDroit: 2, isVisible: true },
    { x: -1, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 1, y: -3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 3, y: 4, deriveeGauche: 1, deriveeDroit: 1, isVisible: true }
  ]

  let contenu = ''
  function refreshCourb () {
    const f = spline(noeuds)
    const { xMin, xMax, yMin, yMax } = f.trouveMaxes()
    const r = repere({ xMin, xMax, yMin, yMax })
    const c = f.courbe({ repere: r, ajouteNoeuds: true })
    const objets = [r, c]
    contenu = mathalea2d(Object.assign({}, fixeBordures(objets)), objets)
  }

  function removeNoeud () {
    if (noeuds.length < 4) return
    noeuds.pop()
    noeuds = noeuds
    refreshCourb()
  }

  function addNoeud () {
    noeuds.push({
      x: noeuds.at(-1).x + 1,
      y: noeuds.at(-1).y,
      deriveeGauche: 0,
      deriveeDroit: 0,
      isVisible: true
    })
    noeuds = noeuds
    refreshCourb()
  }

  refreshCourb()
</script>

<HeaderExercice
  {indiceExercice}
  {indiceLastExercice}
  id="spline"
  {...headerExerciceProps}
/>

<section>
  <div class="grid grid-cols-2 gap-4">
    <div>
      {@html contenu}
    </div>
    <div class="my-10 grid grid-cols-5 gap-4 text-center">
      <div>x</div>
      <div>y</div>
      <div>Dérivée à gauche</div>
      <div>Dérivée à droite</div>
      <div class="text-left">Visible ?</div>
      {#each noeuds as { x, y, deriveeGauche, deriveeDroit, isVisible }}
        <input
          type="number"
          bind:value={x}
          min={-10}
          max={10}
          step={0.1}
          on:change={refreshCourb}
        />
        <input
          type="number"
          bind:value={y}
          min={-10}
          max={10}
          step={0.1}
          on:change={refreshCourb}
        />
        <input
          type="number"
          bind:value={deriveeGauche}
          min={-10}
          max={10}
          step={0.1}
          on:change={refreshCourb}
        />
        <input
          type="number"
          bind:value={deriveeDroit}
          min={-10}
          max={10}
          step={0.1}
          on:change={refreshCourb}
        />
        <input
          type="checkbox"
          bind:checked={isVisible}
          on:change={refreshCourb}
        />
      {/each}
      <button on:click={removeNoeud}
        ><i class="bx bx-lg bx-minus-circle" /></button
      >
      <button on:click={addNoeud}><i class="bx bx-lg bx-plus-circle" /></button>
    </div>
  </div>
</section>
