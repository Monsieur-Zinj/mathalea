import Exercice from '../Exercice'
import { randint, listeQuestionsToContenu, gestionnaireFormulaireTexte } from '../../modules/outils'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer la valeur d\'une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '4/5/2024'

function garantirUnNegatifTuple (a, b, x) {
  // Convertir les valeurs en tableau pour faciliter la manipulation
  const valeurs = [a, b, x]

  // Si aucune valeur n'est négative
  if (!valeurs.some(v => v < 0)) {
    // Choisir aléatoirement un index à rendre négatif
    const indexAModifier = Math.floor(Math.random() * 3)
    valeurs[indexAModifier] = randint(-10, -1)
  }

  // Retourner le tuple (sous forme de tableau destructurable)
  return valeurs
}

/**
 * Description didactique de l'exercice
 * @author
 * Référence
*/
export const uuid = 'c4388'
export const ref = '2N40-7'
export const refs = {
  'fr-fr': ['2N40-7'],
  'fr-ch': []
}

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Calcule'
    this.nbQuestions = 10

    // this.besoinFormulaireTexte= ['Difficulté', 3, '1 : Facile\n2 : Moyen\n3 : Difficile'] // le paramètre sera numérique de valeur max 3 (le 3 en vert)
    this.besoinFormulaireTexte = ['Type d\'expression', 'Nombres séparés par des tirets\n1: (a+b)x\n2: a+bx\n3: ax^2+bx+c']
    this.besoinFormulaire2Texte = ['Type de nombres', 'Nombres séparés par des tirets\n1: entiers positifs\n2: entiers négatifs']
    this.sup = 2 // Valeur du paramètre par défaut
    this.sup2 = 3 // Valeur du paramètre par défaut
    // Remarques : le paramètre peut aussi être un texte avec : this.besoinFormulaireTexte = [texte, tooltip]
    //              il peut aussi être une case à cocher avec : this.besoinFormulaireCaseACocher = [texte] (dans ce cas, this.sup = true ou this.sup = false)
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const typeExpression = ['(a+b)x', 'a+bx', 'ax^2+bx+c']
    const typeDeNombres = ['entiers positifs', 'entiers négatifs'] // fractions positives et négatives, racines positives et négatives

    const listeTypeExpression = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      defaut: 2,
      listeOfCase: typeExpression,
      nbQuestions: this.nbQuestions,
      melange: 4
    })

    const listeTypeDeNombres = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 2,
      defaut: 3,
      listeOfCase: typeDeNombres,
      nbQuestions: this.nbQuestions,
      melange: 3
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let [a, b, x, c] = []
      switch (listeTypeExpression[i]) {
        case '(a+b)x':
          switch (listeTypeDeNombres[i]) {
            case 'entiers positifs':
              a = randint(1, 10)
              b = randint(1, 10)
              x = randint(1, 10)
              break
            case 'entiers négatifs':
              [a, b, x] = garantirUnNegatifTuple(randint(-10, 10), randint(-10, 10), randint(-10, 10))
              break
          }
          // a et b entre pare
          texte = `$(${a}+${b})\\times x$ pour $x=${x}$`
          texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble, { texteAvant: '=' }) + '<br>'
          texteCorr = `$(${a}+${b})\\times ${x} = ${a + b}\\times ${x} = ${(a + b) * x}$`
          handleAnswers(this, i, { reponse: { value: (a + b) * x, compare: fonctionComparaison } })
          break
        case 'a+bx':
          switch (listeTypeDeNombres[i]) {
            case 'entiers positifs':
              a = randint(1, 10)
              b = randint(1, 10)
              x = randint(1, 10)
              break
            case 'entiers négatifs':
              a = randint(-10, -1)
              b = randint(-10, -1)
              x = randint(-10, -1)
              break
          }
          texte = `$${a} + ${b}\\times ${x}$`
          texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble, { texteAvant: '=' }) + '<br>'
          texteCorr = `$${a} + ${b}\\times ${x} = ${a} + ${b * x} = ${a + b * x}$`
          handleAnswers(this, i, { reponse: { value: a + b * x, compare: fonctionComparaison } })
          break
        case 'ax^2+bx+c':
          switch (listeTypeDeNombres[i]) {
            case 'entiers positifs':
              a = randint(1, 5)
              b = randint(1, 10)
              c = randint(1, 10)
              x = randint(1, 5)
              break
            case 'entiers négatifs':
              a = randint(-5, -1)
              b = randint(-10, -1)
              c = randint(-10, -1)
              x = randint(-5, -1)
              break
          }
          texte = `$${a}\\times ${x}^2 + ${b}\\times ${x} + ${c}$`
          texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble, { texteAvant: '=' }) + '<br>'
          texteCorr = `$${a}\\times ${x}^2 + ${b}\\times ${x} + ${c} = ${a * x * x} + ${b * x} + ${c} = ${a * x * x + b * x + c}$`
          handleAnswers(this, i, { reponse: { value: a * x * x + b * x + c, compare: fonctionComparaison } })
          break
      }
      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, a, b, x, c)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
