import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { format } from 'mathjs'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import Decimal from 'decimal.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Donner l\'écriture décimale ou la fraction décimale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '28/09/22'

/**
 * On donne une fraction qui a pour dénominateur 10, 100 ou 1 000, il faut donner l'écriture décimale.
 * ou réciproquement
 * Le numérateur est de la forme X, XX, X0X, X00X ou XXX
 * @author Mickael Guironet
 */
export const ref = '6N23-8'
export const refs = {
  'fr-fr': ['6N23-8'],
  'fr-ch': ['9NO10-10']
}
export const uuid = '708a9'
export default function ExerciceEcritureDecimaleOuFractionDecimale () {
  Exercice.call(this)
  this.consigne = "Donner l'écriture décimale ou la fraction décimale."
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 8
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = '1-2' // Type de question
  this.sup2 = true
  this.sup3 = true

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 2,
      defaut: 3,
      melange: 3,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    const consi = [false, false]
    for (let i = 0, a, b, n, typesDeQuestions, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = choice(
        [
          randint(2, 9),
          randint(11, 99),
          randint(1, 9) * 100 + randint(1, 9),
          randint(1, 9) * 1000 + randint(1, 9),
          randint(1, 9) * 100 + randint(1, 9) * 10
        ])
      // X, XX, X0X, X00X, XX0
      b = [10, 100, 1000, 10, 100][i % 5]
      const aDecimal = new Decimal(a)
      const bDecimal = new Decimal(b)
      n = aDecimal.div(bDecimal).toNumber()

      switch (typesDeQuestions) {
        case 2: // fraction décimale -> écriture décimale
          consi[1] = true
          handleAnswers(this, i, { reponse: { value: texNombre(n, 3), compare: fonctionComparaison } })
          texte = `$${texFraction(String(a), String(b))}  ${(!this.interactif ? '=\\ldots\\ldots\\ldots\\ldots' : '=')} $` + ajouteChampTexteMathLive(this, i, 'largeur01 inline')
          texteCorr = '$ ' + texFraction(String(a), String(b)) + ' = ' + texNombre(n, 3) + ' $'
          this.autoCorrection[i].reponse.param.digits = 5
          this.autoCorrection[i].reponse.param.decimals = 3
          break
        case 1: { // / écriture décimale -> fraction décimale
          consi[0] = true
          const nombre = format(n, {
            notation: 'auto',
            lowerExp: -12,
            upperExp: 12,
            precision: 12
          }).replace('.', ',')
          const rangVirgule = nombre.indexOf(',')
          let nbdigits = 0
          if (rangVirgule !== -1) {
            nbdigits = nombre.length - rangVirgule - 1
          }
          let precision = nbdigits
          if (nbdigits === 2 && b === 100) {
            precision = 3
          } else if (nbdigits === 1 && b === 10) {
            precision = randint(2, 3)
          }
          handleAnswers(this, i, {
            bareme: (listePoints) => [listePoints[0], 1],
            champ1: { value: String(a) }
          },
          { formatInteractif: 'mathlive' }
          )

          if (this.interactif) {
            texte = this.sup2
              ? remplisLesBlancs(this, i, `${texNombre(n, precision, this.sup3)} = \\dfrac{%{champ1}}{$${texNombre(b)}}`, 'fillInTheBlanks')
              : ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: `$${texNombre(n, precision, this.sup3)} = $` })

            if (!this.sup2) {
              handleAnswers(this, i, { reponse: { value: n, compare: fonctionComparaison, options: { fractionDecimale: true } } })
            }
            texte += ajouteFeedback(this, i)
          } else {
            texte = `$${texNombre(n, precision, this.sup3)} = ${texFraction('\\ldots\\ldots\\ldots\\ldots', texNombre(b))} $`
          }
          texteCorr = '$ ' + texNombre(n) + ' = ' + texFraction(texNombre(a), texNombre(b)) + ' $'
          this.autoCorrection[i].reponse.param.digits = 6
          this.autoCorrection[i].reponse.param.decimals = 0
          break
        }
      }
      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    if (consi[0] === true && consi[1] === true) {
      this.consigne = 'Donner l\'écriture décimale ou la fraction décimale.'
    } else if (consi[0] === false && consi[1] === true) {
      this.consigne = 'Donner l\'écriture décimale'
    } else {
      this.consigne = 'Donner la fraction décimale'
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : Ecriture décimale -> fraction décimale',
      '2 : Fraction décimale -> écriture décimale',
      '3 : Mélange'
    ].join('\n')
  ]
  this.besoinFormulaire2CaseACocher = ['Dénominateur déjà saisi']
  this.besoinFormulaire3CaseACocher = ['Avec des zéros inutiles']
}
const texFraction = (a, b) => `\\dfrac{${a}}{${b}}`
