import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { toString, assignVariables, calculer, toTex, resoudre } from '../../modules/outilsMathjs.ts'
import { GVGraphicView } from '../../modules/aleaFigure/GraphicView.js'
import { name } from '../../modules/aleaFigure/outils.js'
import { create, all } from 'mathjs'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import Grandeur from '../../modules/Grandeur'

export const interactifReady = true
export const interactifType = 'mathLive'

export const math = create(all)

export const titre = 'Trouver périmètre ou aire en résolvant une équation'
export const dateDePublication = '04/03/2022'
export const dateDeModifImportante = '25/09/2024'
/**
 * @author Frédéric PIOU (modifié par EE)
 * Problème à partir de https://twitter.com/blatherwick_sam/status/1497292774621822979
 */
export const uuid = 'cd2f2'
export const ref = '3L13-4'
export const refs = {
  'fr-fr': ['3L13-4'],
  'fr-ch': ['11FA6-9']
}
export default class problemes extends Exercice {
  constructor () {
    super()
    this.sup2 = 1
    this.nbQuestions = 2
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
    this.besoinFormulaire2Numerique = ['Types de valeurs dans l\'équation', 2, '1 - Entiers positifs\n2 - Entiers relatifs']
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    for (let i = 0, solutionDecimale, cpt = 0, exercice = {}; i < this.nbQuestions && cpt < 50;) {
      const numeroquestion = this.nbQuestions % 2 === 0 ? i % 2 + 1 : Math.floor(Math.random() * 2) + 1
      switch (numeroquestion) {
        case 1: {
          const graphic = new GVGraphicView(0, 0, 7, 5)
          const ABCD = graphic.addRectangle()
          const [A, B, C, D] = ABCD.vertices
          const angles = graphic.addAnglesPolygon(A, B, C, D)
          const AB = graphic.addSegment(A, B)
          AB.direct = graphic.addAngle(A, B, C).direct
          const BC = graphic.addSegment(B, C)
          BC.direct = AB.direct
          const CD = graphic.addSegment(C, D)
          const DA = graphic.addSegment(D, A)
          /* let variables = aleaVariables({
            a: this.sup2 !== 1,
            c: this.sup2 !== 1,
            x: this.sup2 !== 1,
            AB: (10 * graphic.distance(A, B)).toFixed(0),
            BC: (10 * graphic.distance(B, C)).toFixed(0),
            b: 'AB-a*x',
            d: 'BC-c*x',
            p: '2*(a*x+b+c*x+d)',
            test: 'a*x+b>0 and c*x+d>0 and a!=c'
          })
          */
          let variables
          do {
            const createVariables = (a, c, x, AB, BC) => ({
              a,
              c,
              x,
              AB,
              BC,
              b: AB - a * x,
              d: BC - c * x
            })

            variables = createVariables(
              randint(1, 10) * (this.sup2 === 1 ? 1 : -1),
              randint(1, 10) * (this.sup2 === 1 ? 1 : -1),
              randint(1, 10) * (this.sup2 === 1 ? 1 : -1),
              Math.round((10 * graphic.distance(A, B))),
              Math.round((10 * graphic.distance(B, C)))
            )
          } while (!(variables.a * variables.x + variables.b > 0 && variables.c * variables.x + variables.d > 0 && variables.a !== variables.c))
          variables.p = 2 * (variables.a * variables.x + variables.b + variables.c * variables.x + variables.d)
          delete variables.x
          const exprAB = toString(assignVariables('a*x+b', variables))
          const exprBC = toString(assignVariables('c*x+d', variables))
          // AB.text = context.isHtml ? `${exprAB}`.replaceAll('*', '') : `$${exprAB}$`.replaceAll('*', '')
          // BC.text = context.isHtml ? `${exprBC}`.replaceAll('*', '') : `$${exprBC}$`.replaceAll('*', '')
          AB.text = `$${exprAB}$`.replaceAll('*', '')
          BC.text = `$${exprBC}$`.replaceAll('*', '')
          const p = variables.p
          const graph = graphic.getFigure(ABCD, AB, BC, ...angles.map(x => { x.right = true; return x }))
          const resolution = resoudre(`${p}=2*(${exprAB}) + 2*(${exprBC})`, { suppr1: false, substeps: this.correctionDetaillee })
          const calculAB = calculer('a*(x)+b'.replace('x', resolution.solution.exact), { name: AB.name, suppr1: false, substeps: this.correctionDetaillee, variables })
          const calculBC = calculer('c*(x)+d'.replace('x', resolution.solution.exact), { name: BC.name, suppr1: false, substeps: this.correctionDetaillee, variables })
          const calculAire = calculer(`${calculAB.result}*${calculBC.result}`, { name: '\\mathcal{A}', suppr1: false, substeps: this.correctionDetaillee, variables })
          solutionDecimale = math.fraction(calculAire.result.replaceAll(' ', '')).valueOf()
          const environ = solutionDecimale === math.round(solutionDecimale, 2) ? '' : 'environ'
          solutionDecimale = math.round(solutionDecimale, 2).toString()
          exercice.texte = name`$${ABCD}$ est un rectangle.

$x$ est un nombre tel que $ {${AB}=${toTex(exprAB)}}$ et $ {${BC}=${toTex(exprBC)}}$ (en $cm$).

Le périmètre de $${ABCD}$ mesure $${p}~cm$.

Déterminer son aire${this.interactif ? (' : ' + ajouteChampTexteMathLive(this, i, 'inline largeur01 unites[Longueurs,Aires,Volumes]', { texteApres: '<em class="ml-2">(Une unité d\'aire est attendue.)</em>' })) : '.'}

${graph}`
          exercice.texteCorr = name`$${ABCD}$ est un rectangle donc ses côtés opposés sont de la même longueur.

D'où $${AB}=${CD}$ et $${BC}=${DA}$.

Ainsi, $${toTex(name`${p} = 2*${AB} + 2*${BC}`)}$.

Ou encore $${toTex(`${p} = 2*(${exprAB}) + 2*(${exprBC})`)}$.

$\textbf{Résolvons cette équation d'inconnue $x$}$.

${resolution.texteCorr}

$\textbf{Calculons $${AB}$ en cm.}$

${calculAB.texteCorr}

$\textbf{Calculons $${BC}$ en cm.}$

${calculBC.texteCorr}

$\textbf{Calculons l'aire $\mathcal{A}$ de $${ABCD}$ en $cm^2$.}$

${calculAire.texteCorr}

Donc l'aire du rectangle $${ABCD}$ est ${environ} $${miseEnEvidence(toTex(solutionDecimale) + '~cm^2')}$.`

          break
        }
        default: {
          const graphic = new GVGraphicView(0, 0, 7, 5)
          const ABCD = graphic.addRectangle()
          const [A, B, C, D] = ABCD.vertices
          const angles = graphic.addAnglesPolygon(A, B, C, D)
          const AB = graphic.addSegment(A, B)
          AB.direct = graphic.addAngle(A, B, C).direct
          const BC = graphic.addSegment(B, C)
          const CD = graphic.addSegment(C, D)
          CD.direct = AB.direct
          const DA = graphic.addSegment(D, A)
          /* const variables = aleaVariables({
            c: this.sup2 !== 1,
            x: this.sup2 !== 1,
            a: this.sup2 !== 1,
            AB: (10 * graphic.distance(A, B)).toFixed(0),
            BC: (10 * graphic.distance(B, C)).toFixed(0),
            b: 'AB-a*x',
            d: 'AB-c*x',
            p: '2*(AB+BC)',
            test: 'a!=c and a*x+b>0'
          }) */
          let variables
          do {
            const createVariables = (a, c, x, AB, BC) => ({
              a,
              c,
              x,
              AB,
              BC,
              b: AB - a * x,
              d: AB - c * x
            })

            variables = createVariables(
              randint(1, 10) * (this.sup2 === 1 ? 1 : -1),
              randint(1, 10) * (this.sup2 === 1 ? 1 : -1),
              randint(1, 10) * (this.sup2 === 1 ? 1 : -1),
              Math.round((10 * graphic.distance(A, B))),
              Math.round((10 * graphic.distance(B, C)))
            )
          } while (!(variables.a !== variables.c && variables.a * variables.x + variables.b > 0))
          variables.p = 2 * (variables.AB + variables.BC)
          delete variables.x
          const exprAB = toString(assignVariables('a*x+b', variables))
          const exprCD = toString(assignVariables('c*x+d', variables))
          // AB.text = context.isHtml ? `${exprAB}`.replaceAll('*', '') : `$${exprAB}$`.replaceAll('*', '')
          // CD.text = context.isHtml ? `${exprCD}`.replaceAll('*', '') : `$${exprCD}$`.replaceAll('*', '')
          AB.text = `$${exprAB}$`.replaceAll('*', '')
          CD.text = `$${exprCD}$`.replaceAll('*', '')
          const p = variables.p
          const graph = graphic.getFigure(ABCD, AB, CD, ...angles.map(x => { x.right = true; return x }))
          const resolution = resoudre(`${exprAB}=${exprCD}`, { suppr1: false, substeps: this.correctionDetaillee })
          const calculAB = calculer('a*(x)+b'.replace('x', resolution.solution.exact), { name: AB.name, suppr1: false, substeps: this.correctionDetaillee, variables })
          const resolution2 = resoudre(name`${p} = 2*${calculAB.result} + 2*${BC}`, { suppr1: false, substeps: this.correctionDetaillee })
          const calculAire = calculer(`${calculAB.result}*${resolution2.solution.exact}`, { name: '\\mathcal{A}', suppr1: false, substeps: this.correctionDetaillee, variables })
          solutionDecimale = math.fraction(calculAire.result.replaceAll(' ', '')).valueOf()
          const environ = solutionDecimale === math.round(solutionDecimale, 2) ? '' : 'environ'
          solutionDecimale = math.round(solutionDecimale, 2).toString()
          exercice.texte = name`$${ABCD}$ est un rectangle.

$x$ est un nombre tel que $ {${AB}=${toTex(exprAB)}}$ et $ {${CD}=${toTex(exprCD)}}$ (en $cm$).

Le périmètre de $${ABCD}$ mesure $${p}~cm$.

Déterminer son aire${this.interactif ? (' : ' + ajouteChampTexteMathLive(this, i, 'inline largeur01 unites[Longueurs,Aires,Volumes]', { texteApres: '<em class="ml-2">(Une unité d\'aire est attendue.)</em>' })) : '.'}

${graph}`
          exercice.texteCorr = name`$${ABCD}$ est un rectangle donc ses côtés opposés sont de la même longueur.

D'où $${AB}=${CD}$ et $${BC}=${DA}$.

Ainsi $${toTex(`${exprAB}=${exprCD}`)}$.

$\textbf{Résolvons l'équation.}$

${resolution.texteCorr}

$\textbf{Calculons $${AB}$ en cm}.$

${calculAB.texteCorr}

Ainsi, $${toTex(name`${p} = 2* (${calculAB.result}) + 2* ${BC}`)}$.

$\textbf{Résolvons cette équation d'inconnue $${BC}$}$.

${resolution2.texteCorr}

$\textbf{Calculons l'aire $\mathcal{A}$ de $${ABCD}$ en $cm^2$.}$

${calculAire.texteCorr}

Donc l'aire du rectangle $${ABCD}$ est ${environ} $${miseEnEvidence(toTex(solutionDecimale) + '~cm^2')}$.`
          break
        }
      }
      exercice.texteCorr = exercice.texteCorr.replace(/\b\d{4,}\b/g, (match) => { // Afin de mettre des espaces dans les grands nombres
        // Convertir le nombre en entier et appliquer texNombre
        const nombre = parseInt(match, 10)
        return texNombre(nombre)
      })
      setReponse(this, i, new Grandeur(solutionDecimale, 'cm^2'), {
        formatInteractif: 'unites',
        precision: 1
      })

      // exercice.texte += numeroquestion
      if (this.questionJamaisPosee(i, i)) {
        this.listeQuestions.push(exercice.texte.replaceAll('\n\n', '<br>'))
        this.listeCorrections.push(exercice.texteCorr.replaceAll('\n\n', '<br>'))
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
