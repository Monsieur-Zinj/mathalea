import Exercice from '../Exercice'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Calculer avec le logarithme décimal'
export const dateDePublication = '4/5/2024'
export const uuid = '9cd25'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Description didactique de l'exercice
 * @author Claire Rousset
 * Référence
*/
export default class ExerciceCalculsDeLog extends Exercice {
  constructor () {
    super()
    this.consigne = 'Calculer.'
    this.nbQuestions = 5
    this.spacingCorr = 2
  }

  nouvelleVersion () {
    const typeQuestionsDisponibles = ['addition', 'soustraction', 'multiplication']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      const a = randint(-4, 4,[-1,0,1])
      const n = randint(-4, 4)
      const c = randint(0, 4,[-1,0,1])
      const m = randint(-4, 4)
      let answer: string
      switch (listeTypeQuestions[i]) {
        case 'addition':
          texte = `$${lettreDepuisChiffre(i + 1)} = ${a}\\log(${texNombre(10 ** n)}) + ${c}\\log(${texNombre(10 ** m)})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a}\\log(10^{${n}}) + ${c}\\log(10^{${m}})$`
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(n)} + ${c}\\times ${ecritureParentheseSiNegatif(m)}$ `
          answer = String(a * n + c * m)
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(answer)}$`
          break
        case 'soustraction':
          texte = `$${lettreDepuisChiffre(i + 1)} =${a}\\log(${texNombre(10 ** n)}) - ${c}\\log(${texNombre(10 ** m)})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a}\\log(10^{${n}}) - ${c}\\log(10^{${m}})$`
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(n)} - ${c} \\times ${ecritureParentheseSiNegatif(m)}$ `
          answer = String(a * n - c * m)
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(answer)}$`
          break
        case 'multiplication':
            texte = `$${lettreDepuisChiffre(i + 1)} = ${a}\\log(${texNombre(10 ** n)}) \\times ${c}\\log(${texNombre(10 ** m)})$`
            texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a}\\log(10^{${n}}) \\times ${c}\\log(10^{${m}})$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(n)} \\times ${c} \\times ${ecritureParentheseSiNegatif(m)}$ `
            answer = String(a * n * c * m)
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(answer)}$`
            break
      }
      
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
