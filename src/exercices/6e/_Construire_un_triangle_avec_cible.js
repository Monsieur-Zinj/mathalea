import { angle, codageAngle, codageAngleDroit } from '../../lib/2d/angles.js'
import { cercle, traceCompas } from '../../lib/2d/cercle.js'
import { cibleRonde, dansLaCibleRonde } from '../../lib/2d/cibles.js'
import { afficheLongueurSegment, afficheMesureAngle, codageSegments } from '../../lib/2d/codages.js'
import { droite, droiteParPointEtPerpendiculaire } from '../../lib/2d/droites.js'
import {
  point,
  pointAdistance,
  pointIntersectionCC,
  pointIntersectionDD,
  pointIntersectionLC
} from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { longueur, segmentAvecExtremites } from '../../lib/2d/segmentsVecteurs.js'
import { latexParPoint } from '../../lib/2d/textes.ts'
import { rotation, similitude } from '../../lib/2d/transformations.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { range1 } from '../../lib/outils/nombres'
import { creerNomDePolygone, lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { nombreAvecEspace } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
import Alea2iep from '../../modules/Alea2iep.js'
import { context } from '../../modules/context.js'

/**
 * publié le 1/12/2020
 * @author Jean-Claude Lhote
 */
export default function ConstruireUnTriangleAvecCible () {
  Exercice.call(this)
  this.titre = 'Construire un triangle avec cible auto-corrective'
  this.nbQuestions = 4
  this.nbCols = 1
  this.nbColsCorr = 1
  this.classe = 6
  this.typeExercice = 'IEP'

  this.nouvelleVersion = function () {
    let IEP
    let xMin
    let yMax
    this.listeQuestions = []
    this.listeCorrections = []
    let listeDeNomsDePolygones
    const celluleAleaRonde = function (rang) {
      const lettre = lettreDepuisChiffre(randint(1, 8))
      const chiffre = Number(randint(1, rang)).toString()
      return lettre + chiffre
    }

    let typesDeQuestionsDisponibles, cible, cellule, result, A, B, C, CC, lAB, lBC, lAC, cA, cB, T, TT, dBC, dAC, dAB, objetsEnonceml, objetsEnonce, objetsCorrection, nom, sommets, montriangle
    if (this.classe === 6) typesDeQuestionsDisponibles = range1(6)
    else typesDeQuestionsDisponibles = range1(9)
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      IEP = new Alea2iep()
      objetsEnonce = []
      objetsEnonceml = []
      objetsCorrection = []
      texte = 'Le triangle ci-dessous a été réalisé à main levée.<br>Construire ce triangle avec les instruments de géométrie en respectant les mesures indiquées.<br>'
      texteCorr = 'Voici la construction que tu devais réaliser.<br>'
      if (i % 5 === 0) listeDeNomsDePolygones = ['PQD']
      nom = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom)
      sommets = []
      for (let i = 0; i < 3; i++) sommets.push(nom[i])
      A = point(0, 0, sommets[0], 'left')
      switch (listeTypeDeQuestions[i]) {
        case 1: // triangle quelconque par ses trois longueurs
          lAC = randint(35, 45)
          lBC = calculANePlusJamaisUtiliser(randint(35, 45, lAC) / 10)
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          lAC = calculANePlusJamaisUtiliser(lAC / 10)
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          cA = cercle(A, lAC)
          cB = cercle(B, lBC)
          C = pointIntersectionCC(cA, cB, sommets[2], 1)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(afficheLongueurSegment(B, A), afficheLongueurSegment(C, B, 'black', 1), afficheLongueurSegment(A, C, 'black', 1))
          objetsCorrection.push(cible, traceCompas(A, C, 30, 'gray', 1, 2), traceCompas(B, C, 30, 'gray', 1, 2), afficheLongueurSegment(B, A), afficheLongueurSegment(C, B), afficheLongueurSegment(A, C))
          texteCorr += 'Pour cette construction, nous avons utilisé le compas et la règle graduée.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangle3longueurs(nom, lAB, lAC, lBC, true)
          break
        case 2: // triangle ABC rectangle en B dont on connaît AB et BC
          lBC = randint(70, 80) / 10
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          cB = cercle(B, lBC)
          dAB = droite(A, B)
          dBC = droiteParPointEtPerpendiculaire(B, dAB)
          C = pointIntersectionLC(dBC, cB, sommets[2], 1)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(afficheLongueurSegment(B, A), afficheLongueurSegment(C, B, 'black', 1), codageAngleDroit(A, B, CC))
          objetsCorrection.push(cible, traceCompas(B, C, 30, 'gray', 1, 2), codageAngleDroit(A, B, C), afficheLongueurSegment(B, A), afficheLongueurSegment(C, B))
          texteCorr += 'Pour cette construction, nous avons utilisé la règle graduée, l\'équerre et le compas.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`

          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangleRectangle2Cotes(nom, lAB, lBC, true)
          break
        case 3: // triangle ABC isocèle en A
          lBC = calculANePlusJamaisUtiliser(randint(35, 45) / 10)
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          lAC = lAB
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          cA = cercle(A, lAC)
          cB = cercle(B, lBC)
          C = pointIntersectionCC(cA, cB, sommets[2], 1)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(afficheLongueurSegment(B, A), afficheLongueurSegment(C, B, 'black', 1), codageSegments('||', 'black', A, B, A, CC))
          objetsCorrection.push(cible, traceCompas(A, C, 30, 'gray', 1, 2), traceCompas(B, C, 30, 'gray', 1, 2), afficheLongueurSegment(B, A), afficheLongueurSegment(C, B), codageSegments('||', 'black', A, B, A, C), afficheLongueurSegment(A, C))
          texteCorr += 'Pour cette construction, nous avons utilisé le compas et la règle graduée.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          montriangle = IEP.triangle3longueurs(nom, lAB, lAC, lBC, true)
          IEP.segmentCodage(montriangle[0], montriangle[1], { codage: '\\\\' })
          IEP.segmentCodage(montriangle[0], montriangle[2], { codage: '\\\\' })
          break
        case 4: // triangle ABC recatangle isocèle en B
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          lBC = lAB
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          cB = cercle(B, lBC)
          dAB = droite(A, B)
          dBC = droiteParPointEtPerpendiculaire(B, dAB)
          C = pointIntersectionLC(dBC, cB, sommets[2], 1)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(afficheLongueurSegment(B, A), codageSegments('||', 'black', A, B, B, CC), codageAngleDroit(A, B, CC))
          objetsCorrection.push(cible, traceCompas(B, C, 30, 'gray', 1, 2), codageAngleDroit(A, B, C), afficheLongueurSegment(B, A), codageSegments('||', 'black', A, B, B, C))
          texteCorr += 'Pour cette construction, nous avons utilisé l\'équerre et la règle graduée.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          montriangle = IEP.triangleRectangle2Cotes(nom, lAB, lAB, true)
          IEP.segmentCodage(montriangle[0], montriangle[1], { codage: '\\\\' })
          IEP.segmentCodage(montriangle[1], montriangle[2], { codage: '\\\\' })
          break
        case 5: // triangle équilatéral
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          lAC = lAB
          lBC = lAB
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          cA = cercle(A, lAC)
          cB = cercle(B, lBC)
          C = pointIntersectionCC(cA, cB, sommets[2], 1)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(afficheLongueurSegment(B, A), codageSegments('||', 'black', A, B, B, CC, A, CC))
          objetsCorrection.push(cible, traceCompas(A, C, 30, 'gray', 1, 2), traceCompas(B, C, 30, 'gray', 1, 2), afficheLongueurSegment(B, A), codageSegments('||', 'black', A, B, B, C, A, C))
          texteCorr += 'Pour cette construction, nous avons utilisé le compas et la règle graduée.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangleEquilateral(nom, lAB, true)
          break
        case 6: // triangle ABC dont on connaît AB et AC et l'angle BAC
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          lAC = randint(40, 60) / 10
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1], 'right')
          C = similitude(B, A, randint(8, 24) * 5, lAC / lAB, sommets[2], 'above')
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(codageAngle(B, A, CC, 1.1), afficheLongueurSegment(B, A), latexParPoint(nombreAvecEspace(Math.round(angle(B, A, C))) + '^\\circ', similitude(B, A, angle(B, A, C) / 2, 1 / lAB + 0.1)), afficheLongueurSegment(A, C, 'black', 1))
          objetsCorrection.push(cible, afficheLongueurSegment(B, A), afficheMesureAngle(B, A, C, 'black', 1), afficheLongueurSegment(A, C, 'black', 1))
          texteCorr += 'Pour cette construction, nous avons utilisé le rapporteur et la règle graduée.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangle2longueurs1angle(nom, lAB, lAC, Math.round(angle(B, A, C)), true)
          break
        case 7: // triangle ABC dont on connait AB et les deux angles adjacents
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          dAB = droite(A, B)
          dAC = rotation(dAB, A, randint(8, 14) * 5)
          dBC = rotation(dAB, B, -randint(8, 12) * 5)
          C = pointIntersectionDD(dAC, dBC, sommets[2])
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(codageAngle(B, A, CC, 1.1), latexParPoint(nombreAvecEspace(Math.round(angle(B, A, C))) + '^\\circ', similitude(B, A, angle(B, A, C) / 2, 1 / lAB + 0.1)), codageAngle(A, B, CC, 1.1), latexParPoint(nombreAvecEspace(Math.round(angle(A, B, C))) + '^\\circ', similitude(A, B, -angle(A, B, C) / 2, 1 / lAB + 0.1)))
          objetsCorrection.push(cible, afficheLongueurSegment(B, A), afficheMesureAngle(B, A, C, 'black', 1), afficheMesureAngle(A, B, C, 'black', 1))
          texteCorr += 'Pour cette construction, nous avons utilisé le rapporteur.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangle1longueur2angles(sommets, lAB, Math.round(angle(B, A, C)), Math.round(angle(A, B, C)))
          break
        case 8: // triangle ABC rectangle en B dont on connaît AB et l'hypoténuse AC
          lAC = randint(70, 80) / 10
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          cA = cercle(A, lAC)
          dAB = droite(A, B)
          dBC = droiteParPointEtPerpendiculaire(B, dAB)
          C = pointIntersectionLC(dBC, cA, sommets[2], 1)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(afficheLongueurSegment(B, A), afficheLongueurSegment(A, C, 'black', 1), codageAngleDroit(A, B, CC))
          objetsCorrection.push(cible, traceCompas(A, C, 30, 'gray', 1, 2), codageAngleDroit(A, B, C), afficheLongueurSegment(B, A), afficheLongueurSegment(A, C))
          texteCorr += 'Pour cette construction, nous avons utilisé la règle graduée, l\'équerre et le compas.<br>'
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangleRectangleCoteHypotenuse(nom, lAB, lAC, true)
          break
        case 9: // triangle ABC dont ont connais AB un angle adjacent et l'angle opposé
          lAB = calculANePlusJamaisUtiliser(randint(46, 60) / 10)
          B = pointAdistance(A, lAB, randint(-45, 45), sommets[1])
          B.positionLabel = 'right'
          dAB = droite(A, B)
          dAC = rotation(dAB, A, randint(8, 14) * 5)
          dBC = rotation(dAB, B, -randint(8, 12) * 5)
          C = pointIntersectionDD(dAC, dBC, sommets[2])
          lAC = longueur(A, C)
          C.positionLabel = 'above'
          CC = point(C.x + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, C.y + randint(-5, 5, [-2, -1, 0, 1, 2]) / 10, sommets[2])
          cellule = celluleAleaRonde(5)
          result = dansLaCibleRonde(C.x, C.y, 5, 0.3, cellule)
          cible = cibleRonde({ x: result[0], y: result[1], rang: 5, taille: 0.3 })
          objetsEnonce.push(cible, segmentAvecExtremites(A, B), polygoneAvecNom(A, B)[1])
          objetsEnonceml.push(codageAngle(B, A, CC, 1.1), afficheLongueurSegment(B, A), latexParPoint(nombreAvecEspace(Math.round(angle(B, A, C))) + '^\\circ', similitude(B, A, angle(B, A, C) / 2, 1 / lAB + 0.1)), codageAngle(A, CC, B, 1.1), latexParPoint(nombreAvecEspace(Math.round(angle(A, C, B))) + '^\\circ', similitude(A, CC, angle(A, CC, B) / 2, 1 / lAC + 0.1)))
          objetsCorrection.push(cible, afficheLongueurSegment(B, A), afficheMesureAngle(B, A, C, 'black', 1), afficheMesureAngle(A, B, C, 'black', 1), afficheMesureAngle(A, C, B, 'black', 1))
          texteCorr += `Pour cette construction, il a fallu calculer l'angle $\\widehat{${sommets[0] + sommets[1] + sommets[2]}}$.<br>$\\widehat{${sommets[0] + sommets[1] + sommets[2]}}=180-\\widehat{${sommets[1] + sommets[0] + sommets[2]}}-\\widehat{${sommets[0] + sommets[2] + sommets[1]}}=180-${Math.round(angle(B, A, C))}-${Math.round(angle(B, C, A))}=${Math.round(angle(A, B, C))}$.<br>Nous avons utilisé le rapporteur pour effectuer cette construction.<br>`
          texteCorr += `Le point ${sommets[2]} se trouve dans le secteur ${cellule}.<br>`
          xMin = Math.min(0, B.x, C.x, A.x) - 1
          yMax = Math.max(0, B.y, C.y, A.y) + 3
          IEP.recadre(xMin, yMax)
          IEP.triangle1longueur2angles(nom, lAB, Math.round(angle(B, A, C)), Math.round(angle(C, B, A)), true)
      }
      T = polygoneAvecNom(A, B, C)
      TT = polygoneAvecNom(A, B, CC)
      objetsEnonceml.push(TT[0], TT[1])
      objetsCorrection.push(T[0], T[1])
      texte += mathalea2d(Object.assign({}, fixeBordures(objetsEnonceml), { pixelsParCm: 30, scale: 1, mainlevee: true, amplitude: context.isHtml ? 0.3 : 1 }), objetsEnonceml)
      texte += mathalea2d(Object.assign({}, fixeBordures(objetsEnonce), { pixelsParCm: 30, scale: 1, mainlevee: false }), objetsEnonce)

      texteCorr += mathalea2d(Object.assign({}, fixeBordures(objetsCorrection), { pixelsParCm: 30, scale: 1, mainlevee: false }), objetsCorrection)
      texteCorr += '<br>' + IEP.htmlBouton(this.numeroExercice, i)
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
}
