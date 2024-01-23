/* eslint-disable camelcase */
import { choice, enleveElement } from '../../lib/outils/arrayOutils'
import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = ['mathLive', 'qcm']

export const titre = 'Simplification de fractions'

/**
 * Simplifier une fraction, le facteur commun est inférieur à une valeur donnée en paramètre qui est 11 par défaut
 * @author Rémi Angot
 *  5N13
 */
export const uuid = 'f8f4e'
export const ref = '5N13'
export default function Exercice_fractions_simplifier (max = 11) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = max // Correspond au facteur commun
  this.sup2 = false
  this.titre = titre
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.consigne = 'Simplifier les fractions suivantes.'
  this.spacing = 2
  this.spacingCorr = 2
  this.amcType = amcType
  this.amcReady = amcReady

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.interactifType = this.sup3 ? 'qcm' : 'mathLive'
    this.autoCorrection = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.consigne = this.sup2 ? 'Simplifier les fractions suivantes au maximum.' : 'Simplifier les fractions suivantes.'
    const liste_fractions = [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [1, 8],
      [3, 8],
      [5, 8],
      [7, 8],
      [1, 9],
      [2, 9],
      [4, 9],
      [5, 9],
      [7, 9],
      [8, 9],
      [1, 10],
      [3, 10],
      [7, 10],
      [9, 10]
    ] // Couples de nombres premiers entre eux
    for (
      let i = 0, cpt = 0, fraction, a, k, b, texte, texteCorr, reponse;
      i < this.nbQuestions && cpt < 50;
    ) {
      if (liste_fractions.length === 0) break
      fraction = choice(liste_fractions) //
      a = fraction[0]
      b = fraction[1]
      k = randint(2, this.sup)
      enleveElement(liste_fractions, fraction) // Il n'y aura pas 2 fois la même réponse
      texte =
                '$ ' +
                deprecatedTexFraction(k * a, k * b) +
                ' = ' +
                deprecatedTexFraction('\\phantom{00000000000000}', '') +
                ' = ' +
                deprecatedTexFraction('\\phantom{0000}', '') +
                ' $'
      if (this.sup3) texte += '<br>'
      texteCorr =
                '$ ' +
                deprecatedTexFraction(k * a, k * b) +
                ' = ' +
                deprecatedTexFraction(k + ' \\times ' + a, k + ' \\times ' + b) +
                ' = ' +
                deprecatedTexFraction(a, b) +
                ' $'
      if (this.sup2) {
        reponse = new FractionEtendue(a, b)
      } else {
        reponse = new FractionEtendue(k * a, k * b)
      }
      if (this.sup3) {
        this.autoCorrection[i] = {
          enonce: 'la question n°i est posée ici',
          propositions: [
            {
              texte: '$' + reponse.toLatex() + '$',
              statut: true,
              feedback: ''
            },
            {
              texte: '$' + new FractionEtendue(a * k, b).toLatex() + '$',
              statut: false,
              feedback: ''
            },
            {
              texte: '$' + new FractionEtendue(a, b * k).toLatex() + '$',
              statut: false,
              feedback: ''
            },
            {
              texte: '$' + new FractionEtendue(randint(2, 9, [a]), randint(2, 9, [b])).toLatex() + '$',
              statut: false,
              feedback: ''
            }
          ],
          options: {
            ordered: false // (true si les réponses doivent rester dans l'ordre ci-dessus, false s'il faut les mélanger),
          }
        }
        const monQcm = propositionsQcm(this, i) // Les deux paramètres sont obligatoires et désignent, respectivement, l'exercice appelant, le numéro de la question dans la programmation de l'exercice.
        texte += monQcm.texte
      } else {
        texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline')
        // Pour AMC question AmcOpen
        this.autoCorrection[i] = { enonce: texte, propositions: [{ texte: texteCorr, statut: 1, feedback: '' }] }
      }
      if ((this.interactif && context.isHtml) || this.sup3) texte = texte.replace(' \\dfrac{\\phantom{00000000000000}}{} = \\dfrac{\\phantom{0000}}{}', '')
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (this.sup2) {
          setReponse(this, i, reponse, { formatInteractif: 'fraction' })
        } else {
          setReponse(this, i, reponse, { formatInteractif: 'fractionPlusSimple' })
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
  this.besoinFormulaireNumerique = ['Valeur maximale du facteur commun', 99999]
  this.besoinFormulaire2CaseACocher = ['Simplification maximale exigée']
  this.besoinFormulaire3CaseACocher = ['QCM']
}
