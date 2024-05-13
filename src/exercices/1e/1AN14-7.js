import { Polynome } from '../../lib/mathFonctions/Polynome.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { rienSi1 } from '../../lib/outils/ecritures'
import { lettreMinusculeDepuisChiffre } from '../../lib/outils/outilString.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../lib/interactif/comparisonFunctions'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Dérivée d\'une composée affine'

/**
 * Calculer la dérivée de x -> f(ax+b)
 * @author Jean-Léon Henry
 * Référence 1AN14-6
 */

export const uuid = '3391d'
export const refs = {
  'fr-fr': ['1AN14-7'],
  'fr-ch': []
}
export default function DeriveeComposee () {
  Exercice.call(this)
  this.titre = titre
  // this.consigne = "Pour chacune des fonctions suivantes, dire sur quel ensemble elle est dérivable, puis déterminer l'expression de sa fonction dérivée."
  this.consigne = 'Pour chacune des fonctions suivantes, déterminer l\'expression de sa fonction dérivée.'
  this.nbQuestions = 5
  // Sortie LaTeX
  this.nbCols = 2 // Nombre de colonnes
  this.nbColsCorr = 2 // Nombre de colonnes dans la correction
  this.sup = false
  // On modifie les règles de simplifications par défaut de math.js pour éviter 10x+10 = 10(x+1) et -4x=(-4x)
  this.nouvelleVersion = function () {
    this.sup = Number(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.liste_valeurs = [] // Les questions sont différentes du fait du nom de la fonction, donc on stocke les valeurs

    // Types d'énoncés
    const listeTypeDeQuestionsDisponibles = ['monome', 'racine', 'inv']
    if (this.sup) {
      listeTypeDeQuestionsDisponibles.push('exp')
    }
    const listeTypeDeQuestions = combinaisonListes(listeTypeDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, expression, exprF, nameF, deriveeF, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // On génère des fonctions qui pourrait servir
      const coeffs = new Array(randint(2, 9))
      coeffs.fill(0)
      coeffs.push(1)
      const dictFonctions = {
        exp: 'e^',
        racine: '\\sqrt',
        inv: '1/',
        monome: new Polynome({ coeffs })
      }
      const polAff = new Polynome({ rand: true, deg: 1 })
      const a = polAff.monomes[1]
      const b = polAff.monomes[0]
      const typeF = listeTypeDeQuestions[i]
      const f = dictFonctions[typeF]
      // Expression finale de la fonction
      exprF = typeF === 'monome'
        ? f.toMathExpr()
        : typeF === 'inv'
          ? '\\frac{1}{x}'
          : f + '{x}'
      expression = typeF === 'monome'
        ? `${rienSi1(f.monomes[f.deg])}(${polAff})^${f.deg}`
        : typeF === 'inv'
          ? `\\frac{1}{${polAff}}`
          : `${f}{${polAff}}`
      let value = ''

      // Enoncé
      nameF = lettreMinusculeDepuisChiffre(i + 6)
      texte = `$${nameF}(x)=${expression}$`
      // Correction
      texteCorr = 'On rappelle le cours. Si $x$ est un nombre réel tel que $u$ soit dérivable en $ax+b$, alors $v:x\\mapsto u(ax+b)$ est dérivable en $x$ et on a :'
      texteCorr += '\\[v\'(x)=a\\times u\'(ax+b).\\]'
      // Déterminons la dérivée de u
      switch (typeF) {
        case 'exp':
          deriveeF = 'e^x'
          break
        case 'inv':
          deriveeF = '\\frac{-1}{x^2}'
          break
        case 'racine':
          deriveeF = '\\frac{1}{2\\sqrt{x}}'
          break
        case 'monome':
          deriveeF = f.derivee().toLatex()
          break
      }
      texteCorr += `Ici : \\[\\begin{aligned}u(x)&=${exprF}\\\\ u^\\prime(x)&=${deriveeF}\\\\a&=${a}\\\\b&=${b}.\\end{aligned}\\]`
      texteCorr += `Soit $x$ un réel de l'ensemble de dérivabilité de $${nameF}$. On a, en appliquant la formule ci-dessus : `
      switch (typeF) {
        case 'exp':
          texteCorr += `\\[${nameF}'(x)=${rienSi1(a)}e^{${polAff}}.\\]`
          break
        case 'inv':
          texteCorr += `\\[${nameF}'(x)=${a}\\times ${`\\frac{-1}{(${polAff})^2}`}.\\]`
          texteCorr += 'D\'où, en simplifiant : '
          texteCorr += `\\[${nameF}'(x)=${`\\frac{${-a}}{(${polAff})^2}`}.\\]`
          value = `${`\\frac{${-a}}{(${polAff})^2}`}`
          break
        case 'racine': {
          texteCorr += `\\[${nameF}'(x)=${a}\\times${`\\frac{1}{2\\sqrt{${polAff}}}`}.\\]`
          texteCorr += 'D\'où, en simplifiant :'
          const num = a % 2 === 0 ? a / 2 : a
          const den = `${a % 2 === 0 ? '' : '2'}\\sqrt{${polAff}}`
          texteCorr += `\\[${nameF}'(x)=${`\\frac{${num}}{${den}}`}.\\]`
          value = `${`\\frac{${num}}{${den}}`}`
          break
        }
        case 'monome':
          texteCorr += `\\[${nameF}'(x)=${a}\\times ${`${f.deg}(${polAff})${f.deg === 2 ? '' : `^{${f.deg - 1}}`}`}.\\]`
          texteCorr += 'D\'où, en simplifiant : '
          texteCorr += `\\[${nameF}'(x)=${a * f.deg}(${polAff})${f.deg === 2 ? '' : `^{${f.deg - 1}}`}.\\]`
          value = `${a * f.deg}(${polAff})${f.deg === 2 ? '' : `^{${f.deg - 1}}`}`

          if (f.deg === 2) {
            texteCorr += 'On développe et on réduit pour obtenir  :'
            texteCorr += `\\[${nameF}'(x)=${polAff.multiply(2 * a)}\\]`
            value = `${polAff.multiply(2 * a)}`
          }
          break
        default:
          texteCorr += 'Correction non encore implémentée.'
          break
      }
      texte = texte.replaceAll('\\frac', '\\dfrac') + ajouteChampTexteMathLive(this, i, 'inline largeur01')
      texteCorr = texteCorr.replaceAll('\\frac', '\\dfrac')

      if (this.liste_valeurs.indexOf(expression) === -1) {
        this.liste_valeurs.push(expression)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        handleAnswers(this, i, { reponse: { value, compare: functionCompare } })
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Inclure l\'exponentielle']
}
