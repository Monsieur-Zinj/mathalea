import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Calculer mentalement le pourcentage d\'un nombre'

/**
 * Calculer 10, 20, 30, 40 ou 50% d'un nombre
 * @author Rémi Angot + Jean-Claude Lhote
 * Ajout niveau 2 + 1 correction différente cgrolleau 03/2021
 */
export const uuid = '66756'
export const ref = '6N33-1'
export const refs = {
  'fr-fr': ['6N33-1'],
  'fr-ch': ['9NO14-3']
}
export default function PourcentageDunNombre () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.spacingCorr = 3.5
  this.nbCols = 2
  this.nbColsCorr = 1
  this.sup = 1
  this.interactif = false
  this.sup2 = false
  this.sup3 = false
  this.sup4 = '10'

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const pourcentages = !this.sup3
      ? combinaisonListes(this.sup === 1 ? [10, 20, 30, 40, 50] : [10, 20, 25, 30, 40, 50, 60, 90], this.nbQuestions)
      : gestionnaireFormulaireTexte({
        saisie: this.sup4,
        min: 1,
        max: 8,
        defaut: 9,
        melange: 9,
        nbQuestions: this.nbQuestions,
        listeOfCase: [10, 20, 25, 30, 40, 50, 60, 75, 90]
      })
    for (
      let i = 0, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      const p = pourcentages[i]
      let n = choice([randint(2, 9), randint(2, 9) * 10, randint(1, 9) * 10 + randint(1, 2)])
      if (p === 25 | p === 75) {
        n = randint(1, 10) * choice([4, 40])
      }
      texte = `$${p}~\\%~\\text{de }${n}$`
      switch (p) {
        case 50 :
          texteCorr = `$${p}~\\%~\\text{de }${n}=${n}\\div${2} = ${texNombre(calculANePlusJamaisUtiliser(n / 2))}$` // calcul de n/2 si p = 50%
          break
        case 25 :
          texteCorr = `$${p}~\\%~\\text{de }${n}=${n}\\div${4} = ${texNombre(calculANePlusJamaisUtiliser(n / 4))}$` // calcul de n/4 si p = 25%
          break
        case 75 :
          texteCorr = `$${p}~\\%~\\text{de }${n}=${n}\\div 4\\times 3 = ${texNombre(n / 4)} \\times 3 = ${texNombre(n / 4 * 3)}$` // calcul de n/4 * 3 si p = 75%
          break
        default :
          texteCorr = `$${p}~\\%~\\text{de }${n}=${texFractionFromString(p, 100)}\\times${n}=(${p}\\times${n})\\div100=${texNombre(p * n)}\\div100=${texNombre(calculANePlusJamaisUtiliser((p * n) / 100))}$`
          if (this.sup2) {
            texteCorr += `<br>$${p}~\\%~\\text{de }${n}=${texFractionFromString(p, 100)}\\times${n}=(${n}\\div100)\\times${p}=${texNombre(calculANePlusJamaisUtiliser(n / 100))}\\times${p}=${texNombre(calculANePlusJamaisUtiliser((p * n) / 100))}$`
            texteCorr += `<br>$${p}~\\%~\\text{de }${n}=${texFractionFromString(p, 100)}\\times${n}=${texNombre(calculANePlusJamaisUtiliser(p / 100))}\\times${n}=${texNombre(calculANePlusJamaisUtiliser((p * n) / 100))}$`
            if (p === 60) {
              texteCorr += `<br>$${p}~\\%~\\text{de }${n}$, c'est $50~\\%~\\text{de }${n}$
plus $10 ~\\%~\\text{de }${n} $ soit la moitié de $ ${n} \\text{ plus } 10 ~\\%~\\text{de }${n} $ :
$${p}~\\%~\\text{de }${n}=${n}\\div${2} + ${n}\\div${10} =  ${texNombre(calculANePlusJamaisUtiliser(n * 0.6))}$`
            } else if (p === 90) {
              texteCorr += `<br>$${p}~\\%~\\text{de }${n}$, c'est $${n}$
moins $10 ~\\%~\\text{de }${n} $ :
$${p}~\\%~\\text{de }${n}=${n} - ${n}\\div${10} =  ${texNombre(calculANePlusJamaisUtiliser(n * 0.9))}$`
            } else if (p > 10) {
              texteCorr += `<br>$${p}~\\%~\\text{de }${n}$, c'est $ ${calculANePlusJamaisUtiliser(p / 10)} $ fois $ 10 ~\\%~\\text{de }${n} $ :
$${p}~\\%~\\text{de }${n}= ${calculANePlusJamaisUtiliser(p / 10)} \\times ${n}\\div${10} =  ${texNombre(calculANePlusJamaisUtiliser((p * n) / 100))}$`
            }
          }
      }
      if (context.isHtml && this.interactif) texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline')
      setReponse(this, i, calculANePlusJamaisUtiliser(n * p / 100))
      if (context.isAmc) {
        this.autoCorrection[i].enonce = texte + '='
        this.autoCorrection[i].propositions = [{ texte: texteCorr, statut: '' }]
        this.autoCorrection[i].reponse.param.digits = 3
        this.autoCorrection[i].reponse.param.decimals = 1
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

      if (this.questionJamaisPosee(i, p, n)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      } else cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Niveau de difficulté',
    2,
    ' 1 : Pourcentages 10, 20, 30, 40, 50 \n 2 : Pourcentages 10, 20, 25, 30, 40, 50, 60, 90'
  ]
  this.besoinFormulaire2CaseACocher = ['Plusieurs méthodes']
  this.besoinFormulaire3CaseACocher = ['Exercice à la carte (à paramétrer dans le formulaire suivant)', false]
  this.besoinFormulaire4Texte = ['Choix des pourcentages', `Nombres séparés par des tirets
1 : 10%
2 : 20%
3 : 25%
4 : 30%
5 : 40%
6 : 50%
7 : 60%
8 : 75%
9 : 90%
10 : Mélange`]
}
