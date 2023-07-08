import { ajouteChampTexte, setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import { spline } from '../../modules/mathFonctions/Spline.js'
import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { repere, lectureAntecedent, texteParPosition, droiteParPointEtPente, point } from '../../modules/2d.js'
import { choice, numAlpha, listeQuestionsToContenu, randint, combinaisonListes, arrondi } from '../../modules/outils.js'

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
// une troisième utilisée pour fonctions2
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
 * choisit les caractèristique de la transformation de la courbe
 * @returns {{coeffX: -1|1, deltaX: int, deltaY: int, coeffY: -1|1}}
 */
function aleatoiriseCourbe (listeFonctions) {
  const coeffX = 1// choice([-1, 1]) // symétries ou pas
  const coeffY = 1// choice([-1, 1])
  const deltaX = 0// randint(-2, +2) // translations
  const deltaY = 0// randint(-2, +2)
  return choice(mesFonctions1).map((noeud) => Object({
    x: (noeud.x + deltaX) * coeffX,
    y: (noeud.y + deltaY) * coeffY,
    deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
    deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
    isVisible: noeud.isVisible
  }))
}

/**
 * Aléatoirise une courbe et demande les antécédents d'une valeur entière (eux aussi entiers)
 * @author Jean-Claude Lhote (Gilles Mora)
 * Référence (2F22-1)
 */
export default class LecturesGraphiquesSurSplines extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.nbQuestions = 1 // Nombre de questions par défaut
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = [1]; let typesDeQuestions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      let enonceSousRepere = ''
      let correctionPartA
      let correctionPartB
      let correctionPartC
      let bornes = {}
      const objetsEnonce = []
      const objetsCorrection1 = []
      const objetsCorrection2 = []
      const objetsCorrection3 = []
      let theSpline, nuage

      switch (typesDeQuestions) {
        case 1:{
          // la liste des noeuds de notre fonction
          nuage = aleatoiriseCourbe(mesFonctions1)
          theSpline = spline(nuage)
          bornes = theSpline.trouveMaxes()
          const nombreAntecedentCherches0 = randint(0, 3)
          const y0 = theSpline.trouveYPourNAntecedents(nombreAntecedentCherches0, bornes.yMin, bornes.yMax, true, true)
          const solutions0 = theSpline.solve(y0)
          const nombreAntecedentCherches1 = 2
          const y1 = theSpline.trouveYPourNAntecedents(nombreAntecedentCherches1, bornes.yMin, bornes.yMax, true, true)
          const solutions1 = theSpline.solve(y1)
          const nombreAntecedentCherches2 = 3
          const y2 = theSpline.trouveYPourNAntecedents(nombreAntecedentCherches2, bornes.yMin, bornes.yMax, true, true)
          const solutions2 = theSpline.solve(y2)
          const nombreAntecedentsCherches3 = randint(0, 3, [nombreAntecedentCherches1, nombreAntecedentCherches2])
          const y3 = arrondi(theSpline.trouveYPourNAntecedents(nombreAntecedentsCherches3, bornes.yMin, bornes.yMax, false, false), 1)

          console.log(nombreAntecedentCherches1, JSON.stringify(solutions1), nombreAntecedentCherches2, JSON.stringify(solutions2))
          const reponse1 = solutions1.length === 0 ? 'aucun' : `${solutions1.join(';')}`
          const reponse2 = solutions2.length === 0 ? 'aucun' : `${solutions2.join(';')}`
          const horizontale2 = droiteParPointEtPente(point(0, y2), 0, '', 'green')
          const horizontale3 = droiteParPointEtPente(point(0, y3), 0, '', 'green')
          horizontale2.opacite = 0.5
          horizontale2.pointilles = 2
          horizontale3.opacite = 0.5
          horizontale3.pointilles = 2
          objetsCorrection2.push(horizontale2)
          objetsCorrection3.push(horizontale3)
          for (let j = 0; j < nombreAntecedentCherches1; j++) {
            for (let k = 0; k < theSpline.visible.length; k++) {
              theSpline.visible[k] = theSpline.y[k] === y1
            }
          }
          for (let j = 0; j < nombreAntecedentCherches2; j++) {
            objetsCorrection2.push(lectureAntecedent(solutions2[j], y2, 1, 1, 'red', '', ''))
          }
          for (const antecedentY3 of theSpline.solve(y3)) {
            objetsCorrection3.push(lectureAntecedent(antecedentY3, y3, 1, 1, 'red', '', ''))
          }

          enonceSousRepere = `Voici la représentation graphique $\\mathscr{C}_f$ d'une fonction $f$ définie sur $[${theSpline.x[0]}\\,;\\,${theSpline.x[theSpline.n - 1]}]$. <br>
Répondre aux questions en utilisant le graphique.<br>`
          enonceSousRepere += `<br>${numAlpha(0)}Quel est le nombre de solutions de l'équation $f(x)=${y0}$ ?` + ajouteChampTexteMathLive(this, 4 * i, 'inline largeur10')
          enonceSousRepere += `<br>${numAlpha(1)}Résoudre l'équation $f(x)=${y1}$.` + ajouteChampTexte(this, 4 * i + 1, 'inline largeur25')
          enonceSousRepere += `<br>${numAlpha(2)}Résoudre l'équation $f(x)=${y2}$.` + ajouteChampTexte(this, 4 * i + 2, 'inline largeur25')
          enonceSousRepere += `<br>${numAlpha(3)}Trouve une valeur de k telle que $f(x)=k$ admette exactement $${nombreAntecedentsCherches3}$ antécédent${nombreAntecedentsCherches3 > 1 ? 's' : ''}.` + ajouteChampTexte(this, 4 * i + 3, 'inline largeur25')
          if (this.interactif) { enonceSousRepere += '<br>Écrire les solutions rangés dans l\'ordre croissant séparés par des points-virgules (saisir Aucune s\'il n\'y en a pas).' }
          setReponse(this, 4 * i, nombreAntecedentCherches0)
          setReponse(this, 4 * i + 1, reponse1, { formatInteractif: 'texte' })
          setReponse(this, 4 * i + 2, reponse2, { formatInteractif: 'texte' })
          setReponse(this, 4 * i + 2, y3, { formatInteractif: 'texte' })
          correctionPartA = `${numAlpha(0)} Le nombre de solutions de l'équation $f(x)=${y0}$ est donné par le nombre d'antécédents de $${y0}$ par $f$. <br>
          ${solutions0.length === 0 ? 'Il n\'y en a pas, donc l\'équation n\'a pas de solution.' : `Il y en a $${solutions0.length}$.`} <br>
          ${numAlpha(1)} Résoudre l'équation $f(x)=${y1}$ graphiquement revient à lire les abscisses des points d'intersection entre $\\mathscr{C}_f$ et ${y1 === 0 ? 'l\'axe des abscisses.' : `la droite (parallèle à l'axe des abscisses) d'équation $y = ${y1}$.`}<br>
          On en déduit : $S=\\{${solutions1.join('\\,;\\,')}\\}$.<br>`
          correctionPartB = `<br>${numAlpha(2)}  Résoudre l'équation $f(x)=${y2}$ graphiquement revient à lire les abscisses des points d'intersection entre $\\mathscr{C}_f$ et ${y2 === 0 ? 'l\'axe des abscisses.' : `la droite (parallèle à l'axe des abscisses) d'équation $y = ${y2}$.`}<br>
          On en déduit : $S=\\{${solutions2.join('\\,;\\,')}\\}$.<br>`
          correctionPartC = `<br>${numAlpha(3)}  Le nombre $${texNombre(y3, 1)}$ possède exactement ${nombreAntecedentsCherches3} antécédent${nombreAntecedentsCherches3 > 1 ? 's' : ''}.<br>`
        }
          break
        case 2:

          break
      }
      // Code commun à tous les cas
      const repere1 = repere({
        xMin: bornes.xMin - 1,
        xMax: bornes.xMax + 1,
        yMin: bornes.yMin - 1,
        yMax: bornes.yMax + 1,
        axesEpaisseur: 1,
        thickEpaisseur: 1.2,
        yLabelEcart: 0.6,
        grille: true,
        grilleCouleur: 'gray'
      })
      const courbeATracer = theSpline.courbe({
        repere: repere1,
        epaisseur: 1.2,
        color: 'blue',
        ajouteNoeuds: false

      })
      const courbeCorrection = theSpline.courbe({
        repere: repere1,
        epaisseur: 1.2,
        color: 'blue',
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'red', taille: 1, style: '.', epaisseur: 1.5 }
      })
      /*
      const courbeATracer = theSpline.courbe({
              repere: repere1,
        epaisseur: 2,
        color: 'blue',
        ajouteNoeuds: true,
        optionsNoeuds: { color: 'black', taille: 1, style: '.', epaisseur: 1 }
      })
       */
      objetsEnonce.push(repere1, courbeATracer)
      objetsCorrection1.push(repere1, courbeCorrection)
      objetsCorrection2.push(repere1, courbeATracer)
      objetsCorrection3.push(repere1, courbeATracer)

      const origine = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      texte = mathalea2d(Object.assign({ scale: 0.6, style: 'display: block' }, fixeBordures(objetsEnonce)), objetsEnonce, origine) + enonceSousRepere
      texteCorr = correctionPartA +
        mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection1)), objetsCorrection1, origine) +
        correctionPartB +
        mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection2)), objetsCorrection2, origine) +
      correctionPartC +
        mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection3)), objetsCorrection3, origine)

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
