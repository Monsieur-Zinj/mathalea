import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Calculer les coordonnées de la somme de deux vecteurs'
export const dateDePublication = '21/05/2023'

/**
 * Somme de deux vecteurs à l'aide des coordonnées
 * @author Stéphan Grignon
 */
export const uuid = '49570'
export const ref = '2G24-2'
export const refs = {
  'fr-fr': ['2G24-2'],
  'fr-ch': []
}
export default function Calculercoordonneessommevecteurs () {
  Exercice.call(this)
  this.titre = titre
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = ['t1'] // On donne 2 vecteurs à coordonnées entières
    } else {
      if (this.sup === 2) {
        typeDeQuestionsDisponibles = ['t2'] // On donne 2 vecteurs à coordonnées fractionnaires
      } else {
        if (this.sup === 3) {
          typeDeQuestionsDisponibles = ['t3'] // On donne 4 points à coordonnées entières
        } else {
          typeDeQuestionsDisponibles = ['t1', 't2', 't3']
        }
      }
    }
    const listeTypeDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, wxFraction, wyFraction, texte, texteCorr, typesDeQuestions, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      switch (typesDeQuestions) {
        case 't1': { // On donne 2 vecteurs à coordonnées entières
          const ux = randint(-9, 9)
          let uy
          if (ux === 0) {
            uy = randint(-9, 9, [0])
          } else {
            uy = randint(-9, 9)
          } // Premier vecteur jamais nul
          const vx = randint(-9, 9)
          let vy
          if (vx === 0) {
            vy = randint(-9, 9, [0])
          } else {
            vy = randint(-9, 9)
          } // Second vecteur jamais nul
          wxFraction = new FractionEtendue(ux + vx, 1)
          wyFraction = new FractionEtendue(uy + vy, 1)

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux}\\\\${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}\\\\${vy}\\end{pmatrix}$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$.'

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux}+${ecritureParentheseSiNegatif(vx)}\\\\${uy}+${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\${wyFraction.texFraction}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br>'
            texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br>'
            texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${ux}+${ecritureParentheseSiNegatif(vx)}\\\\${uy}+${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$.<br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\${wyFraction.texFraction}\\end{pmatrix}$.<br>`
          }
          if (wxFraction.valeurDecimale === 0 && wyFraction.valeurDecimale === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont opposés $\\overrightarrow{u}=-\\overrightarrow{v}$.'
          }
        }
          break

        case 't2': { // On donne 2 vecteurs à coordonnées fractionnaires
          const listeFractions1 = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4],
            [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]]
          const frac1 = choice(listeFractions1)
          const ux = new FractionEtendue(frac1[0], frac1[1])
          const frac2 = choice(listeFractions1)
          const uy = new FractionEtendue(frac2[0], frac2[1])

          let frac3 = choice(listeFractions1)
          while (frac3[1] === frac1[1]) {
            frac3 = choice(listeFractions1)
          }
          const vx = new FractionEtendue(frac3[0], frac3[1])
          let frac4 = choice(listeFractions1)
          while (frac4[1] === frac2[1]) {
            frac4 = choice(listeFractions1)
          }
          const vy = randint(-9, 9, [0])

          const a = frac1[0] * frac3[1] + frac3[0] * frac1[1]
          const b = frac1[1] * frac3[1]
          wxFraction = new FractionEtendue(a, b).simplifie()

          const c = frac2[0] + frac2[1] * vy
          const d = frac2[1]

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux.texFraction}\\\\[0.7em]${uy.texFraction}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx.texFraction}\\\\[0.7em]${vy}\\end{pmatrix}$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$.'

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux.texFraction}+${vx.texFraction}\\\\[0.7em]${uy.texFraction}+${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$`
          if (vy < 0) {
            wyFraction = new FractionEtendue(c * -1, d).simplifie()
            texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\[0.7em]-${wyFraction.texFraction}\\end{pmatrix}$.<br>`
          } else {
            wyFraction = new FractionEtendue(c, d).simplifie()
            texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\[0.7em]${wyFraction.texFraction}\\end{pmatrix}$.<br>`
          }
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br>'
            texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br>'
            texteCorr += `On applique ici aux données de l'énoncé :
            $\\overrightarrow{w}\\begin{pmatrix}${ux.texFraction}+${vx.texFraction}\\\\[0.7em]${uy.texFraction}+${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$.<br>`
            if (vy < 0) {
              wyFraction = new FractionEtendue(c * -1, d).simplifie()
              texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\[0.7em]-${wyFraction.texFraction}\\end{pmatrix}$.<br>`
            } else {
              wyFraction = new FractionEtendue(c, d).simplifie()
              texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\[0.7em]${wyFraction.texFraction}\\end{pmatrix}$.<br>`
            }
          }
          if (wxFraction.valeurDecimale === 0 && wyFraction.valeurDecimale === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont opposés $\\overrightarrow{u}=-\\overrightarrow{v}$.'
          }
        }
          break

        case 't3': { // On donne 4 points à coordonnées entières
          const xA = randint(-9, 9)
          const yA = randint(-9, 9, [xA])
          const xB = randint(-9, 9)
          const yB = randint(-9, 9, [xB])
          const xC = randint(-9, 9)
          const yC = randint(-9, 9, [xC])
          const xD = randint(-9, 9)
          const yD = randint(-9, 9, [xD])
          wxFraction = new FractionEtendue((xB - xA) + (xD - xC), 1)
          wyFraction = new FractionEtendue((yB - yA) + (yD - yC), 1)

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les points suivants : $A\\left(${xA};${yA}\\right)$, $B\\left(${xB};${yB}\\right)$, $C\\left(${xC};${yC}\\right)$ et $D\\left(${xD};${yD}\\right)$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{AB}+\\overrightarrow{CD}$.'

          texteCorr = `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{w}\\begin{pmatrix}${xB - xA}+${ecritureParentheseSiNegatif(xD - xC)}\\\\${yB - yA}+${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\${wyFraction.texFraction}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
            texteCorr += 'On applique ici aux données de l\'énoncé :<br><br>'
            texteCorr += `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
            texteCorr += 'Soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br>'
            texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br>'
            texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${xB - xA}+${ecritureParentheseSiNegatif(xD - xC)}\\\\${yB - yA}+${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$.<br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wxFraction.texFraction}\\\\${wyFraction.texFraction}\\end{pmatrix}$.<br>`
          }
          if (wxFraction.valeurDecimale === 0 && wyFraction.valeurDecimale === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{AB}$ et $\\overrightarrow{CD}$ sont opposés $\\overrightarrow{AB}=-\\overrightarrow{CD}$.'
          }
        }
          break
      }
      texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texteAvant: '<br><br>Composante sur $x$ de $\\overrightarrow{w}$ :' })
      texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline', { texteAvant: '<br><br>Composante sur $y$ de $\\overrightarrow{w}$ :' })
      setReponse(this, 2 * i, wxFraction, { formatInteractif: 'fractionEgale' })
      setReponse(this, 2 * i + 1, wyFraction, { formatInteractif: 'fractionEgale' })
      if (this.questionJamaisPosee(i, wxFraction.texFraction, wyFraction.texFraction)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Situations différentes ', 4, '1 : Coordonnées entières\n 2 : Coordonnées en écriture fractionnaire\n 3 : À partir de quatre points\n4 : Mélange']
}
