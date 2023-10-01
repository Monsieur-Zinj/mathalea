<script lang="ts">
  import { getRecentExercices, buildReferentiel, getAllExercises } from '../components/utils/refUtils'
  import { type JSONReferentielObject, type ResourceAndItsPath } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { AtLeastOneOfCriteria, MultiCriteria, featuresCriteria, levelCriterion, tagCriterion } from '../lib/types/filters'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  // const recents = getRecentExercices(baseReferentiel)
  const all = getAllExercises(baseReferentiel)
  // console.log('amc')
  // const amcSpec = featuresCriteria(['amc'])
  // console.log(buildReferentiel(amcSpec.meetCriterion(all)))
  console.log('sixieme')
  const sixieme = levelCriterion('6e', false)
  const troisieme = levelCriterion('3e', false)
  const quatrieme = levelCriterion('4e', true)
  const can = levelCriterion('CAN', false)
  const union = new AtLeastOneOfCriteria([sixieme, troisieme, quatrieme, can])
  console.log(buildReferentiel(union.meetCriterion(all)))
  const pythagore = tagCriterion('pythagore')
  const thales = tagCriterion('thalès')
  const pytTha = new MultiCriteria<ResourceAndItsPath>()
  pytTha.addCriterion(pythagore).addCriterion(thales)
  console.log('pythagore+thales')
  console.log(buildReferentiel(pytTha.meetCriterion(all)))
  const pytOuTha = new AtLeastOneOfCriteria<ResourceAndItsPath>([pythagore, thales])
  console.log('pythagore OU thales')
  console.log(buildReferentiel(pytOuTha.meetCriterion(all)))
</script>

<h1>Tests</h1>
