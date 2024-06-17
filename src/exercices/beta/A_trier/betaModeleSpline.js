import { repere } from '../../../lib/2d/reperes.js'
import { inferieurSuperieur } from '../../../lib/mathFonctions/etudeFonction.js'
import { spline } from '../../../lib/mathFonctions/Spline.js'
import { choice } from '../../../lib/outils/arrayOutils.js'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import FractionEtendue from '../../../modules/FractionEtendue.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'

export const titre = 'Recherche d\'antécédents'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '22/06/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'betaSpline' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = 'betaSpline'// @todo à modifier aussi
// une liste de nœuds pour définir une fonction Spline
const noeuds1 = [{ x: -4, y: -0.5, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: -3, y: 1, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: -2, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: -1, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
  { x: 0, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 2, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 3, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 4, y: -3.5, deriveeGauche: 0, deriveeDroit: 0, isVisible: false }
]
// une autre liste de nœuds...
const noeuds2 = [{ x: -5, y: 0.5, deriveeGauche: 1.5, deriveeDroit: 1.5, isVisible: false },
  { x: -4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: -3, y: 2.3, deriveeGauche: -1.2, deriveeDroit: -1.2, isVisible: false },
  { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
  { x: -1, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 0, y: -0.5, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: 1, y: 3, deriveeGauche: 3, deriveeDroit: 3, isVisible: true },
  { x: 2, y: 5, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 3, y: 4, deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
  { x: 4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 5, y: 4, deriveeGauche: 0.5, deriveeDroit: 0.5, isVisible: true },
  { x: 6, y: 5, deriveeGauche: 0.2, deriveeDroit: 0.2, isVisible: true }
]
// une liste des listes
const mesFonctions = [noeuds1, noeuds2]

/**
 * choisit les caractèristique de la transformation de la courbe
 * @returns {{coeffX: -1|1, deltaX: int, deltaY: int, coeffY: -1|1}}
 */
function aleatoiriseCourbe () {
  const coeffX = choice([-1, 1]) // symétries ou pas
  const coeffY = choice([-1, 1])
  const deltaX = randint(-2, +2) // translations
  const deltaY = randint(-2, +2)
  return { coeffX, coeffY, deltaX, deltaY }
}

function nombreAntecedents (choix) {
  switch (choix) {
    case 1:
    case 2:
    case 3:
      return choix
    case 4:
      return randint(1, 3)
    default:
      return randint(0, 3)
  }
}

/**
 * Aléatoirise une courbe et demande les antécédents d'une valeur entière (eux aussi entiers)
 * @author Jean-Claude Lhote
 * Référence (2F22-1)
 */
export default class BetaModeleSpline extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.sup = '4'
    this.spacingCorr = 2.5
    this.nbQuestions = 1 // Nombre de questions par défaut
    this.besoinFormulaireTexte = ['Réglages des questions :', '1 : Un seul antécédent\n2 : Deux antécédents\n3 : trois antécédents\n4 : De un à trois antécédents\n5 : De 0 à 3 antécédents\n6 : Mélange']
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const typeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 5,
      melange: 6,
      defaut: 4,
      nbQuestions: this.nbQuestions
    })
    // boucle de création des différentes questions
    for (let i = 0; i < this.nbQuestions; i++) {
      const { coeffX, coeffY, deltaX, deltaY } = aleatoiriseCourbe()
      // la liste des noeuds de notre fonction
      const nuage = choice(mesFonctions).map((noeud) => Object({
        x: (noeud.x + deltaX) * coeffX,
        y: (noeud.y + deltaY) * coeffY,
        deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
        deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
        isVisible: noeud.isVisible
      }))
      const maSpline = spline(nuage)
      const { xMin, xMax, yMin, yMax } = maSpline.trouveMaxes()
      const nombreAntecedentCherches = nombreAntecedents(Number(typeDeQuestions[i]))
      const y0 = maSpline.trouveYPourNAntecedents(nombreAntecedentCherches, yMin, yMax)
      const solutions = inferieurSuperieur(maSpline.fonction, y0, xMin + 1, xMax - 1, true, false)

      const reponse = solutions.length === 0
        ? 'aucun'
        : solutions.map((intervalle) => intervalle.borneG.x === intervalle.borneD.x
          ? `{${intervalle.borneG.x}}`
          : `[${intervalle.borneG.x};${intervalle.borneD.x}]`
        ).join('U')
      // le repère dans lequel sera tracé la courbe (il est important que xMin et yMin soient entiers d'où les arrondis lors de leur définition plus haut
      const repere1 = repere({
        xMin: xMin - 1,
        xMax: xMax + 1,
        yMin: yMin - 1,
        yMax: yMax + 1
      })
      const courbe1 = maSpline.courbe({
        repere: repere1,
        epaisseur: 1,
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'black', taille: 1, style: '.', epaisseur: 1 }
      })
      const objetsEnonce = [repere1, courbe1]
      let texteEnonce = mathalea2d(Object.assign({}, fixeBordures(objetsEnonce)), objetsEnonce)
      texteEnonce += `<br>Quel sont les solutions de l'équation $f(x)<=${y0}$ ?`
      texteEnonce += '<br>Donnez un tableau de signes de f.'
      texteEnonce += '<br>Donnez les variations de f.'

      const objetsCorrection = [repere1]
      const courbeAvecTraces = maSpline.courbe({
        repere: repere1,
        epaisseur: 1,
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'black', taille: 1, style: '.', epaisseur: 1 }
      })
      objetsCorrection.push(courbeAvecTraces)
      let texteCorrection = mathalea2d(Object.assign({}, fixeBordures(objetsCorrection)), objetsCorrection)
      texteCorrection += `<br>voici les solutions de $f(x)<=${y0}$ : ${reponse}.`
      texteCorrection += '<br>voici les signes de f : '
      const signes = maSpline.signes(new FractionEtendue(1, 120))
      for (let k = 0; k < signes.length; k++) {
        texteCorrection += `<br>Sur $[${signes[k].xG.texFSD};${signes[k].xD.texFSD}]$ la fonction est ${signes[k].signe === '+' ? 'positive' : 'négative'}`
      }
      const variations = maSpline.variations(new FractionEtendue(1, 3))
      for (let k = 0; k < variations.length; k++) {
        texteCorrection += `<br>Sur $[${variations[k].xG.texFSD};${variations[k].xD.texFSD}]$ la fonction est ${variations[k].variation === 'croissant' ? 'croissante' : 'décroissante'}`
      }

      this.listeQuestions.push(texteEnonce)
      this.listeCorrections.push(texteCorrection)
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
