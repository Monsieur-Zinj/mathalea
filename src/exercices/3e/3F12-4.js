import Decimal from 'decimal.js'
import { courbe } from '../../lib/2d/courbes.js'
import { repere } from '../../lib/2d/reperes.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { chercheMinMaxFonction } from '../../lib/mathFonctions/etudeFonction.js'
import { resolutionSystemeLineaire2x2, resolutionSystemeLineaire3x3 } from '../../lib/mathFonctions/outilsMaths.js'
import { abs, nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { numAlpha } from '../../lib/outils/outilString.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Lire l\'image d\'un nombre à partir d\'un graphique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Un graphique étant tracé, déterminer l'image de nombres donnés.
 * La fonction est un polynôme de degré 1, 2 ou 3 et les nombres des questions ne sont que des entiers.
 *
 * @author Rémi Angot
 * 3F12-4
 */
export const uuid = 'b8946'
export const ref = '3F12-4'
export const refs = {
  'fr-fr': ['3F12-4'],
  'fr-ch': ['11FA7-3']
}
export default function ImageGraphique () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.sup = 3
  this.spacing = 1
  context.isHtml ? this.spacingCorr = 3 : this.spacingCorr = 1
  this.nbQuestions = 1
  this.pointsParQuestions = 3
  // this.nbQuestionsModifiable = false
  this.nbCols = 1

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    this.sup = parseInt(this.sup)
    let a, b, c, d, x1, x2, x3, fx1, fx2, fx3, ymax, f

    function initialiseVariables () {
      x1 = randint(-6, -3)
      x2 = randint(x1 + 3, 2)
      x3 = randint(x2 + 2, 8)
      fx1 = randint(-5, 5)
      fx2 = randint(-6, 6)
      fx3 = randint(-5, 5)
      d = randint(-5, 5)
      c = randint(-5, 5)
      ymax = 7
    }

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      initialiseVariables()

      texte = 'On a tracé ci-dessous la courbe représentative de la fonction $f$.<br>'
      const r = repere({ xMin: -7, xMax: 9, yMin: -7, yMax: 7 })
      if (this.sup === 1) {
        a = new Decimal(fx2 - fx1).div(x2 - x1)
        b = a.mul(x1).sub(fx1)
        f = x => a * x - b

        texte += `Déterminer par lecture graphique les images de $${x1}$ et de $${x2}$ par cette fonction $f$.<br>`
        texteCorr = `L'image de $${x1}$ est $${fx1}$, on note $f(${x1})=${fx1}$.<br>`
        texteCorr += `L'image de $${x2}$ est $${fx2}$, on note $f(${x2})=${fx2}$.`
      }

      if (this.sup === 2) {
        x1 = randint(-6, -3)
        x3 = randint(1, 6)
        fx1 = randint(-5, 5)
        fx3 = randint(-6, 6, c);
        [a, b] = resolutionSystemeLineaire2x2(x1, x3, fx1, fx3, c)
        while (Number.isNaN(a) || Number.isNaN(b) === 0 || a === 0) {
          x1 = randint(-6, -3)
          x3 = randint(1, 6)
          fx1 = randint(-5, 5)
          fx3 = randint(-6, 6, c)
          ;[a, b] = resolutionSystemeLineaire2x2(x1, x3, fx1, fx3, c)
        }
        x2 = 0
        fx2 = c

        f = x => a * x ** 2 + b * x + c
      }

      if (this.sup === 3) {
        [a, b, c] = resolutionSystemeLineaire3x3(x1, x2, x3, fx1, fx2, fx3, d)
        let [extremum1, extremum2] = chercheMinMaxFonction([a, b, c, d])
        while (Number.isNaN(a) || Number.isNaN(b) === 0 || Number.isNaN(c) || a === 0 || abs(extremum1[1]) > ymax || abs(extremum2[1]) > ymax) {
          initialiseVariables();
          [a, b, c] = resolutionSystemeLineaire3x3(x1, x2, x3, fx1, fx2, fx3, d)
          if (chercheMinMaxFonction([a, b, c, d]) === []) {
            [extremum1, extremum2] = [[0, 999], [0, 999]]
          } else {
            [extremum1, extremum2] = chercheMinMaxFonction([a, b, c, d])
          }
        }
        f = x => a * x ** 3 + b * x ** 2 + c * x + d
      }

      if (this.sup === 2 || this.sup === 3) {
        texte += `Déterminer par lecture graphique les images de $${x1}$, de $${x2}$ et de $${x3}$ par cette fonction $f$.<br>`
        texteCorr = `L'image de $${x1}$ est $${fx1}$, on note $f(${x1})=${fx1}$.<br>`
        texteCorr += `L'image de $${x2}$ est $${fx2}$, on note $f(${x2})=${fx2}$.<br>`
        texteCorr += `L'image de $${x3}$ est $${fx3}$, on note $f(${x3})=${fx3}$.<br>`
      }
      const C = courbe(f, { repere: r, step: 0.25 })
      texte += mathalea2d({ xmin: -7.5, xmax: 9.5, ymin: -7.5, ymax: 7.5, scale: 0.6 }, r, C)

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte + '<br>',
          options: { multicols: true, barreseparation: true, numerotationEnonce: true },
          propositions: [
            {
              type: 'AMCNum',
              propositions: [{
                texte: `L'image de $${x1}$ est $${fx1}$, on note $f(${x1})=${fx1}$.\\\\`,
                statut: '',
                reponse: {
                  texte: numAlpha(0) + `$f(${x1})$`,
                  valeur: fx1,
                  param: {
                    digits: nombreDeChiffresDansLaPartieEntiere(fx1),
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
                texte: `L'image de $${x2}$ est $${fx2}$, on note $f(${x2})=${fx2}$.\\\\`,
                statut: '',
                reponse: {
                  texte: numAlpha(1) + `$f(${x2})$`,
                  valeur: fx2,
                  param: {
                    digits: nombreDeChiffresDansLaPartieEntiere(fx2),
                    decimals: 0,
                    signe: true,
                    approx: 0
                  }
                }
              }]
            }
          ]
        }
        if (this.sup !== 1) {
          this.autoCorrection[i].propositions.push({
            type: 'AMCNum',
            propositions: [{
              texte: `L'image de $${x3}$ est $${fx3}$, on note $f(${x3})=${fx3}$.\\\\`,
              statut: '',
              reponse: {
                texte: numAlpha(2) + `$f(${x3})$`,
                valeur: fx3,
                param: {
                  digits: nombreDeChiffresDansLaPartieEntiere(fx3),
                  decimals: 0,
                  signe: true,
                  approx: 0
                }
              }
            }]
          })
        }
      } else if (this.interactif) {
        if (this.sup === 1) {
          texte += `$f(${x1})=$` + ajouteChampTexteMathLive(this, 2 * i, ' ')
          texte += `<br><br>$f(${x2})=$` + ajouteChampTexteMathLive(this, 2 * i + 1, ' ')
          setReponse(this, 2 * i, fx1)
          setReponse(this, 2 * i + 1, fx2)
        } else {
          texte += `$f(${x1})=$` + ajouteChampTexteMathLive(this, 3 * i, ' ')
          texte += `<br><br>$f(${x2})=$` + ajouteChampTexteMathLive(this, 3 * i + 1, ' ')
          texte += `<br><br>$f(${x3})=$` + ajouteChampTexteMathLive(this, 3 * i + 2, ' ')
          setReponse(this, 3 * i, fx1)
          setReponse(this, 3 * i + 1, fx2)
          setReponse(this, 3 * i + 2, fx3)
        }
      }
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  this.besoinFormulaireNumerique = ['Type de fonction', 3, '1 : Affine\n2 : Polynome du 2nd degré\n3 : Polynome du 3e degré']
}
