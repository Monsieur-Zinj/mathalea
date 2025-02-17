import { codageAngleDroit } from '../../lib/2d/angles.js'
import { arc } from '../../lib/2d/cercle.js'
import { codageSegments } from '../../lib/2d/codages.js'
import { droiteHorizontaleParPoint, droiteVerticaleParPoint, mediatrice } from '../../lib/2d/droites.js'
import { milieu, point, pointIntersectionDD, pointSurDroite, tracePoint } from '../../lib/2d/points.js'
import { barycentre, polygone } from '../../lib/2d/polygones.js'
import { segment, vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, latexParCoordonnees, texteParPoint } from '../../lib/2d/textes.ts'
import { rotation, similitude, translation } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { numAlpha } from '../../lib/outils/outilString.js'
import { imagePointParTransformation } from '../../modules/imagePointParTransformation.js'
import Exercice from '../deprecatedExercice.js'
import { assombrirOuEclaircir, colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { egal, listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { rotationAnimee, symetrieAnimee, translationAnimee } from '../../modules/2dAnimation.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
/**
 * Trouver l'image d'une figure par diverses transformations dans un pavage (7 motifs différents)
 * @author Jean-Claude Lhote
 * Relecture : Novembre 2021 par EE
 */
export default function PavagesEtTransformations () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1
  this.nbColsCorr = 1
  this.listeAvecNumerotation = false
  this.besoinFormulaire2Texte = ['Choix des pavages', 'Nombres séparés par des tirets\nChoix entre 1 et 7\nChoix 8 pour un mélange de tous les pavages']
  this.sup2 = 1
  // this.sup = 1 // 1 pour symétrie axiale, 2 pour symétrie centrale, 3 pour translations, et 4 pour rotations ; paramètre fixé par les variantes respectives.
  // context.isHtml ? this.spacingCorr = 2.5 : this.spacingCorr = 1.5
  this.nouvelleVersion = function (numeroExercice) {
    this.listeQuestions = []
    this.listeCorrections = [] // Liste de questions corrigées

    const objetsEnonce = []
    const objetsCorrection = []
    if (this.level === 3) {
      this.besoinFormulaireNumerique = false
      this.besoinFormulaire2Texte = false
      this.sup = 4
    } else if (this.level === 4) {
      this.sup = 3
    } else if (this.level === 5) {
      this.sup = 2
    } else this.sup = 1
    // listes de pavages [nx,ny,xB,yB,xC,yC,xD,yD,zoom,angle]  : 0=carrés, 1=cerf-volant 2=quadri concave 3=quadri quelconque 4=parallélogrammes 5=triangles rectangles isocèles 6=triangles équilatéraux 7=losanges
    const paves = [[5, 5, 4, 0, 4, 4, 0, 4, 30, 0],
      [5, 5, 6, 0, 8, 8, 0, 6, 60, -9],
      [5, 5, 8, 0, 4, 4, 2, 8, 50, 0],
      [5, 5, 4, 0, 6, 4, 0, 6, 50, 11],
      [4, 6, 8, 0, 7, 4, -1, 4, 50, 0],
      [5, 5, 8, 0, 4, 4, 0, 8, 50, 0],
      [5, 5, 4, 0, 3, 2 * Math.sin(Math.PI / 3), 2, 4 * Math.sin(Math.PI / 3), 20, 20],
      [4, 4, 3, 1, 4, 4, 1, 3, 20, -18]]
    const quad = []
    const quadCorr = []
    let labelCentre1, labelCentre2, labelCentre3
    let quad1
    let quad2
    let quad3
    let mediatrice1, mediatrice2, mediatrice3, centre1, centre2, centre3, arc1, arc2, arc3, rayon11, rayon12,
      rayon21, rayon22, rayon31, rayon32
    let vecteur1, vecteur2, vecteur3, vector1, vector2, vector3, origine1, origine2, origine3, indexsym2, indexsym1,
      indexsym3
    let segCorr11, segCorr12, segCorr21, segCorr22, segCorr31, segCorr32
    let iB1, iB2, iB3, iC1, iA1, iD1
    let texte = ''
    let texteCorr = ''
    const tabfigA = []
    const tabfigB = []
    const tabfigC = []
    const tabfigD = []
    let pave = []
    let choixPave
    switch (this.sup) {
      case 1:
        choixPave = 0 // pavages adaptés à symétrie axiale (carrés)
        break
      case 2:
        choixPave = randint(0, 7)// pavages adaptés à symétrie centrale (tous)
        break
      case 3:
        choixPave = randint(0, 7) // pavages adaptés à translation (tous)
        break
      case 4:
        choixPave = 0 // pavages adaptés à rotation (carrés)
        break
    }
    pave = paves[choixPave]
    let B, C, D
    const nx = pave[0]
    const ny = pave[1]
    let xB = pave[2]
    let yB = pave[3]
    let xC = pave[4]
    let yC = pave[5]
    let xD = pave[6]
    let yD = pave[7]
    const Zoom = pave[8]
    const Angle = pave[9]
    const A = point(0, 0)
    if (choixPave !== 0) { // } && choixPave !== 6 && choixPave !== 7) {
      B = similitude(point(xB, yB), A, Angle, 22 / Zoom)
      C = similitude(point(xC, yC), A, Angle, 22 / Zoom)
      D = similitude(point(xD, yD), A, Angle, 22 / Zoom)
      xB = B.x
      yB = B.y
      xC = C.x
      yC = C.y
      xD = D.x
      yD = D.y
    } else {
      B = point(xB, yB)
      C = point(xC, yC)
      D = point(xD, yD)
    }
    const xAI = xB + xC - xD
    const yAI = yB + yC - yD
    const I = milieu(B, C)
    const J = milieu(D, C)
    const xAJ = xC + xD - xB
    const yAJ = yC + yD - yB
    let xAxy, yAxy, numAxy
    let punto = [0, 0, 0]
    let trouver = false
    let indexA
    let numA
    let indexcentre1
    let xmil1 = 0
    let ymil1 = 0
    let indexD
    let numD
    let indexcentre2
    let xmil2 = 0
    let ymil2 = 0
    let indexC
    let numC
    let indexcentre3
    let xmil3 = 0
    let ymil3 = 0
    let num1
    let num2
    let num3
    let xc = 0
    let yc = 0
    let xb = 0
    let yb = 0
    let xa = 0
    let ya = 0
    let xV1 = 0
    let yV1 = 0
    let xV2 = 0
    let yV2 = 0
    let xV3 = 0
    let yV3 = 0
    const s0 = choice(['S', 'T', 'L', 'W', 'R', 'G', 'E', 'F', 'G', 'K'])
    const s1 = choice(['S', 'T', 'L', 'W', 'R', 'G', 'E', 'F', 'G', 'K'], [s0])
    const s2 = choice(['S', 'T', 'L', 'W', 'R', 'G', 'E', 'F', 'G', 'K'], [s0, s1])
    const Xmin = Math.min(-1, ny * xAJ)
    const Xmax = Math.max(nx * xAI + 1, nx * xAI + ny * xAJ + 1)
    const Ymin = Math.min(-1, nx * yAI)
    const Ymax = Math.max(nx * yAI + ny * yAJ + 1, ny * yAJ + 1)

    for (let y = 0; y < ny; y++) { // On initialise les tableaux avec les coordonnées des puntos de référence (A,B,C et D) de chaque translaté et son numéro dans le pavage.
      for (let x = 0; x < nx; x++) {
        xAxy = Math.round((x * xAI + y * xAJ) * 100) / 100
        yAxy = Math.round((x * yAI + y * yAJ) * 100) / 100
        numAxy = 2 * x + 4 * y * nx
        tabfigA.push([xAxy, yAxy, numAxy])
        quad[numAxy] = translation(polygone(A, B, C, D), vecteur(xAxy, yAxy))
        quadCorr[numAxy] = translation(polygone(A, B, C, D), vecteur(xAxy, yAxy))
        tabfigB.push([xAxy + Math.round(xB * 100) / 100, yAxy + Math.round(yB * 100) / 100, numAxy + 1])
        quad[numAxy + 1] = translation(rotation(polygone(A, B, C, D), I, 180), vecteur(xAxy, yAxy))
        quadCorr[numAxy + 1] = translation(rotation(polygone(A, B, C, D), I, 180), vecteur(xAxy, yAxy))
        tabfigD.push([xAxy + Math.round(xD * 100) / 100, yAxy + Math.round(yD * 100) / 100, numAxy + 2 * nx])
        quad[numAxy + 2 * nx] = translation(rotation(polygone(A, B, C, D), J, 180), vecteur(xAxy, yAxy))
        quadCorr[numAxy + 2 * nx] = translation(rotation(polygone(A, B, C, D), J, 180), vecteur(xAxy, yAxy))
        tabfigC.push([xAxy + Math.round(xC * 100) / 100, yAxy + Math.round(yC * 100) / 100, numAxy + 2 * nx + 1])
        quad[numAxy + 2 * nx + 1] = translation(translation(polygone(A, B, C, D), vecteur(A, C)), vecteur(xAxy, yAxy))
        quadCorr[numAxy + 2 * nx + 1] = translation(translation(polygone(A, B, C, D), vecteur(A, C)), vecteur(xAxy, yAxy))
      }
    }
    for (let i = 0; i < quad.length; i++) {
      objetsEnonce.push(quad[i], texteParPoint(i, barycentre(quad[i], '', 'center'), 0, 'black', 1, 'milieu', false))
      quadCorr[i].color = colorToLatexOrHTML(assombrirOuEclaircir('gray', 50))
      objetsCorrection.push(quadCorr[i], texteParPoint(i, barycentre(quad[i], '', 'center'), 0, assombrirOuEclaircir('gray', 50), 1, 'milieu', false))
    }

    // context.fenetreMathalea2d = [Xmin, Ymin, Xmax, Ymax]
    let trace, label, pt1, pt2
    let texteAMC1, texteAMC2, texteAMC3, consigneAMC
    switch (parseInt(this.sup)) {
      case 1: // symétrie axiale
        // Première question : une figure type A par symétrie d'axe // à [BD] est une figure type A. le symétrique du sommet A est le sommet C
        indexA = randint(0, nx * ny - 1)
        numA = tabfigA[indexA][2]
        indexsym1 = randint(0, nx * ny - 1, [indexA]) // sert à choisir un axe [BD].
        xmil1 = tabfigD[indexsym1][0] // sert pour faire passer l'axe de symétrie.
        ymil1 = tabfigD[indexsym1][1]
        punto = imagePointParTransformation(2, [tabfigA[indexA][0], tabfigA[indexA][1]], [xmil1, ymil1])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigC[j][0], 0.05) && egal(punto[1], tabfigC[j][1], 0.05)) {
              trouver = true
              num1 = tabfigA[j][2]
              xa = tabfigA[indexA][0]
              ya = tabfigA[indexA][1]
              mediatrice1 = mediatrice(point(xa, ya), point(punto[0], punto[1]))
              mediatrice1.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
              mediatrice1.epaisseur = 2
              mediatrice1.isVisible = true
              segCorr11 = segment(point(xa, ya), milieu(point(xa, ya), point(punto[0], punto[1])), context.isAmc ? 'black' : 'green')
              segCorr12 = segment(point(punto[0], punto[1]), milieu(point(xa, ya), point(punto[0], punto[1])), context.isAmc ? 'black' : 'green')
              segCorr11.epaisseur = 2
              segCorr11.pointilles = 2
              segCorr12.epaisseur = 2
              segCorr12.pointilles = 2
              objetsCorrection.push(codageAngleDroit(pointSurDroite(mediatrice1, 1), milieu(point(xa, ya), point(punto[0], punto[1])), point(xa, ya), context.isAmc ? 'black' : 'green', 0.8, 1))
              quad[numA].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
              quad[numA].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexA = randint(0, nx * ny - 1)
            numA = tabfigA[indexA][2]
            indexsym1 = randint(0, nx * ny - 1, [indexA])
            xmil1 = tabfigD[indexsym1][0]
            ymil1 = tabfigD[indexsym1][1]
            punto = imagePointParTransformation(2, [tabfigA[indexA][0], tabfigA[indexA][1]], [xmil1, ymil1])
          }
        }
        texteAMC1 = numAlpha(0) + ' Quel est le numéro de la figure symétrique de la figure ' + texteEnCouleurEtGras(`${numA}`, context.isAmc ? 'black' : 'green') + ` dans la symétrie d'axe  $${miseEnEvidence('(d_1)', context.isAmc ? 'black' : 'green')}$  ?` + ajouteChampTexteMathLive(this, 0, '') + '<br>'
        texte += texteAMC1
        texteCorr += numAlpha(0) + ' La figure symétrique de la figure ' + texteEnCouleurEtGras(`${numA}`, context.isAmc ? 'black' : 'green') + ` dans la symétrie d'axe  $${miseEnEvidence('(d_1)', context.isAmc ? 'black' : 'green')}$  porte le numéro ${texteEnCouleurEtGras(num1)}.<br>`

        // Deuxième question : une figure type D par symétrie d'axe // à [AC] est une figure type B. le symétrique du sommet B est le sommet D
        indexD = randint(0, nx * ny - 1)
        numD = tabfigD[indexD][2]
        indexsym2 = randint(0, nx * ny - 1, [indexD]) // sert à choisir un axe [AC].
        xmil2 = tabfigA[indexsym2][0] // sert pour faire passer l'axe de symétrie.
        ymil2 = tabfigA[indexsym2][1]
        punto = imagePointParTransformation(1, [tabfigD[indexD][0], tabfigD[indexD][1]], [xmil2, ymil2])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigB[j][0], 0.05) && egal(punto[1], tabfigB[j][1], 0.05)) {
              trouver = true
              num2 = tabfigB[j][2]
              xb = tabfigD[indexD][0]
              yb = tabfigD[indexD][1] - 4
              mediatrice2 = mediatrice(point(xb, yb + 4), point(punto[0], punto[1]))
              mediatrice2.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
              mediatrice2.epaisseur = 2
              mediatrice2.isVisible = true
              segCorr21 = segment(point(xb, yb + 4), milieu(point(xb, yb + 4), point(punto[0], punto[1])), context.isAmc ? 'black' : 'red')
              segCorr22 = segment(point(punto[0], punto[1]), milieu(point(xb, yb + 4), point(punto[0], punto[1])), context.isAmc ? 'black' : 'red')
              segCorr21.epaisseur = 2
              segCorr21.pointilles = 2
              segCorr22.epaisseur = 2
              segCorr22.pointilles = 2
              objetsCorrection.push(codageAngleDroit(pointSurDroite(mediatrice2, 1), milieu(point(xb, yb + 4), point(punto[0], punto[1])), point(xb, yb + 4), context.isAmc ? 'black' : 'red', 0.8, 1))
              quad[numD].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
              quad[numD].opaciteDeRemplissage = 0.6

              break
            }
          }
          if (trouver === false) {
            indexD = randint(0, nx * ny - 1)
            numD = tabfigD[indexD][2]
            indexsym2 = randint(0, nx * ny - 1, [indexD]) // sert à choisir un axe [AC].
            xmil2 = tabfigA[indexsym2][0] // sert pour faire passer l'axe de symétrie.
            ymil2 = tabfigA[indexsym2][1]
            punto = imagePointParTransformation(1, [tabfigD[indexD][0], tabfigD[indexD][1]], [xmil2, ymil2])
          }
        }
        texteAMC2 = numAlpha(1) + ' Quel est le numéro de la figure symétrique de la figure ' + texteEnCouleurEtGras(`${numD}`, context.isAmc ? 'black' : 'red') + ` dans la symétrie d'axe  $${miseEnEvidence('(d_2)', context.isAmc ? 'black' : 'red')}$  ?` + ajouteChampTexteMathLive(this, 1, '') + '<br>'
        texte += '<br>' + texteAMC2
        texteCorr += '<br>' + numAlpha(1) + ' La figure symétrique de la figure ' + texteEnCouleurEtGras(`${numD}`, context.isAmc ? 'black' : 'red') + ` dans la symétrie d'axe  $${miseEnEvidence('(d_2)', context.isAmc ? 'black' : 'red')}$  porte le numéro ${texteEnCouleurEtGras(num2)}.<br>`

        // troisième question : une figure type D par symétrie d'axe // à [DC] est une figure type A. le symétrique du sommet D est le sommet A'
        indexC = randint(0, nx * ny - 1)
        numC = tabfigC[indexC][2]
        indexsym3 = randint(0, 4, Math.floor(indexC / 5)) * 5 // sert à choisir un axe [AC].
        xmil3 = tabfigC[indexsym3][0] // sert pour faire passer l'axe de symétrie.
        ymil3 = tabfigC[indexsym3][1]
        punto = imagePointParTransformation(3, [tabfigC[indexC][0], tabfigC[indexC][1]], [xmil3, ymil3])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigC[j][0], 0.05) && egal(punto[1], tabfigC[j][1], 0.05)) {
              trouver = true
              num3 = tabfigB[j][2]
              xc = tabfigC[indexC][0]
              yc = tabfigC[indexC][1]
              mediatrice3 = mediatrice(point(xc, yc), point(punto[0], punto[1]))
              mediatrice3.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
              mediatrice3.epaisseur = 2
              mediatrice3.isVisible = true
              segCorr31 = segment(point(xc, yc), milieu(point(xc, yc), point(punto[0], punto[1])), context.isAmc ? 'black' : 'blue')
              segCorr32 = segment(point(punto[0], punto[1]), milieu(point(xc, yc), point(punto[0], punto[1])), context.isAmc ? 'black' : 'blue')
              segCorr31.epaisseur = 2
              segCorr31.pointilles = 2
              segCorr32.epaisseur = 2
              segCorr32.pointilles = 2
              objetsCorrection.push(codageAngleDroit(pointSurDroite(mediatrice3, 1), milieu(point(xc, yc), point(punto[0], punto[1])), point(xc, yc), context.isAmc ? 'black' : 'blue', 0.8, 1))
              quad[numC].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
              quad[numC].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexC = randint(0, nx * ny - 1)
            numC = tabfigC[indexC][2]
            const indexsym3 = randint(0, 4, Math.floor(indexC / 5)) * 5 // sert à choisir un axe [AC].
            xmil3 = tabfigC[indexsym3][0] // sert pour faire passer l'axe de symétrie.
            ymil3 = tabfigC[indexsym3][1]
            punto = imagePointParTransformation(3, [tabfigC[indexC][0], tabfigC[indexC][1]], [xmil3, ymil3])
          }
        }
        texteAMC3 = numAlpha(2) + ' Quel est le numéro de la figure symétrique de la figure ' + texteEnCouleurEtGras(`${numC}`, context.isAmc ? 'black' : 'blue') + ` dans la symétrie d'axe  $${miseEnEvidence('(d_3)', context.isAmc ? 'black' : 'blue')}$  ?` + ajouteChampTexteMathLive(this, 2, '') + '<br>'
        texte += '<br>' + texteAMC3
        texteCorr += '<br>' + numAlpha(2) + ' La figure symétrique de la figure ' + texteEnCouleurEtGras(`${numC}`, context.isAmc ? 'black' : 'blue') + ` dans la symétrie d'axe  $${miseEnEvidence('(d_3)', context.isAmc ? 'black' : 'blue')}$  porte le numéro ${texteEnCouleurEtGras(num3)}.<br>`

        objetsEnonce.push(mediatrice1, mediatrice2, mediatrice3)
        objetsCorrection.push(mediatrice1, mediatrice2, mediatrice3)
        if (context.isHtml) objetsCorrection.push(symetrieAnimee(quad[numA], mediatrice1, `id="anim${numeroExercice}A" dur ="2s" repeatcount="1"`), symetrieAnimee(quad[numD], mediatrice2, `id="anim${numeroExercice}B" dur="2s" repeatcount="1"`), symetrieAnimee(quad[numC], mediatrice3, `id="anim${numeroExercice}C" dur="2s" repeatcount="1"`))

        pt1 = pointIntersectionDD(mediatrice1, droiteHorizontaleParPoint(point(context.fenetreMathalea2d[2], context.fenetreMathalea2d[3])))
        pt2 = pointIntersectionDD(mediatrice1, droiteVerticaleParPoint(point(context.fenetreMathalea2d[0], context.fenetreMathalea2d[1])))
        if (pt1.x > pt2.x) {
          objetsEnonce.push(latexParCoordonnees('(d_1)', pt1.x, pt1.y - 2.5, context.isAmc ? 'black' : 'green', 20, 10, '', 12))
          objetsCorrection.push(latexParCoordonnees('(d_1)', pt1.x, pt1.y - 2.5, context.isAmc ? 'black' : 'green', 20, 10, '', 12))
        } else {
          objetsEnonce.push(latexParCoordonnees('(d_1)', pt2.x + 2.5, pt2.y, context.isAmc ? 'black' : 'green', 20, 10, '', 12))
          objetsCorrection.push(latexParCoordonnees('(d_1)', pt2.x + 2.5, pt2.y, context.isAmc ? 'black' : 'green', 20, 10, '', 12))
        }

        pt1 = pointIntersectionDD(mediatrice2, droiteHorizontaleParPoint(point(context.fenetreMathalea2d[0], context.fenetreMathalea2d[1])))
        pt2 = pointIntersectionDD(mediatrice2, droiteVerticaleParPoint(point(context.fenetreMathalea2d[0], context.fenetreMathalea2d[1])))
        if (pt1.x > pt2.x) {
          objetsEnonce.push(latexParCoordonnees('(d_2)', pt1.x, pt1.y + 2.5, context.isAmc ? 'black' : 'red', 20, 10, '', 12))
          objetsCorrection.push(latexParCoordonnees('(d_2)', pt1.x, pt1.y + 2.5, context.isAmc ? 'black' : 'red', 20, 10, '', 12))
        } else if (pt1.x < pt2.x) {
          objetsEnonce.push(latexParCoordonnees('(d_2)', pt2.x + 2.5, pt2.y, context.isAmc ? 'black' : 'red', 20, 10, '', 12))
          objetsCorrection.push(latexParCoordonnees('(d_2)', pt2.x + 2.5, pt2.y, context.isAmc ? 'black' : 'red', 20, 10, '', 12))
        } else {
          objetsEnonce.push(latexParCoordonnees('(d_2)', pt2.x + 3.5, pt2.y + 1, context.isAmc ? 'black' : 'red', 20, 10, '', 12))
          objetsCorrection.push(latexParCoordonnees('(d_2)', pt2.x + 3.5, pt2.y + 1, context.isAmc ? 'black' : 'red', 20, 10, '', 12))
        }

        pt1 = pointIntersectionDD(mediatrice3, droiteVerticaleParPoint(point(context.fenetreMathalea2d[2], context.fenetreMathalea2d[3])))
        objetsEnonce.push(latexParCoordonnees('(d_3)', pt1.x - 2, pt1.y + 1.5, context.isAmc ? 'black' : 'blue', 20, 10, '', 12))
        objetsCorrection.push(latexParCoordonnees('(d_3)', pt1.x - 2, pt1.y + 1.5, context.isAmc ? 'black' : 'blue', 20, 10, '', 12))
        objetsCorrection.push(segCorr11, segCorr12, segCorr21, segCorr22, segCorr31, segCorr32)
        objetsCorrection.push(codageSegments('OO', context.isAmc ? 'black' : 'green', segCorr11, segCorr12))
        objetsCorrection.push(codageSegments('XX', context.isAmc ? 'black' : 'red', segCorr21, segCorr22))
        objetsCorrection.push(codageSegments('|||', context.isAmc ? 'black' : 'blue', segCorr31, segCorr32))
        consigneAMC = mathalea2d(
          Object.assign({
            pixelsParCm: 15,
            scale: 0.3,
            optionsTikz: ['every node/.style={scale=0.6}']
          },
          fixeBordures(objetsEnonce, { rxmin: -1, rxmax: 1, rymin: -1, rymax: 1 })
          ),
          objetsEnonce
        )
        texte += consigneAMC
        quad1 = translation(quad[num1], vecteur(0, 0))
        quad1.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        quad1.opaciteDeRemplissage = 0.3
        quad2 = translation(quad[num2], vecteur(0, 0))
        quad2.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        quad2.opaciteDeRemplissage = 0.3
        quad3 = translation(quad[num3], vecteur(0, 0))
        quad3.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        quad3.opaciteDeRemplissage = 0.3
        objetsCorrection.push(quad[numA], quad[numD], quad[numC], quad1, quad2, quad3)
        texteCorr += mathalea2d({
          xmin: Xmin,
          xmax: Xmax,
          ymin: Ymin,
          ymax: Ymax,
          pixelsParCm: 15,
          scale: 0.3,
          optionsTikz: ['every node/.style={scale=0.6}'],
          mainlevee: false
        }, objetsCorrection
        )

        break
      case 2: // symétrie centrale
        // Première question : une figure dans tabfigA, une symétrie par rapport au milieu d'un [B'C'], logiquement : l'image est dans tabfigB et B' est l'image de C !
        indexA = randint(0, nx * ny - 1)
        numA = tabfigA[indexA][2]
        indexcentre1 = randint(0, nx * ny - 1, indexA) // indexcentre1 est l'index du bloc de 4 figures A,B,C et D, il sert dans les 4 tableaux.

        // on calcule les coordonnées du milieu de [BC] on ajoute aux coordonnées du milieu de [BC] celles du vecteur BB'. (j'aurais pu réduire mais cela aurait rendu le calcul plus opaque)
        xmil1 = (xB + xC) / 2 + tabfigB[indexcentre1][0] - xB
        ymil1 = (yB + yC) / 2 + tabfigB[indexcentre1][1] - yB
        punto = imagePointParTransformation(7, [tabfigC[indexA][0], tabfigC[indexA][1]], [xmil1, ymil1])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigB[j][0], 0.05) && egal(punto[1], tabfigB[j][1], 0.05)) {
              trouver = true
              num1 = tabfigB[j][2]
              xa = tabfigA[indexA][0]
              ya = tabfigA[indexA][1]
              centre1 = point(xmil1, ymil1, s0, 'left')
              quad[numA].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
              quad[numA].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexA = randint(0, nx * ny - 1)
            numA = tabfigA[indexA][2]
            indexcentre1 = randint(0, nx * ny - 1, indexA)
            xmil1 = (xB + xC) / 2 + tabfigB[indexcentre1][0] - xB
            ymil1 = (yB + yC) / 2 + tabfigB[indexcentre1][1] - yB
            punto = imagePointParTransformation(7, [tabfigC[indexA][0], tabfigC[indexA][1]], [xmil1, ymil1])
          }
        }
        texteAMC1 = numAlpha(0) + texteEnCouleurEtGras(` Quel est le numéro de la figure symétrique de la figure ${numA} dans la symétrie de centre ${s0} ?`, context.isAmc ? 'black' : 'green') + ajouteChampTexteMathLive(this, 0, '') + '<br>'
        texte += texteAMC1
        texteCorr = numAlpha(0) + texteEnCouleurEtGras(` La figure symétrique de la figure ${numA} dans la symétrie de centre ${s0} porte le numéro ${num1}.<br>`, context.isAmc ? 'black' : 'green')
        // Deuxième question : une figure dans tabfigD, une symétrie par rapport au milieu d'un [C'D'], le résultat est une figure dans tabfigA et C' est l'image de D !
        indexD = randint(0, nx * ny - 1)
        numD = tabfigD[indexD][2]
        indexcentre2 = randint(0, nx * ny - 1, [indexD]) // indexcentre2 est l'index du bloc de 4 figures A,B,C et D, il sert dans les 4 tableaux.

        // on calcule les coordonnées du milieu de [DC] on ajoute aux coordonnées du milieu de [DC] celles du vecteur DD'.
        xmil2 = (xD + xC) / 2 + tabfigD[indexcentre2][0] - xD
        ymil2 = (yD + yC) / 2 + tabfigD[indexcentre2][1] - yD
        punto = imagePointParTransformation(7, [tabfigD[indexD][0], tabfigD[indexD][1]], [xmil2, ymil2])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigC[j][0], 0.05) && egal(punto[1], tabfigC[j][1], 0.05)) {
              trouver = true
              num2 = tabfigA[j][2]
              xb = tabfigA[indexD][0]
              yb = tabfigA[indexD][1]
              centre2 = point(xmil2, ymil2, s1, 'left')
              quad[numD].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
              quad[numD].opaciteDeRemplissage = 0.6

              break
            }
          }
          if (trouver === false) {
            indexD = randint(0, nx * ny - 1)
            numD = tabfigD[indexD][2]
            indexcentre2 = randint(0, nx * ny - 1, [indexD])
            xmil2 = (xD + xC) / 2 + tabfigD[indexcentre2][0] - xD
            ymil2 = (yD + yC) / 2 + tabfigD[indexcentre2][1] - yD
            punto = imagePointParTransformation(7, [tabfigD[indexD][0], tabfigD[indexD][1]], [xmil2, ymil2])
          }
        }
        texteAMC2 = numAlpha(1) + texteEnCouleurEtGras(` Quel est le numéro de la figure symétrique de la figure ${numD} dans la symétrie de centre ${s1} ?`, context.isAmc ? 'black' : 'red') + ajouteChampTexteMathLive(this, 1, '') + '<br>'
        texte += '<br>' + texteAMC2
        texteCorr += numAlpha(1) + texteEnCouleurEtGras(` La figure symétrique de la figure ${numD} dans la symétrie de centre ${s1} porte le numéro ${num2}.<br>`, context.isAmc ? 'black' : 'red')
        // troisième question : une figure dans tabfigC, une symétrie par rapport au symétrique du milieu de [A'D'] par rapport au milieu de [C'D']... pas très clair
        // le résultat est une figure dans tabfigD et le point (C'+ vecteur AC) a pour image D' !
        indexC = randint(0, nx * ny - 1)
        numC = tabfigC[indexC][2]
        indexcentre3 = randint(0, nx * ny - 1, [indexC]) // indexcentre2 est l'index du bloc de 4 figures A,B,C et D, il sert dans les 4 tableaux.

        // on calcule les coordonnées du milieu du centre de symétrie : (C' + D + AC)/2=AC+AD/2 que l'on translate de CC' donc ça fait AC' + AD/2
        xmil3 = xD / 2 + tabfigC[indexcentre3][0]
        ymil3 = yD / 2 + tabfigC[indexcentre3][1]
        punto = imagePointParTransformation(7, [tabfigC[indexC][0] + xC, tabfigC[indexC][1] + yC], [xmil3, ymil3]) // c'est le sommet C + AC qui a pour image D.
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigD[j][0], 0.01) && egal(punto[1], tabfigD[j][1], 0.01)) {
              trouver = true
              num3 = tabfigD[j][2]
              xc = tabfigA[indexC][0]
              yc = tabfigA[indexC][1]
              centre3 = point(xmil3, ymil3, s2, 'left')
              quad[numC].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
              quad[numC].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexC = randint(0, nx * ny - 1)
            numC = tabfigC[indexC][2]
            indexcentre3 = randint(0, nx * ny - 1, [indexC])
            xmil3 = xD / 2 + tabfigC[indexcentre3][0]
            ymil3 = yD / 2 + tabfigC[indexcentre3][1]
            punto = imagePointParTransformation(7, [tabfigC[indexC][0] + xC, tabfigC[indexC][1] + yC], [xmil3, ymil3])
          }
        }
        texteAMC3 = numAlpha(2) + texteEnCouleurEtGras(` Quel est le numéro de la figure symétrique de la figure ${numC} dans la symétrie de centre ${s2} ?`, context.isAmc ? 'black' : 'blue') + ajouteChampTexteMathLive(this, 2, '') + '<br>'
        texte += '<br>' + texteAMC3
        texteCorr += numAlpha(2) + texteEnCouleurEtGras(` La figure symétrique de la figure ${numC} dans la symétrie de centre ${s2} porte le numéro ${num3}.<br>`, context.isAmc ? 'black' : 'blue')
        labelCentre1 = tracePoint(centre1, 'red')
        labelCentre1.epaisseur = 2
        labelCentre1.taille = 2
        labelCentre2 = tracePoint(centre2, 'red')
        labelCentre2.epaisseur = 2
        labelCentre2.taille = 2
        labelCentre3 = tracePoint(centre3, 'red')
        labelCentre3.epaisseur = 2
        labelCentre3.taille = 2

        objetsEnonce.push(labelCentre1, labelCentre2, labelCentre3, labelPoint(centre1, 'red'), labelPoint(centre2, 'red'), labelPoint(centre3, 'red'))
        objetsCorrection.push(labelCentre1, labelCentre2, labelCentre3, labelPoint(centre1, 'red'), labelPoint(centre2, 'red'), labelPoint(centre3, 'red'))
        if (context.isHtml) objetsCorrection.push(rotationAnimee(quad[numA], centre1, 180, `id="anim${numeroExercice}A" dur ="2s" repeatcount="1"`), rotationAnimee(quad[numD], centre2, 180, `id="anim${numeroExercice}B" dur="2s" repeatcount="1"`), rotationAnimee(quad[numC], centre3, 180, `id="anim${numeroExercice}C" dur="2s" repeatcount="1"`))

        consigneAMC = mathalea2d(
          Object.assign({
            pixelsParCm: 15,
            scale: 0.3,
            optionsTikz: ['every node/.style={scale=0.6}']
          },
          fixeBordures(objetsEnonce, { rxmin: -1, rxmax: 1, rymin: -1, rymax: 1 })
          ),
          objetsEnonce
        )
        texte += consigneAMC
        quad1 = translation(quad[num1], vecteur(0, 0))
        quad1.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        quad1.opaciteDeRemplissage = 0.3
        quad2 = translation(quad[num2], vecteur(0, 0))
        quad2.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        quad2.opaciteDeRemplissage = 0.3
        quad3 = translation(quad[num3], vecteur(0, 0))
        quad3.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        quad3.opaciteDeRemplissage = 0.3
        arc1 = arc(point(tabfigA[indexA][0], tabfigA[indexA][1]), centre1, 180)
        rayon11 = segment(point(tabfigA[indexA][0], tabfigA[indexA][1]), centre1)
        rayon12 = rotation(rayon11, centre1, 180)
        rayon11.pointilles = 2
        rayon12.pointilles = 2
        arc1.pointilles = 2
        arc2 = arc(point(tabfigD[indexD][0], tabfigD[indexD][1]), centre2, 180)
        rayon21 = segment(point(tabfigD[indexD][0], tabfigD[indexD][1]), centre2)
        rayon22 = rotation(rayon21, centre2, 180)
        rayon21.pointilles = 2
        rayon22.pointilles = 2
        arc2.pointilles = 2
        arc3 = arc(point(tabfigC[indexC][0], tabfigC[indexC][1]), centre3, 180)
        rayon31 = segment(point(tabfigC[indexC][0], tabfigC[indexC][1]), centre3)
        rayon32 = rotation(rayon31, centre3, 180)
        rayon31.pointilles = 2
        rayon32.pointilles = 2
        arc3.pointilles = 2
        objetsCorrection.push(quad1, quad2, quad3, arc1, arc2, arc3, rayon11, rayon12, rayon21, rayon22, rayon31, rayon32)
        texteCorr += mathalea2d({
          xmin: Xmin,
          xmax: Xmax,
          ymin: Ymin,
          ymax: Ymax,
          pixelsParCm: 15,
          scale: 0.3,
          optionsTikz: ['every node/.style={scale=0.6}'],
          mainlevee: false
        }, objetsCorrection
        )

        break

      case 3: // translations

        // Première question : une figure dans tabfigA, l'image dans tabfigA...
        // On choisit deux figures de type B pour définir le vecteur de translation.
        indexA = randint(0, nx * ny - 1)
        numA = tabfigA[indexA][2]
        iB1 = randint(0, nx * ny - 1)
        iB2 = randint(0, nx * ny - 1, [iB1])
        xV1 = tabfigB[iB2][0] - tabfigB[iB1][0]
        yV1 = tabfigB[iB2][1] - tabfigB[iB1][1]
        punto = imagePointParTransformation(8, [tabfigA[indexA][0], tabfigA[indexA][1]], [0, 0], [xV1, yV1])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigA[j][0], 0.05) && egal(punto[1], tabfigA[j][1], 0.05)) {
              trouver = true
              num1 = tabfigA[j][2]
              xa = tabfigA[indexA][0]
              ya = tabfigA[indexA][1]
              origine1 = point(tabfigB[iB1][0], tabfigB[iB1][1])
              vector1 = vecteur(origine1, point(tabfigB[iB2][0], tabfigB[iB2][1]))
              vecteur1 = vector1.representant(origine1)
              vecteur1.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
              vecteur1.epaisseur = 2
              vecteur1.pointilles = 2
              quad[numA].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
              quad[numA].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexA = randint(0, nx * ny - 1)
            numA = tabfigA[indexA][2]
            iB1 = randint(0, nx * ny - 1)
            iB2 = randint(0, nx * ny - 1, [iB1])
            xV1 = tabfigB[iB2][0] - tabfigB[iB1][0]
            yV1 = tabfigB[iB2][1] - tabfigB[iB1][1]
            punto = imagePointParTransformation(8, [tabfigA[indexA][0], tabfigA[indexA][1]], [0, 0], [xV1, yV1])
          }
        }
        texteAMC1 = numAlpha(0) + texteEnCouleurEtGras(` Dans la translation qui transforme la figure ${tabfigB[iB1][2]} en la figure ${tabfigB[iB2][2]}, quel est le numéro de l'image de la figure ${numA} ?`, context.isAmc ? 'black' : 'green') + ajouteChampTexteMathLive(this, 0, '') + '<br>'
        texte += texteAMC1
        texteCorr = numAlpha(0) + texteEnCouleurEtGras(` La figure image de la figure ${numA}  dans la translation qui transforme la figure ${tabfigB[iB1][2]} en la figure ${tabfigB[iB2][2]} porte le numéro ${num1}.<br>`, context.isAmc ? 'black' : 'green')
        // Deuxième question : une figure dans tabfigD, l'image dans tabfigB...
        // On choisit une figure C et une figure A pour définir le vecteur de translation.
        indexD = randint(0, nx * ny - 1)
        numD = tabfigD[indexD][2]
        iC1 = randint(0, nx * ny - 1)
        iA1 = randint(0, nx * ny - 1, [iC1])
        xV2 = tabfigA[iA1][0] - tabfigC[iC1][0]
        yV2 = tabfigA[iA1][1] - tabfigC[iC1][1]
        punto = imagePointParTransformation(8, [tabfigD[indexD][0], tabfigD[indexD][1]], [0, 0], [xV2, yV2])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigB[j][0], 0.05) && egal(punto[1], tabfigB[j][1], 0.05)) {
              trouver = true
              num2 = tabfigB[j][2]
              xb = tabfigD[indexD][0]
              yb = tabfigD[indexD][1]
              origine2 = point(tabfigC[iC1][0], tabfigC[iC1][1])
              vector2 = vecteur(origine2, point(tabfigA[iA1][0], tabfigA[iA1][1]))
              vecteur2 = vector2.representant(origine2)
              vecteur2.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
              vecteur2.epaisseur = 2
              vecteur2.pointilles = 2
              quad[numD].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
              quad[numD].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexD = randint(0, nx * ny - 1)
            numD = tabfigD[indexD][2]
            iC1 = randint(0, nx * ny - 1)
            iA1 = randint(0, nx * ny - 1, [iC1])
            xV2 = tabfigA[iA1][0] - tabfigC[iC1][0]
            yV2 = tabfigA[iA1][1] - tabfigC[iC1][1]
            punto = imagePointParTransformation(8, [tabfigD[indexD][0], tabfigD[indexD][1]], [0, 0], [xV2, yV2])
          }
        }
        texteAMC2 = numAlpha(1) + texteEnCouleurEtGras(` Dans la translation qui transforme la figure ${tabfigC[iC1][2]} en la figure ${tabfigA[iA1][2]}, quel est le numéro de l'image de la figure ${numD} ?`, context.isAmc ? 'black' : 'red') + ajouteChampTexteMathLive(this, 1, '') + '<br>'
        texte += '<br>' + texteAMC2
        texteCorr += numAlpha(1) + texteEnCouleurEtGras(` La figure image de la figure ${numD}  dans la translation qui transforme la figure ${tabfigC[iC1][2]} en la figure ${tabfigA[iA1][2]} porte le numéro ${num2}.<br>`, context.isAmc ? 'black' : 'red')

        // troisième question : une figure dans tabfigC, l'image dans tabfigA...
        // On choisit une figure D et une figure B pour définir le vecteur de translation.
        indexC = randint(0, nx * ny - 1)
        numC = tabfigC[indexC][2]
        iD1 = randint(0, nx * ny - 1)
        iB3 = randint(0, nx * ny - 1, [iD1])
        xV3 = tabfigA[iB3][0] - tabfigC[iD1][0]
        yV3 = tabfigA[iB3][1] - tabfigC[iD1][1]
        punto = imagePointParTransformation(8, [tabfigC[indexC][0], tabfigC[indexC][1]], [0, 0], [xV3, yV3])
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigA[j][0], 0.05) && egal(punto[1], tabfigA[j][1], 0.05)) {
              trouver = true
              num3 = tabfigA[j][2]
              xc = tabfigC[indexC][0]
              yc = tabfigC[indexC][1]
              origine3 = point(tabfigC[iD1][0], tabfigC[iD1][1])
              vector3 = vecteur(origine3, point(tabfigA[iB3][0], tabfigA[iB3][1]))
              vecteur3 = vector3.representant(origine3)
              vecteur3.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
              vecteur3.epaisseur = 2
              vecteur3.pointilles = 2
              quad[numC].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
              quad[numC].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexC = randint(0, nx * ny - 1)
            numC = tabfigC[indexC][2]
            iD1 = randint(0, nx * ny - 1)
            iB3 = randint(0, nx * ny - 1, [iD1])
            xV3 = tabfigA[iB3][0] - tabfigC[iD1][0]
            yV3 = tabfigA[iB3][1] - tabfigC[iD1][1]
            punto = imagePointParTransformation(8, [tabfigC[indexC][0], tabfigC[indexC][1]], [0, 0], [xV3, yV3])
          }
        }
        texteAMC3 = numAlpha(2) + texteEnCouleurEtGras(` Dans la translation qui transforme la figure ${tabfigC[iD1][2]} en la figure ${tabfigA[iB3][2]}, quel est le numéro de l'image de la figure ${numC} ?`, context.isAmc ? 'black' : 'blue') + ajouteChampTexteMathLive(this, 2, '') + '<br>'
        texte += '<br>' + texteAMC3
        texteCorr += numAlpha(2) + texteEnCouleurEtGras(` La figure image de la figure ${numC}  dans la translation qui transforme la figure ${tabfigC[iD1][2]} en la figure ${tabfigA[iB3][2]} porte le numéro ${num3}.<br>`, context.isAmc ? 'black' : 'blue')

        objetsEnonce.push(vecteur1, vecteur2, vecteur3)
        objetsCorrection.push(vecteur1, vecteur2, vecteur3)
        if (context.isHtml) objetsCorrection.push(translationAnimee(quad[numA], vector1, `id="anim${numeroExercice}A" dur="2s" repeatcount="1"`), translationAnimee(quad[numD], vector2, `id="anim${numeroExercice}B" dur="2s" repeatcount="1"`), translationAnimee(quad[numC], vector3, `id="anim${numeroExercice}C" dur="2s" repeatcount="1"`))

        consigneAMC = mathalea2d(
          Object.assign({
            pixelsParCm: 15,
            scale: 0.3,
            optionsTikz: ['every node/.style={scale=0.6}']
          },
          fixeBordures(objetsEnonce, { rxmin: -1, rxmax: 1, rymin: -1, rymax: 1 })
          ),
          objetsEnonce
        )
        texte += consigneAMC
        quad1 = translation(quad[num1], vecteur(0, 0))
        quad1.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        quad1.opaciteDeRemplissage = 0.3
        quad2 = translation(quad[num2], vecteur(0, 0))
        quad2.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        quad2.opaciteDeRemplissage = 0.3
        quad3 = translation(quad[num3], vecteur(0, 0))
        quad3.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        quad3.opaciteDeRemplissage = 0.3
        rayon11 = vector1.representant(point(xa, ya))
        rayon11.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        rayon11.epaisseur = 2
        rayon21 = vector2.representant(point(xb, yb))
        rayon21.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        rayon21.epaisseur = 2
        rayon31 = vector3.representant(point(xc, yc))
        rayon31.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        rayon31.epaisseur = 2
        objetsCorrection.push(quad1, quad2, quad3, rayon11, rayon21, rayon31)
        texteCorr += mathalea2d({
          xmin: Xmin,
          xmax: Xmax,
          ymin: Ymin,
          ymax: Ymax,
          pixelsParCm: 15,
          scale: 0.3,
          optionsTikz: ['every node/.style={scale=0.6}'],
          mainlevee: false
        }, objetsCorrection
        )

        break

      case 4: // rotations
        // première question : centre A, rotation de 90° sens anti-horaire, une figure de tabfigA donne une figure de tabfigD, le point B donne le point D.
        indexA = randint(0, nx * ny - 1)
        numA = tabfigA[indexA][2]
        indexcentre1 = randint(0, nx * ny - 1, [indexA])
        xmil1 = tabfigA[indexcentre1][0]
        ymil1 = tabfigA[indexcentre1][1]
        punto = imagePointParTransformation(6, [tabfigB[indexA][0], tabfigB[indexA][1]], [xmil1, ymil1]) // le repère est direct, donc le sens de rotation est inversé...
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigD[j][0], 0.1) && egal(punto[1], tabfigD[j][1], 0.1)) {
              trouver = true
              num1 = tabfigD[j][2]
              xa = tabfigA[indexA][0]
              ya = tabfigA[indexA][1]
              centre1 = point(xmil1, ymil1, s0, 'above left')
              quad[numA].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
              quad[numA].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexA = randint(0, nx * ny - 1)
            numA = tabfigA[indexA][2]
            indexcentre1 = randint(0, nx * ny - 1, [indexA])
            xmil1 = tabfigA[indexcentre1][0]
            ymil1 = tabfigA[indexcentre1][1]
            punto = imagePointParTransformation(6, [tabfigB[indexA][0], tabfigB[indexA][1]], [xmil1, ymil1]) // le repère est direct, donc le sens de rotation est inversé...
          }
        }
        texteAMC1 = numAlpha(0) + ' Quel est le numéro de la figure image de la figure ' + texteEnCouleurEtGras(`${numA}`, context.isAmc ? 'black' : 'green') + ' dans la rotation de centre ' + texteEnCouleurEtGras(`${s0}`, context.isAmc ? 'black' : 'green') + ' et d\'angle 90° dans le sens des aiguilles d\'une montre ?' + ajouteChampTexteMathLive(this, 0, '') + '<br>'
        texte += texteAMC1
        texteCorr += numAlpha(0) + ' La figure image de la figure ' + texteEnCouleurEtGras(`${numA}`, context.isAmc ? 'black' : 'green') + ' dans la rotation de centre ' + texteEnCouleurEtGras(`${s0}`, context.isAmc ? 'black' : 'green') + ' et d\'angle 90° dans le sens des aiguilles d\'une montre porte le numéro ' + texteEnCouleurEtGras(`${num1}`, '#f15929') + '.<br>'

        // deuxième question : centre B, rotation 90° sens horaire, une figure de tabfigD donne une figure de tabfigC
        indexD = randint(0, nx * ny - 1)
        numD = tabfigD[indexD][2]
        indexcentre2 = randint(0, nx * ny - 1, [indexD])
        xmil2 = tabfigB[indexcentre2][0]
        ymil2 = tabfigB[indexcentre2][1]
        punto = imagePointParTransformation(5, [tabfigD[indexD][0], tabfigD[indexD][1]], [xmil2, ymil2]) // le repère est direct, donc le sens de rotation est inversé...
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], 4 + tabfigC[j][0], 0.1) && egal(punto[1], tabfigC[j][1], 0.1)) {
              trouver = true
              num2 = tabfigC[j][2]
              xb = tabfigA[indexD][0]
              yb = tabfigA[indexD][1]
              centre2 = point(xmil2, ymil2, s1, 'above left')
              quad[numD].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
              quad[numD].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexD = randint(0, nx * ny - 1)
            numD = tabfigD[indexD][2]
            indexcentre2 = randint(0, nx * ny - 1, [indexD])
            xmil2 = tabfigB[indexcentre2][0]
            ymil2 = tabfigB[indexcentre2][1]
            punto = imagePointParTransformation(5, [tabfigD[indexD][0], tabfigD[indexD][1]], [xmil2, ymil2]) // le repère est direct, donc le sens de rotation est inversé...
          }
        }
        texteAMC2 = numAlpha(1) + ' Quel est le numéro de la figure image de la figure ' + texteEnCouleurEtGras(`${numD}`, context.isAmc ? 'black' : 'red') + ' dans la rotation de centre ' + texteEnCouleurEtGras(`${s1}`, context.isAmc ? 'black' : 'red') + ' et d\'angle 90° dans le sens contraire des aiguilles d\'une montre ?' + ajouteChampTexteMathLive(this, 1, '') + '<br>'
        texte += '<br>' + texteAMC2
        texteCorr += '<br>' + numAlpha(1) + ' La figure image de la figure ' + texteEnCouleurEtGras(`${numD}`, context.isAmc ? 'black' : 'red') + ' dans la rotation de centre ' + texteEnCouleurEtGras(`${s1}`, context.isAmc ? 'black' : 'red') + ' et d\'angle 90° dans le sens contraire des aiguilles d\'une montre porte le numéro ' + texteEnCouleurEtGras(`${num2}`, '#f15929') + '.<br>'

        // troisième question : centre B, rotation 90° sens anti-horaire, une figure de tabfigC donne une figure de tabfigD
        indexC = randint(0, nx * ny - 1)
        numC = tabfigC[indexC][2]
        indexcentre3 = randint(0, nx * ny - 1, [indexC])
        xmil3 = tabfigB[indexcentre3][0]
        ymil3 = tabfigB[indexcentre3][1]
        punto = imagePointParTransformation(6, [tabfigC[indexC][0], tabfigC[indexC][1]], [xmil3, ymil3]) // le repère est direct, donc le sens de rotation est inversé...
        trouver = false
        while (trouver === false) {
          for (let j = 0; j < nx * ny; j++) {
            if (egal(punto[0], tabfigD[j][0], 0.1) && egal(punto[1], 4 + tabfigD[j][1], 0.1)) {
              trouver = true
              num3 = tabfigD[j][2]
              xc = tabfigA[indexC][0]
              yc = tabfigA[indexC][1]
              centre3 = point(xmil3, ymil3, s2, 'above left')
              quad[numC].couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
              quad[numC].opaciteDeRemplissage = 0.6
              break
            }
          }
          if (trouver === false) {
            indexC = randint(0, nx * ny - 1)
            numC = tabfigC[indexC][2]
            indexcentre3 = randint(0, nx * ny - 1, [indexC])
            xmil3 = tabfigB[indexcentre3][0]
            ymil3 = tabfigB[indexcentre3][1]
            punto = imagePointParTransformation(6, [tabfigC[indexC][0], tabfigC[indexC][1]], [xmil3, ymil3]) // le repère est direct, donc le sens de rotation est inversé...
          }
        }
        texteAMC3 = numAlpha(2) + ' Quel est le numéro de la figure image de la figure ' + texteEnCouleurEtGras(`${numC}`, context.isAmc ? 'black' : 'blue') + ' dans la rotation de centre ' + texteEnCouleurEtGras(`${s2}`, context.isAmc ? 'black' : 'blue') + ' et d\'angle 90° dans le sens des aiguilles d\'une montre ?' + ajouteChampTexteMathLive(this, 2, '') + '<br>'
        texte += '<br>' + texteAMC3
        texteCorr += '<br>' + numAlpha(2) + ' La figure image de la figure ' + texteEnCouleurEtGras(`${numC}`, context.isAmc ? 'black' : 'blue') + ' dans la rotation de centre ' + texteEnCouleurEtGras(`${s2}`, context.isAmc ? 'black' : 'blue') + ' et d\'angle 90° dans le sens des aiguilles d\'une montre porte le numéro ' + texteEnCouleurEtGras(`${num3}`, '#f15929') + '.<br>'

        trace = tracePoint(centre1, context.isAmc ? 'black' : 'green')
        label = labelPoint(centre1, context.isAmc ? 'black' : 'green')
        trace.epaisseur = 2
        trace.taille = 4
        objetsEnonce.push(trace, label)
        objetsCorrection.push(trace, label)
        trace = tracePoint(centre2, context.isAmc ? 'black' : 'red')
        label = labelPoint(centre2, context.isAmc ? 'black' : 'red')
        trace.epaisseur = 2
        trace.taille = 4
        objetsEnonce.push(trace, label)
        objetsCorrection.push(trace, label)
        trace = tracePoint(centre3, context.isAmc ? 'black' : 'blue')
        label = labelPoint(centre3, context.isAmc ? 'black' : 'blue')
        trace.epaisseur = 2
        trace.taille = 4
        objetsEnonce.push(trace, label)
        objetsCorrection.push(trace, label)
        if (context.isHtml) objetsCorrection.push(rotationAnimee(quad[numA], centre1, -90, `id="anim${numeroExercice}A" dur ="2s" repeatcount="1"`), rotationAnimee(quad[numD], centre2, 90, `id="anim${numeroExercice}B" dur="2s" repeatcount="1"`), rotationAnimee(quad[numC], centre3, -90, `id="anim${numeroExercice}C" dur="2s" repeatcount="1"`))

        consigneAMC = mathalea2d(
          Object.assign({
            pixelsParCm: 15,
            scale: 0.3,
            optionsTikz: ['every node/.style={scale=0.6}']
          },
          fixeBordures(objetsEnonce, { rxmin: -1, rxmax: 1, rymin: -1, rymax: 1 })
          ),
          objetsEnonce
        )
        texte += consigneAMC
        quad1 = translation(quad[num1], vecteur(0, 0))
        quad1.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        quad1.opaciteDeRemplissage = 0.3
        quad2 = translation(quad[num2], vecteur(0, 0))
        quad2.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        quad2.opaciteDeRemplissage = 0.3
        quad3 = translation(quad[num3], vecteur(0, 0))
        quad3.couleurDeRemplissage = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        quad3.opaciteDeRemplissage = 0.3
        arc1 = arc(point(tabfigA[indexA][0], tabfigA[indexA][1]), centre1, -90)
        rayon11 = segment(point(tabfigA[indexA][0], tabfigA[indexA][1]), centre1, context.isAmc ? 'black' : 'green')
        rayon12 = rotation(rayon11, centre1, -90)
        rayon11.pointilles = 2
        rayon12.pointilles = 2
        rayon12.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        arc1.pointilles = 2
        arc1.epaisseur = 2
        arc1.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'green')
        arc2 = arc(point(tabfigD[indexD][0], tabfigD[indexD][1]), centre2, 90)
        rayon21 = segment(point(tabfigD[indexD][0], tabfigD[indexD][1]), centre2, context.isAmc ? 'black' : 'red')
        rayon22 = rotation(rayon21, centre2, 90)
        rayon21.pointilles = 2
        rayon22.pointilles = 2
        rayon22.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        arc2.pointilles = 2
        arc2.epaisseur = 2
        arc2.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'red')
        arc3 = arc(point(tabfigC[indexC][0], tabfigC[indexC][1]), centre3, -90)
        rayon31 = segment(point(tabfigC[indexC][0], tabfigC[indexC][1]), centre3, context.isAmc ? 'black' : 'blue')
        rayon32 = rotation(rayon31, centre3, -90)
        rayon31.pointilles = 2
        rayon32.pointilles = 2
        rayon32.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        arc3.pointilles = 2
        arc3.epaisseur = 2
        arc3.color = colorToLatexOrHTML(context.isAmc ? 'black' : 'blue')
        objetsCorrection.push(quad1, quad2, quad3, arc1, arc2, arc3, rayon11, rayon12, rayon21, rayon22, rayon31, rayon32,
          codageAngleDroit(point(tabfigA[indexA][0], tabfigA[indexA][1]), centre1, rotation(point(tabfigA[indexA][0], tabfigA[indexA][1]), centre1, -90), context.isAmc ? 'black' : 'green', 1, 1),
          codageAngleDroit(point(tabfigD[indexD][0], tabfigD[indexD][1]), centre2, rotation(point(tabfigD[indexD][0], tabfigD[indexD][1]), centre2, 90), context.isAmc ? 'black' : 'red', 1, 1),
          codageAngleDroit(point(tabfigC[indexC][0], tabfigC[indexC][1]), centre3, rotation(point(tabfigC[indexC][0], tabfigC[indexC][1]), centre3, -90), context.isAmc ? 'black' : 'blue', 1, 1),
          codageSegments('|||', context.isAmc ? 'black' : 'green', rayon11, rayon12), codageSegments('OO', context.isAmc ? 'black' : 'red', rayon21, rayon22), codageSegments('XXX', context.isAmc ? 'black' : 'blue', rayon31, rayon32))
        texteCorr += mathalea2d(
          Object.assign({}, fixeBordures(objetsCorrection), {
            pixelsParCm: 15,
            scale: 0.3,
            optionsTikz: ['every node/.style={scale=0.6}']
          })
          , objetsCorrection
        )
        break
    }
    setReponse(this, 0, num1)
    setReponse(this, 1, num2)
    setReponse(this, 2, num3)
    if (context.isHtml) {
      texteCorr += '<br>'
      texteCorr += `<button class="btn ui labeled icon button"  style="margin:10px" onclick="document.getElementById('anim${numeroExercice}A').beginElement()"><i class="redo circle icon"></i>Relancer l'animation verte</button>`
      texteCorr += `<button class="btn ui labeled icon button"  style="margin:10px" onclick="document.getElementById('anim${numeroExercice}B').beginElement()"><i class="redo circle icon"></i>Relancer l'animation rouge</button>`
      texteCorr += `<button class="btn ui labeled icon button"  style="margin:10px" onclick="document.getElementById('anim${numeroExercice}C').beginElement()"><i class="redo circle icon"></i>Relancer l'animation bleue</button>`
    }
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)
    listeQuestionsToContenuSansNumero(this)
    if (context.isAmc) {
      this.autoCorrection[0] = {
        enonce: consigneAMC,
        options: { multicols: true },
        propositions: [
          {
            type: 'AMCNum',
            propositions: [{
              texte: texteCorr,
              statut: '',
              reponse: {
                texte: texteAMC1,
                valeur: num1,
                param: {
                  digits: 2,
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
                texte: texteAMC2,
                valeur: num2,
                param: {
                  digits: 2,
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
                texte: texteAMC3,
                valeur: num3,
                param: {
                  digits: 2,
                  decimals: 0,
                  signe: false,
                  approx: 0
                }
              }
            }]
          }]
      }
    }
  }
  this.besoinFormulaireNumerique = ['Transformations', 4, ' 1 : Symétries axiales\n 2 : Symétries centrales\n 3 : Translations\n 4 : Rotations\n 5 : Homothéties\n']
}
