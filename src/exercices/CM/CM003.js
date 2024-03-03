import { choice, combinaisonListes, creerCouples } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Tables de multiplication et de divisions'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Tables de multiplication et de divisions classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot
 * Référence CM003
 */
export const uuid = '9db38'
export const ref = 'CM003'
export const refs = {
  'fr-fr': ['CM003'],
  'fr-ch': []
}
export default function TablesMultiplicationsDivisions (
  tablesParDefaut = '2-3-4-5-6-7-8-9'
) {
  // Multiplier ou diviser deux nombres
  Exercice.call(this)
  this.sup = tablesParDefaut
  this.sup2 = 1 // classique|a_trous|melange
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    if (!this.sup) {
      // Si aucune table n'est saisie
      this.sup = '2-3-4-5-6-7-8-9'
    }
    const tables = gestionnaireFormulaireTexte({
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      defaut: 9,
      max: 9,
      min: 2,
      enleveDoublons: true
    })
    const couples = creerCouples(
      tables,
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      this.nbQuestions
    ) // Liste tous les couples possibles (2,3)≠(3,2)
    const listeTypeDeQuestions = combinaisonListes(
      ['classique', 'a_trous'],
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const operation = combinaisonListes(['x', 'div'], this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    let typesDeQuestions
    for (let i = 0, a, b, texte, texteCorr; i < this.nbQuestions; i++) {
      a = couples[i][0]
      b = couples[i][1]
      if (parseInt(this.sup2) === 1) {
        typesDeQuestions = 'classique'
      } else if (parseInt(this.sup2) === 2) {
        typesDeQuestions = 'a_trous'
      } else {
        typesDeQuestions = listeTypeDeQuestions[i]
      }

      if (operation[i] === 'x') {
        if (typesDeQuestions === 'classique') {
          // classique
          texte = '$ ' + a + ' \\times ' + b + ' = $'
          setReponse(this, i, a * b)
          if (this.interactif) texte = `$${a} \\times ${b} = $` + ajouteChampTexteMathLive(this, i)
          texteCorr = '$ ' + a + ' \\times ' + b + ' = ' + a * b + ' $'
        } else {
          if (tables.length > 2) {
            // Si pour le premier facteur il y a plus de 2 posibilités on peut le chercher
            if (randint(1, 2) === 1) {
              texte = '$ ' + a + ' \\times \\ldots\\ldots = ' + a * b + ' $'
              if (this.interactif) texte = `$ ${a} \\times $` + ajouteChampTexteMathLive(this, i) + `$ = ${a * b} $`
            } else {
              texte = '$ \\ldots\\ldots' + ' \\times ' + b + ' = ' + a * b + ' $'
              if (this.interactif) texte = ajouteChampTexteMathLive(this, i) + `$ \\times ${b}  = ${a * b} $`
            }
            setReponse(this, i, a)
          } else {
            // Sinon on demande forcément le 2e facteur
            texte = '$ ' + a + ' \\times \\ldots\\ldots = ' + a * b + ' $'
            if (this.interactif) texte = ajouteChampTexteMathLive(this, i) + `$ \\times ${b}  = ${a * b} $`
            setReponse(this, i, b)
          }
          texteCorr = '$ ' + a + ' \\times ' + b + ' = ' + a * b + ' $'
        }
      } else {
        if (typesDeQuestions === 'classique') {
          // classique
          texte = '$ ' + a * b + ' \\div ' + b + ' =$'
          setReponse(this, i, a)
          if (this.interactif) texte = `$${a * b} \\div ${b} = $` + ajouteChampTexteMathLive(this, i)
        } else {
          // a trous
          if (choice([true, false])) {
            texte = `$ ${a * b} \\div \\ldots\\ldots = ${a}$`
            setReponse(this, i, b)
            if (this.interactif) texte = `$${a * b} \\div $` + ajouteChampTexteMathLive(this, i) + `$ = ${a}$`
          } else {
            texte = `$ \\ldots\\ldots \\div ${b}  = ${a}$`
            setReponse(this, i, a * b)
            if (this.interactif) texte = ajouteChampTexteMathLive(this, i) + `$\\div ${b} = ${a}$`
          }
        }
        texteCorr = `$ ${a * b} \\div ${b} = ${a}$`
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Choix des tables',
    'Nombres séparés par des tirets'
  ] // Texte, tooltip
  this.besoinFormulaire2Numerique = [
    'Style de questions',
    3,
    '1 : Classique\n2: À trous\n3: Mélangé'
  ]
}
