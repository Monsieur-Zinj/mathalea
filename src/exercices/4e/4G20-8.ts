import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import { RedactionPythagore } from './_pythagore'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer mentalement une longueur avec le théorème de Pythagore'
export const dateDePublication = '05/10/2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '6dc45'
export const refs = {
  'fr-fr': ['4G20-8'],
  'fr-ch': []
}
/**
 * Calcul mental utilisant les carrés de 1 à 15 avec le théorème de Pythagore
 * @author Mireille Gain
*/

export default class CalculMentalPythagore extends Exercice {
  constructor () {
    super()
    this.consigne = 'Calculer la longueur demandée sous forme de racine carrée, puis de la partie entière du résultat.'
    this.nbQuestions = 2 // Ligne obligatoire ? Indique le nombre de questions affiché à l'ouverture de l'exercice
    this.spacing = 1.5 // Indique l'espace entre les lignes dans un exercice. C'est 1 par défaut, si cette ligne est absente.
    this.spacingCorr = 1.5
  }

  nouvelleVersion () { // Triangle ABC rectangle en A
    const typeQuestionsDisponibles = ['hypotenuse', 'coteAngleDroit']
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const AB = randint(2, 5)
      const BC = randint(10, 15)
      const AC = randint(6, 9)
      const choixA = randint(1, 26, [17, 15])
      const choixB = randint(1, 26, [17, 15, choixA])
      const choixC = randint(1, 26, [17, 15, choixA, choixB])
      const sommetA = lettreDepuisChiffre(choixA)
      const sommetB = lettreDepuisChiffre(choixB)
      const sommetC = lettreDepuisChiffre(choixC)

      let texte, reponse, texteCorr, reponse0
      switch (listeTypeQuestions[i]) {
        case 'coteAngleDroit':
          if (choice([true, false])) {
            texte = `On considère le triangle $${sommetA}${sommetB}${sommetC}$ rectangle en $${sommetA}$ tel que $${sommetA}${sommetB} = ${AB}$ cm et $${sommetB}${sommetC} = ${BC}$ cm.<br>`
            texte += `Calculer ${sommetA}${sommetC}.`
            reponse0 = `\\sqrt{${BC ** 2 - AB ** 2}}`
            reponse = Math.floor(Math.sqrt(BC ** 2 - AB ** 2))
            texteCorr = RedactionPythagore(`${sommetA}`, `${sommetC}`, `${sommetB}`, 2, AB, reponse, BC)[0]
            texte += ajouteChampTexteMathLive(this, 2 * i, 'inline nospacebefore ' + KeyboardType.clavierFullOperations, { texteAvant: `<br> ${sommetA}${sommetC} = `, texteApres: ('(Racine carrée)') })
            texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'inline nospacebefore ' + KeyboardType.clavierNumbers, { texteAvant: `<br> ${sommetA}${sommetC} $\\approx$ `, texteApres: ('(Partie entière)') })
          } else {
            texte = `On considère le triangle $${sommetA}${sommetB}${sommetC}$ rectangle en $${sommetA}$ tel que $${sommetA}${sommetC} = ${AC}$ cm et $${sommetB}${sommetC} = ${BC}$ cm.<br>`
            texte += `Calculer ${sommetA}${sommetB}.`
            reponse0 = `\\sqrt{${BC ** 2 - AC ** 2}}`
            reponse = Math.floor(Math.sqrt(BC ** 2 - AC ** 2))
            texteCorr = RedactionPythagore(`${sommetA}`, `${sommetB}`, `${sommetC}`, 2, AC, reponse, BC)[0]
            texte += ajouteChampTexteMathLive(this, 2 * i, 'inline nospacebefore ' + KeyboardType.clavierFullOperations, { texteAvant: `<br> ${sommetA}${sommetB} = `, texteApres: ('(Racine carrée)') })
            texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'inline nospacebefore ' + KeyboardType.clavierNumbers, { texteAvant: `<br> ${sommetA}${sommetB} $\\approx$ `, texteApres: ('(Partie entière)') })
          }
          break

        // case 'hypotenuse':
        default:
          texte = `On considère le triangle $${sommetA}${sommetB}${sommetC}$ rectangle en $${sommetA}$ tel que $${sommetA}B = ${AB}$ cm et $${sommetA}C = ${AC}$ cm.<br>`
          texte += `Calculer ${sommetB}${sommetC}.`
          reponse0 = `\\sqrt{${AB ** 2 + AC ** 2}}`
          reponse = Math.floor(Math.sqrt(AB ** 2 + AC ** 2))
          texteCorr = RedactionPythagore(`${sommetA}`, `${sommetB}`, `${sommetC}`, 1, AB, AC, reponse)[0]
          texte += ajouteChampTexteMathLive(this, 2 * i, 'inline nospacebefore ' + KeyboardType.clavierFullOperations, { texteAvant: `<br> ${sommetB}${sommetC} = `, texteApres: ('(Racine carrée)') })
          texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'inline nospacebefore ' + KeyboardType.clavierNumbers, { texteAvant: `<br> ${sommetB}${sommetC} $\\approx$ `, texteApres: ('(Partie entière)') })
          break
      }
      handleAnswers(this, 2 * i, { reponse: { value: reponse0, compare: fonctionComparaison } })
      handleAnswers(this, 2 * i + 1, { reponse: { value: String(reponse), compare: fonctionComparaison } })

      if (this.questionJamaisPosee(i, AB, BC, AC)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
