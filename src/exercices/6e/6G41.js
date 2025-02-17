import { milieu, point, tracePoint } from '../../lib/2d/points.js'
import { grille, seyes } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { similitude, translation2Points } from '../../lib/2d/transformations.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d, colorToLatexOrHTML, vide2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'

export const amcReady = true
export const amcType = 'AMCOpen'

export const titre = 'Compléter une représentation en perspective cavalière'

/**
 * fonction servant à compléter des solides, inspirée des fonctions de 6G42 et 6G43
 * référence : 6G41
 * @author Mireille Gain, s'inspirant fortement de Jean-Claude Lhote
 */
export const uuid = 'a8e0f'
export const ref = '6G41'
export const refs = {
  'fr-fr': ['6G41'],
  'fr-ch': ['9ES7-1']
}
export default function RepresenterUnSolide () {
  Exercice.call(this) // Héritage de la classe Exercice ()
  this.titre = titre
  this.nbQuestions = 1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.sup2 = 1
  this.classe = 6
  this.amcReady = amcReady
  this.amcType = amcType

  this.nouvelleVersion = function () {
    this.autoCorrection = []
    let typeDeQuestionsDisponibles

    if (this.sup === 3) { typeDeQuestionsDisponibles = [1, 2] } else if (this.sup === 5) { typeDeQuestionsDisponibles = [1, 2, 4] } else if (this.sup === 7) { typeDeQuestionsDisponibles = [1, 2, 4, 6] } else { typeDeQuestionsDisponibles = [parseInt(this.sup)] }

    const listeTypeDeQuestions = combinaisonListes(
      typeDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    let Xmin, Xmax, Ymin, Ymax, ppc, sc

    // sixième : cube et pavé droit
    if (this.classe === 6) {
      typeDeQuestionsDisponibles = [1, 2]
    } else if (this.classe === 5) { // cinquième : on ajoute le prisme
      typeDeQuestionsDisponibles = [1, 2, 4]
    } else if (this.classe === 4) { // Quatrième : on ajoute la pyramide
      typeDeQuestionsDisponibles = [1, 2, 4, 6]
    }

    if (parseInt(this.sup2) === 1) { sc = 0.5 } else { sc = 0.8 }

    let A; let B; let C; let D; let E; let F; let G; let H; let I
    let AB; let BC; let CD; let DA; let EF; let FG; let GH; let HE; let AE; let BF; let CG; let DH; let IA; let IB; let IE; let IF; let BD; let FH
    let coeffpersp
    let correction
    let carreaux; let g
    let objetsEnonce = []
    let objetsCorrection = []
    let listeDeNomsDePolygones
    for (let i = 0, texte, enonce, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (i % 2 === 0) listeDeNomsDePolygones = ['QD']
      const nom = creerNomDePolygone(8, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom)
      const anglepersp = choice([30, 45, -30, -45, 150, 135, -150, -135])
      if (anglepersp % 10 === 0) { coeffpersp = 0.6 } else { coeffpersp = 0.4 }
      objetsCorrection = []
      objetsEnonce = []

      switch (listeTypeDeQuestions[i]) {
        case 1: // cube
          enonce = `$${nom}$ est un cube.<br>`
          break

        case 2: // pavé droit
          enonce = `$${nom}$ est un pavé droit.<br>`
          break

        case 4: // prisme
          enonce = 'On considère un prisme à base triangulaire.<br>'
          break

        case 6: // pyramide
          enonce = 'On considère une pyramide à base rectangulaire.<br>'
          break
      }
      enonce += context.isHtml ? 'Reproduire et compléter ' : 'Compléter '
      enonce += 'la figure ci-dessous, en repassant de la même couleur les segments parallèles et de même longueur.<br>'
      correction = 'Figure complétée :<br>'

      switch (listeTypeDeQuestions[i] % 2) {
        case 1:
          A = point(6, 0, nom[0], 'left')
          B = point(11, 0, nom[1], 'right')
          C = point(11, 5, nom[2], 'right')
          D = point(6, 5, nom[3], 'left')
          E = similitude(B, A, anglepersp, coeffpersp, nom[4], 'left')
          E.x = Math.round(E.x)
          E.y = Math.round(E.y)
          break

        case 0:
          A = point(5, 0, nom[0], 'left')
          B = point(9 + randint(1, 3), 0, nom[1], 'right')
          C = point(B.x, randint(3, 7), nom[2], 'right')
          D = point(A.x, C.y, nom[3], 'left')
          E = similitude(B, A, anglepersp, coeffpersp * randint(5, 12) / 10, nom[4], 'left')
          E.x = Math.round(E.x)
          E.y = Math.round(E.y)
          break
      }

      F = translation2Points(E, A, B, nom[5], 'right')
      G = translation2Points(F, B, C, nom[6], 'right')
      H = translation2Points(G, C, D, nom[7], 'left')
      I = milieu(D, G)
      const matrace = tracePoint(I)
      matrace.taille = 4
      matrace.opacite = 0.9
      matrace.epaisseur = 5
      matrace.style = 'x'
      AB = segment(A, B, 'black')
      BC = segment(B, C, 'black')
      CD = segment(C, D, 'black')
      DA = segment(D, A, 'black')
      EF = segment(E, F, 'black')
      FG = segment(F, G, 'black')
      GH = segment(G, H, 'black')
      HE = segment(H, E, 'black')
      AE = segment(A, E, 'black')
      BF = segment(B, F, 'black')
      CG = segment(C, G, 'black')
      DH = segment(D, H, 'black')
      IA = segment(A, I, 'black')
      IB = segment(B, I)
      IE = segment(E, I)
      IF = segment(F, I)
      BD = segment(B, D)
      FH = segment(F, H)
      AB.epaisseur = 2
      BC.epaisseur = 2
      CD.epaisseur = 2
      DA.epaisseur = 2
      EF.epaisseur = 2
      FG.epaisseur = 2
      GH.epaisseur = 2
      HE.epaisseur = 2
      AE.epaisseur = 2
      BF.epaisseur = 2
      CG.epaisseur = 2
      DH.epaisseur = 2
      IA.epaisseur = 1
      IB.epaisseur = 1
      IE.epaisseur = 1
      IF.epaisseur = 1
      BD.epaisseur = 2
      FH.epaisseur = 2

      if (G.y < C.y && G.x < C.x) {
        CG.pointilles = 5
        GH.pointilles = 5
        FG.pointilles = 5
        IF.pointilles = 5
        FH.pointilles = 5
        CG.color = colorToLatexOrHTML('gray')
        GH.color = colorToLatexOrHTML('gray')
        FG.color = colorToLatexOrHTML('gray')
        CG.opacite = 0.7
        GH.opacite = 0.7
        FG.opacite = 0.7
      } else if (E.y > A.y && E.x > A.x) {
        AE.pointilles = 5
        EF.pointilles = 5
        HE.pointilles = 5
        IE.pointilles = 5
        FH.pointilles = 5
        AE.color = colorToLatexOrHTML('gray')
        EF.color = colorToLatexOrHTML('gray')
        HE.color = colorToLatexOrHTML('gray')
        AE.opacite = 0.7
        EF.opacite = 0.7
        HE.opacite = 0.7
      } else if (F.x < B.x && F.y > B.y) {
        BF.pointilles = 5
        FG.pointilles = 5
        EF.pointilles = 5
        IF.pointilles = 5
        FH.pointilles = 5
        BF.color = colorToLatexOrHTML('gray')
        FG.color = colorToLatexOrHTML('gray')
        EF.color = colorToLatexOrHTML('gray')
        BF.opacite = 0.7
        FG.opacite = 0.7
        EF.opacite = 0.7
      } else if (H.x > D.x && H.y < D.y) {
        DH.pointilles = 5
        GH.pointilles = 5
        HE.pointilles = 5
        IE.pointilles = 5
        FH.pointilles = 5
        DH.color = colorToLatexOrHTML('gray')
        GH.color = colorToLatexOrHTML('gray')
        HE.color = colorToLatexOrHTML('gray')
        DH.opacite = 0.7
        GH.opacite = 0.7
        HE.opacite = 0.7
      }
      Xmin = Math.min(A.x, E.x) - 1
      Ymin = Math.min(A.y, E.y) - 1
      Xmax = Math.max(B.x, F.x) + 2
      Ymax = Math.max(D.y, H.y) + 1
      ppc = 20

      if (this.sup2 < 3) { g = grille(Xmin, Ymin, Xmax, Ymax, 'gray', 0.7) } else { g = vide2d() }
      if (parseInt(this.sup2) === 2) { carreaux = seyes(Xmin, Ymin, Xmax, Ymax); sc = 0.8 } else { carreaux = vide2d(); sc = 0.5 }

      const params = {
        xmin: Xmin,
        ymin: Ymin,
        xmax: Xmax,
        ymax: Ymax,
        pixelsParCm: ppc,
        scale: sc
      }

      if (listeTypeDeQuestions[i] === 1) {
        objetsEnonce.push(AB, BC, CD, DA, AE, labelPoint(A, B, C, D, E),
          g,
          carreaux
        )
      }

      if (listeTypeDeQuestions[i] === 2) {
        objetsEnonce.push(AB, BC, CD, DA, AE, labelPoint(A, B, C, D, E),
          g,
          carreaux
        )
      }

      if (listeTypeDeQuestions[i] === 4) {
        objetsEnonce.push(AB, DA, BD, AE,
          g,
          carreaux
        )
      }

      if (listeTypeDeQuestions[i] === 6) {
        objetsEnonce.push(AB, BF, tracePoint(I, 'red'), labelPoint(I),
          g,
          carreaux
        )
      }

      enonce += mathalea2d(params, objetsEnonce)
      if (listeTypeDeQuestions[i] === 1) {
        AB.color = colorToLatexOrHTML('green')
        BC.color = colorToLatexOrHTML('red')
        CD.color = colorToLatexOrHTML('green')
        DA.color = colorToLatexOrHTML('red')
        EF.color = colorToLatexOrHTML('green')
        FG.color = colorToLatexOrHTML('red')
        GH.color = colorToLatexOrHTML('green')
        HE.color = colorToLatexOrHTML('red')
        AE.color = colorToLatexOrHTML('blue')
        BF.color = colorToLatexOrHTML('blue')
        CG.color = colorToLatexOrHTML('blue')
        DH.color = colorToLatexOrHTML('blue')
        objetsCorrection.push(AB, BC, CD, DA, EF, FG, GH, HE, AE, BF, CG, DH, labelPoint(A, B, C, D, E, F, G, H),
          g,
          carreaux
        )
      }

      if (listeTypeDeQuestions[i] === 2) {
        AB.color = colorToLatexOrHTML('green')
        BC.color = colorToLatexOrHTML('red')
        CD.color = colorToLatexOrHTML('green')
        DA.color = colorToLatexOrHTML('red')
        EF.color = colorToLatexOrHTML('green')
        FG.color = colorToLatexOrHTML('red')
        GH.color = colorToLatexOrHTML('green')
        HE.color = colorToLatexOrHTML('red')
        AE.color = colorToLatexOrHTML('blue')
        BF.color = colorToLatexOrHTML('blue')
        CG.color = colorToLatexOrHTML('blue')
        DH.color = colorToLatexOrHTML('blue')
        objetsCorrection.push(AB, BC, CD, DA, EF, FG, GH, HE, AE, BF, CG, DH, labelPoint(A, B, C, D, E, F, G, H),
          g,
          carreaux
        )
      }

      if (listeTypeDeQuestions[i] === 4) {
        AB.color = colorToLatexOrHTML('green')
        BC.color = colorToLatexOrHTML('red')
        CD.color = colorToLatexOrHTML('green')
        DA.color = colorToLatexOrHTML('red')
        EF.color = colorToLatexOrHTML('green')
        FG.color = colorToLatexOrHTML('red')
        GH.color = colorToLatexOrHTML('green')
        HE.color = colorToLatexOrHTML('red')
        AE.color = colorToLatexOrHTML('blue')
        BF.color = colorToLatexOrHTML('blue')
        CG.color = colorToLatexOrHTML('blue')
        DH.color = colorToLatexOrHTML('blue')
        objetsCorrection.push(AB, DA, BD, EF, HE, AE, BF, DH, FH,
          g,
          carreaux
        )
      }

      if (listeTypeDeQuestions[i] === 6) {
        AB.color = colorToLatexOrHTML('green')
        BC.color = colorToLatexOrHTML('red')
        CD.color = colorToLatexOrHTML('green')
        DA.color = colorToLatexOrHTML('red')
        EF.color = colorToLatexOrHTML('green')
        FG.color = colorToLatexOrHTML('red')
        GH.color = colorToLatexOrHTML('green')
        HE.color = colorToLatexOrHTML('red')
        AE.color = colorToLatexOrHTML('blue')
        BF.color = colorToLatexOrHTML('blue')
        CG.color = colorToLatexOrHTML('blue')
        DH.color = colorToLatexOrHTML('blue')
        objetsCorrection.push(AB, EF, AE, BF, IA, IB, IE, IF, tracePoint(I),
          g,
          carreaux
        )
      }

      correction += mathalea2d(params, objetsCorrection)
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(enonce + '<br>')
        this.listeCorrections.push(correction + '<br>')
        // Pour AMC question AmcOpen
        this.autoCorrection[i] = { enonce, propositions: [{ texte: correction, statut: 3, feedback: '', sanscadre: true }] }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de solides', 3, ' 1 : Cubes\n 2 : Pavés droits\n 3 : Mélange']

  this.besoinFormulaire2Numerique = [
    'Type de cahier',
    3,
    ' 1 : Cahier à petits carreaux\n 2 : Cahier à gros carreaux (Seyes)\n 3 : Feuille blanche'
  ]
}
