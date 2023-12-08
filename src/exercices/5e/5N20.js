import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { abs } from '../../lib/outils/nombres.js'
import { pgcd } from '../../lib/outils/primalite.js'
import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { fraction } from '../../modules/fractions.js'
import { texNombre } from '../../lib/outils/texNombre.js'

export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Additionner ou soustraire deux fractions (dénominateurs multiples)'

/**
 * Effectuer l'addition ou la soustraction de deux fractions dont un dénominateur est un multiple de l'autre.
 *
 * Le résultat de la soustraction sera toujours positif.
 *
 * Le coefficient est paramétrable, par défaut il est inférieur à 11.
 *
 * On peut paramétrer de n'avoir que des soustractions.
 * @author Rémi Angot
 * 5N20
 */
export const uuid = 'd5ee3'
export const ref = '5N20'
export default function ExerciceAdditionnerSoustraireFractions5e (max = 11) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = max // Correspond au facteur commun
  this.sup2 = 3 // Si 1 alors il n'y aura pas de soustraction
  this.sup3 = true // Si false alors le résultat n'est pas en fraction simplifiée
  this.titre = titre
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 5
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    if (this.sup3 && !context.isAmc) {
      this.consigne = 'Calculer et simplifier au maximum le résultat.'
    } else {
      if (this.interactif && !context.isAmc) {
        this.consigne = 'Calculer.'
      } else if (context.isAmc) {
        this.consigne = 'Calculer et choisir parmi les réponses proposées la bonne réponse.'
      } else if (!this.sup3) {
        this.consigne = 'Calculer.'
      }
    }
    this.sup = parseInt(this.sup)
    this.sup2 = parseInt(this.sup2)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let listeTypeDeQuestions
    if (this.sup2 === 1) {
      listeTypeDeQuestions = combinaisonListes(['+'], this.nbQuestions)
    }
    if (this.sup2 === 2) {
      listeTypeDeQuestions = combinaisonListes(['-'], this.nbQuestions)
    }
    if (this.sup2 === 3) {
      listeTypeDeQuestions = combinaisonListes(['+', '-'], this.nbQuestions)
    }
    for (let i = 0, a, b, c, d, k, s, ordreDesFractions, texte, texteCorr; i < this.nbQuestions;) {
      this.autoCorrection[i] = {}
      texte = ''
      texteCorr = ''
      // les numérateurs
      a = randint(1, 9)
      // les dénominateurs
      b = randint(2, 9, a)
      if (this.sup > 1) {
        k = randint(2, this.sup)
      } else k = 1
      d = b * k
      if (listeTypeDeQuestions[i] === '-') {
        c = choice([randint(1, b * k), randint(b * k, 9 * k)])
      } else {
        c = randint(1, 19, d)
      }
      const f1 = new FractionEtendue(a, b)
      const f2 = new FractionEtendue(c, d)
      if (listeTypeDeQuestions[i] === '+') { // une addition
        /** ***************** Choix des réponses du QCM ***********************************/
        this.autoCorrection[i].propositions = [
          {
            texte: this.sup3 ? `$${fraction(a * k + c, d).texFractionSimplifiee}$` : `$${fraction(a * k + c, d).texFraction}$`,
            statut: true
          },
          {
            texte: this.sup3 ? `$${fraction(a + c, d).texFractionSimplifiee}$` : `$${fraction(a + c, d).texFraction}$`,
            statut: false
          },
          {
            texte: this.sup3 ? `$${fraction(a + c, b + d).texFractionSimplifiee}$` : `$${fraction(a + c, b + d).texFraction}$`,
            statut: false
          },
          {
            texte: this.sup3 ? `$${fraction(a * c, d).texFractionSimplifiee}$` : `$${fraction(a * c, d).texFraction}$`,
            statut: false
          }
        ]
        this.autoCorrection[i].options = {
          ordered: false,
          lastChoice: 5
        }
        if (this.level === 6) {
          // En 6e, pas de fraction simplifiée
          // Les fractions ont le même dénominateur (b=d)
          this.autoCorrection[i].propositions[0].texte = `$${fraction(a + c, b).texFraction}$`
        }
        /*************************************************************************/
        ordreDesFractions = randint(1, 2)
        if (ordreDesFractions === 1) {
          texte = `$${f1.texFraction}+${f2.texFraction}=$`
          /** ****************** AMC question/questionmult ********************************/
          this.autoCorrection[i].enonce = `${texte}\n`
          /*******************************************************************************/
        } else {
          texte = `$${f2.texFraction}+${f1.texFraction}=$`
          /** ****************** AMC question/questionmult ******************************/
          this.autoCorrection[i].enonce = `${texte}\n`
          /*******************************************************************************/
        }

        if (ordreDesFractions === 1) {
          texteCorr = `$${f1.texFraction}+${f2.texFraction}=`

          if (this.level !== 6) {
            texteCorr += `\\dfrac{${a}${miseEnEvidence('\\times ' + k)}}{${b}${miseEnEvidence('\\times ' + k)}}+${f2.texFraction}=${fraction(a * k, b * k).texFraction}+${f2.texFraction}=`
          }
          texteCorr += `\\dfrac{${a * k}+${c}}{${d}}=${fraction(a * k + c, d).texFraction}$`
        } else {
          texteCorr = `$${f2.texFraction}+${f1.texFraction}=`
          if (this.level !== 6) {
            texteCorr += `${f2.texFraction}+\\dfrac{${a}${miseEnEvidence('\\times ' + k)}}{${b}${miseEnEvidence('\\times ' + k)}}=${f2.texFraction}+${fraction(a * k, b * k).texFraction}=`
          }
          texteCorr += `\\dfrac{${c}+${a * k}}{${d}}=${fraction(a * k + c, d).texFraction}$`
        }
        // Est-ce que le résultat est simplifiable ?
        if (this.sup3) {
          s = pgcd(a * k + c, d)
          if (s !== 1) {
            texteCorr += `$=\\dfrac{${(a * k + c) / s}${miseEnEvidence('\\times ' + s)}}{${d / s}${miseEnEvidence('\\times ' + s)}}=${fraction((a * k + c) / s, d / s).texFractionSimplifiee}$`
          }
        }
        if ((this.modeQcm && !context.isAmc) || (this.interactif && this.interactifType === 'qcm')) {
          texte += '<br>' + propositionsQcm(this, i).texte
        }
        if (context.isHtml && this.interactifType === 'mathLive') {
          if (this.sup3) {
            setReponse(this, i, (new FractionEtendue(a * d + c * b, b * d)).simplifie(), { formatInteractif: 'fraction' })
          } else {
            setReponse(this, i, (new FractionEtendue(a * d + c * b, b * d)).simplifie(), { formatInteractif: 'fractionEgale' })
          }
        }
      } else { // une soustraction
        /** ***************** Choix des réponses du QCM ***********************************/
        this.autoCorrection[i].propositions = [
          {
            texte: this.sup3 ? `$${fraction(Math.abs(a * k - c), Math.abs(d)).texFractionSimplifiee}$` : `$${fraction(Math.abs(a * k - c), Math.abs(d)).texFraction}$`,
            statut: true
          },
          {
            texte: this.sup3 ? `$${fraction(Math.abs(a - c), Math.abs(b - d)).texFractionSimplifiee}$` : `$${fraction(Math.abs(a - c), Math.abs(b - d)).texFraction}$`,
            statut: false
          },
          {
            texte: this.sup3 ? `$${fraction(Math.abs(a - c), d).texFractionSimplifiee}$` : `$${fraction(Math.abs(a - c), d).texFraction}$`,
            statut: false
          },
          {
            texte: this.sup3 ? `$${fraction(a * c, d).texFractionSimplifiee}$` : `$${fraction(a * c, d).texFraction}$`,
            statut: false
          }
        ]
        this.autoCorrection[i].options = {
          ordered: false,
          lastChoice: 5
        }
        if (this.level === 6) {
          // En 6e, pas de fraction simplifiée
          // Les fractions ont le même dénominateur (b=d)
          this.autoCorrection[i].propositions[0].texte = `$${fraction(Math.abs(a - c), b).texFraction}$`
        }

        /*********************************************************************************/
        if ((a / b) > (c / d)) {
          texte = `$${f1.texFraction}-${f2.texFraction}=$`
        } else {
          texte = `$${f2.texFraction}-${f1.texFraction}=$`
          /** ****************** AMC question/questionmult ******************************/

          /*****************************************************************************/
        }
        if ((a / b) > (c / d)) {
          texteCorr = `$${f1.texFraction}-${f2.texFraction}=`
          if (this.level !== 6) {
            texteCorr += `\\dfrac{${a}${miseEnEvidence('\\times ' + k)}}{${b}${miseEnEvidence('\\times ' + k)}}-${f2.texFraction}=${fraction(a * k, b * k).texFraction}-${f2.texFraction}=`
          }
          texteCorr += `\\dfrac{${a * k}-${c}}{${d}}=${fraction(a * k - c, d).texFraction}$`
        } else {
          texteCorr = `$${f2.texFraction}-${f1.texFraction}=`
          if (this.level !== 6) {
            texteCorr += `${f2.texFraction}-\\dfrac{${a}${miseEnEvidence('\\times ' + k)}}{${b}${miseEnEvidence('\\times ' + k)}}=${f2.texFraction}-${fraction(a * k, b * k).texFraction}=\\dfrac{${c}-${a * k}}{${d}}=`
          }
          texteCorr += `${fraction(c - a * k, d).texFraction}$`
        }
        // Est-ce que le résultat est simplifiable ?
        if (this.sup3) {
          s = pgcd(Math.abs(a * k - c), d)
          if (abs(a * k - c) % d === 0) { // si la fraction peut-être un nombre entier
            texteCorr += `$=${texNombre(abs(a * k - c) / d, 0)}$`
          } else if (s !== 1) {
            texteCorr += `$=\\dfrac{${abs(a * k - c) / s}${miseEnEvidence('\\times ' + s)}}{${d / s}${miseEnEvidence('\\times ' + s)}}=${fraction((abs(a * k - c) / s), d / s).texFractionSimplifiee}$`
          }
        }
        if ((this.modeQcm && !context.isAmc) || (this.interactif && this.interactifType === 'qcm')) {
          texte += '<br>' + propositionsQcm(this, i).texte
        }
        if (context.isHtml && this.interactifType === 'mathLive') {
          if (this.sup3) {
            setReponse(this, i, (new FractionEtendue(Math.abs(a * d - c * b), b * d)).simplifie(), { formatInteractif: 'fraction' })
          } else {
            setReponse(this, i, (new FractionEtendue(Math.abs(a * d - c * b), b * d)).simplifie(), { formatInteractif: 'fractionEgale' })
          }
        }
      }
      if (context.isHtml && this.interactifType === 'mathLive') texte += ajouteChampTexteMathLive(this, i)
      texte = texte.replaceAll('$$', ' ')
      texteCorr = texteCorr.replaceAll('$$', ' ')
      if (context.isAmc) {
        this.autoCorrection[i].enonce = texte
      }

      if (this.questionJamaisPosee(i, a, k, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }

  this.besoinFormulaireNumerique = ['Valeur maximale du coefficient multiplicateur', 99999]
  this.besoinFormulaire2Numerique = ['Type de calculs', 3, '1 : Additions\n2 : Soustractions\n3 : Mélange']
  this.besoinFormulaire3CaseACocher = ['Avec l\'écriture simplifiée de la fraction résultat']
}
