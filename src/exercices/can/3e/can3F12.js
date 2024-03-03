import { repere } from '../../../lib/2d/reperes.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { spline } from '../../../lib/mathFonctions/Spline.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
export const dateDePublication = '26/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Lire des antécédents graphiquement'

/*!
 * @author Gilles MORA
  *
 * Référence can3F12
*/
export const uuid = '0e1c6'
export const ref = 'can3F12'
export const refs = {
  'fr-fr': ['can3F12'],
  'fr-ch': []
}
export default function AntecedentSpline () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 1
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const noeuds1 = [{ x: -4, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -3, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -2, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -1, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 0, y: -1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 2, y: -2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 3, y: -3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 4, y: -2, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 5, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
    ]
    const noeuds2 = [{ x: -4, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -3, y: 1, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -2, y: 2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -1, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 0, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 2, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 3, y: 0, deriveeGauche: 2, deriveeDroit: 2, isVisible: true },
      { x: 4, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 5, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 6, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
    ]
    const mesFonctions = [noeuds1, noeuds2]//, noeuds2
    function aleatoiriseCourbe (listeFonctions) {
      const coeffX = choice([-1, 1]) // symétries ou pas
      const coeffY = choice([-1, 1])
      const deltaX = randint(-2, +2) // translations
      const deltaY = randint(-1, 1)// randint(-2, +2)
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
    const theSpline = spline(nuage)
    this.spline = theSpline
    bornes = theSpline.trouveMaxes()
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
    const courbe1 = theSpline.courbe({
      repere: repere1,
      epaisseur: 1.5,
      ajouteNoeuds: true,
      optionsNoeuds: { color: 'blue', taille: 2, style: 'x', epaisseur: 2 },
      color: 'blue'
    })
    const objetsEnonce = [repere1, courbe1]
    const nbAntecedentsEntiersMaximum = theSpline.nombreAntecedentsMaximum(bornes.yMin, bornes.yMax, true, true)

    const nombreAntecedentCherches1 = choice([randint(1, nbAntecedentsEntiersMaximum), randint(0, nbAntecedentsEntiersMaximum), randint(1, nbAntecedentsEntiersMaximum)])
    let y1 = theSpline.trouveYPourNAntecedents(nombreAntecedentCherches1, bornes.yMin - 1, bornes.yMax + 1, true, true)
    if (y1 == null) {
      window.notify('Dans can3F12, Spline.trouveYPourNAntecedent fait encore des siennes je choisis une valeur intermédiaire')
      y1 = Math.round((bornes.yMin + bornes.yMax) / 2)
    }
    const solutions1 = theSpline.solve(y1)
    const reponse1 = (!solutions1 || solutions1.length === 0) ? 'aucun' : `${solutions1.join(';')}`
    this.reponse = reponse1
    this.question = `Déterminer les antécédents éventuels de $${y1}$ par la fonction $f$.<br>` +
       mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.65, style: 'margin: auto' }, { xmin: bornes.xMin - 1, ymin: bornes.yMin - 1, xmax: bornes.xMax + 1, ymax: bornes.yMax + 1 }), objetsEnonce, o)// fixeBordures(objetsEnonce))
    if (this.interactif) {
      this.question += '<br>Écrire les antécédents rangés dans l\'ordre croissant séparés par des points-virgules (saisir "aucun" s\'il n\'y en a pas).<br>'
      this.question += 'Antécédent(s) : '
    }

    this.correction = `Déterminer les antécédents de $${y1}$ revient à déterminer les nombres qui ont pour image $${y1}$.<br>
    On part de $${y1}$ sur l'axe des ordonnées et on lit les antécédents (éventuels) sur l'axe des abscisses.<br>`
    if (!solutions1 || solutions1.length === 0) { this.correction += `Il n'y en a pas. <br> $${miseEnEvidence(y1)}$ ${texteEnCouleurEtGras('n\'a pas d\'antécédent par $\\boldsymbol{f}$')}.` } else { this.correction += `On en trouve $${solutions1.length}$ : $${miseEnEvidence(solutions1.join('\\,;\\,'))}$.` }

    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
