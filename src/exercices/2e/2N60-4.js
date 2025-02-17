import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texFractionFromString, texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, rienSi1 } from '../../lib/outils/ecritures'
import { abs, signe } from '../../lib/outils/nombres'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { pgcd } from '../../lib/outils/primalite'
import { texSymbole } from '../../lib/format/style'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import FractionEtendue from '../../modules/FractionEtendue'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Résoudre une inéquation du premier degré'
export const dateDeModifImportante = '07/06/2024'
/**
 * Inéquations du premier degré
 * * Type 1 : x+a≤b ou ax≤b
 * * Type 2 : ax+b≤c
 * * Type 3 : ax+b≤cx+d
 * * Tous les types
 * @author Remi Angot et Guillaume Valmont et Gilles Mora pour l'interactif
 * 2N60-4, ex 2L13
 */
export const uuid = 'bc1e4'
export const ref = '2N60-4'
export const refs = {
  'fr-fr': ['2N60-4'],
  'fr-ch': []
}
export default function ExerciceInequation1 () {
  Exercice.call(this)
  this.titre = titre
  this.spacing = 1.5
  context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1.5)
  this.correctionDetailleeDisponible = true
  if (!context.isHtml) {
    this.correctionDetaillee = false
  }
  this.sup = true // Avec des nombres relatifs
  this.sup2 = 4 // Choix du type d'inéquation
  this.nbQuestions = 2

  this.nouvelleVersion = function () {
    this.consigne = 'Résoudre ' + (this.nbQuestions !== 1 ? 'les inéquations suivantes' : 'l\'inéquation suivante') + '.'
    let listeTypeDeQuestions

    switch (this.sup2.toString()) {
      case '1':
        listeTypeDeQuestions = ['ax≤b', 'x+b≤c']
        break
      case '2':
        listeTypeDeQuestions = ['ax+b≤c']

        break
      case '3':
        listeTypeDeQuestions = ['ax+b≤cx+d']
        break
      default:
        listeTypeDeQuestions = [
          'ax+b≤0',
          'ax+b≤c',
          'ax≤b',
          'x+b≤c',
          'ax+b≤cx+d'
        ]
        break
    }
    listeTypeDeQuestions = combinaisonListes(
      listeTypeDeQuestions,
      this.nbQuestions
    )
    for (let i = 0, a, b, c, d, reponse, symboleInegalite, symboleInegaliteOppose, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // On limite le nombre d'essais pour chercher des valeurs nouvelles
      a = randint(2, 13)
      b = randint(1, 13)
      c = randint(1, 13)
      d = randint(1, 13)

      switch (randint(1, 4)) {
        case 1:

          symboleInegalite = '<'
          symboleInegaliteOppose = '>'

          break
        case 2:

          symboleInegalite = '≤'
          symboleInegaliteOppose = '≥'

          break
        case 3:

          symboleInegalite = '>'
          symboleInegaliteOppose = '<'
          break
        case 4:
          symboleInegalite = '≥'
          symboleInegaliteOppose = '≤'
          break
      }
      if (this.sup) {
        a *= choice([-1, 1])
        b *= choice([-1, 1])
        c *= choice([-1, 1])
        d *= choice([-1, 1])
      }
      if (listeTypeDeQuestions[i] === 'ax+b≤0' ||
        listeTypeDeQuestions[i] === 'ax+b≤c') {
        if (listeTypeDeQuestions[i] === 'ax+b≤0') {
          c = 0
        }
        if (!this.sup && c < b) {
          b = randint(1, 9)
          c = randint(b, 15) // c sera plus grand que b pour que c-b>0
        }
        texte = `$${a}x${ecritureAlgebrique(b)}${texSymbole(symboleInegalite)}${c}$`
        texteCorr = texte + '<br>'
        if (this.correctionDetaillee) {
          if (b > 0) {
            texteCorr += `On soustrait $${b}$ aux deux membres.<br>`
          } else {
            texteCorr += `On ajoute $${-1 * b}$ aux deux membres.<br>`
          }
        }
        texteCorr += `$${a}x${ecritureAlgebrique(b)}${miseEnEvidence(ecritureAlgebrique(-1 * b), 'blue')}
          ${texSymbole(symboleInegalite)}${c}${miseEnEvidence(ecritureAlgebrique(-1 * b), 'blue')}$<br>`
        texteCorr += `$${a}x${texSymbole(symboleInegalite)}${c - b}$<br>`
        if (this.correctionDetaillee) {
          texteCorr += `On divise les deux membres par $${a}$.<br>`
          if (a < 0) {
            texteCorr += `Comme $${a}$ est négatif, l'inégalité change de sens.<br>`
          }
        }
        if (a < 0) {
          texteCorr += `$${a}x${miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a) +
            texSymbole(symboleInegaliteOppose), 'blue')}${c - b + miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a), 'blue')}$<br>`
          texteCorr += `$x${texSymbole(symboleInegaliteOppose)}${texFractionFromString(c - b, a)}$`
          texteCorr += `<br>$x${texSymbole(symboleInegaliteOppose)}${texFractionReduite(c - b, a)}$`
        } else {
          texteCorr += `$${a}x${miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a), 'blue')}
            ${texSymbole(symboleInegalite)}${c - b + miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a), 'blue')}$<br>`
          texteCorr += `$x${texSymbole(symboleInegalite)}${texFractionFromString(c - b, a)}$`
          if (pgcd(abs(a), abs(c - b)) > 1) {
            texteCorr += `<br>$x${texSymbole(symboleInegalite)}${texFractionReduite(c - b, a)}$`
          }
        }
        if ((symboleInegalite === '<' && a >= 0) || (symboleInegalite === '>' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S = ${miseEnEvidence(`\\left] -\\infty\\,;\\,${texFractionReduite(c - b, a)} \\right[`)}$.`
          reponse = `]-\\infty;${new FractionEtendue(c - b, a).texFraction}[`
        } else if ((symboleInegalite === '≤' && a >= 0) || (symboleInegalite === '≥' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${texFractionReduite(c - b, a)} \\right] `)}$.`
          reponse = `]-\\infty;${new FractionEtendue(c - b, a).texFraction}]`
        } else if ((symboleInegalite === '>' && a >= 0) || (symboleInegalite === '<' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] ${texFractionReduite(c - b, a)}\\,;\\,+\\infty \\right[`)}$.`
          reponse = `]${new FractionEtendue(c - b, a).texFraction};+\\infty[`
        } else if ((symboleInegalite === '≥' && a >= 0) || (symboleInegalite === '≤' && a < 0)) {
          reponse = `[${new FractionEtendue(c - b, a).texFraction};+\\infty[`
          texteCorr += `<br> $${reponse}$L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left[ ${texFractionReduite(c - b, a)}\\,;\\,+\\infty \\right[ `)}$.`
        }
      } else if (listeTypeDeQuestions[i] === 'x+b≤c') {
        a = 1
        if (!this.sup && c < b) {
          b = randint(-9, 9, [0]) // b peut être négatif, ça sera une inéquation du type x-b=c
          c = abs(randint(b, 15)) // c sera plus grand que b pour que c-b>0
        }
        texte = `$x${ecritureAlgebrique(b)}${texSymbole(symboleInegalite)}${c}$`
        texteCorr = texte + '<br>'
        if (this.correctionDetaillee) {
          if (b > 0) {
            texteCorr += `On soustrait $${b}$ aux deux membres.<br>`
          } else {
            texteCorr += `On ajoute $${-1 * b}$ aux deux membres.<br>`
          }
        }
        texteCorr += `$x${ecritureAlgebrique(b)}${miseEnEvidence(ecritureAlgebrique(-1 * b), 'blue')}
          ${texSymbole(symboleInegalite)}${c}${miseEnEvidence(ecritureAlgebrique(-1 * b), 'blue')}$<br>`
        texteCorr += `$x${texSymbole(symboleInegalite)}${c - b}$`
        if ((symboleInegalite === '<' && a >= 0) || (symboleInegalite === '>' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${c - b} \\right[`)}$.`
          reponse = `]-\\infty;${c - b}[`
        } else if ((symboleInegalite === '≤' && a >= 0) || (symboleInegalite === '≥' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${c - b} \\right] `)}$.`
          reponse = `]-\\infty;${c - b}]`
        } else if ((symboleInegalite === '>' && a >= 0) || (symboleInegalite === '<' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] ${c - b}\\,;\\,+\\infty \\right[`)}$.`
          reponse = `]${c - b};+\\infty[`
        } else if ((symboleInegalite === '≥' && a >= 0) || (symboleInegalite === '≤' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left[${c - b}\\,;\\,+\\infty \\right[`)}$.`
          reponse = `[${c - b};+\\infty[`
        }
      } else if (listeTypeDeQuestions[i] === 'ax≤b') {
        texte = `$${a}x${texSymbole(symboleInegalite)}${b}$`
        texteCorr = texte + '<br>'
        if (this.correctionDetaillee) {
          texteCorr += `On divise les deux membres par $${a}$.<br>`
          if (a < 0) {
            texteCorr += `Comme $${a}$ est négatif, l'inégalité change de sens.<br>`
          }
        }
        if (a < 0) {
          texteCorr += `$${a}x${miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a) +
            texSymbole(symboleInegaliteOppose), 'blue')}${b + miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a), 'blue')}$<br>`
          texteCorr += `$x${texSymbole(symboleInegaliteOppose)}${texFractionFromString(b, a)}$`
          texteCorr += `<br>$x${texSymbole(symboleInegaliteOppose)}${texFractionReduite(b, a)}$`
        } else {
          texteCorr += `$${a}x${miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a), 'blue')}
            ${texSymbole(symboleInegalite)}${b + miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a), 'blue')}$<br>`
          texteCorr += `$x${texSymbole(symboleInegalite)}${texFractionFromString(b, a)}$`
          if (pgcd(abs(a), abs(b)) > 1 || a < 0) {
            texteCorr += `<br>$x${texSymbole(symboleInegalite)}${texFractionReduite(b, a)}$`
          }
        }
        if ((symboleInegalite === '<' && a >= 0) || (symboleInegalite === '>' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${texFractionReduite(b, a)} \\right[`)}$.`
          reponse = `]-\\infty;${new FractionEtendue(b, a).texFraction}[`
        } else if ((symboleInegalite === '≤' && a >= 0) || (symboleInegalite === '≥' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${texFractionReduite(b, a)} \\right]`)}$.`
          reponse = `]-\\infty;${new FractionEtendue(b, a).texFraction}]`
        } else if ((symboleInegalite === '>' && a >= 0) || (symboleInegalite === '<' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S = ${miseEnEvidence(`\\left] ${texFractionReduite(b, a)}\\,;\\,+\\infty \\right[`)}$.`
          reponse = `]${new FractionEtendue(b, a).texFraction};+\\infty[`
        } else if ((symboleInegalite === '≥' && a >= 0) || (symboleInegalite === '≤' && a < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est $S =  ${miseEnEvidence(`\\left[ ${texFractionReduite(b, a)}\\,;\\,+\\infty \\right[`)}$.`
          reponse = `[${new FractionEtendue(b, a).texFraction};+\\infty[`
        }
      } else if (listeTypeDeQuestions[i] === 'ax+b≤cx+d') {
        if (c === a) {
          c = randint(1, 13, [a])
        } // sinon on arrive à une division par 0
        if (!this.sup && a < c) {
          c = randint(1, 9)
          a = randint(c + 1, 15) // a sera plus grand que c pour que a-c>0
        }
        if (!this.sup && d < b) {
          b = randint(1, 9)
          d = randint(b + 1, 15) // d sera plus grand que b pour que d-b>0
        }
        texte = `$${rienSi1(a)}x${ecritureAlgebrique(b)}${texSymbole(symboleInegalite)} ${rienSi1(c)}x${ecritureAlgebrique(d)}$`
        texteCorr = texte + '<br>'
        if (this.correctionDetaillee) {
          if (c > 0) {
            texteCorr += `On soustrait $${rienSi1(c)}x$ aux deux membres.<br>`
          } else {
            texteCorr += `On ajoute $${rienSi1(-1 * c)}x$ aux deux membres.<br>`
          }
        }
        texteCorr += `$${rienSi1(a)}x${ecritureAlgebrique(b)}${miseEnEvidence(signe(-1 * c) + rienSi1(abs(c)) + 'x', 'blue')}
          ${texSymbole(symboleInegalite)}${c}x${ecritureAlgebrique(d)}${miseEnEvidence(signe(-1 * c) + rienSi1(abs(c)) + 'x', 'blue')}$<br>`
        texteCorr += `$${rienSi1(a - c)}x${ecritureAlgebrique(b)}${texSymbole(symboleInegalite)}${d}$<br>`
        if (this.correctionDetaillee) {
          if (b > 0) {
            texteCorr += `On soustrait $${b}$ aux deux membres.<br>`
          } else {
            texteCorr += `On ajoute $${-1 * b}$ aux deux membres.<br>`
          }
        }
        texteCorr += `$${rienSi1(a - c)}x${ecritureAlgebrique(b)}${miseEnEvidence(ecritureAlgebrique(-1 * b), 'blue')}
          ${texSymbole(symboleInegalite)}${d}${miseEnEvidence(ecritureAlgebrique(-1 * b), 'blue')}$<br>`
        texteCorr += `$${rienSi1(a - c)}x${texSymbole(symboleInegalite)}${d - b}$<br>`

        if (this.correctionDetaillee) {
          texteCorr += `On divise les deux membres par $${a - c}$.<br>`
          if (a - c < 0) {
            texteCorr += `Comme $${a - c}$ est négatif, l'inégalité change de sens.<br>`
          }
        }
        if (a - c < 0) {
          texteCorr += `$${rienSi1(a - c)}x${miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a - c) +
            texSymbole(symboleInegaliteOppose), 'blue')}${d - b + miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a - c), 'blue')}$<br>`
          texteCorr += `$x${texSymbole(symboleInegaliteOppose)}${texFractionFromString(d - b, a - c)}$`
          texteCorr += `<br>$x${texSymbole(symboleInegaliteOppose)}${texFractionReduite(d - b, a - c)}$`
        } else {
          texteCorr += `$${rienSi1(a - c)}x${miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a - c), 'blue')}
            ${texSymbole(symboleInegalite)}${d - b + miseEnEvidence('\\div' + ecritureParentheseSiNegatif(a - c), 'blue')}$<br>`
          texteCorr += `$x${texSymbole(symboleInegalite)}${texFractionFromString(d - b, a - c)}$`
          if (pgcd(abs(d - b), abs(a - c)) > 1 || a - c < 0) {
            texteCorr += `<br>$x${texSymbole(symboleInegalite)}${texFractionReduite(d - b, a - c)}$`
          }
        }
        if ((symboleInegalite === '<' && a - c >= 0) || (symboleInegalite === '>' && a - c < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est  $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${texFractionReduite(d - b, a - c)} \\right[`)}$.`
          reponse = `]-\\infty;${new FractionEtendue(d - b, a - c).texFraction}[`
        } else if ((symboleInegalite === '≤' && a - c >= 0) || (symboleInegalite === '≥' && a - c < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est  $S =  ${miseEnEvidence(`\\left] -\\infty\\,;\\,${texFractionReduite(d - b, a - c)} \\right]`)}$.`
          reponse = `]-\\infty;${new FractionEtendue(d - b, a - c).texFraction}]`
        } else if ((symboleInegalite === '>' && a - c >= 0) || (symboleInegalite === '<' && a - c < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est  $S =  ${miseEnEvidence(`\\left] ${texFractionReduite(d - b, a - c)} , +\\infty \\right[`)}$.`
          reponse = `]${new FractionEtendue(d - b, a - c).texFraction};+\\infty[`
        } else if ((symboleInegalite === '≥' && a - c >= 0) || (symboleInegalite === '≤' && a - c < 0)) {
          texteCorr += `<br> L'ensemble de solutions de l'inéquation est  $S =  ${miseEnEvidence(`\\left[ ${texFractionReduite(d - b, a - c)}\\,;\\,+\\infty \\right[ `)}$.`
          reponse = `[${new FractionEtendue(d - b, a - c).texFraction};+\\infty[`
        }
      }
      // texte += `<br> Solution : $${reponse}$`// pour test
      texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble, { texteAvant: ' $S=$' })
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison, options: { intervalle: true } } })
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte) // replace(/1x/g,'x')); //remplace 1x par x
        this.listeCorrections.push(texteCorr) // .replace(/1x/g,'x')); //remplace 1x par x
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Avec des nombres relatifs']
  this.besoinFormulaire2Numerique = [
    "Type d'inéquations",
    4,
    '1 : ax≤b ou x+a≤b ou x-a≤b\n2 : ax+b≤c\n3 : ax+b≤cx+d\n4 : Les 2 types précédents'
  ]
}
