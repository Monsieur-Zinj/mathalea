import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { context } from '../../../modules/context.js'
import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Trouver un ordre de grandeur (QCM)'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6C01
 */
export const uuid = 'de779'
export const ref = 'can6C01'
export const refs = {
  'fr-fr': ['can6C01'],
  'fr-ch': []
}
export default function OrdreDeGrandeur () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 3
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = randint(3, 7)
      const b = randint(2, 9)
      const c = randint(1, 9)
      const nombre = a * 100 + b * 10 + c
      const d = randint(5, 9)
      const resultat = nombre * d
      let texte = `$${texNombre(nombre, 0)}\\times ${d}$<br>
    Choisir la bonne réponse sans effectuer précisément le calcul.`
      // Ajout avant l'ajout des propositions de réponse
      // ça serait mieux en uniformisant avec this.question pour tous les exos can
      this.canEnonce = texte
      this.autoCorrection[i] = {
        enonce: texte,
        propositions: [
          {
            texte: `$${texNombre(resultat, 0)}$`,
            statut: true
          },
          {
            texte: `$${texNombre(d * 1000 + nombre, 0)}$`,
            statut: false
          },
          {
            texte: `$${texNombre((a * 1000 + b * 100 + c) * d, 0)}$`,
            statut: false
          }
        ]
      }
      const monQcm = propositionsQcm(this, i)
      if (!context.isAmc) {
        texte += monQcm.texte
      }
      let texteCorr = `$${texNombre(nombre, 0)} \\times ${d} = ${texNombre(resultat, 0)}$<br>
        `
      if (nombre > a * 100 + 50) {
        texteCorr += texteEnCouleur(`
    Mentalement : <br>
On remplace le premier facteur $${texNombre(nombre, 0)}$ par $${(a + 1) * 100}$, on calcule
$${(a + 1) * 100}\\times ${d}=${texNombre(((a + 1) * 100) * d, 0)}$ et on sélectionne le résultat qui s'en rapproche le plus.
    `)
      } else {
        texteCorr += texteEnCouleur(`
    Mentalement : <br>
    On remplace le premier facteur $${texNombre(nombre, 0)}$ par $${a * 100}$, on calcule
    $${a * 100}\\times ${d}=${texNombre(a * 100 * d, 0)}$ et on sélectionne le résultat qui s'en rapproche le plus.
           `)
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
      // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      this.canReponseACompleter = monQcm.texte
      this.listeCanEnonces.push(this.canEnonce)
      this.listeCanReponsesACompleter.push(this.canReponseACompleter)
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
