import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { cercle } from '../../../lib/2d/cercle.js'
import { point } from '../../../lib/2d/points.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { rotation } from '../../../lib/2d/transformations.js'
import { colorToLatexOrHTML, mathalea2d } from '../../../modules/2dGeneralites.js'
import { context } from '../../../modules/context.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../../lib/outils/embellissements'
export const titre = 'Lire l\'heure'
export const dateDePublication = '4/11/2021'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * @author Jean-Claude Lhote
 */
export const uuid = '2ce11'
export const ref = 'canc3D01'
export const refs = {
  'fr-fr': ['canc3D01'],
  'fr-ch': []
}
export default function LireHeure () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 1
  this.typeExercice = 'simple'
  this.formatChampTexte = KeyboardType.clavierHms
  this.nouvelleVersion = function () {
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
    const h = randint(0, 11)
    const m = randint(0, 11) * 5
    const alpha = 90 - h * 30 - m / 2
    const beta = 90 - m * 6
    const grandeAiguille = rotation(segment(O, point(1.5, 0)), O, beta)
    const petiteAiguille = rotation(segment(O, point(1, 0)), O, alpha)
    grandeAiguille.color = context.isHtml ? colorToLatexOrHTML('red') : colorToLatexOrHTML('black')
    grandeAiguille.epaisseur = 2
    petiteAiguille.color = context.isHtml ? colorToLatexOrHTML('blue') : colorToLatexOrHTML('black')
    petiteAiguille.epaisseur = 4
    horloge.push(petiteAiguille, grandeAiguille)
    this.question = `Quelle est l'heure du matin indiquée par cette horloge ? <br>
    
    ` +

    mathalea2d({ xmin: -3, ymin: -3, xmax: 3, ymax: 3, scale: 0.7, zoom: this.tailleDiaporama, style: 'margin: auto' }, horloge)
    this.reponse = { reponse: { value: `${h}h ${m}`, compare: fonctionComparaison, options: { HMS: true } } }
    this.correction = `$${miseEnEvidence(h)}$ ${texteEnCouleurEtGras('h')} $${miseEnEvidence(m === 0 ? '' : m === 5 ? '0' + m : m)}$`
    if (context.isAmc) {
      this.autoCorrection = [
        {
          enonce: this.question,
          propositions: [
            {
              type: 'AMCNum',
              propositions: [
                {
                  texte: this.correction,
                  reponse: {
                    texte: 'heure',
                    valeur: [h],
                    param: {
                      digits: 2,
                      decimals: 0,
                      signe: false
                    }
                  }
                }
              ]
            },
            {
              type: 'AMCNum',
              propositions: [
                {
                  texte: '',
                  reponse: {
                    texte: 'minutes',
                    valeur: [m],
                    param: {
                      digits: 2,
                      decimals: 0,
                      signe: false
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ h $\\ldots$ min'
  }
}
