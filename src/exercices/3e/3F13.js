/* eslint-disable no-sequences */
import Decimal from 'decimal.js'
import { courbe } from '../../lib/2d/courbes.js'
import { repere } from '../../lib/2d/reperes.js'
import { resolutionSystemeLineaire2x2 } from '../../lib/mathFonctions/outilsMaths.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Lire les antécédents d\'un nombre à partir d\'un graphique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '23/09/2023'
/**
 * Un graphique étant tracé, déterminer les antécédents de nombres donnés.
 * La fonction est un polynôme de degré 1, 2 ou 3 et les nombres des questions ne sont que des entiers.
 * Interactivité et multiples questions ajoutés par J-C Lhote le 23/09/2023
 * @author Rémi Angot
 * 3F13
 */
export const uuid = '8117d'
export const ref = '3F13'
export const refs = {
  'fr-fr': ['3F13'],
  'fr-ch': ['11FA7-4']
}
export default function AntecedentGraphique () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.sup = 2
  this.spacing = 1
  context.isHtml ? this.spacingCorr = 3 : this.spacingCorr = 1
  this.nbQuestions = 1
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  // this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    let a, b, c, x1, x2, x3, fx1, fx2, fx3, texte, texteCorr, f
    let indexInteractif = 0
    let incrementInteractif
    this.sup = Number(this.sup)
    for (let i = 0; i < this.nbQuestions;) {
      const initialiseVariables = function () {
        if (context.isHtml) { // repère -10 || 10
          x1 = randint(-6, -3)
          x2 = randint(x1 + 3, 2)
          x3 = randint(1, 8)
          fx1 = randint(-5, 5)
          fx2 = randint(-6, 6, fx1)
          fx3 = randint(-5, 5)
          c = randint(-5, 5)
        } else { // repère -5 || 5
          x1 = randint(-4, -2)
          x2 = randint(-1, 2, [0])
          x3 = randint(1, 4)
          fx1 = randint(-4, 4)
          fx2 = randint(-4, 4, fx1)
          fx3 = randint(-4, 4)
          c = randint(-3, 3)
        }
      }

      initialiseVariables()
      texte = 'On a tracé ci-dessous la courbe représentative de la fonction $f$.<br>'
      const choix = this.sup === 1 ? 1 : this.sup === 2 ? 2 : i % 2 + 1
      if (choix === 1) {
        a = new Decimal(fx2 - fx1).div(x2 - x1)
        b = a.mul(x1).sub(fx1)
        f = x => a * x - b
        texte += `Déterminer par lecture graphique les antécédents de $${fx1}$ et de $${fx2}$ par cette fonction $f$.<br><br>`
        texte += ajouteChampTexteMathLive(this, indexInteractif, '', { texteAvant: `Le ou les antécédents de $${fx1}$ (séparer les nombres avec un point-virgule) :` })
        texte += ajouteChampTexteMathLive(this, indexInteractif + 1, '', { texteAvant: `<br>Le ou les antécédents de $${fx2}$ (séparer les nombres avec un point-virgule) :` })
        setReponse(this, indexInteractif, x1, { formatInteractif: 'calcul' })
        setReponse(this, indexInteractif + 1, x2, { formatInteractif: 'calcul' })
        incrementInteractif = 2
        texteCorr = `L'antécédent de $${fx1}$ est $${x1}$, on note $f(${x1})=${fx1}$.<br>`
        texteCorr += `L'antécédent de $${fx2}$ est $${x2}$, on note $f(${x2})=${fx2}$.`
      } else if (choix === 2) {
        if (randint(1, 4) < 2) { // une fois sur 4 il n'y a qu'un seul antécédent
          const x0 = randint(-2, 2)
          let fx0 = randint(-4, 4)
          if (!context.isHtml) {
            fx0 = randint(-2, 2)
          }
          a = randint(-3, 3, 0)
          texte += `Déterminer par lecture graphique le (ou les) antécédent(s) de $${fx0}$ par cette fonction $f$.<br><br>`
          texte += ajouteChampTexteMathLive(this, indexInteractif, '', { texteAvant: `Le ou les antécédents de ${fx0} (séparer les nombres avec un point-virgule) :` })
          setReponse(this, indexInteractif, x0, { formatInteractif: 'calcul' })
          incrementInteractif = 1
          texteCorr = `$${fx0}$ a un unique antécédent $${x0}$, on note $f(${x0})=${fx0}$.<br>`
          f = x => a * (x - x0) ** 2 + fx0
        } else {
          fx3 = fx1;
          [a, b] = resolutionSystemeLineaire2x2(x1, x3, fx1, fx3, c)
          while (Number.isNaN(a) || Number.isNaN(b) === 0 || a === 0) {
            x1 = randint(-4, -1)
            x3 = randint(1, 4)
            fx1 = randint(-7, 7)
            fx3 = fx1
            c = randint(-6, 6);
            [a, b] = resolutionSystemeLineaire2x2(x1, x3, fx1, fx3, c)
          }
          x2 = 0
          fx2 = c
          f = x => a * x ** 2 + b * x + c
          texte += `Déterminer par lecture graphique le (ou les) antécédent(s) de $${fx1}$ par cette fonction $f$.<br><br>`
          texte += ajouteChampTexteMathLive(this, indexInteractif, '', { texteAvant: `Le ou les antécédents de ${fx1} (séparer les nombres avec un point-virgule) :` })
          setReponse(this, indexInteractif, [`${x1};${x3}`, `${x3};${x1}`], { formatInteractif: 'texte' })
          incrementInteractif = 1
          texteCorr = `$${fx1}$ a deux antécédents $${x1}$ et $${x3}$, on note $f(${x1})=f(${x3})=${fx1}$.<br>`
        }
      }
      const r = repere({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })
      const Cf = courbe(f, { repere: r, step: 0.2, color: 'purple' })
      texte += mathalea2d({ xmin: -10, xmax: 10, ymin: -10, ymax: 10, scale: 0.5 }, r, Cf)
      if (this.questionJamaisPosee(i, a, fx1)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        indexInteractif += incrementInteractif
        i++
      }
    }

    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Type de fonctions', 3, '1 : Affine\n2 : Polynôme du 2nd degré\n3 : Mélange']
}
