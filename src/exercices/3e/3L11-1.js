import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { egal, listeQuestionsToContenuSansNumero, printlatex, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { reduirePolynomeDegre3 } from '../../lib/outils/ecritures'

export const titre = 'Utiliser la double distributivité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCHybride'
export const amcReady = true
export const dateDeModifImportante = '10/06/2024'

/**
 * Développer des expressions de la forme(ax+ou-b)(cx+ou-d)
 * @author Jean-Claude Lhote  (Amélioration AMC par Eric Elter)
 */
export const uuid = '4197c'
export const ref = '3L11-1'
export const refs = {
  'fr-fr': ['3L11-1'],
  'fr-ch': ['11FA2-3']
}
export default function DoubleDistributivite () {
  Exercice.call(this)
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.nbQuestions = 5
  this.sup = 1
  this.sup2 = true
  this.sup3 = false
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions > 1 ? 'Développer et réduire les expressions suivantes.' : 'Développer et réduire l\'expression suivante.'
    this.autoCorrection = []

    let typesDeQuestionsDisponibles = [1, 2]
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [3, 4]
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, reponse, reponse1, reponse2, reponse3, cpt = 0, a, b, c, d, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(2, 9)
      b = randint(2, 9)
      c = randint(2, 9, [a])
      d = randint(2, 9, [b])
      switch (typesDeQuestions) {
        case 1: // (x+b)(x+d)
          b = randint(2, 10)
          d = randint(2, 12)
          texte = `$${lettreDepuisChiffre(i + 1)} = (x+${b})(x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (x+${b})(x+${d})=x^2+${b}x+${d}x+${b * d}=x^2+${b + d}x+${b * d}$`
          reponse = reduirePolynomeDegre3(0, 1, b + d, b * d)
          reponse1 = 1
          reponse2 = b + d
          reponse3 = b * d
          break
        case 2: // (ax+b)(cx+d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x+${b})(${c}x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x+${b})(${c}x+${d})=${a * c}x^2+${a * d}x+${b * c}x+${b * d}=${a * c}x^2+${a * d + b * c}x+${b * d}$`
          reponse = reduirePolynomeDegre3(0, a * c, a * d + b * c, b * d)
          reponse1 = a * c
          reponse2 = a * d + b * c
          reponse3 = b * d
          break
        case 3: // (ax-b)(cx+d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})$`
          if (egal(a * d - b * c, 0)) {
            texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})=${a * c}x^2+${d * a}x-${b * c}x-${b * d}=${printlatex(`${a * c}*x^2-${b * d}`)}$`
            reponse = reduirePolynomeDegre3(0, a * c, 0, -b * d)
            reponse1 = a * c
            reponse2 = 0
            reponse3 = -b * d
          } else {
            texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})=${a * c}x^2+${d * a}x-${b * c}x-${b * d}=${printlatex(`${a * c}*x^2+(${d * a - b * c})*x-${b * d}`)}$`
            reponse = reduirePolynomeDegre3(0, a * c, d * a - b * c, -b * d)
            reponse1 = a * c
            reponse2 = a * d - b * c
            reponse3 = -b * d
          }
          break
        case 4: // (ax-b)(cx-d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x-${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x-${d})=${a * c}x^2-${a * d}x-${b * c}x+${b * d}=${a * c}x^2-${a * d + b * c}x+${b * d}$`
          reponse = reduirePolynomeDegre3(0, a * c, -(a * d + b * c), b * d)
          reponse1 = a * c
          reponse2 = -a * d - b * c
          reponse3 = b * d
          break
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
      // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
      const textCorrSplit = texteCorr.split('=')
      let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
      aRemplacer = aRemplacer.replace('$', '').replace('<br>', '')

      texteCorr = ''
      for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
        texteCorr += textCorrSplit[ee] + '='
      }
      texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`
      // Fin de cette uniformisation

      if (!context.isAmc && this.interactif) {
        handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })
        texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: ' $=$' })
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
                  valeur: reponse2,
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
                  valeur: reponse3,
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
      if (this.questionJamaisPosee(i, a, b, c, d, typesDeQuestions[i])) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, ' 1 : (x+a)(x+b) et (ax+b)(cx+d)\n 2 : (ax-b)(cx+d) et (ax-b)(cx-d)\n 3 : Mélange']
  this.besoinFormulaire2CaseACocher = ['Présentation des corrections en colonnes', false]
  this.besoinFormulaire3CaseACocher = ['Sanctionner les formes non simplifiées', false]
}
