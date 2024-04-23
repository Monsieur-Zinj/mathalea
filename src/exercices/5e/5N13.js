/* eslint-disable camelcase */
import { choice, enleveElement, shuffle } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { listeDesDiviseurs } from '../../lib/outils/primalite'
import Decimal from 'decimal.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const amcReady = true
export const amcType = ['AMCOpen', 'AMCNum', 'qcmMult', 'qcmMono']
export const interactifReady = true
export const interactifType = ['mathLive', 'qcm']

export const titre = 'Simplification de fractions'
export const dateDeModifImportante = '08/03/2024'

/**
 * Simplifier une fraction, le facteur commun est inférieur à une valeur donnée en paramètre qui est 11 par défaut
 * @author Rémi Angot
 */
export const uuid = 'f8f4e'
export const ref = '5N13'
export const refs = {
  'fr-fr': ['5N13'],
  'fr-ch': ['9NO12-3']
}
export default function Exercice_fractions_simplifier (max = 11) {
  Exercice.call(this)
  this.sup = max // Correspond au facteur commun
  this.sup2 = false
  this.spacing = 2
  this.spacingCorr = 3

  this.nouvelleVersion = function () {
    this.interactifType = this.sup3 ? 'qcm' : 'mathLive'
    this.amcType = this.sup3 ? (!this.sup2 ? 'qcmMult' : 'qcmMono') : (!this.sup2 ? 'AMCOpen' : 'AMCNum')
    this.autoCorrection = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.consigne = this.sup3
      ? ''
      : this.sup2 ? 'Simplifier les fractions suivantes au maximum.' : 'Simplifier les fractions suivantes.'
    if (this.nbQuestions === 1) {
      this.consigne = this.consigne.replace('les fractions suivantes', 'la fraction suivante')
    }
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
      const tabDiviseursDek = listeDesDiviseurs(k)
      const fractionInitale = new FractionEtendue(k * a, k * b).texFraction
      if (this.interactifType === 'qcm') {
        texte = 'Parmi les fractions proposées ci-dessous, '
        texte += (tabDiviseursDek.length > 2 && !this.sup2) ? 'lesquelles sont ' : 'laquelle est '
        if (this.sup2) texte += 'la fraction la plus simplifiée de '
        else texte += 'une fraction simplifiée de '
        texte += `$${fractionInitale}$ ? `
      } else {
        texte =
                '$ ' +
                fractionInitale +
                ' = ' +
                texFractionFromString('\\phantom{00000000000000}', '') +
                ' = ' +
                texFractionFromString('\\phantom{0000}', '') +
                ' $'
      }
      texteCorr = ''
      for (let ee = tabDiviseursDek.length - 2; ee >= 0; ee--) {
        texteCorr += '$ ' +
                fractionInitale +
                ' = ' +
                texFractionFromString(new Decimal(k).div(tabDiviseursDek[ee]) + ' \\times ' + new Decimal(a).mul(tabDiviseursDek[ee]), new Decimal(k).div(tabDiviseursDek[ee]) + ' \\times ' + new Decimal(b).mul(tabDiviseursDek[ee])) +
                ' = ' +
                (!this.sup2 || ee === 0 // On met tout en couleur qd on veut toutes les simplifications ou seulement la dernière si simplification maximale
                  ? miseEnEvidence(new FractionEtendue(new Decimal(a).mul(tabDiviseursDek[ee]), new Decimal(b).mul(tabDiviseursDek[ee])).texFraction)
                  : new FractionEtendue(new Decimal(a).mul(tabDiviseursDek[ee]), new Decimal(b).mul(tabDiviseursDek[ee])).texFraction
                ) +
                ' $<br>'
      }
      if (this.sup2 || this.interactifType === 'qcm') {
        reponse = new FractionEtendue(a, b)
      } else {
        reponse = new FractionEtendue(k * a, k * b)
      }
      if (this.interactifType === 'qcm' || this.amcType === 'qcmMult' || this.amcType === 'qcmMono') {
        let fractionsFausses = [[a, b - 1], [a, b + 1], [a + 1, b - 1], [a + 1, b], [a + 1, b + 1]]
        if (a !== 1) fractionsFausses.push([a - 1, b - 1], [a - 1, b], [a - 1, b + 1])

        fractionsFausses = shuffle(fractionsFausses)
        this.autoCorrection[i] = {
          enonce: texte,
          propositions: [
            {
              texte: '$' + reponse.toLatex() + '$',
              statut: true,
              feedback: ''
            },
            {
              texte: '$' + new FractionEtendue(fractionsFausses[0][0], fractionsFausses[0][1]).toLatex() + '$',
              statut: false,
              feedback: ''
            },
            {
              texte: '$' + new FractionEtendue(fractionsFausses[1][0], fractionsFausses[1][1]).toLatex() + '$',
              statut: false,
              feedback: ''
            },
            {
              texte: '$' + new FractionEtendue(fractionsFausses[2][0], fractionsFausses[2][1]).toLatex() + '$',
              statut: false,
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
            }

          ],
          options: {
            ordered: false // (true si les réponses doivent rester dans l'ordre ci-dessus, false s'il faut les mélanger),
          }
        }
        if (tabDiviseursDek.length > 2) {
          const choixDiviseurDek = choice(tabDiviseursDek, [1, k])
          const denSimplifie = new Decimal(a).mul(k).div(choixDiviseurDek)
          const numSimplifie = new Decimal(b).mul(k).div(choixDiviseurDek)
          this.autoCorrection[i].propositions[3] = {
            texte: '$' + new FractionEtendue(denSimplifie, numSimplifie).toLatex() + '$',
            statut: !this.sup2,
            feedback: ''
          }
          let fractionsFaussesSimplifiees = [[new Decimal(denSimplifie).add(1), numSimplifie], [new Decimal(denSimplifie).add(-1), numSimplifie]]
          fractionsFaussesSimplifiees.push([denSimplifie, new Decimal(numSimplifie).add(1)], [denSimplifie, new Decimal(numSimplifie).add(-1)])
          fractionsFaussesSimplifiees = shuffle(fractionsFaussesSimplifiees)
          this.autoCorrection[i].propositions[4] = {
            texte: '$' + new FractionEtendue(fractionsFaussesSimplifiees[0][0], fractionsFaussesSimplifiees[0][1]).toLatex() + '$',
            statut: false,
            feedback: ''
          }
          this.autoCorrection[i].propositions[5] = {
            texte: '$' + new FractionEtendue(fractionsFaussesSimplifiees[1][0], fractionsFaussesSimplifiees[1][1]).toLatex() + '$',
            statut: false,
            feedback: ''
          }
        }
        const monQcm = propositionsQcm(this, i) // Les deux paramètres sont obligatoires et désignent, respectivement, l'exercice appelant, le numéro de la question dans la programmation de l'exercice.
        texte += monQcm.texte
      } else {
        texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore clavierDeBaseAvecFraction')
        if (this.amcType === 'AMCOpen') this.autoCorrection[i] = { enonce: `Simplfier $${fractionInitale}$ en détaillant la simplification.`, propositions: [{ texte: texteCorr, statut: 1, feedback: '' }] }
        if (this.amcType === 'AMCNum' && context.isAmc) texte = `Simplifier, de façon maximale, $${fractionInitale}$.`
      }
      if ((this.interactif && context.isHtml) || this.sup3) texte = texte.replace(' \\dfrac{\\phantom{00000000000000}}{} = \\dfrac{\\phantom{0000}}{}', '')
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (this.interactifType === 'mathLive' || this.amcType === 'AMCNum') {
          if (this.sup2) {
            setReponse(this, i, reponse, { formatInteractif: 'fraction' })
          } else {
            setReponse(this, i, reponse, { formatInteractif: 'fractionPlusSimple' })
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque question
  }
  this.besoinFormulaireNumerique = ['Valeur maximale du facteur commun', 99999]
  this.besoinFormulaire2CaseACocher = ['Simplification maximale exigée']
  this.besoinFormulaire3CaseACocher = ['QCM']
}
