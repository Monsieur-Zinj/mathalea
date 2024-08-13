import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { point } from '../../../lib/2d/points'
import { segment } from '../../../lib/2d/segmentsVecteurs'
import { latex2d } from '../../../lib/2d/textes'
import { repere } from '../../../lib/2d/reperes'
import { droite } from '../../../lib/2d/droites'
import { mathalea2d } from '../../../modules/2dGeneralites'
import { courbe } from '../../../lib/2d/courbes'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Résoudre une inéquation du type $x^2<k$ ou $x^2>k$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '04/05/2024'
export const uuid = '1f55b'
export const refs = {
  'fr-fr': ['can2L15'],
  'fr-ch': []
}
/**
 * @author Gilles Mora
*/
export default class EquationsCarree extends Exercice {
  constructor () {
    super()
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierEnsemble
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    let reponse
    const a = randint(1, 12)
    const o = latex2d('\\text{O}', -0.2, -0.3, { color: 'black', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte1 = latex2d(`y=${a ** 2}`, 4, 2.7, { color: 'green', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte2 = latex2d('y=x^2', 3, 4.5, { color: 'blue', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte3 = latex2d(`-${a}`, -1.73, -0.6, { color: 'red', letterSize: 'scriptsize', backgroundColor: '' })
    const Texte4 = latex2d(`${a}`, 1.73, -0.6, { color: 'red', letterSize: 'scriptsize', backgroundColor: '' })
    const A = point(1.73, 3)
    const Ax = point(A.x, 0)
    const sAAx = segment(A, Ax)
    const B = point(-1.73, 3)
    const Bx = point(B.x, 0)
    const sBBx = segment(B, Bx)
    const f = (x: number): number => x ** 2
    const Cg = droite(point(-6, 3), point(6, 3), '', 'green')
    switch (choice([1, 2])) {
      case 1 :// x^2<k
        { const choix = choice([true, false])
          sAAx.epaisseur = 2
          sAAx.pointilles = '5'
          sBBx.epaisseur = 2
          sBBx.pointilles = '5'
          const sAxBx = segment(Bx, Ax, 'red')
          sAxBx.epaisseur = 2
          sAxBx.styleExtremites = choix ? ']-[' : '[-]'
          sAxBx.tailleExtremites = 6
          const r1 = repere({
            xMin: -4,
            yMin: -1,
            yMax: 5,
            xMax: 4,
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
          Cg.epaisseur = 2
          const graphiqueC = mathalea2d({
            xmin: -6,
            xmax: 6,
            ymin: -1.5,
            ymax: 5,
            pixelsParCm: 30,
            scale: 1
          }, courbe(f, {
            repere: r1,
            color: 'blue',
            epaisseur: 2
          }), Cg
          , r1, o, sAAx, sBBx, sAxBx, Texte1, Texte2, Texte3, Texte4)
          reponse = choix ? `]-${a};${a}[` : `[-${a};${a}]`
          this.question = `Donner l'ensemble $S$ des solutions de  l'inéquation $x^2${choix ? '<' : ' \\leqslant '}${a ** 2}$.`
          this.correction = 'Pour résoudre cette inéquation, on peut imaginer le graphique correspondant à la situation : <br>'
          this.correction += `${graphiqueC}`
          this.correction += `L'ensemble des solutions de l'inéquation $x^2${choix ? '<' : ' \\leqslant '}${a ** 2}$ est :
            ${choix ? `$${miseEnEvidence(`]${-a}\\,;\\,${a}[`)}$.` : `$${miseEnEvidence(`[${-a}\\,;\\,${a}]`)}$.`}`
        }
        break
      case 2 :// x^2>k
        {
          const choix = choice([true, false])
          sAAx.epaisseur = 2
          sAAx.pointilles = '5'
          sBBx.epaisseur = 2
          sBBx.pointilles = '5'
          const BxI = point(-4, 0)
          const sBxBxI = segment(BxI, Bx, 'red')
          sBxBxI.epaisseur = 2
          sBxBxI.styleExtremites = choix ? '-[' : '-]'
          sBxBxI.tailleExtremites = 6
          const AxI = point(4, 0)
          const sAxAxI = segment(Ax, AxI, 'red')
          sAxAxI.epaisseur = 2
          sAxAxI.styleExtremites = choix ? ']-' : '[-'
          sAxAxI.tailleExtremites = 6
          const r1 = repere({
            xMin: -4,
            yMin: -1,
            yMax: 5,
            xMax: 4,
            xUnite: 1,
            yUnite: 1,
            axeXStyle: '->',
            axeYStyle: '->',
            grilleX: false,
            grilleY: false,
            xThickListe: [-6],
            yThickListe: [-6],
            xLabelListe: [-6],
            yLabelListe: [-6]
          })

          Cg.epaisseur = 2
          const graphiqueC = mathalea2d({
            xmin: -5,
            xmax: 6,
            ymin: -1.5,
            ymax: 5.5,
            pixelsParCm: 30,
            scale: 1
          }, courbe(f, {
            repere: r1,
            color: 'blue',
            epaisseur: 2
          }),
          Cg
          , r1, o, sAAx, sBBx, sAxAxI, sBxBxI, Texte1, Texte2, Texte3, Texte4)
          reponse = choix ? `]-\\infty;${-a}[\\cup]${a};+\\infty[` : `]-\\infty;${-a}]\\cup[${a};+\\infty[`
          this.question = `Donner l'ensemble $S$ des solutions de  l'inéquation : $x^2${choix ? '>' : ' \\geqslant '}${a ** 2}$.`
          this.correction = 'Pour résoudre cette inéquation, on peut imaginer le graphique correspondant à la situation : <br>'
          this.correction += `${graphiqueC}<br>`
          this.correction += `L'ensemble des solutions de l'inéquation 
        $x^2${choix ? '>' : ' \\geqslant '}${a}$ est : 
        ${choix ? `$${miseEnEvidence(`]-\\infty\\,;\\,-${a}[\\cup ]${a}\\,;\\, +\\infty[`)}$` : `$${miseEnEvidence(`]-\\infty\\,;\\,-${a}]\\cup [${a}\\,;\\, +\\infty[`)}$`}.`
        }
        break
    }
    this.reponse = {
      reponse: {
        value: reponse,
        compare: fonctionComparaison,
        options: { intervalle: true }
      }
    }
    if (this.interactif) {
      this.question += `<br>
  $S=$`
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = '\\hspace{-2.5cm}$S=\\ldots$'
  }
}
