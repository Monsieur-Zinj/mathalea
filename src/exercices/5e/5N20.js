import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { abs } from '../../lib/outils/nombres'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../Exercice'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fraction } from '../../modules/fractions.js'
import { texNombre } from '../../lib/outils/texNombre'
import { sp } from '../../lib/outils/outilString'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const dateDeModifImportante = '25/03/2024'
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
 */
export const uuid = 'd5ee3'
export const ref = '5N20'
export const refs = {
  'fr-fr': ['5N20'],
  'fr-ch': ['9NO13-6']
}
export default class ExerciceAdditionnerSoustraireFractions5ebis extends Exercice {
  constructor () {
    super()
    this.sup = 11 // Correspond au facteur commun
    this.sup2 = 3 // Si 1 alors il n'y aura pas de soustraction
    this.sup3 = true // Si false alors le résultat n'est pas en fraction simplifiée
    this.spacing = 2
    this.spacingCorr = 2
    this.nbQuestions = 5
    this.besoinFormulaireNumerique = ['Valeur maximale du coefficient multiplicateur', 99999]
    this.besoinFormulaire2Numerique = ['Type de calculs', 3, '1 : Additions\n2 : Soustractions\n3 : Mélange']
    this.besoinFormulaire3CaseACocher = ['Avec l\'écriture simplifiée de la fraction résultat']
  }

  nouvelleVersion () {
    if (this.sup3 && !context.isAmc) {
      this.consigne = 'Calculer'
      this.consigne += this.interactif ? ' au brouillon et indiquer seulement le résultat final simplifié au maximum.' : ' et simplifier au maximum le résultat.'
    } else {
      if (context.isAmc) {
        this.consigne = 'Calculer et choisir parmi les réponses proposées la bonne réponse.'
      } else {
        this.consigne = 'Calculer'
        this.consigne += this.interactif ? ' au brouillon et indiquer seulement le résultat final.' : '.'
      }
    }
    let listeTypeDeQuestions
    if (this.sup2 === 1) {
      listeTypeDeQuestions = combinaisonListes(['+'], this.nbQuestions)
    } else if (this.sup2 === 2) {
      listeTypeDeQuestions = combinaisonListes(['-'], this.nbQuestions)
    } else {
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
        if ((this.modeQcm && !context.isAmc) || (this.interactif && this.interactifType === 'qcm')) {
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
            texte = `$${f1.texFraction}+${f2.texFraction}$`
            /** ****************** AMC question/questionmult ********************************/
            this.autoCorrection[i].enonce = `${texte}\n`
          /*******************************************************************************/
          } else {
            texte = `$${f2.texFraction}+${f1.texFraction}$`
            /** ****************** AMC question/questionmult ******************************/
            this.autoCorrection[i].enonce = `${texte}\n`
          /*******************************************************************************/
          }
        }
        if (ordreDesFractions === 1) {
          texteCorr = `$${f1.texFraction}+${f2.texFraction}=`
          texte = `$${f1.texFraction}+${f2.texFraction}$`
          if (this.level !== 6) {
            texteCorr += `\\dfrac{${a}${miseEnEvidence('\\times ' + k, 'blue')}}{${b}${miseEnEvidence('\\times ' + k, 'blue')}}+${f2.texFraction}=${fraction(a * k, b * k).texFraction}+${f2.texFraction}=`
          }
          texteCorr += `\\dfrac{${a * k}+${c}}{${d}}=${fraction(a * k + c, d).texFraction}$`
        } else {
          texteCorr = `$${f2.texFraction}+${f1.texFraction}=`
          texte = `$${f2.texFraction}+${f1.texFraction}$`
          if (this.level !== 6) {
            texteCorr += `${f2.texFraction}+\\dfrac{${a}${miseEnEvidence('\\times ' + k, 'blue')}}{${b}${miseEnEvidence('\\times ' + k, 'blue')}}=${f2.texFraction}+${fraction(a * k, b * k).texFraction}=`
          }
          texteCorr += `\\dfrac{${c}+${a * k}}{${d}}=${fraction(a * k + c, d).texFraction}$`
        }
        // Est-ce que le résultat est simplifiable ?
        if (this.sup3) {
          s = pgcd(a * k + c, d)
          if (s !== 1) {
            texteCorr += `$=\\dfrac{${(a * k + c) / s}${miseEnEvidence('\\times ' + s, 'blue')}}{${d / s}${miseEnEvidence('\\times ' + s, 'blue')}}=${fraction((a * k + c) / s, d / s).texFractionSimplifiee}$`
          }
        }
        if ((this.modeQcm && !context.isAmc) || (this.interactif && this.interactifType === 'qcm')) {
          const props = propositionsQcm(this, i)
          texte += '<br>' + props.texte
        }
        if (this.interactifType === 'mathLive') {
          handleAnswers(this, i, { reponse: { value: new FractionEtendue(a * d + c * b, b * d).toLatex(), compare: fonctionComparaison, options: { fractionIrreductible: this.sup3, fractionEgale: !this.sup3 } } })
        }
      } else { // une soustraction
        /** ***************** Choix des réponses du QCM ***********************************/
        if ((this.modeQcm && !context.isAmc) || (this.interactif && this.interactifType === 'qcm')) {
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
        }
        if ((a / b) > (c / d)) {
          texte = `$${f1.texFraction}-${f2.texFraction}$`
        } else {
          texte = `$${f2.texFraction}-${f1.texFraction}$`
          /** ****************** AMC question/questionmult ******************************/

          /*****************************************************************************/
        }

        if ((a / b) > (c / d)) {
          texteCorr = `$${f1.texFraction}-${f2.texFraction}=`
          if (this.level !== 6) {
            texteCorr += `\\dfrac{${a}${miseEnEvidence('\\times ' + k, 'blue')}}{${b}${miseEnEvidence('\\times ' + k, 'blue')}}-${f2.texFraction}=${fraction(a * k, b * k).texFraction}-${f2.texFraction}=`
          }
          texteCorr += `\\dfrac{${a * k}-${c}}{${d}}=${fraction(a * k - c, d).texFraction}$`
        } else {
          texteCorr = `$${f2.texFraction}-${f1.texFraction}=`
          if (this.level !== 6) {
            texteCorr += `${f2.texFraction}-\\dfrac{${a}${miseEnEvidence('\\times ' + k, 'blue')}}{${b}${miseEnEvidence('\\times ' + k, 'blue')}}=${f2.texFraction}-${fraction(a * k, b * k).texFraction}=\\dfrac{${c}-${a * k}}{${d}}=`
          }
          texteCorr += `${fraction(c - a * k, d).texFraction}$`
        }
        // Est-ce que le résultat est simplifiable ?
        if (this.sup3) {
          s = pgcd(Math.abs(a * k - c), d)
          if (abs(a * k - c) % d === 0) { // si la fraction peut-être un nombre entier
            texteCorr += `$=${texNombre(abs(a * k - c) / d, 0)}$`
          } else if (s !== 1) {
            texteCorr += `$=\\dfrac{${abs(a * k - c) / s}${miseEnEvidence('\\times ' + s, 'blue')}}{${d / s}${miseEnEvidence('\\times ' + s, 'blue')}}=${fraction((abs(a * k - c) / s), d / s).texFractionSimplifiee}$`
          }
        }
        if ((this.modeQcm && !context.isAmc) || (this.interactif && this.interactifType === 'qcm')) {
          const props = propositionsQcm(this, i)
          texte += '<br>' + props.texte
        }

        if (this.interactifType === 'mathLive') {
          handleAnswers(this, i, { reponse: { value: new FractionEtendue(a * d - c * b, b * d).toLatex(), compare: fonctionComparaison, options: { fractionIrreductible: this.sup3, fractionEgale: !this.sup3 } } })
        }
      }
      if (this.interactifType === 'mathLive') texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore clavierDeBaseAvecFraction', { texteAvant: sp() + '$=$' })
      texte = texte.replaceAll('$$', ' ')

      texteCorr = texteCorr.replaceAll('$$', ' ')
      if (context.isAmc) {
        this.autoCorrection[i].enonce = texte
      }
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
      if (this.questionJamaisPosee(i, a, k, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
}
