import { choice } from '../../lib/outils/arrayOutils'
import { egalOuApprox } from '../../lib/outils/ecritures'
import { texPrix } from '../../lib/format/style'
import { arrondi } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Résoudre des problèmes de courses au marché'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * On achète 2 aliments dont on connaît la masse (un en grammes et l'autre en kilogrammes) et le prix au kilogramme. Il faut calculer le prix total.
 * @author Rémi Angot
 * Référence 6C32
 */
export const uuid = '96b94'
export const refs = {
  'fr-fr': ['6C32'],
  'fr-ch': ['9FA3-7']
}
export default function ProblemeCourse () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.spacing = 2
  this.spacingCorr = 2
  // Modification de l'exercice pour avoir plusieurs question. On peut revenir à la version initiale en décommentant. Jean-Claude Lhote
  this.nbQuestions = 1
  // this.nbQuestionsModifiable = false
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = false
  // this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const prenom = choice([
        'Benjamin',
        'Léa',
        'Aude',
        'Julie',
        'Corinne',
        'Mehdi',
        'Joaquim'
      ])
      let masseEnKgDeAliment1
      if (this.sup) {
        masseEnKgDeAliment1 = randint(2, 5)
      } else {
        masseEnKgDeAliment1 =
        randint(2, 5) + randint(1, 9) / 10
      }
      const prixAliment1 = randint(2, 4) + randint(1, 9) / 10
      const aliment1 = choice(['courgettes', 'carottes', 'pommes'])
      let masseEnGdeAliment2

      let prixAliment2
      if (this.sup) {
        prixAliment2 = randint(15, 25)
        masseEnGdeAliment2 = randint(2, 7) * 500
      } else {
        prixAliment2 = randint(12, 23) + randint(1, 9) / 10
        masseEnGdeAliment2 = randint(21, 97) * 10
      }
      const aliment2 = choice(['bœuf', 'veau', 'poulet'])
      const prixTotalAliment1 = masseEnKgDeAliment1 * prixAliment1
      const prixTotalAliment2 = (masseEnGdeAliment2 * prixAliment2) / 1000
      const prixTotal = prixTotalAliment1 + prixTotalAliment2
      const masseEnKgDeAliment2 = masseEnGdeAliment2 / 1000
      let texte = `${prenom} achète $${texNombre(masseEnKgDeAliment1, 3)}$ kg de ${aliment1} à $${texPrix(prixAliment1)}$ €/kg `
      texte += `et $${texNombre(masseEnGdeAliment2, 0)}$ g de ${aliment2} à $${texPrix(prixAliment2)}$ €/kg. Quel est le prix total à payer ?`
      let texteCorr = `Prix des ${aliment1} : $${texNombre(masseEnKgDeAliment1, 3)}\\text{ kg} \\times ${texPrix(prixAliment1)}$ €/kg $ = ${texPrix(prixTotalAliment1)}$ €<br>`
      texteCorr += `Prix du ${aliment2} : $${texNombre(masseEnKgDeAliment2, 3)}\\text{ kg} \\times ${texPrix(prixAliment2)}$ €/kg $${egalOuApprox(prixTotalAliment2, 2)} ${texPrix(prixTotalAliment2)}$ €<br>`
      texteCorr += `Prix total à payer : $${texPrix(prixTotalAliment1)}$ € + $${texPrix(prixTotalAliment2)}$ € `
      texteCorr += `$${egalOuApprox(prixTotal, 2)} ${texNombre(prixTotal, 2, true)}$ €<br>`
      texteCorr += `<br><i>Le prix total aurait aussi pu être trouvé en un seul calcul</i> : $${texNombre(masseEnKgDeAliment1, 2)} \\text{ kg} \\times ${texPrix(prixAliment1)}$ €/kg + $${texNombre(masseEnKgDeAliment2, 3)} \\text{ kg} \\times ${texPrix(prixAliment2)}$ €/kg `
      texteCorr += `$${egalOuApprox(prixTotal, 2)} ${texNombre(prixTotal, 2, true)}$ €<br>`
      if (!context.isHtml) {
        texteCorr = `Prix des ${aliment1} : $${texNombre(masseEnKgDeAliment1, 3)}\\text{ kg}\\times${texPrix(prixAliment1)}\\text{ \\euro{}/kg} = ${texPrix(prixTotalAliment1)}\\text{ \\euro}$` + '<br>'
        texteCorr += `Prix du ${aliment2} : $${texNombre(masseEnKgDeAliment2, 3)}\\text{ kg}\\times${texPrix(prixAliment2)}\\text{ \\euro{}/kg} ${egalOuApprox(prixTotalAliment2, 2)} ${texPrix(prixTotalAliment2)}\\text{ \\euro}$` + '<br>'
        texteCorr += `Prix total à payer : $${texPrix(prixTotalAliment1)}\\text{ \\euro} + ${texPrix(prixTotalAliment2)}\\text{ \\euro}`
        texteCorr += `${egalOuApprox(prixTotal, 2)} ${texPrix(prixTotal)}\\text{ \\euro}$<br>`
      }

      // Pour tolérer l'écriture d'un somme avec des centimes, par exemple 54,1 € ou 54,10 €
      const reponse = prixTotal.toFixed(2)
      setReponse(this, i, reponse)
      if (context.isAmc) {
        this.autoCorrection[i].reponse.valeur[0] = arrondi(prixTotal, 2)
        this.autoCorrection[i].reponse.param.digits = 5
        this.autoCorrection[i].reponse.param.decimals = 2
      }
      if (this.interactif) {
        texte += `<br> ${ajouteChampTexteMathLive(this, i, 'largeur20 inline', {
                texteApres: ' €',
                texte: 'Le prix total à payer sera de '
            })}`
      }
      if (this.questionJamaisPosee(i, reponse, masseEnKgDeAliment1, masseEnKgDeAliment2)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Calculs faciles']
}
