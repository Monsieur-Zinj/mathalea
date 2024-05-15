import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import {
  texFractionFromString,
  obtenirListeFractionsIrreductibles,
  obtenirListeFractionsIrreductiblesFaciles,
  produitDeDeuxFractions,
  simplificationDeFractionAvecEtapes
} from '../../lib/outils/deprecatedFractions.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, ppcm, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { fraction } from '../../modules/fractions.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Fractions et priorités opératoires'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'
/** Styles d'expressions :
 1 : Fractions faciles, tout enchaînement d'opérations possibles
 2 : Fractions standards, tout enchaînement d'opérations possibles
 3 : Des expressions pièges démarrant sur une opération prioritaire ou pas
 4 : Uniquement des expressions pièges démarrant sur une opération non prioritaire`
 * @author Jean-Claude Lhote
 * Référence 4C23
 */
export const uuid = '18ddd'
export const ref = '4C23-1'
export const refs = {
  'fr-fr': ['4C23-1'],
  'fr-ch': ['10NO6-3']
}
export default function ExerciceAdditionnerFractionProduit () {
  Exercice.call(this)
  this.sup = 3
  this.sup2 = false
  this.sup3 = true
  this.sup4 = true
  this.titre = titre
  this.consigne = 'Calculer et donner un résultat simplifié.'
  this.nbCols = 2
  this.spacing = 1
  this.spacingCorr = 2
  this.nbQuestions = 6
  this.nbColsCorr = this.sup4 ? 2 : 1
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = false

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let typesDeQuestionsDisponibles
    const listeFractions = obtenirListeFractionsIrreductibles()
    const listeFractionsFaciles = obtenirListeFractionsIrreductiblesFaciles()
    let piegeObligatoire = false

    // Définition des styles d'exercices
    switch (this.sup) {
      case 1: // Fractions faciles, tout enchaînement d'opérations possibles
        typesDeQuestionsDisponibles = [1, 2]
        break

      case 2: // Fractions standards, tout enchaînement d'opérations possibles
        typesDeQuestionsDisponibles = [1, 2]
        break

      case 3: // Uniquement expressions pièges démarrant sur une opération prioritaire *ou pas*
        typesDeQuestionsDisponibles = [1, 2]
        piegeObligatoire = true
        break

      case 4: // Uniquement des expressions pièges démarrant sur une opération non prioritaire`
        typesDeQuestionsDisponibles = [1]
        piegeObligatoire = true
        break

      default: // En cas de pépin…
        typesDeQuestionsDisponibles = [1]
        break
    }
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    )

    for (
      let i = 0,
        ab = Array(2),
        cd = Array(2),
        ef = Array(2),
        a,
        b,
        c,
        d,
        e,
        f,
        p,
        k1,
        k2,
        reponse,
        operation1,
        operation2,
        texteOperation1,
        texteOperation2,
        texte,
        texteCorr,
        produit = Array(3),
        typesDeQuestions,
        cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      typesDeQuestions = listeTypeDeQuestions[i]

      if (this.sup === 1) {
        ab = choice(listeFractionsFaciles)
        cd = choice(listeFractionsFaciles)
        ef = choice(listeFractionsFaciles)
      } else {
        ab = choice(listeFractions)
        cd = choice(listeFractions)
        ef = choice(listeFractions)
      }

      [a, b] = ab;
      [c, d] = cd;
      [e, f] = ef

      if (this.sup2) {
        [a, b, c, d, e, f] = [a, b, c, d, e, f].map(e => e * randint(-1, 1, [0]))
      }

      operation1 = randint(0, 1) // Pioche la soustraction (0) ou l'addition (1)
      operation2 = this.sup3 ? randint(0, 1) : 1 // Si l'option est cochée, Pioche la division (0) ou la multiplication (1)
      texteOperation1 = operation1 ? '+' : '-'
      texteOperation2 = operation2 ? ' \\times ' : ' \\div '
      texte = ''

      switch (typesDeQuestions) {
        case 1: // De la forme : « a⁄b ± c⁄d ×÷ e⁄f »
          if (piegeObligatoire) {
            d = b
          }

          texte += `$${texFractionFromString(a, b)} ${texteOperation1} ${texFractionFromString(c, d)} ${texteOperation2} ${texFractionFromString(e, f)}$`

          texteCorr = `$${texFractionFromString(a, b)} ${texteOperation1} ${texFractionFromString(c, d)} ${texteOperation2} ${texFractionFromString(e, f)}$`
          if (!operation2) { // Si il y a division, multiplier par l'inverse du diviseur
            [e, f] = [f, e]
            texteCorr += `$=${texFractionFromString(a, b)} ${texteOperation1} ${texFractionFromString(c, d)} \\times ${texFractionFromString(e, f)}$`
          }
          produit = produitDeDeuxFractions(c, d, e, f)
          if (this.correctionDetaillee) {
            texteCorr += `$=${texFractionFromString(a, b)} ${texteOperation1} ${texFractionFromString(c + '\\times' + ecritureParentheseSiNegatif(e), d + '\\times' + ecritureParentheseSiNegatif(f))}$`
            texteCorr += `$=${texFractionFromString(a, b)} ${texteOperation1} ${texFractionFromString(c * e, d * f)}$`
          } else {
            texteCorr += `$=${texFractionFromString(a, b)} ${texteOperation1} ${produit[1]}$`
            texteCorr += `$=${texFractionFromString(a, b)} ${texteOperation1} ${produit[0]}$`
          }

          // faut-il simplifier c×e⁄d×f ?
          if (!this.correctionDetaillee) {
            [c, d, e, f] = produit[2]
          }
          p = pgcd(c * e, d * f)
          if (p !== 1 && ppcm(b, d * f) > ppcm(b, (d * f) / p)) {
            texteCorr += `$=${texFractionFromString(a, b)} ${texteOperation1} ${texFractionFromString((e * c) / p + '\\times\\cancel{' + ecritureParentheseSiNegatif(p) + '}', (f * d) / p + '\\times\\cancel{' + ecritureParentheseSiNegatif(p) + '}'
                        )}$`
            c = (e * c) / p
            d = (f * d) / p
          } else {
            c = e * c
            d = f * d
          }
          p = ppcm(b, d) // p = dénominateur commun
          k1 = p / b
          k2 = p / d
          if (k1 !== 1) {
            texteCorr += `$=${texFractionFromString(a + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k1)), b + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k1)))}$`
          } else {
            if (k2 !== 1) {
              texteCorr += `$=${texFractionFromString(a, b)}$`
            }
          }
          if (k2 !== 1) {
            texteCorr += `$ ${texteOperation1} ${texFractionFromString(c + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k2)), d + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k2)))}$`
          } else {
            if (k1 !== 1) {
              texteCorr += `$ ${texteOperation1} ${texFractionFromString(c, d)}$`
            }
          }

          texteCorr += `$=${texFractionFromString(a * k1, p)} ${texteOperation1} ${texFractionFromString(c * k2, p)}$`
          e = operation1 ? a * k1 + c * k2 : a * k1 - c * k2
          f = p
          texteCorr += `$=${texFractionFromString(e, f)}${simplificationDeFractionAvecEtapes(e, f)}$`
          reponse = fraction(e, f).simplifie()
          break

        case 2: // De la forme : « c⁄d ×÷ e⁄f ± a⁄b »
          if (piegeObligatoire) {
            f = b
          }
          texte += `$${texFractionFromString(c, d)} ${texteOperation2} ${texFractionFromString(e, f)} ${texteOperation1} ${texFractionFromString(a, b)}$`

          texteCorr = `$${texFractionFromString(c, d)} ${texteOperation2} ${texFractionFromString(e, f)} ${texteOperation1} ${texFractionFromString(a, b)}$`
          if (!operation2) { // S'il y a division, multiplier par l'inverse du diviseur
            [e, f] = [f, e]
            texteCorr += `$=${texFractionFromString(c, d)} \\times ${texFractionFromString(e, f)} ${texteOperation1} ${texFractionFromString(a, b)}$`
          }

          produit = produitDeDeuxFractions(c, d, e, f)
          // texteCorr += `$=${texFractionFromString(c, d)}\\times ${texFractionFromString(e, f)} ${texteOperation1} ${texFractionFromString(a, b)}$`
          if (this.correctionDetaillee) {
            texteCorr += `$=${texFractionFromString(c + '\\times' + ecritureParentheseSiNegatif(e), d + '\\times' + ecritureParentheseSiNegatif(f))} ${texteOperation1} ${texFractionFromString(a, b)}$`
            texteCorr += `$=${texFractionFromString(c * e, d * f)} ${texteOperation1} ${texFractionFromString(a, b)}$`
          } else {
            texteCorr += `$=${produit[1]} ${texteOperation1} ${texFractionFromString(a, b)}$`
            texteCorr += `$=${produit[0]} ${texteOperation1} ${texFractionFromString(a, b)}$`
          }

          // faut-il simplifier c×e⁄d×f ?
          if (!this.correctionDetaillee) {
            [c, d, e, f] = produit[2]
          }
          p = pgcd(c * e, d * f)
          if (p !== 1 && ppcm(b, d * f) > ppcm(b, (d * f) / p)) {
            texteCorr += `$=${texFractionFromString((e * c) / p + '\\times\\cancel{' + ecritureParentheseSiNegatif(p) + '}', (f * d) / p + '\\times\\cancel{' + ecritureParentheseSiNegatif(p) + '}')} ${texteOperation1} ${texFractionFromString(a, b)}$`
            c = (e * c) / p
            d = (f * d) / p
          } else {
            c = e * c
            d = f * d
          }
          p = ppcm(b, d) // p = dénominateur commun
          k1 = p / b
          k2 = p / d
          if (k2 !== 1) {
            texteCorr += `$=${texFractionFromString(
                            c + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k2)),
                            d + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k2))
                        )}$`
          } else {
            if (k1 !== 1) {
              texteCorr += `$=${texFractionFromString(c, d)}$`
            }
          }

          if (k1 !== 1) {
            texteCorr += `$ ${texteOperation1} ${texFractionFromString(
                            a + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k1)),
                            b + miseEnEvidence('\\times' + ecritureParentheseSiNegatif(k1))
                        )}$`
          } else {
            if (k2 !== 1) {
              texteCorr += `$ ${texteOperation1} ${texFractionFromString(a, b)}$`
            }
          }

          if (this.correctionDetaillee) {
            texteCorr += `$=${texFractionFromString(c * k2, p)} ${texteOperation1} ${texFractionFromString(a * k1, p)}$`
          }
          e = operation1 ? c * k2 + a * k1 : c * k2 - a * k1
          f = p

          texteCorr += `$=${texFractionFromString(e, f)}${simplificationDeFractionAvecEtapes(e, f)}$`
          reponse = fraction(e, f).simplifie()
          break
      }

      if (this.questionJamaisPosee(i, a, b, c, d, typesDeQuestions)) {
        texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline')
        setReponse(this, i, reponse, {
          formatInteractif: 'fraction',
          digits: 5,
          digitsNum: 3,
          digitsDen: 2,
          signe: true
        })
        if (this.sup4) {
          texte = `$${lettreDepuisChiffre(i + 1)} = $ ${texte}`
          // On découpe
          const etapes = texteCorr.split('=')
          texteCorr = ''
          etapes.forEach(function (etape) {
            // etape = etape.replace('$', '')
            etape = etape.split('$').join('')
            if (context.isHtml) {
              texteCorr += '<br>'
            }
            texteCorr += `$ ${lettreDepuisChiffre(i + 1)} = ${etape}$ <br>`
          })
        }
        if (context.isAmc) texte = 'Calculer et donner le résultat sous forme irréductible\\\\\n' + texte
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
  this.besoinFormulaireNumerique = [
    'Style d\'expressions',
    4,
        `   1 : Fractions faciles, tout enchaînement d'opérations possibles
    2 : Fractions standards, tout enchaînement d'opérations possibles
    3 : Des expressions pièges démarrant sur une opération prioritaire ou pas
    4 : Uniquement des expressions pièges démarrant sur une opération non prioritaire`
  ]
  this.besoinFormulaire2CaseACocher = ['Utiliser les nombres relatifs', false]
  this.besoinFormulaire3CaseACocher = ['Utiliser les divisions', true]
  this.besoinFormulaire4CaseACocher = ['Présentation des calculs en colonnes', true]
}
