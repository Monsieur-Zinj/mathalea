import { choice } from '../../../lib/outils/arrayOutils'
import { texFractionReduite } from '../../../lib/outils/deprecatedFractions.js'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'

import Hms from '../../../modules/Hms'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif'

export const titre = 'Convertir des heures décimales en heures/minutes et inversement'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '08/02/2022' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can5D01
 */
export const uuid = 'd8797'
export const ref = 'can5D01'
export const refs = {
  'fr-fr': ['can5D01'],
  'fr-ch': []
}
export default function ConversionHeuresDecimalesMinutes () {
  Exercice.call(this)
  this.keyboard = ['hms']
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a, b, d, texte, texteCorr
    for (let i = 0, index = 0, nbChamps, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice([1, 2])) { //, 'b'
        case 1 :

          a = randint(1, 5)
          b = choice([0.25, 0.5, 0.75])
          d = calculANePlusJamaisUtiliser(b * 60)
          if (!this.interactif) {
            texte = `Convertir en heures/minutes : <br>$${texNombre(a + b)}$ h $=$ ..... h ..... min`
            texteCorr = `$${texNombre(a + b)}$ h $ = ${a}$ h $ +$ $ ${texNombre(b)} \\times 60  = ${a}$ h $${d}$ min`
          } else {
            texte = `Convertir en heures/minutes : <br>$${texNombre(a + b)}$ h $=$`
            texte += ajouteChampTexteMathLive(this, i, 'clavierHms ')
            setReponse(this, i, new Hms({ hour: a, minute: d }), { formatInteractif: 'hms' })
            texteCorr = `$${texNombre(a + b)}$ h $ = ${a}$ h $ +$ $ ${texNombre(b)} \\times 60$ min $  = ${a}$ h $${d}$ min`
            nbChamps = 2
          }
          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${texNombre(a + b)}$ h = $\\ldots$ h $\\ldots$ min`
          break

        case 2 :

          a = randint(1, 5)
          b = choice([0.25, 0.5, 0.75])
          d = calculANePlusJamaisUtiliser(b * 60)
          if (!this.interactif) {
            texte = `Compléter par un nombre décimal : <br>$${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$ ..... h`
            texteCorr = `$${texNombre(b * 60)}$ min  $=   \\dfrac{${texNombre(b * 60)}}{60}$ h $=${texFractionReduite(b * 60, 60)}$ h $=   ${texNombre(b)}$ h. <br>
          Ainsi, $${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$ $${texNombre(a + b)}$ h.`
          } else {
            texte = `Compléter par un nombre décimal : <br>$${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$`
            texte += ajouteChampTexteMathLive(this, index, '', { texteApres: sp(5) + 'h' })
            texteCorr = `$${texNombre(b * 60)}$ min  $=   \\dfrac{${texNombre(b * 60)}}{60}$ h $=${texFractionReduite(b * 60, 60)}$ h $=   ${texNombre(b)}$ h. <br>
          Ainsi, $${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$ $${texNombre(a + b)}$ h.`
            setReponse(this, index, a + b)
            nbChamps = 1
          }
          this.canEnonce = 'Compléter par un nombre décimal.'
          this.canReponseACompleter = `$${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $= \\ldots\\ldots$ h`
          break
      }
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
        index += nbChamps
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
