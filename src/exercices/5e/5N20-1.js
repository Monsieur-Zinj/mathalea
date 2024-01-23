import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { deprecatedTexFraction, texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

import FractionEtendue from '../../modules/FractionEtendue.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Effectuer des calculs de fractions (à dénominateurs multiples) un peu complexes'

export const dateDePublication = '12/05/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
/**
 * Effectuer des calculs mêlant fractions (dont un dénominateur est un multiple de l'autre) et priorités opératoires simples .
 *
 * Le résultat de la soustraction peut être négatif.
 *
 * Pour ne pas surcharger la difficulté, le coefficient est limité à 2, 3, 4 ou 5.

 * @author Mireille Gain
 * 5N20-1
 */
export const uuid = '75f80'
export const ref = '5N20-1'
export default function ExerciceAdditionnerSoustraireFractions5e (max = 5) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = max // Correspond au facteur commun
  this.sup3 = false // Si false alors le résultat n'est pas en fraction simplifiée
  this.titre = titre
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.spacingCorr = 3
  this.nbQuestions = 4
  this.nbColsCorr = 2
  this.interactif = true
  this.nouvelleVersion = function () {
    if (this.sup3) {
      this.consigne = 'Calculer et simplifier au maximum le résultat.'
    } else {
      this.consigne = 'Calculer.'
    }
    this.sup = parseInt(this.sup)
    this.sup2 = parseInt(this.sup2)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const typeQuestionsDisponibles = ['type1', 'type2', 'type3', 'type4'] // On crée 4 types de questions

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, a, b, c, d, e, k, n, s, ordreDesFractions, negOuPos, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      // les numérateurs
      a = randint(1, 9)
      e = randint(1, 9)
      // les dénominateurs
      b = randint(2, 9, a)
      if (this.sup > 1) {
        k = randint(2, this.sup)
      } else k = 1
      d = b * k
      c = randint(1, 9, d)
      n = randint(2, 5)
      ordreDesFractions = randint(1, 2) // Quand ordreDesFractions = 1, alors le premier dénominateur est le plus petit.
      negOuPos = randint(1, 2)

      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1': // Calculs du type a/b + n * c/bk lorsque negOuPos === 1 et du type a/b - n * c/bk lorsque negOuPos === 2
          if (negOuPos === 1) {
            if (ordreDesFractions === 1) { // La fraction de dénominateur plus grand est la deuxième
              texte = `$${deprecatedTexFraction(a, b)}+ ${n} \\times  ${deprecatedTexFraction(c, d)}$`
            } else {
              texte = `$${deprecatedTexFraction(c, d)}+ ${n} \\times  ${deprecatedTexFraction(a, b)}$`
            }

            if (ordreDesFractions === 1) {
              texteCorr = `$${deprecatedTexFraction(a, b)}+ ${n} \\times ${deprecatedTexFraction(c, d)}=`

              texteCorr += `${deprecatedTexFraction(a, b)}+ ${deprecatedTexFraction(n * c, d)}=`

              texteCorr += `${deprecatedTexFraction(a * k, d)}+ ${deprecatedTexFraction(n * c, d)}=`

              texteCorr += `${deprecatedTexFraction(a * k + '+' + n * c, d)}=${deprecatedTexFraction(a * k + n * c, d)}$`
            } else {
              texteCorr = `$${deprecatedTexFraction(c, d)}+ ${n} \\times ${deprecatedTexFraction(a, b)}=`

              texteCorr += `${deprecatedTexFraction(c, d)}+ ${deprecatedTexFraction(n * a, b)}=`

              texteCorr += `${deprecatedTexFraction(c, d)}+ ${deprecatedTexFraction(n * a * k, d)}=`

              texteCorr += `${deprecatedTexFraction(c + '+' + n * a * k, d)}=${deprecatedTexFraction(n * a * k + c, d)}$`
            }
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              if (ordreDesFractions === 1) {
                s = pgcd(a * k + n * c, d)
                if (s !== 1) {
                  texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k + n * c) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k + n * c) / s), calculANePlusJamaisUtiliser(d / s))}$`
                }
                setReponse(this, i, (new FractionEtendue(a * k + n * c, d)).simplifie(), { formatInteractif: 'fractionEgale' })
              } else {
                s = pgcd(n * a * k + c, d)
                if (s !== 1) {
                  texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((n * a * k + c) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((n * a * k + c) / s), calculANePlusJamaisUtiliser(d / s))}$`
                }
                setReponse(this, i, (new FractionEtendue(n * a * k + c, d)).simplifie(), { formatInteractif: 'fractionEgale' })
              }
            } else {
              if (ordreDesFractions === 1) {
                setReponse(this, i, (new FractionEtendue(a * k + n * c, d)), { formatInteractif: 'fraction' })
              } else {
                setReponse(this, i, (new FractionEtendue(n * a * k + c, d)), { formatInteractif: 'fraction' })
              }
            }
          } else {
            if (ordreDesFractions === 1) {
              texte = `$${deprecatedTexFraction(a, b)}- ${n} \\times  ${deprecatedTexFraction(c, d)}$`
            } else {
              texte = `$${deprecatedTexFraction(c, d)}- ${n} \\times  ${deprecatedTexFraction(a, b)}$`
            }

            if (ordreDesFractions === 1) {
              texteCorr = `$${deprecatedTexFraction(a, b)}- ${n} \\times ${deprecatedTexFraction(c, d)}=`

              texteCorr += `${deprecatedTexFraction(a, b)}- ${deprecatedTexFraction(n * c, d)}=`

              texteCorr += `${deprecatedTexFraction(a * k, d)}- ${deprecatedTexFraction(n * c, d)}=`

              texteCorr += `${deprecatedTexFraction(a * k + '-' + n * c, d)}=${deprecatedTexFraction(a * k - n * c, d)}$`
            } else {
              texteCorr = `$${deprecatedTexFraction(c, d)}- ${n} \\times ${deprecatedTexFraction(a, b)}=`

              texteCorr += `${deprecatedTexFraction(c, d)}- ${deprecatedTexFraction(n * a, b)}=`

              texteCorr += `${deprecatedTexFraction(c, d)}- ${deprecatedTexFraction(n * a * k, d)}=`

              texteCorr += `${deprecatedTexFraction(c + '-' + n * a * k, d)}=`

              texteCorr += `${deprecatedTexFraction(c - n * a * k, d)}$`
            }
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              if (ordreDesFractions === 1) {
                s = pgcd(a * k - n * c, d)
                if (s !== 1) {
                  texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - n * c) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - n * c) / s), calculANePlusJamaisUtiliser(d / s))}$`
                }
                setReponse(this, i, (new FractionEtendue(a * k - n * c, d)).simplifie(), { formatInteractif: 'fractionEgale' })
              } else {
                s = pgcd(n * a * k - c, d)
                if (s !== 1) {
                  texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((c - n * a * k) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((c - n * a * k) / s), calculANePlusJamaisUtiliser(d / s))}$`
                }
                setReponse(this, i, (new FractionEtendue(n * a * k - c, d)).simplifie(), { formatInteractif: 'fractionEgale' })
              }
            } else {
              if (ordreDesFractions === 1) {
                setReponse(this, i, (new FractionEtendue(a * k - n * c, d)), { formatInteractif: 'fraction' })
              } else {
                setReponse(this, i, (new FractionEtendue(n * a * k - c, d)), { formatInteractif: 'fraction' })
              }
            }
          }
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, i)
          }
          break
        case 'type2': // Calculs du type :     a/b - (c/b + e/bk)

          if (ordreDesFractions === 2) {
            texte = `$${deprecatedTexFraction(a, b)}- \\Big(${deprecatedTexFraction(c, b)} + ${deprecatedTexFraction(e, d)}\\Big)$`
          } else {
            texte = `$${deprecatedTexFraction(a, b)}- \\Big(${deprecatedTexFraction(c, d)} + ${deprecatedTexFraction(e, b)}\\Big)$`
          }

          if (ordreDesFractions === 2) {
            texteCorr = `$${deprecatedTexFraction(a, b)}- \\Big(${deprecatedTexFraction(c, b)} + ${deprecatedTexFraction(e, d)}\\Big)=`

            texteCorr += `${deprecatedTexFraction(a, b)} - \\Big( ${deprecatedTexFraction(k * c, d)} + ${deprecatedTexFraction(e, d)}\\Big)=`

            texteCorr += `${deprecatedTexFraction(a, b)} -  ${deprecatedTexFraction(k * c + e, d)}=`

            texteCorr += `${deprecatedTexFraction(a * k, d)} - ${deprecatedTexFraction(k * c + e, d)}=`

            texteCorr += `${deprecatedTexFraction(a * k - c * k - e, d)}$`
          } else {
            texteCorr = `$${deprecatedTexFraction(a, b)}- \\Big(${deprecatedTexFraction(c, d)} + ${deprecatedTexFraction(e, b)}\\Big)=`

            texteCorr += `${deprecatedTexFraction(a, b)} - \\Big( ${deprecatedTexFraction(c, d)} + ${deprecatedTexFraction(k * e, d)}\\Big)=`

            texteCorr += `${deprecatedTexFraction(a, b)} -  ${deprecatedTexFraction(c + k * e, d)}=`

            texteCorr += `${deprecatedTexFraction(a * k, d)} - ${deprecatedTexFraction(c + k * e, d)}=`

            texteCorr += `${deprecatedTexFraction(a * k - c - k * e, d)}$`
          }
          // Est-ce que le résultat est simplifiable ?
          if (this.sup3) {
            if (ordreDesFractions === 2) {
              s = pgcd(a * k - c * k - e, d)
              if (s !== 1) {
                texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - c * k - e) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - c * k - e) / s), calculANePlusJamaisUtiliser(d / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a * k - c * k - e, d)).simplifie(), { formatInteractif: 'fractionEgale' })
            } else {
              s = pgcd(a * k - c - k * e, d)
              if (s !== 1) {
                texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - c - k * e) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - c - k * e) / s), calculANePlusJamaisUtiliser(d / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a * k - c - k * e, d)).simplifie(), { formatInteractif: 'fractionEgale' })
            }
          } else {
            if (ordreDesFractions === 2) {
              setReponse(this, i, (new FractionEtendue(a * k - c * k - e, d)), { formatInteractif: 'fraction' })
            } else {
              setReponse(this, i, (new FractionEtendue(a * k - c - k * e, d)), { formatInteractif: 'fraction' })
            }
          }
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, i)
          }
          break
        case 'type3': // Calculs du type a/b + n (pour retravailler le fait qu'un entier est une fraction) lorsque negOuPos === 2 et du type a/b - n lorsque negOuPos === 1
          if (negOuPos === 2) {
            texte = `$${deprecatedTexFraction(a, b)} + ${n}$`
            texteCorr = `$${deprecatedTexFraction(a, b)} + ${n}=`
            texteCorr += `${deprecatedTexFraction(a, b)} + ${deprecatedTexFraction(n * b, b)}=`
            texteCorr += `${deprecatedTexFraction(a + n * b, b)}$`
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              s = pgcd(a + n * b, b)
              if (s !== 1) {
                texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a + n * b) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(b / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a + n * b) / s), calculANePlusJamaisUtiliser(b / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a + n * b, b)).simplifie(), { formatInteractif: 'fractionEgale' })
            } else {
              setReponse(this, i, (new FractionEtendue(a + n * b, b)), { formatInteractif: 'fraction' })
            }
          } else {
            texte = `$${deprecatedTexFraction(a, b)} - ${n}$`
            texteCorr = `$${deprecatedTexFraction(a, b)} - ${n}=`
            texteCorr += `${deprecatedTexFraction(a, b)} - ${deprecatedTexFraction(n * b, b)}=`
            texteCorr += `${deprecatedTexFraction(a - n * b, b)}$`
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              s = pgcd(a - n * b, b)
              if (s !== 1) {
                texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a - n * b) / s) + miseEnEvidence('\\times ' + s), calculANePlusJamaisUtiliser(b / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a - n * b) / s), calculANePlusJamaisUtiliser(b / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a - n * b, b)).simplifie(), { formatInteractif: 'fractionEgale' })
            } else {
              setReponse(this, i, (new FractionEtendue(a - n * b, b)), { formatInteractif: 'fraction' })
            }
          }
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, i)
          }
          break
        case 'type4': // Calculs du type a/b - c/bk + e/b
          texte = `$${deprecatedTexFraction(a, b)}-${deprecatedTexFraction(c, d)}+${deprecatedTexFraction(e, b)}$`

          texteCorr = `$${deprecatedTexFraction(a, b)}-${deprecatedTexFraction(c, d)}+${deprecatedTexFraction(e, b)}=`
          texteCorr += `${deprecatedTexFraction(a * k, b * k)}-${deprecatedTexFraction(c, d)}+${deprecatedTexFraction(e * k, b * k)}=`
          texteCorr += `${deprecatedTexFraction(a * k + '-' + c + '+' + e * k, d)}=`
          texteCorr += `${deprecatedTexFraction(a * k - c + e * k, d)}$`
          // Est-ce que le résultat est simplifiable ?
          if (this.sup3) {
            s = pgcd(a * k - c + e * k, d)
            if (s !== 1) {
              texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - c + e * k) / s) + miseEnEvidence('\\times' + s), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times' + s))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - c + e * k) / s), calculANePlusJamaisUtiliser(d / s))}$`
            }
            setReponse(this, i, (new FractionEtendue(a * k - c + e * k, d)).simplifie(), { formatInteractif: 'fractionEgale' })
          } else {
            setReponse(this, i, (new FractionEtendue(a * k - c + e * k, d)), { formatInteractif: 'fraction' })
          }
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, i)
          }
          break
      }

      if (this.questionJamaisPosee(i, a, b, c, e, k, n)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }

  this.besoinFormulaireNumerique = ['Valeur maximale du coefficient multiplicateur', 99999]
  this.besoinFormulaire3CaseACocher = ['Avec l\'écriture simplifiée de la fraction résultat']
}
