import { droite } from '../../lib/2d/droites.js'
import { point, pointIntersectionDD, pointSurSegment } from '../../lib/2d/points.js'
import { longueur, segment, segmentAvecExtremites } from '../../lib/2d/segmentsVecteurs.js'
import { afficheLongueurSegment, afficheMesureAngle } from '../../lib/2d/codages.js'
import { rotation } from '../../lib/2d/transformations.js'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { arrondi } from '../../lib/outils/nombres'
import Alea2iep from '../../modules/Alea2iep.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '04/03/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

export const titre = 'Tracer un triangle dont on connaît une longueur et 2 angles (angles aigus et/ou obtus)'

/**
 * Tracer un triangle dont on connaît une longueur et 2 angles (angles aigus et/ou obtus)
 * @author Mickael Guironnet - Rémi Angot
 * Références 6G23-2 et 5G20-2git
 */
export const uuid = '73630'
export const ref = '6G23-3'
export const refs = {
  'fr-fr': ['6G23-3'],
  'fr-ch': []
}
export default function TracerTriangle2Angles () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 3
  this.nbCols = 1
  this.nbColsCorr = 1
  this.typeExercice = 'IEP'
  this.sup = false
  this.sup2 = false
  this.sup3 = '3' // Type de questions

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let listeDeNomsDePolygones

    const listeTypesDeQuestions = gestionnaireFormulaireTexte({
      min: 1,
      max: 2,
      defaut: 1,
      melange: 3,
      nbQuestions: this.nbQuestions,
      saisie: this.sup3
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      if (i % 5 === 0) listeDeNomsDePolygones = ['PQD']

      const c = (randint(40, 70) / 10)
      const b = (randint(40, 80) / 10)
      let ang1
      if (listeTypesDeQuestions[i] === 1) {
        ang1 = randint(20, 80)
      } else {
        ang1 = randint(90, 140)
      }
      const a = (Math.sqrt(c * c + b * b - 2 * c * b * Math.cos(ang1 * Math.PI / 180.0)))
      const ang2 = arrondi(180 * Math.acos((b * b - a * a - c * c) / (-2 * a * c)) / Math.PI, 0)
      let angle1, angle2
      if (randint(0, 1) === 0) {
        angle1 = ang1
        angle2 = ang2
      } else {
        angle1 = ang2
        angle2 = ang1
      }

      const p = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(p)
      texte = `Tracer un triangle $${p}$ tel que $${p[0] + p[1]}=${texNombre(c)}$ cm, $\\widehat{${p[1] + p[0] + p[2]
        }}=${angle1}\\degree$ et $\\widehat{${p[0] + p[1] + p[2]
        }}=${angle2}\\degree$.`
      texte += `<br> Mesurer $${p[0] + p[2]}$,  $${p[1] + p[2]}$ et $\\widehat{${p[0] + p[2] + p[1]}}$`

      // on construit le segment
      const A0 = point(0, 0, p[0], 'left')
      const B0 = point(c, 0, p[1], 'right')
      const s0 = segmentAvecExtremites(A0, B0)
      const t0 = afficheLongueurSegment(B0, A0)

      // on construit l'angle à gauche
      const A1 = point(B0.x + 4, 0, p[0], 'left')
      const B1 = point(A1.x + c, 0, p[1], 'right')
      const s1 = segment(A1, B1)
      s1.styleExtremites = '-|'
      const c1 = rotation(B1, A1, angle1)
      const C1 = pointSurSegment(c1, A1, -3)
      const s1g = segment(A1, C1)
      const t1g = afficheMesureAngle(B1, A1, C1)

      // on construit l'angle à droite
      const A2 = point(B1.x + 4, 0, p[0], 'left')
      const B2 = point(A2.x + c, 0, p[1], 'right')
      const s2 = segment(A2, B2)
      const c2g = rotation(B2, A2, angle1)
      const C2g = pointSurSegment(c2g, A2, -3)
      const s2g = segment(A2, C2g)
      const c2d = rotation(A2, B2, -angle2)
      const C2d = pointSurSegment(c2d, B2, -3)
      const t2d = afficheMesureAngle(A2, B2, C2d)
      const s2d = segment(B2, C2d)

      // on construit le triangle
      const A3 = point(B2.x + 4, 0, p[0], 'left')
      const B3 = point(A3.x + c, 0, p[1], 'right')

      const s3 = segment(A3, B3)
      const c3g = rotation(B3, A3, angle1)
      const C3g = pointSurSegment(c3g, A3, -3)
      const c3d = rotation(A3, B3, -angle2)
      const C3d = pointSurSegment(c3d, B3, -3)
      const t3g = afficheMesureAngle(B3, A3, C3g)
      const t3d = afficheMesureAngle(A3, B3, C3d)
      const d1 = droite(A3, C3g)
      d1.isVisible = false
      const d2 = droite(B3, C3d)
      d2.isVisible = false
      const C = pointIntersectionDD(d1, d2, p[2])
      const l = labelPoint(A0, B0, A1, B1, A2, B2, C, A3, B3, C)

      texteCorr = ''
      if (this.sup2) {
        texteCorr += 'Voici les étapes de la construction :'
        texteCorr += mathalea2d({ xmin: -1, xmax: Math.max(C.x, B3.x) + 1, ymin: -1, ymax: C.y + 1 }, s0, s1, s1g, s2, s2g, s2d, s3, segment(A3, C), segment(B3, C), t0, t1g, t2d, t3g, t3d, l)
        texteCorr += '<br><br>'
      }
      if (!this.sup) {
        texteCorr += `$${p[0] + p[2]}\\approx${texNombre(longueur(A3, C, 2))}$ cm et $${p[1] + p[2]}\\approx${texNombre(longueur(B3, C, 2))}$ cm`
        texteCorr += ` et $\\widehat{${p[1] + p[2] + p[0]
          }}=${180 - angle1 - angle2}\\degree$ `
      }
      const anim = new Alea2iep()
      anim.triangle1longueur2angles(p, c, angle1, angle2, true, true) // description et longueur
      texteCorr += anim.htmlBouton(this.numeroExercice, i)

      if (this.questionJamaisPosee(i, angle1, angle2)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Longueurs données qu\'à la fin de l\'animation']
  this.besoinFormulaire2CaseACocher = ['Différentes figures de la construction']
  this.besoinFormulaire3Texte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : deux angles aigus',
      '2 : un angle obtus et un angle aigu',
      '3 : Mélange'
    ].join('\n')
  ]
}
