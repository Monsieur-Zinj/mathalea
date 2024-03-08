import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { deprecatedTexFraction, simplificationDeFractionAvecEtapes } from '../../lib/outils/deprecatedFractions.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { fraction } from '../../modules/fractions.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Effectuer somme, différence ou produit de fractions'
export const interactifType = 'mathLive'
export const interactifReady = true
export const dateDePublication = '15/09/2021'
export const dateDeModifImportante = '11/09/2023'

/**
 * Effectuer somme, différence ou produit de fractions
 * @author Mireille Gain
 */

export const uuid = '374b6'
export const ref = '4C23'
export const refs = {
  'fr-fr': ['4C23'],
  'fr-ch': ['10NO5-4']
}
export default function SommeOuProduitFractions () {
  Exercice.call(this)
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.spacing = context.isHtml ? 4 : 3
  this.spacingCorr = context.isHtml ? 4 : 3
  this.nbColonneModifiable = false
  this.consigne = 'Effectuer les calculs suivants.'
  this.nbQuestions = 8 // Nombre de questions par défaut
  this.nbCols = 4 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 4 // Uniquement pour la sortie LaTeX
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
  this.sup = '1-3'
  this.correctionDetailleeDisponible = true // booléen qui indique si une correction détaillée est disponible.
  this.correctionDetaillee = false
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let typeQuestionsDisponibles = []
    const typeQuestionsPossibles = [['type1', 'type2'], ['type3', 'type4'], ['type5', 'type6'], ['type7', 'type8']]

    const QuestionsDisponibles = gestionnaireFormulaireTexte({
      max: 4,
      defaut: 5,
      melange: 5,
      nbQuestions: this.nbQuestions,
      shuffle: true,
      saisie: this.sup,
      enleveDoublons: false
    })

    for (let ee = 0; ee < QuestionsDisponibles.length; ee++) {
      typeQuestionsDisponibles.push(typeQuestionsPossibles[QuestionsDisponibles[ee] - 1][randint(0, 1)])
    }
    typeQuestionsDisponibles = shuffle(typeQuestionsDisponibles)

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, num1, num2, den1, den2, den3, k, k2, alea, texte, texteCorr, num, den, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      // les numérateurs
      num1 = randint(1, 7)
      num2 = randint(3, 9)
      // les dénominateurs
      den1 = randint(2, 9, [num2, num1])
      k = randint(1, 4)
      k2 = randint(2, 5)
      den2 = k * den1
      den3 = randint(2, 9, [num2, num1])
      alea = choice([1, 2])
      texte = ''
      texteCorr = ''

      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1': // Somme de fractions de dénominateurs égaux ou multiples

          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}+${deprecatedTexFraction(num2, den2)}$ `
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}+${deprecatedTexFraction(num2, den2)}$<br>`
            if (k > 1) {
              if (this.correctionDetaillee) {
                texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1 + miseEnEvidence('\\times' + k), den1 + miseEnEvidence('\\times' + k))}+${deprecatedTexFraction(num2, den2)}$<br>`
              }
              texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1 * k, den2)}+${deprecatedTexFraction(num2, den2)}$<br>`
            }

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * k + num2, den2)}$ `
            num = num1 * k + num2
            den = den2
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}+${deprecatedTexFraction(num2, den1)}$ `
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}+${deprecatedTexFraction(num2, den1)}$<br>`
            if (k > 1) {
              if (this.correctionDetaillee) {
                texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}+${deprecatedTexFraction(num2 + miseEnEvidence('\\times' + k), den1 + miseEnEvidence('\\times' + k))}$<br>`
              }
              texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}+${deprecatedTexFraction(num2 * k, den2)}$<br>`
            }

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 + num2 * k, den2)}$ `
            num = num1 + num2 * k
            den = den2
          }

          break

        case 'type2': // Somme d'une fraction et d'un entier'
          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${k} + ${deprecatedTexFraction(num1, den1)} $ `
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${k} + ${deprecatedTexFraction(num1, den1)} $<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(k * den1, den1)} + ${deprecatedTexFraction(num1, den1)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 + k * den1, den1)}$`
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} + ${k} $`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}+${k}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}+${deprecatedTexFraction(k * den1, den1)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 + k * den1, den1)}$`
          }
          num = num1 + k * den1
          den = den1
          break

        case 'type3': // Différence de fractions de dénominateurs égaux ou multiples
          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}-${deprecatedTexFraction(num2, den2)}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}-${deprecatedTexFraction(num2, den2)}$<br>`
            if (k > 1) {
              if (this.correctionDetaillee) {
                texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1 + miseEnEvidence('\\times' + k), den1 + miseEnEvidence('\\times' + k))} - ${deprecatedTexFraction(num2, den2)}$<br>`
              }
              texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1 * k, den1 * k)}-${deprecatedTexFraction(num2, den2)}$<br>`
            }

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * k - num2, den2)}$ `
            num = num1 * k - num2
            den = den2
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}-${deprecatedTexFraction(num2, den1)}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}-${deprecatedTexFraction(num2, den1)}$<br>`
            if (k > 1) {
              if (this.correctionDetaillee) {
                texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}-${deprecatedTexFraction(num2 + miseEnEvidence('\\times' + k), den1 + miseEnEvidence('\\times' + k))}$<br>`
              }
              texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den2)}-${deprecatedTexFraction(num2 * k, den2)}$<br>`
            }

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 - num2 * k, den2)}$`
            num = num1 - num2 * k
            den = den2
          }

          break

        case 'type4': // Différence d'une fraction et d'un entier
          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${k} - ${deprecatedTexFraction(num1, den1)} $`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${k} - ${deprecatedTexFraction(num1, den1)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(k * den1, den1)} - ${deprecatedTexFraction(num1, den1)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(k * den1 - num1, den1)}$`
            num = k * den1 - num1
            den = den1
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}-${k}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}-${k}$<br>`
            if (k > 1) {
              texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)}-${deprecatedTexFraction(k * den1, den1)}$<br>`
            }

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 - k * den1, den1)}$ `
            num = num1 - k * den1
            den = den1
          }

          break

        case 'type5': // Produit de fractions
          texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} \\times ${deprecatedTexFraction(num2, den3)}$`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} \\times ${deprecatedTexFraction(num2, den3)}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * num2, den1 * den3)}$`
          num = num1 * num2
          den = den1 * den3
          break

        case 'type6': // Produit d'une fraction par un entier
          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} \\times ${k2}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} \\times ${k2}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} \\times ${deprecatedTexFraction(k2, '1')}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * k2, den1)}$`
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${k2} \\times ${deprecatedTexFraction(num1, den1)} $`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${k2} \\times ${deprecatedTexFraction(num1, den1)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(k2, '1')} \\times  ${deprecatedTexFraction(num1, den1)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * k2, den1)}$`
          }
          num = num1 * k2
          den = den1

          break

        case 'type7': // Avec priorité opératoire : a +/- bc
          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} + ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)}$ `
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} + ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} + ${deprecatedTexFraction(num2 * k2, den1 * den3)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1 * den3, den1 * den3)} + ${deprecatedTexFraction(num2 * k2, den1 * den3)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * den3 + num2 * k2, den1 * den3)}$`
            num = num1 * den3 + num2 * k2
            den = den1 * den3
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} - ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} - ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1, den1)} - ${deprecatedTexFraction(num2 * k2, den1 * den3)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num1 * den3, den1 * den3)} - ${deprecatedTexFraction(num2 * k2, den1 * den3)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num1 * den3 - num2 * k2, den1 * den3)}$`
            num = num1 * den3 - num2 * k2
            den = den1 * den3
          }

          break

        case 'type8': // Avec priorité opératoire : ab +/- c
          if (alea === 1) {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)} + ${deprecatedTexFraction(num1, den1)}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)} + ${deprecatedTexFraction(num1, den1)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2 * k2, den1 * den3)} + ${deprecatedTexFraction(num1, den1)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2 * k2, den1 * den3)} + ${deprecatedTexFraction(num1 * den3, den1 * den3)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num2 * k2 + num1 * den3, den1 * den3)}$`
            num = num2 * k2 + num1 * den3
            den = den1 * den3
          } else {
            texte += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)} - ${deprecatedTexFraction(num1, den1)}$`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2, den1)} \\times ${deprecatedTexFraction(k2, den3)} - ${deprecatedTexFraction(num1, den1)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2 * k2, den1 * den3)} - ${deprecatedTexFraction(num1, den1)}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${deprecatedTexFraction(num2 * k2, den1 * den3)} - ${deprecatedTexFraction(num1 * den3, den1 * den3)}$<br>`

            texteCorr += `$${lettreDepuisChiffre(i + 1) + '=' + deprecatedTexFraction(num2 * k2 - num1 * den3, den1 * den3)}$`
            num = num2 * k2 - num1 * den3
            den = den1 * den3
          }
          break
      }
      if (pgcd(num, den) !== 1) {
        texteCorr += `<br>$${lettreDepuisChiffre(i + 1)}  ${simplificationDeFractionAvecEtapes(num, den)}$`
      }
      texte += '<br>'
      texteCorr += '\n'

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline')
        setReponse(this, i, fraction(num, den), { formatInteractif: 'fractionEgale' })
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }

      cpt++
    }

    listeQuestionsToContenuSansNumero(this, false) // On envoie l'exercice à la fonction de mise en page
  }
  this.besoinFormulaireTexte = [
    'Type de questions',
    'Nombres séparés par des tirets\n1 : Somme\n2 : Différence\n3 : Avec priorités opératoires\n4 : Mélange'
  ]
}
