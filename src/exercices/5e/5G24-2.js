import { codageAngle } from '../../lib/2d/angles.js'
import { codageSegment } from '../../lib/2d/codages.js'
import { point, pointAdistance } from '../../lib/2d/points.js'
import { barycentre, nommePolygone } from '../../lib/2d/polygones.js'
import { vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { rotation, translation } from '../../lib/2d/transformations.js'
import { triangle2points2longueurs } from '../../lib/2d/triangle.js'
import { texteEnCouleur } from '../../lib/outils/embellissements'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
export const titre = 'Justifier que deux triangles sont égaux'

/**
 * Deux triangles égaux sont codés, il faut reconnaître les côtés homologues
 * @author Rémi Angot
 * Référence 5G24-1
*/
export const uuid = 'b9a52'
export const ref = '5G24-2'
export const refs = {
  'fr-fr': ['5G24-2'],
  'fr-ch': []
}
export default function TrianglesEgaux () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Les triangles sont-ils égaux ? S\'ils sont égaux, justifier la réponse.'
  this.nbQuestions = 4
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = 6 // Niveau de difficulté
  this.video = '' // Id YouTube ou url
  this.spacing = 2
  this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 : CCC\n2 : CAC\n3 : ACA\n4 : AAA\n5 : CC\n6 : mélange']

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    const listeTypeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 5,
      melange: 6,
      defaut: 6,
      nbQuestions: this.nbQuestions,
      listeOfCase: ['CCC', 'CAC', 'ACA', 'AAA', 'CC']
    })
    let listeDeNomsDePolygones
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (i % 3 === 0) listeDeNomsDePolygones = ['QD']
      // Boucle principale où i+1 correspond au numéro de la question
      let l1 = randint(40, 70)
      let l2 = randint(40, 80, l1)
      let l3 = randint(40, l1 + l2 - 10, [l1, l2])
      l1 /= 10
      l2 /= 10
      l3 /= 10
      const A = point(0, 0)
      const B = pointAdistance(A, l1)
      const p1 = triangle2points2longueurs(A, B, l2, l3)
      const C = p1.listePoints[2]
      const O = barycentre(p1)
      const v = vecteur(Math.max(Math.abs(A.x - B.x), Math.abs(C.x - B.x), Math.abs(A.x - C.x)) + 4, 0)
      const O2 = translation(O, v)
      const temp = translation(p1, v)
      temp.isVisible = false
      const p2 = rotation(temp, O2, randint(0, 360))
      const D = p2.listePoints[0]
      const E = p2.listePoints[1]
      const F = p2.listePoints[2]
      const code1 = codageSegment(A, B, '|')
      const code2 = codageSegment(D, E, '|')
      const code3 = codageSegment(B, C, '||')
      const code4 = codageSegment(E, F, '||')
      const code5 = codageSegment(C, A, '|||')
      const code6 = codageSegment(F, D, '|||')
      const codeA1 = codageAngle(A, B, C)
      const codeA2 = codageAngle(D, E, F)
      const codeA3 = codageAngle(B, C, A, 0.8, 'X')
      const codeA4 = codageAngle(E, F, D, 0.8, 'X')
      const codeA5 = codageAngle(C, A, B, 0.8, '||')
      const codeA6 = codageAngle(F, D, E, 0.8, '||')
      const nom1 = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom1)
      const nom2 = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom2)
      const nommeP1 = nommePolygone(p1, nom1)
      const nommeP2 = nommePolygone(p2, nom2)
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'CCC':
          texte = mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            optionsTikz: 'baseline=(current bounding box.north)'
          },
          p1, p2, code1, code2, code3, code4, code5, code6, nommeP1, nommeP2)
          texteCorr = 'Ces deux triangles sont égaux car ils ont leurs trois côtés de même longueur 2 à 2.'
          break
        case 'CAC':
          texte = mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            optionsTikz: 'baseline=(current bounding box.north)'
          },
          p1, p2, code1, code2, code3, code4, codeA1, codeA2, nommeP1, nommeP2)
          texteCorr = 'Ces deux triangles sont égaux car ils ont ont un angle de même mesure compris entre deux côtés de même longueur 2 à 2. '
          break
        case 'ACA':
          texte = mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            optionsTikz: 'baseline=(current bounding box.north)'
          },
          p1, p2, code1, code2, codeA1, codeA2, codeA5, codeA6, nommeP1, nommeP2)
          texteCorr = 'Ces deux triangles sont égaux car ils ont un côté de même longueur compris entre deux angles de même mesure 2 à 2. '
          break
        case 'AAA':
          texte = mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            optionsTikz: 'baseline=(current bounding box.north)'
          },
          p1, p2, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nommeP1, nommeP2)
          texteCorr = `On ne peut pas déterminer si ces triangles sont égaux. Ils ont la même forme mais leurs longueurs peuvent être différentes. On dit qu'ils sont ${texteEnCouleur('semblables')}.`
          break
        case 'CC':
          texte = mathalea2d({
            xmin: Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 3,
            ymin: Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 3,
            xmax: Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 3,
            ymax: Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 3,
            scale: 0.5,
            optionsTikz: 'baseline=(current bounding box.north)'
          },
          p1, p2, code1, code2, code5, code6, nommeP1, nommeP2)
          texteCorr = 'On ne peut pas déterminer si ces triangles sont égaux.'
          break
      }
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
