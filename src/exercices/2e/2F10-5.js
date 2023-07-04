import { reduireAxPlusB, rienSi1, ecritureAlgebrique } from '../../lib/outils/ecritures.js'
import Exercice from '../Exercice.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, choice, combinaisonListes } from '../../modules/outils.js'
import { labelPoint, point, tracePoint, courbe, repere, texteParPosition } from '../../modules/2d.js'
import { tableauDeVariation } from '../../modules/TableauDeVariation.js'

export const titre = 'Déterminer le signe d\'une fonction affine'

/**
* @author Stéphane Guyon+Gilles Mora
* 2F10-3
*/
export const uuid = '03b71'
export const ref = '2F10-5'
export default function Signefonctionaffine () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 1 // On complète le nb de questions
  this.nbCols = 1
  this.nbColsCorr = 1
  this.video = ''
  this.spacing = 1
  this.spacingCorr = 1
  this.sup = 1
  this.listePackages = ['tkz-tab']

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
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
    for (let i = 0, a, b, tA, lA, maCourbe, ligne1, texte, texteCorr, cpt = 0, fraction = [], ns, ds, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1:
          {
            const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
            const a = randint(1, 5) * choice([-1, 1])// coefficient a de la fonction affine
            const b = randint(0, 7) * choice([-1, 1])// coefficient b de la fonction affine
            const zero = new FractionEtendue(-b, a).simplifie()
            texte = `Dresser le tableau de signe de la fonction $f$ définie sur $\\mathbb R$ par $f(x)=${reduireAxPlusB(a, b)}$.`

            texteCorr = '$f$ est une fonction affine, de la forme $f(x)=ax+b$.<br>'
            texteCorr += `Son coefficient $a$ vaut : $a=${a}$ et son coefficient $b$ vaut : $b=${b}$. <br>`
            // texteCorr += `Selon les notations, on peut aussi appeler $f$ sous la forme $f(x)=mx+p$ avec : $m=${a}$ et $p=${b}$. <br>`
            texteCorr += 'On cherche la valeur de $x$ qui annule la fonction $f$ en résolvant l\'équation $f(x)=0$.<br> '
            texteCorr += `$\\begin{aligned}
          ${reduireAxPlusB(a, b)}&=0\\\\
          ${rienSi1(a)}x&=${-b}\\\\
          ${a !== 1 ? `x&=${zero.texFSD}` : ''}
          \\end{aligned}$<br>`
            texteCorr += `Comme  $a=${a}`
            if (a > 0) {
              texteCorr += `>0$, $f(x)$ est positif pour $x>${zero.texFSD}$ et négatif pour $x<${zero.texFSD}$.<br>
            Graphiquement, la droite (qui représente la fonction affine) monte, donc les images $f(x)$ sont d'abord négatives puis positives.`
              ligne1 = ['Line', 25, '', 0, '-', 20, 'z', 20, '+']
            } else {
              texteCorr += `<0$,  $f(x)$ est négatif pour $x>${zero.texFSD}$ et positif pour $x<${zero.texFSD}$.<br>
            Graphiquement, la droite (qui représente la fonction affine) descend, donc les images $f(x)$ sont d'abord positives puis négatives.`
              ligne1 = ['Line', 25, '', 0, '+', 20, 'z', 20, '-']
            }

            texteCorr += mathalea2d({ xmin: -0.5, ymin: -5.1, xmax: 30, ymax: 0.1, scale: 0.5 }, tableauDeVariation({
              tabInit: [
                [
                  // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                  ['$x$', 2, 25], [`$f(x)=${reduireAxPlusB(a, b)}$`, 2, 50]
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
            }))
            const f = x => a * x + b
            const monRepere = repere({
              xMin: -8,
              xMax: 8,
              yMin: -7,
              yMax: 7,
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
            maCourbe = courbe(f, { repere: monRepere, color: 'blue' })
            const A = point(-b / a, 0, '')

            lA = labelPoint(A, 'red')
            tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
            tA.taille = 5
            tA.epaisseur = 5
            const objets = []
            objets.push(maCourbe, lA, monRepere, o, tA)
            texteCorr += `<br>Sur la figure ci-dessous, l'abscisse du point rouge est $${zero.texFSD}$.<br>
            ` + mathalea2d({ xmin: -8, xmax: 8, ymin: -7, ymax: 7, scale: 0.5, style: 'margin: auto' }, objets)

            mathalea2d({
              xmin: -5,
              ymin: -5,
              xmax: 6,
              ymax: 6,
              scale: 0.5
            }, monRepere, maCourbe, tA, lA)
          }
          break

        case 2:
          {
            const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
            const b = randint(0, 3) * choice([-1, 1])// coefficient b de la fonction affine
            fraction = choice(listeFractions)
            ns = fraction[0] * choice([-1, 1])
            ds = fraction[1]
            const a = new FractionEtendue(ns, ds).simplifie()
            const aInverse = new FractionEtendue(ns, ds).simplifie().inverse()
            const zero = new FractionEtendue(-b * ds, ns).simplifie()
            texte = `Dresser le tableau de signe de la fonction $f$ définie sur $\\mathbb R$ par ${b === 0 ? `$f(x)=${a.texFSD}x$` : `$f(x)=${a.texFSD}x${ecritureAlgebrique(b)}$`}. <br>`

            texteCorr = '$f$ est une fonction affine, de la forme $f(x)=ax+b$.<br>'
            texteCorr += `Son coefficient $a$ vaut : $a=${a.texFSD}$ et son coefficient $b$ vaut : $b=${b}$. <br>`
            texteCorr += 'On cherche la valeur de $x$ qui annule la fonction $f$ en résolvant l\'équation $f(x)=0$.<br> '
            if (b === 0) {
              texteCorr += `$\\begin{aligned}
           ${a.texFSD}x${ecritureAlgebrique(b)}&=0\\\\
            x&=0
            \\end{aligned}$<br>`
            } else {
              texteCorr += `$\\begin{aligned}
           ${a.texFSD}x${ecritureAlgebrique(b)}&=0\\\\
            ${a.texFSD}x&=${-b}\\\\
            x&=${-b}\\times ${aInverse.texFraction}\\\\
             x&=${zero.texFSD}
            \\end{aligned}$<br>`
            }
            texteCorr += `Comme  $a=${a.texFSD}`
            if (ns > 0) {
              texteCorr += `>0$, $f(x)$ est positif pour $x>${zero.texFSD}$ et négatif pour $x<${zero.texFSD}$.<br>
              Graphiquement, la droite (qui représente la fonction affine) monte, donc les images $f(x)$ sont d'abord négatives puis positives.`
              ligne1 = ['Line', 25, '', 0, '-', 20, 'z', 20, '+']
            } else {
              texteCorr += `<0$,  $f(x)$ est négatif pour $x>${zero.texFSD}$ et positif pour $x<${zero.texFSD}$.<br>
              Graphiquement, la droite (qui représente la fonction affine) descend, donc les images $f(x)$ sont d'abord positives puis négatives.`
              ligne1 = ['Line', 25, '', 0, '+', 20, 'z', 20, '-']
            }

            texteCorr += mathalea2d({ xmin: -0.5, ymin: -5.1, xmax: 30, ymax: 0.1, scale: 0.5 }, tableauDeVariation({
              tabInit: [
                [
                  // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                  ['$x$', 2, 25], [`${b === 0 ? `$f(x)=${a.texFSD}x$` : `$f(x)=${a.texFSD}x${ecritureAlgebrique(b)}$`}`, 2, 50]
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
            }))
            const f = x => a * x + b
            const monRepere = repere({
              xMin: -8,
              xMax: 8,
              yMin: -7,
              yMax: 7,
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
            maCourbe = courbe(f, { repere: monRepere, color: 'blue' })
            const A = point(-b / a, 0, '')

            lA = labelPoint(A, 'red')
            tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
            tA.taille = 5
            tA.epaisseur = 5
            const objets = []
            objets.push(maCourbe, lA, monRepere, o, tA)
            texteCorr += `<br>Sur la figure ci-dessous, l'abscisse du point rouge est $${zero.texFSD}$.<br>` + mathalea2d({ xmin: -8, xmax: 8, ymin: -7, ymax: 7, scale: 0.6, style: 'margin: auto' }, objets)
          }
          break
      }

      if (this.questionJamaisPosee(i, a, b, ns, ds, typesDeQuestions)) {
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
}
