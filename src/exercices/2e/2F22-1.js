import { ajouteChampTexte, setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { spline } from '../../modules/mathFonctions/Spline.js'
import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { repere, lectureAntecedent, courbe, texteParPosition } from '../../modules/2d.js'
import { choice, numAlpha,  listeQuestionsToContenu, randint, combinaisonListes } from '../../modules/outils.js'

export const titre = 'Résoudre une équation du type $f(x)=k$ graphiquement.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '06/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'a2ac2' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = '2F22-1'// @todo à modifier aussi
// une liste de nœuds pour définir une fonction Spline
const noeuds1 = [{ x: -4, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: -3, y: 1, deriveeGauche: 3, deriveeDroit: 3, isVisible: false },
  { x: -2, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: -1, y: 1, deriveeGauche: -3, deriveeDroit: -3, isVisible: false },
  { x: 0, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 2, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 3, y: -2, deriveeGauche: -2.5, deriveeDroit: -2.5, isVisible: false },
  { x: 4, y: -4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
]
// une autre liste de nœuds...
const noeuds2 = [{ x: -5, y: 1, deriveeGauche: 1.5, deriveeDroit: 1.5, isVisible: true },
  { x: -4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: -3, y: 1, deriveeGauche: -2, deriveeDroit: -2, isVisible: false },
  { x: -2, y: 0, deriveeGauche: -1.5, deriveeDroit: -1, isVisible: false },
  { x: -1, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 0, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: 1, y: 3, deriveeGauche: 3, deriveeDroit: 3, isVisible: false },
  { x: 2, y: 5, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 3, y: 4, deriveeGauche: -2, deriveeDroit: -2, isVisible: false },
  { x: 4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 5, y: 4, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: 6, y: 5, deriveeGauche: 0.2, deriveeDroit: 0.2, isVisible: true }
]

const noeuds3 = [{ x: -5, y: 5, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
  { x: -4, y: 4, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
  { x: -3, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
  { x: -2, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: -1, y: 1, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: 0, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 1, y: 1, deriveeGauche: -2, deriveeDroit: -2, isVisible: false },
  { x: 2, y: -1, deriveeGauche: -2, deriveeDroit: -2, isVisible: false },
  { x: 3, y: -2, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
  { x: 4, y: -4, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 5, y: 1, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
  { x: 6, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
  { x: 7, y: 2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
]

// une liste des listes
const mesFonctions1 = [noeuds1, noeuds2]//, noeuds2
const mesFonctions2 = [noeuds3]//, noeuds4
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
  const coeffX = 1// choice([-1, 1]) // symétries ou pas
  const coeffY = 1// choice([-1, 1])
  const deltaX = 0// randint(-2, +2) // translations
  const deltaY = 0// randint(-2, +2)
  return { coeffX, coeffY, deltaX, deltaY }
}

/**
 * Aléatoirise une courbe et demande les antécédents d'une valeur entière (eux aussi entiers)
 * @author Jean-Claude Lhote (Gilles Mora)
 * Référence (2F22-1)
 */
export default class BetaModeleSpline extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.nbQuestions = 1 // Nombre de questions par défaut
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = [1]; let typesDeQuestions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1:{
          const { coeffX, coeffY, deltaX, deltaY } = aleatoiriseCourbe()
          // la liste des noeuds de notre fonction
          const nuage = choice(mesFonctions1).map((noeud) => Object({
            x: (noeud.x + deltaX) * coeffX,
            y: (noeud.y + deltaY) * coeffY,
            deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
            deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
            isVisible: noeud.isVisible
          }))
          const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          const maSpline = spline(nuage)
          const { xMin, xMax, yMin, yMax } = trouveMaxes(nuage)
          const nombreAntecedentCherches0 = randint(0, 3)
          const y0 = maSpline.trouveYPourNAntecedentsEntiers(nombreAntecedentCherches0, yMin, yMax)
          const solutions0 = maSpline.solve(y0)
          const nombreAntecedentCherches1 = 2
          const y1 = maSpline.trouveYPourNAntecedentsEntiers(nombreAntecedentCherches1, yMin, yMax)
          const solutions1 = maSpline.solve(y1)
          const nombreAntecedentCherches2 = 3
          const y2 = maSpline.trouveYPourNAntecedentsEntiers(nombreAntecedentCherches2, yMin, yMax)
          const solutions2 = maSpline.solve(y2)
          const reponse1 = solutions1.length === 0 ? 'aucun' : `${solutions1.join(';')}`
          const reponse2 = solutions2.length === 0 ? 'aucun' : `${solutions2.join(';')}`
          const repere1 = repere({
            xMin: xMin - 1,
            xMax: xMax + 1,
            yMin: yMin - 1,
            yMax: yMax + 1,
            yLabelEcart: 0.6,
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
            epaisseur: 2,
            color: 'blue',
            ajouteNoeuds: true,
            optionsNoeuds: { color: 'blue', taille: 1, style: '.', epaisseur: 1.5 }
          })
          const objetsCorrection1 = [repere1]
          const objetsEnonce = [repere1, courbe1]
          const g = x => y1
          for (let j = 0; j < nombreAntecedentCherches1; j++) {
            objetsCorrection1.push(lectureAntecedent(solutions1[j], y1, 1, 1, 'red', '', ''))
            for (let k = 0; k < maSpline.visible.length; k++) {
              if (maSpline.y[k] !== y1) maSpline.visible[k] = false
            }
          }
          const objetsCorrection2 = [repere1]
          for (let j = 0; j < nombreAntecedentCherches2; j++) {
            objetsCorrection2.push(lectureAntecedent(solutions2[j], y2, 1, 1, 'red', '', ''))
            for (let k = 0; k < maSpline.visible.length; k++) {
              if (maSpline.y[k] !== y2) maSpline.visible[k] = false
            }
          }
          const courbeAvecTraces = maSpline.courbe({
            repere: repere1,
            epaisseur: 2,
            color: 'blue',
            ajouteNoeuds: true,
            optionsNoeuds: { color: 'black', taille: 1, style: '.', epaisseur: 1 }
          })
          objetsCorrection1.push(courbeAvecTraces)
          objetsCorrection2.push(courbeAvecTraces)
          texte = `Voici la représentation graphique $\\mathscr{C}_f$ d'une fonction $f$ définie sur $[${maSpline.x[0]}\\,;\\,${maSpline.x[maSpline.n - 1]}]$. <br>
Répondre aux questions en utilisant le graphique.<br>`
          texte += mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsEnonce)), objetsEnonce, o)
          texte += `<br>${numAlpha(0)}Quel est le nombre de solutions de l'équation $f(x)=${y0}$ ?` + ajouteChampTexteMathLive(this, 3 * i, 'inline largeur10')
          texte += `<br>${numAlpha(1)}Résoudre l\'équation $f(x)=${y1}$` + ajouteChampTexte(this, 3 * i + 1, 'inline largeur25')
          texte += `<br>${numAlpha(2)}Résoudre l\'équation $f(x)=${y2}$` + ajouteChampTexte(this, 3 * i + 2, 'inline largeur25')
          if (this.interactif) { texte += '<br>Écrire les solutions rangés dans l\'ordre croissant séparés par des points-virgules (saisir Aucune s\'il n\'y en a pas).' }
          setReponse(this, 3 * i, nombreAntecedentCherches0)
          setReponse(this, 3 * i + 1, reponse1, { formatInteractif: 'texte' })
          setReponse(this, 3 * i + 2, reponse2, { formatInteractif: 'texte' })
          texteCorr = `${numAlpha(0)} Le nombre de solutions de l'équation $f(x)=${y0}$ est donné par le nombre d'antécédents de $${y0}$ par $f$. <br>
          ${solutions0.length === 0 ? 'Il n\'y en a pas, donc l\'équation n\'a pas de solution.' : `Il y en a $${solutions0.length}$.`} <br>
          ${numAlpha(1)} Résoudre l'équation $f(x)=${y1}$ graphiquement revient à lire les abscisses des points d'intersection entre $\\mathscr{C}_f$ et ${y1 === 0 ? 'l\'axe des abscisses.' : `la droite (parallèle à l'axe des abscisses) d'équation $y = ${y1}$.`}<br>
          On en déduit : $S=\\{${solutions1.join('\\,;\\,')}\\}$.<br>`
          texteCorr += mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection1)), objetsCorrection1, o)
          texteCorr += `<br>${numAlpha(2)}  Résoudre l'équation $f(x)=${y2}$ graphiquement revient à lire les abscisses des points d'intersection entre $\\mathscr{C}_f$ et ${y2 === 0 ? 'l\'axe des abscisses.' : `la droite (parallèle à l'axe des abscisses) d'équation $y = ${y2}$.`}<br>
          On en déduit : $S=\\{${solutions2.join('\\,;\\,')}\\}$.<br>`
          texteCorr += mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection2)), objetsCorrection2, o)
        }
          break
        case 2:
         
          break
      }

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
