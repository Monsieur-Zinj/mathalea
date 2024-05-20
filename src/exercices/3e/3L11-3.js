import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenuSansNumero, randint, printlatex } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { reduireAxPlusB, reduirePolynomeDegre3 } from '../../lib/outils/ecritures'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Utiliser la distributivité (simple ou double) et réduire'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCHybride'
export const amcReady = true

/**
 * Utiliser la simple ou la double distributivité et réduire l'expression
 *
 * @author Rémi Angot (Amélioration AMC par Eric Elter)
 */
export const uuid = '82313'
export const ref = '3L11-3'
export const refs = {
  'fr-fr': ['3L11-3'],
  'fr-ch': ['11FA2-4']
}
export default function DistributiviteSimpleDoubleReduction () {
  Exercice.call(this)
  this.titre = titre
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.tailleDiaporama = 3
  this.comment = 'L\'expression peut être au hasard de la forme :<br>$cx+e(ax+b)$<br> $ex+(ax+b)(cx+d)$<br> $e+(ax+b)(cx+d)$<br> $e-(ax+b)(cx+d)$<br> $(ax \\times b)(cx+d)$<br> $e(ax+b)-(d+cx)$.'
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions > 1 ? 'Développer et réduire les expressions suivantes.' : 'Développer et réduire l\'expression suivante.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const typesDeQuestionsDisponibles = ['cx+e(ax+b)', 'ex+(ax+b)(cx+d)', 'e+(ax+b)(cx+d)', 'e-(ax+b)(cx+d)', '(ax*b)(cx+d)', 'e(ax+b)-(d+cx)']
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, reponse, coeffa, coeffb, coeffc, a, b, c, d, e, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(-11, 11, 0)
      b = randint(-11, 11, 0)
      c = randint(-11, 11, 0)
      d = randint(-11, 11, 0)
      e = randint(-11, 11, 0)
      switch (listeTypeDeQuestions[i]) {
        case 'cx+e(ax+b)':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${c}*x+(${e})*(${a}*x+(${b}))`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${c}*x+(${e})*(${a}*x+(${b}))`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${c}*x+(${e * a})*x+(${e * b})`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${c + e * a}*x+(${e * b})`)}$`
          reponse = reduireAxPlusB(c + e * a, e * b, 'x')
          coeffa = 0
          coeffb = c + e * a
          coeffc = e * b
          break
        case 'ex+(ax+b)(cx+d)':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${e}*x+(${a}*x+(${b}))*(${c}x+(${d}))`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${e}*x+(${a}*x+(${b}))*(${c}x+(${d}))`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${e}*x+(${a * c})*x^2+(${a * d})*x+(${b * c})*x+(${b * d})`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${a * c}*x^2+(${e + b * c + a * d})*x+(${b * d})`)}$`
          reponse = reduirePolynomeDegre3(0, a * c, e + b * c + a * d, b * d, 'x')
          coeffa = a * c
          coeffb = e + b * c + a * d
          coeffc = b * d
          break
        case 'e+(ax+b)(cx+d)':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${e}+(${a}*x+(${b}))*(${c}x+(${d}))`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${e}+(${a}*x+(${b}))*(${c}x+(${d}))`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${e}+(${a * c})*x^2+(${a * d})*x+(${b * c})*x+(${b * d})`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${a * c}*x^2+(${b * c + a * d})*x+(${e + b * d})`)}$`
          reponse = reduirePolynomeDegre3(0, a * c, b * c + a * d, e + b * d, 'x')
          coeffa = a * c
          coeffb = b * c + a * d
          coeffc = e + b * d
          break
        case 'e-(ax+b)(cx+d)':
          texte = `$${lettreDepuisChiffre(i + 1)}=${e}-${printlatex(`(${a}*x+(${b}))*(${c}x+(${d}))`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${e}-${printlatex(`(${a}*x+(${b}))*(${c}x+(${d}))`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${e}-(${printlatex(`(${a * c})*x^2+(${a * d})*x+(${b * c})*x+(${b * d})`)})$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${e}+(${-1 * a * c})*x^2+(${-1 * a * d})*x+(${-1 * b * c})*x+(${-1 * b * d})`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${-1 * a * c}*x^2+(${-1 * b * c - a * d})*x+(${e - b * d})`)}$`
          reponse = reduirePolynomeDegre3(0, -1 * a * c, -1 * b * c - a * d, e - b * d, 'x')
          coeffa = -1 * a * c
          coeffb = -1 * b * c - a * d
          coeffc = e - b * d

          break
        case '(ax*b)(cx+d)':
          a = randint(-3, 3, [0])
          b = randint(2, 3)
          texte = `$${lettreDepuisChiffre(i + 1)}=(${printlatex(`${a}*x`)}\\times${b})(${printlatex(`${c}*x+(${d})`)})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=(${printlatex(`${a}*x`)}\\times${b})(${printlatex(`${c}*x+(${d})`)})$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${a * b}*x`)}\\times(${printlatex(`${c}*x+(${d})`)})$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`${a * b * c}*x^2+(${a * b * d})*x`)}$`
          reponse = reduirePolynomeDegre3(0, a * b * c, a * b * d, 0, 'x')
          coeffa = a * b * c
          coeffb = a * b * d
          coeffc = 0
          break
        case 'e(ax+b)-(d+cx)':
          e = randint(-11, 11, [-1, 1, 0])
          texte = `$${lettreDepuisChiffre(i + 1)}=${e}(${printlatex(`${a}*x+(${b})`)})-(${printlatex(`${d}+(${c})*x`)})$`
          texteCorr = texte
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`(${e * a})*x+(${e * b})`)}-(${printlatex(`${d}+(${c})*x`)})$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`(${e * a})*x+(${e * b})+(${-d})+(${-c})*x`)}$`
          texteCorr += `<br>$\\phantom{${lettreDepuisChiffre(i + 1)}}=${printlatex(`(${e * a - c})*x+(${e * b - d})`)}$`
          reponse = reduireAxPlusB(e * a - c, e * b - d, 'x')
          coeffa = 0
          coeffb = e * a - c
          coeffc = e * b - d
          break
      }
      if (!context.isAmc && this.interactif) {
        handleAnswers(this, i, { reponse: { value: reponse, options: { strict: false }, compare: fonctionComparaison } })
        texte += this.interactif ? (`<br>$${lettreDepuisChiffre(i + 1)} = $` + ajouteChampTexteMathLive(this, i, 'largeur75 inline nospacebefore')) : ''
      } else {
        this.autoCorrection[i] = {
          enonce: '',
          enonceAvant: false,
          options: { multicols: true, barreseparation: true },
          propositions: [
            {
              type: 'AMCOpen',
              propositions: [{
                texte: texteCorr,
                enonce: texte + '<br>',
                statut: 4
              }]
            },
            {
              type: 'AMCNum',
              propositions: [{
                texte: '',
                statut: '',
                reponse: {
                  texte: 'valeur de $a$ dans $ax^2+bx+c$',
                  valeur: coeffa,
                  param: {
                    digits: 2,
                    decimals: 0,
                    signe: true,
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
                  texte: 'valeur de $b$ dans $ax^2+bx+c$',
                  valeur: coeffb,
                  param: {
                    digits: 2,
                    decimals: 0,
                    signe: true,
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
                  texte: 'valeur de $c$ dans $ax^2+bx+c$',
                  valeur: coeffc,
                  param: {
                    digits: 2,
                    decimals: 0,
                    signe: true,
                    approx: 0
                  }
                }
              }]
            }
          ]
        }
      }
      if (this.questionJamaisPosee(i, a, b, c, d, e)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
}
