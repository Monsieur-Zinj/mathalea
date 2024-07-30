import Exercice from '../Exercice'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { numAlpha } from '../../lib/outils/outilString'

export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Classer des événements compatibles, incompatibles, contraires.'

export const dateDePublication = '30/7/2024' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = '6a750'
export const refs = {
  'fr-fr': ['4S20-3'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice Différencier événéments compatibles, incompatibles, contraires.
 * @author Mireille Gain
 * Référence 4S20-3
*/
export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Classer les événéments selon qu’ils sont compatibles, incompatibles, contraires.<br>Remarque : Si deux événéments sont contraires (donc incompatibles), on demande de les placer dans la catégorie contraires.<br>On tire une carte dans un jeu de 32 cartes.'
    this.nbQuestions = 5 // Nombre de questions par défaut
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.spacing = 1.5
    this.spacingCorr = 1.5
    const typeDeQuestionsDisponibles = ['type1', 'type2', 'type3', 'type4', 'type5'] // On crée les 5 types de questions
    const listeTypeDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque cycle
    let texte = ''
    let texteCorr = ''
    for (let i = 0, k, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let bonneReponse
      const figure = choice(['un Valet', 'une Dame', 'un Roi'])
      const famille = choice(['Carreau', 'Coeur', 'Pique', 'Trèfle'])
      const couleur = choice(['Rouge', 'Noire'])
      const nombre = choice(['As', 'Sept', 'Huit', 'Neuf', 'Dix'])
      const valeur = choice(['As', 'Sept', 'Huit', 'Neuf', 'Dix', 'Valet', 'Dame', 'Roi'])
      const noir = choice(['Trèfle', 'Pique'])
      const rouge = choice(['Carreau', 'Coeur'])

      k = choice([1, 2])
      switch (listeTypeDeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1':
          if (k === 1) {
            texte += numAlpha(i) + `Les événements "Obtenir ${figure}" et "Obtenir un ${nombre}" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir ${figure}" et "Obtenir un ${nombre}" sont  ` + texteEnCouleurEtGras('incompatibles') + '.'
          } else {
            texte += numAlpha(i) + `Les événements "Obtenir un ${nombre}" et "Obtenir ${figure}" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir un ${nombre}" et "Obtenir ${figure}" sont ` + texteEnCouleurEtGras('incompatibles') + '.'
          }
          bonneReponse = 'incompatibles'
          break
        case 'type2':
          if (k === 1) {
            texte += numAlpha(i) + `<br>Les événements "Obtenir un ${valeur}" et "Obtenir un ${famille}" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir un ${valeur}" et "Obtenir un ${famille}" sont ` + texteEnCouleurEtGras('compatibles') + '.'
          } else {
            texte += numAlpha(i) + `Les événements "Obtenir un ${famille}" et "Obtenir un ${valeur}" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir un ${famille}" et "Obtenir un ${valeur}" sont ` + texteEnCouleurEtGras('compatibles') + '.'
          }
          bonneReponse = 'compatibles'
          break
        case 'type3':
          if (k === 1) {
            texte += numAlpha(i) + 'Les événements "Obtenir une carte de couleur Noire" et "Obtenir une carte de couleur Rouge" sont...<br>'
            texteCorr += '<br>Les événements "Obtenir une carte de couleur Noire" et "Obtenir une carte de couleur Rouge" sont ' + texteEnCouleurEtGras('contraires') + '.'
          } else {
            texte += numAlpha(i) + 'Les événements "Obtenir une carte de couleur Rouge" et "Obtenir une carte de couleur Noire" sont...<br>'
            texteCorr += '<br>Les événements "Obtenir une carte de couleur Rouge" et "Obtenir une carte de couleur Noire" sont ' + texteEnCouleurEtGras('contraires') + '.'
          }
          bonneReponse = 'contraires'
          break
        case 'type4':
          if (k === 2) {
            texte += numAlpha(i) + `Les événements "Obtenir ${figure}" et "Obtenir une carte de couleur ${couleur}" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir ${figure}" et "Obtenir une carte de couleur ${couleur}" sont ` + texteEnCouleurEtGras('compatibles') + '.'
          } else {
            texte += numAlpha(i) + `Les événements "Obtenir une carte de couleur ${couleur}" et "Obtenir ${figure}" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir une carte de couleur ${couleur}" et "Obtenir ${figure}" sont ` + texteEnCouleurEtGras('compatibles') + '.'
          }

          bonneReponse = 'compatibles'
          break
        case 'type5':
          if (k === 2) {
            texte += numAlpha(i) + `Les événements "Obtenir un ${noir}" et "Obtenir une carte de couleur Noire" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir un ${noir}" et "Obtenir une carte de couleur Noire" sont ` + texteEnCouleurEtGras('compatibles') + '.'
          } else {
            texte += numAlpha(i) + `Les événements "Obtenir un ${rouge}" et "Obtenir une carte de couleur Rouge" sont...<br>`
            texteCorr += `<br>Les événements "Obtenir un ${rouge}" et "Obtenir une carte de couleur Rouge" sont ` + texteEnCouleurEtGras('compatibles') + '.'
          }
          bonneReponse = 'compatibles'
          break
      }
      this.autoCorrection[i] = {}
      this.autoCorrection[i].options = { ordered: true }
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: 'compatibles',
          statut: bonneReponse === 'compatibles'
        },
        {
          texte: 'incompatibles',
          statut: bonneReponse === 'incompatibles'
        },
        {
          texte: 'contraires',
          statut: bonneReponse === 'contraires'
        }
      ]
      const props = propositionsQcm(this, i)
      if (this.interactif) {
        texte += props.texte
      }
      if (this.questionJamaisPosee(i, figure, famille, couleur, nombre, valeur, noir, rouge, k)) { // Si la question n'a jamais été posée, on en créé une autre
        i++
      }
      cpt++
    }
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
