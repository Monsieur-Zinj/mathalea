import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'

export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Multiplier un nombre décimal par 10, 100 ou 1 000'
export const dateDeModifImportante = '12/12/2021'

/**
 * Multiplication d'un nombre décimal dans différentes écritures par 10, 100, 1000
 *
 *  * Type 1 : écriture décimale
 *  * Type 2 : écriture fractionnaire
 *  * Type 3 : écritures fractionnaires et décimales
 *
 *  * Sup2 : avec ou sans calculs à trous
 * @author Rémi Angot (Ajout 3 décimales maxi et que des entiers par Eric Elter)
 * Référence 6C30-1
 * Relecture : Décembre 2021 par EE
 *
 */
export const uuid = '2471d'
export const ref = '6C30-1'
export const refs = {
  'fr-fr': ['6C30-1'],
  'fr-ch': ['9NO1-10', '10NO5-1']
}
export default function MultiplierDecimauxPar101001000 () {
  Exercice.call(this)
  this.consigne = 'Calculer et donner le résultat sous forme d\'un nombre décimal.'
  this.sup = 3
  this.sup2 = false
  this.sup3 = true
  this.sup4 = false
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 8

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    let typesDeQuestionsDisponibles = []
    let typesDeQuestions
    if (this.sup === 1 && !this.sup2) typesDeQuestionsDisponibles = [1, 2]
    if (this.sup === 1 && this.sup2) {
      typesDeQuestionsDisponibles = [1, 2, 5, 6]
    }
    if (this.sup === 2 && !this.sup2) typesDeQuestionsDisponibles = [3, 4]
    if (this.sup === 2 && this.sup2) {
      typesDeQuestionsDisponibles = [3, 4, 3, 4, 7, 8, 9, 10]
    }
    if (this.sup === 3 && !this.sup2) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4]
    }
    if (this.sup === 3 && this.sup2) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
    if (this.sup2) this.consigne = 'Calculer et compléter.'
    let reponse
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const facteurs = combinaisonListes(
      [10, 100, 1000],
      this.nbQuestions
    )

    for (
      let i = 0, texte, texteCorr, cpt = 0, a, b, den;
      i < this.nbQuestions && cpt < 50;
    ) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1: // a,abcd × 10
          a = choice([randint(11, 99), randint(100, 999)])
          if (!this.sup4) {
            if (this.sup3) {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000]))
            } else {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000, 10000]))
            }
          }
          b = facteurs[i]
          texte = `$${texNombre(a)}\\times${texNombre(b)}= ${this.interactif ? '' : '\\ldots'}$`
          texteCorr = `$${texNombre(a)} \\times ${texNombre(
                        b
                    )} = ${miseEnEvidence(texNombre(a * b))}$`
          reponse = calculANePlusJamaisUtiliser(a * b)
          break
        case 2: // 10 × a,abcd
          a = choice([randint(11, 99), randint(100, 999)])
          if (!this.sup4) {
            if (this.sup3) {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000]))
            } else {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000, 10000]))
            }
          }
          b = facteurs[i]
          texte = `$${texNombre(b)}\\times${texNombre(a)}= ${this.interactif ? '' : '\\ldots'}$`
          texteCorr = `$${texNombre(b)} \\times ${texNombre(
                        a
                    )} = ${miseEnEvidence(texNombre(a * b))}$`
          reponse = calculANePlusJamaisUtiliser(a * b)
          break
        case 3: // abcd/10 × 10
          a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
          b = facteurs[i]
          if (this.sup4) {
            den = choice([10, 100, 1000])
            while (den > b) {
              den = choice([10, 100, 1000])
            }
          } else {
            den = choice([10, 100, 1000])
          }
          texte = `$${texFractionFromString(a, den)}\\times${texNombre(b)}= ${this.interactif ? '' : '\\ldots'}$`
          texteCorr = `$${texFractionFromString(a, den)} \\times ${texNombre(
                        b
                    )} = ${texFractionFromString(a * b, den)} = ${miseEnEvidence(texNombre((a / den) * b))}$`
          reponse = calculANePlusJamaisUtiliser(a * b / den)
          break
        case 4: // 10 × abcd/10
          a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
          b = facteurs[i]
          if (this.sup4) {
            den = choice([10, 100, 1000])
            while (den > b) {
              den = choice([10, 100, 1000])
            }
          } else {
            den = choice([10, 100, 1000])
          }
          texte = `$${texNombre(b)}\\times${texFractionFromString(a, den)}= ${this.interactif ? '' : '\\ldots'}$`
          texteCorr = `$${texNombre(b)} \\times ${texFractionFromString(
                        a,
                        den
                    )} = ${texFractionFromString(a * b, den)} = ${miseEnEvidence(texNombre((a / den) * b))}$`
          reponse = calculANePlusJamaisUtiliser(a * b / den)
          break
        case 5: // .... × 10 = a,abcd
          a = choice([randint(11, 99), randint(100, 999)])
          if (!this.sup4) {
            if (this.sup3) {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000]))
            } else {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000, 10000]))
            }
          }
          b = facteurs[i]
          texte = `$\\ldots \\times${texNombre(b)} = ${texNombre(a * b)}$`
          texteCorr = `$${miseEnEvidence(
                        texNombre(a)
                    )} \\times ${texNombre(b)} = ${texNombre(a * b)}$`
          reponse = a
          break
        case 6: // 10 × .... = a,abcd
          a = choice([randint(11, 99), randint(100, 999)])
          if (!this.sup4) {
            if (this.sup3) {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000]))
            } else {
              a = calculANePlusJamaisUtiliser(a / choice([10, 100, 1000, 10000]))
            }
          }
          b = facteurs[i]
          texte = `$${texNombre(b)} \\times \\ldots = ${texNombre(a * b)}$`
          texteCorr = `$${texNombre(b)} \\times ${miseEnEvidence(
                        texNombre(a)
                    )}  = ${texNombre(a * b)}$`
          reponse = a
          break
        case 7: // case 3 avec un trou sur l'entier
          a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
          b = facteurs[i]
          if (this.sup4) {
            den = choice([10, 100, 1000])
            while (den > b) {
              den = choice([10, 100, 1000])
            }
          } else {
            den = choice([10, 100, 1000])
          }
          texte = `$${texFractionFromString(a, den)}\\times \\ldots = ${texNombre(
                        (a / den) * b
                    )}$`
          texteCorr = `$${texFractionFromString(a, den)} \\times ${miseEnEvidence(
                        texNombre(b)
                    )} = ${texFractionFromString(a * b, den)} = ${texNombre((a / den) * b)}$`
          reponse = b
          break
        case 8: // case 4 avec un trou sur l'entier
          a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
          b = facteurs[i]
          if (this.sup4) {
            den = choice([10, 100, 1000])
            while (den > b) {
              den = choice([10, 100, 1000])
            }
          } else {
            den = choice([10, 100, 1000])
          }
          texte = `$ \\ldots \\times${texFractionFromString(a, den)}= ${texNombre(
                        (a / den) * b
                    )}$`
          texteCorr = `$${miseEnEvidence(
                        texNombre(b)
                    )} \\times ${texFractionFromString(a, den)} = ${texFractionFromString(
                        a * b,
                        den
                    )} = ${texNombre((a / den) * b)}$`
          reponse = b
          break
        case 9: // case 3 avec trou sur la fraction
          a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
          b = facteurs[i]
          if (this.sup4) {
            den = choice([10, 100, 1000])
            while (den > b) {
              den = choice([10, 100, 1000])
            }
          } else {
            den = choice([10, 100, 1000])
          }
          texte = `$${texFractionFromString(a, '\\ldots')}\\times${texNombre(
                        b
                    )} = ${texNombre((a / den) * b)}$`
          texteCorr = `$${texFractionFromString(
                        a,
                        miseEnEvidence(texNombre(den))
                    )} \\times ${texNombre(b)} = ${texFractionFromString(
                        a * b,
                        den
                    )} = ${texNombre((a / den) * b)}$`
          reponse = den
          break
        case 10: // case 4 avec trou sur la fraction
          a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
          b = facteurs[i]
          if (this.sup4) {
            den = choice([10, 100, 1000])
            while (den > b) {
              den = choice([10, 100, 1000])
            }
          } else {
            den = choice([10, 100, 1000])
          }
          texte = `$${texNombre(b)}\\times${texFractionFromString(
                        a,
                        '\\ldots'
                    )} = ${texNombre((a / den) * b)}$`
          texteCorr = `$${texNombre(b)} \\times ${texFractionFromString(
                        a,
                        miseEnEvidence(texNombre(den))
                    )} = ${texFractionFromString(a * b, den)} = ${texNombre((a / den) * b)}$`
          reponse = den
          break
      }
      if (context.isHtml && this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
      handleAnswers(this, i, { reponse: { value: stringNombre(reponse, 5) } })
      if (context.isAmc) {
        this.autoCorrection[i].enonce = texte
        this.autoCorrection[i].propositions = [{ texte: texteCorr, statut: '' }]
        this.autoCorrection[i].reponse.param = {
          digits: nombreDeChiffresDansLaPartieEntiere(reponse) + nombreDeChiffresDansLaPartieDecimale(reponse) + 2,
          decimals: nombreDeChiffresDansLaPartieDecimale(reponse) + 1,
          signe: false,
          exposantNbChiffres: 0
        }
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Type de calculs',
    3,
    '1 : Écriture décimale\n2 : Écriture fractionnaire\n3 : Mélange'
  ]
  this.besoinFormulaire2CaseACocher = ['Avec des calculs à trous']
  this.besoinFormulaire3CaseACocher = ['Trois décimales maximum', true]
  this.besoinFormulaire4CaseACocher = ['Que des nombres entiers', true]
}
