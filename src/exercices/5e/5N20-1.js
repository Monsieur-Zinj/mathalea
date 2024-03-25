import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { deprecatedTexFraction, texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

import FractionEtendue from '../../modules/FractionEtendue.ts'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { sp } from '../../lib/outils/outilString'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Effectuer des calculs de fractions (à dénominateurs multiples) un peu complexes'

export const dateDePublication = '12/05/2023'
export const dateDeModifImportante = '02/03/2024'

/**
 * Effectuer des calculs mêlant fractions (dont un dénominateur est un multiple de l'autre) et priorités opératoires simples .
 *
 * Le résultat de la soustraction peut être négatif.
 *
 * Pour ne pas surcharger la difficulté, le coefficient est limité à 2, 3, 4 ou 5.

 * @author Mireille Gain
 */
export const uuid = '75f80'
export const ref = '5N20-1'
export const refs = {
  'fr-fr': ['5N20-1'],
  'fr-ch': ['10NO5-3']
}
export default function ExerciceAdditionnerSoustraireFractions5e (max = 5) {
  Exercice.call(this)
  this.sup = max // Correspond au facteur commun
  this.sup3 = false // Si false alors le résultat n'est pas en fraction simplifiée
  this.spacing = 2
  this.spacingCorr = 3
  this.nbQuestions = 4
  this.nbColsCorr = 2
  this.interactif = true
  this.nouvelleVersion = function () {
    if (this.sup3) {
      this.consigne = 'Calculer'
      this.consigne += this.interactif ? ' au brouillon et indiquer seulement le résultat final simplifié au maximum.' : ' et simplifier au maximum le résultat.'
    } else {
      this.consigne = 'Calculer'
      this.consigne += this.interactif ? ' au brouillon et indiquer seulement le résultat final.' : '.'
    }

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
              //     texte = `$${new FractionEtendue(a, b)}+ ${n} \\times  ${new FractionEtendue(c, d)}$`
              texte = `$${new FractionEtendue(a, b).texFSD}+ ${n} \\times  ${new FractionEtendue(c, d).texFSD}$`
            } else {
              texte = `$${new FractionEtendue(c, d).texFSD}+ ${n} \\times  ${new FractionEtendue(a, b).texFSD}$`
            }

            if (ordreDesFractions === 1) {
              texteCorr = `$${new FractionEtendue(a, b).texFSD}+ ${n} \\times ${new FractionEtendue(c, d).texFSD}=`

              texteCorr += `${new FractionEtendue(a, b).texFSD}+ ${new FractionEtendue(n * c, d).texFSD}=`

              texteCorr += `${new FractionEtendue(a * k, d).texFSD}+ ${new FractionEtendue(n * c, d).texFSD}=`

              texteCorr += `${deprecatedTexFraction(a * k + '+' + n * c, d)}=${new FractionEtendue(a * k + n * c, d).texFSD}$`
            } else {
              texteCorr = `$${new FractionEtendue(c, d).texFSD}+ ${n} \\times ${new FractionEtendue(a, b).texFSD}=`

              texteCorr += `${new FractionEtendue(c, d).texFSD}+ ${new FractionEtendue(n * a, b).texFSD}=`

              texteCorr += `${new FractionEtendue(c, d).texFSD}+ ${new FractionEtendue(n * a * k, d).texFSD}=`

              texteCorr += `${deprecatedTexFraction(c + '+' + n * a * k, d)}=${new FractionEtendue(n * a * k + c, d).texFSD}$`
            }
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              if (ordreDesFractions === 1) {
                s = pgcd(a * k + n * c, d)
                if (s !== 1) {
                  texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k + n * c) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k + n * c) / s), calculANePlusJamaisUtiliser(d / s))}$`
                }
                setReponse(this, i, (new FractionEtendue(a * k + n * c, d)).simplifie(), { formatInteractif: 'fractionEgale' })
              } else {
                s = pgcd(n * a * k + c, d)
                if (s !== 1) {
                  texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((n * a * k + c) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((n * a * k + c) / s), calculANePlusJamaisUtiliser(d / s))}$`
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
              texte = `$${new FractionEtendue(a, b).texFSD}- ${n} \\times  ${new FractionEtendue(c, d).texFSD}$`
            } else {
              texte = `$${new FractionEtendue(c, d).texFSD}- ${n} \\times  ${new FractionEtendue(a, b).texFSD}$`
            }

            if (ordreDesFractions === 1) {
              texteCorr = `$${new FractionEtendue(a, b).texFSD}- ${n} \\times ${new FractionEtendue(c, d).texFSD}=`

              texteCorr += `${new FractionEtendue(a, b).texFSD}- ${new FractionEtendue(n * c, d).texFSD}=`

              texteCorr += `${new FractionEtendue(a * k, d).texFSD}- ${new FractionEtendue(n * c, d).texFSD}=`

              texteCorr += `${deprecatedTexFraction(a * k + '-' + n * c, d)}=${new FractionEtendue(a * k - n * c, d).texFSD}$`
            } else {
              texteCorr = `$${new FractionEtendue(c, d).texFSD}- ${n} \\times ${new FractionEtendue(a, b).texFSD}=`

              texteCorr += `${new FractionEtendue(c, d).texFSD}- ${new FractionEtendue(n * a, b).texFSD}=`

              texteCorr += `${new FractionEtendue(c, d).texFSD}- ${new FractionEtendue(n * a * k, d).texFSD}=`

              texteCorr += `${deprecatedTexFraction(c + '-' + n * a * k, d)}=`

              texteCorr += `${new FractionEtendue(c - n * a * k, d).texFSD}$`
            }
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              if (ordreDesFractions === 1) {
                s = pgcd(a * k - n * c, d)
                if (s !== 1 && a * k - n * c !== 0) {
                  if (a * k - n * c > 0) texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - n * c) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - n * c) / s), calculANePlusJamaisUtiliser(d / s))}$`
                  else texteCorr += `$=-${deprecatedTexFraction(calculANePlusJamaisUtiliser(-(a * k - n * c) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=-${texFractionReduite(calculANePlusJamaisUtiliser(-(a * k - n * c) / s), calculANePlusJamaisUtiliser(d / s))}$`
                }
                setReponse(this, i, (new FractionEtendue(a * k - n * c, d)).simplifie(), { formatInteractif: 'fractionEgale' })
              } else {
                s = pgcd(n * a * k - c, d)
                if (s !== 1 && c - n * a * k !== 0) {
                  if (c - n * a * k > 0) texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((c - n * a * k) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((c - n * a * k) / s), calculANePlusJamaisUtiliser(d / s))}$`
                  else texteCorr += `$=-${deprecatedTexFraction(calculANePlusJamaisUtiliser(-(c - n * a * k) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=-${texFractionReduite(calculANePlusJamaisUtiliser(-(c - n * a * k) / s), calculANePlusJamaisUtiliser(d / s))}$`
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
          break
        case 'type2': // Calculs du type :     a/b - (c/b + e/bk)

          if (ordreDesFractions === 2) {
            texte = `$${new FractionEtendue(a, b).texFSD}- \\Big(${new FractionEtendue(c, b).texFSD} + ${new FractionEtendue(e, d).texFSD}\\Big)$`
          } else {
            texte = `$${new FractionEtendue(a, b).texFSD}- \\Big(${new FractionEtendue(c, d).texFSD} + ${new FractionEtendue(e, b).texFSD}\\Big)$`
          }

          if (ordreDesFractions === 2) {
            texteCorr = `$${new FractionEtendue(a, b).texFSD}- \\Big(${new FractionEtendue(c, b).texFSD} + ${new FractionEtendue(e, d).texFSD}\\Big)=`

            texteCorr += `${new FractionEtendue(a, b).texFSD} - \\Big( ${new FractionEtendue(k * c, d).texFSD} + ${new FractionEtendue(e, d).texFSD}\\Big)=`

            texteCorr += `${new FractionEtendue(a, b).texFSD} -  ${new FractionEtendue(k * c + e, d).texFSD}=`

            texteCorr += `${new FractionEtendue(a * k, d).texFSD} - ${new FractionEtendue(k * c + e, d).texFSD}=`

            texteCorr += `${new FractionEtendue(a * k - c * k - e, d).texFSD}$`

            // texteCorr += a * k - c * k - e === 0 ? '=0$' : '$'
          } else {
            texteCorr = `$${new FractionEtendue(a, b).texFSD}- \\Big(${new FractionEtendue(c, d).texFSD} + ${new FractionEtendue(e, b).texFSD}\\Big)=`

            texteCorr += `${new FractionEtendue(a, b).texFSD} - \\Big( ${new FractionEtendue(c, d).texFSD} + ${new FractionEtendue(k * e, d).texFSD}\\Big)=`

            texteCorr += `${new FractionEtendue(a, b).texFSD} -  ${new FractionEtendue(c + k * e, d).texFSD}=`

            texteCorr += `${new FractionEtendue(a * k, d).texFSD} - ${new FractionEtendue(c + k * e, d).texFSD}=`

            texteCorr += `${new FractionEtendue(a * k - c - k * e, d).texFSD}$`

            // texteCorr += a * k - c - k * e === 0 ? '=0$' : '$'
          }
          // Est-ce que le résultat est simplifiable ?
          if (this.sup3) {
            if (ordreDesFractions === 2) {
              s = pgcd(a * k - c * k - e, d)
              if (s !== 1 && a * k - c * k - e !== 0) {
                if (a * k - c * k - e > 0) texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - c * k - e) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - c * k - e) / s), calculANePlusJamaisUtiliser(d / s))}$`
                else texteCorr += `$=-${deprecatedTexFraction(calculANePlusJamaisUtiliser(-(a * k - c * k - e) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=-${texFractionReduite(calculANePlusJamaisUtiliser(-(a * k - c * k - e) / s), calculANePlusJamaisUtiliser(d / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a * k - c * k - e, d)).simplifie(), { formatInteractif: 'fractionEgale' })
            } else {
              s = pgcd(a * k - c - k * e, d)
              if (s !== 1 && a * k - c - k * e !== 0) {
                if (a * k - c - k * e > 0) texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - c - k * e) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - c - k * e) / s), calculANePlusJamaisUtiliser(d / s))}$`
                else texteCorr += `$=-${deprecatedTexFraction(calculANePlusJamaisUtiliser(-(a * k - c - k * e) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=-${texFractionReduite(calculANePlusJamaisUtiliser(-(a * k - c - k * e) / s), calculANePlusJamaisUtiliser(d / s))}$`
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
          break
        case 'type3': // Calculs du type a/b + n (pour retravailler le fait qu'un entier est une fraction) lorsque negOuPos === 2 et du type a/b - n lorsque negOuPos === 1
          if (negOuPos === 2) {
            texte = `$${new FractionEtendue(a, b).texFSD} + ${n}$`
            texteCorr = `$${new FractionEtendue(a, b).texFSD} + ${n}=`
            texteCorr += `${new FractionEtendue(a, b).texFSD} + ${new FractionEtendue(n * b, b).texFSD}=`
            texteCorr += `${new FractionEtendue(a + n * b, b).texFSD}$`
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              s = pgcd(a + n * b, b)
              if (s !== 1) {
                texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a + n * b) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(b / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a + n * b) / s), calculANePlusJamaisUtiliser(b / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a + n * b, b)).simplifie(), { formatInteractif: 'fractionEgale' })
            } else {
              setReponse(this, i, (new FractionEtendue(a + n * b, b)), { formatInteractif: 'fraction' })
            }
          } else {
            texte = `$${new FractionEtendue(a, b).texFSD} - ${n}$`
            texteCorr = `$${new FractionEtendue(a, b).texFSD} - ${n}=`
            texteCorr += `${new FractionEtendue(a, b).texFSD} - ${new FractionEtendue(n * b, b).texFSD}=`
            texteCorr += `${new FractionEtendue(a - n * b, b).texFSD}$`
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              s = pgcd(a - n * b, b)
              if (s !== 1 && a - n * b !== 0) {
                if (a - n * b > 0) texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a - n * b) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(b / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a - n * b) / s), calculANePlusJamaisUtiliser(b / s))}$`
                else texteCorr += `$=-${deprecatedTexFraction(calculANePlusJamaisUtiliser(-(a - n * b) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(b / s) + miseEnEvidence('\\times ' + s, 'blue'))}=-${texFractionReduite(calculANePlusJamaisUtiliser(-(a - n * b) / s), calculANePlusJamaisUtiliser(b / s))}$`
              }
              setReponse(this, i, (new FractionEtendue(a - n * b, b)).simplifie(), { formatInteractif: 'fractionEgale' })
            } else {
              setReponse(this, i, (new FractionEtendue(a - n * b, b)), { formatInteractif: 'fraction' })
            }
          }
          break
        case 'type4': // Calculs du type a/b - c/bk + e/b
          texte = `$${new FractionEtendue(a, b).texFSD}-${new FractionEtendue(c, d).texFSD}+${new FractionEtendue(e, b).texFSD}$`

          texteCorr = `$${new FractionEtendue(a, b).texFSD}-${new FractionEtendue(c, d).texFSD}+${new FractionEtendue(e, b).texFSD}=`
          texteCorr += `${new FractionEtendue(a * k, b * k).texFSD}-${new FractionEtendue(c, d).texFSD}+${new FractionEtendue(e * k, b * k).texFSD}=`
          texteCorr += `${deprecatedTexFraction(a * k + '-' + c + '+' + e * k, d)}=`
          texteCorr += `${new FractionEtendue(a * k - c + e * k, d).texFSD}$`
          // Est-ce que le résultat est simplifiable ?
          if (this.sup3) {
            s = pgcd(a * k - c + e * k, d)
            if (s !== 1 && a * k - c + e * k !== 0) {
              if (a * k - c + e * k > 0) texteCorr += `$=${deprecatedTexFraction(calculANePlusJamaisUtiliser((a * k - c + e * k) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=${texFractionReduite(calculANePlusJamaisUtiliser((a * k - c + e * k) / s), calculANePlusJamaisUtiliser(d / s))}$`
              else texteCorr += `$=-${deprecatedTexFraction(calculANePlusJamaisUtiliser(-(a * k - c + e * k) / s) + miseEnEvidence('\\times ' + s, 'blue'), calculANePlusJamaisUtiliser(d / s) + miseEnEvidence('\\times ' + s, 'blue'))}=-${texFractionReduite(calculANePlusJamaisUtiliser(-(a * k - c + e * k) / s), calculANePlusJamaisUtiliser(d / s))}$`
            }
            setReponse(this, i, (new FractionEtendue(a * k - c + e * k, d)).simplifie(), { formatInteractif: 'fractionEgale' })
          } else {
            setReponse(this, i, (new FractionEtendue(a * k - c + e * k, d)), { formatInteractif: 'fraction' })
          }
          break
      }
      texte += ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore', { texteAvant: sp() + '$=$' })

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
