<script lang="ts">
  import { getRecentExercices, buildReferentiel, getAllExercises } from '../components/utils/refUtils'
  import { type JSONReferentielObject, type ResourceAndItsPath } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { AtLeastOneOfCriteria, MultiCriteria, featuresCriteria, levelCriterion, stringToCriteria, subjectCriterion, tagCriterion } from '../lib/types/filters'
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
  const s = 'can pythagore'
  const sToC = stringToCriteria(s)
  console.log(s)
  console.log(buildReferentiel(sToC.meetCriterion(all)))
</script>

<h1>Tests</h1>
