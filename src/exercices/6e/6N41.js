import { choice, combinaisonListes, enleveElement } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import engine from '../../lib/interactif/comparisonFunctions'

export const titre = 'Compléter les égalités entre fractions simples'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '20/12/2023'

/**
 * Écrire une fraction avec un nouveau dénominateur qui est un multiple de son dénominateur (ce multiple est inférieur à une valeur maximale de 11 par défaut)
 * @author Rémi Angot
 * @author Jean-claude Lhote (Mode QCM et alternance numérateur / dénominateur)
 */
export const uuid = '06633'
export const refs = {
  'fr-fr': ['6N41'],
  'fr-ch': ['9NO12-1']
}
export default function EgalitesEntreFractions () {
  Exercice.call(this)
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
      let i = 0, cpt = 0, fraction, a, b, c, d, k, choix, texte, texteCorr;
      i < this.nbQuestions && cpt < 50;
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
            texte = `$${stringTexFraction(a, b)} = ${stringTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              const content = `\\dfrac{${a}}{${b}} = \\dfrac{%{champ1}}{%{champ2}} = \\dfrac{%{champ3}}{${d}}`
              texte = remplisLesBlancs(this, i, content, 'fillInTheBlank', '\\ldots')
              handleAnswers(this, i, {
                bareme: (listePoints) => [listePoints[0] * listePoints[1] + listePoints[2], 2],
                champ1: { value: `${a}\\times ${k}` },
                champ2: { value: `${b}\\times ${k}` },
                champ3: { value: String(c) }
              })
            } else {
              texte += `$${stringTexFraction('\\phantom{0000}', d)}$`
            }
            texteCorr = `$${stringTexFraction(a, b)} = ${stringTexFraction(a + miseEnEvidence('\\times' + k), b + miseEnEvidence('\\times' + k))} = ${stringTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${stringTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${stringTexFraction(a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction((k - 1) * a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction((k + 1) * a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(Math.abs(d - a), d)}$`,
                  statut: false
                }
              ]
            }
            break
          case 1 :
            texte = `$${stringTexFraction(a, b)} = ${stringTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              const content = `\\dfrac{${a}}{${b}} = \\dfrac{%{champ1}}{%{champ2}} = \\dfrac{${c}}{%{champ3}}`
              texte = remplisLesBlancs(this, i, content, 'fillInTheBlank', '\\ldots')
              handleAnswers(this, i, {
                bareme: (listePoints) => [listePoints[0] * listePoints[1] + listePoints[2], 2],
                champ1: { value: `${a}\\times ${k}` },
                champ2: { value: `${b}\\times ${k}` },
                champ3: { value: String(d) }
              })
            } else {
              texte += `$${stringTexFraction(c, '\\phantom{0000}')}$`
            }
            texteCorr = `$${stringTexFraction(a, b)} = ${stringTexFraction(a + miseEnEvidence('\\times' + k), b + miseEnEvidence('\\times' + k))} = ${stringTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${stringTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${stringTexFraction(c, b)}$`,
                  statut: false
                },
                {
                  texte: `$\\dfrac{${c}}{${(k - 1) * b}}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(c, (k + 1) * b)}$`,
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
          case 0 : // Recherche du numérateur
            if (this.interactif && context.isHtml) {
              const content = `${a} = \\dfrac{%{champ1}}{%{champ2}} = \\dfrac{%{champ3}}{${d}}`
              texte = remplisLesBlancs(this, i, content, 'fillInTheBlank', '\\ldots')
              handleAnswers(this, i, {
                bareme: (listePoints) => [listePoints[0] * listePoints[1] + listePoints[2], 2],
                champ1: { value: String(a) },
                champ2: { value: '1' },
                champ3: { value: String(a * d) },
                callback: (exercice, question) => {
                  let isOk1, feedback
                  const mfe = document.querySelector(`#champTexteEx${exercice.numeroExercice}Q${question}`)
                  const num1 = mfe.getPromptValue('champ1')
                  const den1 = mfe.getPromptValue('champ2')
                  const num2 = mfe.getPromptValue('champ3')
                  if (num1.includes('\\times')) {
                    const n = engine.parse(num1)
                    const d = engine.parse(den1)
                    const n2 = engine.parse(`${a * d}`)
                    const d2 = engine.parse(`${d}`)
                    isOk1 = n.isEqual(n2) && d.isEqual(d2)
                  } else {
                    isOk1 = num1 === String(a) && den1 === '1'
                  }
                  if (isOk1) {
                    mfe.setPromptState('champ1', 'correct', true)
                    mfe.setPromptState('champ2', 'correct', true)
                  } else {
                    mfe.setPromptState('champ1', 'incorrect', false)
                    mfe.setPromptState('champ2', 'incorrect', false)
                  }
                  const isOk2 = engine.parse(`${a}\\times ${d}`).isEqual(engine.parse(num2))
                  if (isOk2) {
                    mfe.setPromptState('champ3', 'correct', true)
                  } else {
                    mfe.setPromptState('champ3', 'incorrect', false)
                  }
                  feedback = isOk1 ? '' : 'Le calcul intermédiaire est faux.<br>'
                  feedback += isOk2 ? '' : 'Le résultat final est faux.'
                  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${question}`)
                  if (spanReponseLigne != null) {
                    spanReponseLigne.innerHTML = isOk1 && isOk2 ? '😎' : '☹️'
                  }

                  const spanFeedback = document.querySelector(`#feedbackEx${exercice.numeroExercice}Q${question}`)
                  if (feedback != null && spanFeedback != null && feedback.length > 0) {
                    spanFeedback.innerHTML = '💡 ' + feedback
                    spanFeedback.classList.add('py-2', 'italic', 'text-coopmaths-warn-darkest', 'dark:text-coopmathsdark-warn-darkest')
                  }
                  return { isOk: isOk1 && isOk2, feedback, score: { nbBonnesReponses: (isOk1 ? 1 : 0) + (isOk2 ? 1 : 0), nbReponses: 2 } }
                }
              })
              texte += ajouteFeedback(this, i)
            } else {
              texte = `$${a} = ${stringTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = ${stringTexFraction('\\phantom{0000}', d)}$`
            }
            if (this.interactif && this.interactifType !== 'mathLive') {
              texte = `$${a} = \\ldots$`
            }
            texteCorr = `$${a} = \\dfrac{${a}}{1} =${stringTexFraction(a + miseEnEvidence('\\times' + d), '1' + miseEnEvidence('\\times' + d))} = ${stringTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${stringTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${stringTexFraction(a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(d + a, d)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(Math.abs(d - a), d)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction((a + 1) * d, d)}$`,
                  statut: false
                }
              ]
            }
            break
          case 1 :
            texte = `$${a} = ${stringTexFraction('\\phantom{00000000000000}', '\\phantom{00000000000000}')} = $`
            if (this.interactif && context.isHtml) {
              const content = `${a} = \\dfrac{%{champ1}}{%{champ2}} = \\dfrac{${c}}{%{champ3}}`
              texte = remplisLesBlancs(this, i, content, 'fillInTheBlank', '\\ldots')
              handleAnswers(this, i, {
                bareme: (listePoints) => [listePoints[0] * listePoints[1] + listePoints[2], 2],
                champ1: { value: String(a) },
                champ2: { value: '1' },
                champ3: { value: String(d) }
              })
            } else {
              texte += `$${stringTexFraction(c, '\\phantom{0000}')}$`
            }
            if (this.interactif && this.interactifType !== 'mathLive') {
              texte = `$${a} = \\ldots$`
            }
            texteCorr = `$${a} = \\dfrac{${a}}{1} =${stringTexFraction(a + miseEnEvidence('\\times' + d), '1' + miseEnEvidence('\\times' + d))} = ${stringTexFraction(c, d)}$`
            if (context.isAmc) {
              this.autoCorrection[i] = {}
              this.autoCorrection[i].propositions = [
                {
                  texte: `$${stringTexFraction(c, d)}$`,
                  statut: true
                },
                {
                  texte: `$${stringTexFraction(c, c - a)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(c, a)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(c, c + a)}$`,
                  statut: false
                },
                {
                  texte: `$${stringTexFraction(c, c * a)}$`,
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
      if (this.questionJamaisPosee(i, a, d)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale du facteur commun', 99]
  this.besoinFormulaire2Numerique = ['Type de questions', 3, '1 : Numérateur imposé\n2 : Dénominateur imposé\n3 : Mélange']
}

function stringTexFraction (a, b) {
  return `\\dfrac{${a}}{${b}}`
}
