<script lang="ts">
  import {
    getRecentExercices,
    buildReferentiel,
    getAllExercises,
    updateReferentiel
  } from '../components/utils/refUtils'
  import {
    type Features,
    type JSONReferentielObject,
    type Level,
    type ResourceAndItsPath
  } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import {
    AtLeastOneOfCriteria,
    MultiCriteria,
    levelCriterion,
    stringToCriteria,
    subjectCriterion,
    tagCriterion,
    type Criterion,
    featuresCriteria
  } from '../lib/types/filters'
  import FiltresBis from './sidebar/FiltresBis.svelte'
  import {
    getSelectedFeatures,
    getSelectedLevels,
    selectedFilters
  } from './store'
  import { onDestroy } from 'svelte'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  // const recents = getRecentExercices(baseReferentiel)
  const all = getAllExercises(baseReferentiel)
  // console.log('amc')
  // const amcSpec = featuresCriteria(['amc'])
  // console.log(buildReferentiel(amcSpec.meetCriterion(all)))
  // console.log('sixieme')
  // const sixieme = levelCriterion('6e', false)
  // const troisieme = levelCriterion('3e', false)
  // const quatrieme = levelCriterion('4e', true)
  // const can = levelCriterion('CAN', false)
  // const union = new AtLeastOneOfCriteria([sixieme, troisieme, quatrieme, can])
  // console.log(buildReferentiel(union.meetCriterion(all)))
  // const pythagore = tagCriterion('pythagore')
  // const thales = tagCriterion('thalès')
  // const pytEtTha = new MultiCriteria<ResourceAndItsPath>()
  // pytEtTha.addCriterion(pythagore).addCriterion(thales)
  // console.log('pythagore+thales')
  // console.log(buildReferentiel(pytEtTha.meetCriterion(all)))
  // const pytOuTha = new AtLeastOneOfCriteria<ResourceAndItsPath>([pythagore, thales])
  // console.log('pythagore OU thales')
  // console.log(buildReferentiel(pytOuTha.meetCriterion(all)))
  // const asie = subjectCriterion('asie')
  // console.log('asie')
  // console.log(buildReferentiel(asie.meetCriterion(all)))
  // const asieEtPyt = new MultiCriteria<ResourceAndItsPath>()
  // asieEtPyt.addCriterion(asie).addCriterion(pythagore)
  // console.log('asie+pythagore')
  // console.log(buildReferentiel(asieEtPyt.meetCriterion(all)))
  // const phrase = subjectCriterion('phrase')
  // const phraseEt6e = new MultiCriteria<ResourceAndItsPath>()
  // phraseEt6e.addCriterion(phrase).addCriterion(sixieme)
  // console.log('phrase+4e')
  // console.log(buildReferentiel(phraseEt6e.meetCriterion(all)))
  // const s = 'can pythagore'
  // const sToC = stringToCriteria(s)
  // console.log(s)
  // console.log(buildReferentiel(sToC.meetCriterion(all)))
  // console.log('test updateReferentiel')
  // console.log(updateReferentiel(baseReferentiel, false, false, ['6e', '5e']))
  // const s2 = '3e static   pythagore   thalès'
  // const s2ToC = stringToCriteria(s2)
  // console.log('avec les tags : ' + s2)
  // console.log(buildReferentiel(s2ToC.meetCriterion(all)))
  // const s3 = "'labyrinthe de multiples' 'nombres décimaux'"
  // const s3ToC = stringToCriteria(s3)
  // console.log('avec les tags : ' + s3)
  // console.log(buildReferentiel(s3ToC.meetCriterion(all)))
  // const s4 = 'CAN 6e "informations inutiles" "l\'heure"'
  // const s4ToC = stringToCriteria(s4)
  // console.log('avec les tags : ' + s4)
  // console.log(buildReferentiel(s4ToC.meetCriterion(all)))
  function applyFilters (original: ResourceAndItsPath[]): ResourceAndItsPath[] {
    // on récupère dans le store les niveaux et les fonctionnalités cochés
    const selectedLevels: Level[] = getSelectedLevels()
    const selectedSpecs: (keyof Features)[] = getSelectedFeatures()
    if (selectedLevels.length === 0 && selectedSpecs.length === 0) {
      // pas de filtre coché : on renvoie l'original
      return original
    } else {
      // on gère les niveaux cochés
      let finalLevelsCriterion: Criterion<ResourceAndItsPath> | undefined
      if (selectedLevels.length !== 0) {
        const levelsCriteria: Criterion<ResourceAndItsPath>[] = []
        for (const level of selectedLevels) {
          levelsCriteria.push(levelCriterion(level))
        }
        // au moins un niveau coché !
        if (levelsCriteria.length < 2) {
          // un seul niveau coché
          finalLevelsCriterion = levelsCriteria[0]
        } else {
          // au moins deux niveaux cochés, on fait l'UNION
          const [first, second, ...others] = [...levelsCriteria]
          finalLevelsCriterion = new AtLeastOneOfCriteria([
            first,
            second,
            ...others
          ])
        }
      }
      // on gère les fonctionnalités (AMC, interactif)
      let specsCriteria: Criterion<ResourceAndItsPath> | undefined
      if (selectedSpecs.length !== 0) {
        specsCriteria = featuresCriteria(selectedSpecs)
      }
      if (finalLevelsCriterion !== undefined) {
        if (specsCriteria !== undefined) {
          // on a des niveaux ET des fonctionnalités cochés
          return new MultiCriteria<ResourceAndItsPath>()
            .addCriterion(finalLevelsCriterion)
            .addCriterion(specsCriteria)
            .meetCriterion(original)
        } else {
          // on a que des niveaux cochés
          return finalLevelsCriterion.meetCriterion(original)
        }
      } else {
        if (specsCriteria !== undefined) {
          // on a que des fonctionnalités cocées
          specsCriteria.meetCriterion(original)
        }
      }
      return original
    }
  }
  let filteredReferentiel: ResourceAndItsPath[]
  // maj du référentiel chaque fois que le store `selectedFilters` change
  const unsubscribeToFiltersStore = selectedFilters.subscribe(() => {
    filteredReferentiel = applyFilters(all)
  })
  onDestroy(() => {
    unsubscribeToFiltersStore()
  })
</script>

<h1 class="text-4xl font-black text-coopmaths-struct mb-10">Tests</h1>
<div>
  <FiltresBis filterType="levels" />
</div>
<div class="mt-10">
  <FiltresBis filterType='specs' />
</div>
<div class="mt-10">
  <FiltresBis filterType='types' />
</div>

<ul class="mt-20">
  {#each filteredReferentiel as item}
    <li>
      {item.pathToResource.join('/')}
    </li>
  {/each}
</ul>
