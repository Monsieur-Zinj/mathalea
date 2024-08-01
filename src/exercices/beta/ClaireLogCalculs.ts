import Exercice from '../Exercice.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import { rienSi1 } from '../../lib/outils/ecritures.js'

export const titre = 'Calculer avec le logarithme décimal'
export const dateDePublication = '4/5/2024'
export const uuid = '9cd25'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['test'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice
 * @author Claire Rousset
 * Référence
*/
export default class ExerciceCalculsAvecLog extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    if (this.nbQuestions === 1) {
      this.consigne = 'Calculer la valeur de l\'expression suivante.'
    } else {
      this.consigne = 'Calculer les valeurs des expressions suivantes.'
    }
    this.spacingCorr = 2
  }

  nouvelleVersion () {
    const typeQuestionsDisponibles = ['addition', 'soustraction', 'multiplication']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      const listeFacteurs = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [4, 5]]
      .map(paire => [[paire[0], paire[1]], [paire[1], paire[0]]]) // On crée les mêmes mais inversés
      .flat(1) // On applatit la liste de liste
      .map(paire => [[paire[0], paire[1]], [-paire[0], paire[1]]]) // On crée les variations avec les négatifs
      .flat(1) // on applatit à nouveau
      const [a, c] = choice(listeFacteurs)
      const [m, n] = choice(listeFacteurs)
      let answer: string
      let operation = ''
      switch (listeTypeQuestions[i]) {
        case 'addition':
          operation = '+'
          answer = String(a * n + c * m)
        break
        case 'soustraction':
          operation = '-'
          answer = String(a * n - c * m)
        break
        case 'multiplication':
          operation = '\\times'
          answer = String(a * n * c * m)
        break
      }
      texte = `$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)}\\log(${texNombre(10 ** n)}) ${operation} ${rienSi1(c)}\\log(${texNombre(10 ** m)})$`
      texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)}\\log(${texNombre(10 ** n)}) ${operation} ${rienSi1(c)}\\log(${texNombre(10 ** m)})$`
      texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)}\\log(10^{${n}}) ${operation} ${rienSi1(c)}\\log(10^{${m}})$`
      if (a == 1 && c !== 1) {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} =  ${n} ${operation} ${rienSi1(c)}\\times ${ecritureParentheseSiNegatif(m)}$ `
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} =  ${n} ${operation} ${ecritureParentheseSiNegatif(c*m)} $ `
      } else if (a == 1 && c == 1) {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} =  ${n} ${operation} ${ecritureParentheseSiNegatif(m)}$ `
      } else if (a == -1 && c !== 1) {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)} ${ecritureParentheseSiNegatif(n)} ${operation} ${rienSi1(c)}\\times ${ecritureParentheseSiNegatif(m)}$ `
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)} ${ecritureParentheseSiNegatif(n)} ${operation} ${ecritureParentheseSiNegatif(c*m)}$ `
        if ( operation == '-' && c*m < 0 ) {
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)} ${ecritureParentheseSiNegatif(n)} + ${Math.abs(c*m)}$ `
        }
      } else if (a == -1 && c == 1) {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)} ${ecritureParentheseSiNegatif(n)} ${operation} ${ecritureParentheseSiNegatif(m)}$ `
      } else if (a !== 1 && c == 1 ) {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(n)} ${operation} ${ecritureParentheseSiNegatif(m)}$ `
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a*n} ${operation} ${ecritureParentheseSiNegatif(m)}$ `
        if ( operation == '-' && c*m < 0 ) {
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a*n} + ${Math.abs(c*m)}$ `
        }
      } else {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${rienSi1(a)} \\times ${ecritureParentheseSiNegatif(n)} ${operation} ${rienSi1(c)}\\times ${ecritureParentheseSiNegatif(m)}$ `
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a*n} ${operation} ${ecritureParentheseSiNegatif(c*m)}$ `
        if ( operation == '-' && c*m < 0 ) {
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a*n} + ${Math.abs(c*m)}$ `
        }
      }
      texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(answer)}$`
    
      
      if (this.interactif) {
        // @ts-expect-error problème typage
        handleAnswers(this, i, { reponse: { value: answer } })
        texte += `<br>$${lettreDepuisChiffre(i + 1)} = $`
        texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
      }
      if (this.questionJamaisPosee(i, a, m, n, c)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}