import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { nombreAvecEspace, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Operation from '../../modules/operations.js'
import { context } from '../../modules/context.js'
import { choixDeroulant } from '../../lib/interactif/questionListeDeroulante.js'
import { ajouteFeedback } from '../../lib/interactif/questionMathLive'

export const titre = 'Trouver des phrases avec les mots : divisible, diviseur et multiple'
export const interactifReady = true
export const interactifType = 'custom'

/**
 * Compléter des phrases avec les mots divisible, divieur et multiple
 * @author Rémi Angot
 * Référence 6N43-4
 */
export const uuid = 'f894a'
export const ref = '6N43-4'
export const refs = {
  'fr-fr': ['6N43-4'],
  'fr-ch': ['9NO4-3']
}
export default function DivisibleDiviseurMultiple () {
  Exercice.call(this)
  this.consigne = ''
  this.nbQuestions = 6 // 6 questions au maximum
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
    this.setReponse = function (i, listeBonnesReponses) {
    this.autoCorrection[i] = {}
    this.autoCorrection[i].listeReponses = listeBonnesReponses
  }

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let b = randint(6, 17, [9, 10])
    let q = randint(11, 99)
    let r = randint(1, b - 1)
    let a = b * q
    let a1 = b * q + r
    while (q % b === 0 || q % r === 0 || b % r === 0 || a1 % r === 0) {
      b = randint(6, 17, [9, 10])
      q = randint(11, 99)
      r = randint(1, b - 1)
      a = b * q
      a1 = b * q + r
    }
    this.introduction = `À l'aide des calculs suivants, compléter les phrases suivantes avec les nombres $${texNombre(a1)}$, $${texNombre(a)}$, $${texNombre(b)}$ ou $${texNombre(q)}$.<br><br>`
    if (randint(0, 1) === 0) {
      this.introduction += Operation({ operande1: a, operande2: b, type: 'divisionE' })
      if (!context.isHtml) this.introduction += '\\qquad'
      this.introduction += Operation({ operande1: a1, operande2: b, type: 'divisionE' })
    } else {
      this.introduction += Operation({ operande1: a1, operande2: b, type: 'divisionE' })
      if (!context.isHtml) this.introduction += '\\qquad'
      this.introduction += Operation({ operande1: a, operande2: b, type: 'divisionE' })
    }

    const typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6] // On créé 3 types de questions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr; i < this.nbQuestions; i++) {
      // Boucle principale où i+1 correspond au numéro de la question
      if (listeTypeDeQuestions[i] === 1) {
        texte = '... est divisible par ...'
        if (this.interactif) {
          texte = choixDeroulant(this, 2 * i, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)]) + 'est divisible par' + choixDeroulant(this, 2 * i + 1, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)])
        }
        texteCorr = `$${texNombre(a)}$ est divisible par $${texNombre(b)}$ ou $${texNombre(a)}$ est divisible par $${texNombre(q)}$.`
        this.setReponse(i, [[nombreAvecEspace(a), nombreAvecEspace(b)], [nombreAvecEspace(a), nombreAvecEspace(q)]])
      } else if (listeTypeDeQuestions[i] === 2) {
        texte = '... est un diviseur de ...'
        if (this.interactif) {
          texte = choixDeroulant(this, 2 * i, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)]) + 'est un diviseur de' + choixDeroulant(this, 2 * i + 1, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)])
        }
        texteCorr = `$${texNombre(b)}$ est un diviseur de $${texNombre(a)}$ ou $${texNombre(q)}$ est un diviseur de $${texNombre(a)}$.`
        this.setReponse(i, [[nombreAvecEspace(b), nombreAvecEspace(a)], [nombreAvecEspace(q), nombreAvecEspace(a)]])
      } else if (listeTypeDeQuestions[i] === 3) {
        texte = '... est un multiple de ...'
        if (this.interactif) {
          texte = choixDeroulant(this, 2 * i, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)]) + 'est un multiple de' + choixDeroulant(this, 2 * i + 1, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)])
        }
        texteCorr = `$${texNombre(a)}$ est un multiple de $${texNombre(b)}$ ou $${texNombre(a)}$ est un multiple de $${texNombre(q)}$.`
        this.setReponse(i, [[nombreAvecEspace(a), nombreAvecEspace(b)], [nombreAvecEspace(a), nombreAvecEspace(q)]])
      } else if (listeTypeDeQuestions[i] === 4) {
        texte = '... n\'est pas divisible par ...'
        if (this.interactif) {
          texte = choixDeroulant(this, 2 * i, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)]) + 'n\'est pas divisible par' + choixDeroulant(this, 2 * i + 1, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)])
        }
        texteCorr = `$${texNombre(a1)}$ n'est pas divisible par $${texNombre(b)}$ ou $${texNombre(a1)}$ n'est pas divisible par $${texNombre(q)}$.`
        this.setReponse(i, [[nombreAvecEspace(a1), nombreAvecEspace(b)], [nombreAvecEspace(a1), nombreAvecEspace(q)],
          [nombreAvecEspace(b), nombreAvecEspace(a1)], // réponses absurdes mais vraies !
          [nombreAvecEspace(q), nombreAvecEspace(a1)],
          [nombreAvecEspace(b), nombreAvecEspace(a)], // réponses absurdes mais vraies !
          [nombreAvecEspace(q), nombreAvecEspace(a)]
        ])
      } else if (listeTypeDeQuestions[i] === 5) {
        texte = '... n\'est pas un diviseur de ...'
        if (this.interactif) {
          texte = choixDeroulant(this, 2 * i, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)]) + 'n\'est pas un diviseur de' + choixDeroulant(this, 2 * i + 1, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)])
        }
        texteCorr = `$${texNombre(b)}$ n'est pas un diviseur de $${texNombre(a1)}$ ou $${texNombre(q)}$ n'est pas un diviseur de $${texNombre(a1)}$.`
        this.setReponse(i, [[nombreAvecEspace(b), nombreAvecEspace(a1)], [nombreAvecEspace(q), nombreAvecEspace(a1)],
          [nombreAvecEspace(a1), nombreAvecEspace(b)],
          [nombreAvecEspace(a1), nombreAvecEspace(q)],
          [nombreAvecEspace(a), nombreAvecEspace(b)],
          [nombreAvecEspace(a), nombreAvecEspace(q)]// réponses absurdes mais vraies
        ])
      } else {
        texte = '... n\'est pas un multiple de ...'
        if (this.interactif) {
          texte = choixDeroulant(this, 2 * i, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)]) + 'n\'est pas un multiple de' + choixDeroulant(this, 2 * i + 1, [nombreAvecEspace(a1), nombreAvecEspace(a), nombreAvecEspace(b), nombreAvecEspace(q)])
        }
        texteCorr = `$${texNombre(a1)}$ n'est pas un multiple de $${texNombre(b)}$ ou $${texNombre(a1)}$ est n'est pas un multiple de $${texNombre(q)}$.`
        this.setReponse(i, [[nombreAvecEspace(a1), nombreAvecEspace(b)], [nombreAvecEspace(a1), nombreAvecEspace(q)],
          [nombreAvecEspace(b), nombreAvecEspace(a1)], // réponses absurdes mais vraies !
          [nombreAvecEspace(q), nombreAvecEspace(a1)],
          [nombreAvecEspace(b), nombreAvecEspace(a)], // réponses absurdes mais vraies !
          [nombreAvecEspace(q), nombreAvecEspace(a)]
        ])
      }
      texte += ajouteFeedback(this, 2 * i + 1)
      // Si la question n'a jamais été posée, on en crée une autre
      // texte = '<div class="ui form>' + texte + '</div>'
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this)
  }
  this.correctionInteractive = function (i) {
    const select1 = document.querySelector(`#ex${this.numeroExercice}Q${2 * i}`)
    const select2 = document.querySelector(`#ex${this.numeroExercice}Q${2 * i + 1}`)
    let isOk = false
    let feedback = ''
    if (select1?.value != null && select2.value != null) {
      const choix1 = select1.value
      const choix2 = select2.value
      for (let possibilites = 0; possibilites < 2; possibilites++) {
        if (choix1 === this.autoCorrection[i].listeReponses[possibilites][0] && choix2 === this.autoCorrection[i].listeReponses[possibilites][1]) {
          isOk = true
          break
        }
      }
      if (!isOk && this.autoCorrection[i].listeReponses.length > 2) {
        for (let possibilites = 2; possibilites < this.autoCorrection[i].listeReponses.length; possibilites++) {
          if (choix1 === this.autoCorrection[i].listeReponses[possibilites][0] && choix2 === this.autoCorrection[i].listeReponses[possibilites][1]) {
            isOk = false
            feedback = 'C\'est vrai, mais c\'est sans rapport avec une des divisions posées.'
            break
          }
        }
      }
    } else {
      isOk = false
    }
    const spanReponseLigne = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${2 * i + 1}`)
    if (spanReponseLigne == null) window.notify('Pas trouvé le spanReponseLigne dans 6N43-4', {})
    if (isOk) {
      spanReponseLigne.innerHTML = '😎'
    } else {
      spanReponseLigne.innerHTML = '☹️'
    }
    if (feedback !== '') {
      const divFeedback = document.querySelector(`div#feedbackEx${this.numeroExercice}Q${2 * i + 1}`)
      divFeedback.innerHTML = feedback
    }
    return isOk ? 'OK' : 'KO'
  }
}
