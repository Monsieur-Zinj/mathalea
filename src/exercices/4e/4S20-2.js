import Exercice from '../Exercice'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { numAlpha } from '../../lib/outils/outilString'

export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Classer des événements impossibles, certains, ou possibles.'

export const dateDePublication = '30/7/2024' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = '3c9ef'
export const refs = {
  'fr-fr': ['4S20-2'],
  'fr-ch': []
}
/**
 * Description didactique de l'exercice Différencier événéments impossibles, certains, ou possibles
 * @author Mireille Gain
 * Référence 4S20-2
*/
export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Classer chaque événement selon qu’il est impossible, certain, ou possible.'
    this.nbQuestions = 5 // Nombre de questions par défaut
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.nbQuestionsModifiable = false
    this.spacing = 1.5
    this.spacingCorr = 1.5

    const typeDeQuestionsDisponibles = ['type1', 'type2', 'type3', 'type4', 'type5'] // On crée les 5 types de questions
    const listeTypeDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    const n = randint(1, 5) // n est le nombre le plus petit du dé
    const m = randint(9, 15) // m est le nombre le plus grand du dé
    const p = randint(1, 3) // p est un petit nombre entier qu'on va enlever à n ou ajouter à p
    let texte = `On lance un dé équilibré à $ ${texNombre(m - n + 1)}$ faces numérotées de $ ${texNombre(n)}$ à $ ${texNombre(m)}$. On regarde la face du dessus.<br>`
    let texteCorr = ''
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      let bonneReponse
      switch (listeTypeDeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1':
          texte += numAlpha(i) + `Obtenir $ ${texNombre(n - p)}$ est un événement...<br>` // Le LateX entre deux symboles $, les variables dans des ${ }
          bonneReponse = 'impossible'
          texteCorr += numAlpha(i) + `Obtenir $ ${texNombre(n - p)}$ est un événement impossible.<br>`
          break
        case 'type2':
          texte += numAlpha(i) + 'Obtenir un nombre impair est un événement...<br>'
          bonneReponse = 'possible'
          texteCorr += numAlpha(i) + 'Obtenir un nombre impair est un événement possible.<br>'
          break
        case 'type3':
          texte += numAlpha(i) + `Obtenir un nombre compris entre $ ${texNombre(n)}$ et $ ${texNombre(m)}$ est un événement...<br>`
          bonneReponse = 'certain'
          texteCorr += numAlpha(i) + `Obtenir un nombre compris entre $ ${texNombre(n)}$ et $ ${texNombre(m)}$ est un événement certain.<br>`
          break
        case 'type4':
          texte += numAlpha(i) + `Obtenir $ ${texNombre(m + p)}$ est un événement...<br>`
          bonneReponse = 'impossible'
          texteCorr += numAlpha(i) + `Obtenir $ ${texNombre(m + p)}$ est un événement impossible.<br>`
          break
        case 'type5':
          texte += numAlpha(i) + `Obtenir $ ${texNombre(n + p)}$ est un événement...<br>`
          bonneReponse = 'possible'
          texteCorr += numAlpha(i) + `Obtenir $ ${texNombre(n + p)}$ est un événement possible.<br>`
          break
      }
      this.autoCorrection[i] = {}
      this.autoCorrection[i].options = { ordered: true }
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: 'impossible',
          statut: bonneReponse === 'impossible'
        },
        {
          texte: 'certain',
          statut: bonneReponse === 'certain'
        },
        {
          texte: 'possible',
          statut: bonneReponse === 'possible'
        }
      ]
      const props = propositionsQcm(this, i)
      if (this.interactif) {
        texte += props.texte
      }
      i++

      cpt++
    } this.listeQuestions.push(texte)

    this.listeCorrections.push(texteCorr)

    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
