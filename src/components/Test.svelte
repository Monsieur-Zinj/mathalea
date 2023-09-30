<script lang="ts">
  import { getRecentExercices, getReferentielEndings } from '../components/utils/refUtils'
  import { type JSONReferentielEnding, type JSONReferentielObject } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { codeToLevelTitle } from './utils/referentielsUtils'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  console.log(getRecentExercices(baseReferentiel))
  const exos: JSONReferentielEnding[] = []
getReferentielEndings(baseReferentiel, exos)
  console.log(exos)
  console.log(codeToLevelTitle('6e'))
</script>

<h1>Tests</h1>
