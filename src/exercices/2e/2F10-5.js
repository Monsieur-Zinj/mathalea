import { texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { reduireAxPlusB } from '../../lib/outils/ecritures.js'
import Exercice from '../Exercice.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, choice, combinaisonListes } from '../../modules/outils.js'
import { labelPoint, point, tracePoint, courbe, repere } from '../../modules/2d.js'
import { tableauDeVariation } from '../../modules/TableauDeVariation.js'

export const titre = 'Déterminer le signe d\'une fonction affine'

/**
* @author Stéphane Guyon
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
  this.sup2 = false
  this.listePackages = ['tkz-tab']

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = [1]// 'typeE1', 'typeE2',
    } else if (this.sup === 2) {
      typeDeQuestionsDisponibles = [2]
    } else if (this.sup === 3) {
      typeDeQuestionsDisponibles = [1, 2]
    }
    const listeTypeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)
    // const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    // const o = texteParPosition('O', -0.5, -0.5, 'milieu', 'black', 1)

    for (let i = 0, a, b, tA, lA, monRepere, maCourbe, ligne1, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;) { // on rajoute les variables dont on a besoin
      // typesDeQuestions = listeTypeDeQuestions[i]
      switch (listeTypeQuestions[i]) {
        case 1:
          {
         const a = randint(1, 5) * choice([-1, 1])// coefficient a de la fonction affine
         const b = randint(0, 5) * choice([-1, 1])// coefficient b de la fonction affine
        const  zero = new FractionEtendue(-b, a).simplifie()
          texte = `Déterminer le signe de la fonction $f$ définie sur $\\mathbb R$ par $f(x)=${reduireAxPlusB(a, b)}$ <br>`

          texteCorr = '$f$ est une fonction affine, de la forme $f(x)=ax+b$.<br>'
          texteCorr += `Son coefficient $a$ vaut : $a=${a}~$ et son coefficient $b$ vaut : $b=${b}$. <br>`
          // texteCorr += `Selon les notations, on peut aussi appeler $f$ sous la forme $f(x)=mx+p$ avec : $m=${a}$ et $p=${b}$. <br>`
          texteCorr += `On cherche la valeur de $x$ qui annule la fonction $f$ en résolvant l\'équation $f(x)=0$.<br> `
          texteCorr += `$\\begin{aligned}
          ${reduireAxPlusB(a,b)}&=0\\\\
          ${a}x&=${-b}\\\\
          x&=${zero.texFSD}
          \\end{aligned}$<br>`
          texteCorr += `Comme  $~a=~${a}`
          if (a > 0) {
            texteCorr += `>0~$, $~f(x)$ est positive pour $x>${zero.texFSD}$ et négative pour $x<${zero.texFSD}$<br>`
            ligne1 = ['Line', 30, '', 0, '-', 20, 'z', 20, '+']
          } else {
            texteCorr += `<0$,  $f(x)~$ est négative pour $~>${zero.texFSD}$ et positive pour $x<${zero.texFSD}$<br>`
            ligne1 = ['Line', 30, '', 0, '+', 20, 'z', 20, '-']
          }
          texteCorr += 'On peut synthétiser cela dans un tableau de signes :<br>'

          texteCorr += mathalea2d({ xmin: -0.5, ymin: -5.1, xmax: 30, ymax: 0.1, scale: 0.5 }, tableauDeVariation({
            tabInit: [
              [
              // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 2, 30], [`$f(x)=${reduireAxPlusB(a, b)}$`, 2, 50]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              ['$-\\infty$', 30, `$x_0=${texFractionReduite(-b, a)}$`, 20, '$+\\infty$', 30]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [ligne1],
            colorBackground: '',
            espcl: 3.5, // taille en cm entre deux antécédents
            deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 8, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          }))

          texteCorr += '<br>Pour illustrer la situation, on peut représenter graphiquement la fonction :<br><br>'
          const f = x => a * x + b
          monRepere = repere()
          maCourbe = courbe(f, { repere: monRepere })
          const A = point(-b / a, 0, 'x_0')
          lA = labelPoint(A, 'red')
          tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
          texteCorr += mathalea2d({
            xmin: -5,
            ymin: -5,
            xmax: 6,
            ymax: 6,
            scale: 0.5
          }, monRepere, maCourbe, tA, lA)
        }
          break
      }

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
  this.besoinFormulaireNumerique = ['Types de question ', 3, '1 : Valeurs entières\n2 : Valeurs fractionnaires\n3 : Mélange']
  // Le cas this.sup === 2 n'a pas été programmé
  // this.besoinFormulaire2CaseACocher = ['Correction alternative']
}
