import { ecritureParentheseSiNegatif, reduireAxPlusB } from '../../lib/outils/ecritures'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import FractionEtendue from '../../modules/FractionEtendue'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Déterminer une équation réduite de droite'
export const dateDeModifImportante = '27/04/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Description didactique de l'exercice
 * @author Stéphane Guyon
 */
export const uuid = '0cee9'
export const ref = '2G30-2'
export const refs = {
  'fr-fr': ['2G30-2'],
  'fr-ch': ['11FA9-5']
}
export default function EquationReduiteDeDroites () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.sup = 1 // Niveau de difficulté
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    if (this.sup === 1) this.consigne = 'Soit $\\big(O ; \\vec \\imath,\\vec \\jmath\\big)$ un repère orthogonal.<br>Déterminer une équation réduite de ' + (this.nbQuestions !== 1 ? 'chaque' : 'la') + ' droite $(AB)$ avec les points $A$ et $B$ de coordonnées suivantes.'
    else this.consigne = 'Soit $\\big(O ; \\vec \\imath,\\vec \\jmath\\big)$ un repère orthogonal.<br>Déterminer une équation réduite de ' + (this.nbQuestions !== 1 ? 'chaque' : 'la') + ' droite $(d)$  passant par le point $A$  et ayant le vecteur $\\vec {u}$ comme vecteur directeur. $A$ et $\\vec {u}$ ont les coordonnées suivantes.'

    for (let i = 0, texte, xA, yA, xB, yB, n, d, texteCorr, xu, yu, reponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (this.sup === 1) { // case 'A et B':
        xA = randint(-5, 5)
        yA = randint(-5, 5)
        xB = randint(-5, 5, xA)
        yB = randint(-5, 5)
        xu = xB - xA
        yu = yB - yA
        n = yB - yA
        d = xB - xA

        texte = `$A(${xA};${yA})$ et $B(${xB};${yB})$ `
        texteCorr = 'On observe que $ x_B\\neq x_A$.'
        texteCorr += '<br>La droite $(AB)$ a donc une équation du type $y=mx+p$.'
        texteCorr += '<br>On commence par calculer le coefficient directeur $m$ :'
        texteCorr += '<br>On sait d\'après le cours : $m=\\dfrac{y_B-y_A}{x_B-x_A}$.'
        texteCorr += `<br>On applique avec les données de l'énoncé : $m=\\dfrac{${yB}-${ecritureParentheseSiNegatif(yA)}}{${xB}-${ecritureParentheseSiNegatif(xA)}}`
      } else { // case 'A et u':
        xA = randint(-5, 5)
        yA = randint(-5, 5)
        xu = randint(-5, 5, 0)
        yu = randint(-5, 5)
        n = yu
        d = xu

        texte = `$A(${xA};${yA})$ et $\\vec {u} \\begin{pmatrix}${xu}\\\\${yu}\\end{pmatrix}$`
        texteCorr = 'On observe que $ \\vec u$ n\'est pas colinéaire au vecteur $\\vec \\jmath$, puisque son déplacement horizontal est non nul.'
        texteCorr += '<br>La droite $(d)$ n\'est donc pas verticale. Elle admet donc une équation du type : $(d) :y=mx+p$.'
        texteCorr += '<br>On commence par calculer le coefficient directeur $m$.'
        texteCorr += '<br>On sait d\'après le cours que si $\\vec u \\begin{pmatrix}a\\\\b\\end{pmatrix}$, alors $m=\\dfrac{b}{a}$.'
        texteCorr += '<br>On applique avec les données de l\'énoncé : $m'
      }

      const nomDroite = this.sup === 1 ? 'AB' : 'd'
      texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: `<br>$(${nomDroite}) : y=$` })

      reponse = reduireAxPlusB(new FractionEtendue(n, d).simplifie(), new FractionEtendue(d * yA - n * xA, d).simplifie())
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })

      // Correction commune aux deux this.sup
      texteCorr += `=${new FractionEtendue(n, d).texFraction}`
      if ((pgcd(n, d) !== 1 || d === 1 || d < 0 || n < 0) && n !== 0) {
        texteCorr += `=${new FractionEtendue(n, d).texFractionSimplifiee}`
      }
      texteCorr += '$.'

      texteCorr += `<br><br>L'équation de la droite $(${nomDroite})$ est donc de la forme : $y=`
      texteCorr += `${new FractionEtendue(n, d).texFractionSimplifiee} \\times x+p$`
      texteCorr += `<br><br>Comme $A \\in (${nomDroite})$, les coordonnées du point $A$ vérifient l'équation, donc :`
      texteCorr += `<br>$${yA}=${new FractionEtendue(n, d).texFractionSimplifiee} \\times ${ecritureParentheseSiNegatif(xA)} +p$`
      texteCorr += `<br>$\\iff p=${yA}${new FractionEtendue(-n, d).simplifie().texFractionSignee} \\times ${ecritureParentheseSiNegatif(xA)}$`
      texteCorr += `<br>$\\iff p=${new FractionEtendue(d * yA - n * xA, d).texFractionSimplifiee}$`
      texteCorr += `<br>Au final, $(${nomDroite}) : y = ${miseEnEvidence(reponse)}$.`
      // if (d * yA - n * xA !== 0) { // cas ou p!=0 :
      if (this.sup === 1 && yA === yB) {
        texteCorr = `On constate que $y_A=y_B=${yA}$, c'est donc une droite horizontale d'équation $y = ${miseEnEvidence(yA)}$.`
      }
      // }

      if (this.questionJamaisPosee(i, xA, yA, xu, yu)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : Détermination équation réduite de droite à partir de 2 points \n2 : Détermination équation réduite à partir d\'un point et d\'un vecteur directeur.']
}
