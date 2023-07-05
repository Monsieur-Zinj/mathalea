// import { ajouteChampTexte, setReponse } from '../../modules/gestionInteractif.js'
// import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { spline } from '../../modules/mathFonctions/Spline.js'
import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { repere, texteParPosition } from '../../modules/2d.js'
import { tableauDeVariation } from '../../modules/TableauDeVariation.js'
import { choice, listeQuestionsToContenu, randint, stringNombre } from '../../modules/outils.js'

export const titre = 'Déterminer le tableau de signes d\'une fonction graphiquement.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '04/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'a7860' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = '2F22-3'// @todo à modifier aussi
// une liste de nœuds pour définir une fonction Spline
const noeuds1 = [{ x: -4, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: -3, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: -2, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: -1, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
  { x: 0, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
  { x: 2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
  { x: 3, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 4, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: 5, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: false }
]
// une autre liste de nœuds...
const noeuds2 = [{ x: -5, y: 0, deriveeGauche: 1.5, deriveeDroit: 1.5, isVisible: false },
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

const noeuds3 = [{ x: -6, y: -4, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
  { x: -2, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
  { x: 2, y: 2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 4, y: 0, deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
  { x: 6, y: -3, deriveeGauche: -1, deriveeDroit: -1, isVisible: true }
]

const noeuds4 = [{ x: -5, y: 4, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
  { x: -4, y: 2, deriveeGauche: -0.8, deriveeDroit: -1.5, isVisible: true },
  { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1.5, isVisible: true },
  { x: 0, y: -3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 1, y: -1, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
  { x: 2, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: 3, y: -3, deriveeGauche: 1, deriveeDroit: 1, isVisible: true }
]

// une liste des listes
const mesFonctions = [noeuds4]//, noeuds1, noeuds2,

/**
 * trouve les extrema mais ne fonctionne que si les extrema se trouvent en des noeuds.
 * @param {{x: number, y:number,deriveeGauche:number,deriveeDroit:number, isVisible:boolean}[]} nuage les noeuds
 * @returns {{yMin: number, yMax: number, xMax: number, xMin: number}}
 */
function trouveMaxes (nuage) {
  const xMin = Math.floor(Math.min(...nuage.map(el => el.x)) - 1)
  const yMin = Math.floor(Math.min(...nuage.map(el => el.y)) - 1)
  const xMax = Math.ceil(Math.max(...nuage.map(el => el.x)) + 1)
  const yMax = Math.ceil(Math.max(...nuage.map(el => el.y)) + 1)
  return { xMin, xMax, yMin, yMax }
}

/**
 * choisit les caractèristique de la transformation de la courbe
 * @returns {{coeffX: -1|1, deltaX: int, deltaY: int, coeffY: -1|1}}
 */
function aleatoiriseCourbe () {
  const coeffX = choice([-1, 1]) // symétries ou pas
  const coeffY = choice([-1, 1])
  const deltaX = randint(-2, +2) // translations
  const deltaY = 0// randint(-2, +2)
  return { coeffX, coeffY, deltaX, deltaY }
}

/**
 * Aléatoirise une courbe et demande les antécédents d'une valeur entière (eux aussi entiers)
 * @author Gilles Mora (Jean-Claude Lhote pour la programmation)
 * Référence (2F22-3)
 */
export default class BetaModeleSpline extends Exercice {
  constructor () {
    super()
    this.titre = titre
    // this.sup = '4'
    this.nbQuestions = 1 // Nombre de questions par défaut
    // this.besoinFormulaireTexte = ['Réglages des questions :', '1 : Un seul antécédent\n2 : Deux antécédents\n3 : trois antécédents\n4 : De un à trois antécédents\n5 : De 0 à 3 antécédents\n6 : Mélange']
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    // const typeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 5, melange: 6, defaut: 4, nbQuestions: this.nbQuestions })
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
      const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      const maSpline = spline(nuage)
      const { xMin, xMax, yMin, yMax } = trouveMaxes(nuage)
      const repere1 = repere({
        xMin: xMin - 1,
        xMax: xMax + 1,
        yMin: yMin - 1,
        yMax: yMax + 1,
        grilleX: false,
        grilleY: false,
        grilleSecondaire: true,
        grilleSecondaireYDistance: 1,
        grilleSecondaireXDistance: 1,
        grilleSecondaireYMin: yMin - 1,
        grilleSecondaireYMax: yMax + 1,
        grilleSecondaireXMin: xMin - 1,
        grilleSecondaireXMax: xMax + 1
      })
      const courbe1 = maSpline.courbe({
        repere: repere1,
        epaisseur: 1.5,
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'blue', taille: 2, style: 'x', epaisseur: 2 },
        color: 'blue'
      })
      const objetsEnonce = [repere1, courbe1]
      let texteEnonce = mathalea2d(Object.assign({}, fixeBordures(objetsEnonce)), objetsEnonce, o)

      texteEnonce += '<br>Dresser le tableau de signes de $f(x)$ sur son ensemble de définition.'
      // const objetsCorrection = [repere1]
      // on ajoute les tracés pour repérer les antécédents et on en profite pour rendre les autres noeuds invisibles

      let texteCorrection = `
      `
      texteCorrection += '<br>voici les signes de $f$ : '
      // on stocke le tableau de signes dans une variable
      const signes = maSpline.signes()
      console.log(JSON.stringify(signes))
      const initialValue = []
      const premiereLigne = signes.reduce((previousElt, currentElt) => previousElt.concat([stringNombre(currentElt.xG, 1), 10]), initialValue)
      premiereLigne.push(stringNombre(signes[signes.length - 1].xD), 10)
      const tabLine = ['Line', 30]
      if (maSpline.image(maSpline.x[0]) === 0) {
        tabLine.push('z', 20)
      } else {
        tabLine.push('', 20)
      }
      for (const signe of signes) {
        tabLine.push(signe.signe, 20)
        tabLine.push('z', 20)
      }
      if (maSpline.image(maSpline.x[maSpline.n - 1]) !== 0) {
        tabLine.splice(-3, 3)
      }
      // for (let k = 0; k < signes.length; k++) {
      // texteCorrection += `<br>Sur [${signes[k].xG};${signes[k].xD}] la fonction est ${signes[k].signe === '+' ? 'positive' : 'négative'}`
      // }

      texteCorrection += mathalea2d({ xmin: -0.5, ymin: -5.1, xmax: 30, ymax: 0.1, scale: 0.5 }, tableauDeVariation({
        tabInit: [
          [
            // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
            ['$x$', 2, 30], ['$f(x)$', 2, 50]
          ],
          // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
          premiereLigne
        ],
        // tabLines ci-dessous contient les autres lignes du tableau.
        tabLines: [tabLine],
        colorBackground: '',
        espcl: 3.5, // taille en cm entre deux antécédents
        deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
        lgt: 5, // taille de la première colonne en cm
        hauteurLignes: [15, 15],
        latex: false
      }))

      this.listeQuestions.push(texteEnonce)
      this.listeCorrections.push(texteCorrection)
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
