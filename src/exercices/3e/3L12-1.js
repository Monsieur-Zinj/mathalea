import { choice } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { reduirePolynomeDegre3 } from '../../lib/outils/ecritures'
import { range1 } from '../../lib/outils/nombres'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Développer (a-b)(a+b)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCHybride'
export const amcReady = true
export const dateDeModifImportante = '26/02/2023' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Développer (ax-b)(ax+b)
 * @author Jean-Claude Lhote (AMC par Eric Elter)
 * 3L12-1
 */
export const uuid = 'be157'
export const ref = '3L12-1'
export const refs = {
  'fr-fr': ['3L12-1'],
  'fr-ch': ['11FA2-12']
}
export default function DevelopperIdentitesRemarquables3 () {
  Exercice.call(this)
  this.titre = titre
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.nbQuestions = 5
  this.sup = 2
  this.sup2 = true
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions > 1 ? 'Développer et réduire les expressions suivantes.' : 'Développer et réduire l\'expression suivante.'
    this.sup = parseInt(this.sup)
    const Fractions = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
      [1, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [1, 8], [3, 8], [5, 8], [7, 8],
      [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [1, 10], [3, 10], [7, 10], [9, 10]]
    const lettresPossibles = ['a', 'b', 'c', 'x', 'y', 'z']
    for (let i = 0, ns, ds, texte, texteCorr, reponse, reponse1, choixLettre, choixPossible, cpt = 0, a, b, fraction = []; i < this.nbQuestions && cpt < 50;) {
      choixLettre = choice(lettresPossibles)
      choixPossible = this.sup === 4 ? choice(range1(3)) : this.sup
      if (choixPossible === 1) {
        a = randint(1, 9) // coef de x est égal à 1
        texte = `$${lettreDepuisChiffre(i + 1)} = (${choixLettre}-${a})(${choixLettre}+${a})$` // (${choixLettre}-a)(${choixLettre}+a)
        texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${choixLettre}-${a})(${choixLettre}+${a})=${choixLettre}^2-${a}^2=${choixLettre}^2-${a * a}$`
        reponse1 = 1
        reponse = reduirePolynomeDegre3(0, reponse1, 0, -a * a, choixLettre)
      } else if (choixPossible === 2) {
        a = randint(1, 9) // (bx-a)(bx+a) avec a et b entiers positifs entre 1 et 9,  b différent de 1
        b = randint(2, 9)
        texte = `$${lettreDepuisChiffre(i + 1)} = (${b}${choixLettre}-${a})(${b}${choixLettre}+${a})$` // b>1
        texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${b}${choixLettre}-${a})(${b}${choixLettre}+${a})=(${b}${choixLettre})^2-${a}^2=${b * b}${choixLettre}^2-${a * a}$`
        reponse1 = b * b
        reponse = reduirePolynomeDegre3(0, reponse1, 0, -a * a, choixLettre)
      } else { //  (bx-a)(bx+a) avec a entier et b rationnel simple
        a = randint(1, 9)
        fraction = choice(Fractions)
        ns = fraction[0]
        ds = fraction[1]
        texte = `$${lettreDepuisChiffre(i + 1)} = \\left(${texFractionFromString(ns, ds)}${choixLettre}-${a}\\right)\\left(${texFractionFromString(ns, ds)}${choixLettre}+${a}\\right)$` // b>1
        texteCorr = `$${lettreDepuisChiffre(i + 1)} = \\left(${texFractionFromString(ns, ds)}${choixLettre}-${a}\\right)\\left(${texFractionFromString(ns, ds)}${choixLettre}+${a}\\right)=\\left(${texFractionFromString(ns, ds)}${choixLettre}\\right)^2-${a}^2=${texFractionFromString(ns * ns, ds * ds)}${choixLettre}^2-${a * a}$`
        reponse = `${texFractionFromString(ns * ns, ds * ds)}${choixLettre}^2-${a * a}`
        reponse1 = new FractionEtendue(ns * ns, ds * ds)
      }
      if (this.sup2) {
        this.spacingCorr = 1
        // On enlève la première égalité pour ne pas avoir A = A en première ligne
        texteCorr = texteCorr.slice(4)
        // On découpe
        const etapes = texteCorr.split('=')
        texteCorr = ''
        etapes.forEach(function (etape) {
          etape = etape.replace('$', '')
          texteCorr += etape === lettreDepuisChiffre(i + 1) ? '' : `$${lettreDepuisChiffre(i + 1)} = ${etape}$ <br>`
        })
      }
      if (!context.isAmc) {
        setReponse(this, i, reponse)
        texte += this.interactif ? (`<br>$${lettreDepuisChiffre(i + 1)} = $` + ajouteChampTexteMathLive(this, i, ' ')) : ''
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
                  valeur: reponse1,
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
                  valeur: 0,
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
                  valeur: -a * a,
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
      if (this.sup === 1 ? this.questionJamaisPosee(i, a) : this.sup === 2 ? this.questionJamaisPosee(i, a, b) : this.questionJamaisPosee(i, a, ns, ds)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, ' 1 : Coefficient de x égal à 1\n 2 : Coefficient de x supérieur à 1\n 3 : Coefficient de x rationnel\n 4 : Mélange']
  this.besoinFormulaire2CaseACocher = ['Présentation des corrections en colonnes', false]
}
