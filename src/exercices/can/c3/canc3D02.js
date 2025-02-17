import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { cercle } from '../../../lib/2d/cercle.js'
import { point } from '../../../lib/2d/points.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { rotation } from '../../../lib/2d/transformations.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { personne } from '../../../lib/outils/Personne'
import { colorToLatexOrHTML, mathalea2d } from '../../../modules/2dGeneralites.js'
import { context } from '../../../modules/context.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Lire une durée'
export const dateDePublication = '4/11/2021'
export const interactifReady = true
export const interactifType = 'mathLive'

/*!
 * @author Jean-Claude Lhote
 * Créé le 4/11/2021
 * Référence canc3D01
 */
export const uuid = '0861b'
export const ref = 'canc3D02'
export const refs = {
  'fr-fr': ['canc3D02'],
  'fr-ch': []
}
export default function LireUneDuree () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 1
  this.typeExercice = 'simple'
  this.formatChampTexte = KeyboardType.clavierHms
  this.nouvelleVersion = function () {
    let h1, m1, h2, m2, enonce
    const matinOuSoir = choice(['matin', 'soir'])
    const quidam = personne()
    const OccupationsMatinales = ['a lu un livre', 'a fait un jogging', 'a préparé le repas', 'a fait ses devoirs']
    const occupationsNocturnes = ['a regardé une émission', 'a écouté de la musique', 'a joué aux cartes']
    switch (matinOuSoir) {
      case 'matin':
        h1 = randint(8, 10)
        m1 = randint(1, 5) * 5
        h2 = h1 + randint(0, 1)
        m2 = m1 + randint(2 - h2 + h1, 6) * 5
        enonce = `${quidam.prenom} ${choice(OccupationsMatinales)} ce matin. ${quidam.pronom} a noté l'heure de début et l'heure de fin.<br>
        
        `
        break
      case 'soir':
        h1 = randint(20, 22)
        m1 = randint(1, 5) * 5
        h2 = h1 + randint(0, 1)
        m2 = m1 + randint(2 - h2 + h1, 6) * 5
        enonce = `${quidam.prenom} ${choice(occupationsNocturnes)} ce soir. ${quidam.pronom} a noté l'heure de début et l'heure de fin.<br>
        
        `
        break
    }
    const alpha1 = 90 - h1 * 30 - m1 / 2
    const beta1 = 90 - m1 * 6
    const alpha2 = 90 - h2 * 30 - m2 / 2
    const beta2 = 90 - m2 * 6

    const horloge = []
    const O = point(0, 0)
    const C = cercle(O, 2)
    horloge.push(C)
    const s = segment(1.5, 0, 1.9, 0)
    for (let i = 0; i < 4; i++) {
      horloge.push(rotation(s, O, 90 * i))
    }
    const t = segment(1.7, 0, 1.9, 0)
    for (let i = 0; i < 4; i++) {
      horloge.push(rotation(t, O, 30 + i * 90), rotation(t, O, 60 + i * 90))
    }
    const grandeAiguille1 = rotation(segment(O, point(1.5, 0)), O, beta1)
    const petiteAiguille1 = rotation(segment(O, point(1, 0)), O, alpha1)
    const grandeAiguille2 = rotation(segment(O, point(1.5, 0)), O, beta2)
    const petiteAiguille2 = rotation(segment(O, point(1, 0)), O, alpha2)

    grandeAiguille1.color = colorToLatexOrHTML('red')
    grandeAiguille1.epaisseur = 2
    petiteAiguille1.color = colorToLatexOrHTML('green')
    petiteAiguille1.epaisseur = 3
    grandeAiguille2.color = colorToLatexOrHTML('red')
    grandeAiguille2.epaisseur = 2
    petiteAiguille2.color = colorToLatexOrHTML('green')
    petiteAiguille2.epaisseur = 3
    this.question = enonce + (context.isHtml ? '<table><tr><td>' : '\\begin{multicols}{2}\n') +
    mathalea2d({ xmin: -3, ymin: -3, xmax: 3, ymax: 3, scale: 0.6, zoom: this.tailleDiaporama, style: 'margin: auto' }, horloge, grandeAiguille1, petiteAiguille1, texteParPosition('Heure de début', 0, -2.5)) +
(context.isHtml ? '</td><td>' : '') +
    mathalea2d({ xmin: -3, ymin: -3, xmax: 3, ymax: 3, scale: 0.6, zoom: this.tailleDiaporama, style: 'margin: auto' }, horloge, grandeAiguille2, petiteAiguille2, texteParPosition('Heure de fin', 0, -2.5)) +
    (context.isHtml ? '</td></tr></table>' : '\\end{multicols}\n') +
          'Combien de temps cela a-t-il duré ?'
    this.reponse = { reponse: { value: `${h2 - h1}h ${m2 - m1}`, compare: fonctionComparaison, options: { HMS: true } } }
    this.correction = `On regarde de combien de graduations la grande aiguille a avancé : elle a avancé de $${Math.round((m2 - m1) / 5)}$ graduations soit $${m2 - m1}$ minutes.<br>`
    this.correction += 'Ensuite on regarde si la petite aiguille a avancé d\'au moins une graduation.<br>'
    if (h2 === h1) {
      this.correction += `Ce n'est pas le cas, donc il s'est écoulé seulement $0$ h $${m2 - m1}$ minutes.`
    } else {
      this.correction += `La petite aiguille a avancé d'une heure, donc il s'est écoulé $1$ h $${m2 - m1}$ min.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ h $\\ldots$ min'
  }
}
