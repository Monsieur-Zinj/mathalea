import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Manipuler les conversions'
export const dateDePublication = '11/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true

/*!
 * @author Gilles Mora
 * Créé le 05/10/2023
 * Référence can6M13
 */
export const uuid = '59144'
export const ref = 'can6M13'
export const refs = {
  'fr-fr': ['can6M13'],
  'fr-ch': []
}
export default function CombienDeFois () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatInteractif = 'calcul'
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    switch (choice([1, 1, 2, 2, 3, 3, 4])) {
      case 0:{
        const Choixprefixes = [[10, 'h'], [100, 'da'], [1000, ''], [10000, 'd']]
        const prefixes = choice(Choixprefixes)
        const unite = choice(['g', 'm', 'L'])
        const choix = choice([true, false])
        this.question = `Le professeur demande à un élève : <br>
      ${choix ? `« $1$ k${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? »` : `« $1$ ${prefixes[1]}${unite} c'est combien de fois plus petit que $1$ k${unite} ? »`}<br>
        La réponse correcte à cette question est : ${this.interactif ? '' : '$\\ldots$'}`
        this.optionsChampTexte = { texteApres: 'fois' }
        this.reponse = prefixes[0]
        this.correction = ` $1$ k${unite}  $= ${texNombre(prefixes[0])}$ ${prefixes[1]}${unite}`
        this.canEnonce = `Le professeur demande à un élève :<br> 
        « $1$ k${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? » `
        this.canReponseACompleter = 'La réponse correcte à cette question est : <br>$\\ldots$'
      }
        break

      case 1:{
        const Choixprefixes = [[10, 'da'], [100, ''], [1000, 'd'], [10000, 'c']]
        const prefixes = choice(Choixprefixes)
        const unite = choice(['g', 'm', 'L'])
        const choix = choice([true, false])
        this.question = `Le professeur demande à un élève : <br>
          ${choix ? `« $1$ h${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? »` : `« $1$ ${prefixes[1]}${unite} c'est combien de fois plus petit que $1$ h${unite} ? »`}<br>
            La réponse correcte à cette question est : ${this.interactif ? '' : '$\\ldots$'}`
        this.optionsChampTexte = { texteApres: 'fois' }
        this.reponse = prefixes[0]
        this.correction = ` $1$ h${unite}  $= ${texNombre(prefixes[0])}$ ${prefixes[1]}${unite}`
        this.canEnonce = `Le professeur demande à un élève :<br> 
            « $1$ h${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? » `
        this.canReponseACompleter = 'La réponse correcte à cette question est : <br>$\\ldots$'
      }
        break
      case 2:{
        const Choixprefixes = [[10, ''], [100, 'd'], [1000, 'c'], [10000, 'm']]
        const prefixes = choice(Choixprefixes)
        const unite = choice(['g', 'm', 'L'])
        const choix = choice([true, false])
        this.question = `Le professeur demande à un élève : <br>
              ${choix ? `« $1$ da${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? »` : `« $1$ ${prefixes[1]}${unite} c'est combien de fois plus petit que $1$ da${unite} ? »`}<br>
                La réponse correcte à cette question est : ${this.interactif ? '' : '$\\ldots$'}`
        this.optionsChampTexte = { texteApres: 'fois' }
        this.reponse = prefixes[0]
        this.correction = ` $1$ da${unite}  $= ${texNombre(prefixes[0])}$ ${prefixes[1]}${unite}`
        this.canEnonce = `Le professeur demande à un élève : <br>
                « $1$ da${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? » `
        this.canReponseACompleter = 'La réponse correcte à cette question est : <br>$\\ldots$'
      }
        break

      case 3:{
        const Choixprefixes = [[10, 'd'], [100, 'c'], [1000, 'm']]
        const prefixes = choice(Choixprefixes)
        const unite = choice(['g', 'm', 'L'])
        const choix = choice([true, false])
        this.question = `Le professeur demande à un élève : <br>
                  ${choix ? `« $1$ ${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? »` : `« $1$ ${prefixes[1]}${unite} c'est combien de fois plus petit que $1$ ${unite} ? »`}<br>
                    La réponse correcte à cette question est : ${this.interactif ? '' : '$\\ldots$'}`
        this.optionsChampTexte = { texteApres: 'fois' }
        this.reponse = prefixes[0]
        this.correction = ` $1$ ${unite}  $= ${texNombre(prefixes[0])}$ ${prefixes[1]}${unite}`
        this.canEnonce = `Le professeur demande à un élève : <br>
                    « $1$ ${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? » `
        this.canReponseACompleter = 'La réponse correcte à cette question est : <br>$\\ldots$'
      }
        break

      case 4:{
        const Choixprefixes = [[10, 'c'], [100, 'm']]
        const prefixes = choice(Choixprefixes)
        const unite = choice(['g', 'm', 'L'])
        const choix = choice([true, false])
        this.question = `Le professeur demande à un élève :<br> 
                      ${choix ? `« $1$ d${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? »` : `« $1$ ${prefixes[1]}${unite} c'est combien de fois plus petit que $1$ d${unite} ? »`}<br>
                        La réponse correcte à cette question est : ${this.interactif ? '' : '$\\ldots$'}`
        this.optionsChampTexte = { texteApres: 'fois' }
        this.reponse = prefixes[0]
        this.correction = ` $1$ d${unite}  $= ${texNombre(prefixes[0])}$ ${prefixes[1]}${unite}`
        this.canEnonce = `Le professeur demande à un élève : <br>
                        « $1$ d${unite} c'est combien de fois plus grand que $1$ ${prefixes[1]}${unite} ? » `
        this.canReponseACompleter = 'La réponse correcte à cette question est : <br>$\\ldots$'
      }
        break
    }
  }
}
