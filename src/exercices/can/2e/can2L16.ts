import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { point } from '../../../lib/2d/points'
import { segment } from '../../../lib/2d/segmentsVecteurs'
import { latex2d } from '../../../lib/2d/textes'
import { repere } from '../../../lib/2d/reperes'
import { droiteParPointEtPente } from '../../../lib/2d/droites'
import { sqrt } from 'mathjs'
import { mathalea2d } from '../../../modules/2dGeneralites'
import { courbe } from '../../../lib/2d/courbes'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Résoudre une inéquation du type $\\sqrt{x}<k$ ou $\\sqrt{x}>k$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '18/05/2024'
export const uuid = 'bdc96'
export const refs = {
  'fr-fr': ['can2L16'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class EquationsRacCarree extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierEnsemble
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { texteSansCasse: true, intervalle: true }
  }

  nouvelleVersion () {
    let reponse
    const a = randint(1, 12)
    const o = latex2d('\\text{O}', -0.2, -0.3, { color: 'black', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte1 = latex2d(`y=${a}`, 4, 1.2, { color: 'green', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte2 = latex2d('y=\\sqrt{x}', 3, 2.3, { color: 'blue', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte3 = latex2d(`${a ** 2}`, 2.25, -0.6, { color: 'red', letterSize: 'scriptsize', backgroundColor: '' })
    const A = point(2.25, 1.5)
    const Ax = point(A.x, 0)
    const sAAx = segment(A, Ax)
    const O = point(0, 0)
    const sAxBx = segment(O, Ax, 'red')
    const f = (x: number) => sqrt(x)
    const Cg = droiteParPointEtPente(point(0, 1.5), 0, '', 'green')
    const r1 = repere({
      xMin: -1,
      yMin: -1,
      yMax: 4,
      xMax: 5,
      xUnite: 1,
      yUnite: 1,
      axeXStyle: '->',
      axeYStyle: '->',
      grilleX: false,
      grilleY: false,
      xThickListe: [0],
      yThickListe: [0],
      xLabelListe: [-6],
      yLabelListe: [-6]

    })
    switch (choice([1, 2])) {
      case 1 :// sqrt(x)<k
        { const choix = choice([true, false])
          sAAx.epaisseur = 2
          // @ts-expect-error problème typage pointilles à revoir
          sAAx.pointilles = 5
          sAxBx.epaisseur = 2
          sAxBx.tailleExtremites = 6
          sAxBx.styleExtremites = choix ? '[-[' : '[-]'

          Cg.epaisseur = 2
          const graphiqueC = mathalea2d({
            xmin: -2,
            xmax: 6,
            ymin: -1,
            ymax: 4,
            pixelsParCm: 30,
            scale: 0.7
          }, courbe(f, {
            repere: r1,
            color: 'blue',
            epaisseur: 2
          }), Cg
          , r1, sAAx, o, sAxBx, Texte1, Texte2, Texte3)
          reponse = choix ? `[0;${a ** 2}[` : `[0;${a ** 2}]`
          this.reponse = { reponse: { value: reponse, compare: fonctionComparaison, options: { intervalle: true } } }
          this.question = `Donner l'ensemble $S$ des solutions de  l'inéquation $\\sqrt{x}${choix ? '<' : ' \\leqslant '}${a}$.`
          this.correction = 'Pour résoudre cette inéquation, on peut imaginer le graphique correspondant à la situation : <br>'
          this.correction += `${graphiqueC}`
          this.correction += `L'ensemble des solutions de l'inéquation $\\sqrt{x}${choix ? '<' : ' \\leqslant '}${a}$ est :
            ${choix ? `$${miseEnEvidence(`[0\\,;\\,${a ** 2}[`)}$.` : `$${miseEnEvidence(`[0\\,;\\,${a ** 2}]`)}$.`}`
        }
        break
      case 2 :// sqrt(x)>k
        {
          const choix = choice([true, false])
          sAAx.epaisseur = 2
          // @ts-expect-error problème typage pointilles à revoir
          sAAx.pointilles = 5
          const AxI = point(4, 0)
          const sAxAxI = segment(Ax, AxI, 'red')
          sAxAxI.epaisseur = 2
          sAxAxI.styleExtremites = choix ? ']-' : '[-'
          sAxAxI.tailleExtremites = 6
          Cg.epaisseur = 2
          const graphiqueC = mathalea2d({
            xmin: -2,
            xmax: 6,
            ymin: -1,
            ymax: 4,
            pixelsParCm: 30,
            scale: 0.7
          }, courbe(f, {
            repere: r1,
            color: 'blue',
            epaisseur: 2
          }),
          Cg
          , r1, o, sAAx, sAxAxI, Texte1, Texte2, Texte3)
          reponse = choix ? `]${a ** 2};+\\infty[` : `[${a ** 2};+\\infty[`
          this.reponse = { reponse: { value: reponse, compare: fonctionComparaison, options: { intervalle: true } } }
          this.question = `Donner l'ensemble $S$ des solutions de  l'inéquation : $\\sqrt{x}${choix ? '>' : ' \\geqslant '}${a}$.`
          this.correction = 'Pour résoudre cette inéquation, on peut imaginer le graphique correspondant à la situation : <br>'
          this.correction += `${graphiqueC}<br>`
          this.correction += `L'ensemble des solutions de l'inéquation 
        $\\sqrt{x}${choix ? '>' : ' \\geqslant '}${a}$ est : 
        ${choix ? `$${miseEnEvidence(`]${a ** 2}\\,;\\,+\\infty[`)}$` : `$${miseEnEvidence(`[${a ** 2}\\,;\\,+\\infty[`)}$`}.`
        }
        break
    }
    if (this.interactif) {
      this.question += `<br>
  $S=$`
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = '\\hspace{-2.5cm}$S=\\ldots$'
  }
}
