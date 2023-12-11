import { choice, combinaisonListes, enleveElement } from '../../lib/outils/arrayOutils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction as fractionEtendue } from '../../modules/fractions.js'
import { ajouteChampFractionMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Compléter les égalités entre fractions simples'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Écrire une fraction avec un nouveau dénominateur qui est un multiple de son dénominateur (ce multiple est inférieur à une valeur maximale de 11 par défaut)
 * @author Rémi Angot
 * @author Jean-claude Lhote (Mode QCM et alternance numérateur / dénominateur)
 */
export const uuid = '06633'
export const ref = '6N41'
export default function EgalitesEntreFractions () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = 11 // Correspond au facteur commun
  this.sup2 = 2 // alternance numérateur ou dénominateur imposé.
  this.consigne = 'Compléter les égalités.'
  this.spacing = 2
  this.spacingCorr = 2

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeFractions = [
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
    const listeTypeDeQuestions = combinaisonListes(
      [1, 1, 1, 1, 2],
      this.nbQuestions
    )
    for (
      let i = 0, fraction, a, b, c, d, k, choix, texte, texteCorr;
      i < this.nbQuestions;
      i++
    ) {
      if (listeTypeDeQuestions[i] === 1) {
        // égalité entre 2 fractions
        fraction = choice(listeFractions) //
        a = fraction[0]
        b = fraction[1]
        if (this.modeQcm) {
          k = randint(3, Math.max(this.sup, 4))
        } else {
          k = randint(2, Math.max(3, this.sup))
        }
        c = k * a
        d = k * b
        enleveElement(listeFractions, fraction) // Il n'y aura pas 2 fois la même fraction de départ
        if (this.sup2 === 3) {
          choix = i % 2
        } else {
          choix = this.sup2 % 2
        }
        switch (choix) {
          case 0 :
            texte = `$${deprecatedTexFraction(a, b)} = ${deprecatedTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              setReponse(this, i, fractionEtendue(c, d), { formatInteractif: 'Num' })
              texte += ajouteChampFractionMathLive(this, i, false, d)
            } else {
              texte += `$${deprecatedTexFraction('\\phantom{0000}', d)}$`
            }
            texteCorr = `$${deprecatedTexFraction(a, b)} = ${deprecatedTexFraction(a + miseEnEvidence('\\times' + k), b + miseEnEvidence('\\times' + k))} = ${deprecatedTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${deprecatedTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${deprecatedTexFraction(a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction((k - 1) * a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction((k + 1) * a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(Math.abs(d - a), d)}$`,
                  statut: false
                }
              ]
            }
            break
          case 1 :
            texte = `$${deprecatedTexFraction(a, b)} = ${deprecatedTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              setReponse(this, i, fractionEtendue(c, d), { formatInteractif: 'Den' })
              texte += ajouteChampFractionMathLive(this, i, c, false)
            } else {
              texte += `$${deprecatedTexFraction(c, '\\phantom{0000}')}$`
            }
            texteCorr = `$${deprecatedTexFraction(a, b)} = ${deprecatedTexFraction(a + miseEnEvidence('\\times' + k), b + miseEnEvidence('\\times' + k))} = ${deprecatedTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${deprecatedTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${deprecatedTexFraction(c, b)}$`,
                  statut: false
                },
                {
                  texte: `$\\dfrac{${c}}{${(k - 1) * b}}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(c, (k + 1) * b)}$`,
                  statut: false
                },
                {
                  texte: `$\\dfrac{${c}}{${Math.abs(c - b)}}$`,
                  statut: false
                }
              ]
            }
            break
        }
      } else {
        // écrire un entier sous la forme d'une fraction
        a = randint(1, 9)
        if (this.interactif && !context.isAmc && this.interactif === 'qcm') {
          d = randint(3, 9, [a, 2 * a])
        } else {
          d = randint(2, 9)
        }
        c = a * d
        if (this.sup2 === 3) {
          choix = i % 2
        } else {
          choix = this.sup2 % 2
        }
        switch (choix) {
          case 0 :
            texte = `$${a} = ${deprecatedTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              setReponse(this, i, fractionEtendue(c, d), { formatInteractif: 'Num' })
              texte += ajouteChampFractionMathLive(this, i, false, d)
            } else {
              texte += `$${deprecatedTexFraction('\\phantom{0000}', d)}$`
            }
            if (this.interactif && this.interactifType !== 'mathLive') {
              texte = `$${a} = \\ldots$`
            }
            texteCorr = `$${a} = \\dfrac{${a}}{1} =${deprecatedTexFraction(a + miseEnEvidence('\\times' + d), '1' + miseEnEvidence('\\times' + d))} = ${deprecatedTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${deprecatedTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${deprecatedTexFraction(a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(d + a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(Math.abs(d - a), d)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction((a + 1) * d, d)}$`,
                  statut: false
                }
              ]
            }
            break
          case 1 :
            texte = `$${a} = ${deprecatedTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              setReponse(this, i, fractionEtendue(c, d), { formatInteractif: 'Den' })
              texte += ajouteChampFractionMathLive(this, i, c, false)
            } else {
              texte += `$${deprecatedTexFraction(c, '\\phantom{0000}')}$`
            }
            if (this.interactif && this.interactifType !== 'mathLive') {
              texte = `$${a} = \\ldots$`
            }
            texteCorr = `$${a} = \\dfrac{${a}}{1} =${deprecatedTexFraction(a + miseEnEvidence('\\times' + d), '1' + miseEnEvidence('\\times' + d))} = ${deprecatedTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${deprecatedTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${deprecatedTexFraction(c, c - a)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(c, a)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(c, c + a)}$`,
                  statut: false
                },
                {
                  texte: `$${deprecatedTexFraction(c, c * a)}$`,
                  statut: false
                }
              ]
            }
            break
        }
      }
      if (context.isAmc) {
        this.autoCorrection[i].enonce = `Parmi les fractions suivantes, laquelle est égale à ${texte.split('=')[0]}$ ?`
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale du facteur commun', 99]
  this.besoinFormulaire2Numerique = ['Type de questions', 3, '1 : Numérateur imposé\n2 : Dénominateur imposé\n3 : Mélange']
}
