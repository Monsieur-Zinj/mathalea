import { droite } from '../../lib/2d/droites.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment, vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { latexParPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { homothetie, translation } from '../../lib/2d/transformations.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebrique, reduireAxPlusB } from '../../lib/outils/ecritures'
import { abs } from '../../lib/outils/nombres'
import Exercice from '../deprecatedExercice.js'
import { colorToLatexOrHTML, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Déterminer graphiquement l\'expression d\'une fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '25/05/2023'
/**

 */
export const uuid = '93f13'
export const ref = '2F10-2'
export const refs = {
  'fr-fr': ['2F10-2'],
  'fr-ch': ['11FA8-13']
}
export default function Lecturefonctionaffine () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 1// On complète le nb de questions
  this.sup = 1
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = ['typeE1']
    } else {
      if (this.sup === 2) {
        typeDeQuestionsDisponibles = ['typeE2']
      } else {
        typeDeQuestionsDisponibles = ['typeE1', 'typeE2']
      }
    }
    const listeTypeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)
    const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
    const listeFractions = [[1, 3], [2, 3], [3, 7], [2, 7], [4, 3], [3, 5], [4, 7], [1, 5], [4, 5], [3, 4], [1, 4], [2, 5], [5, 3], [6, 5], [1, 6], [5, 6], [1, 7]]
    // const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, A, a, b, d, r, c, t, l, s1, s2, aFrac, labs, lord, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;) { // on rajoute les variables dont on a besoin
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'typeE1':// coeff entier
          r = repere({
            xMin: -4,
            xMax: 4,
            xUnite: 2,
            yMin: -5,
            yMax: 6,
            yUnite: 1,
            thickHauteur: 0.1,
            xLabelMin: -3,
            xLabelMax: 3,
            yLabelMax: 5,
            yLabelMin: -4,
            axeXStyle: '->',
            axeYStyle: '->',
            yLabelDistance: 1,
            yLabelEcart: 0.6,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 6,
            grilleSecondaireXMin: -8,
            grilleSecondaireXMax: 8
          })
          a = randint(-4, 4)// coeff dir
          b = randint(-4, 3)// ord origine
          if (a === 0 && b === 0) {
            a = 1
          }// On évite la fonction nulle
          c = droite(a / 2, -1, b)
          c.color = colorToLatexOrHTML('red')
          c.epaisseur = 2
          texte = 'Déterminer graphiquement l\'expression algébrique de la fonction affine $f$ représentée ci-dessous :<br>'
          texte += mathalea2d({
            xmin: -8,
            ymin: -5,
            xmax: 8,
            ymax: 6,
            pixelsParCm: 25,
            scale: 0.6
          }, r, c, o)// On trace le graphique
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: texte,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: `$f(x)=${reduireAxPlusB(a, b)}$`,
                    statut: '',
                    reponse: {
                      texte: 'coefficient a de $f(x)=ax+b$',
                      valeur: a,
                      param: {
                        digits: 1,
                        decimals: 0,
                        signe: true,
                        approx: 0
                      }
                    }
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'valeur b de $f(x)=ax+b$',
                      valeur: b,
                      param: {
                        digits: 1,
                        decimals: 0,
                        signe: true,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          } else if (this.interactif) {
            handleAnswers(this, i, { champ1: { value: `${reduireAxPlusB(a, b)}`, options: { variable: 'x' }, compare: functionCompare } })
            texte += remplisLesBlancs(this, i, 'f(x)=%{champ1}', 'fillInTheBlank', '\\ldots')
          }
          texteCorr = 'Puisque $f$ est une fonction affine, on a : $f(x)=ax+b$.<br>'
          if (a === 0) {
            texteCorr += `La droite est horizontale. Elle représente une fonction affine constante ($a=0$).<br>
          Ainsi, $f(x)=${b}$.`
          } else {
            texteCorr += `$\\bullet$ $b$ est l'ordonnée à l'origine de la droite. On lit $b=${b}$.<br>`
            if (this.correctionDetaillee) {
              texteCorr += `L'ordonnée à l'origine est l'ordonnée du point d'intersection entre la droite et l'axe des ordonnées.<br>
              Ce point est le point $A$ de coordonnées $(0\\,;\\,${b})$.<br>`
            }
            texteCorr += `$\\bullet$ $a$ est le coefficient directeur de la droite.<br>
          Il est donné par le déplacement vertical correspondant à un déplacement horizontal d'une unité. On lit $a=${a}$.<br>`
            if (this.correctionDetaillee) {
              texteCorr += `Le coefficient directeur mesure l'inclinaison de la droite par rapport à l'horizontal (voir les traces graphiques ci-dessous).<br>
          <br> `
            }
            texteCorr += ' On peut en déduire que l\'expression de la fonction $f$ est '
            texteCorr += `$f(x)=${reduireAxPlusB(a, b)}$.<br>`
            if (b > -2 || a > 0) {
              s1 = segment(0, b, 2, b, 'blue')
              s2 = segment(2, b, 2, b + a, 'green')
              labs = texteParPosition('$1$', 1, a < 0 ? b + 0.4 : b - 0.8, 'milieu', 'blue', 1)
              lord = texteParPosition(`$${a}$`, 2.8, (a + 2 * b) / 2, 'milieu', 'green', 1)
            } else {
              s1 = segment(-4, -2 * a + b, -2, -2 * a + b, 'blue')
              s2 = segment(-2, -2 * a + b, -2, -1 * a + b, 'green')
              labs = texteParPosition('$1$', -3, -2 * a + b + 0.5, 'milieu', 'blue', 1)
              lord = texteParPosition(`$${a}$`, -1.5, (-3 * a + 2 * b) / 2, 'milieu', 'green', 1)
            }
            s2.epaisseur = 2
            s1.epaisseur = 2
            s2.styleExtremites = '->'
            s1.styleExtremites = '->'
            A = point(0, b)
            l = texteParPosition('A', -0.5, b + 0.5, 'milieu', 'red', 1)
            t = tracePoint(A, 'red')// Variable qui trace les nom s A et B
            t.taille = 3
            t.epaisseur = 2

            if (this.correctionDetaillee) {
              if (a !== 0) {
                texteCorr += mathalea2d({
                  xmin: -8,
                  ymin: -5,
                  xmax: 8,
                  ymax: 6,
                  scale: 0.5
                }, r, s1, s2, t, c, l, o, labs, lord)//, labs, lord
              }
            }
          }
          break
        case 'typeE2': // cas du coeff directeur fractionnaire
          a = randint(-5, 5, [0]) // numérateut coefficient directeur non nul
          b = randint(-3, 3) // ordonnée à l'origine
          aFrac = choice(listeFractions)
          a = aFrac[0] * choice([-1, 1])//
          d = aFrac[1] //
          r = repere({
            xMin: -8,
            xMax: 8,
            xUnite: 1,
            yMin: -6,
            yMax: 6,
            yUnite: 1,
            thickHauteur: 0.1,
            xLabelMin: -7,
            xLabelMax: 7,
            yLabelMax: 5,
            yLabelMin: -5,
            axeXStyle: '->',
            axeYStyle: '->',
            yLabelDistance: 1,
            yLabelEcart: 0.6,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -6,
            grilleSecondaireYMax: 6,
            grilleSecondaireXMin: -8,
            grilleSecondaireXMax: 8
          })
          c = droite(a / d, -1, b)
          c.color = colorToLatexOrHTML('red')
          c.epaisseur = 2
          texte = 'Déterminer graphiquement l\'expression algébrique de la fonction affine $f$ représentée ci-dessous :<br>'
          texte += mathalea2d({
            xmin: -8,
            ymin: -6,
            xmax: 8,
            ymax: 6,
            pixelsParCm: 25,
            scale: 0.6
          }, r, c, o)// On trace le graphique
          texteCorr = 'Puisque $f$ est une fonction affine, on a : $f(x)=ax+b$.<br>'
          texteCorr += `$\\bullet$ $b$ est l'ordonnée à l'origine de la droite. On lit $b=${b}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr += `L'ordonnée à l'origine est l'ordonnée du point d'intersection entre la droite et l'axe des ordonnées.<br>
        Ce point est le point $A$ de coordonnées $(0\\,;\\,${b})$.<br>`
          }
          texteCorr += `$\\bullet$ $a$ est le coefficient directeur de la droite.<br>
          $a=\\dfrac{\\text{Dénivelé vertical}}{\\text{Déplacement horizontal}}=${texFractionReduite(a, d)}$.<br>
       `
          if (this.correctionDetaillee) {
            texteCorr += '<br>On cherche un déplacement horizontal (en bleu) correspondant à un déplacement vertical entier (en vert).'
            texteCorr += `<br>On lit que pour un déplacement vers la droite de ${texteEnCouleurEtGras(d + ' unités', 'blue')}, il faut `
            if (a > 0) {
              texteCorr += 'monter de '
            }
            if (a < 0) {
              texteCorr += 'descendre de '
            }
            texteCorr += `${texteEnCouleurEtGras(Math.abs(a) + `${abs(a) === 1 ? ' unité' : ' unités'}`, 'green')}.<br>`
          }
          texteCorr += ' On peut en déduire que l\'expression de la fonction $f$ est '
          if (b === 0) {
            texteCorr += `$f(x)=${texFractionReduite(a, d)}x$.<br>`
          } else {
            texteCorr += `$f(x)=${texFractionReduite(a, d)}x${ecritureAlgebrique(b)}$.<br>`
          }
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: texte,
              propositions: [
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: `$${texFractionReduite(a, d)}x${ecritureAlgebrique(b)}$`,
                    statut: '',
                    reponse: {
                      texte: 'numérateur (signé) n de $f(x)=\\dfrac{n}{d}x+b$',
                      valeur: a,
                      param: {
                        digits: 1,
                        decimals: 0,
                        signe: true,
                        approx: 0
                      }
                    }
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'dénominateur d de $f(x)=\\dfrac{n}{d}x+b$',
                      valeur: d,
                      param: {
                        digits: 1,
                        decimals: 0,
                        signe: false,
                        approx: 0
                      }
                    }
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'valeur b de $f(x)=ax+b$',
                      valeur: b,
                      param: {
                        digits: 1,
                        decimals: 0,
                        signe: true,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          } else if (this.interactif && !context.isAmc) {
            handleAnswers(this, i, { champ1: { value: `${new FractionEtendue(a, d).texFractionSimplifiee}x${ecritureAlgebrique(b)}`, options: { variable: 'x' }, compare: functionCompare } })
            texte += remplisLesBlancs(this, i, 'f(x)=%{champ1}', 'fillInTheBlank', '\\ldots')
          }
          if (a > 0) {
            if (b > 2) {
              s1 = segment(-d, b - a, 0, b - a, 'blue')
              s2 = segment(0, b - a, 0, b, 'green')
              labs = texteParPosition(`$${d}$`, -d / 2, b - a - 0.8, 'milieu', 'blue', 1)
              lord = texteParPosition(`$${a}$`, 0.5, (2 * b - a) / 2 - 0.3, 'milieu', 'green', 1)
            } else {
              s1 = segment(0, b, d, b, 'blue')
              s2 = segment(d, b, d, a + b, 'green')
              labs = texteParPosition(`$${d}$`, d / 2, b - 1, 'milieu', 'blue', 1)
              lord = texteParPosition(`$${a}$`, d + 0.5, (2 * b + a) / 2 - 0.3, 'milieu', 'green', 1)
            }
          }
          if (a < 0) {
            if (b < 1) {
              s1 = segment(-d, -a + b, 0, -a + b, 'blue')
              s2 = segment(0, -a + b, 0, b, 'green')
              labs = texteParPosition(`$${d}$`, -d / 2, -a + b + 0.5, 'milieu', 'blue', 1)
              lord = texteParPosition(`$${a}$`, 0.5, (2 * b - a) / 2, 'milieu', 'green', 1)
            } else {
              s1 = segment(0, b, d, b, 'blue')
              s2 = segment(d, b, d, b + a, 'green')
              labs = texteParPosition(`$${d}$`, d / 2, b + 0.5, 'milieu', 'blue', 1)
              lord = texteParPosition(`$${a}$`, d + 0.5, (2 * b + a) / 2, 'milieu', 'green', 1)
            }
          }
          s2.epaisseur = 2
          s1.epaisseur = 2
          s2.styleExtremites = '->'
          s1.styleExtremites = '->'
          A = point(0, b)

          l = latexParPoint('A', translation(A, homothetie(vecteur(-a, d), A, 0.5 / Math.sqrt(a ** 2 + d ** 2)), 'A', 'center'), 'red', 10, 10, '') // Variable qui trace les points avec une croix
          t = tracePoint(A, 'red')// Variable qui trace les nom s A et B
          t.taille = 3
          t.epaisseur = 2

          // l.color = colorToLatexOrHTML('red')
          if (this.correctionDetaillee) {
            if (a !== 0) {
              texteCorr += mathalea2d({
                xmin: -8,
                ymin: -6,
                xmax: 8,
                ymax: 6,
                scale: 0.5

              }, r, s1, s2, t, l, c, o, labs, lord)
            }
          }// On trace le graphique
          break
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Coefficient directeur entier\n2 :Coefficient directeur fractionnaire\n3 :Mélange']
}
