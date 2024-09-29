import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import { nombreEnLettres } from '../../modules/nombreEnLettres.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteChampTexte } from '../../lib/interactif/questionMathLive.js'
import { setReponse, handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const dateDeModifImportante = '08/09/2024'
export const titre = 'Écrire un nombre décimal en chiffres ou en lettres'
export const amcReady = true
export const amcType = 'AMCNum'
// export const interactifReady = true // EE : J'enlève l'interactivité car elle a été mal codée. Faudrait le refaire avec des remplisLesBlancs ou Drag & Drop
// export const interactifType = 'mathLive'

/**
 * Lire un nombre / écrire un nombre : passer d'une écriture à une autre et inversement
 * On peut fixer la classe maximale : unités, milliers, millions, milliards
 * @author Jean-Claude Lhote
 */

export const uuid = '5eb83'
export const ref = '6N23-0'
export const refs = {
  'fr-fr': ['6N23-0'],
  'fr-ch': ['9NO7-10']
}
export default function ÉcrireNombresDecimal () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.sup2 = 1
  this.sup3 = 3
  this.nouvelleVersion = function () {
    let formatEcriture = []
    if (this.sup === 1) {
      formatEcriture = combinaisonListes([true], this.nbQuestions)
    } else if (this.sup === 2) {
      formatEcriture = combinaisonListes([false], this.nbQuestions)
    } else {
      formatEcriture = combinaisonListes([false, true], this.nbQuestions)
    }
    if (context.isAmc) {
      formatEcriture = combinaisonListes([false], this.nbQuestions)
      this.sup2 = 1
    }
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const typesDeQuestionsDemandees = this.sup2 + 1 // <1 000, <1 000 000)
    let typesDeQuestionsDisponibles
    if (this.sup3 === 1) {
      typesDeQuestionsDisponibles = [2]
    } else if (this.sup3 === 2) {
      typesDeQuestionsDisponibles = [1]
    } else {
      typesDeQuestionsDisponibles = [1, 2]
    }
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    for (
      let i = 0, texte, texteCorr, a, b, c, type, nombre, tranche, partEnt, partDec, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      type = listeTypeDeQuestions[i]
      nombre = 0
      tranche = []
      while (nombre === 0) {
        tranche.splice(0)
        partEnt = 0
        partDec = 0
        for (let j = 0; j < typesDeQuestionsDemandees; j++) {
          a = randint(1, 9)
          b = randint(1, 9)
          c = randint(1, 9)
          tranche.push(choice([0, 100, 20, 80, a, a * 100, a * 100 + b * 10 + c, a * 100 + 80 + b, a * 10, a * 100 + b * 10 + 1]))
        }
        for (let j = 1; j < typesDeQuestionsDemandees; j++) {
          partEnt += tranche[j] * 10 ** ((j - 1) * 3)
        }
        partDec = tranche[0]
        nombre = calculANePlusJamaisUtiliser(partEnt + partDec / 1000, 3)
        if (tranche[1] < 2) nombre = 0
        if (tranche[0] === 0) nombre = 0
      }
      if (formatEcriture[i]) {
        if (context.vue !== 'diap') {
          texte = `Écris le nombre $${texNombre(nombre)}$ en lettres ${type === 2 ? 'en utilisant le mot virgule' : 'sans utiliser le mot virgule'} : ${this.interactif ? ajouteChampTexte(this, i, 'largeur01 inline') : '\\dotfill'}`
        } else texte = `$${texNombre(nombre)}$`
        if (context.vue !== 'diap') {
          texteCorr = `$${texNombre(nombre)}$ : ${nombreEnLettres(nombre, type)}.`
        } else {
          texteCorr = `${nombreEnLettres(nombre, type)}.`
        }
        handleAnswers(this, i, { reponse: { value: nombreEnLettres(200.3, 1), compare: fonctionComparaison, options: { texteSansCasse: true } } })
      } else {
        if (context.vue !== 'diap') {
          texte = `Écris le nombre ${nombreEnLettres(nombre, type)} en chiffres :  ${this.interactif ? ajouteChampTexteMathLive(this, i, 'largeur01 inline') : '\\dotfill'}`
        } else {
          texte = ` ${nombreEnLettres(nombre, type)}`
        }
        if (context.vue !== 'diap') {
          texteCorr = ` ${nombreEnLettres(nombre, type)} : $${texNombre(nombre)}$.`
        } else {
          texteCorr = `$${texNombre(nombre)}$.`
        }
        setReponse(this, i, nombre, { formatInteractif: 'calcul' })
      }

      texte = texte.replace('et-un unités', 'et-une unités')
      texteCorr = texteCorr.replace('et-un unités', 'et-une unités')
      if (context.isAmc) {
        this.autoCorrection[i].reponse.param.digits = 6
        this.autoCorrection[i].reponse.param.decimals = 3
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
  this.besoinFormulaireNumerique = ['Type de questions', 3, '1 : Écrire en lettres un nombre donné en chiffres\n2 : Écrire en chiffres un nombre donné en lettres\n3 : Mélange']
  this.besoinFormulaire2Numerique = ['Classe maximum', 2, '1 : Unités\n2 : Milliers']
  this.besoinFormulaire3Numerique = ['Type d\'écriture', 3, '1 : Écriture avec le mot virgule\n2 : Ériture sans le mot virgule\n3 : Mélange']
}
