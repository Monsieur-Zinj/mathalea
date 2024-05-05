import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenuSansNumero, printlatex, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.ts'
import { expressionDeveloppeeEtReduiteCompare } from '../../lib/interactif/comparisonFunctions'
import { ecritureAlgebrique, reduireAxPlusB } from '../../lib/outils/ecritures'

export const titre = 'Additionner ou soustraire une expression entre parenthèses'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCHybride'
export const amcReady = true
export const dateDeModifImportante = '26/12/2022' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Développer et réduire des expressions avec des parenthèses précédées d'un signe + ou -
 *
 *
 * @author Rémi Angot (Ajout des case 3 et 4 + Passage en AMC par Eric Elter)
 * 3L10-1
 */
export const uuid = '815eb'
export const ref = '3L10-1'
export const refs = {
  'fr-fr': ['3L10-1'],
  'fr-ch': ['11FA1-2']
}
export default function ParenthesesPrecedesDeMoinsOuPlus () {
  Exercice.call(this)
  this.titre = titre
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.nbQuestions = 5
  this.nbColsCorr = 1
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false
  this.sup = false
  this.besoinFormulaireCaseACocher = ['Sanctionner les formes non simplifiées', false]

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions > 1 ? 'Supprimer les parenthèses et réduire les expressions suivantes.' : 'Supprimer les parenthèses et réduire l\'expression suivante.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const typesDeQuestionsDisponibles = [1, 2, 3, 4]
    const lettresPossibles = ['a', 'b', 'c', 'x', 'y', 'z']
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, reponse1, reponse2, reponse3, choixLettre, a, b, k, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      k = randint(-11, 11, 0)
      a = randint(-9, 9, 0)
      b = randint(-9, 9, 0)
      choixLettre = choice(lettresPossibles)
      let reponse
      switch (listeTypeDeQuestions[i]) {
        case 1:
          // k-(ax+b)
          texte = `$${lettreDepuisChiffre(i + 1)}=${k}-(${printlatex(
                        `${a}${choixLettre}+(${b})`
                    )})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${k}-(${printlatex(
                        `${a}${choixLettre}+(${b})`
                    )})$`
          if (k - b !== 0) {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}+(${-a}*${choixLettre})+(${-b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${reduireAxPlusB(-a, k - b, choixLettre)}$`
            reponse = reduireAxPlusB(-a, k - b, choixLettre)
          } else {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}+(${-a}*${choixLettre})+(${-b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${reduireAxPlusB(-a, 0, choixLettre)}$`
            reponse = reduireAxPlusB(-a, 0, choixLettre)
          }

          reponse1 = 0
          reponse2 = -a
          reponse3 = -b + k
          break
        case 2:
          // k+(ax+b)
          texte = `$${lettreDepuisChiffre(i + 1)}=${k}+(${printlatex(
                        `${a}${choixLettre}+(${b})`
                    )})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${k}+(${printlatex(
                        `${a}${choixLettre}+(${b})`
                    )})$`
          if (k + b !== 0) {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}+(${a}*${choixLettre})+(${b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${reduireAxPlusB(a, k + b, choixLettre)}$`
            reponse = reduireAxPlusB(a, k + b, choixLettre)
          } else {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}+(${a}*${choixLettre})+(${b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${reduireAxPlusB(a, 0, choixLettre)}$`
            reponse = reduireAxPlusB(a, 0, choixLettre)
          }
          reponse1 = 0
          reponse2 = a
          reponse3 = b + k
          break
        case 3:
          // kx-(ax+b)
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${k}${choixLettre}`)}-(${printlatex(
                        `${a}${choixLettre}+(${b})`
                    )})$`
          texteCorr = texte
          if (k - a !== 0) {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}${choixLettre}+(${-a}*${choixLettre})+(${-b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${reduireAxPlusB(k - a, -b, choixLettre)}$`
            reponse = reduireAxPlusB(k - a, -b, choixLettre)
          } else {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}${choixLettre}+(${-a}*${choixLettre})+(${-b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${ecritureAlgebrique(-b)}$`
            reponse = ecritureAlgebrique(-b)
          }
          reponse1 = 0
          reponse2 = k - a
          reponse3 = -b
          break
        case 4:
          // kx+(ax+b)
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${k}${choixLettre}`)}+(${printlatex(
                        `${a}${choixLettre}+(${b})`
                    )})$`
          texteCorr = texte
          if (k + a !== 0) {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}${choixLettre}+(${a}*${choixLettre})+(${b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${reduireAxPlusB(
                            k + a, b, choixLettre)}$`
            reponse = reduireAxPlusB(
              k + a, b, choixLettre)
          } else {
            texteCorr += `<br>$${lettreDepuisChiffre(
                            i + 1
                        )}=${printlatex(`${k}${choixLettre}+(${a}*${choixLettre})+(${b})`)}$`
            texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}=${ecritureAlgebrique(b)}$`
            reponse = ecritureAlgebrique(b)
          }
          reponse1 = 0
          reponse2 = k + a
          reponse3 = b
          break
      }
      if (!context.isAmc && this.interactif) {
        handleAnswers(this, i, { reponse: { value: reponse, options: { strict: this.sup }, compare: expressionDeveloppeeEtReduiteCompare } }, { formatInteractif: 'mathlive' })
        // setReponse(this, i, reponse, { formatInteractif: 'canonicalAdd' })
        texte += this.interactif ? (`<br>$${lettreDepuisChiffre(i + 1)} = $` + ajouteChampTexteMathLive(this, i, 'largeur75 inline nospacebefore')) : ''
        texte += ajouteFeedback(this, i)
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
                  texte: `valeur de $m$ dans $m${choixLettre}^2+n${choixLettre}+p$`,
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
                  texte: `valeur de $n$ dans $m${choixLettre}^2+n${choixLettre}+p$`,
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
                  texte: `valeur de $p$ dans $m${choixLettre}^2+n${choixLettre}+p$`,
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

      if (this.questionJamaisPosee(i, listeTypeDeQuestions[i], a, b, k)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
}
