import { droite } from '../../lib/2d/droites.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../lib/2d/textes.ts'
import { reduireAxPlusB } from '../../lib/outils/ecritures'
import { abs } from '../../lib/outils/nombres'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { colorToLatexOrHTML, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { texNombre } from '../../lib/outils/texNombre.ts'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import FractionEtendue from '../../modules/FractionEtendue'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Déterminer une équation réduite à partir de sa représentation graphique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
/**
 */
export const uuid = '41e6f'
export const ref = '2G30-7'
export const refs = {
  'fr-fr': ['2G30-7'],
  'fr-ch': ['11FA9-7']
}
export default function Lecturegraphiquedeaetb () {
  Exercice.call(this)
  this.nbQuestions = 3// On complète le nb de questions
  this.nbCols = 1
  this.nbColsCorr = 1
  this.tailleDiaporama = 3
  this.spacing = 1
  this.spacingCorr = 1
  this.spacingCorr = 1
  this.sup = 1

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0, a, b, r, c, d, s1, s2, o, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;) { // on rajoute les variables dont on a besoin
      a = randint(-5, 5) // coefficient directeur
      b = randint(-5, 5) // ordonnée à l'origine
      if (a === 0 && b === 0) {
        a = randint(-5, 5, 0)
      } // On évite la situation de double nullité

      d = this.sup === 1 ? 1 : randint(2, 5, 3) // dénominateur coefficient directeur
      const coeffDir = new FractionEtendue(a, d)

      r = repere({
        xMin: -8,
        xMax: 8,
        yMin: -8,
        yMax: 8,
        yLabelEcart: 0.8,
        yLabelDistance: 2,
        xLabelDistance: 2,
        grilleX: false,
        grilleY: false,
        grilleSecondaire: true,
        grilleSecondaireYDistance: 1,
        grilleSecondaireXDistance: 1,
        grilleSecondaireYMin: -8,
        grilleSecondaireYMax: 8,
        grilleSecondaireXMin: -8,
        grilleSecondaireXMax: 8
      })
      c = droite(a / d, -1, b) // On définit l'objet qui tracera la courbe dans le repère
      c.color = colorToLatexOrHTML('red')
      c.epaisseur = 2
      o = texteParPosition('O', -0.5, -0.5, 'milieu', 'black', 1)
      texte = 'À partir de la représentation graphique de la droite ci-dessous, donner par lecture graphique son équation réduite.<br><br>'
      texte += mathalea2d({
        xmin: -8,
        ymin: -8,
        xmax: 8,
        ymax: 8,
        scale: 0.5
      }, r, c, o)// On trace le graphique

      if (a === 0) { // La droite est horizontale
        texteCorr = 'On observe que la droite est horizontale.'
        texteCorr += `<br>La droite est l'ensemble des points ayant comme ordonnée : $${texNombre(b, 1)}$.`
        texteCorr += `<br>L'équation réduite de cette droite est donc : $y=${miseEnEvidence(texNombre(b, 1))}$.`
      } else { // La droite n'est pas horizontale
        texteCorr = 'On sait que l\'équation réduite d\'une droite non verticale est de la forme : $y= ax+b$ avec $a$ et $b$ deux réels non tous deux nuls.<br>'
        texteCorr += 'Le premier coefficient à lire graphiquement est $b$, l\'ordonnée à l\'origine de la droite.<br>'
        texteCorr += 'C\'est l\'ordonnée du point d\'intersection de la droite avec l\'axe des ordonnées.<br>'
        texteCorr += `On lit ici que le point $(0;${texNombre(b, 1)}) \\in (d)$.<br>`
        texteCorr += `On peut alors conclure que l'ordonnée à l'origine est : $b=${texNombre(b, 1)}$. <br>`
        texteCorr += 'On peut lire ensuite le coefficient directeur $a$ de la droite $(d)$.<br>'
        texteCorr += 'On sait que $a=\\dfrac{\\text{Dénivelé vertical}}{\\text{Déplacement horizontal}}$.'

        texteCorr += this.sup === 1 ? '' : '<br>On cherche un déplacement horizontal correspondant à un déplacement vertical entier.'
        texteCorr += '<br>On lit que pour un déplacement vers la droite '
        texteCorr += this.sup === 1 ? 'd\'une unité' : `de ${texNombre(d, 1)} unités`
        texteCorr += ', il faut '
        texteCorr += a > 0 ? 'monter de ' : 'descendre de '
        texteCorr += `${abs(a)} unité${abs(a) === 1 ? '' : 's'} `
        texteCorr += `et donc $a=\\dfrac{${texNombre(a, 1)}}{${texNombre(d, 1)}}`
        if (pgcd(a, d) !== 1 || d === 1) {
          texteCorr += `=${coeffDir.texFractionSimplifiee}`
        }
        texteCorr += '$'

        texteCorr += `<br>On peut en déduire que l'équation réduite de la droite $(d)$ est : $y=${miseEnEvidence(reduireAxPlusB(coeffDir, b))}$.`
        const reponse = reduireAxPlusB(coeffDir.simplifie(), b)
        handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })

        if (b + a < -8 || b + a > 8) { // Si cela sort du cadre
          s1 = segment(-d, b - a, 0, b - a, 'blue')
          s1.epaisseur = 4
          s2 = segment(0, b - a, 0, b, 'blue')
        } else {
          s1 = segment(0, b, d, b, 'blue')
          s1.epaisseur = 4
          s2 = segment(d, b, d, a + b, 'blue')
        }
        s2.epaisseur = 4

        if (a !== 0) {
          texteCorr += mathalea2d({
            xmin: -8,
            ymin: -8,
            xmax: 8,
            ymax: 8,
            scale: 0.5
          }, r, s1, s2, c, o)
        }// On trace le graphique
      }

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte + '<br>',
          propositions: [
            {
              type: 'AMCNum',
              propositions: [{
                texte: texteCorr,
                statut: '',
                reponse: {
                  texte: 'coefficient directeur',
                  valeur: coeffDir.toNumber(),
                  param: {
                    digits: this.sup1 === 1 ? 1 : 3,
                    decimals: this.sup1 === 1 ? 0 : 2,
                    signe: true,
                    approx: 0
                  }
                }
              }]
            },
            {
              type: 'AMCNum',
              propositions: [{
                statut: '',
                reponse: {
                  texte: "ordonnée à l'origine",
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
      }

      texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: '<br>L\'équation réduite de la droite est : $y=$' })

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Types de question ', 2, '1 : Valeurs entières\n2 : Valeurs fractionnaires']
}
