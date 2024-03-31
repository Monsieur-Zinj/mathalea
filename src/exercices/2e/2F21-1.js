import { antecedentParDichotomie, courbe, courbeInterpolee } from '../../lib/2d/courbes.js'
import { droiteParPointEtPente } from '../../lib/2d/droites.js'
import { point } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../lib/2d/textes.ts'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { numAlpha, sp } from '../../lib/outils/outilString.js'
import { prenom, prenomM } from '../../lib/outils/Personne'
import { texPrix, texteGras } from '../../lib/format/style'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import Decimal from 'decimal.js'

import { mathalea2d } from '../../modules/2dGeneralites.js'

import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { exp } from 'mathjs'
export const titre = 'Modéliser une situation à l\'aide d\'une fonction'
export const dateDePublication = '14/02/2023'
export const dateDeModifImportante = '24/01/2024'
/**
 * Description didactique de l'exercice
 * @author Gilles Mora
 * Référence
*/
export const uuid = '5621b'
export const ref = '2F21-1'
export const refs = {
  'fr-fr': ['2F21-1'],
  'fr-ch': ['10FA5-16', '11FA9-10']
}
export default function ModeliserParUneFonction () {
  Exercice.call(this)
  this.consigne = ''
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = 1
  this.tailleDiaporama = 2 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.spacing = 1.5 // Interligne des questions
  this.spacingCorr = 1 // Interligne des réponses
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = ['typeE1', 'typeE2', 'typeE4', 'typeE5', 'typeE10']//
    } else if (this.sup === 2) {
      typeDeQuestionsDisponibles = ['typeE3', 'typeE6', 'typeE7']//
    } else if (this.sup === 3) {
      typeDeQuestionsDisponibles = ['typeE8', 'typeE9']//
    }
    //
    const listeTypeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, question1, question2, question3, question4, question5, question6, correction1,
      correction2, correction3, correction4, correction5, correction6, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      const nomF = [
        ['f'], ['g'], ['h'], ['u'],
        ['v'], ['w']
      ]
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'typeE1':// salle de sport deux formules
          {
            const a = randint(10, 12)
            const dec1 = choice([0, 0.25, 0.5, 0.75, 1])
            const b = (new Decimal(randint(5, 6))).add(dec1)
            const b1 = Math.round(b * 100) / 100
            const c = randint(25, 30)
            const dec2 = choice([0, 0.25, 0.5, 0.75, 1])
            const d = (new Decimal(randint(2, 3))).add(dec2)
            const d1 = Math.round(d * 100) / 100
            const P = prenomM()
            const T = randint(30, 70)
            const e = randint(25, 30)
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const A = point(0.5 * (c - a) / (b - d), 0.1 * (a + b * (c - a) / (b - d)))
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const TexteX = texteParPosition('Nombre de séances', 13, 0.5, 0, 'black', 1.5)
            const TexteY = texteParPosition('Prix (€)', 1.3, 11.5, 0, 'black', 1.5)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 120,
              xMax: 30,
              xUnite: 0.5,
              yUnite: 0.1,
              thickHauteur: 0.1,
              xLabelMin: 1,
              yLabelMin: 10,
              xLabelMax: 29,
              yLabelMax: 110,
              yThickDistance: 10,
              xThickDistance: 2,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleYDistance: 10,
              grilleSecondaire: true,
              grilleSecondaireYDistance: 10,
              grilleSecondaireXDistance: 10,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 120,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 30

            })
            const f = x => a + b1 * x
            const g = x => c + d1 * x
            const graphique = mathalea2d({
              xmin: -1,
              xmax: 30,
              ymin: -1,
              ymax: 12,
              pixelsParCm: 30,
              scale: 0.7,
              style: 'margin: auto'
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            })
            , courbe(g, {
              repere: r1,
              color: 'red',
              epaisseur: 2
            }), TexteX, TexteY, r1, o, sAAx)
            this.introduction = ` Dans une salle de sport, deux formules sont proposées :<br>
            ${texteGras('Formule A :')} abonnement mensuel de $${a}$ € puis $${texPrix(b)}$ € par séance ;<br>
            ${texteGras('Formule B :')} abonnement mensuel de $${c}$ € puis $${texPrix(d)}$ € par séance.<br>
            Le nombre de séances mensuelles ne peut excéder $${e}$. <br>
            On note $x$ le nombre de séances mensuelles d’un abonné, $f(x)$ le prix payé avec la formule A et $g(x)$ le prix payé avec la formule B.<br>
            `
            question1 = ' Donner l\'ensemble de définition des fonctions $f$ et $g$.'
            question2 = ' Exprimer en fonction de $x$, $f(x)$, puis $g(x)$.'
            question3 = `${P} choisit une formule mais ne veut pas dépenser plus de $${T}$ € pour un mois. Quelle formule lui conseiller s'il veut faire le maximum de séances de sport dans le mois ?`
            question4 = ` À partir de combien de séances mensuelles, la formule B est-elle plus avantageuse ?
                `

            correction1 = `
          Le nombre minimal de séances dans le mois est $0$ et le nombre maximal est $${e}$, donc l'ensemble de définition des fonctions $f$ et $g$ est l'ensemble des entiers de l'intervalle $[0\\,;\\,${e}]$.`
            correction2 = ` Les formules comprennent un abonnement fixe et un tarif particulier pour une séance. <br>
          Ainsi, le montant mensuel pour une formule est : Abonnement + Coût d'une séance $\\times$ Nombre de séances. <br>
          La fonction $f$ est définie par $f(x)=${a}+${texPrix(b)}x$ et la fonction $g$ est définie par $g(x)=${c}+${texPrix(d)}x$.`
            correction3 = ` On cherche le nombre de séances maximum que l'on peut faire avec $${T}$ € avec les formule A et B.<br>
          Pour la formule A, on cherche $x$ tel que $f(x)\\leqslant${T}$.<br>
          $\\begin{aligned}
${a}+${texPrix(b)}x&\\leqslant${T}\\\\
${texPrix(b)}x&\\leqslant ${T}-${a}${sp(8)} \\text{(On retranche ${a} à chaque membre)} \\\\
${texPrix(b)}x&\\leqslant ${T - a}\\\\
x&\\leqslant \\dfrac{${T - a}}{${texPrix(b)}}${sp(8)}\\text{(On divise par ${texPrix(b)}  chaque membre)}
\\end{aligned}$
<br>
Le plus grand entier inférieur ou égal à $\\dfrac{${T - a}}{${texPrix(b)}}$ est $${Math.floor((T - a) / b)}$.<br>
Avec la formule A, ${P} pourra faire au maximum $${Math.floor((T - a) / b)}$ séances.<br><br>
Pour la formule B, on cherche $x$ tel que $g(x)\\leqslant${T}$.<br>
$\\begin{aligned}
${c}+${texPrix(d)}x&\\leqslant${T}\\\\
${texPrix(d)}x&\\leqslant ${T}-${c}${sp(8)} \\text{(On retranche ${c} à chaque membre)} \\\\
${texPrix(d)}x&\\leqslant ${T - c}\\\\
x&\\leqslant \\dfrac{${T - c}}{${texPrix(d)}}${sp(8)} \\text{(On divise par ${texPrix(d)} chaque membre)}
\\end{aligned}$
<br>
Le plus grand entier inférieur ou égal à $\\dfrac{${T - c}}{${texPrix(d)}}$ est $${Math.floor((T - c) / d)}$.<br>
Avec la formule B, ${P} pourra faire au maximum $${Math.floor((T - c) / d)}$ séances.<br><br>`

            if (Math.floor((T - c) / d) === Math.floor((T - a) / b)) {
              correction3 += `Les deux formules permettent autant de séances avec un budget de $${T}$ €.<br><br>`
            } else {
              correction3 += `${texteGras('Conclusion : ')}  ${Math.floor((T - c) / d) > Math.floor((T - a) / b) ? 'La formule B ' : 'La formule A'} permet de faire plus de séances, elle est plus avanatgeuse pour ${P}.`
            }

            correction4 = ` La formule B est plus avantageuse que la formule A lorsque $g(x)$ est strictement inférieure à $f(x)$.<br>
            ${sp(8)} $\\begin{aligned}
            ${c}+${texPrix(d)}x&<${a}+${texPrix(b)}x\\\\
            ${texPrix(d)}x&< ${a}+${texPrix(b)}x-${c}${sp(8)}\\text{(On retranche ${c} à chaque membre)} \\\\
            ${texPrix(d)}x-${texPrix(b)}x&< ${a - c}${sp(8)}\\text{(On retranche ${texPrix(b)}  }x\\text{ à chaque membre)} \\\\
            ${texPrix(d - b)}x&<${a - c}\\\\
            x&> \\dfrac{${a - c}}{${texPrix(d - b)}}${sp(8)}\\text{(On divise par } ${texNombre(d - b, 2)}   < 0 \\text{  chaque membre)}\\\\
            x&> \\dfrac{${c - a}}{${texPrix(b - d)}} \\end{aligned}$<br>
            Le plus grand entier supérieur  à $\\dfrac{${c - a}}{${texPrix(b - d)}}$ est $${Math.floor((a - c) / (d - b)) + 1}$.<br>
            La formule B est plus intéressante que la formule A à partir de $${Math.floor((a - c) / (d - b)) + 1}$  séances.<br><br>
            On retrouve ce résultat avec un graphique : ci-dessous, on a tracé en bleu la représentation graphique de $f$ et en rouge celle de $g$.<br>
            La droite rouge passe bien en dessous de la bleue à partir de l'entier $x=${Math.floor((a - c) / (d - b)) + 1}$.
            ${graphique}`
            this.listeQuestions = [question1, question2, question3, question4]
            this.listeCorrections = [correction1, correction2, correction3, correction4]
          }
          break
        case 'typeE2':// location de voitures
          {
            const a = randint(80, 120) // forfait
            const c = new Decimal(randint(41, 65, [50, 60])).div(100)// prix /km
            const c1 = Math.round(c * 100) / 100
            const km = randint(7, 10) * 100// km max
            const d = randint(50, 400)// nbre km
            const prix = new Decimal(c).mul(d).add(a)// prix payé
            const prix2 = Math.round(prix, 0)
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const A = point(0.01 * (prix - a) / c, 0.01 * prix)
            const Ax = point(A.x, 0)
            const Ay = point(0, A.y)
            const sAAx = segment(A, Ax)
            const sAAy = segment(A, Ay)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            sAAy.epaisseur = 2
            sAAy.pointilles = 5
            const TexteX = texteParPosition('km', 9, 0.5, 0, 'black', 1.5)
            const TexteY = texteParPosition('Prix (€)', 1.2, 5.5, 0, 'black', 1.5)
            const TexteVal1 = texteParPosition(`${texNombre(d, 0)}`, 0.01 * (prix - a) / c, -1, 0, 'black', 1.5)
            const TexteVal2 = texteParPosition(`${stringNombre(prix, 2)}`, -1.8, prix * 0.01, 0, 'black', 1.5)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 600,
              xMax: 1000,
              xUnite: 0.01,
              yUnite: 0.01,
              thickHauteur: 0.1,
              xLabelMin: 100,
              yLabelMin: 100,
              xLabelMax: 900,
              yLabelMax: 590,
              yThickDistance: 100,
              xThickDistance: 100,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleYDistance: 100,
              grilleXDistance: 100,
              grilleSecondaire: true,
              grilleSecondaireYDistance: 100,
              grilleSecondaireXDistance: 100,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 600,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 1000
            })

            const f = x => a + c1 * x
            const Cg = droiteParPointEtPente(point(0, prix2), 0, '', 'red')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -3,
              xmax: 11,
              ymin: -1.5,
              ymax: 6,
              pixelsParCm: 30,
              scale: 1,
              style: 'margin: auto'
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }), Cg, TexteX, TexteY
            , r1, o, sAAx, sAAy, TexteVal1, TexteVal2)
            this.introduction = `  Une société de location de véhicules particuliers propose le tarif suivant pour un week-end de location :<br>
          ${texteGras('TARIF WEEK-END :')}  forfait de $${a}$ € puis $${texNombre(c, 2)}$ € par km parcouru (dans la limite de $${texNombre(km, 0)}$ km).<br>
          On note $x$ le nombre de km parcourus par un client au cours d'un week-end et on considère la fonction $T$ qui à chaque valeur de $x$ associe le prix payé par le client.<br>`
            question1 = 'Donner l\'ensemble de définition de la fonction $T$.'
            question2 = ' Exprimer $T(x)$ en fonction de $x$.'
            question3 = ` Résoudre l'équation $T(x)=${texNombre(prix, 2)}$.
          Interpréter ce résultat dans le contexte de l'exercice. `
            correction1 = `   On ne peut pas faire plus de $${texNombre(km)}$ km durant le week-end, ainsi l'ensemble de 
            définition de la fonction $T$ est $[0\\,;\\,${km}]$.`
            correction2 = ` Le tarif  comprend un forfait fixe et un tarif par km parcouru. <br>
          Ainsi, le montant de la location est  : 
          Forfait + Coût d'un km $\\times$ Nombre de km parcourus, soit $T(x)=${a}+${texNombre(c, 2)}x$.`
            correction3 = ` On résout l'équation  $T(x)=${texNombre(prix, 2)}$.<br>
          $\\begin{aligned}
          ${a}+${texNombre(c, 2)}x&=${texNombre(prix, 2)}\\\\
          ${texNombre(c, 2)}x&= ${texNombre(prix, 2)}-${a}${sp(8)} \\text{(On retranche ${a} à chaque membre)} \\\\
x&=\\dfrac{${texNombre(prix - a, 2)}}{${texNombre(c, 2)}}${sp(8)}\\text{(On divise par ${texNombre(c, 2)}  chaque membre)}\\\\
x&=${texNombre(d, 0)}
\\end{aligned}$<br>
L'équation a pour solution $${texNombre(d, 2)}$.<br>
On peut dire que lorsque le prix payé pour la location est $${texNombre(prix, 2)}$ €, le client a parcouru $${texNombre(d, 0)}$ km durant le week-end.<br>
On retrouve ce résultat graphiquement. Ci-dessous, la droite bleue représente la fonction $f$. <br>

`
            correction3 += `${graphique}`
            this.listeQuestions = [question1, question2, question3]
            this.listeCorrections = [correction1, correction2, correction3]
          }
          break
        case 'typeE3':// distance de freinage
          {
            const a = new Decimal(randint(2011, 2035)).div(10) //
            const a1 = Math.round(a * 100) / 100 //
            const b = randint(30, 80)
            const v = randint(70, 100) //
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const TexteX = texteParPosition('v (en km/h)', 12, 0.5, 0, 'black', 1.5)
            const TexteY = texteParPosition('d (en m)', 1.8, 9.5, 0, 'black', 1.5)
            const A = point(0.1 * Math.sqrt(a * b), 0.1 * b)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const TexteVal1 = texteParPosition(`${texNombre(Math.round(Math.sqrt(b * a), 0))}`, A.x, -1, 0, 'black', 1.5)
            const TexteVal2 = texteParPosition(`${texNombre(b, 0)}`, -1.5, A.y, 0, 'black', 1.5)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 100,
              xMax: 130,
              xUnite: 0.1,
              yUnite: 0.1,
              thickHauteur: 0.1,
              xLabelMin: 10,
              yLabelMin: 10,
              xLabelMax: 120,
              yLabelMax: 90,
              yThickDistance: 10,
              xThickDistance: 10,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleYDistance: 10,
              grilleXDistance: 10,
              grilleSecondaire: true,
              grilleSecondaireYDistance: 10,
              grilleSecondaireXDistance: 10,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 100,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 130
            })
            const f = x => x ** 2 / a1
            const Cg = droiteParPointEtPente(point(0, b), 0, '', 'red')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -2.5,
              xmax: 14.5,
              ymin: -2,
              ymax: 10,
              pixelsParCm: 30,
              scale: 0.75,
              style: 'margin: auto'
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }), Cg, TexteX, TexteY
            , r1, o, sAAx, TexteVal1, TexteVal2)
            this.introduction = `  Sur toute sèche, la distance de freinage en mètres, d'une voiture est modélisée de la façon suivante : <br>
          En notant $v$ la vitesse du véhicule (en km/h), sa distance de freinage $d(v)$  (en m) est donnée par le carré de sa vitesse divisée par $${texNombre(a, 1)}$.`
            question1 = ' Donner l\'expression de $d(v)$ en fonction de $v$. '
            question2 = ` Calculer au mètre près, la distance de freinage de la voiture si elle roule à $${v}$ km/h.`
            question3 = ' La distance de freinage est-elle proportionnelle à la vitesse ?'
            question4 = `  La distance de freinage de cette voiture a été de $${b}$ m. Quelle était sa vitesse en km/h arrondie à l'unité ? `
            correction1 = ` Le carré de la vitesse est $v^2$, donc la fonction $d$ est définie par : $d(v)=\\dfrac{v^2}{${texNombre(a, 1)}}$. `
            correction2 = ` $d(${v})=\\dfrac{${v}^2}{${texNombre(a, 1)}}\\simeq ${Math.round(v ** 2 / a, 0)}$. La distance de freinage est d'environ $${Math.round(v ** 2 / a, 0)}$.`
            correction3 = ' La distance de freinage n\'est pas proportionnelle à la vitesse car la fonction $d$ n\'est pas une fonction linéaire. Elle ne traduit pas une situation de proportionnalité.'
            correction4 = `   On cherche $v$ tel que $d(v)=${b}$.<br>
                    $\\begin{aligned}
\\dfrac{v^2}{${texNombre(a, 1)}}&=${b}\\\\
v^2&=${b} \\times ${texNombre(a, 2)} ${sp(8)} \\text{(On mutiplie par ${texNombre(a, 1)} chaque membre)} \\\\
v^2&= ${texNombre(b * a, 2)}\\\\
v&= -\\sqrt{${texNombre(b * a, 2)}} ${sp(8)} \\text{ou} ${sp(8)} v= \\sqrt{${texNombre(b * a, 2)}}${sp(8)}\\text{(deux nombres ont pour carré } ${texNombre(b * a, 2)} \\text{)}
\\end{aligned}$<br>
Puisque $v$ est un nombre positif, on en déduit $v= \\sqrt{${texNombre(b * a, 2)}}\\simeq ${Math.round(Math.sqrt(b * a), 0)}$.<br>
Lorsque la distance de freinage de la voiture est $${b}$ m, sa vitesse est alors d'environ $${Math.round(Math.sqrt(b * a), 0)}$ km/h.<br>
Voici la courbe représentative de la fonction $d$ avec la solution de la question précédente lue graphiquement. <br>`
            correction4 += `${graphique}`
            this.listeQuestions = [question1, question2, question3, question4]
            this.listeCorrections = [correction1, correction2, correction3, correction4]
          }
          break

        case 'typeE4':// abonnement à une revue
          {
            const nom = choice(nomF)
            const a = randint(6, 10) * 1000 //
            const b = choice([40, 50, 80, 100])
            const c = randint(31, 49) * 100 //
            const d = randint(30, 39) * 10
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const TexteX = texteParPosition('Prix de l\'abonnement (en €)', 11, -2, 0, 'black', 1.5)
            const TexteY = texteParPosition('Nombre d\'abonnés', 1.5, 10.5, 0, 'black', 1.5)
            const A = point(0.05 * (a - c) / b, 0.001 * c)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const TexteVal1 = texteParPosition(`${stringNombre((a - c) / b, 1)}`, A.x, -1.5, 0, 'black', 1.5)
            const TexteVal2 = texteParPosition(`${c}`, -2.5, A.y, 0, 'black', 1.5)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 10000,
              xMax: 300,
              xUnite: 0.05,
              yUnite: 0.001,
              thickHauteur: 0.1,
              xLabelMin: 50,
              yLabelMin: 1000,
              xLabelMax: 300,
              yLabelMax: 9000,
              yThickDistance: 1000,
              yLabelEcart: 1,
              xThickDistance: 50,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleYDistance: 1000,
              grilleXDistance: 50,
              grilleSecondaire: true,
              grilleSecondaireYDistance: 500,
              grilleSecondaireXDistance: 50,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 10000,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 300
            })
            const f = x => a - b * x
            const Cg = droiteParPointEtPente(point(0, c), 0, '', 'red')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -4,
              xmax: 17,
              ymin: -3,
              ymax: 11.5,
              pixelsParCm: 25,
              scale: 0.7,
              style: 'margin: auto'
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }), Cg, TexteX, TexteY
            , r1, o, sAAx, TexteVal1, TexteVal2)
            this.introduction = ` Le nombre d’abonnés à une revue dépend du prix de l’abonnement à cette revue, prix exprimé en euros.<br>
          On considère que l’on a la relation : <br>
          nombre d’abonnés $= ${texNombre(a)} - ${b} \\times$ prix de l'abonnement en euros.<br>
          Soit $${nom}$ la fonction qui donne le nombre d’abonnés en fonction du prix de l’abonnement annuel à cette revue.`
            question1 = `Déterminer l’expression algébrique de $${nom}$. Préciser la variable.`
            question2 = ' Que peut-on dire du nombre d\'abonnés lorsque le prix de l\'abonnement augmente ?'
            question3 = ` Expliquer pourquoi le prix de l’abonnement ne doit pas être de $${d}$ €. Déterminer l'ensemble de définition de la fonction $${nom}$.`
            question4 = ` La directrice des abonnements souhaite avoir $${texNombre(c)}$ abonnés à la revue. Quel doit être le prix de l’abonnement ?`
            question5 = ` On obtient la recette de la vente de $x$ abonnements en multipliant le nombre d'abonnés par le prix d'un abonnement. <br>
          Exprimer la recette en fonction du prix de l’abonnement sous forme développée.`

            correction1 = ` En notant $x$ la variable, l'expression algébrique de $${nom}$ est : $${nom}(x)=${texNombre(a)}-${b}x$.`
            correction2 = ` La relation $${nom}(x)=${texNombre(a)}-${b}x$ montre que lorsque le prix de l'abonnement $x$ augmente, le nombre d'abonnés $${nom}(x)$ diminue. <br>
          Plus précisément, à chaque hausse de $1$ €, le nombre d'abonnés diminue de $${b}$ (coefficient devant $x$).`
            correction3 = ` Pour un montant de $${d}$ € de l'abonnement, on obtient $${nom}(${d})=${texNombre(a, 0)}-${b}\\times ${d}=${texNombre(a - b * d, 0)}$.<br>
          On obtiendrait alors un nombre d'abonnés négatif ce qui est impossible. On ne peut donc pas fixer le montant de l'abonnement à $${d}$ €.<br>
          On cherche la valeur de $x$ donnant un nombre d'abonnés nul en résolvant l'équation $${nom}(x)=0$ :<br>
          $\\begin{aligned}
          ${texNombre(a)}-${b}x&=0\\\\
         - ${b}x&= -${texNombre(a)}${sp(8)} \\text{(On retranche ${texNombre(a)} à chaque membre)} \\\\
x&=\\dfrac{${texNombre(-a)}}{${-b}}${sp(8)}\\text{(On divise par } ${-b} \\text{ chaque membre)}\\\\
x&=\\dfrac{${texNombre(a)}}{${b}}\\\\
x&=${texNombre(a / b, 2)}
\\end{aligned}$<br>
On en déduit que le montant de l'abonnement doit se situer entre $0$ € et $${texNombre(a / b, 2)}$ €. <br>
Par conséquent l'ensemble de définition de la fonction $${nom}$ est : $[0\\,;\\,${texNombre(a / b, 2)}]$.`

            correction4 = ` On cherche la valeur de $x$  afin que $${nom}(x)=${texNombre(c)}$.<br>
          $\\begin{aligned}
          ${texNombre(a)}-${b}x&=${texNombre(c)}\\\\
         - ${b}x&= ${texNombre(c)}-${a}${sp(8)} \\text{(On retranche ${texNombre(a)} à chaque membre)} \\\\
x&=\\dfrac{${texNombre(-a + c)}}{${-b}}${sp(8)}\\text{(On divise par } ${-b} \\text{ chaque membre)}\\\\
x&=\\dfrac{${texNombre(a - c)}}{${b}}\\\\
x&=${texNombre((a - c) / b, 2)}
\\end{aligned}$<br>
Pour avoir $${texNombre(c)}$ abonnés, la directrice des abonnements doit fixer le prix de l'abonnement à $${texPrix((a - c) / b)}$ €.`

            correction5 = ` Comme $x$ désigne le montant de l'abonnement et $${nom}(x)$ le nombre d'abonnés, le produit du nombre d'abonnés par le prix d'un abonnement est $${nom}(x)\\times x$, soit $(${texNombre(a)}-${b}x)\\times x$.<br>
          Son expression développée est :  $${texNombre(a)}x-${b}x^2$.<br><br>

          Voici la représentation graphique de la fonction $${nom}$ (en bleu) avec la réponse graphique à la question ${numAlpha(3)} : <br>

                `
            correction5 += `${graphique}`
            this.listeQuestions = [question1, question2, question3, question4, question5]
            this.listeCorrections = [correction1, correction2, correction3, correction4, correction5]
          }
          break

        case 'typeE5':// station service
          {
            const a = new Decimal(randint(150, 200)).div(100) //
            const a1 = Math.round(a * 100) / 100 //
            const b = randint(3, 6)
            const c = choice([40, 45, 50, 55, 60, 65, 70])
            const d = randint(b, c)
            const prix = new Decimal(a).mul(d)
            const prix1 = Math.round(prix * 100) / 100
            const P = prenom()
            const nom = choice(nomF)
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const TexteX = texteParPosition('Nombre de litres', 11, -1.7, 0, 'black', 1.5)
            const TexteY = texteParPosition('Prix payé (en €)', 1.2, 11.5, 0, 'black', 1.5)
            const A = point(0.2 * d, 0.08 * prix)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const TexteVal1 = texteParPosition(`${texNombre(d, 2)}`, A.x, -1, 0, 'black', 1.5)
            const TexteVal2 = texteParPosition(`${stringNombre(prix, 2)}`, -2, A.y, 0, 'black', 1.5)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 140,
              xMax: 70,
              xUnite: 0.2,
              yUnite: 0.08,
              thickHauteur: 0.1,
              xLabelMin: 10,
              yLabelMin: 10,
              xLabelMax: 70,
              yLabelMax: 130,
              yLabelEcart: 0.8,
              yThickDistance: 10,
              xThickDistance: 10,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleYDistance: 10,
              grilleXDistance: 10,
              grilleSecondaire: true,
              grilleSecondaireYDistance: 10,
              grilleSecondaireXDistance: 10,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 140,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 70
            })
            const f = x => a1 * x
            const Cg = droiteParPointEtPente(point(0, prix1), 0, '', 'red')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -3,
              xmax: 16,
              ymin: -2.5,
              ymax: 12.5,
              pixelsParCm: 30,
              scale: 0.7,
              style: 'margin: auto'
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }), Cg, TexteX, TexteY
            , r1, o, sAAx, TexteVal1, TexteVal2)
            this.introduction = `  Dans une station service, le prix de l'essence sans plomb 95 est de $${texNombre(a)}$ € le litre.<br>
Dans cette station, il n'est pas possible de prendre moins de $${b}$ litres d'essence.<br>
${P} fait le plein de sa voiture dans cette station service. Le réservoir de sa voiture est vide et peut contenir au maximum $${c}$ litres.<br>

On note $x$ le nombre de litres que met ${P} pour faire le plein du réservoir  de sa voiture. <br>
On considère la fonction $${nom}$ qui associe à chaque valeur de $x$, le prix payé en euros par ${P}.`

            question1 = `Donner l'ensemble de définition de la fonction $${nom}$. `
            question2 = ` Déterminer l'expression algébrique de la fonction $${nom}$ (c'est-à-dire l'expression de $${nom}(x)$ en fonction de $x$).`
            question3 = ' Le prix payé est-il proportionnel au nombre de litres mis dans le réservoir ? Justifier.'
            question4 = `  Résoudre l'équation $${nom}(x)=${texNombre(prix, 2)}$. Interpréter ce résultat dans le contexte de l'exercice. `
            correction1 = ` Le minimum de litres que ${P} peut mettre est  $${b}$ et le maximum est $${c}$. <br>
            L'ensemble de définition de $${nom}$ est donc $[${b}\\,;\\,${c}]$.`
            correction2 = ` Pour obtenir le prix payé, on multiplie le nombre de litres par le prix d'un litre. <br>
            Ainsi, l'expression algébrique de $${nom}$ est : $${nom}(x)=${texNombre(a, 2)}\\times x$, soit $${nom}(x)=${texNombre(a, 2)}x$.`
            correction3 = ` Le prix payé est proportionnel au nombre de litres. La fonction $${nom}$ est une fonction linéaire traduisant une situation de proportionnalité.`
            correction4 = `   On cherche $x$ tel que $${nom}(x)=${texNombre(prix, 2)}$.<br>
            $\\begin{aligned}
                      ${texNombre(a, 2)}x&=${texNombre(prix, 2)}\\\\
  x&=\\dfrac{${texNombre(prix, 2)}}{${texNombre(a, 2)}} ${sp(8)} \\text{(On divise par ${texNombre(a, 2)} chaque membre)} \\\\
  x&= ${d}
    \\end{aligned}$<br>
  Pour $${d}$ litres mis dans le réservoir, le coût est de  $${texNombre(prix, 2)}$ €.<br>
  Voici la courbe représentative de la fonction $${nom}$ avec la solution de la question précédente lue graphiquement.<br>
  La fonction $${nom}$ est représentée par une droite passant par l'origine du repère (caractéristique d'une situation de proportionnalité).<br>
  
         `
            correction4 += `${graphique}`
            this.listeQuestions = [question1, question2, question3, question4]
            this.listeCorrections = [correction1, correction2, correction3, correction4]
          }
          break

        case 'typeE6':// restaurateur recette après une hausse
          {
            const a = randint(18, 22) //
            const b = randint(28, 31) * 10
            const c = randint(7, 11)
            const d = randint(20, 25)
            const h = randint(2, 6)
            const nom = choice(nomF)

            this.introduction = `  Le patron d'un restaurant sait parfaitement que, dans son établissement, le nombre de couverts, lors du repas de midi,
          dépend du prix de son menu.<br>
          L’étude de marché qu’il a fait réaliser a permis de modéliser le lien entre le prix du menu et le nombre de couverts
          de la façon suivante :<br>
          $\\bullet$ En vendant $${a}$ € son menu (prix initialement proposé), il sert $${b}$ couverts.<br>
          $\\bullet$ Chaque hausse de $1$ € du prix du menu diminue le nombre de couverts de $${c}$.<br>
          On note $x$ le montant de la hausse proposée du prix du menu (en €) par rapport au
          prix initial qui était de $${a}$ € et $${nom}(x)$ la recette correspondante. <br>
          On admet que $0 \\leqslant x \\leqslant ${d}$.`
            question1 = `Donner l'ensemble de définition de la fonction $${nom}$.`
            question2 = ` Pour une hausse  de $${h}$ €, donner le prix du menu, le nombre de couverts servis et la recette (en €) du restaurateur (obtenu par le produit du prix d'un menu par le nombre de couverts servis).`
            question3 = ' Exprimer en fonction de $x$ le prix du menu après une hausse de $x$ €.'
            question4 = ' Exprimer en fonction de $x$ le nombre de couverts servis après une hausse de $x$ €.'
            question5 = ` En déduire la recette $${nom}(x)$ réalisée après une hausse du prix du menu de $x$ € et montrer qu’elle peut
            s’exprimer sous la forme :  $${nom}(x) = ${-c}x^2 + ${b - a * c}x + ${texNombre(a * b, 0)}$.
           `
            correction1 = ` L'ensemble de définition est donné par l'énoncé ($0 \\leqslant x \\leqslant ${d}$). <br>
            L'ensemble de définition de $${nom}$ est donc $[0\\,;\\,${d}]$.`

            correction2 = ` Après une hausse de $${h}$ € :<br>
            $\\bullet$  le prix du menu est $${a}+${h}=${a + h}$ € ;<br>
            $\\bullet$  le nombre de couverts est $${b}-${c}\\times ${h}=${b - c * h}$ ;<br>
            $\\bullet$  la recette  est $${a + h}\\times ${b - c * h}=${texNombre((a + h) * (b - c * h), 0)}$ €.`

            correction3 = `Le prix du menu après une augmentation de $x$ € est $${a}+x$.`

            correction4 = ` Puisqu'à chaque hausse de $1$ €, le nombre de couverts diminue de $${c}$, on en déduit que le nombre de couverts après une hausse de $x$  € est $${b}-${c}\\times x$ soit $${b}-${c}x$.`

            correction5 = ` La recette est donnée par le produit du prix d'un menu par le nombre de menu, soit : <br>
             $\\begin{aligned}
             (${a}+x)\\times (${b}-${c}x)&=${texNombre(a * b, 0)}-${a * c}x+${b}x-${c}x^2\\\\
             &=-${c}x^2+${b - a * c}x+${texNombre(a * b, 0)}
             \\end{aligned}$
         `
            this.listeQuestions = [question1, question2, question3, question4, question5]
            this.listeCorrections = [correction1, correction2, correction3, correction4, correction5]
          }
          break

        case 'typeE7':// la moto
          {
            const a = new Decimal(randint(-5, -2)) //
            const b = new Decimal(randint(-15, -10)).div(10)
            const c = new Decimal(randint(-39, -25)).div(10)
            const P = prenomM()
            const nom = choice(nomF)
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const TexteX = texteParPosition('Temps (en s)', 6, -0.7, 0, 'black', 1.2)
            const TexteY = texteParPosition('Hauter (en m)', 1.5, 7, 0, 'black', 1.2)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 3,
              xMax: 5,
              xUnite: 2,
              yUnite: 2,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickMax: 0,
              yThickMax: 0

            })
            const f = x => -0.5 * (x + 1) * (x - 4)

            const graphique = mathalea2d({
              xmin: -1,
              xmax: 13,
              ymin: -1.2,
              ymax: 7.5,
              pixelsParCm: 20,
              scale: 0.7,
              style: 'margin: auto'
            }, courbe(f, {
              repere: r1,
              xMin: 0,
              xMax: 4,
              color: 'blue',
              epaisseur: 2
            }), TexteX, TexteY
            , r1, o)
            this.introduction = `  Lors d’une course en moto-cross, après avoir franchi une rampe, ${P} a effectué un saut en moto.<br>
          On note $t$ la durée (en secondes) de ce saut. Le saut commence dès que ${P} quitte la rampe c'est-à-dire lorsque $t=0$.<br>
          La hauteur (en mètres) est déterminée en fonction de la durée $t$ par la fonction $${nom}$ suivante :  $${nom}(t)=(${texNombre(a, 3)}t${texNombre(b, 2)})(t${texNombre(c, 2)})$<br>
          Voici la courbe représentative de cette fonction $${nom}$ :<br>
          `
            this.introduction += `${graphique}
          `
            question1 = ` Calculer $${nom}(4)$. Que peut-on en déduire ?`
            question2 = `  À quelle hauteur ${P} se trouve-t-il lorsqu'il quitte la rampe ?`
            question3 = `  Combien de temps dure le saut de ${P} ?`
            question4 = `  Développer et réduire l'expression de $${nom}$.`

            correction1 = `${numAlpha(0)} $${nom}(4)=(${texNombre(a, 3)}\\times 4${texNombre(b, 2)})(4 ${texNombre(c, 2)})=
          ${texNombre(a.mul(4).plus(b), 2)}\\times ${texNombre(c.plus(4), 2)}
          =${texNombre((a.mul(4).plus(b)) * (c.plus(4)), 2)}$<br>
          Comme le résultat est négatif, on en déduit que le saut dure moins de $4$ secondes.`
            correction2 = ` La hauteur du début du saut est donnée par : $${nom}(0)=(${texNombre(a, 3)}\\times 0${texNombre(b, 2)})(0 ${texNombre(c, 2)})
            =${texNombre(b.mul(c), 2)}$.<br>
             ${P} se trouve à $${texNombre(b.mul(c), 2)}$ mètres au début du saut.`
            correction3 = ` Le saut commence à $t=0$ et se termine lorsque ${P} se retrouve au sol, c'est-à-dire lorsque la hauteur est nulle. <br>
            Ainsi, le temps du saut est donnée par la solution positive de l'équation $(${texNombre(a, 3)}t${texNombre(b, 2)})(t${texNombre(c, 2)})=0$<br>
            Il s'agit d'une équation produit nul qui a deux solutions : $t_1= ${texNombre(-b.div(a), 2)}$   et   $t_2= ${texNombre(-c, 2)}$.  <br>
            Le saut dure  $${texNombre(-c, 2)}$ secondes.`
            correction4 = `On développe en utilisant la double distributivité :<br>
            $${nom}(t)=(${texNombre(a, 3)}t${texNombre(b, 2)})(t${texNombre(c, 2)})=${texNombre(a, 3)}t^2+${texNombre(a.mul(c), 3)}t${texNombre(b, 2)}t+${texNombre(b.mul(c), 2)}=${texNombre(a, 3)}t^2+${texNombre(a.mul(c).plus(b), 2)}t+${texNombre(b.mul(c), 2)}$.       
         `
            this.listeQuestions = [question1, question2, question3, question4]
            this.listeCorrections = [correction1, correction2, correction3, correction4]
          }
          break

        case 'typeE8':// pression artérielle
          {
            const a = randint(100, 120)
            const b0 = randint(90, 98)
            const a1 = randint(10, 14) * 10
            const b1 = randint(60, 75) * 2
            const a2 = randint(25, 27) * 10
            const b2 = randint(48, 53) * 2
            const a3 = randint(38, 42) * 10
            const b3 = randint(55, 60) * 2
            const a4 = randint(50, 52) * 10
            const b4 = randint(43, 47) * 2
            const a5 = randint(56, 65) * 10
            const b5 = b4 + 5
            const nom = choice(nomF)
            const o = texteParPosition('$O$', 0, 15.5, 0, 'black', 1)
            const TexteX = texteParPosition('Pression artérielle en mmHg', 150 * 0.03, 155 * 0.2, 0, 'black', 1.2)
            const TexteY = texteParPosition('Temps (en ms)', 670 * 0.03, 72 * 0.2, 0, 'black', 1.2)

            const r1 = repere({
              xMin: 0,
              yMin: 80,
              yMax: 150,
              xMax: 800,
              xUnite: 0.03,
              yUnite: 0.2,
              xThickDistance: 50,
              yThickDistance: 10,
              xLabelMin: 0,
              yLabelMin: 80,
              yLabelEcart: 1,
              grilleXDistance: 50,
              grilleYDistance: 10,
              grilleXMin: 0,
              grilleYMin: 80,
              grilleXMax: 800,
              grilleYMax: 150,
              grilleSecondaireX: true,
              grilleSecondaireXDistance: 50,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 800,
              grilleSecondaireY: true,
              grilleSecondaireYDistance: 2,
              grilleSecondaireYMin: 80,
              grilleSecondaireYMax: 150
            })

            const gr = courbeInterpolee(
              [
                [0, b0], [a1, b1], [a2, b2], [a3, b3], [a4, b4], [a5, b5]
              ],
              {
                color: 'blue',
                epaisseur: 2,
                repere: r1,
                xMin: 0,
                xMax: 650
              })

            const graphique = mathalea2d({
              xmin: -2,
              xmax: 24,
              ymin: 15,
              ymax: 32,
              pixelsParCm: 20,
              scale: 0.5,
              style: 'margin: auto'
            }, TexteX, TexteY
            , r1, o, gr)
            this.introduction = `  La tonométrie artérielle permet d’obtenir une mesure continue de la pression artérielle. L’examen renseigne sur
          l’état des artères du patient dans le cadre du développement de l’hypertension artérielle. <br>
          Un enregistrement des mesures permet d’apprécier la courbe de pression artérielle.<br>
          On note $${nom}$ la fonction qui au temps $t$ en millisecondes (ms) associe la pression artérielle radiale $${nom}(t)$ en millimètres
          de mercure (mmHg), mesurée au repos chez un patient suspecté d’insuffisance cardiaque. On donne la courbe représentative de $${nom}$ ci-dessous.<br>`
            this.introduction += ` <br>
          ${graphique}`
            question1 = `Quel est l'ensemble de définition de $${nom}$.`
            question2 = ' Quelle inéquation a pour ensemble de solution l\'imtervalle de temps pendant lequel la pression artérielle est supérieure ou égale à $130$ mmHg ?'
            question3 = ' Déterminer la valeur systolique mesurée, c’est-à-dire la valeur maximale de la pression artérielle.'
            question4 = '  Déterminer la valeur diastolique mesurée, c’est-à-dire la valeur minimale de la pression artérielle.'
            question5 = `  Un patient est en hypertension artérielle lorsque la pression systolique est supérieure ou égale à $140$ mmHg
                    ou que la pression diastolique est supérieure ou égale à $90$ mmHg.<br>
                    Ce patient est-il en hypertension ? Justifier.`
            question6 = ` La fonction $${nom}$ a été représentée sur un intervalle de temps  correspondant à celui
                    d’un battement de cœur du patient.<br>On parle de tachycardie lorsque, au repos, le nombre de battements du cœur est supérieur à $100$ par minute. <br>
                    D’après cet examen, peut-on estimer que le patient souffre de tachycardie ?`

            correction1 = `L'ensemble de définition de $${nom}$ est $[0\\,;\\, ${a5}]$. `
            correction2 = ` L'inéquation ayant pour ensemble de solution l'imtervalle de temps pendant lequel la pression artérielle est supérieure ou égale à $${a}$ mmHg est $${nom}(t)\\geqslant ${a}$.`
            correction3 = ` La valeur systolique mesurée est est donnée par l'ordonnée du point le plus haut de la courbe : $${b1}$ mmHg.`
            correction4 = `  La valeur diastolique mesurée est est donnée par l'ordonnée du point le plus bas de la courbe : $${b4}$ mmHg.`
            correction5 = `   La valeur systolique est $${b1}$ mmHg, la valeur diastolique est $${b4}$ mmHg. <br>
                              `
            if (b1 >= 140 || b4 >= 90) {
              if (b1 >= 140 || b4 < 90) {
                correction5 += `Comme $${b1} \\geqslant 140$, le patient est en hypertension artérielle.<br>`
              } else {
                correction5 += `Comme $${b4} \\geqslant 90$, le patient est en hypertension artérielle.<br>`
              }
            } else {
              correction5 += `Comme $${b4} < 90$ et $${b1} < 140$, le patient n'est pas en hypertension artérielle.<br>`
            }
            correction6 = `
                               L'intervalle de temps est $[0\\,;\\, ${a5}]$, le temps d'un battement de cœur est donc $${a5}$ ms.<br>
                              Comme $${a5}$ ms $=${texNombre(a5 / 1000, 3)}$ s, en notant $n$ le nombre de battements en $1$ minute, on obtient le tableau de proportionnalité suivant :<br>
                              $\\begin{array}{|c|c|c|}\n`
            correction6 += '\\hline\n'
            correction6 += '\n\\text{Nombre de battements} &1 &n   \\\\\n '
            correction6 += '\\hline\n'
            correction6 += `\n \\text{Temps (en s)}&${texNombre(a5 / 1000, 3)}&60  \\\\\n `
            correction6 += '\\hline\n'
            correction6 += '\\end{array}\n$'

            correction6 += `<br>
                              $n=\\dfrac{60\\times 1}{${texNombre(a5 / 1000, 3)}}\\simeq ${texNombre(60 * 1000 / a5, 0)}$.<br>`
            if (60 * 1000 / a5 > 100) {
              correction6 += `Comme $${texNombre(60 * 1000 / a5, 0)}>100$, ce patient souffre de tachycardie.`
            } else {
              correction6 += `Comme $${texNombre(60 * 1000 / a5, 0)}\\leqslant 100$, ce patient ne souffre pas de tachycardie.`
            }
            this.listeQuestions = [question1, question2, question3, question4, question5, question6]
            this.listeCorrections = [correction1, correction2, correction3, correction4, correction5, correction6]
          }
          break

        case 'typeE9':// alcool dans le sang
          {
            const a = randint(17, 21) / 10 //
            const b = randint(-10, -5) / 10 //
            const h = choice([11, 12, 13, 17, 18]) //
            const nom = choice(nomF)
            const o = texteParPosition('$O$', -0.3, -0.3, 0, 'black', 1)
            const f = x => a * x * exp(b * x)
            const fprime = x => (a + a * b * x) * exp(b * x)
            const Cg = droiteParPointEtPente(point(0, 5), 0, '', 'red')
            Cg.epaisseur = 2
            const s0 = antecedentParDichotomie(0, 7, fprime, 0, 0.01)
            const s1 = antecedentParDichotomie(0, s0 * 1.5, f, 0.5, 0.01)
            const s2 = antecedentParDichotomie(s0 * 1.5, 6 * 1.5, f, 0.5, 0.01)
            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: f(-1 / b) + 0.2,
              xMax: 10,
              xUnite: 1.5,
              yUnite: 10,
              axeXStyle: '->',
              axeYStyle: '->',
              xThickDistance: 1,
              yThickDistance: 0.1,
              xLabelMin: 0,
              yLabelMin: 0,
              yLabelEcart: 1,
              xLabelEcart: 0.6,
              grilleXDistance: 1,
              grilleYDistance: 1,
              grilleXMin: 0,
              grilleYMin: 0,
              grilleXMax: 10,
              grilleYMax: f(s0) + 0.2
            })

            const A = point(s0 * 1.5, f(s0) * 10)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const Ay = point(0, A.y)
            const sAAy = segment(A, Ay)
            sAAy.epaisseur = 2
            sAAy.pointilles = 5
            const B = point(s1 * 1.5, f(s1) * 10)
            const Bx = point(B.x, 0)
            const sBBx = segment(B, Bx)
            sBBx.epaisseur = 2
            sBBx.pointilles = 5

            const C = point(s2 * 1.5, f(s2) * 10)
            const Cx = point(C.x, 0)
            const sCCx = segment(C, Cx)
            sCCx.epaisseur = 2
            sCCx.pointilles = 5
            const sBxCx = segment(Bx, Cx, 'red')
            sBxCx.epaisseur = 5
            const Texte1 = texteParPosition(`Max = ${stringNombre(Math.round(f(s0) * 100) / 100)}`, -3, A.y, 0, 'red', 1.2)
            const Texte2 = texteParPosition(`${stringNombre(Math.round(s0 * 10) / 10)}`, A.x, -1.3, 0, 'red', 1.2)
            const Texte3 = texteParPosition(`${stringNombre(Math.round(s1 * 10) / 10)}`, B.x, -1.3, 0, 'red', 1.2)
            const Texte4 = texteParPosition(`${stringNombre(Math.round(s2 * 10) / 10)}`, C.x, -1.3, 0, 'red', 1.2)
            const graphique = mathalea2d({
              xmin: -2,
              xmax: 16,
              ymin: -1,
              ymax: (f(s0) + 0.2) * 10,
              pixelsParCm: 30,
              scale: 0.7,
              style: 'margin: auto'
            }, [courbe(f, {
              repere: r1,
              xMin: 0,
              xMax: 10,
              color: 'blue',
              epaisseur: 2
            }),
            r1, o])
            const graphiqueCorr = mathalea2d({
              xmin: -5,
              xmax: 16,
              ymin: -2.5,
              ymax: (f(s0) + 0.2) * 10,
              pixelsParCm: 30,
              scale: 0.7,
              style: 'margin: auto'
            }, [courbe(f, {
              repere: r1,
              xMin: 0,
              xMax: 9,
              color: 'blue',
              epaisseur: 2
            }),
            r1, o, sAAx, sAAy, sCCx, sBBx, sBxCx, Texte1, Texte2, Texte3, Texte4, Cg,
            r1, o])
            this.introduction = `Le Code de la route interdit toute conduite d’un véhicule lorsque le taux d’alcoolémie est supérieur ou égal à $0,5$ g/L.<br>
            Le taux d’alcoolémie d’une personne pendant les $10$ heures suivant la consommation d’une certaine quantité d’alcool est modélisé par la fonction $${nom}$.<br>
          $\\bullet$  $t$ représente le temps (exprimé en heure) écoulé depuis la consommation d’alcool ;<br>
          $\\bullet$  $${nom} (t)$ représente le taux d’alcoolémie (exprimé en g/L) de cette personne.<br>
          On donne la représentation graphique de la fonction $${nom}$ dans un repère. <br>
          
          `
            this.introduction += `${graphique}
          `
            question1 = `
              À quel instant le taux d’alcoolémie de cette personne est-il maximal ? Quelle est alors sa valeur ? Arrondir
            au centième.`
            question2 = `Résoudre graphiquement l'inéquation $${nom}(t)>0,5$.`
            question3 = ` À l'instant $t=0$, il était $${h}$ h. À quelle heure, à la minute près, l’automobiliste peut-il reprendre le volant sans être en infraction ?
           `
            correction1 = `     Le taux d'alcoolémie maximal est atteint lorsque $t=${texNombre(Math.round(s0 * 10) / 10, 1)}$. Sa valeur
            est environ  $${texNombre(Math.round(f(s0) * 100) / 100, 2)}$.`
            correction2 = ` Les solutions de l'inéquation $${nom}(t)>0,5$ sont les abscisses des points de la courbe qui se situent strictement en dessous de la droite d'équation $y=0,5$. <br>
            Cette inéquation a pour ensemble de solution $]${texNombre(Math.round(s1 * 10) / 10, 1)}\\,;\\,${texNombre(Math.round(s2 * 10) / 10, 1)}[$. <br>
              `

            if (Math.round(s2 * 10) / 10 === 2 || Math.round(s2 * 10) / 10 === 3 || Math.round(s2 * 10) / 10 === 4 || Math.round(s2 * 10) / 10 === 5 || Math.round(s2 * 10) / 10 === 6) {
              correction3 = ` ${numAlpha(2)} 11111L'automobiliste peut reprendre la route (sans être en infraction)  $${Math.round(s2 * 10) / 10} \\text{ h }$ après la consommation de l'alcool,
            soit à $${Math.round(s2 * 10) / 10 + h} \\text{ h}$.<br><br>`
            } else {
              correction3 = ` ${numAlpha(2)} $${texNombre(Math.round(s2 * 10) / 10, 1)}\\text{ h } =${Math.floor(s2)} \\text{ h } +${texNombre(Math.round(s2 * 10) / 10 - Math.floor(s2))}\\text{ h }$.<br>
            Or, $${texNombre(Math.round(s2 * 10) / 10 - Math.floor(s2))}\\text{ h }=${texNombre(Math.round(s2 * 10) / 10 - Math.floor(s2))}\\times 60 \\text{ min }=${texNombre((Math.round(s2 * 10) / 10 - Math.floor(s2)) * 60)} \\text{ min }$.<br>
             L'automobiliste peut reprendre la route (sans être en infraction)  $${Math.floor(s2)} \\text{ h }$ et $${texNombre((Math.round(s2 * 10) / 10 - Math.floor(s2)) * 60)} \\text{ min }$ après la consommation de l'alcool,
            soit à $${Math.floor(s2 + h)} \\text{ h }$ et $${texNombre((Math.round(s2 * 10) / 10 - Math.floor(s2)) * 60)} \\text{ min}$.<br><br>`
            }

            correction3 += `${graphiqueCorr} `
            this.listeQuestions = [question1, question2, question3]
            this.listeCorrections = [correction1, correction2, correction3]
          }
          break

        case 'typeE10':// silo à grain
          {
            const m = new Decimal(randint(27, 38, 30)).add(choice([0.2, 0.4, 0.6, 0.8])) // kg de grains mangés par jour
            const p = 5 * m * randint(6, 11)// capacité du silo
            const j = randint(15, 25, 20)// nbre de jours pour l'image
            const ant = m.mul(-1).mul(randint(12, 17)).add(p)// p - m * randint(12, 17)
            const rest = randint(251, 299)

            this.introduction = `  Un éleveur de poulets décide de remplir son silo à grains.<br>
             En notant $t$ le nombre de jours écoulés après avoir rempli son silo à grains et $f(t)$ la masse (en kg) restante 
            au bout de $t$ jours, on a : $f(t)=${texNombre(p, 0)}-${texNombre(m, 1)}t$<br>`
            question1 = `  ${numAlpha(0)} Calculer l'image de $${j}$ par $f$. Interpréter le résultat dans le contexte de l'exercice.<br>
            ${numAlpha(1)} Calculer l'antécédent de $${texNombre(ant, 1)}$ par $f$.<br>`
            question2 = `Sachant que l'éleveur avait rempli son silo au maximum de sa capacité, quelle est la contenance (en kg) du silo ?<br>
           `
            question3 = `  Au bout de combien de jours, l'éleveur sera-t-il à court de grains ? Justifier.<br>
            `
            question4 = ` Quelle quantité de grains en kg consomment les poulets en une journée ?<br>
            `
            question5 = ` Un jour, des renards ont tué la moitié des poulets, divisant par deux la quantité de grains consommée par jour.<br>
            Il lui reste $${rest}$ kg de grains. <br>
            Donner la fonction qui modélise la quantité de grains restante en fonction du nombre de jours. <br>
            On notera $g$ cette fonction. `
            correction1 = `  ${numAlpha(0)} $f(${j})=${texNombre(p, 0)}-${texNombre(m, 1)}\\times ${j}=${texNombre(p - m * j, 2)}$.<br>
            Au bout de $${j}$ jours, il reste $${texNombre(p - m * j, 2)}$ kg de grains dans le silo.<br><br>
          ${numAlpha(1)} L'antécédent de $${texNombre(ant, 1)}$ est la solution de l'équation $f(x)=${texNombre(ant, 1)}$. <br><br>
          $\\begin{aligned}
          ${texNombre(p, 0)}-${texNombre(m, 1)}t&=${texNombre(ant, 1)}\\\\
          -${texNombre(m, 1)}t&=${texNombre(ant, 1)}-${texNombre(p, 0)}\\\\
         t&=\\dfrac{${texNombre(ant - p, 1)}}{-${texNombre(m, 1)}}\\\\
         t&=${texNombre((p - ant) / m, 1)}
          \\end{aligned}$<br>
          L'antécédent de $${texNombre(ant, 1)}$ est $${texNombre((p - ant) / m, 1)}$.
`
            correction2 = ` La contenance du silo est donnée par $f(0)$. <br>
          Comme $f(0)=${texNombre(p, 0)}-${texNombre(m, 1)}\\times 0=${texNombre(p, 0)}$, la contenance du silo est $${texNombre(p, 0)}$ kg.
          `
            correction3 = ` On cherche $t$ tel que $f(t)=0$.<br><br>
$\\begin{aligned}
${texNombre(p, 0)}-${texNombre(m, 1)}t&=0\\\\
-${texNombre(m, 1)}x&=-${texNombre(p, 0)}\\\\
t&=\\dfrac{${texNombre(-p, 0)}}{-${texNombre(m, 1)}}\\\\
t&=${texNombre(-p / (-m), 0)}
\\end{aligned}$<br>

Au bout de $${texNombre(p / m, 0)}$ jours, l'éleveur sera à court de grains.
`
            correction4 = ` Chaque jour les poulets consomment $${texNombre(m, 1)}$ kg de grains. <br>
Par exemple,  la masse de grains mangés le premier jour est donnée par $f(0)-f(1)$.<br><br>

$\\begin{aligned}
f(0)-f(1)&=(${texNombre(p, 0)}-${texNombre(m, 1)}\\times 0)-(${texNombre(p, 0)}-${texNombre(m, 1)}\\times 1)\\\\
&=${texNombre(p, 0)}-${texNombre(p - m, 1)}\\\\
&=${texNombre(m, 1)}
\\end{aligned}$
`
            correction5 = ` La fonction $g$ est donnée par : <br>
$g(t)=(\\text{masse dans le silo})-(\\text{masse  consommée par les poulets en un jour})\\times t$.<br>
Ainsi, $g(t)=${rest}-${texNombre(m / 2, 1)}t$.
`
            this.listeQuestions = [question1, question2, question3, question4, question5]
            this.listeCorrections = [correction1, correction2, correction3, correction4, correction5]
          }
          break
      }

      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Avec des fonctions affines\n2 : Avec des fonctions polynômes du second degré\n3 : Avec un graphique']
}
