import Exercice from '../Exercice'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Classifier des probabilités (événements impossibles, certains, possibles).'

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
    this.nbQuestionsModifiable = false
    this.spacing = 1.2
    this.spacingCorr = 1.2
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const typeDeQuestionsDisponibles = ['type1', 'type2', 'type3', 'type4', 'type5'] // On crée les 5 types de questions
    const listeTypeDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    let texteCorr = ''
    const n = randint(1, 5) // n est le nombre le plus petit du dé
    const m = randint(10, 17) // m est le nombre le plus grand du dé
    let texte = `On lance un dé équilibré à $ ${texNombre(m - n + 1)}$ faces numérotées de $ ${texNombre(n)}$ à $ ${texNombre(m)}$. On regarde la face du dessus.<br>`

    for (let i = 0, k, p, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      let bonneReponse
      k = choice([1, 2, 3, 4])
      p = choice([1, 2, 3, 4]) // p est un petit nombre entier qu'on va enlever à n ou ajouter à p
      switch (listeTypeDeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1':
          texte = `Obtenir $ ${texNombre(n - p)}$ est un événement...<br>` // Le LateX entre deux symboles $, les variables dans des ${ }
          bonneReponse = 'impossible'
          texteCorr = `Obtenir $ ${texNombre(n - p)}$ est un événement impossible.<br>`
          break
        case 'type2':
          if (k === 1) {
            texte = 'Obtenir un nombre impair est un événement...<br>'
            texteCorr = 'Obtenir un nombre impair est un événement possible.<br>'
          } else if (k === 2) {
            texte = 'Obtenir un nombre pair est un événement...<br>'
            texteCorr = 'Obtenir un nombre pair est un événement possible.<br>'
          } else if (k === 3) {
            texte = 'Ne pas obtenir un nombre impair est un événement...<br>'
            texteCorr = 'Ne pas obtenir un nombre impair est un événement possible.<br>'
          } else if (k === 4) {
            texte = 'Ne pas obtenir un nombre pair est un événement...<br>'
            texteCorr = 'Ne pas obtenir un nombre pair est un événement possible.<br>'
          }
          bonneReponse = 'possible'
          break
        case 'type3':
          if (k === 1) {
            texte = `Obtenir un nombre compris entre $ ${texNombre(n)}$ et $ ${texNombre(m)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre compris entre $ ${texNombre(n)}$ et $ ${texNombre(m)}$ est un événement certain.<br>`
          }
          if (k === 2) {
            texte = `Obtenir un nombre compris entre $ ${texNombre(m)}$ et $ ${texNombre(n)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre compris entre $ ${texNombre(m)}$ et $ ${texNombre(n)}$ est un événement certain.<br>`
          }
          if (k === 3) {
            texte = `Obtenir un nombre supérieur à $ ${texNombre(n)}$ et inférieur à $ ${texNombre(m)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre supérieur à $ ${texNombre(n)}$ et inférieur à $ ${texNombre(m)}$ est un événement certain.<br>`
          }
          if (k === 4) {
            texte = `Obtenir un nombre inférieur à $ ${texNombre(m)}$ et supérieur à $ ${texNombre(n)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre inférieur à $ ${texNombre(m)}$ et supérieur à $ ${texNombre(n)}$ est un événement certain.<br>`
          }
          bonneReponse = 'certain'
          break
        case 'type4':
          texte = `Obtenir $ ${texNombre(m + p)}$ est un événement...<br>`
          bonneReponse = 'impossible'
          texteCorr = `Obtenir $ ${texNombre(m + p)}$ est un événement impossible.<br>`
          break
        case 'type5':
          texte = `Obtenir $ ${texNombre(n + p)}$ est un événement...<br>`
          bonneReponse = 'possible'
          texteCorr = `Obtenir $ ${texNombre(n + p)}$ est un événement possible.<br>`
          break
        case 'type6':
          if (k === 1) {
            texte = `Obtenir un nombre supérieur à $ ${texNombre(m)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre supérieur à $ ${texNombre(m)}$ est un événement certain.<br>`
            bonneReponse = 'impossible'
          }
          if (k === 2) {
            texte = `Obtenir un nombre inférieur à $ ${texNombre(n)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre inférieur à $ ${texNombre(n)}$ est un événement certain.<br>`
            bonneReponse = 'impossible'
          }
          if (k === 3) {
            texte = `Obtenir un nombre supérieur à $ ${texNombre(n)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre supérieur à $ ${texNombre(n)}$ est un événement certain.<br>`
            bonneReponse = 'possible'
          }
          if (k === 4) {
            texte = `Obtenir un nombre inférieur à $ ${texNombre(m)}$ est un événement...<br>`
            texteCorr = `Obtenir un nombre inférieur à $ ${texNombre(m)}$ est un événement certain.<br>`
            bonneReponse = 'possible'
          }
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
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
      cpt++
    }

    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
