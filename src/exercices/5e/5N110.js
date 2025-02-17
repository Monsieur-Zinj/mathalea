import { choice } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { texPrix } from '../../lib/format/style'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Decimal from 'decimal.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Variation en pourcentages'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '16/08/2021'
/**
 * Calculer +/- 20, 30, 40 ou 60 %
 * @author Rémi Angot
 * Rendre l'exercice interactif Laurence Candille
 */
export const uuid = 'b2c55'
export const ref = '5N110'
export const refs = {
  'fr-fr': ['5N110'],
  'fr-ch': ['9NO14-11']
}
export default function VariationEnPourcentages () {
  Exercice.call(this)
  this.consigne = 'Calculer le nouveau prix.'
  this.nbQuestions = 5
  this.spacing = 1
  this.spacingCorr = 2
  this.nbColsCorr = 1
  this.nbCols = 1
  this.interactifType = 'mathLive'

  this.nouvelleVersion = function () {
    let reponse
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
            texte += ajouteChampTexteMathLive(this, i, '', { texteApres: '€' }) + '<br>'
          }
        } else { // partie latex
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix diminue de $${taux}\\, \\%$.<br><br>`
        }

        texteCorr = `$\\text{Diminution : }${texFractionFromString(taux, 100)}\\times  ${texPrix(prix)} = ${texPrix(prix * taux)}\\div 100=${texPrix(prix * taux / 100)}$ €`
        texteCorr += '<br>'
        texteCorr += `$\\text{Nouveau prix : }${texPrix(prix)}-${texPrix(prix * taux / 100)}=${texPrix(prix - prix * taux / 100)}$`
      } else {
        reponse = prix.mul(100 + taux).div(100)
        if (context.isHtml) { // partie html
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix augmente de $${taux}\\ \\%$.<br><br>`
          if (this.interactif) {
            texte += '&ensp;&ensp;&ensp;&ensp;Le nouveau prix est :'
            texte += ajouteChampTexteMathLive(this, i, '', { texteApres: '€' }) + '<br>'
          }
        } else { // partie latex
          texte = `Un article coûtait $${texPrix(prix)}$ € et son prix augmente de $${taux}\\, \\%$.<br><br>`
        }
        texteCorr = `$\\text{Augmentation : }${texFractionFromString(taux, 100)}\\times  ${texPrix(prix)}= ${texPrix(prix * taux)}\\div 100=${texPrix(prix * taux / 100)}$ €`
        texteCorr += '<br>'
        texteCorr += `$\\text{Nouveau prix : }${texPrix(prix)}+${texPrix(prix * taux / 100)}=${texPrix(prix * (1 + taux / 100))}$`
      }
      setReponse(this, i, reponse)
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
      texteCorr += ' €'

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
