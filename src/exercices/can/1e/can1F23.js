import { repere } from '../../../lib/2d/reperes.js'
import { texteParPosition } from '../../../lib/2d/textes.js'
import { spline } from '../../../lib/mathFonctions/Spline.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import { tableauSignesFonction } from '../../../lib/mathFonctions/etudeFonction.js'
import Exercice from '../../deprecatedExercice.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Dresser le tableau de signes d\'une fonction dérivée à partir d\'un graphique'
export const dateDePublication = '18/11/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'ad915' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = 'can1F23'// @todo à modifier aussi
// une liste de nœuds pour définir une fonction Spline
export default function SignesTabGSpline () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 1

  this.nouvelleVersion = function () {
    const noeuds1 = [{ x: -4, y: -1, deriveeGauche: 0.5, deriveeDroit: 0.5, isVisible: true },
      { x: -3, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -2, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -1, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 0, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 3, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 4, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 5, y: 1, deriveeGauche: 0.5, deriveeDroit: 0.5, isVisible: true }
    ]
    // une autre liste de nœuds...
    const noeuds2 = [{ x: -6, y: -2, deriveeGauche: 2, deriveeDroit: 2, isVisible: true },
      { x: -5, y: 0, deriveeGauche: 2, deriveeDroit: 3, isVisible: true },
      { x: -4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -3, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: -1, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 0, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 1, y: 3, deriveeGauche: 3, deriveeDroit: 3, isVisible: true },
      { x: 2, y: 5, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 3, y: 4, deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
      { x: 4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 5, y: 4, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 6, y: 5, deriveeGauche: 0.2, deriveeDroit: 0.2, isVisible: true }
    ]

    const noeuds3 = [{ x: -6, y: -4, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -2, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 2, y: 2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 4, y: 0, deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
      { x: 6, y: -3, deriveeGauche: -1, deriveeDroit: -1, isVisible: true }
    ]

    const noeuds4 = [{ x: -6, y: 3, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -5, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -4, y: 2, deriveeGauche: -1.5, deriveeDroit: -1.5, isVisible: true },
      { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1.5, isVisible: true },
      { x: 0, y: -3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 1, y: -1, deriveeGauche: 1.5, deriveeDroit: 1.5, isVisible: true },
      { x: 2, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 3, y: -3, deriveeGauche: -2, deriveeDroit: -2, isVisible: true }
    ]

    // une liste des listes
    const mesFonctions = [noeuds1, noeuds2, noeuds3, noeuds4]//, , noeuds2noeuds1, noeuds2,
    function aleatoiriseCourbe (listeFonctions) {
      const coeffX = choice([-1, 1]) // symétries ou pas
      const coeffY = choice([-1, 1])
      const deltaX = randint(-2, +2) // translations
      const deltaY = 0
      const choix = choice(listeFonctions)
      return choix.map((noeud) => Object({
        x: (noeud.x + deltaX) * coeffX,
        y: (noeud.y + deltaY) * coeffY,
        deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
        deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
        isVisible: noeud.isVisible
      }))
    }

    let bornes = {}
    const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
    const nuage = aleatoiriseCourbe(mesFonctions)
    const maSpline = spline(nuage)
    const fonctionD = x => maSpline.derivee(x)
    const { xMin, xMax, yMin, yMax } = maSpline.trouveMaxes()
    const tableau = tableauSignesFonction(maSpline.fonction, xMin, xMax, { step: 1, tolerance: 0.1, nomVariable: 'x', nomFonction: 'f^\\prime(x)' })

    const tableauD = tableauSignesFonction(fonctionD, xMin, xMax, { step: 1, tolerance: 0.1, nomVariable: 'x', nomFonction: 'f^\\prime(x)' })
    const choixInteractif = choice([tableau, tableauD])
    this.spline = maSpline
    bornes = maSpline.trouveMaxes()
    const repere1 = repere({
      xMin: bornes.xMin - 1,
      xMax: bornes.xMax + 1,
      yMin: bornes.yMin - 1,
      yMax: bornes.yMax + 1,
      grilleX: false,
      grilleY: false,
      grilleSecondaire: true,
      grilleSecondaireYDistance: 1,
      grilleSecondaireXDistance: 1,
      grilleSecondaireYMin: bornes.yMin - 1,
      grilleSecondaireYMax: bornes.yMax + 1,
      grilleSecondaireXMin: bornes.xMin - 1,
      grilleSecondaireXMax: bornes.xMax + 1
    })
    const courbe1 = maSpline.courbe({
      repere: repere1,
      epaisseur: 1.5,
      ajouteNoeuds: true,
      optionsNoeuds: { color: 'blue', taille: 2, style: 'x', epaisseur: 2 },
      color: 'blue'
    })
    const objetsEnonce = [repere1, courbe1]

    if (choixInteractif === tableau) { this.reponse = ['Non', 'NON', 'non'] } else { this.reponse = ['Oui', 'OUI', 'oui'] }
    this.question = `On donne la représentation graphique d'une fonction $f$. <br>
    Dresser le tableau de signes de sa fonction dérivée $f^\\prime$.<br>` +
        mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.55, style: 'margin: auto' }, { xmin: xMin - 1, ymin: yMin - 1, xmax: xMax + 1, ymax: yMax + 1 }), objetsEnonce, o)
    if (this.interactif) {
      this.question = 'Voici la représentation graphique d\'une fonction $f$ :<br>'
      this.question += mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.55, style: 'margin: auto' }, { xmin: xMin - 1, ymin: yMin - 1, xmax: xMax + 1, ymax: yMax + 1 }), objetsEnonce, o)
      this.question += '<br>Le tableau de signes de la fonction $f^\\prime$ est : <br>'
      this.question += choixInteractif
      this.question += '<br>Répondre par "Oui" ou "Non" <br>'
      this.correction = `L'ensemble de définition de $f$ est $[${maSpline.x[0]}\\,;\\,${maSpline.x[maSpline.n - 1]}]$.<br>
    Lorsque la fonction $f$ est croissante, $f^\\prime$ est positive et lorsque $f$ est décroissante, $f^\\prime$ est négative.<br>`
      if (choixInteractif === tableau) {
        this.correction += 'Voici le tableau de signes de $f(x)$ sur son ensemble de définition :<br> '
        this.correction += tableauD
      } else {
        this.correction += ''
      }
    } else {
      this.correction = `L'ensemble de définition de $f$ est $[${maSpline.x[0]}\\,;\\,${maSpline.x[maSpline.n - 1]}]$.<br>
    Lorsque la fonction $f$ est croissante, $f^\\prime$ est positive et lorsque $f$ est décroissante, $f^\\prime$ est négative.<br>`
      this.correction += tableauD
    }

    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
