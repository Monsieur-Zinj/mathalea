import Exercice from '../../deprecatedExercice.js'
import { combinaisonListes } from '../../../lib/outils/arrayOutils'
import {
  reduireAxPlusB,
  reduirePolynomeDegre3
} from '../../../lib/outils/ecritures'
import { lettreMinusculeDepuisChiffre, sp } from '../../../lib/outils/outilString.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../../lib/interactif/comparisonFunctions'
import { context } from '../../../modules/context'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Calculs de dérivées'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Calculs de dérivés
 * @author Rémi Angot
 * Référence 1F10
*/
export const uuid = '2af1c'
export const ref = '1F10'
export const refs = {
  'fr-fr': ['1F10'],
  'fr-ch': []
}
export default function CalculsDeDerives () {
  Exercice.call(this)
  this.titre = titre
  this.nbQuestions = 6
  this.nbCols = 2 // Nombre de colonnes pour la sortie LaTeX
  this.nbColsCorr = 2 // Nombre de colonnes dans la correction pour la sortie LaTeX
  this.sup = 1
  this.nouvelleVersion = function () {
    const quoi = this.nbQuestions === 1 ? 'la dérivée de la fonction suivante' : 'les dérivées des fonctions suivantes'
    this.consigne = 'Donner ' + quoi

    this.sup = Number(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.liste_valeurs = [] // Les questions sont différentes du fait du nom de la fonction, donc on stocke les valeurs

    let listeTypeDeQuestionsDisponibles
    if (this.sup === 1) {
      listeTypeDeQuestionsDisponibles = ['ax+b', 'a', 'ax2+bx+c', 'xn', 'xn+xm', '1/x', 'xn+1/x', '1/xn', 'xn+1/xm', 'racine(x)']
    } else if (this.sup === 2) {
      listeTypeDeQuestionsDisponibles = ['ax+b', 'axn', 'a/x', 'a/xn', 'racine(ax)']
    } else {
      listeTypeDeQuestionsDisponibles = ['ax+b', 'axn', 'a/x', 'a/xn', 'racine(ax)']
    }
    const listeTypeDeQuestions = combinaisonListes(listeTypeDeQuestionsDisponibles, this.nbQuestions)

    for (let i = 0, texte, texteCorr, a, b, c, n, m, expression, derivee, domaine, ensembleDerivation, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeDeQuestions[i]) {
        case 'a':
          a = randint(-10, 10, 0)
          expression = `${a}`
          derivee = '0'
          ensembleDerivation = '\\mathbb{R}'
          domaine = [-10, 10]
          break
        case 'ax+b':
          a = randint(-10, 10, 0)
          b = randint(-10, 10, 0)
          derivee = String(a)
          expression = reduireAxPlusB(a, b, 'x')
          ensembleDerivation = '\\mathbb{R}'
          domaine = [-10, 10]
          break
        case 'ax2+bx+c':
          a = randint(-10, 10, 0)
          b = randint(-10, 10, 0)
          c = randint(-10, 10, 0)
          derivee = reduireAxPlusB(2 * a, b)
          expression = reduirePolynomeDegre3(0, a, b, c, 'x')
          ensembleDerivation = '\\mathbb{R}'
          domaine = [-10, 10]
          break
        case 'xn':
          n = randint(2, 10)
          expression = `x^${n}`
          derivee = `${n}${n === 2 ? 'x' : `x^${n - 1}`}`
          ensembleDerivation = '\\mathbb{R}'
          domaine = [-10, 10]
          break
        case 'xn+1/x':
          n = randint(2, 10)
          expression = `x^${n}+\\dfrac{1}{x}`
          derivee = `${n}${n === 2 ? 'x' : `x^${n - 1}`}-\\dfrac{1}{x^2}`
          ensembleDerivation = '\\mathbb{R}^{\\text{*}}'
          domaine = [1, 10]
          break
        case 'xn+1/xm':
          n = randint(2, 10)
          m = randint(2, 10, m)
          expression = `x^${n}+\\dfrac{1}{x^${m}}`
          derivee = `${n}${n === 2 ? 'x' : `x^${n - 1}`}-\\dfrac{${m}}{x^${m + 1}}`
          ensembleDerivation = '\\mathbb{R}^{\\text{*}}'
          domaine = [1, 10]
          break
        case 'xn+xm':
          n = randint(2, 10)
          m = randint(2, 10, n)
          expression = `x^${n}+x^${m}`
          derivee = `${n}${n === 2 ? 'x' : `x^${n - 1}`}+${m}${m === 2 ? 'x' : `x^${m - 1}`}`
          ensembleDerivation = '\\mathbb{R}'
          domaine = [-10, 10]
          break
        case 'axn':
          a = randint(-10, 10, [0, 1, -1])
          n = randint(2, 10)
          expression = `${a}x^${n}`
          derivee = `${texNombre(a * n, 0)}${n === 2 ? 'x' : `x^${n - 1}`}`
          ensembleDerivation = '\\mathbb{R}'
          domaine = [-10, 10]
          break
        case '1/x':
          expression = '\\dfrac{1}{x}'
          derivee = '\\dfrac{-1}{x^2}'
          ensembleDerivation = '\\mathbb{R}^{\\text{*}}'
          domaine = [1, 10]
          break
        case 'a/x':
          a = randint(-10, 10, [0, 1])
          expression = `\\dfrac{${a}}{x}`
          derivee = `\\dfrac{${texNombre(-a, 0)}}{x^2}`
          ensembleDerivation = '\\mathbb{R}^{\\text{*}}'
          domaine = [1, 10]
          break
        case '1/xn':
          n = randint(2, 10)
          expression = `\\dfrac{${1}}{x^${n}}`
          derivee = `-\\dfrac{${n}}{x^${n + 1}}`
          ensembleDerivation = '\\mathbb{R}^{\\text{*}}'
          domaine = [1, 10]
          break
        case 'a/xn':
          a = randint(-10, 10, [1, 0])
          n = randint(2, 10)
          expression = `\\dfrac{${a}}{x^${n}}`
          derivee = `-\\dfrac{${texNombre(a * n, 0)}}{x^${n + 1}}`
          ensembleDerivation = '\\mathbb{R}^{\\text{*}}'
          domaine = [1, 10]
          break
        case 'racine(x)':
          expression = '\\sqrt(x)'
          derivee = '\\dfrac{1}{2\\sqrt{x}}'
          ensembleDerivation = ']0,+\\infty['
          domaine = [1, 10]
          break
        case 'racine(ax)':
          a = randint(2, 10, [4, 9])
          expression = `\\sqrt(${a}x)`
          derivee = `\\dfrac{${a}}{2\\sqrt{x}}`
          ensembleDerivation = ']0,+\\infty['
          domaine = [1, 10]
          break
      }

      texte = `$${lettreMinusculeDepuisChiffre(i + 6)}:x\\longmapsto ${expression}$` + sp(10) + ';' + sp(10) + remplisLesBlancs(this, i, `${lettreMinusculeDepuisChiffre(i + 6)}':x\\longmapsto %{champ1}`)
      texteCorr = `$${lettreMinusculeDepuisChiffre(i + 6)}$ est dérivable sur $${ensembleDerivation}$ et $ ${lettreMinusculeDepuisChiffre(i + 6)}':x\\longmapsto ${derivee}$`
      if (!context.isAmc) {
        handleAnswers(this, i, { champ1: { value: derivee, options: { variable: 'x', domaine }, compare: functionCompare } })
      }

      if (this.liste_valeurs.indexOf(expression) === -1) {
        this.liste_valeurs.push(expression)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : Fonctions de base \n2 : ku'] // \n3 : u/v, uv'];
}
