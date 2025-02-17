import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'

import { setReponse } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'

export const titre = 'Donner l\'écriture décimale à partir d\'un somme d\'entiers et de fractions décimales'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '24/03/2021'

/**
 * Description didactique de l'exercice
 * @author Benjamin Angot
 */

export const uuid = 'ec7e4'
export const ref = 'c3N20'
export const refs = {
  'fr-fr': ['c3N20'],
  'fr-ch': ['9NO13-3']
}
export default function NomQuelconqueDeLaFonctionQuiCreeExercice () {
  Exercice.call(this)
  this.consigne = "Donner l'écriture décimale des nombres suivants."
  this.nbQuestions = 6
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.sup = 1 // Niveau de difficulté
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
  this.sup = 2

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let typesDeQuestionsDisponibles = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6'] // On créé 3 types de questions
    if (parseInt(this.sup) === 1) {
      typesDeQuestionsDisponibles = ['type1', 'type5']
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"

    for (let i = 0, a, b, c, texte, texteCorr, reponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      a = choice([randint(1, 9), randint(1, 9), randint(10, 99)])
      b = randint(1, 9, [a])
      c = randint(1, 9, [a, b]) // Tous les chiffres doivent être différents
      switch (listeTypeDeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1':
          texte = `$${a} + \\dfrac{${b}}{10} + \\dfrac{${c}}{100}$`
          texteCorr = `$${a} + \\dfrac{${b}}{10} + \\dfrac{${c}}{100} = ${texNombre(a + b / 10 + c / 100)} $`
          reponse = calculANePlusJamaisUtiliser(a + b / 10 + c / 100)
          break
        case 'type2':
          texte = `$${a} + \\dfrac{${c}}{100} + \\dfrac{${b}}{10} $`
          texteCorr = `$${a} + \\dfrac{${c}}{100} + \\dfrac{${b}}{10}  = ${texNombre(a + b / 10 + c / 100)} $`
          reponse = calculANePlusJamaisUtiliser(a + b / 10 + c / 100)
          break
        case 'type3':
          texte = `$\\dfrac{${c}}{100} + \\dfrac{${b}}{10} + ${a}$`
          texteCorr = `$\\dfrac{${c}}{100} + \\dfrac{${b}}{10} + ${a} = ${texNombre(a + b / 10 + c / 100)} $`
          reponse = calculANePlusJamaisUtiliser(a + b / 10 + c / 100)
          break
        case 'type4':
          texte = `$\\dfrac{${c}}{100} + ${a} + \\dfrac{${b}}{10} $`
          texteCorr = `$\\dfrac{${c}}{100} + ${a} + \\dfrac{${b}}{10}  = ${texNombre(a + b / 10 + c / 100)} $`
          reponse = calculANePlusJamaisUtiliser(a + b / 10 + c / 100)
          break
        case 'type5':
          texte = `$${a} + \\dfrac{${b}}{100}$`
          texteCorr = `$${a} + \\dfrac{${b}}{100} = ${texNombre(a + b / 100)}$`
          reponse = calculANePlusJamaisUtiliser(a + b / 100)
          break
        case 'type6':
          texte = `$\\dfrac{${b}}{100} + ${a}$`
          texteCorr = `$\\dfrac{${b}}{100} + ${a} = ${texNombre(a + b / 100)}$`
          reponse = calculANePlusJamaisUtiliser(a + b / 100)
          break
      }

      if (this.questionJamaisPosee(i, a, b, c)) {
        setReponse(this, i, reponse)
        texte += ajouteChampTexteMathLive(this, i)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : L\'ordre est respecté\n 2 : L\'ordre des termes est aléatoire']
}
