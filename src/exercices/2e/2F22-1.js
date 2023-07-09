import { ajouteChampTexte, setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import { spline } from '../../modules/mathFonctions/Spline.js'
import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { repere, lectureAntecedent, texteParPosition, droiteParPointEtPente, point } from '../../modules/2d.js'
import { choice, numAlpha, listeQuestionsToContenu, randint, arrondi } from '../../modules/outils.js'

export const titre = 'Résoudre une équation du type $f(x)=k$ graphiquement.'
export const interactifReady = true
export const interactifType = 'custom'

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
const noeuds3 = [{ x: -5, y: -2, deriveeGauche: 2, deriveeDroit: 2, isVisible: true }, { x: -4, y: 0, deriveeGauche: 0.5, deriveeDroit: 0.5, isVisible: true }, { x: -3, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }, { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true }, { x: -1, y: -2, deriveeGauche: -2, deriveeDroit: -2, isVisible: true }, { x: 0, y: -4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }, { x: 1, y: -2, deriveeGauche: 2, deriveeDroit: 2, isVisible: true }, { x: 2, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true }, { x: 3, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }, { x: 4, y: 0, deriveeGauche: -1.5, deriveeDroit: -1.5, isVisible: true }, { x: 5, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }]

// une liste des listes
const mesFonctions1 = [noeuds1, noeuds2, noeuds3]//, noeuds2
// const mesFonctions2 = [noeuds3]//, noeuds4

/**
 * choisit les caractèristique de la transformation de la courbe
 * @returns {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>}
 */
function aleatoiriseCourbe (listeFonctions) {
  const coeffX = choice([-1, 1]) // symétries ou pas
  const coeffY = choice([-1, 1])
  const deltaX = randint(-2, +2) // translations
  const deltaY = randint(-2, +2)
  const choix = choice(listeFonctions)
  return choix.map((noeud) => Object({
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

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let bornes = {}
      const objetsEnonce = []
      const objetsCorrection1 = []
      const objetsCorrection2 = []
      // la liste des noeuds de notre fonction
      const nuage = aleatoiriseCourbe(mesFonctions1)
      const theSpline = spline(nuage)
      bornes = theSpline.trouveMaxes()
      const nbAntecedentsEntiersMaximum = theSpline.nombreAntecedentsMaximum(bornes.yMin, bornes.yMax, true, true)

      const nombreAntecedentCherches0 = randint(1, nbAntecedentsEntiersMaximum)
      const y0 = theSpline.trouveYPourNAntecedents(nombreAntecedentCherches0, bornes.yMin, bornes.yMax, true, true)
      const solutions0 = theSpline.solve(y0)
      const reponse0 = solutions0.join(';')
      const nombreAntecedentCherches1 = randint(0, nbAntecedentsEntiersMaximum, nombreAntecedentCherches0)
      const y1 = theSpline.trouveYPourNAntecedents(nombreAntecedentCherches1, bornes.yMin - 1, bornes.yMax + 1, true, true)
      const solutions1 = theSpline.solve(y1)
      const nbAntecedentsMaximum = theSpline.nombreAntecedentsMaximum(bornes.yMin - 1, bornes.yMax + 1, false, false)
      const nombreAntecedentsCherches2 = randint(0, nbAntecedentsMaximum, [nombreAntecedentCherches1, nombreAntecedentCherches0])
      const y2 = arrondi(theSpline.trouveYPourNAntecedents(nombreAntecedentsCherches2, bornes.yMin, bornes.yMax, false, false), 1)
      const solutions2 = theSpline.solve(y2)
      const reponse1 = solutions1.length === 0 ? 'aucun' : `${solutions1.join(';')}`
      const reponse2 = solutions2.length === 0 ? 'aucun' : `${solutions2.map(ant => texNombre(ant, 1)).join(';')}`

      const horizontale1 = droiteParPointEtPente(point(0, y1), 0, '', 'green')
      const horizontale2 = droiteParPointEtPente(point(0, y2), 0, '', 'green')
      horizontale1.opacite = 0.5
      horizontale1.pointilles = 2
      horizontale2.opacite = 0.5
      horizontale2.pointilles = 2
      objetsCorrection1.push(horizontale1)
      objetsCorrection2.push(horizontale2)
      for (let j = 0; j < nombreAntecedentCherches0; j++) {
        objetsCorrection1.push(lectureAntecedent(solutions0[j], y0, 1, 1, 'red', '', ''))
      }
      for (let j = 0; j < nombreAntecedentCherches1; j++) {
        for (let k = 0; k < theSpline.visible.length; k++) {
          theSpline.visible[k] = theSpline.y[k] === y1
        }
      }

      for (const antecedentY2 of theSpline.solve(y2)) {
        objetsCorrection2.push(lectureAntecedent(antecedentY2, y2, 1, 1, 'red', '', ''))
      }

      let enonceSousRepere = `Voici la représentation graphique $\\mathscr{C}_f$ d'une fonction $f$ définie sur $[${theSpline.x[0]}\\,;\\,${theSpline.x[theSpline.n - 1]}]$. <br>
Répondre aux questions en utilisant le graphique.<br>`
      enonceSousRepere += `<br>${numAlpha(0)}Quel est le nombre de solutions de l'équation $f(x)=${y0}$ ?` + ajouteChampTexteMathLive(this, 3 * i, 'inline largeur10')
      enonceSousRepere += `<br>${numAlpha(1)}Résoudre l'équation $f(x)=${y1}$.` + ajouteChampTexte(this, 3 * i + 1, 'inline largeur25')
      enonceSousRepere += `<br>${numAlpha(2)}Trouve une valeur de k telle que $f(x)=k$ admette exactement $${nombreAntecedentsCherches2}$ antécédent${nombreAntecedentsCherches2 > 1 ? 's' : ''}.` + ajouteChampTexte(this, 3 * i + 2, 'inline largeur25')
      if (this.interactif) { enonceSousRepere += '<br>Écrire les solutions rangées dans l\'ordre croissant séparés par des points-virgules (saisir Aucune s\'il n\'y en a pas).' }
      setReponse(this, 3 * i, nombreAntecedentCherches0)
      setReponse(this, 3 * i + 1, reponse1, { formatInteractif: 'texte' })
      setReponse(this, 3 * i + 2, y2)
      const correctionPartA = `${numAlpha(0)} Le nombre de solutions de l'équation $f(x)=${y0}$ est donné par le nombre d'antécédents de $${y0}$ par $f$. <br>
          ${solutions0.length === 0 ? 'Il n\'y en a pas, donc l\'équation n\'a pas de solution.' : 'Il y en a $' + solutions0.length + '$ : $S=\\{' + reponse0 + '\\}$.'} <br>`
      const correctionPartB = `${numAlpha(1)} Résoudre l'équation $f(x)=${y1}$ graphiquement revient à lire les abscisses des points d'intersection entre $\\mathscr{C}_f$ et ${y1 === 0 ? 'l\'axe des abscisses.' : `la droite (parallèle à l'axe des abscisses) d'équation $y = ${y1}$.`}<br>
          On en déduit : $S=\\{${solutions1.join('\\,;\\,')}\\}$.<br>
${numAlpha(2)}  Le nombre $${texNombre(y2, 1)}$ possède exactement ${nombreAntecedentsCherches2} antécédent${nombreAntecedentsCherches2 > 1 ? 's' : ''} : $S=\\{${reponse2}\\}$.<br>`
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

      objetsEnonce.push(repere1, courbeATracer)
      objetsCorrection1.push(repere1, courbeCorrection)
      objetsCorrection2.push(repere1, courbeATracer)
      objetsCorrection2.push(repere1, courbeATracer)

      const origine = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      texte = mathalea2d(Object.assign({ scale: 0.6, style: 'display: block' }, fixeBordures(objetsEnonce)), objetsEnonce, origine) + enonceSousRepere
      texteCorr = correctionPartA +
        mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection1)), objetsCorrection1, origine) +
           correctionPartB +
        mathalea2d(Object.assign({ scale: 0.6 }, fixeBordures(objetsCorrection2)), objetsCorrection2, origine)

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

  correctionInteractive = (i) => {
    let resultat
    const divFeedback = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`)
    switch (i % 3) {
      case 0:
        if (i === 0) {
          divFeedback.innerHTML = '😎'
          resultat = 'OK'
        } else {
          divFeedback.innerHTML = '☹️'
          resultat = 'KO'
        }
        break
      case 1:
        break
      case 2:
        break
    }

    return resultat
  }
}
