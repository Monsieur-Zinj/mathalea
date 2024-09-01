import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texFractionFromString, simplificationDeFractionAvecEtapes } from '../../lib/outils/deprecatedFractions.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { pgcd } from '../../lib/outils/primalite'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, ppcm, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { fraction } from '../../modules/fractions.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Additionner ou soustraire deux fractions'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Effectuer la somme ou la différence de deux fractions
 *
 * * Niveau 1 : 4 fois sur 5 un dénominateur est un multiple de l'autre et une fois sur 5 il faut additionner une fraction et un entier
 * * Niveau 2 : 2 fois sur 5, il faut trouver le ppcm, 1 fois sur 5 le ppcm correspond à leur produit, 1 fois sur 5 un dénominateur est multiple de l'autre, 1 fois sur 5 il faut additionner une fraction et un entier
 * * Paramètre supplémentaire : utiliser des nombres relatifs (par défaut tous les nombres sont positifs)
 * * 2 fois sur 4 il faut faire une soustraction
 * @author Rémi Angot
 */
export const uuid = '5f429'
export const ref = '4C21'
export const refs = {
  'fr-fr': ['4C21'],
  'fr-ch': ['9NO13-5']
}
export default function ExerciceAdditionnerOuSoustraireDesFractions () {
  Exercice.call(this)
  this.sup = 2 // Niveau de difficulté
  this.sup2 = false // Avec ou sans relatifs
  this.sup3 = true // Si false alors le résultat n'est pas en fraction simplifiée
  this.sup4 = false // Par défaut c'est l'ancienne correction qui est affichée
  this.consigne = "Calculer et donner le résultat sous la forme d'une fraction simplifiée."
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 5
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    if (!this.sup3 && !context.isAmc) {
      this.consigne = 'Calculer.'
    } else {
      this.consigne = "Calculer et donner le résultat sous la forme d'une fraction simplifiée au maximum."
    }
    this.autoCorrection = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = ['b_multiple_de_d', 'd_multiple_de_b', 'b_multiple_de_d', 'd_multiple_de_b', 'entier']
    } else {
      typesDeQuestionsDisponibles = ['ppcm', 'ppcm', 'premiers_entre_eux', choice(['b_multiple_de_d', 'd_multiple_de_b']), 'entier']
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const listeDePlusOuMoins = combinaisonListes(['-', '-', '+', '+'], this.nbQuestions)
    const listeCouplesDeDenominateurs = [[6, 9], [4, 6], [8, 12], [9, 12], [10, 15], [10, 25], [6, 21], [12, 30], [6, 8], [50, 75]]
    for (let i = 0, a, b, c, d, k, k1, k2, num, den, texte, texteCorr, reponse, couplesDeDenominateurs, typesDeQuestions; i < this.nbQuestions; i++) {
      const plusOuMoins = listeDePlusOuMoins[i]
      const plusOuMoinsUn = plusOuMoins === '+' ? 1 : -1
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 'ppcm':
          couplesDeDenominateurs = choice(listeCouplesDeDenominateurs)
          if (choice([true, false])) {
            b = couplesDeDenominateurs[0]
            d = couplesDeDenominateurs[1]
          } else {
            b = couplesDeDenominateurs[1]
            d = couplesDeDenominateurs[0]
          }
          k1 = ppcm(b, d) / b
          k2 = ppcm(b, d) / d
          break

        case 'premiers_entre_eux':
          b = randint(2, 9)
          d = randint(2, 9)
          while (pgcd(b, d) !== 1) {
            b = randint(2, 9)
            d = randint(2, 9)
          }
          k1 = ppcm(b, d) / b
          k2 = ppcm(b, d) / d
          break

        case 'd_multiple_de_b':
          b = randint(2, 9)
          k = randint(2, 11)
          d = b * k
          break

        case 'b_multiple_de_d':
          d = randint(2, 9)
          k = randint(2, 11)
          b = d * k
          break
      }

      a = randint(1, 9, [b])
      c = randint(1, 9, [d])
      if (this.sup2) { // si les numérateurs sont relatifs
        a = a * choice([-1, 1])
        c = c * choice([-1, 1])
      }
      if (!this.sup2 && plusOuMoins === '-' && a / b < c / d) { // s'il n'y a pas de relatifs, il faut s'assurer que la soustraction soit positive
        [a, b, c, d] = [c, d, a, b] // on échange les 2 fractions
        k1 = ppcm(b, d) / b
        k2 = ppcm(b, d) / d
        if (typesDeQuestions === 'd_multiple_de_b') {
          typesDeQuestions = 'b_multiple_de_d' // comme on a échangé les 2 fractions, le type de la question change
          k = b / d
        } else if (typesDeQuestions === 'b_multiple_de_d') {
          typesDeQuestions = 'd_multiple_de_b' // comme on a échangé les 2 fractions, le type de la question change
          k = d / b
        }
      }
      texte = `$${texFractionFromString(a, b)}${plusOuMoins}${texFractionFromString(c, d)}$`
      texteCorr = `$${texFractionFromString(a, b)}${plusOuMoins}${texFractionFromString(c, d)}`

      // a/b(+ou-)c/d = num/den (résultat non simplifié)
      if (typesDeQuestions === 'ppcm' || typesDeQuestions === 'premiers_entre_eux') {
        texteCorr += `=${texFractionFromString(a + miseEnEvidence('\\times ' + k1), b + miseEnEvidence('\\times ' + k1))}${plusOuMoins}${texFractionFromString(c + miseEnEvidence('\\times ' + k2), d + miseEnEvidence('\\times ' + k2))}`
        num = calculANePlusJamaisUtiliser(a * k1 + plusOuMoinsUn * c * k2)
        den = b * k1
        texteCorr += `=${texFractionFromString(a * k1 + plusOuMoins + ecritureParentheseSiNegatif(c * k2), den)}`
      }

      if (typesDeQuestions === 'd_multiple_de_b') {
        texteCorr += `=${texFractionFromString(a + miseEnEvidence('\\times ' + k), b + miseEnEvidence('\\times ' + k))}${plusOuMoins}${texFractionFromString(c, d)}`
        num = calculANePlusJamaisUtiliser(a * k + plusOuMoinsUn * c)
        den = b * k
        texteCorr += `=${texFractionFromString(a * k + plusOuMoins + ecritureParentheseSiNegatif(c), den)}`
      }

      if (typesDeQuestions === 'b_multiple_de_d') {
        texteCorr += `=${texFractionFromString(a, b)}${plusOuMoins}${texFractionFromString(c + miseEnEvidence('\\times ' + k), d + miseEnEvidence('\\times ' + k))}`
        num = calculANePlusJamaisUtiliser(a + plusOuMoinsUn * c * k)
        den = b
        texteCorr += `=${texFractionFromString(a + plusOuMoins + ecritureParentheseSiNegatif(c * k), den)}`
      }

      if (typesDeQuestions === 'entier') {
        a = randint(1, 9)
        b = randint(2, 9, [a])
        let n = randint(1, 9)
        if (this.sup2) {
          a = a * choice([-1, 1])
          n = n * choice([-1, 1])
        }
        if (choice([true, false])) {
          // n+-a/b
          if (!this.sup2 && plusOuMoins === '-' && n < a / b) {
            n = randint(5, 9) // max(a/b)=9/2
          }
          texteCorr = `$${n}${plusOuMoins}${texFractionFromString(a, b)}`
          texte = texteCorr + '$'
          texteCorr += `=${texFractionFromString(n + miseEnEvidence('\\times ' + b), miseEnEvidence(b))}${plusOuMoins}${texFractionFromString(a, b)}`
          texteCorr += `=${texFractionFromString(n * b + plusOuMoins + ecritureParentheseSiNegatif(a), b)}`
          num = calculANePlusJamaisUtiliser(n * b + plusOuMoinsUn * a)
        } else {
          // a/b +-n
          if (!this.sup2 && plusOuMoins === '-' && n > a / b) {
            n = randint(1, 4) //
            a = n * b + randint(1, 9) // (n*b+?)/b-n>0
          }
          texte = `$${texFractionFromString(a, b)}${plusOuMoins}${ecritureParentheseSiNegatif(n)}`
          texteCorr = texte
          texte += '$'
          texteCorr += `=${texFractionFromString(a, b)}${plusOuMoins}${texFractionFromString(n + miseEnEvidence('\\times ' + b), miseEnEvidence(b))}`
          texteCorr += `=${texFractionFromString(a + plusOuMoins + ecritureParentheseSiNegatif(n * b), b)}`
          num = calculANePlusJamaisUtiliser(a + plusOuMoinsUn * n * b)
        }
        den = b
      }

      texteCorr += `=${texFractionFromString(num, den)}`
      texteCorr += simplificationDeFractionAvecEtapes(num, den) + '$'

      const myTexteCorrCol = texteCorr
      if (this.sup4) {
        texteCorr = ''
        // On redécoupe comme un chacal
        const etapes = myTexteCorrCol.split('=')
        texteCorr += `${lettreDepuisChiffre(i + 1)} = $${etapes[0].replace('$', '')}$ <br>`
        for (let w = 1; w < etapes.length - 1; w++) {
          if (context.isHtml) {
            texteCorr += '<br>'
          }
          texteCorr += `${lettreDepuisChiffre(i + 1)} = $${etapes[w]}$ <br>`
        }
        if (context.isHtml) {
          texteCorr += '<br>'
        }
        texteCorr += `${lettreDepuisChiffre(i + 1)} = $${etapes[etapes.length - 1].replace('$', '')}$`
      }
      if (!(new FractionEtendue(num, den).estIrreductible)) texteCorr += ' (On a réduit le plus possible la fraction.)'

      texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline nospacebefore', { texteAvant: '=' })
      reponse = this.sup3 ? fraction(num, den).simplifie() : fraction(num, den)
      handleAnswers(this, i, { reponse: { value: reponse.toLatex(), compare: fonctionComparaison, options: { fractionEgale: !this.sup3, fractionIrreductible: this.sup3 } } })
      texte += ajouteFeedback(this, i)

      if (context.isAmc) {
        texte = 'Calculer et donner le résultat sous forme irréductible\\\\\n' + texte
        this.autoCorrection[i] = {
          enonce: texte, // Si vide, l'énoncé est celui de l'exercice.
          propositions: [
            {
              texte: '' // Si vide, le texte est la correction de l'exercice.
            }
          ],
          reponse: {
            valeur: [reponse], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
            param: {
              digits: 4,
              digitsNum: 2,
              digitsDen: 2
            }
          }
        }
      }

      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }

    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, "1 : Un dénominateur multiple de l'autre\n2 : Cas général"]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres relatifs']
  this.besoinFormulaire3CaseACocher = ['Avec l\'écriture simplifiée de la fraction résultat']
  this.besoinFormulaire4CaseACocher = ['Présentation des corrections en colonnes', false]
}
