import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { gestionnaireFormulaireTexte } from '../../../modules/outils.js'
import { combinaisonListesSansChangerOrdre, enleveElementBis } from '../../../lib/outils/arrayOutils'
import { setReponse } from '../../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import Exercice from '../../deprecatedExercice.js'
import uuidToUrl from '../../../json/uuidsToUrlFR.json'
import { mathaleaLoadExerciceFromUuid } from '../../../lib/mathalea'
export const titre = 'Choix aléatoires des questions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = false

/*!
 * @author Mickael Guironnet
 * Créé 12 novembre 2023
 * Exercice qui permet de charger les différentes questions du CAN 6e pour un export LATEX ou la vue PROF
 * ATTENTION : exercice avec chargement dynamique des questions.
 */
export const uuid = '315b6'
export const ref = 'can6a-Aléa'
export const refs = {
  'fr-fr': ['can6a-Aléa'],
  'fr-ch': []
}
export default function can6eAll () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.sup = 'All'
  this.lastCallback = ''
  this.debug = false

  this.log = function (str) {
    if (this.debug) console.log(str)
  }

  this.nouvelleVersionWrapper = function () {
    this.nouvelleVersion()
  }

  this.nouvelleVersion = function () {
    this.questionJamaisPosee(0, this.seed, this.sup, this.sup2, this.sup3, this.interactif, this.nbQuestions)
    if (this.lastCallback === this.listeArguments[0]) {
      // identique
      // pas de recalcul à faire
      this.log('pas de recalcul')
      return
    }
    this.lastCallback = this.listeArguments[0]
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    this.autoCorrection = []

    if (this.sup === null || this.sup === '') {
      this.sup = 'All'
    } else {
      this.sup = this.sup.toString()
    }

    this.log(this.sup)
    const qCal = this.sup.replaceAll('C', '')
    let questionsDisponiblesCalc = enleveElementBis(gestionnaireFormulaireTexte({
      saisie: qCal,
      min: 0,
      max: 47,
      defaut: 0,
      melange: 48,
      nbQuestions: 999,
      shuffle: false,
      exclus: [37, 0]
    }), 0)
    this.log('pass1:' + questionsDisponiblesCalc)

    if (questionsDisponiblesCalc.length === 0 && (this.sup.includes('C') || this.sup.includes('All'))) {
      // pas de question du type C1
      questionsDisponiblesCalc = gestionnaireFormulaireTexte({
        saisie: 48,
        min: 1,
        max: 47,
        defaut: 1,
        melange: 48,
        nbQuestions: this.nbQuestions,
        shuffle: true,
        exclus: [37]
      })
      this.log('pass2:' + questionsDisponiblesCalc)
    }

    const qGeo = this.sup.replaceAll('G', '')
    let questionsDisponiblesGeo = enleveElementBis(gestionnaireFormulaireTexte({
      saisie: qGeo,
      min: 0,
      max: 7,
      defaut: 0,
      melange: 8,
      nbQuestions: 999,
      shuffle: false
    }), 0)
    this.log('pass1:' + questionsDisponiblesGeo)
    if (questionsDisponiblesGeo.length === 0 && (this.sup.includes('G') || this.sup.includes('All'))) {
      // pas de question du type G2
      questionsDisponiblesGeo = gestionnaireFormulaireTexte({
        saisie: 8,
        min: 1,
        max: 7,
        defaut: 1,
        melange: 8,
        nbQuestions: this.nbQuestions,
        shuffle: true
      })
      this.log('pass2:' + questionsDisponiblesGeo)
    }

    const qNum = this.sup.replaceAll('N', '')
    let questionsDisponiblesNum = enleveElementBis(gestionnaireFormulaireTexte({
      saisie: qNum,
      min: 0,
      max: 17,
      defaut: 0,
      melange: 18,
      nbQuestions: 999,
      shuffle: false
    }), 0)
    this.log('pass1:' + questionsDisponiblesNum)
    if (questionsDisponiblesNum.length === 0 && (this.sup.includes('N') || this.sup.includes('All'))) {
      // pas de question du type N2
      questionsDisponiblesNum = gestionnaireFormulaireTexte({
        saisie: 18,
        min: 1,
        max: 17,
        defaut: 1,
        melange: 18,
        nbQuestions: this.nbQuestions,
        shuffle: true
      })
      this.log('pass2:' + questionsDisponiblesNum)
    }

    const qMes = this.sup.replaceAll('M', '')
    let questionsDisponiblesMes = enleveElementBis(gestionnaireFormulaireTexte({
      saisie: qMes,
      min: 0,
      max: 13,
      defaut: 0,
      melange: 14,
      nbQuestions: 999,
      shuffle: false
    }), 0)
    this.log('pass1:' + questionsDisponiblesMes)
    if (questionsDisponiblesMes.length === 0 && (this.sup.includes('M') || this.sup.includes('All'))) {
      // pas de question du type N2
      questionsDisponiblesMes = gestionnaireFormulaireTexte({
        saisie: 14,
        min: 1,
        max: 13,
        defaut: 1,
        melange: 14,
        nbQuestions: this.nbQuestions,
        shuffle: true
      })
      this.log('pass2:' + questionsDisponiblesMes)
    }

    function combineTheme () {
      const output = []
      let countA = 0
      for (let k = 0; k < arguments.length; k++) {
        countA = Math.max(arguments[k].length, countA)
      }
      for (let p = 0; p < countA; p++) {
        for (let h = 0; h < arguments.length; h++) {
          const a = arguments[h].shift()
          if (a) output.push(a)
        }
      }
      return output
    }

    if (questionsDisponiblesCalc.length === 0 && questionsDisponiblesGeo.length === 0 && questionsDisponiblesNum.length === 0 && questionsDisponiblesMes.length === 0) {
      // pas de question du type C2-G4
      questionsDisponiblesCalc[0] = '1'
      questionsDisponiblesGeo[0] = '1'
      questionsDisponiblesNum[0] = '1'
      questionsDisponiblesMes[0] = '1'
    }
    const comQuestions = combineTheme(Array.from(questionsDisponiblesCalc, (x) => 'C' + String(x).padStart(2, 0)), Array.from(questionsDisponiblesGeo, (x) => 'G' + String(x).padStart(2, 0)), Array.from(questionsDisponiblesNum, (x) => 'N' + String(x).padStart(2, 0)), Array.from(questionsDisponiblesMes, (x) => 'M' + String(x).padStart(2, 0)))

    const questionsDisponibles = combinaisonListesSansChangerOrdre(comQuestions, this.nbQuestions).slice(0, this.nbQuestions)
    this.log(questionsDisponibles)

    async function loadAllQuests (exercice, numeros) {
      const promises = []
      for (let q = 0; q < numeros.length; q++) {
        if (q === 0) {
          /** MGu
           * On est obligé car la première question (indice:0) dans HandleAnswers réinitialise : exercice.autoCorrection
           */
          await loadQuest(exercice, `can6${numeros[q]}`, q)
        } else {
          promises.push(loadQuest(exercice, `can6${numeros[q]}`, q))
        }
      }

      await Promise.all(promises)

      const updateAsyncEx = new window.Event('updateAsyncEx', {
        bubbles: true
      })
      document.dispatchEvent(updateAsyncEx)
      exercice.log('dispatched all Questions chargées')
    }

    function findUuid (fileScript) {
      const uuids = Object.entries(uuidToUrl)
      const found = uuids.find((element) => {
        const [filename, ,] = element[1].replaceAll('\\', '/').split('/').reverse()
        if (filename.split('.')[0] === fileScript) {
          return true
        }
        return false
      })
      return found[0]
    }

    async function loadQuest (exercice, fileScript, i) {
      // const uuid = refToUuid[fileScript]
      const uuid = findUuid(fileScript)
      const quest = mathaleaLoadExerciceFromUuid(uuid).then(exports => {
      // const quest =  import(fileScript).then(exports => {
        const q2 = exports // new exports.default()
        exercice.interactif ? q2.interactif = true : q2.interactif = false
        q2.numeroExercice = exercice.numeroExercice
        q2.nouvelleVersion()
        const k = i
        if (q2.listeQuestions.length === 0) {
          exercice.listeCorrections[k] = (q2.correction)
          exercice.listeCanEnonces[k] = (q2.canEnonce)
          exercice.listeCanReponsesACompleter[k] = (q2.canReponseACompleter)
          setReponse(exercice, k, q2.reponse, { formatInteractif: q2.formatInteractif } || {})
          exercice.listeQuestions[k] = (q2.question + ajouteChampTexteMathLive(exercice, k, q2.formatChampTexte || '', q2.optionsChampTexte || {}))
        } else {
          exercice.listeQuestions[k] = (q2.listeQuestions[0])
          exercice.listeCorrections[k] = (q2.listeCorrections[0])
          exercice.listeCanEnonces[k] = (q2.listeCanEnonces[0])
          exercice.listeCanReponsesACompleter[k] = (q2.listeCanReponsesACompleter[0])
          exercice.autoCorrection[k] = q2.autoCorrection[0]
          if (q2?.autoCorrection[0]?.propositions === undefined) {
            // mathlive
            // update les références HTML
            exercice.listeQuestions[k] = exercice.listeQuestions[k].replaceAll(`champTexteEx${exercice.numeroExercice}Q${0}`, `champTexteEx${exercice.numeroExercice}Q${k}`)
            exercice.listeQuestions[k] = exercice.listeQuestions[k].replaceAll(`resultatCheckEx${exercice.numeroExercice}Q${0}`, `resultatCheckEx${exercice.numeroExercice}Q${k}`)
          } else {
            // qcm
            const monQcm = propositionsQcm(exercice, k) // update les références HTML
            exercice.listeCanReponsesACompleter[k] = monQcm.texte
            exercice.listeQuestions[k] = exercice.autoCorrection[k].enonce + monQcm.texte
          }
        }
        exercice.log('Question chargée' + i)
      }).catch(function (err) {
        exercice.log(err)
        exercice.listeQuestions[i] = 'Erreur de chargement:' + fileScript
      })

      exercice.log('Calling Question chargée' + i)
      return quest
    }

    loadAllQuests(this, questionsDisponibles)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      this.listeCorrections[i] = ''
      this.listeCanEnonces[i] = ''
      this.listeCanReponsesACompleter[i] = ''
      this.listeQuestions[i] = 'chargement...'
      i++
    }
    this.log('fin nouvelleVersion')
  }

  this.besoinFormulaireTexte = [
    'Type de questions', [
      'Nombres séparés\n par des tirets',
      'All : mélange',
      'C1 à C47 : can de 6C01 à 6C47',
      'G1 à G7 : can de 6G01 à 6G07',
      'M1 à M7 : can de 6M01 à 6M13',
      'N1 à N17 : can de 6N01 à 6N17',
      'C : mélange calcul',
      'G : mélange géométrie',
      'M : mélange mesure',
      'N : mélange numération'
    ].join('\n')
  ]
}
