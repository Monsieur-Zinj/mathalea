import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import {
  texFractionFromString,
  obtenirListeFractionsIrreductibles,
  texFractionSigne
} from '../../lib/outils/deprecatedFractions.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { abs } from '../../lib/outils/nombres'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { context } from '../../modules/context.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Diviser des fractions'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * Calcul du quotient de deux fractions. Paramétrages possibles :
 * * 1 : Nombres positifs exclusivement
 * * 2 : nombres relatifs
 * @author Jean-Claude Lhote
 * 4C22-2
 */
export const uuid = '55354'
export const ref = '4C22-2'
export const refs = {
  'fr-fr': ['4C22-2'],
  'fr-ch': ['10NO5-7']
}
export default function ExerciceDiviserFractions () {
  Exercice.call(this)
  this.sup = 1 // Avec ou sans relatifs
  this.titre = titre
  this.consigne = 'Calculer et donner le résultat sous forme irréductible.'
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 5
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeFractions = obtenirListeFractionsIrreductibles()

    const typesDeQuestionsDisponibles = [parseInt(this.sup)]
    let nombreDeSigneMoins
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    )
    for (
      let i = 0,
        ab,
        cd,
        a,
        b,
        c,
        d,
        p,
        signe,
        texte,
        reponse,
        texteCorr,
        typesDeQuestions,
        cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      typesDeQuestions = listeTypeDeQuestions[i]
      do {
        ab = choice(listeFractions)
        cd = choice(listeFractions)
        a = ab[0]
        b = ab[1]
        c = cd[0]
        d = cd[1]
      } while ((a * d) % (b * c) === 0)
      p = pgcd(a * d, b * c)

      switch (typesDeQuestions) {
        case 1: // fraction / fraction tout positif
          texte = `$${texFractionFromString(a, b)}\\div${texFractionFromString(c, d)}$`
          if (p === 1) {
            texteCorr = `$${texFractionFromString(a, b)}\\div${texFractionFromString(
                            c,
                            d
                        )}=${texFractionFromString(a, b)}\\times${texFractionFromString(d, c)}=${texFractionFromString(
                            a + '\\times' + d,
                            b + '\\times' + c
                        )}=${texFractionFromString(a * d, b * c)}$`
          } else {
            texteCorr = `$${texFractionFromString(a, b)}\\div${texFractionFromString(
                            c,
                            d
                        )}=${texFractionFromString(a, b)}\\times${texFractionFromString(d, c)}=${texFractionFromString(
                            a + '\\times' + d,
                            b + '\\times' + c
                        )}=${texFractionFromString(a * d, b * c)}=${texFractionFromString(
                            (a * d) / p + '\\times\\cancel{' + p + '}',
                            (b * c) / p + '\\times\\cancel{' + p + '}'
                        )}=${texFractionFromString((a * d) / p, (b * c) / p)}$`
          }
          break

        case 2:
          a = a * randint(-1, 1, [0])
          b = b * randint(-1, 1, [0])
          c = c * randint(-1, 1, [0])
          d = d * randint(-1, 1, [0])
          nombreDeSigneMoins = (a < 0) + (b < 0) + (c < 0) + (d < 0)
          if (Math.pow(-1, nombreDeSigneMoins) === 1) {
            signe = ''
          } else {
            signe = '-'
          }
          texte = `$${texFractionFromString(a, b)}\\div${texFractionFromString(c, d)}$`
          texteCorr = `$${texFractionFromString(a, b)}\\div${texFractionFromString(c, d)}$`
          a = abs(a)
          b = abs(b)
          c = abs(c)
          d = abs(d)
          p = pgcd(a * d, b * c)
          texteCorr += `$=${signe}${texFractionFromString(a, b)}\\times${texFractionFromString(
                        d,
                        c
                    )}$`
          texteCorr += `$=${signe}${texFractionFromString(
                        a + '\\times' + ecritureParentheseSiNegatif(d),
                        b + '\\times' + ecritureParentheseSiNegatif(c)
                    )}$`
          if (p === 1) {
            texteCorr += `$=${signe}${texFractionSigne(a * d, b * c)}$`
          } else {
            texteCorr += `$=${signe}${texFractionFromString(a * d, b * c)}$`
            if (a * d !== b * c) {
              texteCorr += `$=${signe}${texFractionFromString(
                                (a * d) / p + '\\times\\cancel{' + p + '}',
                                (b * c) / p + '\\times\\cancel{' + p + '}'
                            )}$`
              texteCorr += `$=${signe}${texFractionFromString(
                                (a * d) / p,
                                (b * c) / p
                            )}$`
            } else {
              texteCorr += `$=${signe}1$`
            }
          }

          break
      }
      // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
      const textCorrSplit = texteCorr.split('=')
      let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
      aRemplacer = aRemplacer.replace('$', '')

      texteCorr = ''
      for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
        texteCorr += textCorrSplit[ee] + '='
      }
      texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`
      // Fin de cette uniformisation

      reponse = fraction((signe === '-' ? -1 : 1) * a * d, b * c).simplifie()
      if (this.questionJamaisPosee(i, a, b, c, d, typesDeQuestions)) {
        texte += ajouteChampTexteMathLive(this, i, 'largeur01 nospacebefore inline ', { texteAvant: '$=$' })
        handleAnswers(this, i, { reponse: { value: reponse.toLatex(), compare: fonctionComparaison, options: { fractionIrreductible: true } } })
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
                digits: 5,
                digitsNum: 3,
                digitsDen: 2,
                signe: true
              }
            }
          }
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }

      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
  this.besoinFormulaireNumerique = [
    'Niveau de difficulté',
    2,
    ' 1 : Fractions à numérateur et dénominateur positifs \n 2 : Fractions à numérateur et dénominateur relatifs'
  ]
}
