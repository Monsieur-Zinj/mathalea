<script lang="ts">
  import { getRecentExercices, buildReferentiel } from '../components/utils/refUtils'
  import { type JSONReferentielObject } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { codeToLevelTitle } from './utils/referentielsUtils'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  const recents = getRecentExercices(baseReferentiel)
  console.log(recents)
  console.log(buildReferentiel(recents))
  console.log(codeToLevelTitle('6e'))
</script>

<h1>Tests</h1>
