import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { context } from '../../modules/context'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const dateDePublication = '28/09/22'
export const titre = 'Trouver une valeur approchée ou un arrondi d\'un décimal'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * * Arrondir_un_decimal_selon_une_precision_donnée
 * * 6N31-6
 * @author Mickael Guironnet
 */
export const ref = '6N31-6'
export const refs = {
  'fr-fr': ['6N31-6'],
  'fr-ch': ['9NO7-9']
}
export const uuid = 'd2b82'

export default class ArrondirUnDecimal extends Exercice {
  constructor () {
    super()
    this.sup = 7 // Type de questions
    this.nbQuestions = 6

    this.nbCols = 1
    this.nbColsCorr = 1
    context.isHtml ? this.spacing = 1.2 : this.spacing = 1.5
    context.isHtml ? this.spacingCorr = 1.2 : this.spacingCorr = 1.5

    this.besoinFormulaireTexte = [
      'Type de questions', [
        'Nombres séparés par des tirets',
        '1 : Valeur approchée à l\'unité',
        '2 : Valeur approchée au dixième',
        '3 : Valeur approchée au centième',
        '4 : Arrondi à l\'unité',
        '5 : Arrondi au dixième',
        '6 : Arrondi au centième',
        '7 : Mélange'
      ].join('\n')
    ]
  }

  nouvelleVersion = function () {
    this.autoCorrection = []

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 6,
      defaut: 7,
      melange: 7,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    for (let i = 0, indexQ = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      const m = randint(1, 9)
      const c = randint(1, 9)
      const d = randint(1, 9)
      const u = randint(1, 9)
      const di = randint(1, 9)
      const ci = randint(1, 9)
      const mi = randint(1, 9)

      if (!this.questionJamaisPosee(i, m, c, u, di, ci, mi)) {
        continue
      }

      const valeurdegaucheoudroite = randint(1, 2)

      switch (listeTypeDeQuestions[i]) {
        case 6: { // arrondi au centième
          texte = `Donner un arrondi au centième de
                    $${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01 + mi * 0.001))}$ : `
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur01 inline')
          } else {
            texte += '$\\ldots\\ldots\\ldots $'
          }
          const nombreStr = texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + 0 * 0.01 + 0 * 0.001), 3, true).replace('0', miseEnEvidence(ci, 'blue')).replace('0', miseEnEvidence(mi))
          if (mi < 5) {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01)).toString(), compare: fonctionComparaison } })
            texteCorr = `Un arrondi au centième de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01))}$.`
          } else {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + (ci + 1) * 0.01)).toString(), compare: fonctionComparaison } })
            texteCorr = `Un arrondi au centième de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + (ci + 1) * 0.01))}$.`
          }
          indexQ++
          break
        }
        case 5: { // arrondi au dixième
          texte = `Donner un arrondi au dixième de
                    $${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01 + mi * 0.001))}$ : `
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur01 inline')
          } else {
            texte += '$\\ldots\\ldots\\ldots $'
          }
          const nombreStr = texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (0 * 0.1 + 0 * 0.01 + mi * 0.001)).replace('0', miseEnEvidence(di, 'blue')).replace('0', miseEnEvidence(ci))
          if (ci < 5) {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1)).toString(), compare: fonctionComparaison } })
            texteCorr = `Un arrondi au dixième de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1))}$.`
          } else {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + ((di + 1) * 0.1)).toString(), compare: fonctionComparaison } })
            texteCorr = `Un arrondi au dixième de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + ((di + 1) * 0.1))}$.`
          }
          indexQ++
          break
        }
        case 4: { // arrondi à l'unité
          texte = `Donner un arrondi à l'unité de
                    $${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01 + mi * 0.001))}$ : `
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur01 inline')
          } else {
            texte += '$\\ldots\\ldots\\ldots $'
          }
          const nombreStr = texNombre(m * 1000 + c * 100 + d * 10 + u * 0 + (di * 0 + ci * 0.01 + mi * 0.001), 3, true).replace('0', miseEnEvidence(u, 'blue')).replace('0', miseEnEvidence(di))
          if (di < 5) {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1).toString(), compare: fonctionComparaison } })
            texteCorr = `Un arrondi à l'unité de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1)}$.`
          } else {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + (u + 1) * 1).toString(), compare: fonctionComparaison } })
            texteCorr = `Un arrondi à l'unité de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + (u + 1) * 1)}$.`
          }
          indexQ++
          break
        }
        case 3: { // valeur approchée au centième
          texte = `${(valeurdegaucheoudroite === 1 ? 'Donner une valeur par défaut au centième de ' : 'Donner une valeur par excès au centième de ')}
                    $${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01 + mi * 0.001))}$ : `
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur01 inline')
          } else {
            texte += '$\\ldots\\ldots\\ldots $'
          }
          const nombreStr = texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + 0 * 0.01 + mi * 0.001), 3, true).replace('0', miseEnEvidence(ci, 'blue'))
          if (valeurdegaucheoudroite === 1) {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01)).toString(), compare: fonctionComparaison } })
            texteCorr = `Une valeur approchée au centième par défaut de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01))}$`
          } else {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + (ci + 1) * 0.01)).toString(), compare: fonctionComparaison } })
            texteCorr = `Une valeur approchée au centième par excès de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + (ci + 1) * 0.01))}$.`
          }
          indexQ++
          break
        }
        case 2: { // valeur approchée au dixième
          texte = `${(valeurdegaucheoudroite === 1 ? 'Donner une valeur par défaut au dixième de ' : 'Donner une valeur par excès au dixième de ')}
                    $${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01 + mi * 0.001))}$ : `
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur01 inline')
          } else {
            texte += '$\\ldots\\ldots\\ldots $'
          }
          const nombreStr = texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (0 * 0.1 + ci * 0.01 + mi * 0.001), 3, true).replace('0', miseEnEvidence(di, 'blue'))
          if (valeurdegaucheoudroite === 1) {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1)).toString(), compare: fonctionComparaison } })
            texteCorr = `Une valeur approchée au dixième par défaut de de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1))}$.`
          } else {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1 + ((di + 1) * 0.1)).toString(), compare: fonctionComparaison } })
            texteCorr = `Une valeur approchée au dixième par excès de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + ((di + 1) * 0.1))}$`
          }
          indexQ++
          break
        }
        case 1: { // encadrement à l'unité
          texte = `${(valeurdegaucheoudroite === 1 ? 'Donner une valeur par défaut à l\'unité de ' : 'Donner une valeur par excès à l\'unité de ')}
                    $${texNombre(m * 1000 + c * 100 + d * 10 + u * 1 + (di * 0.1 + ci * 0.01 + mi * 0.001))}$ : `
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, indexQ, 'largeur01 inline')
          } else {
            texte += '$\\ldots\\ldots\\ldots $'
          }
          const nombreStr = texNombre(m * 1000 + c * 100 + d * 10 + u * 0 + (di * 0.1 + ci * 0.01 + mi * 0.001), 3, true).replace('0', miseEnEvidence(u, 'blue'))
          if (valeurdegaucheoudroite === 1) {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + u * 1).toString(), compare: fonctionComparaison } })
            texteCorr = `Une valeur approchée à l'unité par défaut de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + u * 1)}$.`
          } else {
            handleAnswers(this, indexQ, { reponse: { value: (m * 1000 + c * 100 + d * 10 + (u + 1) * 1).toString(), compare: fonctionComparaison } })
            texteCorr = `Une valeur approchée à l'unité par excès de $${nombreStr}$ est $ ${texNombre(m * 1000 + c * 100 + d * 10 + (u + 1) * 1)}$.`
          }
          indexQ++
          break
        }
      }

      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
    }
    listeQuestionsToContenu(this)
  }
}
