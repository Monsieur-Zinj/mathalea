import { courbe } from '../../lib/2d/courbes.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { tableauDeVariation } from '../../lib/mathFonctions/etudeFonction.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, reduireAxPlusB, rienSi1 } from '../../lib/outils/ecritures'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { sp } from '../../lib/outils/outilString.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'

export const dateDeModifImportante = '06/07/2023'
export const titre = 'Déterminer le signe d\'une fonction affine'

/**
 * @author Stéphane Guyon+Gilles Mora
 * 2F10-3
 */
export const uuid = '03b71'
export const ref = '2F10-5'
export const refs = {
  'fr-fr': ['2F10-5'],
  'fr-ch': []
}
export default function Signefonctionaffine () {
  Exercice.call(this)
  this.consigne = ''
  this.nbQuestions = 1 // On complète le nb de questions
  this.nbCols = 1
  this.nbColsCorr = 1
  this.video = ''
  this.spacing = 1
  this.spacingCorr = 1
  this.sup = 1
  this.sup2 = 1
  this.correctionDetaillee = false
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    const listeFractions = [
      [10, 9],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 5],
      [5, 6],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [3, 8],
      [5, 8],
      [7, 8],
      [4, 9],
      [5, 9],
      [7, 9],
      [8, 9],
      [7, 10],
      [9, 10],
      [5, 3],
      [7, 3],
      [9, 4],
      [5, 4],
      [6, 5],
      [7, 5],
      [7, 4],
      [10, 9],
      [8, 7],
      [8, 3],
      [11, 7],
      [7, 6],
      [10, 3]
    ]
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1] // coef de x = 1
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2] // coef de x > 1
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2] // coef de x positif, difference au carrée.
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, ligne1, texte, texteCorr, cpt = 0, fraction = [], typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1: {
          const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          const a = randint(1, 5) * choice([-1, 1])
          const b = randint(0, 3) * choice([-1, 1])// coefficient b de la fonction affine
          fraction = choice(listeFractions)
          const zero = new FractionEtendue(-b, a).simplifie()
          texte = `Dresser le tableau de signe de la fonction $f$ définie sur $\\mathbb R$ par $f(x)=${reduireAxPlusB(a, b)}$.`
          if (context.isHtml) { texteCorr = `${texteEnCouleurEtGras('Dans cet exercice, deux corrections différentes sont proposées.')}<br>` } else { texteCorr = '' }
          if (this.sup2 === 1) {
            texteCorr += `$f(x)$ est de la forme $ax+b$, $f$ est donc une fonction affine avec pour coefficient directeur  $a=${a}$ ${a < 0 ? ' (négatif).' : ' (positif).'}<br>
             D'où, $f$ est une fonction ${a < 0 ? ' décroissante,' : ' croissante,'} c'est-à-dire que lorsque $x$ augmente, $f(x)$ ${a < 0 ? ' diminue.' : ' augmente.'} <br>
             Par conséquent, les valeurs de $f(x)$ sont d'abord ${a < 0 ? 'positives' : 'négatives'} puis ${a < 0 ? 'négatives' : 'positives'}.<br><br>
             Aussi, $${reduireAxPlusB(a, b)}=0 \\iff x=${zero.texFSD}$.<br><br>`
          }
          if (this.sup2 === 2) {
            texteCorr += `Résolution de l'inéquation $${reduireAxPlusB(a, b)}>0$ : <br>`
            if (b === 0) {
              texteCorr += `$\\begin{aligned}
${reduireAxPlusB(a, b)}&>0\\\\
${a !== 1 ? `x& ${a < 0 ? `${miseEnEvidence(`${sp(1.5)}\\boldsymbol{<}${sp(1.5)}`)}` : '>'}${zero.texFSD}` : ''}${a < 0 ? `${miseEnEvidence(`${sp(5)}\\text{car} ${a} <0`)}` : ''}
\\end{aligned}$<br>`
              texteCorr += `De plus, $${reduireAxPlusB(a, b)}=0\\iff x=${zero.texFSD}$.<br><br>`
            } else {
              texteCorr += `$\\begin{aligned}
  ${reduireAxPlusB(a, b)}&>0\\\\
  ${rienSi1(a)}x&>${-b}\\\\
  ${a !== 1 ? `x& ${a < 0 ? `${miseEnEvidence(`${sp(1.5)}\\boldsymbol{<}${sp(1.5)}`)}` : '>'}${zero.texFSD}` : ''}${a < 0 ? `${miseEnEvidence(`${sp(5)}\\text{car} ${a} <0`)}` : ''}
  \\end{aligned}$<br>`
              texteCorr += `De plus, $${reduireAxPlusB(a, b)}=0\\iff x=${zero.texFSD}$.<br><br>`
            }
          }
          if (a > 0) {
            ligne1 = ['Line', 25, '', 0, '-', 20, 'z', 20, '+']
          } else {
            ligne1 = ['Line', 25, '', 0, '+', 20, 'z', 20, '-']
          }
          texteCorr += ' D\'où le tableau de signes suivant :<br>'
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 3, 25], [`$f(x)=${reduireAxPlusB(a, b)}$`, 2, 50]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              ['$-\\infty$', 20, `$${zero.texFSD}$`, 20, '$+\\infty$', 30]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [ligne1],
            colorBackground: '',
            espcl: 3.5, // taille en cm entre deux antécédents
            deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 8, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          })
          const f = x => a * x + b
          const monRepere = repere({
            xMin: -8,
            xMax: 8,
            yMin: -7,
            yMax: 7,
            yLabelEcart: 0.8,
            yLabelDistance: 2,
            xLabelDistance: 2,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -7,
            grilleSecondaireYMax: 7,
            grilleSecondaireXMin: -8,
            grilleSecondaireXMax: 8
          })
          const maCourbe = courbe(f, { repere: monRepere, color: 'blue' })
          const A = point(-b / a, 0, '')

          const lA = labelPoint(A, 'red')
          const tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
          tA.taille = 5
          tA.epaisseur = 5
          const objets = []
          objets.push(maCourbe, lA, monRepere, o, tA)
          texteCorr += `<br>Sur la figure ci-dessous, l'abscisse du point rouge est $${zero.texFSD}$.<br>
            ` + mathalea2d({ xmin: -8, xmax: 8, ymin: -7, ymax: 7, scale: 0.5, style: 'margin: auto' }, objets)
        }
          break

        case 2: {
          const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          const b = randint(0, 3) * choice([-1, 1])// coefficient b de la fonction affine
          fraction = choice(listeFractions)
          const ns = fraction[0] * choice([-1, 1])
          const ds = fraction[1]
          const a = new FractionEtendue(ns, ds).simplifie()
          const aInverse = new FractionEtendue(ns, ds).simplifie().inverse()
          const zero = new FractionEtendue(-b * ds, ns).simplifie()
          texte = `Dresser le tableau de signe de la fonction $f$ définie sur $\\mathbb R$ par ${b === 0 ? `$f(x)=${a.texFSD}x$` : `$f(x)=${a.texFSD}x${ecritureAlgebrique(b)}$`}. <br>`
          if (context.isHtml) { texteCorr = `${texteEnCouleurEtGras('Dans cet exercice, deux corrections différentes sont proposées.')}<br>` } else { texteCorr = '' }
          if (this.sup2 === 1) {
            texteCorr += `$f(x)$ est de la forme $ax+b$, $f$ est donc une fonction affine avec pour coefficient directeur  $a=${a.texFSD}$ ${a < 0 ? ' (négatif).' : ' (positif).'}<br>
             D'où, $f$ est une fonction ${ns < 0 ? ' décroissante,' : ' croissante,'} c'est-à-dire que lorsque $x$ augmente, $f(x)$ ${a < 0 ? ' diminue.' : ' augmente.'} <br>
             Par conséquent, les valeurs de $f(x)$ sont d'abord ${a < 0 ? 'positives' : 'négatives'} puis ${ns < 0 ? 'négatives' : 'positives'}.<br><br>
             De plus,  $${b === 0 ? `${a.texFSD}x=0` : `${a.texFSD}x${ecritureAlgebrique(b)}=0`} \\iff x=${zero.texFSD}$.<br><br>`
          }
          if (this.sup2 === 2) {
            if (b === 0) {
              texteCorr += `Résolution de l'inéquation  $ ${a.texFSD}x>0$ : <br>`
              texteCorr += `$\\begin{aligned}
           ${a.texFSD}x&>0\\\\
          x& ${ns < 0 ? `${miseEnEvidence(`${sp(1.5)}\\boldsymbol{<}${sp(1.5)}`)}` : '>'}${zero.texFSD} ${ns < 0 ? `${miseEnEvidence(`\\text{car} ${a.texFSD} <0`)}` : ''}
            \\end{aligned}$<br>`
            } else {
              texteCorr += `Résolution de l'inéquation  $${a.texFSD}x${ecritureAlgebrique(b)}>0$ : <br>`
              texteCorr += `$\\begin{aligned}
           ${a.texFSD}x${ecritureAlgebrique(b)}&>0\\\\
            ${a.texFSD}x&>${-b}\\\\
            x& ${ns < 0 ? `${miseEnEvidence(`${sp(1.5)}\\boldsymbol{<}${sp(1.5)}`)}` : '>'}${-b}\\times ${ns < 0 ? `\\left(${aInverse.texFSD}\\right)` : `${aInverse.texFraction}`} &${ns < 0 ? `${miseEnEvidence(`\\text{car} ${a.texFSD} <0`)}` : ''}\\\\
            x& ${ns < 0 ? '<' : '>'}${zero.texFSD}
            \\end{aligned}$<br>`
            }
            texteCorr += ` De plus,  $${b === 0 ? `${a.texFSD}x=0` : `${a.texFSD}x${ecritureAlgebrique(b)}=0`} \\iff x=${zero.texFSD}$.<br><br>`
          }
          if (a > 0) {
            ligne1 = ['Line', 25, '', 0, '-', 20, 'z', 20, '+']
          } else {
            ligne1 = ['Line', 25, '', 0, '+', 20, 'z', 20, '-']
          }
          texteCorr += ' D\'où le tableau de signes suivant :<br>'
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 3, 25], [`${b === 0 ? `$f(x)=${a.texFSD}x$` : `$f(x)=${a.texFSD}x${ecritureAlgebrique(b)}$`}`, 2, 50]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              ['$-\\infty$', 20, `$${zero.texFSD}$`, 20, '$+\\infty$', 30]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [ligne1],
            colorBackground: '',
            espcl: 3.5, // taille en cm entre deux antécédents
            deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 8, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          })
          const f = x => a * x + b
          const monRepere = repere({
            xMin: -8,
            xMax: 8,
            yMin: -7,
            yMax: 7,
            yLabelEcart: 0.8,
            yLabelDistance: 2,
            xLabelDistance: 2,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -7,
            grilleSecondaireYMax: 7,
            grilleSecondaireXMin: -8,
            grilleSecondaireXMax: 8
          })
          const maCourbe = courbe(f, { repere: monRepere, color: 'blue' })
          const A = point(-b / a, 0, '')

          const lA = labelPoint(A, 'red')
          const tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
          tA.taille = 5
          tA.epaisseur = 5
          const objets = []
          objets.push(maCourbe, lA, monRepere, o, tA)
          texteCorr += `<br>Sur la figure ci-dessous, l'abscisse du point rouge est $${zero.texFSD}$.<br>
            ` + mathalea2d({ xmin: -8, xmax: 8, ymin: -7, ymax: 7, scale: 0.5, style: 'margin: auto' }, objets)
        }
          break
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de questions ', 3, '1 : Valeurs entières\n2 : Valeurs fractionnaires\n3 : Mélange']
  this.besoinFormulaire2Numerique = ['Choix des corrections', 2, '1 : En utilisant le sens de variation d\'une fonction affine\n2 : En utilisant le calcul']
}
