import { codageSegments } from '../../lib/2d/codages.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { abs } from '../../lib/outils/nombres'
import { texteGras } from '../../lib/format/style'
import { texNombre, texRacineCarree } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
export const titre = 'Démontrer qu\'un quadrilatère est ou non un parallélogramme'
export const dateDeModifImportante = '30/11/2023'

/**
 * 2G12-3
 * @author Stéphane Guyon a tout fait, Gilles Mora a juste repris quelques bricoles
 */
export const uuid = '31760'
export const ref = '2G12-3'
export const refs = {
  'fr-fr': ['2G12-3'],
  'fr-ch': ['11GM1-6']
}
export default function Parallélogramme () {
  Exercice.call(this)
  this.titre = titre
  this.sup = parseInt(this.sup)
  this.nbQuestions = 1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1 //
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    const typesDeQuestionsDisponibles = [1, 2]; let typesDeQuestions

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, ux, uy, XMIN, XMAX, YMIN, YMAX, test, objets, nom, J, o, s1, s2, s3, s4, s5, s6, AB2, AC2, BC2, DB2, DC2, xA, yA, xB, yB, xC, yC, xD, yD, xM, yM, xN, yN, A, B, C, D, P, T, L, M, I, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      objets = []
      switch (typesDeQuestions) {
      // Cas par cas, on définit le type de nombres que l'on souhaite
      // Combien de chiffres ? Quelles valeurs ?
        case 1: // Dq ABDC parallélogramme
          xA = randint(0, 5) * choice([-1, 1])
          yA = randint(0, 5) * choice([-1, 1])
          xC = randint(0, 5, xA) * choice([-1, 1])
          yC = randint(0, 5) * choice([-1, 1])
          uy = randint(3, 5) * choice([-1, 1])
          ux = randint(3, 5) * choice([-1, 1])
          yB = yA + uy
          xB = xA + ux
          xD = xC + ux
          yD = yC + uy
          AB2 = (xA - xB) ** 2 + (yA - yB) ** 2
          AC2 = (xC - xA) ** 2 + (yC - yA) ** 2
          BC2 = (xC - xB) ** 2 + (yC - yB) ** 2
          DB2 = (xB - xD) ** 2 + (yB - yD) ** 2
          DC2 = (xC - xD) ** 2 + (yC - yD) ** 2
          //
          while ((xD - xA) ** 2 + (yD - yA) ** 2 < 8 || (xC - xB) ** 2 + (yC - yB) ** 2 < 8 || abs(xA - xB) < 3 || abs(xA - xC) < 3 ||
          yC === (yB - yA) / (xB - xA) * xC + yA - (yB - yA) / (xB - xA) * xA || Math.acos((BC2 - AB2 - AC2) / (-2 * (Math.sqrt(AB2)) * (Math.sqrt(AC2)))) < 0.4 ||
          Math.acos((BC2 - AB2 - AC2) / (-2 * (Math.sqrt(AB2)) * (Math.sqrt(AC2)))) > 2.6) {
            xA = randint(0, 5) * choice([-1, 1])
            yA = randint(0, 5) * choice([-1, 1])
            xC = randint(0, 5, xA) * choice([-1, 1])
            yC = randint(0, 5) * choice([-1, 1])
            uy = randint(3, 5) * choice([-1, 1])
            ux = randint(3, 5) * choice([-1, 1])
            yB = yA + uy
            xB = xA + ux
            xD = xC + ux
            yD = yC + uy
            AB2 = (xA - xB) ** 2 + (yA - yB) ** 2
            AC2 = (xC - xA) ** 2 + (yC - yA) ** 2
            BC2 = (xC - xB) ** 2 + (yC - yB) ** 2
            DB2 = (xB - xD) ** 2 + (yB - yD) ** 2
            DC2 = (xC - xD) ** 2 + (yC - yD) ** 2
          }

          xM = new FractionEtendue(xA + xD, 2)
          yM = new FractionEtendue(yA + yD, 2)
          xN = new FractionEtendue(xB + xC, 2)
          yN = new FractionEtendue(yB + yC, 2)
          A = point(xA, yA, 'A', 'red')
          B = point(xB, yB, 'B', 'red')
          C = point(xC, yC, 'C', 'red')
          D = point(xD, yD, 'D', 'red')
          I = point(1, 0, 'I')
          J = point(0, 1, 'J')
          M = point((xA + xD) / 2, (yA + yD) / 2, 'M')
          s1 = segment(A, B, 'blue')
          s2 = segment(D, B, 'blue')
          s3 = segment(C, D, 'blue')
          s4 = segment(A, C, 'blue')
          s5 = segment(A, D, 'red')
          s6 = segment(B, C, 'red')
          s1.epaisseur = 2
          s2.epaisseur = 2
          s3.epaisseur = 2
          s4.epaisseur = 2
          s5.epaisseur = 2
          s6.epaisseur = 2
          nom = creerNomDePolygone(4, ['OIJM'])
          A.nom = nom[0]
          B.nom = nom[1]
          C.nom = nom[2]
          D.nom = nom[3]
          codageSegments('X', 'red', s5, s6) // Code les segments s5 et s6
          T = tracePoint(A, B, C, D, M) // Repère les points avec une croix
          L = labelPoint(M)
          P = polygoneAvecNom(A, B, D, C)
          objets.push(P[1])
          texte = 'Dans un repère orthonormé $(O,I,J)$, on donne les 4 points suivants :<br>'
          texte += ` $${A.nom}\\left(${xA}\\,;\\,${yA}\\right)$ ; $${B.nom}\\left(${xB}\\,;\\,${yB}\\right)$ ; `
          texte += ` $${C.nom}\\left(${xC}\\,;\\,${yC}\\right)$ ; $${D.nom}\\left(${xD}\\,;\\,${yD}\\right).$<br>
       `
          texte += `Déterminer si le quadrilatère $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme. Justifier.`
          I = texteParPosition('I', 1, -0.5, 'milieu', 'black', 1)
          J = texteParPosition('J', -0.5, 1, 'milieu', 'black', 1)
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          objets.push(s1, s2, s3, s4, s5, s6, T, L, I, J, o)
          XMIN = Math.min(xA, xB, xC, xD, -1) - 1
          YMIN = Math.min(yA, yB, yC, yD, -1) - 1
          XMAX = Math.max(xA, xB, xC, xD, 1) + 1
          YMAX = Math.max(yA, yB, yC, yD, 1) + 1
          objets.push(repere({
            xMin: XMIN,
            yMin: YMIN,
            xMax: XMAX,
            yMax: YMAX,
            yLabelEcart: 0.6,
            xLabelEcart: 0.6,
            yLabelDistance: 2,
            xLabelDistance: 2
          }))

          if (this.correctionDetaillee) {
            texteCorr = 'On peut représenter la situation avec les données de l\'énoncé : <br>'
            texteCorr += mathalea2d({ xmin: XMIN, ymin: YMIN, xmax: XMAX, ymax: YMAX, pixelsParCm: 25, scale: 0.6 }, objets)
            texteCorr += `<br>Pour savoir si $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme, on peut utiliser l'un des deux résultats suivants :  <br>
             $\\bullet$ $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme si et seulement si ses diagonales se coupent en leur milieu (c'est-à-dire si $[${A.nom}${D.nom}]$ et $[${B.nom}${C.nom}]$ ont le même milieu). <br>
             $\\bullet$ $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme si et seulement si ses côtés opposés sont deux à deux de même longueur.<br>`
          } else { texteCorr = '' }
          texteCorr += `<br> ${texteGras('En utilisant les milieux :')} : <br> `
          texteCorr += `<br> $\\bullet$ Soit $M$ le milieu de $[${A.nom}${D.nom}]$ : <br> `
          texteCorr += `$\\begin{cases}x_M=\\dfrac{x_${A.nom}+x_${D.nom}}{2}= \\dfrac{${xA}+${ecritureParentheseSiNegatif(xD)}}{2}=\\dfrac{${texNombre(xA + xD)}}{2}${xM.texSimplificationAvecEtapes()}\\\\[0.8em] y_M=\\dfrac{y_${A.nom}+y_${D.nom}}{2}= \\dfrac{${yA}+${ecritureParentheseSiNegatif(yD)}}{2}=\\dfrac{${texNombre(yA + yD)}}{2}${yM.texSimplificationAvecEtapes()}\\end{cases}$`
          texteCorr += `  <br><br>Ainsi : $ M\\left(${xM.simplifie().texFSD}\\,;\\,${yM.simplifie().texFSD}\\right)$`
          texteCorr += `<br><br> $\\bullet$ Soit $N$ le milieu de $[${B.nom}${C.nom}]$ : <br> `
          texteCorr += `$\\begin{cases}x_N=\\dfrac{x_${B.nom}+x_${C.nom}}{2}= \\dfrac{${xB}+${ecritureParentheseSiNegatif(xC)}}{2}=\\dfrac{${texNombre(xB + xC)}}{2}${xN.texSimplificationAvecEtapes()}\\\\[0.8em] y_N=\\dfrac{y_${B.nom}+y_${C.nom}}{2}= \\dfrac{${yB}+${ecritureParentheseSiNegatif(yC)}}{2}=\\dfrac{${texNombre(yB + yC)}}{2}${yN.texSimplificationAvecEtapes()}\\end{cases}$`

          texteCorr += `  <br><br>Ainsi : $ N\\left(${xN.simplifie().texFSD}\\,;\\,${yN.simplifie().texFSD}\\right)$`
          texteCorr += '<br><br>On observe que $M$ et $N$ ont les mêmes coordonnées, donc les deux diagonales du quadrilatère se coupent en leur milieu.'
          texteCorr += '<br>$ABDC$ est donc un parallélogramme.'

          texteCorr += `<br><br> ${texteGras('En utilisant les longueurs :')}  <br> `
          texteCorr += `<br>$${A.nom}${B.nom}=\\sqrt{(x_{${B.nom}}-x_${A.nom})^2+(y_{${B.nom}}-y_${A.nom})^2}=\\sqrt{(${xB}-${ecritureParentheseSiNegatif(xA)})^2+(${yB}-${ecritureParentheseSiNegatif(yA)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xB - xA)}^2+${ecritureParentheseSiNegatif(yB - yA)}^2}=\\sqrt{${AB2}}${AB2 === 1 || AB2 === 4 || AB2 === 9 || AB2 === 16 || AB2 === 25 || AB2 === 36 || AB2 === 49 || AB2 === 64 || AB2 === 81 ? `=${texRacineCarree(AB2)}` : ''}$<br>`

          texteCorr += `<br>$${C.nom}${D.nom}=\\sqrt{(x_{${D.nom}}-x_${C.nom})^2+(y_{${D.nom}}-y_${C.nom})^2}=\\sqrt{(${xD}-${ecritureParentheseSiNegatif(xC)})^2+(${yD}-${ecritureParentheseSiNegatif(yC)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xD - xC)}^2+${ecritureParentheseSiNegatif(yD - yC)}^2}=\\sqrt{${DC2}}${DC2 === 1 || DC2 === 4 || DC2 === 9 || DC2 === 16 || DC2 === 25 || DC2 === 36 || DC2 === 49 || DC2 === 64 || DC2 === 81 ? `=${texRacineCarree(DC2)}` : ''}$<br>`

          texteCorr += `<br>$${B.nom}${D.nom}=\\sqrt{(x_{${D.nom}}-x_${B.nom})^2+(y_{${D.nom}}-y_${B.nom})^2}=\\sqrt{(${xD}-${ecritureParentheseSiNegatif(xB)})^2+(${yD}-${ecritureParentheseSiNegatif(yB)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xD - xB)}^2+${ecritureParentheseSiNegatif(yD - yB)}^2}=\\sqrt{${DB2}}${DB2 === 1 || DB2 === 4 || DB2 === 9 || DB2 === 16 || DB2 === 25 || DB2 === 36 || DB2 === 49 || DB2 === 64 || DB2 === 81 ? `=${texRacineCarree(DB2)}` : ''}$<br>`
          texteCorr += `<br>$${A.nom}${C.nom}=\\sqrt{(x_{${C.nom}}-x_${A.nom})^2+(y_{${C.nom}}-y_${A.nom})^2}=\\sqrt{(${xC}-${ecritureParentheseSiNegatif(xA)})^2+(${yC}-${ecritureParentheseSiNegatif(yA)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xC - xA)}^2+${ecritureParentheseSiNegatif(yC - yA)}^2}=\\sqrt{${AC2}}${AC2 === 1 || AC2 === 4 || AC2 === 9 || AC2 === 16 || AC2 === 25 || AC2 === 36 || AC2 === 49 || AC2 === 64 || AC2 === 81 ? `=${texRacineCarree(AC2)}` : ''}$<br>`

          texteCorr += `  <br>On observe que : $${A.nom}${B.nom}=${C.nom}${D.nom}$ et $${B.nom}${D.nom}=${A.nom}${C.nom}$.<br>
           `
          texteCorr += `Les côtés opposés du quadrilatère $${A.nom}${B.nom}${D.nom}${C.nom}$ sont deux à deux de même longueur, donc $${A.nom}${B.nom}${D.nom}${C.nom}$ est donc un parallélogramme.`

          break
        case 2: // Dq ABDC pas un parallélogramme
          xA = randint(0, 5) * choice([-1, 1])
          yA = randint(0, 5) * choice([-1, 1])
          xC = randint(0, 5) * choice([-1, 1])
          yC = randint(0, 4) * choice([-1, 1])
          ux = randint(2, 4) * choice([-1, 1])
          uy = randint(2, 4) * choice([-1, 1])
          xB = xA + ux
          yB = yA + uy
          test = choice([-1, 1])
          if (test === -1) {
            xD = xC + ux + randint(1, 2) * choice([-1, 1])
            yD = yC + uy
          }
          if (test === 1) {
            xD = xC + ux
            yD = yC + uy + randint(1, 2) * choice([-1, 1])
          }

          AB2 = (xA - xB) ** 2 + (yA - yB) ** 2
          AC2 = (xC - xA) ** 2 + (yC - yA) ** 2
          BC2 = (xC - xB) ** 2 + (yC - yB) ** 2
          DB2 = (xB - xD) ** 2 + (yB - yD) ** 2
          DC2 = (xC - xD) ** 2 + (yC - yD) ** 2

          while ((xD - xA) ** 2 + (yD - yA) ** 2 < 8 || (xC - xB) ** 2 + (yC - yB) ** 2 < 8 || abs(xA - xB) < 3 || abs(xA - xC) < 3 ||
          yC === (yB - yA) / (xB - xA) * xC + yA - (yB - yA) / (xB - xA) * xA || Math.acos((BC2 - AB2 - AC2) / (-2 * (Math.sqrt(AB2)) * (Math.sqrt(AC2)))) < 0.4 ||
          Math.acos((BC2 - AB2 - AC2) / (-2 * (Math.sqrt(AB2)) * (Math.sqrt(AC2)))) > 2.6) {
            xA = randint(0, 5) * choice([-1, 1])
            yA = randint(0, 5) * choice([-1, 1])
            xC = randint(0, 5) * choice([-1, 1])
            yC = randint(0, 5) * choice([-1, 1])
            ux = randint(2, 4) * choice([-1, 1])
            uy = randint(2, 4) * choice([-1, 1])
            xB = xA + ux
            yB = yA + uy
            test = choice([-1, 1])
            if (test === -1) {
              xD = xC + ux + randint(1, 2) * choice([-1, 1])
              yD = yC + uy
            }
            if (test === 1) {
              xD = xC + ux
              yD = yC + uy + randint(1, 2) * choice([-1, 1])
            }
            AB2 = (xA - xB) ** 2 + (yA - yB) ** 2
            AC2 = (xC - xA) ** 2 + (yC - yA) ** 2
            BC2 = (xC - xB) ** 2 + (yC - yB) ** 2
            DB2 = (xB - xD) ** 2 + (yB - yD) ** 2
            DC2 = (xC - xD) ** 2 + (yC - yD) ** 2
          }

          xM = new FractionEtendue(xA + xD, 2)
          yM = new FractionEtendue(yA + yD, 2)
          xN = new FractionEtendue(xB + xC, 2)
          yN = new FractionEtendue(yB + yC, 2)
          A = point(xA, yA, 'A', 'blue')
          B = point(xB, yB, 'B', 'blue')
          C = point(xC, yC, 'C', 'blue')
          D = point(xD, yD, 'D', 'blue')
          I = point(1, 0, 'I')
          J = point(0, 1, 'J')
          M = point((xA + xD) / 2, (yA + yD) / 2, 'M', 'red')
          s1 = segment(A, B, 'blue')
          s2 = segment(D, B, 'blue')
          s3 = segment(C, D, 'blue')
          s4 = segment(A, C, 'blue')
          s5 = segment(A, D, 'red')
          s6 = segment(B, C, 'red')

          s1.epaisseur = 2
          s2.epaisseur = 2
          s3.epaisseur = 2
          s4.epaisseur = 2
          s5.epaisseur = 2
          s6.epaisseur = 2
          // codageSegments('X', 'red', s1, s2, s3, s4, s5, s6) // Code les segments s5 et s6
          nom = creerNomDePolygone(4, ['OIJM'])
          A.nom = nom[0]
          B.nom = nom[1]
          C.nom = nom[2]
          D.nom = nom[3]
          codageSegments('X', 'red', s5, s6) // Code les segments s5 et s6
          T = tracePoint(A, B, C, D) // Repère les points avec une croix
          P = polygoneAvecNom(A, B, D, C)
          objets.push(P[1])
          I = texteParPosition('I', 1, -0.5, 'milieu', 'black', 1)
          J = texteParPosition('J', -0.5, 1, 'milieu', 'black', 1)
          o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
          objets.push(s1, s2, s3, s4, s5, s6, T, I, J, o)
          XMIN = Math.min(xA, xB, xC, xD, -1) - 1
          YMIN = Math.min(yA, yB, yC, yD, -1) - 1
          XMAX = Math.max(xA, xB, xC, xD, 1) + 1
          YMAX = Math.max(yA, yB, yC, yD, 1) + 1
          objets.push(repere({
            xMin: XMIN,
            yMin: YMIN,
            xMax: XMAX,
            yMax: YMAX,
            yLabelEcart: 0.6,
            xLabelEcart: 0.6,
            yLabelDistance: 2,
            xLabelDistance: 2
          }))
          texte = 'Dans un repère orthonormé $(O,I,J)$, on donne les 4 points suivants :<br>'
          texte += ` $${A.nom}\\left(${xA}\\,;\\,${yA}\\right)$ ; $${B.nom}\\left(${xB}\\,;\\,${yB}\\right)$, `
          texte += ` $${C.nom}\\left(${xC}\\,;\\,${yC}\\right)$ ; $${D.nom}\\left(${xD}\\,;\\,${yD}\\right).$<br>
       `
          texte += `Déterminer si le quadrilatère $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme. Justifier.`

          if (this.correctionDetaillee) {
            texteCorr = 'On peut représenter la situation avec les données de l\'énoncé : <br>'
            texteCorr += mathalea2d({ xmin: XMIN, ymin: YMIN, xmax: XMAX, ymax: YMAX, pixelsParCm: 25, scale: 0.6 }, objets)
            texteCorr += `<br>Pour savoir si $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme, on peut utiliser l'un des deux résultats suivants :  <br>
             $\\bullet$ $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme si et seulement si ses diagonales se coupent en leur milieu (c'est-à-dire si $[${A.nom}${D.nom}]$ et $[${B.nom}${C.nom}]$ ont le même milieu). <br>
             $\\bullet$ $${A.nom}${B.nom}${D.nom}${C.nom}$ est un parallélogramme si et seulement si ses côtés opposés sont deux à deux de même longueur.<br><br>`
          } else { texteCorr = '' }
          texteCorr += `${texteGras('En utilisant les milieux :')} : <br> `
          texteCorr += `<br> $\\bullet$ Soit $M$ le milieu de $[${A.nom}${D.nom}]$ : <br> `
          texteCorr += `$\\begin{cases}x_M=\\dfrac{x_${A.nom}+x_${D.nom}}{2}= \\dfrac{${xA}+${ecritureParentheseSiNegatif(xD)}}{2}=\\dfrac{${texNombre(xA + xD)}}{2}${xM.texSimplificationAvecEtapes()}\\\\[0.8em] y_M=\\dfrac{y_${A.nom}+y_${D.nom}}{2}= \\dfrac{${yA}+${ecritureParentheseSiNegatif(yD)}}{2}=\\dfrac{${texNombre(yA + yD)}}{2}${yM.texSimplificationAvecEtapes()}\\end{cases}$`

          texteCorr += `  <br><br>Ainsi : $ M\\left(${xM.simplifie().texFSD}\\,;\\,${yM.simplifie().texFSD}\\right)$`
          texteCorr += `<br><br>$\\bullet$ Soit $N$ le milieu de $[${B.nom}${C.nom}]$ : <br> `
          texteCorr += `$\\begin{cases}x_N=\\dfrac{x_${B.nom}+x_${C.nom}}{2}= \\dfrac{${xB}+${ecritureParentheseSiNegatif(xC)}}{2}=\\dfrac{${texNombre(xB + xC)}}{2}${xN.texSimplificationAvecEtapes()}\\\\[0.8em] y_N=\\dfrac{y_${B.nom}+y_${C.nom}}{2}= \\dfrac{${yB}+${ecritureParentheseSiNegatif(yC)}}{2}=\\dfrac{${texNombre(yB + yC)}}{2}${yN.texSimplificationAvecEtapes()}\\end{cases}$`

          texteCorr += `  <br><br>Ainsi : $ N\\left(${xN.simplifie().texFSD}\\,;\\,${yN.simplifie().texFSD}\\right)$`
          texteCorr += '<br><br>On observe que $M$ et $N$ n\'ont pas les mêmes coordonnées, donc les deux diagonales du quadrilatère ne se coupent pas en leur milieu.'
          texteCorr += `<br>$${A.nom}${B.nom}${D.nom}${C.nom}$ n'est pas un parallélogramme.`

          texteCorr += `<br><br> ${texteGras('En utilisant les longueurs :')}  <br> `
          texteCorr += `<br>$${A.nom}${B.nom}=\\sqrt{(x_{${B.nom}}-x_${A.nom})^2+(y_{${B.nom}}-y_${A.nom})^2}=\\sqrt{(${xB}-${ecritureParentheseSiNegatif(xA)})^2+(${yB}-${ecritureParentheseSiNegatif(yA)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xB - xA)}^2+${ecritureParentheseSiNegatif(yB - yA)}^2}=\\sqrt{${AB2}}${AB2 === 1 || AB2 === 4 || AB2 === 9 || AB2 === 16 || AB2 === 25 || AB2 === 36 || AB2 === 49 || AB2 === 64 || AB2 === 81 ? `=${texRacineCarree(AB2)}` : ''}$<br>`

          texteCorr += `<br>$${C.nom}${D.nom}=\\sqrt{(x_{${D.nom}}-x_${C.nom})^2+(y_{${D.nom}}-y_${C.nom})^2}=\\sqrt{(${xD}-${ecritureParentheseSiNegatif(xC)})^2+(${yD}-${ecritureParentheseSiNegatif(yC)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xD - xC)}^2+${ecritureParentheseSiNegatif(yD - yC)}^2}=\\sqrt{${DC2}}${DC2 === 1 || DC2 === 4 || DC2 === 9 || DC2 === 16 || DC2 === 25 || DC2 === 36 || DC2 === 49 || DC2 === 64 || DC2 === 81 ? `=${texRacineCarree(DC2)}` : ''}$<br>`
          if (AB2 === DC2) {
            texteCorr += `<br>$${B.nom}${D.nom}=\\sqrt{(x_{${D.nom}}-x_${B.nom})^2+(y_{${D.nom}}-y_${B.nom})^2}=\\sqrt{(${xD}-${ecritureParentheseSiNegatif(xB)})^2+(${yD}-${ecritureParentheseSiNegatif(yB)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xD - xB)}^2+${ecritureParentheseSiNegatif(yD - yB)}^2}=\\sqrt{${DB2}}${DB2 === 1 || DB2 === 4 || DB2 === 9 || DB2 === 16 || DB2 === 25 || DB2 === 36 || DB2 === 49 || DB2 === 64 || DB2 === 81 ? `=${texRacineCarree(DB2)}` : ''}$<br>`
            texteCorr += `<br>$${A.nom}${C.nom}=\\sqrt{(x_{${C.nom}}-x_${A.nom})^2+(y_{${C.nom}}-y_${A.nom})^2}=\\sqrt{(${xC}-${ecritureParentheseSiNegatif(xA)})^2+(${yC}-${ecritureParentheseSiNegatif(yA)})^2}=\\sqrt{${ecritureParentheseSiNegatif(xC - xA)}^2+${ecritureParentheseSiNegatif(yC - yA)}^2}=\\sqrt{${AC2}}${AC2 === 1 || AC2 === 4 || AC2 === 9 || AC2 === 16 || AC2 === 25 || AC2 === 36 || AC2 === 49 || AC2 === 64 || AC2 === 81 ? `=${texRacineCarree(AC2)}` : ''}$<br>`
          }

          texteCorr += `  <br>On observe que les côtés opposés de $${A.nom}${B.nom}${D.nom}${C.nom}$ ne sont pas  deux à deux de même longueur.<br>
           `
          texteCorr += `$${A.nom}${B.nom}${D.nom}${C.nom}$ n'est donc pas un parallélogramme.`
          break
      }
      if (this.questionJamaisPosee(i, xA, yA, xB, yB, typesDeQuestions)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
