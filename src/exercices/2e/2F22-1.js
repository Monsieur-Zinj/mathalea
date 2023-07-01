import { ajouteChampTexte, setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { spline } from '../../modules/mathFonctions/fonctionsMaths.js'
import { repere, lectureAntecedent } from '../../modules/2d.js'
import { choice, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'

export const titre = 'Recherche d\'antécédents'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '22/06/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'a2ac2' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = '2F22-1'// @todo à modifier aussi
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
    this.nbQuestions = 1 // Nombre de questions par défaut
    this.besoinFormulaireTexte = ['Réglages des questions :', '1 : Un seul antécédent\n2 : Deux antécédents\n3 : trois antécédents\n4 : De un à trois antécédents\n5 : De 0 à 3 antécédents\n6 : Mélange']
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const typeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 5, melange: 6, defaut: 4, nbQuestions: this.nbQuestions })
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
      const { xMin, xMax, yMin, yMax } = trouveMaxes(nuage)
      const nombreAntecedentCherches = nombreAntecedents(Number(typeDeQuestions[i]))
      const y0 = maSpline.trouveYPourNAntecedentsEntiers(nombreAntecedentCherches, yMin, yMax)
      const solutions = maSpline.solve(y0)
      const reponse = solutions.length === 0 ? 'aucun' : `${solutions.join(';')}`
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
      texteEnonce += `<br>Quel est le nombre d'antécédents de ${y0} ?` + ajouteChampTexteMathLive(this, 2 * i, 'inline largeur10')
      texteEnonce += '<br>Donne ces antécédents rangés par ordre croissant séparés par des points-virgules (saisir aucun s\'il n\'y en a pas).' + ajouteChampTexte(this, 2 * i + 1, 'inline largeur25')
      setReponse(this, 2 * i, nombreAntecedentCherches)
      setReponse(this, 2 * i + 1, reponse, { formatInteractif: 'texte' })
      const objetsCorrection = [repere1]
      // on ajoute les tracés pour repérer les antécédents et on en profite pour rendre les autres noeuds invisibles
      for (let j = 0; j < nombreAntecedentCherches; j++) {
        objetsCorrection.push(lectureAntecedent(solutions[j], y0, 1, 1, 'red', '', ''))
        for (let k = 0; k < maSpline.visible.length; k++) {
          if (maSpline.y[k] !== y0) maSpline.visible[k] = false
        }
      }
      const courbeAvecTraces = maSpline.courbe({
        repere: repere1,
        epaisseur: 1,
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'black', taille: 1, style: '.', epaisseur: 1 }
      })
      objetsCorrection.push(courbeAvecTraces)
      let texteCorrection = mathalea2d(Object.assign({}, fixeBordures(objetsCorrection)), objetsCorrection)
      texteCorrection += `<br>${y0} possède ${nombreAntecedentCherches} antécédents sur l'intervalle [${maSpline.x[0]};${maSpline.x[maSpline.n - 1]}].`
      texteCorrection += `<br>Les antécédents de ${y0} sont : ${reponse}.`
      this.listeQuestions.push(texteEnonce)
      this.listeCorrections.push(texteCorrection)
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
