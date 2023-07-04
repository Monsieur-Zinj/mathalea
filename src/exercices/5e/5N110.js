import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import { texPrix } from '../../lib/outils/style.js'
import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint, choice } from '../../modules/outils.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import Decimal from 'decimal.js'
export const titre = 'Variation en pourcentages'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
* Calculer +/- 20, 30, 40 ou 60 %
* @author Rémi Angot
* Rendre l'exercice interactif Laurence Candille
* Date août 2021
* 5N110
*/
export const uuid = 'b2c55'
export const ref = '5N110'
export default function VariationEnPourcentages () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = 'Calculer le nouveau prix. Pour chaque réponse, écrire la valeur décimale.'
  this.nbQuestions = 5
  this.spacing = 1
  this.spacingCorr = 2
  this.nbColsCorr = 1
  this.nbCols = 1
  this.interactifType = 'mathLive'

  this.nouvelleVersion = function () {
    let reponse
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, prix, taux, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      prix = choice([new Decimal(randint(2, 9)),
        new Decimal(randint(1, 9)).mul(10),
        new Decimal(randint(1, 9)).mul(100),
        new Decimal(randint(11, 99)).div(10)])
      // X | X0 | X00 | X,X0
      taux = choice([20, 30, 40, 60])
      if (choice([true, false])) {
        reponse = prix.mul(100 - taux).div(100)
        if (context.isHtml) { // partie html
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix diminue de $${taux}\\, \\%$.<br><br>`
          if (this.interactif) {
            texte += '&ensp;&ensp;&ensp;&ensp;Le nouveau prix est :'
            texte += ajouteChampTexteMathLive(this, i, 'inline largeur25', { texteApres: '€' }) + '<br>'
          }
        } else { // partie latex
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix diminue de $${taux}\\, \\%$.<br><br>`
        }

        texteCorr = `$\\text{Diminution : }${deprecatedTexFraction(taux, 100)}\\times  ${texPrix(prix)} = ${texPrix(prix * taux)}\\div 100=${texPrix(prix * taux / 100)}$ €`
        texteCorr += '<br>'
        texteCorr += `$\\text{Nouveau prix : }${texPrix(prix)}-${texPrix(prix * taux / 100)}=${texPrix(prix - prix * taux / 100)}$ €`
      } else {
        reponse = prix.mul(100 + taux).div(100)
        if (context.isHtml) { // partie html
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix augmente de $${taux}\\ \\%$.<br><br>`
          if (this.interactif) {
            texte += '&ensp;&ensp;&ensp;&ensp;Le nouveau prix est :'
            texte += ajouteChampTexteMathLive(this, i, 'inline largeur25', { texteApres: '€' }) + '<br>'
          }
        } else { // partie latex
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix augmente de $${taux}\\, \\%$.<br><br>`
        }
        texteCorr = `$\\text{Augmentation : }${deprecatedTexFraction(taux, 100)}\\times  ${texPrix(prix)}= ${texPrix(prix * taux)}\\div 100=${texPrix(prix * taux / 100)}$ €`
        texteCorr += '<br>'
        texteCorr += `$\\text{Nouveau prix : }${texPrix(prix)}+${texPrix(prix * taux / 100)}=${texPrix(prix * (1 + taux / 100))}$ €`
      }
      setReponse(this, i, reponse)
      if (this.questionJamaisPosee(i, taux, prix, reponse)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
