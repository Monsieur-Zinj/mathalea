<script lang="ts">
  import { getRecentExercices, buildReferentiel, getAllExercises } from '../components/utils/refUtils'
  import { type JSONReferentielObject } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { codeToLevelTitle } from './utils/referentielsUtils'
  import { featuresCriteria } from '../lib/types/filters'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  // const recents = getRecentExercices(baseReferentiel)
  const all = getAllExercises(baseReferentiel)
  const amcSpec = featuresCriteria(['amc'])
  const filteredRef = amcSpec.meetCriterion(all)
  console.log(filteredRef)
  console.log(buildReferentiel(filteredRef))
  console.log(codeToLevelTitle('6e'))
</script>

<h1>Tests</h1>
