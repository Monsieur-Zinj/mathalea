import { ecritureAlgebrique, ecritureAlgebriqueSauf1, ecritureParentheseSiNegatif, reduireAxPlusByPlusC } from '../../lib/outils/ecritures'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive'
import engine from '../../lib/interactif/comparisonFunctions'
import type { MathfieldElement } from 'mathlive'
export const titre = 'Déterminer une équation cartésienne avec un point et un vecteur normal'
export const dateDePublication = '04/07/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 *
 * @author Gilles Mora+Jean Claude Lhote interactif
 */
export const uuid = '816d5'
export const ref = '1G13'
export const refs = {
  'fr-fr': ['1G13'],
  'fr-ch': []
}

class EqCartVectNormal extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacingCorr = 1
  }

  nouvelleVersion (): void {
    // Lettre entre A et W mais pas L, M, N ou O pour ne pas avoir O dans les 4 points

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      const xA = randint(-5, 5, 0)
      const yA = randint(-5, 5, 0)
      const xn = randint(-5, 5, 0)
      const yn = randint(-5, 5, 0)
      const constante = -xA * xn - yA * yn
      const reponse = `${xn}x${ecritureAlgebrique(yn)}y${ecritureAlgebrique(constante)}=0`
      texte = `La droite $(d)$ passe par le point $A$ de coordonnées $(${xA}\\,;\\,${yA})$ et a le vecteur $\\vec n \\begin{pmatrix}${xn}\\\\${yn}\\end{pmatrix}$ comme vecteur normal.<br>
          Déterminer une équation cartésienne de $(d)$.`
      texteCorr = 'On sait, d\'après le cours, que si une droite $(d)$ admet un vecteur normal de coordonnées :'
      texteCorr += ' $\\vec {n} \\begin{pmatrix}a\\\\b\\end{pmatrix}$, '
      texteCorr += 'alors une équation cartésienne de la droite $(d)$ est de la forme $ax+by+c=0$. '
      texteCorr += `<br>Avec les données de l'énoncé, $\\vec n \\begin{pmatrix}${xn}\\\\${yn}\\end{pmatrix}$,`
      texteCorr += ` on en déduit  que $a = ${xn}$ et $b=${yn}$.`
      texteCorr += ` <br>L'équation cartésienne est donc de la forme : $ ${xn} x ${ecritureAlgebriqueSauf1(yn)} y + c=0$. `
      texteCorr += `<br>On cherche maintenant la valeur correspondante de $c$. <br>On utilise pour cela que $A(${xA}\\,;\\,${yA}) \\in(d)$. `
      texteCorr += ` <br>En remplaçant $x$ et $y$ par les coordonnées de $A$, on obtient : $${xn} \\times ${ecritureParentheseSiNegatif(xA)} ${ecritureAlgebrique(yn)} \\times ${ecritureParentheseSiNegatif(yA)}+ c=0$, 
          soit $ c= ${-xA * xn - yA * yn}$ `
      texteCorr += '<br>Une équation cartésienne de la droite $(d)$ est donc de la forme : '

      texteCorr += `$${reduireAxPlusByPlusC(xn, yn, constante)}=0$.`
      texte += '<br>' + ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: 'Équation cartésienne de la droite $(d)$ :' })
      texte += ajouteFeedback(this, i)
      const callback = (exercice: Exercice, question: number) => {
        const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${question}`)
        let resultat
        const feedback: string = ''
        const mfe = document.querySelector(`#champTexteEx${exercice.numeroExercice}Q${question}`) as MathfieldElement
        const equation = mfe.value.split('=')
        if (equation.length !== 2) {
          resultat = { isOk: false, feedback: 'Il faut saisir une équation', score: { nbBonnesReponses: 0, nbReponses: 1 } }
        } else if (Number(equation[1]) !== 0) {
          resultat = { isOk: false, feedback: 'L\'équation n\'a pas la forme demandée', score: { nbBonnesReponses: 0, nbReponses: 1 } }
        } else {
          const fxy = engine.box(['Divide', engine.parse(equation[0]).json, engine.parse(reduireAxPlusByPlusC(xn, yn, constante)).json]).compile()
          if (fxy == null) {
            resultat = { isOk: false, feedback: 'La saisie n\'est pas conforme', score: { nbBonnesReponses: 0, nbReponses: 1 } }
          }
          const valAlea = () => -5 + 10 * Math.random()
          const [aa, bb, cc] = [valAlea(), valAlea(), valAlea()]
          const [A, B, C] = [valAlea(), valAlea(), valAlea()]
          const results: number[] = []
          for (const x of [aa, bb, cc]) {
            for (const y of [A, B, C]) {
              const vars = Object.fromEntries([['x', x], ['y', y]])
              results.push(fxy(vars))
            }
          }
          let isOk = true
          for (let k = 0; k < 8; k++) {
            if (Math.abs(results[k] - results[k + 1]) > 1e-8) {
              isOk = false
              break
            }
          }

          resultat = {
            isOk,
            feedback: isOk === true ? '' : 'L\'équation n\'est pas celle de la droite $(d)$.',
            score: {
              nbBonnesReponses: isOk ? 1 : 0,
              nbReponses: 1
            }
          }
        }
        // on met le smiley
        if (spanReponseLigne != null) {
          spanReponseLigne.innerHTML = resultat.isOk ? '😎' : '☹️'
        }
        const spanFeedback = document.querySelector(`#feedbackEx${exercice.numeroExercice}Q${question}`)
        // on met le feedback
        if (feedback != null && spanFeedback != null && feedback.length > 0) {
          spanFeedback.innerHTML = '💡 ' + feedback
          spanFeedback.classList.add('py-2', 'italic', 'text-coopmaths-warn-darkest', 'dark:text-coopmathsdark-warn-darkest')
        }

        return resultat
      }
      handleAnswers(this, i, { reponse: { value: reponse }, callback })
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

export default EqCartVectNormal
