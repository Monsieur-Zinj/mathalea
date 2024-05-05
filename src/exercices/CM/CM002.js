import { choice, combinaisonListes, creerCouples } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Tables de divisions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Tables de divisions classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot
 * Référence CM002
 */
export const uuid = '77511'
export const ref = 'CM002'
export const refs = {
  'fr-fr': ['CM002'],
  'fr-ch': []
}
export default function TablesDeDivisions (tablesParDefaut = '2-3-4-5-6-7-8-9') {
  // Diviser deux nombres
  Exercice.call(this)
  this.sup = tablesParDefaut
  this.sup2 = 1 // classique|a_trous|melange
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.sup2 = parseInt(this.sup2)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
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
    let typeDeQuestions = 'a_trous'
    for (let i = 0, cpt = 0, a, b, texte, texteCorr; i < this.nbQuestions && cpt < 50; cpt++) {
      a = couples[i][0]
      b = couples[i][1]
      if (parseInt(this.sup2) === 1) {
        typeDeQuestions = 'classique'
      } else if (parseInt(this.sup2) === 2) {
        typeDeQuestions = 'a_trous'
      } else {
        typeDeQuestions = listeTypeDeQuestions[i]
      }
      if (typeDeQuestions === 'classique') {
        // classique
        texte = '$ ' + a * b + ' \\div ' + a + ' =$'
        if (this.interactif && context.isHtml) texte = `$ ${a * b} \\div ${a} = $` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
        setReponse(this, i, b)
      } else {
        // a trous
        if (choice([true, false])) {
          texte = `$ ${a * b} \\div \\ldots\\ldots = ${b}$`
          if (this.interactif && context.isHtml) texte = `$ ${a * b} \\div $` + ajouteChampTexteMathLive(this, i, 'largeur15 inline') + `$ = ${b} $`
          setReponse(this, i, a)
        } else {
          texte = `$ \\ldots\\ldots \\div ${a}  = ${b}$`
          if (this.interactif && context.isHtml) texte = ajouteChampTexteMathLive(this, i, 'largeur15 inline') + `$ \\div ${b} = ${a} $`
          setReponse(this, i, a * b)
        }
      }
      texteCorr = `$ ${a * b} \\div ${a} = ${b}$`
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      } else {
        cpt++
      }
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
