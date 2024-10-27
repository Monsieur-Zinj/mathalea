import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1 } from '../../lib/outils/ecritures'
import { abs } from '../../lib/outils/nombres'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { lettreIndiceeDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { equalFractionCompareSansRadical } from '../../lib/interactif/comparisonFunctions'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import FractionEtendue from '../../modules/FractionEtendue'

export const titre = 'Simplifier une fraction pour supprimer la racine carrée de son dénominateur'
export const dateDeModifImportante = '26/04/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 *
 * @author Stéphane Guyon
 */
export const uuid = '4771d'
export const ref = '2N32-7'
export const refs = {
  'fr-fr': ['2N32-7'],
  'fr-ch': []
}
export default function Rendreentier () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 2

  this.nouvelleVersion = function () {
    this.consigne = ' Trouver une fraction égale à celle proposée en supprimant la racine carrée de son dénominateur.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const listeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      melange: 4,
      defaut: 4,
      nbQuestions: this.nbQuestions
    })

    for (let i = 0, a, b, c, d, n, texte, texteCorr, reponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(2, 11)
      b = randint(2, 11, [4, 8, 9])
      c = randint(2, 9)
      d = randint(-7, 7, [-1, 0, 1])

      switch (listeQuestions[i]) {
        case 1 :
          n = pgcd(a, b)
          texte = `$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a} }{\\sqrt{${b}}} $`
          reponse = texFractionFromString(a + `\\sqrt{${b}}`, b)
          texteCorr = `Pour lever l'irrationnalité du dénominateur, il suffit de multiplier le numérateur et le dénominateur de la fraction par $\\sqrt{${b}}$.`
          texteCorr += `<br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a} }{\\sqrt{${b}}}=\\dfrac{ ${a} \\times \\sqrt{${b}}} {\\sqrt{${b}} \\times \\sqrt{${b}}} $`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=${n !== 1 ? reponse : miseEnEvidence(reponse)}$`
          if (n !== 1) {
            if (b === n && a === n) reponse = texFractionFromString(`\\sqrt{${b}}`, 1)
            else if (b === n) reponse = texFractionFromString(`${a / n}\\sqrt{${b}}`, 1)
            else if (a === n) reponse = texFractionFromString(`\\sqrt{${b}}`, `${b / n}`)
            else reponse = texFractionFromString(`${a / n} \\sqrt{${b}}`, `${b / n}`)
            texteCorr += `<br><br> $${lettreIndiceeDepuisChiffre(i + 1)}=${miseEnEvidence(reponse)}$`
          }
          break
        case 2 :
          texte = `$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a} }{${c}${ecritureAlgebrique(d)}\\sqrt{${b}}} $ `
          texteCorr = 'Pour lever l\'irrationnalité du dénominateur d\'une fraction,  la stratégie consiste à utiliser sa "quantité conjuguée" pour faire apparaître l\'identité remarquable $a^2-b^2$ au dénominateur.'
          texteCorr += '<br>Ici, il faut donc multiplier le numérateur et le dénominateur de la fraction par '
          texteCorr += ` $${c}${ecritureAlgebrique(-d)}\\sqrt{${b}}$.`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a} }{${c}${ecritureAlgebrique(d)}\\sqrt{${b}}}$`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a}\\times (${c}${ecritureAlgebrique(-d)}\\sqrt{${b}}) }{(${c}${ecritureAlgebrique(d)}\\sqrt{${b}})(${c}${ecritureAlgebrique(-d)}\\sqrt{${b}})}$`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a * c} ${ecritureAlgebrique(-a * d)}\\sqrt{${b}}}{(${c})^2-\\left(${abs(d)}\\sqrt{${b}}\\right)^2}$ `
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a * c} ${ecritureAlgebriqueSauf1(-a * d)}\\sqrt{${b}}}{${(c * c)}-(${d * d}\\times${b})}$`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a * c} ${ecritureAlgebriqueSauf1(-a * d)}\\sqrt{${b}}}{${c * c}-${d * d * b}}$`
          n = pgcd(a * c, -a * d, c * c - d * d * b)
          if (n === 1) {
            reponse = texFractionFromString(`${a * c} ${ecritureAlgebriqueSauf1(-a * d)}\\sqrt{${b}}`, c * c - d * d * b)
            texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=${c * c - d * d * b < 0 ? reponse : miseEnEvidence(reponse)}$`
            if (c * c - d * d * b < 0) {
              reponse = texFractionFromString(`${-a * c} ${ecritureAlgebriqueSauf1(a * d)}\\sqrt{${b}}`, -c * c + d * d * b)
              texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=${miseEnEvidence(reponse)}$`
            }
          } else {
            texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a * c} ${ecritureAlgebriqueSauf1(-a * d)}\\sqrt{${b}}}{${c * c - d * d * b}}$`
            reponse = texFractionFromString(`${a * c / n} ${ecritureAlgebriqueSauf1(-a * d / n)}\\sqrt{${b}}`, c * c / n - d * d * b / n)
            texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=${c * c - d * d * b < 0 ? reponse : miseEnEvidence(reponse)}$`
            if (c * c - d * d * b < 0) {
              reponse = texFractionFromString(`${-a * c / n} ${ecritureAlgebriqueSauf1(a * d / n)}\\sqrt{${b}}`, -c * c / n + d * d * b / n)
              texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=${miseEnEvidence(reponse)}$`
            }
          }
          break
        case 3:
        {
          d = randint(2, 9)

          texte = `$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a} }{${c}${ecritureAlgebrique(d)}\\sqrt{x}} $ définie sur $D=\\left]${new FractionEtendue(c ** 2, d ** 2).texFSD};+\\infty\\right[$`
          texteCorr = 'Pour lever l\'irrationnalité du dénominateur d\'une fraction,  la stratégie consiste à utiliser sa "quantité conjuguée" pour faire apparaître l\'identité remarquable $a^2-b^2$ au dénominateur.'
          texteCorr += '<br>Ici, il faut donc multiplier le numérateur et le dénominateur de la fraction par '
          texteCorr += ` $ ${c}${ecritureAlgebrique(-d)}\\sqrt{x}$.<br>`
          texteCorr += 'On vérifie bien que cette expression ne s\'annule pas sur $D$ :<br>'
          texteCorr += ` $\\begin{aligned} \\phantom{\\iff} &${c}${ecritureAlgebrique(-d)}\\sqrt{x}=0\\\\`
          texteCorr += ` \\iff & ${d}\\sqrt{x}=${c}\\\\`
          const fractionAttendue = new FractionEtendue(c, d)
          texteCorr += fractionAttendue.d === fractionAttendue.den ? '' : ` \\iff & \\sqrt{x}=${fractionAttendue.texFSD}\\\\`
          texteCorr += ` \\iff & \\sqrt{x}=${fractionAttendue.texFractionSimplifiee}\\\\`
          texteCorr += ` \\iff & x=${new FractionEtendue(c ** 2, d ** 2).texFractionSimplifiee}\\\\`
          texteCorr += '\\end{aligned}$'
          texteCorr += `<br>Comme $${new FractionEtendue(c ** 2, d ** 2).texFractionSimplifiee} \\notin D$, la "quantité conjuguée" $${c}${ecritureAlgebrique(-d)}\\sqrt{x}$ ne s'annule pas sur $D$.`
          texteCorr += '<br>On peut donc simplifier l\'expression :'
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a} }{${c}${ecritureAlgebrique(d)}\\sqrt{x}}$`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a}\\times (${c}${ecritureAlgebrique(-d)}\\sqrt{x}) }{(${c}${ecritureAlgebrique(d)}\\sqrt{x})(${c}${ecritureAlgebrique(-d)}\\sqrt{x})}$`
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=\\dfrac{ ${a * c} ${ecritureAlgebrique(-a * d)}\\sqrt{x}}{(${c})^2-\\left(${abs(d)}\\sqrt{x}\\right)^2}$ `
          reponse = texFractionFromString(`${a * c} ${ecritureAlgebriqueSauf1(-a * d)}\\sqrt{x}`, `${(c * c)}-${d * d} x`)
          n = pgcd(a * d, c * c, d * d, a * c)
          texteCorr += `<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=${n !== 1 ? reponse : miseEnEvidence(reponse)}$`
          if (n !== 1) {
            reponse = texFractionFromString(`${a * c / n} ${ecritureAlgebriqueSauf1(-a * d / n)}\\sqrt{x}`, `${(c * c / n)}${ecritureAlgebriqueSauf1(-d * d / n)}x`)
            texteCorr += `$${lettreIndiceeDepuisChiffre(i + 1)}=${miseEnEvidence(reponse)}$`
          }
        }
      }
      texte += ajouteChampTexteMathLive(this, i, ' ', { texteAvant: listeQuestions[i] < 3 ? `$${sp()}=$` : (`<br><br>$${lettreIndiceeDepuisChiffre(i + 1)}=$`) })
      handleAnswers(this, i, { reponse: { value: reponse, compare: equalFractionCompareSansRadical } }, { formatInteractif: 'calcul' })

      if (this.questionJamaisPosee(i, a, b, c, d)) { // <- laisser  le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : Dénominateur « racine de a »',
      '2 : Dénominateur « a + racine de b »',
      '3 : Dénominateur « a + b racine de x »',
      '4 : Mélange'
    ].join('\n')
  ]
}
