import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenuSansNumero, printlatex, randint, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Réduire une expression'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCHybride'
export const amcReady = true
export const dateDeModifImportante = '06/02/2024'

/**
 * Réduire des expressions lorsque c'est possible
 *
 * @author Rémi Angot (Amélioration AMC par Eric Elter)
 */
export const uuid = 'f6853'
export const ref = '3L11-2'
export const refs = {
  'fr-fr': ['3L11-2'],
  'fr-ch': ['10FA1-13']
}
export default function ReductionSiPossible () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.tailleDiaporama = 3
  this.sup = false
  this.sup2 = false
  this.sup3 = 9
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions > 1 ? 'Réduire les expressions suivantes, si cela est possible.' : 'Réduire l\'expression suivante, si cela est possible.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const exclus = []
    if (this.sup) {
      exclus.push(1)
      exclus.push(3)
    }
    if (context.isAmc) {
      exclus.push(3)
    }

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      nbQuestions: this.nbQuestions,
      saisie: this.sup3,
      max: 8,
      melange: 9,
      defaut: 2,
      exclus
    })

    // const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, reponse, coeffa, constb, a, b, c, d, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(-11, 11, 0)
      b = randint(-11, 11, [0, a])
      c = randint(-11, 11, [0])
      d = randint(-11, 11, 0)
      switch (listeTypeDeQuestions[i]) {
        case 1 : // 'ax+b':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b})`)}$`
          texteCorr = texte
          reponse = [printlatex(`${a}*x+(${b})`), printlatex(`${b}+(${a}*x)`)]
          coeffa = a
          constb = b
          break
        case 2 : // 'ax+bx':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b}*x)`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b}*x)`)}=${printlatex(`${a + b}x`)}$`
          reponse = printlatex(`${a + b}x`)
          coeffa = a + b
          constb = 0
          break
        case 3 : // 'ax+bx2':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b}*x^2)`)}$`
          texteCorr = texte
          reponse = [printlatex(`${a}*x+(${b}*x^2)`), printlatex(`${b}*x^2+(${a}*x)`)]
          // celui-ci ne peut pas être choisi pour AMC
          break
        case 4 : // 'ax*b':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x`)}\\times ${ecritureParentheseSiNegatif(b)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x`)}\\times ${ecritureParentheseSiNegatif(b)}=${printlatex(`${a * b}*x`)}$`
          reponse = printlatex(`${a * b}*x`)
          coeffa = a * b
          constb = 0
          break
        case 5 : // 'b*ax':
          a = randint(1, 11)
          texte = `$${lettreDepuisChiffre(i + 1)}=${b}\\times ${printlatex(`${a}*x`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${b}\\times ${printlatex(`${a}*x`)}=${printlatex(`${b * a}*x`)}$`
          reponse = printlatex(`${b * a}*x`)
          coeffa = a * b
          constb = 0
          break
        case 6 : // 'ax+b+cx+d':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b})+(${c})*x+(${d})`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b})+(${c})*x+(${d})`)}`
          if (b + d === 0) {
            if (a + c === 0) {
              texteCorr += '=0$'
              reponse = 0
              coeffa = 0
              constb = 0
            } else {
              texteCorr += `=${printlatex(`${a + c}*x`)}$`
              reponse = printlatex(`${a + c}*x`)
              coeffa = a + c
              constb = 0
            }
          } else {
            if (a + c === 0) {
              texteCorr += `=${b + d}$`
              reponse = b + d
              constb = b + d
              coeffa = 0
            } else {
              texteCorr += `=${printlatex(`${a + c}*x+(${b + d})`)}$`
              reponse = [printlatex(`${a + c}*x+(${b + d})`), printlatex(`${b + d}+(${a + c}*x)`)]
              coeffa = a + c
              constb = b + d
            }
          }
          break
        case 7 :// 'b+ax+d+cx':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${b}+(${a})*x+(${d})+(${c})*x`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${b}+(${a})*x+(${d})+(${c})*x`)}`
          if (b + d === 0) {
            if (a + c === 0) {
              texteCorr += '=0$'
              reponse = 0
              coeffa = 0
              constb = 0
            } else {
              texteCorr += `=${printlatex(`${a + c}*x`)}$`
              reponse = printlatex(`${a + c}*x`)
              coeffa = a + c
              constb = 0
            }
          } else {
            if (a + c === 0) {
              texteCorr += `=${b + d}$`
              reponse = b + d
              coeffa = 0
              constb = b + d
            } else {
              texteCorr += `=${printlatex(`${a + c}*x+(${b + d})`)}$`
              reponse = [printlatex(`${a + c}*x+(${b + d})`), printlatex(`${b + d}+(${a + c}*x)`)]
              coeffa = a + c
              constb = b + d
            }
          }
          break
        case 8 : // 'ax+b+x':
          a = randint(-11, 11, [0, -1])
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b})+x`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*x+(${b})+x`)}=${printlatex(`${a + 1}*x+(${b})`)}$`
          reponse = [printlatex(`${a + 1}*x+(${b})`), printlatex(`${b}+(${a + 1}*x)`)]
          coeffa = a + 1
          constb = b
          break
      }
      if (this.sup2) {
        this.spacingCorr = 1
        // On découpe
        const etapes = texteCorr.split('=')
        texteCorr = ''
        etapes.forEach(function (etape) {
          etape = etape.replace('$', '')
          texteCorr += etape === lettreDepuisChiffre(i + 1) ? '' : `$${lettreDepuisChiffre(i + 1)} = ${etape}$ <br>`
        })
      }

      // EE : Permet en deux lignes de mettre toutes les réponses attendues en couleur
      const aMettreEnCouleur = miseEnEvidence(texteCorr.split('=').pop().replace('$', '')) + '$'
      texteCorr = texteCorr.replace(texteCorr.split('=').pop(), '') + aMettreEnCouleur

      if (!context.isAmc) {
        setReponse(this, i, reponse)
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
                  texte: 'valeur de $a$ dans $ax+b$',
                  valeur: [coeffa],
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
                  texte: 'valeur de $b$ dans $ax+b$',
                  valeur: [constb],
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

      if (this.questionJamaisPosee(i, a, b, c, d)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }

  this.besoinFormulaireCaseACocher = ['On peut toujours réduire.']
  this.besoinFormulaire2CaseACocher = ['Présentation des corrections en colonnes', false]
  this.besoinFormulaire3Texte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : ax+b',
      '2 : ax+bx',
      '3 : ax+bx²',
      '4 : ax*b',
      '5 : b*ax',
      '6 : ax+b+cx+d',
      '7 : b+ax+d+cx',
      '8 : ax+b+x',
      '9 : Mélange'
    ].join('\n')
  ]
}
