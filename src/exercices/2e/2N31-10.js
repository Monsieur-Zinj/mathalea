import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { simpExp } from '../../lib/outils/puissance'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures.ts'

import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Effectuer des calculs littéraux avec des puissances et leurs règles de calculs'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Puissances littérales avec exposants relatifs
 * * Travailler des résultats automatisés
 * * mais aussi d'utiliser les propriétés du produit de puissance, du quotient de puissances et des puissances de puissances
 * @author Jean-Léon Henry
 * 2N31-3 initialement
 */
export const uuid = 'fc2e8'
export const ref = '2N31-10'
export const refs = {
  'fr-fr': ['2N31-10'],
  'fr-ch': ['']
}
export default function PuissancesDUnRelatif2 () {
  Exercice.call(this)
  this.consigne = 'Écrire sous la forme '
  context.isHtml
    ? (this.consigne += '$\\mathbf{a^n}$.')
    : (this.consigne += '$a^n$.')
  this.spacing = 2
  this.spacingCorr = 2.5
  this.nbQuestions = 8
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    const typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8]
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    )

    for (
      let i = 0, base, exp, texte, texteCorr, reponseInteractive, exposantInteractif, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      const typesDeQuestions = listeTypeDeQuestions[i]

      const variables = ['x', 'y', 'a', 'b']
      base = variables[randint(0, variables.length - 1)]
      texte = ''
      switch (typesDeQuestions) {
        case 1: // (x^a·x²)/(x^b·x^c)
          exp = [randint(-7, 7, [0, 1]), randint(-7, 7, [0, 1]), randint(-7, 7, [0, 1])] // on a besoin de 3 exposants distincts
          texte += `$\\dfrac{${base}^{ ${exp[0]} }\\times ${base}^2}{${base}^{ ${exp[1]} } \\times ${base}^{ ${exp[2]} }}$`
          texteCorr = `$\\dfrac{${base}^{ ${exp[0]} }\\times ${base}^2}{${base}^{${exp[1]}} \\times ${base}^{ ${exp[2]} }}`
          texteCorr += ` = \\dfrac{${base}^{ ${exp[0]} }\\times ${base}^2}{${base}^{ ${exp[1]} } \\times ${base}^{ ${exp[2]} }}`
          texteCorr += ` = \\dfrac{${base}^{${exp[0]}+2}}{${base}^{${exp[1]}+${ecritureParentheseSiNegatif(exp[2])}}}`
          texteCorr += ` = \\dfrac{${base}^{${exp[0] + 2}}}{${base}^{${exp[1] + exp[2]}}}`
          texteCorr += ` = ${base}^{${exp[0] + 2}-${ecritureParentheseSiNegatif(exp[1] + exp[2])}}`
          texteCorr += ` = ${base}^{${exp[0] + 2 - exp[1] - exp[2]}}`
          if (
            exp[0] + 2 - exp[1] - exp[2] === 0 ||
                        exp[0] + 2 - exp[1] - exp[2] === 1
          ) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += '=' + simpExp(base, exp[0] + 2 - exp[1] - exp[2])
          }
          texteCorr += '$'
          reponseInteractive = `${base}^{${exp[0] + 2 - exp[1] - exp[2]}}`
          exposantInteractif = exp[0] + 2 - exp[1] - exp[2]
          break
        case 2: // (x^a·x³)/(x^b)
          exp = [randint(-7, 7, [0, 1]), randint(-7, 7, [0, 1])] // on a besoin de 2 exposants distincts
          texte += `$\\dfrac{${base}^{${exp[0]}}\\times ${base}^3}{${base}^{${exp[1]}}}$`
          texteCorr = `$\\dfrac{${base}^{${exp[0]}}\\times ${base}^3}{${base}^{${exp[1]}}}`
          texteCorr += ` = \\dfrac{${base}^{${exp[0]}+3}}{${base}^{${exp[1]}}}`
          texteCorr += ` = \\dfrac{${base}^{${exp[0] + 3}}}{${base}^{${exp[1]}}}`
          texteCorr += ` = ${base}^{${exp[0] + 3}-${ecritureParentheseSiNegatif(exp[1])}}`
          texteCorr += ` = ${base}^{${exp[0] + 3 - exp[1]}}`
          if (exp[0] + 3 - exp[1] === 0 || exp[0] + 3 - exp[1] === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += '=' + simpExp(base, exp[0] + 3 - exp[1])
          }
          texteCorr += '$'
          reponseInteractive = `${base}^{${exp[0] + 3 - exp[1]}}`
          exposantInteractif = exp[0] + 3 - exp[1]
          break
        case 3: // (x·x^a)/(x²)^b
          exp = [randint(-7, 7, [1]), randint(1, 2)] // on a besoin de 2 exposants distincts
          // le second exposant ne peut valoir que 1 ou 2 la fonction testExp ne convient pas à l'affichage ici
          if (exp[1] === 2) {
            texte += `$\\dfrac{${base}\\times ${base}^{${exp[0]}}}{(${base}^2)^{${exp[1]}}}$`
            texteCorr = `$\\dfrac{${base}\\times ${base}^{${exp[0]}}}{(${base}^2)^{${exp[1]}}}`
            texteCorr += `=\\dfrac{${base}^{1+${ecritureParentheseSiNegatif(exp[0])}}}{(${base}^2)^{${exp[1]}}}`
            texteCorr += `=\\dfrac{${base}^{1+${ecritureParentheseSiNegatif(exp[0])}}}{${base}^{2 \\times ${exp[1]}}}`
            texteCorr += `=\\dfrac{${base}^{${1 + exp[0]}}}{${base}^{${2 * exp[1]
                        }}}`
          } else {
            texte += `$\\dfrac{${base}\\times ${base}^{${exp[0]}}}{${base}^2}$`
            texteCorr = `$\\dfrac{${base}\\times ${base}^{${exp[0]}}}{${base}^2}`
            texteCorr += `=\\dfrac{${base}^{1+${ecritureParentheseSiNegatif(exp[0])}}}{${base}^2}`
          }
          texteCorr += `=${base}^{${1 + exp[0]}-${ecritureParentheseSiNegatif(2 * exp[1])}}`
          texteCorr += `=${base}^{${1 + exp[0] - 2 * exp[1]}}`
          if (1 + exp[0] - 2 * exp[1] === 0 || 1 + exp[0] - 2 * exp[1] === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += '=' + simpExp(base, 1 + exp[0] - 2 * exp[1])
          }
          texteCorr += '$'
          reponseInteractive = `${base}^{${1 + exp[0] - 2 * exp[1]}}`
          exposantInteractif = 1 + exp[0] - 2 * exp[1]
          break
        case 4: // (x·x^a)/(x²·x²)
          exp = [randint(-7, 7, [0, 1])] // on a besoin de 1 exposant
          texte += `$\\dfrac{${base}\\times ${base}^{${exp[0]}}}{${base}^2\\times ${base}^2}$`
          texteCorr = `$\\dfrac{${base}\\times ${base}^{${exp[0]}}}{${base}^2\\times ${base}^2}`
          texteCorr += `=\\dfrac{${base}^{1+${ecritureParentheseSiNegatif(exp[0])}}}{${base}^2\\times ${base}^2}`
          texteCorr += `=\\dfrac{${base}^{${1 + exp[0]}}}{${base}^{2+2}}`
          texteCorr += `=\\dfrac{${base}^{${1 + exp[0]}}}{${base}^{4}}`
          texteCorr += `=${base}^{${1 + exp[0]}-4}`
          texteCorr += `=${base}^{${1 + exp[0] - 4}}`
          if (1 + exp[0] - 4 === 0 || 1 + exp[0] - 4 === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += '=' + simpExp(base, 1 + exp[0] - 4)
          }
          texteCorr += '$'
          reponseInteractive = `${base}^{${1 + exp[0] - 4}}`
          exposantInteractif = 1 + exp[0] - 4
          break
        case 5: // (x²)^a/x
          exp = [randint(-7, 7, [0, 1])] // on a besoin de 1 exposant
          texte += `$\\dfrac{(${base}^2)^{${exp[0]}}}{${base}}$`
          texteCorr = `$\\dfrac{(${base}^2)^{${exp[0]}}}{${base}}`
          texteCorr += `=\\dfrac{(${base}^2)^{${exp[0]}}}{${base}}`
          texteCorr += `=\\dfrac{${base}^{2\\times ${ecritureParentheseSiNegatif(exp[0])}}}{${base}}`
          texteCorr += `=\\dfrac{${base}^{${2 * exp[0]}}}{${base}}`
          texteCorr += `=${base}^{${2 * exp[0]}-1}`
          texteCorr += `=${base}^{${2 * exp[0] - 1}}$`
          // Inutile de tester l'exposant final car il vaut au minimum 3
          reponseInteractive = `${base}^{${2 * exp[0] - 1}}`
          exposantInteractif = 2 * exp[0] - 1
          break
        case 6: // (x³)^a/x
          exp = [randint(-3, 3, [0, 1])] // on a besoin de 1 exposant
          texte += `$\\dfrac{(${base}^3)^{${exp[0]}}}{${base}}$`
          texteCorr = `$\\dfrac{( ${base}^3 )^{${exp[0]}}}{${base}}`
          texteCorr += `=\\dfrac{${base}^{3\\times ${ecritureParentheseSiNegatif(exp[0])}}}{${base}}`
          texteCorr += `=\\dfrac{${base}^{${3 * exp[0]}}}{${base}}`
          texteCorr += `=${base}^{${3 * exp[0]}-1}`
          texteCorr += `=${base}^{${3 * exp[0] - 1}}$`
          // inutile de tester l'exposant final car il vaut au minimum 5
          reponseInteractive = `${base}^{${3 * exp[0] - 1}}`
          exposantInteractif = 3 * exp[0] - 1
          break
        case 7: // (x^a·x^b)/(x²)^c·x
          exp = [randint(-7, 7, [0, 1]), randint(-7, 7, [0, 1]), randint(-4, 4, [0, 1])] // on a besoin de 3 exposants distincts
          texte += `$\\dfrac{${base}^{${exp[0]}}\\times ${base}^{${exp[1]}}}{(${base}^2)^{${exp[2]}}}\\times ${base}$`
          texteCorr = `$\\dfrac{${base}^{${exp[0]}}\\times ${base}^{${exp[1]}}}{(${base}^2)^{${exp[2]}}}\\times ${base}`
          texteCorr += `=\\dfrac{${base}^{${exp[0]}+${ecritureParentheseSiNegatif(exp[1])}}}{(${base}^2)^{${exp[2]}}}\\times ${base}`
          texteCorr += `=\\dfrac{${base}^{${exp[0] + exp[1]}}}{${base}^{2\\times ${ecritureParentheseSiNegatif(exp[2])}}}\\times ${base}`
          texteCorr += `=\\dfrac{${base}^{${exp[0] + exp[1]}}}{${base}^{${2 * exp[2]}}}\\times ${base}`
          texteCorr += `=\\dfrac{${base}^{${exp[0] + exp[1]}}\\times ${base}}{${base}^{${2 * exp[2]}}}`
          texteCorr += `=\\dfrac{${base}^{${exp[0] + exp[1]}+1}}{${base}^{${2 * exp[2]}}}`
          texteCorr += `=\\dfrac{${base}^{${exp[0] + exp[1] + 1}}}{${base}^{${2 * exp[2]}}}`
          texteCorr += `=${base}^{${exp[0] + exp[1] + 1}-${ecritureParentheseSiNegatif(2 * exp[2])}}`
          texteCorr += `=${base}^{${exp[0] + exp[1] + 1 - 2 * exp[2]}}`
          if (
            exp[0] + exp[1] + 1 - 2 * exp[2] === 0 ||
                        exp[0] + exp[1] + 1 - 2 * exp[2] === 1
          ) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant est évincé
            texteCorr += '=' + simpExp(base, exp[0] + exp[1] + 1 - 2 * exp[2])
          }
          texteCorr += '$'
          reponseInteractive = `${base}^{${exp[0] + exp[1] + 1 - 2 * exp[2]}}`
          exposantInteractif = exp[0] + exp[1] + 1 - 2 * exp[2]
          break
        case 8: // (x³·x)/(x²)^c
          exp = [randint(-7, 7, [0, 1])] // on a besoin de 1 exposant
          texte += `$\\dfrac{${base}^3\\times ${base}}{(${base}^2)^{${exp[0]}}}$`
          texteCorr = `$\\dfrac{${base}^3\\times ${base}}{(${base}^2)^{${exp[0]}}}`
          texteCorr += `=\\dfrac{${base}^3\\times ${base}}{(${base}^2)^{${exp[0]}}}`
          texteCorr += `=\\dfrac{${base}^{3+1}}{${base}^{2\\times${ecritureParentheseSiNegatif(exp[0])}}}`
          texteCorr += `=\\dfrac{${base}^{4}}{${base}^{${2 * exp[0]}}}`
          texteCorr += `=${base}^{4-${ecritureParentheseSiNegatif(2 * exp[0])}}`
          texteCorr += `=${base}^{${3 + 1 - 2 * exp[0]}}`
          if (3 + 1 - 2 * exp[0] === 0 || 3 + 1 - 2 * exp[0] === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant est évincé
            texteCorr += '=' + simpExp(base, 3 + 1 - 2 * exp[0])
          }
          texteCorr += '$'
          reponseInteractive = `${base}^{${3 + 1 - 2 * exp[0]}}`
          exposantInteractif = 3 + 1 - 2 * exp[0]
          break
      }
      if (this.interactif && !context.isAmc) {
        setReponse(this, i, reponseInteractive, { formatInteractif: 'puissance' })
        texte += ajouteChampTexteMathLive(this, i, '')
      }
      if (context.isAmc) {
        setReponse(this, i, reponseInteractive, {
          formatInteractif: 'puissance',
          basePuissance: base,
          exposantPuissance: exposantInteractif
        })
      }
      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
}
