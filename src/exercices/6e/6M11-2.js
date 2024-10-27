import { codageAngleDroit } from '../../lib/2d/angles.js'
import { arc, cercle } from '../../lib/2d/cercle.js'
import { codageSegment, texteSurSegment } from '../../lib/2d/codages.js'
import { droite, droiteParPointEtPerpendiculaire } from '../../lib/2d/droites.js'
import { point, pointIntersectionCC, pointIntersectionDD, pointSurCercle, tracePoint } from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { choice } from '../../lib/outils/arrayOutils'
import { arrondi, troncature } from '../../lib/outils/nombres'
import { sp } from '../../lib/outils/outilString.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texTexte } from '../../lib/format/texTexte'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Grandeur from '../../modules/Grandeur'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Calculer périmètre et aire de figures composées'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '06/05/2024'

/**
 * Il faut calculer le périmètre et/ou l'aire par addition ou soustraction d'aires
 *
 * @author Rémi Angot
 * Ajout de this.sup4 et correction coquilles sur aire et puis aussi sur précision au dixième par Eric Elter le 25/07/2023
 * Ajout de la possibilité de demander un découpage au lieu de calculer des périmètres ou des aires par Guillaume Valmont le 28/10/2023
 */
export const uuid = '5999f'
export const ref = '6M11-2'
export const refs = {
  'fr-fr': ['6M11-2'],
  'fr-ch': ['9GM1-8', '10GM1-6']
}
export default function PerimetreOuAireDeFiguresComposees () {
  Exercice.call(this)
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 2
  this.nbQuestionsModifiable = true
  this.sup = 7
  this.sup2 = true
  this.sup3 = 1
  this.sup4 = 3

  this.nouvelleVersion = function () {
    switch (this.sup4) {
      case 4:
        this.consigne = 'Décomposer les figures suivantes en plusieurs figures simples.'
        break
      case 3:
        this.consigne = 'Calculer le périmètre et l\'aire des figures suivantes.'
        break
      case 2:
        this.consigne = 'Calculer l\'aire des figures suivantes.'
        break
      default:
        this.consigne = 'Calculer le périmètre des figures suivantes.'
        break
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

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

    const typesDeQuestions = gestionnaireFormulaireTexte({
      max: 6,
      defaut: 7,
      melange: 7,
      nbQuestions: this.nbQuestions,
      shuffle: this.sup2,
      saisie: this.sup
    })

    const texteSurSeg = function (A, B, texte, d = 0.7) {
      const segT = texteSurSegment(texte, A, B, 'black', d)
      segT.mathOn = false
      segT.scale = 1.1
      return segT
    }

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      let texte, texteCorr, perimetre, aire
      if (this.sup4 === 4) {
        this.nbCols = 2
        this.nbColsCorr = 2
      }
      const contourFigure = []
      const decoupages = []
      const codagesSansDecoupage = []
      const codagesDecoupage = []
      const labelsSansDecoupage = []
      const labelsAvecDecoupage = []
      const objetsEnonce = []
      const objetsCorrection = []
      switch (typesDeQuestions[i]) {
        case 1 : { // 'rectangle_triangle': {
          const triplet = choice(tripletsPythagoriciens)
          const adjust = (triplet[2] > 50 ? 0.1 : randint(2, 3) / 10)
          const partieDecimale1 = adjust - 1
          const l1 = triplet[0] * (1 + partieDecimale1)
          const L2 = triplet[1] * (1 + partieDecimale1)
          const hyp = triplet[2] * (1 + partieDecimale1)
          const L1 = randint(Math.ceil(l1) + 1, Math.ceil(l1) + 4) + randint(1, 9) / 10
          const zoom = randint(10, 14) / (L1 + L2)
          const A = point(0, 0, 'A')
          const B = point(0, l1 * zoom, 'B')
          const C = point(L1 * zoom, l1 * zoom, 'C')
          const D = point((L1 + L2) * zoom, l1 * zoom, 'D')
          const E = point(L1 * zoom, 0, 'E')
          const p1 = polygoneAvecNom(A, B, C, D, E)
          contourFigure.push(p1[0])
          codagesDecoupage.push(codageAngleDroit(B, C, E), codageAngleDroit(C, E, A), codageSegment(A, B, '/', 'black'), codageSegment(C, E, '/', 'black'), codageSegment(B, C, '//', 'black'), codageSegment(A, E, '//', 'black'), codageAngleDroit(E, C, D, 'blue'))
          codagesSansDecoupage.push(codageAngleDroit(A, B, C), codageAngleDroit(E, A, B))
          const CE = segment(C, E)
          CE.pointilles = 5
          decoupages.push(CE)
          labelsSansDecoupage.push(texteSurSeg(D, E, stringNombre(hyp, 1) + ' cm'), texteSurSeg(A, B, stringNombre(l1, 1) + ' cm'), texteSurSeg(E, A, stringNombre(L1, 1) + ' cm'), texteSurSeg(B, D, stringNombre(L1 + L2, 1) + ' cm'))
          labelsAvecDecoupage.push(texteSurSeg(D, E, stringNombre(hyp, 1) + ' cm'), texteSurSeg(A, B, stringNombre(l1, 1) + ' cm'), texteSurSeg(E, A, stringNombre(L1, 1) + ' cm'), texteSurSeg(C, D, stringNombre(L2, 1) + ' cm'))
          if (this.sup4 === 4) {
            objetsEnonce.push(...contourFigure, ...codagesSansDecoupage, ...labelsSansDecoupage)
            objetsCorrection.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          } else {
            objetsEnonce.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          }
          texte = mathalea2d(Object.assign({
            scale: 0.7,
            pixelsParCm: 20,
            zoom: 1,
            optionsTikz: 'baseline=(current bounding box.north)'
          }, fixeBordures([A, B, C, D, E, point(C.x, C.y + 0.5)], { rxmin: -1.2, rymin: -1.2 })), ...objetsEnonce)

          if (this.sup4 === 4) {
            texteCorr = mathalea2d(Object.assign({
              scale: 0.7,
              pixelsParCm: 20,
              zoom: 1,
              optionsTikz: 'baseline=(current bounding box.north)'
            }, fixeBordures([A, B, C, D, E, point(C.x, C.y + 0.2)], { rxmin: -1, rymin: -1 })), ...objetsCorrection)
            texteCorr += `<br>
            On peut découper cette figure en un rectangle de ${stringNombre(L1, 1)} cm par ${stringNombre(l1, 1)} cm
            et un triangle rectangle dont les côtés de l'angle droit mesurent respectivement ${stringNombre(L2, 1)} cm
            et ${stringNombre(l1, 1)} cm.<br>`
          } else {
            texteCorr = `La figure est composée d'un rectangle de ${stringNombre(L1, 1)} cm par ${stringNombre(l1, 1)} cm`
            texteCorr += ` et d'un triangle rectangle dont les côtés de l'angle droit mesurent respectivement ${stringNombre(L2, 1)} cm et ${stringNombre(l1, 1)} cm.<br>`
            texteCorr += this.sup4 !== 2 ? `$\\mathcal{P}=${texNombre(L1 + L2, 1)}+${texNombre(hyp, 1)}+${texNombre(L1, 1)}+${texNombre(l1, 1)}=${miseEnEvidence(texNombre(L1 + L2 + hyp + L1 + l1, 1))}${sp()}${texTexte('cm')}$<br>` : ''
            texteCorr += this.sup4 !== 1 ? `$\\mathcal{A}=(${texNombre(L1, 1)}\\times${texNombre(l1, 1)})+(${texNombre(L2, 1)}\\times${texNombre(l1, 1)}\\div2)=${texNombre(L1 * l1, 2)}+${texNombre((L2 * l1) / 2, 2)}=${miseEnEvidence(texNombre(L1 * l1 + (L2 * l1) / 2, 2))}${sp()}${texTexte('cm')}^2$` : ''
          }
          perimetre = arrondi(L1 + L2 + hyp + L1 + l1, 1)
          aire = arrondi(L1 * l1 + (L2 * l1) / 2, 2)
          break
        }
        case 2 : { // 'rectangle_moins_triangle': {
          const triplet = choice(tripletsPythagoriciens)
          const adjust = (triplet[2] > 50 ? 0.1 : randint(2, 3) / 10)
          const c1 = triplet[0] * (adjust)
          const c2 = triplet[1] * (adjust)
          const c = triplet[2] * (adjust)
          const zoom = randint(8, 12) / c
          // const h = c1 * c2 / c
          const M = point(0, 0, 'M')
          const N = point(0, c * zoom, 'N')
          const O = point(c * zoom, c * zoom, 'O')
          const P = point(c * zoom, 0, 'P')
          const S = pointIntersectionCC(cercle(N, c1 * zoom), cercle(O, c2 * zoom), 'S', 2)
          // const H = pointIntersectionDD(droite(N, O), droiteParPointEtPerpendiculaire(S, droite(N, O)))
          const p2 = polygoneAvecNom(M, N, S, O, P)
          contourFigure.push(p2[0])
          const NO = segment(N, O)
          NO.pointilles = 5
          decoupages.push(NO)
          codagesSansDecoupage.push(codageAngleDroit(N, S, O), codageAngleDroit(O, P, M), codageAngleDroit(P, M, N), codageSegment(M, N, '//', 'black'), codageSegment(M, P, '//', 'black'), codageSegment(O, P, '//', 'black'))
          codagesDecoupage.push(codageAngleDroit(M, N, O), codageAngleDroit(N, O, P))
          labelsSansDecoupage.push(texteSurSeg(P, M, stringNombre(c, 1) + ' cm'), texteSurSeg(S, N, stringNombre(c1, 1) + ' cm', -0.7), texteSurSeg(O, S, stringNombre(c2, 1) + ' cm'))
          labelsAvecDecoupage.push(...labelsSansDecoupage)
          if (this.sup4 === 4) {
            objetsEnonce.push(...contourFigure, ...codagesSansDecoupage, ...labelsSansDecoupage)
            objetsCorrection.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          } else {
            objetsEnonce.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          }
          texte = mathalea2d(Object.assign({
            scale: 0.7,
            pixelsParCm: 20,
            zoom: 1,
            optionsTikz: 'baseline=(current bounding box.north)'
          }, fixeBordures([M, N, S, O, P, point(N.x, N.y + 0.5)], { rxmin: -1, rymin: -1 })), ...objetsEnonce)

          if (this.sup4 === 4) {
            texteCorr = mathalea2d(Object.assign({
              scale: 0.7,
              pixelsParCm: 20,
              zoom: 1,
              optionsTikz: 'baseline=(current bounding box.north)'
            }, fixeBordures([M, N, S, O, P, point(N.x, N.y + 0.5)], { rxmin: -1, rymin: -1 })), ...objetsCorrection)
            texteCorr += `<br>
            La figure est un carré de côté ${stringNombre(c, 1)} cm auquel il faut enlever un triangle rectangle dont les côtés de l'angle droit mesurent respectivement ${stringNombre(c1, 1)} cm et ${stringNombre(c2, 1)} cm.<br>`
          } else {
            texteCorr = `La figure est un carré de côté ${stringNombre(c, 1)} cm auquel il faut enlever un triangle rectangle dont les côtés de l'angle droit mesurent respectivement ${stringNombre(c1, 1)} cm et ${stringNombre(c2, 1)} cm.<br>`
            texteCorr += this.sup4 !== 2 ? `$\\mathcal{P}=${texNombre(c, 1)}+${texNombre(c, 1)}+${texNombre(c, 1)}+${texNombre(c1, 1)}+${texNombre(c2, 1)}=${miseEnEvidence(texNombre(3 * c + c1 + c2, 1))}${sp()}${texTexte('cm')}$<br>` : ''
            texteCorr += this.sup4 !== 1 ? `$\\mathcal{A}=(${texNombre(c, 1)}\\times${texNombre(c, 1)})-(${texNombre(c1, 1)}\\times${texNombre(c2, 1)}\\div2)=${miseEnEvidence(texNombre(c ** 2 - (c1 * c2) / 2, 2))}${sp()}${texTexte('cm')}^2$<br>` : ''
          }
          perimetre = arrondi(3 * c + c1 + c2, 1)
          aire = arrondi(c ** 2 - (c1 * c2) / 2, 2)
          break
        }
        case 3 : { // 'rectangle_moins_deux_triangles': {
          const deuxtripletsPythagoriciens = [
            [[8, 6, 10], [8, 15, 17]],
            [[20, 48, 52], [20, 21, 29]],
            [[12, 5, 13], [12, 16, 20]],
            [[20, 21, 29], [5 * 4, 12 * 4, 13 * 4]],
            [[20, 21, 29], [3 * 7, 4 * 7, 5 * 7]],
            [[48, 55, 73], [4 * 12, 3 * 12, 5 * 12]],
            [[28, 45, 53], [4 * 7, 3 * 7, 5 * 7]],
            [[36, 77, 85], [4 * 9, 3 * 9, 5 * 9]],
            [[39, 80, 89], [3 * 13, 4 * 13, 5 * 13]]
          ]
          const [triplet1, triplet2] = choice(deuxtripletsPythagoriciens)
          const adjust = (triplet1[1] + triplet2[1] > 50 ? 0.1 : randint(3, 4) / 10)
          const com1 = triplet1[0] * (adjust)
          const c1 = triplet1[1] * (adjust)
          const h1 = triplet1[2] * (adjust)
          const c2 = triplet2[1] * (adjust)
          const h2 = triplet2[2] * (adjust)
          const zoom = randint(8, 12) / (c1 + c2)
          const h = com1
          const c = c1 + c2
          const M = point(0, 0, 'M')
          const N = point(0, c * zoom, 'N')
          const O = point(c * zoom, c * zoom, 'O')
          const P = point(c * zoom, 0, 'P')
          const S = pointIntersectionCC(cercle(N, h1 * zoom), cercle(O, h2 * zoom), 'S', 2)
          const T = pointIntersectionDD(droite(M, N), droiteParPointEtPerpendiculaire(S, droite(M, N)))
          const U = pointIntersectionDD(droite(O, P), droiteParPointEtPerpendiculaire(S, droite(M, N)))
          const H = pointIntersectionDD(droite(N, O), droiteParPointEtPerpendiculaire(S, droite(N, O)))
          const p2 = polygoneAvecNom(M, N, S, O, P)
          contourFigure.push(p2[0])
          const HS = segment(H, S)
          HS.pointilles = 5
          const NO = segment(N, O)
          NO.pointilles = 5
          const TU = segment(T, U)
          TU.pointilles = 5
          decoupages.push(HS, NO)
          const decoupages2 = [TU]
          codagesSansDecoupage.push(codageAngleDroit(O, P, M), codageAngleDroit(P, M, N))
          codagesDecoupage.push(codageAngleDroit(M, N, O), codageAngleDroit(N, O, P), codageAngleDroit(N, H, S), codageAngleDroit(S, H, O, 'blue'), codageSegment(M, N, '//', 'black'), codageSegment(M, P, '//', 'black'), codageSegment(O, P, '//', 'black'))
          const codagesDecoupages2 = [codageAngleDroit(M, T, S), codageAngleDroit(N, T, S), codageAngleDroit(P, U, S), codageAngleDroit(O, U, S), codageSegment(M, T, '//', 'black'), codageSegment(P, U, '//', 'black'), codageSegment(T, N, '/', 'black'), codageSegment(U, O, '/', 'black'), codageSegment(M, P, '///', 'black'), codageSegment(T, U, '///', 'black')]
          labelsSansDecoupage.push()
          labelsAvecDecoupage.push(texteSurSeg(P, M, stringNombre(c, 1) + ' cm'), texteSurSeg(S, N, stringNombre(h1, 1) + ' cm'), texteSurSeg(O, S, stringNombre(h2, 1) + ' cm'), texteSurSeg(H, S, stringNombre(com1, 1) + ' cm', (H.x - N.x > O.x - H.x ? -0.7 : 0.7)))
          objetsCorrection.push(...contourFigure, ...decoupages2, ...codagesSansDecoupage, ...codagesDecoupages2)
          if (this.sup4 === 4) {
            objetsEnonce.push(...contourFigure, ...codagesSansDecoupage, ...labelsSansDecoupage)
          } else {
            objetsEnonce.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          }
          texte = mathalea2d(Object.assign({
            scale: 0.7,
            pixelsParCm: 20,
            zoom: 1,
            optionsTikz: 'baseline=(current bounding box.north)'
          }, fixeBordures([M, N, S, O, P, point(N.x, N.y + 0.5)], { rxmin: -1, rymin: -1 })), ...objetsEnonce)

          if (this.sup4 === 4) {
            texteCorr = mathalea2d(Object.assign({
              scale: 0.7,
              pixelsParCm: 20,
              zoom: 1,
              optionsTikz: 'baseline=(current bounding box.north)'
            }, fixeBordures([M, N, S, O, P, point(N.x, N.y + 0.5)], { rxmin: -1, rymin: -1 })), ...objetsCorrection)
            texteCorr += `<br>
            La figure est composée d'un rectangle et deux triangles rectangles.<br>`
          } else {
            texteCorr = `La figure est un carré de côté ${stringNombre(c, 1)} cm auquel il faut enlever un triangle de ${stringNombre(c, 1)} cm de base et ${stringNombre(h, 1)} cm de hauteur.<br>`
            texteCorr += this.sup4 !== 2 ? `$\\mathcal{P}=${texNombre(c, 1)}+${texNombre(c, 1)}+${texNombre(c, 1)}+${texNombre(h1, 1)}+${texNombre(h2, 1)}=${miseEnEvidence(texNombre(3 * c + h1 + h2, 1))}${sp()}${texTexte('cm')}$<br>` : ''
            texteCorr += this.sup4 !== 1 ? `$\\mathcal{A}=(${texNombre(c, 1)}\\times${texNombre(c, 1)})-(${texNombre(c, 1)}\\times${texNombre(h, 1)}\\div2)=${texNombre(c * c, 2)}-${texNombre((c * h) / 2, 2)}=${miseEnEvidence(texNombre(c ** 2 - (c * h) / 2, 2))}${sp()}${texTexte('cm')}^2$<br>` : ''
          }
          perimetre = arrondi(3 * c + h1 + h2, 1)
          aire = arrondi(c ** 2 - (c * h) / 2, 2)
          break
        }
        case 4 : { // 'rectangle_demi_cercle': {
          let L1 = randint(4, 8)
          let L2 = randint(3, L1 - 1)
          L1 = L1 + (randint(1, 9) / 10)
          // L2 = L2 + (randint(1, 9) / 10)
          L2 = L2 + (randint(1, 4) / 5)
          const zoom = randint(6, 8) / (L2)
          const A = point(0, 0, 'A')
          const B = point(0, L2 * zoom, 'B')
          const C = point(L1 * zoom, L2 * zoom, 'C')
          const D = point(L1 * zoom, 0, 'D')
          const E = point(L1 * zoom, L2 * zoom * 0.5, 'E')
          const R = pointSurCercle(cercle(E, zoom * L2 / 2), -5, 'R')
          contourFigure.push(segment(A, B), segment(B, C), segment(A, D))
          const demicercle = arc(D, E, 180, false, 'none')
          contourFigure.push(demicercle)
          codagesSansDecoupage.push(codageAngleDroit(A, B, C), codageAngleDroit(D, A, B), codageSegment(A, D, '/', 'black'), codageSegment(C, B, '/', 'black'), tracePoint(C, D))
          codagesDecoupage.push(codageAngleDroit(B, C, D), codageAngleDroit(A, D, C), codageSegment(E, R, '//', 'black'), codageSegment(E, D, '//', 'black'), codageSegment(E, C, '//', 'black'))
          const CD = segment(C, D)
          CD.pointilles = 5
          const ER = segment(E, R)
          ER.pointilles = 5
          decoupages.push(CD, ER)
          // labelsSansDecoupage.push(texteSurSeg(A, B, stringNombre(L2, 1) + ' cm'), texteSurSeg(A, D, stringNombre(L1, 1) + ' cm'))
          labelsAvecDecoupage.push(texteSurSeg(A, B, stringNombre(L2, 1) + ' cm'), texteSurSeg(A, D, stringNombre(L1, 1) + ' cm'), texteSurSeg(E, R, stringNombre(L2 / 2, 1) + ' cm'))
          if (this.sup4 === 4) {
            objetsEnonce.push(...contourFigure, ...codagesSansDecoupage, ...labelsSansDecoupage)
            objetsCorrection.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          } else {
            objetsEnonce.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          }
          texte = mathalea2d(Object.assign({
            scale: 0.7,
            pixelsParCm: 20,
            zoom: 1,
            optionsTikz: 'baseline=(current bounding box.north)'
          }, fixeBordures([A, B, C, D, E, demicercle, point(C.x, C.y + 0.2)], {
            rxmin: -1.2,
            rymin: -1
          })), ...objetsEnonce)
          if (this.sup4 === 4) {
            texteCorr = mathalea2d(Object.assign({
              scale: 0.7,
              pixelsParCm: 20,
              zoom: 1,
              optionsTikz: 'baseline=(current bounding box.north)'
            }, fixeBordures([A, B, C, D, E, demicercle, point(C.x, C.y + 0.2)], {
              rxmin: -1,
              rymin: -1
            })), ...objetsCorrection)
            texteCorr += `<br>
            La figure est composée d'un rectangle de ${stringNombre(L1, 1)} cm par ${stringNombre(L2, 1)} cm
            et d'un demi disque de rayon ${stringNombre(L2 / 2, 1)} cm.<br>`
          } else {
            texteCorr = `La figure est composée d'un rectangle de ${stringNombre(L1, 1)} cm par ${stringNombre(L2, 1)} cm`
            texteCorr += ` et d'un demi disque de rayon ${stringNombre(L2 / 2, 1)} cm.<br>`
            texteCorr += this.sup4 !== 2 ? `$\\mathcal{P}=${texNombre(L1, 1)}+${texNombre(L2, 1)}+${texNombre(L1, 1)}+(${texNombre(L2, 1)}\\times \\pi \\div 2) \\approx ${texNombre(troncature(L1 + L2 + L1 + L2 * Math.PI / 2, 3), 3)}${sp()}${texTexte('cm')}$<br>` : ''
            texteCorr += this.sup4 !== 1 ? `$\\mathcal{A}=(${texNombre(L1, 1)}\\times${texNombre(L2, 1)})+(${texNombre(L2 / 2, 1)}\\times${texNombre(L2 / 2, 1)}\\times\\pi \\div 2) \\approx ${texNombre(troncature(L1 * L2 + (L2 / 2) * (L2 / 2) * Math.PI / 2, 3), 3)}${sp()}${texTexte('cm')}^2$<br>` : ''
            texteCorr += this.sup4 !== 2 ? `Une valeur approchée ${this.sup3 === 1 ? 'au cm' : 'au dixième de cm'} est donc $\\mathcal{P}\\approx ${miseEnEvidence(texNombre(troncature(L1 + L2 + L1 + L2 * Math.PI / 2, this.sup3 - 1), 1))}${sp()}${texTexte('cm')}$.<br>` : ''
            texteCorr += this.sup4 !== 1 ? `Une valeur approchée ${this.sup3 === 1 ? 'au cm$^2$' : 'au dixième de cm$^2$'} est donc $\\mathcal{A}\\approx ${miseEnEvidence(texNombre(troncature(L1 * L2 + (L2 / 2) * (L2 / 2) * Math.PI / 2, this.sup3 - 1), 2))}${sp()}${texTexte('cm')}^2$.<br>` : ''
          }
          perimetre = arrondi(L1 + L2 + L1 + L2 * Math.PI / 2, this.sup3 - 1)
          aire = arrondi(L1 * L2 + (L2 / 2) * (L2 / 2) * Math.PI / 2, this.sup3 - 1)
          break
        }
        case 5 : { // 'rectangle_cercle': {
          let L1 = randint(5, 8)
          let L2 = randint(L1 - 2, L1 - 1)
          L1 = L1 + randint(1, 9, [1, 3, 5, 7, 9]) / 10
          L2 = L2 + randint(1, 9, [1, 3, 5, 7, 9]) / 10
          const zoom = randint(6, 8) / (L2)
          const A = point(0, 0, 'A')
          const B = point(0, L2 * zoom, 'B')
          const C = point(L1 * zoom, L2 * zoom, 'C')
          const D = point(L1 * zoom, 0, 'D')
          const E = point(L1 * zoom, L2 * zoom * 0.5, 'E')
          const F = point(0, L2 * zoom * 0.5, 'F')
          const R = pointSurCercle(cercle(E, zoom * L2 / 2), -5, 'R')
          const S = pointSurCercle(cercle(F, zoom * L2 / 2), -185, 'R')
          const demicercle = arc(D, E, 180, false, 'none')
          const demicercle2 = arc(B, F, 180, false, 'none')
          contourFigure.push(segment(B, C), segment(A, D), demicercle, demicercle2)
          codagesDecoupage.push(codageSegment(A, D, '/', 'black'), codageSegment(C, B, '/', 'black'), tracePoint(A, B, C, D), codageAngleDroit(A, B, C), codageAngleDroit(B, C, D), codageAngleDroit(D, A, B), codageAngleDroit(A, D, C), codageSegment(E, R, '//', 'black'), codageSegment(E, D, '//', 'black'), codageSegment(E, C, '//', 'black'), codageSegment(F, S, '//', 'black'), codageSegment(F, B, '//', 'black'), codageSegment(F, A, '//', 'black'))
          const CD = segment(C, D)
          CD.pointilles = 5
          const AB = segment(A, B)
          AB.pointilles = 5
          const ER = segment(E, R)
          ER.pointilles = 5
          const FS = segment(F, S)
          FS.pointilles = 5
          decoupages.push(CD, AB, ER, FS)
          labelsAvecDecoupage.push(texteSurSeg(E, R, stringNombre(L2 / 2, 1) + ' cm'), texteSurSeg(A, D, stringNombre(L1, 1) + ' cm'))
          if (this.sup4 === 4) {
            objetsEnonce.push(...contourFigure, ...codagesSansDecoupage, ...labelsSansDecoupage)
            objetsCorrection.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage)
          } else {
            objetsEnonce.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          }
          texte = mathalea2d(Object.assign({
            scale: 0.7,
            pixelsParCm: 20,
            zoom: 1,
            optionsTikz: 'baseline=(current bounding box.north)'
          }, fixeBordures([A, B, C, D, E, demicercle, demicercle2, point(C.x, C.y + 0.2)], {
            rxmin: -1,
            rymin: -1
          })), ...objetsEnonce)
          if (this.sup4 === 4) {
            texteCorr = mathalea2d(Object.assign({
              scale: 0.7,
              pixelsParCm: 20,
              zoom: 1,
              optionsTikz: 'baseline=(current bounding box.north)'
            }, fixeBordures([A, B, C, D, E, demicercle, demicercle2, point(C.x, C.y + 0.2)], {
              rxmin: -1,
              rymin: -1
            })), ...objetsCorrection)
            texteCorr += `<br>
            La figure est composée d'un rectangle
            et de deux demi-disques.<br>`
          } else {
            texteCorr = `La figure est composée d'un rectangle de ${stringNombre(L1, 1)} cm par ${stringNombre(L2, 1)} cm`
            texteCorr += ` et de deux demi-disques de rayon ${stringNombre(L2 / 2, 1)} cm.<br>`
            texteCorr += this.sup4 !== 2 ? `$\\mathcal{P}=${texNombre(L1, 1)}+${texNombre(L1, 1)}+(${texNombre(L2, 1)}\\times \\pi) \\approx ${texNombre(L1 + L1 + L2 * Math.PI, 3)}${sp()}${texTexte('cm')}$<br>` : ''
            texteCorr += this.sup4 !== 1 ? `$\\mathcal{A}=(${texNombre(L1, 1)}\\times${texNombre(L2, 1)})+(${texNombre(L2 / 2, 1)}\\times${texNombre(L2 / 2, 1)}\\times\\pi)\\approx ${texNombre(L1 * L2 + (L2 / 2) * (L2 / 2) * Math.PI, 3)}${sp()}${texTexte('cm')}^2$<br>` : ''
            texteCorr += this.sup4 !== 2 ? `Une valeur approchée ${this.sup3 === 1 ? 'au cm' : 'au dixième de cm'} est donc $\\mathcal{P}\\approx ${miseEnEvidence(texNombre(troncature(L1 + L1 + L2 * Math.PI, this.sup3 - 1), 1))}${sp()}${texTexte('cm')}$.<br>` : ''
            texteCorr += this.sup4 !== 1 ? `Une valeur approchée ${this.sup3 === 1 ? 'au cm$^2$' : 'au dixième de cm$^2$'} est donc $\\mathcal{A}\\approx ${miseEnEvidence(texNombre(troncature(L1 * L2 + (L2 / 2) * (L2 / 2) * Math.PI, this.sup3 - 1), 1))}${sp()}${texTexte('cm')}^2$.<br>` : ''
          }
          perimetre = arrondi(L1 + L1 + L2 * Math.PI, this.sup3 - 1)
          aire = arrondi(L1 * L2 + (L2 / 2) * (L2 / 2) * Math.PI, this.sup3 - 1)
          break
        }
        case 6 : { // 'rectangle_triangle_demi_disque': {
          const triplet = choice(tripletsPythagoriciens)
          const adjust = (triplet[2] > 50 ? randint(2, 4, [3]) / 10 : triplet[2] > 10 ? randint(6, 8, [7]) / 10 : randint(10, 12, [11]) / 10)
          const l1 = triplet[0] * (adjust)
          const L2 = triplet[1] * (adjust)
          const hyp = triplet[2] * (adjust)
          const L1 = randint(Math.ceil(l1) + 1, Math.ceil(l1) + 4) + randint(1, 9) / 10
          const zoom = randint(14, 18) / (L1 + L2)
          const A = point(0, 0, 'A')
          const B = point(0, l1 * zoom, 'B')
          const C = point(L1 * zoom, l1 * zoom, 'C')
          const D = point((L1 + L2) * zoom, l1 * zoom, 'D')
          const E = point(L1 * zoom, 0, 'E')
          const F = point(0, l1 * zoom * 0.5, 'E')
          const R = pointSurCercle(cercle(F, zoom * l1 / 2), 185, 'R')
          const demicercle = arc(B, F, 180, false, 'none')
          contourFigure.push(demicercle, segment(A, E), segment(D, E), segment(B, D))
          codagesDecoupage.push(codageAngleDroit(A, B, C), codageAngleDroit(B, C, E), codageAngleDroit(C, E, A), codageAngleDroit(E, A, B), codageSegment(F, R, '//', 'black'), codageSegment(F, A, '//', 'black'), codageSegment(F, B, '//', 'black'), codageSegment(A, E, '/', 'black'), codageSegment(C, B, '/', 'black'), codageAngleDroit(D, C, E, 'blue'))
          const FR = segment(F, R)
          FR.pointilles = 5
          const AB = segment(A, B)
          AB.pointilles = 5
          const CE = segment(C, E)
          CE.pointilles = 5
          decoupages.push(FR, AB, CE)
          labelsAvecDecoupage.push(texteSurSeg(F, B, stringNombre(l1 / 2, 1) + ' cm', -0.8), texteSurSeg(D, E, stringNombre(hyp, 1) + ' cm'), texteSurSeg(E, C, stringNombre(l1, 1) + ' cm'), texteSurSeg(E, A, stringNombre(L1, 1) + ' cm'), texteSurSeg(C, D, stringNombre(L2, 1) + ' cm'))
          if (this.sup4 === 4) {
            objetsEnonce.push(...contourFigure, ...codagesSansDecoupage)
            objetsCorrection.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage)
          } else {
            objetsEnonce.push(...contourFigure, ...decoupages, ...codagesSansDecoupage, ...codagesDecoupage, ...labelsAvecDecoupage)
          }
          texte = mathalea2d(Object.assign({
            scale: 0.7,
            pixelsParCm: 20,
            zoom: 1,
            optionsTikz: 'baseline=(current bounding box.north)'
          }, fixeBordures([demicercle, A, B, C, D, E, point(C.x, C.y + 0.6)], {
            rxmin: -1,
            rymin: -1
          })), ...objetsEnonce)
          if (this.sup4 === 4) {
            texteCorr = mathalea2d(Object.assign({
              scale: 0.7,
              pixelsParCm: 20,
              zoom: 1,
              optionsTikz: 'baseline=(current bounding box.north)'
            }, fixeBordures([demicercle, A, B, C, D, E, point(C.x, C.y + 0.2)], {
              rxmin: -1,
              rymin: -1
            })), ...objetsCorrection)
            texteCorr += `<br>
            La figure est composée d'un rectangle, d'un triangle rectangle et d'un demi-disque.<br>`
          } else {
            texteCorr = `La figure est composée d'un rectangle de ${stringNombre(L1, 1)} cm par ${stringNombre(l1, 1)} cm, `
            texteCorr += `d'un triangle rectangle dont les côtés de l'angle droit mesurent respectivement ${stringNombre(L2, 1)} cm et ${stringNombre(l1, 1)} cm `
            texteCorr += `et d'un demi-disque de rayon ${stringNombre(l1 / 2, 1)}${sp()}cm.<br>`
            texteCorr += this.sup4 !== 2 ? `$\\mathcal{P}=${texNombre(L1, 1)}+${texNombre(L1 + L2, 1)}+(${texNombre(l1, 1)}\\times \\pi \\div 2)+${texNombre(hyp, 1)}\\approx${texNombre(troncature(L1 + L1 + hyp + L2 + l1 * Math.PI / 2, 3), 1)}${sp()}${texTexte('cm')}$<br>` : ''
            texteCorr += this.sup4 !== 1 ? `$\\mathcal{A}=(${texNombre(L1, 1)}\\times${texNombre(l1, 1)})+(${texNombre(L2, 1)}\\times${texNombre(l1, 1)} \\div 2) + (\\pi \\times${texNombre(l1, 1)} \\div 2)\\approx${texNombre(troncature(L1 * l1 + (L2 * l1) / 2 + (l1 / 2) * (l1 / 2) * Math.PI / 2, 3), 2)}${sp()}${texTexte('cm')}^2$<br>` : ''
            texteCorr += this.sup4 !== 2 ? `Une valeur approchée ${this.sup3 === 1 ? 'au cm' : 'au dixième de cm'} est donc $\\mathcal{P}\\approx ${miseEnEvidence(texNombre(troncature(L1 + L2 + hyp + L1 + l1 * Math.PI / 2, this.sup3 - 1), 1))}${sp()}${texTexte('cm')}$.<br>` : ''
            texteCorr += this.sup4 !== 1 ? `Une valeur approchée ${this.sup3 === 1 ? 'au cm$^2$' : 'au dixième de cm$^2$'} est donc $\\mathcal{A}\\approx ${miseEnEvidence(texNombre(troncature(L1 * l1 + (l1 / 2) * (l1 / 2) * Math.PI / 2 + L2 * l1 / 2, this.sup3 - 1), 2))}${sp()}${texTexte('cm')}^2$.<br>` : ''
          }
          perimetre = arrondi(L1 + L2 + hyp + L1 + l1 * Math.PI / 2, this.sup3 - 1)
          aire = arrondi(L1 * l1 + (L2 * l1) / 2 + (l1 / 2) * (l1 / 2) * Math.PI / 2, this.sup3 - 1)
          break
        }
      }
      if (this.sup4 === 1 || this.sup4 === 3) {
        texte += ajouteChampTexteMathLive(this, i * (this.sup4 === 3 ? 2 : 1), '  unites[longueurs]', { texteAvant: 'Périmètre ' + (typesDeQuestions[i] > 3 ? `(valeur approchée au ${this.sup3 === 2 ? 'dixième de' : ''} cm près)` : '') + ' : ' })
      }
      if (this.sup4 === 2 || this.sup4 === 3) {
        texte += ajouteChampTexteMathLive(this, (this.sup4 === 3 ? 1 : 0) + i * (this.sup4 === 3 ? 2 : 1), '  unites[aires]', { texteAvant: (typesDeQuestions[i] > 3 ? '<br>' : sp(15)) + 'Aire ' + (typesDeQuestions[i] > 3 ? `(valeur approchée au ${this.sup3 === 2 ? 'dixième de' : ''} cm$^2$ près)` : '') + ' : ' })
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: (this.consigne + '\\\\') + texte,
          options: { multicols: true, barreseparation: false, numerotationEnonce: true },
          propositions: [
            {
              type: 'AMCOpen',
              propositions: [{
                enonce: 'Indiquer ci-dessous les calculs : <br>',
                numQuestionVisible: false,
                texte: texteCorr,
                statut: this.sup4 !== 3 ? 3 : 6,
                pointilles: false
              }]
            }
          ]
        }
        if (this.sup4 === 1 || this.sup4 === 3) {
          this.autoCorrection[i].propositions.push(
            {
              type: 'AMCNum',
              propositions: [
                {
                  texte: '',
                  reponse: {
                    valeur: [Math.floor(perimetre)],
                    texte: 'Périmètre en cm ' + (typesDeQuestions[i] > 3 ? '(valeur approchée à l\'unité)' : '') + ' : ',
                    alignement: 'center',
                    param: {
                      digits: 3,
                      decimals: typesDeQuestions[i] > 3 ? 0 : 1,
                      signe: false,
                      aussiCorrect: [Math.ceil(perimetre)]
                    }
                  }
                }
              ]
            }
          )
        }
        if (this.sup4 === 2 || this.sup4 === 3) {
          this.autoCorrection[i].propositions.push(
            {
              type: 'AMCNum',
              propositions: [
                {
                  texte: '',
                  reponse: {
                    valeur: [Math.floor(aire)],
                    texte: 'Aire en cm$^2$ ' + (typesDeQuestions[i] > 3 ? '(valeur approchée à l\'unité)' : '') + ' : ',
                    alignement: 'center',
                    param: {
                      digits: 3,
                      decimals: typesDeQuestions[i] > 3 ? 0 : 1,
                      signe: false,
                      aussiCorrect: [Math.ceil(aire)]
                    }
                  }
                }
              ]
            }
          )
        }
      } else {
        if (this.sup4 === 1 || this.sup4 === 3) setReponse(this, i * (this.sup4 === 3 ? 2 : 1), new Grandeur(perimetre, 'cm'), { formatInteractif: 'unites', precision: this.sup3 - 1 })
        if (this.sup4 === 2 || this.sup4 === 3) setReponse(this, (this.sup4 === 3 ? 1 : 0) + i * (this.sup4 === 3 ? 2 : 1), new Grandeur(aire, 'cm^2'), { formatInteractif: 'unites', precision: this.sup3 - 1 })
      }
      if (this.questionJamaisPosee(i, perimetre, aire)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }

    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Types de figures',
    'Nombres séparés par des tirets\n1 : Rectangle & triangle\n2 : Rectangle moins triangle\n3 : Rectangle moins deux triangles\n4 : Rectangle & demi-disque\n5 : Rectangle & disque \n6 : Rectangle & demi-disque & triangle\n7 : Mélange'
  ]
  this.besoinFormulaire2CaseACocher = ['Ordre aléatoire des figures choisies']
  this.besoinFormulaire3Numerique = ['Choix de la précision (pour les valeurs approchées)', 2, '1 : À l\'unité\n 2 : Au dixième']
  this.besoinFormulaire4Numerique = ['Choix de la demande ', 3, '1 : Que le périmètre\n 2 : Que l\'aire\n3 : Périmètre et aire\n4 : Découpage']
}
