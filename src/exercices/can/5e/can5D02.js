import { choice } from '../../../lib/outils/arrayOutils'
import { texFractionReduite } from '../../../lib/outils/deprecatedFractions.js'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'

import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif'

export const titre = 'Convertir des heures décimales en heures/minutes et inversement*'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '08/02/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
/*!
 * @author Gilles Mora
 */
export const uuid = '47802'
export const ref = 'can5D02'
export const refs = {
  'fr-fr': ['can5D02'],
  'fr-ch': []
}
export default function HeuresDecimalesHeuresMinutes2 () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let a, b, d, texte, texteCorr
    for (let i = 0, index = 0, nbChamps, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice([1, 2])) { //, 'b'
        case 1 :

          a = randint(1, 5)
          b = choice([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.25, 0.75])
          d = calculANePlusJamaisUtiliser(b * 60)
          if (!this.interactif) {
            texte = `Convertir en heures/minutes : <br>$${texNombre(a + b)}$ h $=$ .....  h ..... min`
            texteCorr = `$${texNombre(a + b)}$h$ = ${a}$ h $ + ${texNombre(b)} \\times 60$ min $  = ${a}$ h $${d}$ min`
          } else {
            texte = `Convertir en heures/minutes : <br>$${texNombre(a + b)}$ h $=$`
            texte += ajouteChampTexteMathLive(this, index, 'largeur01 inline', { texteApres: sp(5) + 'h' })
            texte += ajouteChampTexteMathLive(this, index + 1, 'largeur01 inline', { texteApres: sp(5) + 'min' })
            texteCorr = `$${texNombre(a + b)}$h$ = ${a}$ h $ + ${texNombre(b)} \\times 60$ min $ = ${a}$ h $${d}$ min`
            setReponse(this, index, a)
            setReponse(this, index + 1, d)
            nbChamps = 2
          }
          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${texNombre(a + b)}$ h $=\\ldots$ h $\\ldots$ min`
          break

        case 2 :

          a = randint(1, 5)
          b = choice([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.25, 0.75])
          d = calculANePlusJamaisUtiliser(b * 60)
          if (!this.interactif) {
            texte = `Compléter par un nombre décimal : <br>$${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$ ..... h`
            texteCorr = `$${texNombre(b * 60)}$ min  $=   \\dfrac{${texNombre(b * 60)}}{60}$ h $=${texFractionReduite(b * 60, 60)}$ h $=   ${texNombre(b)}$ h. <br>
            Ainsi, $${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$ $${texNombre(a + b)}$ h.`
          } else {
            texte = `Compléter par un nombre décimal : <br>$${texNombre(a)}$ h $${texNombre(b * 60)}$ min  $=$`
            texte += ajouteChampTexteMathLive(this, index, 'largeur01 inline', { texteApres: sp(5) + 'h' })
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
