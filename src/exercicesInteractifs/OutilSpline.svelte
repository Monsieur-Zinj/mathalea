<script>
  import HeaderExerciceVueProf from '../components/shared/exercice/shared/headerExerciceVueProf/HeaderExerciceVueProf.svelte'
  import { repere } from '../lib/2d/reperes.js'
  import { spline, trieNoeuds } from '../lib/mathFonctions/Spline.js'
  import { fixeBordures, mathalea2d } from '../modules/2dGeneralites'

  export const titre = 'Interpolation par splines (avec formulaire)'
    export const refs = {  
    'fr-fr': ['P022'],  
    'fr-ch': []
  }
  export const uuid = 'spline'

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
    if (trieNoeuds(noeuds)) {
      const f = spline(noeuds)
      const { xMin, xMax, yMin, yMax } = f.trouveMaxes()
      const r = repere({ xMin, xMax, yMin, yMax })
      const c = f.courbe({ repere: r, ajouteNoeuds: true })
      const objets = [r, c]
      contenu = mathalea2d(Object.assign({}, fixeBordures(objets)), objets)
    }
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

  function copy () {
    noeuds = noeuds
    navigator.clipboard.writeText(JSON.stringify(noeuds))
    alert('Noeuds copiés dans le presse-papier')
  }

  async function paste () {
    const jsonNoeuds = (await navigator.clipboard.readText()).replaceAll('x', '"x"')
      .replaceAll('y', '"y"')
      .replaceAll('deriveeGauche', '"deriveeGauche"')
      .replaceAll('deriveeDroit', '"deriveeDroit"')
      .replaceAll('isVisible', '"isVisible"')
    try {
      noeuds = JSON.parse(jsonNoeuds)
      alert('Presse-papier importé')
    } catch (e) {
      console.error(e.message)
    }
  }

  refreshCourb()
</script>

<HeaderExerciceVueProf
  {indiceExercice}
  {indiceLastExercice}
  id="spline"
  {...headerExerciceProps}
/>

<section>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
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
      ><i class="bx bx-lg bx-minus-circle"/></button
      >
      <button on:click={addNoeud}><i class="bx bx-lg bx-plus-circle"/></button>
      <button on:click={copy}><i class="bx bx-lg bx-clipboard"/></button>
      <button on:click={paste}><i class="bx bx-lg bx-download"/></button>
    </div>
  </div>

</section>
