import { Courbe } from '../../lib/2d/courbes.js'
import { Repere } from '../../lib/2d/reperes.js'
import { brent, tableauSignesFonction, tableauVariationsFonction } from '../../lib/mathFonctions/etudeFonction.js'
// import { Polynome } from '../../lib/mathFonctions/Polynome.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import Exercice from '../Exercice.ts'
import FractionEtendue from '../../modules/FractionEtendue.ts'

export const titre = 'Recherche d\'antécédents'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '22/06/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'betaFonction' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = 'betaFonction'// @todo à modifier aussi

/**
 * Aléatoirise un polynome et dresse le tableau de signes et le tableau de variations
 * @author Jean-Claude Lhote
 * Référence (betaPolynome)
 */
export default class BetaEtudeFonction extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.sup = 3
    this.nbQuestions = 1 // Nombre de questions par défaut
    this.nbQuestionsModifiable = false
    this.besoinFormulaireNumerique = ['Degré du polynôme:', 5]
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    //
    /* const poly = new Polynome({ deg: this.sup, rand: true })
    const fonction = poly.fonction
    const polyDerivee = poly.derivee()
    const derivee = polyDerivee.fonction.bind(polyDerivee)
    const latexFonction = poly.toLatex()
    const fonction = x => x * Math.sin(Math.PI * x / 4) // Pour le tableau de signes et de variations
    const derivee = x => Math.sin(Math.PI * x / 4) + Math.PI * x * Math.cos(Math.PI * x / 4) / 4 // pour le tableau de variations
    const latexFonction = 'x\\sin(\\frac{\\Pi x}{4})' // pour l'énoncé
    const { xMin, xMax, yMin, yMax } = { xMin: -5, xMax: 5, yMin: -10, yMax: 10 } // pour le repère et la courbe
    //     Avec une exponentielle

    const fonction = x => x * Math.exp(-x) // Pour le tableau de signes et de variations
    const derivee = x => (1 - x) * Math.exp(-x) // pour le tableau de variations
    const latexFonction = 'x\\exp(-x)' // pour l'énoncé
    const { xMin, xMax, yMin, yMax } = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 } // pour le repère et la courbe
   */
    //     Avec ln
    const fonction = x => x * Math.log(Math.abs(x)) // Pour le tableau de signes et de variations
    const derivee = x => 1 + Math.log(Math.abs(x)) // pour le tableau de variations
    const latexFonction = 'x\\ln(|x|)' // pour l'énoncé

    // Exemple d'utilisation
    function exampleFunction (x) {
      return Math.log(x / 5)
    }

    const time = Date.now()
    const { root, iter } = brent(exampleFunction, 1, 10, 1e-13)
    const duree = Date.now() - time
    console.log(`Racine trouvée : ${root} en ${iter} itérations : f(${root})=${exampleFunction(root)} en ${duree}ms `)
    /*
    const { xMin, xMax, yMin, yMax } = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 } // pour le repère et la courbe
    const repere1 = new Repere({
      xMin,
      xMax,
      yMin,
      yMax,
      xUnite: 1,
      yUnite: 1
    })
    const courbe1 = new Courbe(fonction, {
      repere1,
      xMin,
      xMax,
      yMin,
      yMax,
      xUnite: 1,
      yUnite: 1,
      epaisseur: 1,
      step: 0.05
    })
    const objetsEnonce = [repere1, courbe1]
    let texteEnonce = mathalea2d(Object.assign({}, fixeBordures(objetsEnonce)), objetsEnonce)
    texteEnonce += `<br>Voici la représentation graphique d'une fonction définie par : $f(x)=${latexFonction}$.`
    texteEnonce += '<br>Donnez un tableau de signes de f.'
    texteEnonce += '<br>Donnez les variations de f.'
    const objetsCorrection = [repere1]
    objetsCorrection.push(courbe1)
    let texteCorrection = mathalea2d(Object.assign({}, fixeBordures(objetsCorrection)), objetsCorrection)
    texteCorrection += '<br>voici les signes de f : '
    const tableauSignes = tableauSignesFonction(fonction, xMin, xMax, { substituts: [], step: new FractionEtendue(1, 100), tolerance: 0.001 })
    const tableauVariations = tableauVariationsFonction(fonction, derivee, xMin, xMax, {
      ligneDerivee: true,
      substituts: [
        { antVal: -10, antTex: '-\\infty', imgVal: -23.026, imgTex: '-\\infty' },
        { antVal: 10, antTex: '+\\infty', imgVal: 23.026, imgTex: '+\\infty' },
        { antVal: -0.36, antTex: '-\\frac{1}{e}', imgVal: 0.368, imgTex: '\\frac{1}{e}' },
        { antVal: 0.37, antTex: '\\frac{1}{e}', imgVal: -0.368, imgTex: '-\\frac{1}{e}' }
      ],
      step: new FractionEtendue(1, 100),
      tolerance: 0.001
    })
    // Attention ! les tableaux de variations et de signes sont des string (html ou latex) plus des objetsMathalea2d.
    texteCorrection += tableauSignes // `<br>${mathalea2d(Object.assign({}, fixeBordures([tableauSignes])), tableauSignes)}`
    texteCorrection += tableauVariations // `<br>${mathalea2d(Object.assign({}, fixeBordures([tableauVariations])), tableauVariations)}`
    this.listeQuestions.push(texteEnonce)
    this.listeCorrections.push(texteCorrection)
    listeQuestionsToContenu(this)// On envoie l'exercice à la fonction de mise en page

 */
  }
}
