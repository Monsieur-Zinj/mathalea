import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre, texNombre2 } from '../../lib/outils/texNombre'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'

export const dateDePublication = '23/10/2024'

export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Multiplier par 0,1 ; 0,01 ; 0,001 (compléter avec le nombre qui convient)'

/**
 * @author Ali BEN YOUSSEF
 * Relecture : Coach Jean Claude LHOTE
 */
export const uuid = '5df6e'
export const refs = {
  'fr-fr': ['6C30-5b'],
  'fr-ch': []
}
class MultiplierPar001 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4 // Ici le nombre de questions
    this.nbQuestionsModifiable = true // Active le formulaire nombre de questions
    this.nbCols = 1 // Le nombre de colonnes dans l'énoncé LaTeX
    this.nbColsCorr = 1// Le nombre de colonne pour la correction LaTeX
    this.consigne = 'Compléter les pointillés.'

    this.sup = false
    this.sup2 = 4
    this.besoinFormulaireCaseACocher = ['Nombres entiers', true]
    this.besoinFormulaire2Texte = ['Type de questions', 'Nombres séparés par des tirets\n1 : Nombre à retrouver\n2 : Fraction décimale à retrouver\n3 : Mélange']
  }

  // c'est ici que commence le code de l'exercice cette fonction crée une copie de l'exercice
  nouvelleVersion () {
    // la variable numeroExercice peut être récupérée pour permettre de différentier deux copies d'un même exo
    // Par exemple, pour être certain de ne pas avoir les mêmes noms de points en appelant 2 fois cet exo dans la même page

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 2,
      melange: 3,
      defaut: 3,
      nbQuestions: this.nbQuestions
    })

    const rang = ['millièmes', 'centièmes', 'dixièmes']

    for (let i = 0, texte, texteCorr, coef, nombre, nombreentier, resultat, exposant, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      texte = '' // Nous utilisons souvent cette variable pour construire le texte de la question.
      texteCorr = '' // Idem pour le texte de la correction.
      coef = -randint(1, 3)
      if (!this.sup) {
        exposant = -randint(1, 3)
      } else {
        exposant = 0
      }
      nombreentier = randint(10, 1000) + randint(10, 999) * choice([0, 1000])
      nombre = nombreentier * 10 ** exposant
      resultat = nombre * 10 ** coef
      let reponse: string
      switch (listeTypeDeQuestions[i]) { // Chaque question peut être d'un type différent, ici 3 cas sont prévus...
        case 1:
          // texte = `$\\ldots\\ldots\\ldots\\ldots \\times ${texNombre2(10 ** coef)}${sp(2)}=${sp(2)}${texNombre2(resultat)}$`
          texte = remplisLesBlancs(this, i, `%{champ1} \\times ${texNombre2(10 ** coef)}${sp(2)}=${sp(2)}${texNombre2(resultat)}`)
          texteCorr = `Quand on multiplie par $${texNombre2(10 ** coef)}=${texFractionFromString(1, 10 ** (-coef))}$, chaque chiffre prend une valeur $${texNombre2(10 ** (-coef))}$ fois plus petite.<br>`
          texteCorr += `Le chiffre des unités se positionne donc dans les ${rang[3 + coef]} :<br>`
          texteCorr += `$${miseEnEvidence(texNombre2(nombre))} \\times ${texNombre2(10 ** coef)}${sp(2)}=${sp(2)}${texNombre2(resultat)}$`
          reponse = texNombre(nombre, 3)
          break

        default:
          // texte = `$${texNombre2(nombre)} \\times \\ldots\\ldots\\ldots${sp(2)}=${sp(2)}${texNombre2(resultat)}$`
          texte = remplisLesBlancs(this, i, `${texNombre2(nombre)} \\times %{champ1}${sp(2)}=${sp(2)}${texNombre2(resultat)}`)
          texteCorr = `Quand on multiplie par $${texNombre2(10 ** coef)}=${texFractionFromString(1, 10 ** (-coef))}$, chaque chiffre prend une valeur $${texNombre2(10 ** (-coef))}$ fois plus petite.<br>`
          texteCorr += `Le chiffre des unités se positionne donc dans les ${rang[3 + coef]} :<br>`
          texteCorr += `$${texNombre2(nombre)} \\times ${miseEnEvidence(texNombre2(10 ** coef))}${sp(2)}=${sp(2)}${texNombre2(resultat)}$`
          reponse = texNombre(10 ** coef, 3)
          break
      }

      if (this.questionJamaisPosee(i, nombre, coef)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        handleAnswers(this, i, { champ1: { value: reponse } })
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
export default MultiplierPar001
