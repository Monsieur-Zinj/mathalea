import { choice } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Hms from '../../modules/Hms'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Utiliser les heures décimales'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
/**
 * Convertir une heure décimale dans le format HMS
 *
 * La partie décimale est 25, 75 ou un seul chiffre
 * @author Rémi Angot
 * Rendre l'exercice interactif Laurence Candille
 * Référence 6D101
 */
export const uuid = '6b3e4'
export const ref = '6D101'
export const refs = {
  'fr-fr': ['6D101'],
  'fr-ch': ['10GM3-2']
}
export default function HeuresDecimales () {
  Exercice.call(this)
  this.keyboard = ['hms']
  this.consigne = 'Écrire les durées suivantes en heures et minutes.'
  this.spacing = 2
  this.nbQuestions = 5
  this.nbColsCorr = 1
  this.tailleDiaporama = 3
  this.comment = 'La partie décimale peut être 0,1 ; 0,2 ; 0,3 ; 0,4 ; 0,5 ; 0,6 ; 0,7 ; 0,8 ; 0,9 ; 0,25 ou 0,75 de manière équiprobable.'

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    for (let i = 0, partieEntiere, partieDecimale, minutes, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      partieEntiere = randint(1, 12)
      partieDecimale = choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 75])
      texte = `$${partieEntiere},${partieDecimale}~\\text{h}=$`
      texte += ajouteChampTexteMathLive(this, i, ' clavierHms')
      texte += '<br>'

      if (partieDecimale === 25) {
        texteCorr = `$${partieEntiere},${partieDecimale}~\\text{h}=${partieEntiere}~\\text{h}+\\dfrac{1}{4}~\\text{h}`
        texteCorr += `=${partieEntiere}~\\text{h}~15~\\text{min}$`
        minutes = 15
      } else if (partieDecimale === 75) {
        texteCorr = `$${partieEntiere},${partieDecimale}~\\text{h}=${partieEntiere}~\\text{h}+\\dfrac{3}{4}~\\text{h}`
        texteCorr += `=${partieEntiere}~\\text{h}~45~\\text{min}$`
        minutes = 45
      } else if (partieDecimale === 5) {
        texteCorr = `$${partieEntiere},${partieDecimale}~\\text{h}=${partieEntiere}~\\text{h}+\\dfrac{1}{2}~\\text{h}`
        texteCorr += `=${partieEntiere}~\\text{h}~30~\\text{min}$`
        minutes = 30
      } else {
        texteCorr = `$${partieEntiere},${partieDecimale}~\\text{h}=${partieEntiere}~\\text{h}+\\dfrac{${partieDecimale}}{10}~\\text{h}`
        texteCorr += `=${partieEntiere}~\\text{h}+${partieDecimale}\\times6~\\text{min}=${partieEntiere}~\\text{h}~${partieDecimale * 6}~\\text{min}$`
        minutes = partieDecimale * 6
      }
      if (!context.isAmc) {
        setReponse(this, i, new Hms({ hour: partieEntiere, minute: minutes }), { formatInteractif: 'hms' })
      } else {
        this.autoCorrection[i] = {
          enonce: texte,
          propositions: [
            {
              type: 'AMCNum',
              propositions: [{
                texte: texteCorr,
                statut: '',
                reponse: {
                  texte: "Nombre d'heures",
                  valeur: partieEntiere,
                  param: {
                    digits: 2,
                    decimals: 0,
                    signe: false,
                    approx: 0
                  }
                }
              }]
            },
            {
              type: 'AMCNum',
              propositions: [{
                texte: '',
                statut: '',
                reponse: {
                  texte: 'Nombre de minutes',
                  valeur: minutes,
                  param: {
                    digits: 2,
                    decimals: 0,
                    signe: false,
                    approx: 0
                  }
                }
              }]
            }
          ]
        }
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
