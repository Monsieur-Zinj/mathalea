import { angle, angleOriente, codageAngle, codageAngleDroit } from '../../lib/2d/angles'
import { afficheCoteSegment, afficheLongueurSegment } from '../../lib/2d/codages'
import { point, pointAdistance } from '../../lib/2d/points'
import { barycentre, nommePolygone } from '../../lib/2d/polygones'
import { longueur, segment, vecteur } from '../../lib/2d/segmentsVecteurs'
import { similitude, translation } from '../../lib/2d/transformations'
import { triangle2points2angles, triangle2points2longueurs } from '../../lib/2d/triangle'
import { choice, shuffleLettres } from '../../lib/outils/arrayOutils'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import Exercice from '../Exercice'
import { mathalea2d, vide2d } from '../../modules/2dGeneralites'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import { context } from '../../modules/context'
import { labelPoint } from '../../lib/2d/textes'
import { stringNombre } from '../../lib/outils/texNombre'
import FractionEtendue from '../../modules/FractionEtendue'
export const titre = 'Triangles semblables'

/**
 * Deux triangles semblables sont codés, il faut reconnaître les côtés homologues
 * @author Mickael Guironnet
 * Référence 3G24-1
*/
export const uuid = 'f4b7e'
export const ref = '3G24-1'
export const refs = {
  'fr-fr': ['3G24-1'],
  'fr-ch': []
}
export default class TrianglesSemblables extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.nbQuestions = 3
    this.nbCols = 1 // Uniquement pour la sortie LaTeX
    this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
    this.sup = 1
    this.video = '' // Id YouTube ou url
    this.spacing = 2
    this.spacingCorr = 3
    this.besoinFormulaireTexte = ['Types de questions (nombre séparés par des tirets)', '1 : Trouver angles et côtés homologues\n2 : Démontrer semblables avec les angles\n3 : Démontrer semblables avec les longueurs\n4 : Démontrer semblables avec des triangles rectangles imbriqués']
  }

  // c'est ici que commence le code de l'exercice cette méthode crée une copie de l'exercice
  nouvelleVersion () {
    this.reinit()
    const zoom = context.vue === 'diap' ? 0.5 : 1
    const typeQuestionsDisponibles = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 5, defaut: 1, melange: 6, nbQuestions: this.nbQuestions })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      const k = randint(5, 15, [10, 11, 9])
      let l1 = randint(5, 8)
      let l2 = randint(5, 9, l1)
      let l3 = randint(5, l1 + l2 - 1, [l1, l2])
      const ang1 = randint(45, 80)
      const ang2 = randint(45, 80)
      l1 *= k / 10
      l2 *= k / 10
      l3 *= k / 10
      const A = point(0, 0)
      const B = pointAdistance(A, l1)
      let p1 = triangle2points2longueurs(A, B, l2, l3)
      if (typeQuestionsDisponibles[i] === 2) {
        p1 = triangle2points2angles(A, B, ang1, ang2)
      }
      const C = p1.listePoints[2]
      const O = barycentre(p1)
      const v = vecteur(longueur(A, B) + 0.5, 0)
      const O2 = translation(O, v)

      let p2, D, E, F, code1, code2, code3, code4, code5, code6, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nom1, nom2, nommeP1, nommeP2, Anom, Bnom, Cnom, Dnom, Enom, Fnom
      switch (typeQuestionsDisponibles[i]) { // Suivant le type de question, le contenu sera différent
        case 1: {
          const angle = randint(160, 200)
          const coeff = randint(5, 15, [10, 11, 9]) / 10
          p2 = similitude(p1, O2, angle, coeff)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          codeA1 = codageAngle(A, B, C, 0.8, '|')
          codeA2 = codageAngle(D, E, F, 0.8, '|')
          // codeA3 = codageAngle(B, C, A, 0.8, 'X')
          // codeA4 = codageAngle(E, F, D, 0.8, 'X')
          codeA5 = codageAngle(C, A, B, 0.8, '||')
          codeA6 = codageAngle(F, D, E, 0.8, '||')
          nom1 = choisitLettresDifferentes(3)
          nom2 = choisitLettresDifferentes(3, nom1)
          Anom = nom1[0]
          Bnom = nom1[1]
          Cnom = nom1[2]
          Dnom = nom2[0]
          Enom = nom2[1]
          Fnom = nom2[2]
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          texte = 'Compléter les phrases suivantes.<br>'
          texte += `Ci-dessous les triangles $${shuffleLettres(Anom + Bnom + Cnom)}$ et $${shuffleLettres(Dnom + Enom + Fnom)}$ sont semblables.<br>`
          texte += `$[${Anom + Bnom}]$ et ............ sont homologues.<br>`
          texte += `$[${Bnom + Cnom}]$ et ............ sont homologues.<br>`
          texte += `$[${Cnom + Anom}]$ et ............ sont homologues.<br>`
          texte += `$\\widehat{${Anom + Bnom + Cnom}}$ et ...................... sont homologues.<br>`
          texte += `$\\widehat{${Cnom + Anom + Bnom}}$ et ...................... sont homologues.<br>`
          texte += `$\\widehat{${Bnom + Cnom + Anom}}$ et ...................... sont homologues.<br>`
          texte += mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 2,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 2,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 2,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 2,
            scale: 0.5,
            zoom
          },
          p1, p2, codeA1, codeA2, codeA5, codeA6, nommeP1, nommeP2)
          texteCorr = `$[${Anom + Bnom}]$ et $[${Dnom + Enom}]$ sont homologues.<br>`
          texteCorr += `$[${Bnom + Cnom}]$ et $[${Enom + Fnom}]$ sont homologues.<br>`
          texteCorr += `$[${Cnom + Anom}]$ et $[${Fnom + Dnom}]$ sont homologues.<br>`
          texteCorr += `$\\widehat{${Anom + Bnom + Cnom}}$ et $\\widehat{${Dnom + Enom + Fnom}}$ sont homologues.<br>`
          texteCorr += `$\\widehat{${Cnom + Anom + Bnom}}$ et $\\widehat{${Fnom + Dnom + Enom}}$ sont homologues.<br>`
          texteCorr += `$\\widehat{${Bnom + Cnom + Anom}}$ et $\\widehat{${Enom + Fnom + Dnom}}$ sont homologues.<br>`
          break
        }
        case 2: {
          const ang = randint(160, 200)
          const coeff = randint(5, 15, [10, 11, 9]) / 10
          p2 = similitude(p1, O2, ang, coeff)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          const hiddenAngle1 = randint(1, 3)
          const hiddenAngle2 = randint(4, 6)
          codeA1 = hiddenAngle1 === 1 ? vide2d() : codageAngle(A, B, C, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA3 = hiddenAngle1 === 2 ? vide2d() : codageAngle(B, C, A, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA5 = hiddenAngle1 === 3 ? vide2d() : codageAngle(C, A, B, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA2 = hiddenAngle2 === 4 ? vide2d() : codageAngle(D, E, F, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA4 = hiddenAngle2 === 5 ? vide2d() : codageAngle(E, F, D, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA6 = hiddenAngle2 === 6 ? vide2d() : codageAngle(F, D, E, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          nom1 = choisitLettresDifferentes(3)
          nom2 = choisitLettresDifferentes(3, nom1)
          Anom = nom1[0]
          Bnom = nom1[1]
          Cnom = nom1[2]
          Dnom = nom2[0]
          Enom = nom2[1]
          Fnom = nom2[2]
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          texte = `Démontrer que les triangles $${shuffleLettres(Anom + Bnom + Cnom)}$ et $${shuffleLettres(Dnom + Enom + Fnom)}$ sont semblables.<br>`
          texte += mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 2,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 2,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 2,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 2,
            scale: 0.5,
            zoom
          },
          p1, p2, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nommeP1, nommeP2)
          texteCorr = 'D\'après la règle des 180° dans un triangle, la somme des angles est égale à 180°. <br>'
          texteCorr += hiddenAngle1 === 1 ? `$\\widehat{${Anom + Bnom + Cnom}}$ = 180° - ${stringNombre(angle(B, C, A), 1)}° - ${stringNombre(angle(C, A, B), 1)}°=${stringNombre(angle(A, B, C), 1)}°. <br>` : ''
          texteCorr += hiddenAngle1 === 2 ? `$\\widehat{${Bnom + Cnom + Anom}}$ = 180° - ${stringNombre(angle(A, B, C), 1)}° - ${stringNombre(angle(C, A, B), 1)}°=${stringNombre(angle(B, C, A), 1)}°. <br>` : ''
          texteCorr += hiddenAngle1 === 3 ? `$\\widehat{${Cnom + Anom + Bnom}}$ = 180° - ${stringNombre(angle(B, C, A), 1)}° - ${stringNombre(angle(A, B, C), 1)}°=${stringNombre(angle(C, A, B), 1)}°. <br>` : ''
          texteCorr += hiddenAngle2 === 4 ? `$\\widehat{${Dnom + Enom + Fnom}}$ = 180° - ${stringNombre(angle(E, F, D), 1)}° - ${stringNombre(angle(F, D, E), 1)}°=${stringNombre(angle(D, E, F), 1)}°. <br>` : ''
          texteCorr += hiddenAngle2 === 5 ? `$\\widehat{${Enom + Fnom + Dnom}}$ = 180° - ${stringNombre(angle(D, E, F), 1)}° - ${stringNombre(angle(F, D, E), 1)}°=${stringNombre(angle(E, F, D), 1)}°. <br>` : ''
          texteCorr += hiddenAngle2 === 6 ? `$\\widehat{${Fnom + Dnom + Enom}}$ = 180° - ${stringNombre(angle(D, E, F), 1)}° - ${stringNombre(angle(E, F, D), 1)}°=${stringNombre(angle(F, D, E), 1)}°. <br>` : ''
          texteCorr += `$\\widehat{${Anom + Bnom + Cnom}}$ = $\\widehat{${Dnom + Enom + Fnom}}$.<br>`
          texteCorr += `$\\widehat{${Cnom + Anom + Bnom}}$ = $\\widehat{${Fnom + Dnom + Enom}}$.<br>`
          texteCorr += `$\\widehat{${Bnom + Cnom + Anom}}$ = $\\widehat{${Enom + Fnom + Dnom}}$.<br>`
          texteCorr += 'Les 3 paires d\'angles sont égales. Comme les angles sont égaux deux à deux, les deux triangles sont semblables.<br>'
          break
        }
        case 3: {
          const ang = randint(160, 200)
          const coeff = (k === 5 ? choice([12, 14]) : k === 6 ? choice([10, 15]) : k === 7 ? 10 : k === 8 ? choice([10, 15]) : k === 12 ? choice([5, 10]) : k === 13 ? 10 : k === 14 ? choice([10, 5]) : k === 15 ? choice([10, 5]) : 10) / 10
          p2 = similitude(p1, O2, ang, 10 * coeff / k)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          code1 = angleOriente(C, A, B) > 0 ? afficheLongueurSegment(A, B) : afficheLongueurSegment(B, A)
          code2 = angleOriente(F, D, E) > 0 ? afficheLongueurSegment(D, E) : afficheLongueurSegment(E, D)
          code3 = angleOriente(A, B, C) > 0 ? afficheLongueurSegment(B, C) : afficheLongueurSegment(C, B)
          code4 = angleOriente(D, E, F) > 0 ? afficheLongueurSegment(E, F) : afficheLongueurSegment(F, E)
          code5 = angleOriente(B, C, A) > 0 ? afficheLongueurSegment(C, A) : afficheLongueurSegment(A, C)
          code6 = angleOriente(E, F, D) > 0 ? afficheLongueurSegment(F, D) : afficheLongueurSegment(D, F)
          codeA1 = codageAngle(A, B, C, 0.8, '|')
          codeA2 = codageAngle(D, E, F, 0.8, '|')
          codeA3 = codageAngle(B, C, A, 0.8, 'X')
          codeA4 = codageAngle(E, F, D, 0.8, 'X')
          codeA5 = codageAngle(C, A, B, 0.8, '||')
          codeA6 = codageAngle(F, D, E, 0.8, '||')
          nom1 = choisitLettresDifferentes(3)
          nom2 = choisitLettresDifferentes(3, nom1)
          Anom = nom1[0]
          Bnom = nom1[1]
          Cnom = nom1[2]
          Dnom = nom2[0]
          Enom = nom2[1]
          Fnom = nom2[2]
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          texte = `Est-ce que les triangles $${shuffleLettres(Anom + Bnom + Cnom)}$ et $${shuffleLettres(Dnom + Enom + Fnom)}$ sont semblables? Justifier<br>`
          texte += mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            zoom
          },
          p1, p2, code1, code2, code3, code4, code5, code6, nommeP1, nommeP2)
          texteCorr = 'On trie les longueurs des deux triangles afin de les comparer. <br>'
          texteCorr += `$${stringNombre(longueur(A, B), 1)} \\div  ${stringNombre(longueur(D, E), 1)} = ${new FractionEtendue(longueur(A, B), longueur(D, E)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${stringNombre(longueur(B, C), 1)} \\div  ${stringNombre(longueur(E, F), 1)} = ${new FractionEtendue(longueur(B, C), longueur(E, F)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${stringNombre(longueur(C, A), 1)} \\div  ${stringNombre(longueur(F, D), 1)} = ${new FractionEtendue(longueur(C, A), longueur(F, D)).texFractionSimplifiee}$.<br>`
          texteCorr += 'Les longueurs sont proportionnelles deux à deux donc les deux triangles sont semblables.<br>'
          break
        }
        case 4: {
          const tripletsPythagoriciens = [
            [3, 4, 5],
            [6, 8, 10],
            [8, 15, 17],
            [10, 24, 26],
            [5, 12, 13],
            [12, 16, 20],
            [20, 21, 29],
            [48, 55, 73],
            [28, 45, 53],
            [36, 77, 85],
            [39, 80, 89]
          ]
          const pindex = randint(1, 4)
          const A = point(0, 0)
          const B = pointAdistance(A, tripletsPythagoriciens[pindex][1])
          p1 = triangle2points2longueurs(A, B, tripletsPythagoriciens[pindex][0], tripletsPythagoriciens[pindex][2])
          const C = p1.listePoints[2]
          const k = tripletsPythagoriciens[pindex][1] / tripletsPythagoriciens[pindex][2]
          p2 = triangle2points2longueurs(A, B, tripletsPythagoriciens[pindex][0] * k, tripletsPythagoriciens[pindex][1] * k)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          code1 = vide2d() // angleOriente(C, A, B) > 0 ? afficheLongueurSegment(A, B) : afficheLongueurSegment(B, A)
          code2 = vide2d() // angleOriente(F, D, E) > 0 ? afficheLongueurSegment(D, E) : afficheLongueurSegment(E, D)
          code3 = vide2d() // angleOriente(A, B, C) > 0 ? afficheLongueurSegment(B, C) : afficheLongueurSegment(C, B)
          code4 = vide2d() // angleOriente(D, E, F) > 0 ? afficheLongueurSegment(E, F) : afficheLongueurSegment(F, E)
          code5 = vide2d() // angleOriente(B, C, A) > 0 ? afficheLongueurSegment(C, A) : afficheLongueurSegment(A, C)
          code6 = vide2d() // angleOriente(E, F, D) > 0 ? afficheLongueurSegment(F, D) : afficheLongueurSegment(D, F)
          codeA1 = vide2d() // codageAngle(A, B, C, 0.8, '|')
          codeA2 = vide2d() // codageAngle(D, E, F, 0.8, '|')
          codeA3 = vide2d() // odageAngle(B, C, A, 0.8, 'X')
          codeA4 = codageAngleDroit(E, F, D)
          codeA5 = codageAngleDroit(C, A, B)
          codeA6 = vide2d() // codageAngle(F, D, E, 0.8, '||')
          nom1 = choisitLettresDifferentes(3)
          nom2 = nom1[0] + nom1[1] + choisitLettresDifferentes(1, nom1)
          Anom = nom1[0]
          Bnom = nom1[1]
          Cnom = nom1[2]
          Dnom = nom2[0]
          Enom = nom2[1]
          Fnom = nom2[2]
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          texte = `Est-ce que les triangles $${shuffleLettres(Anom + Bnom + Cnom)}$ et $${shuffleLettres(Dnom + Enom + Fnom)}$ sont semblables? Justifier<br>`
          texte += mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            zoom
          },
          p1, p2, code1, code2, code3, code4, code5, code6, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nommeP1, labelPoint(p2.listePoints[2]))
          texteCorr = 'On trie les longueurs des deux triangles afin de les comparer. <br>'
          codeA4 = codageAngleDroit(E, F, D)
          codeA5 = codageAngleDroit(C, A, B)
          texteCorr += `$\\widehat{${Cnom + Anom + Bnom}}$ = $\\widehat{${Enom + Fnom + Dnom}}$ = 90° par codage.<br>`
          texteCorr += `$\\widehat{${Anom + Bnom + Cnom}}$ = $\\widehat{${Dnom + Enom + Fnom}}$ car les angles sont confondus.<br>`
          texteCorr += 'On a donc deux paires d\'angles égales donc la troisième paire aussi grâce à la règle des 180° dans un triangle (la somme des angles est égale à 180°). <br>'
          texteCorr += `$\\widehat{${Bnom + Cnom + Anom}}$ = $\\widehat{${Fnom + Dnom + Enom}}$.<br>`
          texteCorr += 'Les 3 paires d\'angles sont égales. Comme les angles sont égaux deux à deux, les deux triangles sont semblables.<br>'
          break
        }
        case 5: {
          const ang = randint(160, 200)
          const coeff = (k === 5 ? choice([12, 14]) : k === 6 ? choice([10, 15]) : k === 7 ? 10 : k === 8 ? choice([10, 15]) : k === 12 ? choice([5, 10]) : k === 13 ? 10 : k === 14 ? choice([10, 5]) : k === 15 ? choice([10, 5]) : 10) / 10
          const sign = choice([-1, 1])
          p2 = similitude(p1, A, 0, sign * 10 * coeff / k)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          code1 = angleOriente(C, A, B) > 0 ? afficheLongueurSegment(A, B) : afficheLongueurSegment(B, A)
          code2 = angleOriente(F, D, E) > 0 ? afficheLongueurSegment(D, E) : afficheLongueurSegment(E, D)
          code3 = angleOriente(A, B, C) > 0 ? afficheLongueurSegment(B, C) : afficheLongueurSegment(C, B)
          code4 = angleOriente(D, E, F) > 0 ? afficheLongueurSegment(E, F) : afficheLongueurSegment(F, E)
          code5 = angleOriente(B, C, A) > 0 ? afficheLongueurSegment(C, A) : afficheLongueurSegment(A, C)
          code6 = angleOriente(E, F, D) > 0 ? afficheLongueurSegment(F, D) : afficheLongueurSegment(D, F)
          if (k < 10 && sign > 0) {
            // agrandissement
            code6 = afficheCoteSegment(segment(F, D), `${longueur(F, D)}`, -1, 'blue')
          } else if (k > 10 && sign > 0) {
            code1 = angleOriente(C, A, B) > 0 ? afficheCoteSegment(segment(A, B), `${stringNombre(longueur(A, B))} cm`, 2, 'blue') : afficheCoteSegment(segment(A, B), `${stringNombre(longueur(A, B))} cm`, -2, 'blue')
            code5 = angleOriente(B, C, A) > 0 ? afficheCoteSegment(segment(A, C), `${stringNombre(longueur(A, C))} cm`, -2, 'blue') : afficheCoteSegment(segment(A, C), `${stringNombre(longueur(A, C))} cm`, 2, 'blue')
          }
          codeA1 = codageAngle(A, B, C, 0.8, '|')
          codeA2 = codageAngle(D, E, F, 0.8, '|')
          codeA3 = codageAngle(B, C, A, 0.8, 'X')
          codeA4 = codageAngle(E, F, D, 0.8, 'X')
          codeA5 = codageAngle(C, A, B, 0.8, '||')
          codeA6 = codageAngle(F, D, E, 0.8, '||')
          nom1 = choisitLettresDifferentes(3)
          nom2 = nom1[0] + choisitLettresDifferentes(2, nom1)
          nom2 = nom2.replaceAll(',', '')
          Anom = nom1[0]
          Bnom = nom1[1]
          Cnom = nom1[2]
          Dnom = nom2[0]
          Enom = nom2[1]
          Fnom = nom2[2]
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          texte = `Est-ce que les triangles $${shuffleLettres(Anom + Bnom + Cnom)}$ et $${shuffleLettres(Dnom + Enom + Fnom)}$ sont semblables? Justifier<br>`
          texte += mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            zoom
          },
          p1, p2, code1, code2, code3, code4, code5, code6, nommeP1, labelPoint(p2.listePoints[2]), labelPoint(p2.listePoints[1]))
          texteCorr = 'On trie les longueurs des deux triangles afin de les comparer. <br>'
          texteCorr += `$${stringNombre(longueur(A, B), 1)} \\div  ${stringNombre(longueur(D, E), 1)} = ${new FractionEtendue(longueur(A, B), longueur(D, E)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${stringNombre(longueur(B, C), 1)} \\div  ${stringNombre(longueur(E, F), 1)} = ${new FractionEtendue(longueur(B, C), longueur(E, F)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${stringNombre(longueur(C, A), 1)} \\div  ${stringNombre(longueur(F, D), 1)} = ${new FractionEtendue(longueur(C, A), longueur(F, D)).texFractionSimplifiee}$.<br>`
          texteCorr += 'Les longueurs sont proportionnelles deux à deux donc les deux triangles sont semblables.<br>'
          break
        }
      }
      if (this.questionJamaisPosee(i, longueur(A, B).toFixed(1), longueur(B, C).toFixed(1), longueur(C, A).toFixed(1), longueur(D, E).toFixed(1))) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
