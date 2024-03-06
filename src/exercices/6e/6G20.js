import { codageAngle, codageAngleDroit } from '../../lib/2d/angles.js'
import { codageSegments } from '../../lib/2d/codages.js'
import { point } from '../../lib/2d/points.js'
import { barycentre, carre, nommePolygone, polygone } from '../../lib/2d/polygones.js'
import { grille, seyes } from '../../lib/2d/reperes.js'
import { vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { homothetie, rotation, similitude, translation } from '../../lib/2d/transformations.js'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d, vide2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
export const titre = 'Nommer et coder des polygones'
export const dateDeModifImportante = '10/01/2024'

/**
 * @author Jean-Claude Lhote
 * Placer les sommets et les égalités de longueur...
 */
export const uuid = '90e1a'
export const ref = '6G20'
export const refs = {
  'fr-fr': ['6G20'],
  'fr-ch': ['9ES2-5']
}
export default function NommerEtCoderDesPolygones () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 3
  this.sup2 = 9

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions === 1 ? 'Nommer la figure' : 'Nommer les figures'
    this.consigne += " en fonction de l'énoncé puis ajouter le codage."
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let Xmin, Xmax, Ymin, Ymax, sc, g, carreaux
    const ppc = 40
    if (context.isHtml) {
      sc = 0.5
    } else {
      sc = 0.4
    }

    let params

    // const liste = combinaisonListes([1, 2, 3, 4, 5, 6, 7, 8], this.nbQuestions)
    const liste = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 8,
      melange: 9,
      defaut: 9,
      nbQuestions: this.nbQuestions
    })

    let listeDeNomsDePolygones
    for (
      let i = 0, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      if (i % 4 === 0) listeDeNomsDePolygones = ['PQD']
      context.pixelsParCm = 40
      let pol, polcode, polsom
      const choisirPolygone = (n) => { // n compris entre 1 et 8 (1 à 4 pour un triangle, 5 à 8 pour une quadrilatère)
        let A, B, C, D
        const nom = creerNomDePolygone(4, listeDeNomsDePolygones); let pnom; let q; let p; let pcode; let enonce
        switch (n) {
          case 1: // triangle isocèle
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(0, 10) / 10, nom[1])
            C = rotation(B, A, randint(25, 80), nom[2])
            q = polygone(A, B, C)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2])
            pcode = [codageSegments('||', 'blue', A, B, A, C), codageAngle(B, C, A, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2), codageAngle(C, B, A, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2)]
            enonce = `Le triangle $${nom[0] + nom[1] + nom[2]}$ est isocèle en $${nom[0]}$.<br>`
            break
          case 2: // triangle équilatéral
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(0, 10) / 10, nom[1])
            C = rotation(B, A, 60, nom[2])
            q = polygone(A, B, C)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2])
            pcode = [codageSegments('||', 'blue', A, B, A, C, B, C), codageAngle(B, C, A, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2), codageAngle(C, B, A, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2), codageAngle(C, A, B, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2)]
            enonce = `Le triangle $${nom[0] + nom[1] + nom[2]}$ est équilatéral.<br>$\\phantom{et sa longueur est AB}$`
            break
          case 3: // triangle rectangle
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(0, 10) / 10, nom[1])
            C = similitude(B, A, 90, randint(30, 100) / 100, nom[2])
            q = polygone(A, B, C)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2])
            pcode = codageAngleDroit(B, A, C)
            enonce = `Le triangle $${nom[0] + nom[1] + nom[2]}$ est rectangle en $${nom[0]}$.<br>$\\phantom{et sa longueur est AB}$`
            break
          case 4: // triangle rectangle isocèle
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(0, 10) / 10, nom[1])
            C = rotation(B, A, 90, nom[2])
            q = polygone(A, B, C)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2])
            pcode = [codageSegments('||', 'blue', A, B, A, C), codageAngleDroit(B, A, C), codageAngle(B, C, A, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2), codageAngle(C, B, A, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2)]
            enonce = `Le triangle $${nom[0] + nom[1] + nom[2]}$ est rectangle et isocèle en $${nom[0]}$.`
            break
          // on choisit un quadrilatère
          case 5: // carré
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(10, 30) / 10, nom[1])
            q = carre(A, B)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            D = p.listePoints[3]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2] + nom[3])
            pcode = [codageSegments('||', 'blue', A, B, B, C, C, D, D, A), codageAngleDroit(B, A, D), codageAngleDroit(A, B, C), codageAngleDroit(B, C, D), codageAngleDroit(A, D, C)]
            enonce = `Le quadrilatère $${nom[0] + nom[1] + nom[2] + nom[3]}$ est un carré.<br>$\\phantom{et sa longueur est AB}$`
            break
          case 6: // rectangle
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(10, 30) / 10, nom[1])
            C = similitude(A, B, -90, randint(30, 80) / 100, nom[2])
            D = translation(C, vecteur(B, A), nom[3])
            q = polygone(A, B, C, D)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            D = p.listePoints[3]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2] + nom[3])
            pcode = [codageSegments('||', 'blue', A, B, C, D), codageSegments('|', 'red', C, B, A, D), codageAngleDroit(B, A, C), codageAngleDroit(A, B, C), codageAngleDroit(B, C, D), codageAngleDroit(A, D, C)]
            enonce = `Le quadrilatère $${nom[0] + nom[1] + nom[2] + nom[3]}$ est un rectangle et $${nom[0] + nom[1]}$ est sa longueur.`
            break
          case 7: // losange
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(10, 30) / 10, nom[1])
            C = rotation(A, B, randint(100, 150), nom[2])
            D = translation(C, vecteur(B, A), nom[3])
            q = polygone(A, B, C, D)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            D = p.listePoints[3]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2] + nom[3])
            pcode = [codageSegments('O', 'blue', A, B, B, C, C, D, D, A), codageAngle(C, D, A, 0.8, '||', 'red', 2, 0.8, 'red', 0.2), codageAngle(C, B, A, 0.8, '||', 'red', 2, 0.8, 'red', 0.2), codageAngle(B, C, D, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2), codageAngle(D, A, B, 0.8, '|', 'blue', 2, 0.8, 'blue', 0.2)]
            enonce = `Le quadrilatère $${nom[0] + nom[1] + nom[2] + nom[3]}$ est un losange et [$${nom[0] + nom[2]}$] est sa plus grande diagonale.`
            break
          case 8: // trapèze rectangle
            A = point(3, randint(0, 20) / 10, nom[0])
            B = point(randint(7, 8), randint(10, 30) / 10, nom[1])
            D = similitude(B, A, 90, randint(30, 80) / 100, nom[3])
            C = translation(D, homothetie(vecteur(A, B), A, randint(30, 80) / 100), nom[2])
            q = polygone(A, B, C, D)
            p = rotation(q, barycentre(q), randint(0, 360))
            A = p.listePoints[0]
            B = p.listePoints[1]
            C = p.listePoints[2]
            D = p.listePoints[3]
            pnom = nommePolygone(p, nom[0] + nom[1] + nom[2] + nom[3])
            pcode = [codageAngleDroit(B, A, D), codageAngleDroit(C, D, A)]
            enonce = `Le quadrilatère $${nom[0] + nom[1] + nom[2] + nom[3]}$ est un trapèze rectangle de grande base $${nom[0] + nom[1]}$ de hauteur $${nom[0] + nom[3]}$.`
            break
        }
        return [p, nom, pcode, pnom, enonce]
      }
      [pol,, polcode, polsom, texte] = choisirPolygone(liste[i])
      if (pol.listePoints.length === 4) {
        Xmin = Math.floor(Math.min(pol.listePoints[0].x, pol.listePoints[1].x, pol.listePoints[2].x, pol.listePoints[3].x) - 1)
        Ymin = Math.floor(Math.min(pol.listePoints[0].y, pol.listePoints[1].y, pol.listePoints[2].y, pol.listePoints[3].y) - 1)
        Xmax = Math.ceil(Math.max(pol.listePoints[0].x, pol.listePoints[1].x, pol.listePoints[2].x, pol.listePoints[3].x) + 1)
        Ymax = Math.ceil(Math.max(pol.listePoints[0].y, pol.listePoints[1].y, pol.listePoints[2].y, pol.listePoints[3].y) + 1)
      } else {
        Xmin = Math.floor(Math.min(pol.listePoints[0].x, pol.listePoints[1].x, pol.listePoints[2].x) - 1)
        Ymin = Math.floor(Math.min(pol.listePoints[0].y, pol.listePoints[1].y, pol.listePoints[2].y) - 1)
        Xmax = Math.ceil(Math.max(pol.listePoints[0].x, pol.listePoints[1].x, pol.listePoints[2].x) + 1)
        Ymax = Math.ceil(Math.max(pol.listePoints[0].y, pol.listePoints[1].y, pol.listePoints[2].y) + 1)
      }
      params = {
        xmin: Xmin,
        ymin: Ymin,
        xmax: Xmax,
        ymax: Ymax,
        pixelsParCm: ppc,
        scale: sc
      }
      if (this.sup < 3) g = grille(Xmin, Ymin, Xmax, Ymax, 'gray', 0.7)
      else g = vide2d()
      if (this.sup === 2) {
        carreaux = seyes(Xmin, Ymin, Xmax, Ymax)
      } else {
        carreaux = vide2d()
      }

      pol.epaisseur = 2
      texte += '<br>' + mathalea2d(params, pol, g, carreaux)
      texteCorr = mathalea2d(params, pol, polcode, polsom, g, carreaux)
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    context.pixelsParCm = 20
  }
  this.besoinFormulaireNumerique = [
    'Type de cahier',
    3,
    ' 1 : Cahier à petits carreaux\n 2 : Cahier à gros carreaux (Seyes)\n 3 : Feuille blanche'
  ]
  this.besoinFormulaire2Texte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : Triangle isocèle',
      '2 : Triangle équilatéral',
      '3 : Triangle rectangle',
      '4 : Triangle rectangle isocèle',
      '5 : Carré',
      '6 : Rectangle',
      '7 : Losange',
      '8 : Trapèze rectangle',
      '9 : Mélange'
    ].join('\n')
  ]
}
