<script lang="ts">
  import { getRecentExercices } from '../components/utils/refUtils'
  import { type JSONReferentielObject } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  console.log(getRecentExercices(baseReferentiel))
</script>

<h1>Tests</h1>
