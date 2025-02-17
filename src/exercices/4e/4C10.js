import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { texNombre } from '../../lib/outils/texNombre'
import { contraindreValeur, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import Decimal from 'decimal.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Calculer des produits et des quotients de nombres relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '23/09/2022'

export const uuid = '745ba'
export const ref = '4C10'
export const refs = {
  'fr-fr': ['4C10'],
  'fr-ch': ['10NO4-1']
}
export default function ProduitsEtQuotientRelatifs () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.sup = 1
  this.sup2 = 1
  this.nbQuestions = 10
  this.besoinFormulaireNumerique = ['Opérations', 3, '1 : Multiplication\n2 : Division\n3 : Mélange']
  this.besoinFormulaire2Numerique = ['Opérandes', 4, '1 : Entiers relatifs (quotient exact)\n2 : Un entier et un décimal (quotient décimal simple)\n3 : Rationnels\n4 : Mélange']

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.sup = contraindreValeur(1, 3, this.sup, 3)
    this.sup2 = contraindreValeur(1, 4, this.sup2, 1)
    const typesDeQuestions = []
    if (this.sup % 2 === 1) typesDeQuestions.push('multiplication')
    if (this.sup > 1) typesDeQuestions.push('division')
    const typesDeNombre = this.sup2 < 4 ? [this.sup2] : [1, 2, 3]
    const listeTypesDeQuestion = combinaisonListes(typesDeQuestions, this.nbQuestions)
    const listeTypesDeNombre = combinaisonListes(typesDeNombre, this.nbQuestions)
    const ponderation = [['-', '-'], ['-', '-'], ['-', '-'], ['-', '+'], ['+', '-'], ['-', '+'], ['+', '-'], ['+', '+']]
    for (let i = 0, texte, texteCorr, a, b, c, num1, num2, den1, den2, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const signes = choice(ponderation)
      switch (listeTypesDeNombre[i]) {
        case 1: // entiers
          a = new Decimal(randint(2, 9) * (signes[0] === '-' ? -1 : 1))
          b = new Decimal(randint(2, 9) * (signes[1] === '-' ? -1 : 1))
          break

        case 2: // un entier un décimal
          if (choice([true, false])) {
            a = new Decimal(randint(2, 9) * (signes[0] === '-' ? -1 : 1))
            b = new Decimal(randint(11, 29) * (signes[1] === '-' ? -1 : 1)).div(10)
          } else {
            a = new Decimal(randint(11, 29) * (signes[0] === '-' ? -1 : 1)).div(10)
            b = new Decimal(randint(2, 9) * (signes[1] === '-' ? -1 : 1))
          }
          break
        case 3: // rationnels
          den1 = randint(2, 9)
          num1 = randint(2, 15, [den1, 2 * den1, 3 * den1, 4 * den1, 5 * den1, 6 * den1, 7 * den1]) // on évite les fractions réductibles
          den2 = randint(2, 9)
          num2 = randint(2, 15, [den2, 2 * den2, 3 * den2, 4 * den2, 5 * den2, 6 * den2, 7 * den2]) // on évite les fractions réductibles
          a = new FractionEtendue(num1 * (signes[0] === '-' ? -1 : 1), den1)
          b = new FractionEtendue(num2 * (signes[1] === '-' ? -1 : 1), den2)
          break
      }
      switch (listeTypesDeQuestion[i]) {
        case 'multiplication':
          if (listeTypesDeNombre[i] < 3) {
            texte = `$${texNombre(a, 1)}\\times ${ecritureParentheseSiNegatif(b)} = $${ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)}`
            texteCorr = texte.split('=')[0] + ' = ' + texNombre(a.mul(b), 1) + '$'
            handleAnswers(this, i, { reponse: { value: listeTypesDeNombre[i] < 3 ? a.mul(b) : a.produitFraction(b), compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
          } else {
            texte = `$${a.texFSD}\\times ${b.texFSP} = $${ajouteChampTexteMathLive(this, i, KeyboardType.clavierFullOperations)}`
            texteCorr = texte.split('=')[0] + ' = ' + a.texProduitFraction(b, true) + '$'
            // setReponse(this, i, a.produitFraction(b), { formatInteractif: 'fractionEgale' })
            handleAnswers(this, i, { reponse: { value: a.produitFraction(b).texFraction, compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
          }
          break

        case 'division':
          if (listeTypesDeNombre[i] < 3) {
            c = a.mul(b)
            texte = `$\\dfrac{${texNombre(c, 1)}}{${texNombre(a, 1)}} = $${ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)}`
            texteCorr = texte.split('=')[0] + ' = ' + texNombre(b, 1) + '$'
            setReponse(this, i, b)
          } else {
            c = a.produitFraction(b)
            texte = `$\\dfrac{${c.texFraction}}{${a.texFraction}} = $${ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)}`
            texteCorr = texte.split('=')[0]
            b = c.produitFraction(a.inverse())
            texteCorr += ` = ${c.texProduitFraction(a.inverse(), true)}$`
            setReponse(this, i, b.simplifie(), { formatInteractif: 'fractionEgale' })
          }
          break
      }
      // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
      const textCorrSplit = texteCorr.split('=')
      let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
      aRemplacer = aRemplacer.replace('$', '')

      texteCorr = ''
      for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
        texteCorr += textCorrSplit[ee] + '='
      }
      texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`
      // Fin de cette uniformisation

      if (this.questionJamaisPosee(i, a, b, listeTypesDeQuestion[i])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
