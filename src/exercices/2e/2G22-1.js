import { point } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { longueur, nomVecteurParPosition, segment, vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, latexParPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { homothetie } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { mathalea2d, colorToLatexOrHTML } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

export const titre = 'Représenter un vecteur dans un repère, à partir de ses coordonnées'

/**
 * Tracer un vecteur dont on connais les coordonnées dans un repère.
 * @author Stéphane Guyon légèrement modifié par Jean-Claude Lhote
 */
export const uuid = '3a3ec'
export const ref = '2G22-1'
export const refs = {
  'fr-fr': ['2G22-1'],
  'fr-ch': []
}

export default class RepresenterUnVecteur extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 2
    this.nbCols = 1
    this.nbColsCorr = 1
    this.sup = 1 //
    this.besoinFormulaireNumerique = ['Situations différentes ', 2, '1 :Avec un point origine\n 2 : Avec un point extrémité']
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    for (let i = 0, r, posLabelA, posLabelB, labelA, labelB, A, B, H, h1, h2, O, I, J, j, k, l, s, o, ux, uy, xA, yA, xB, yB, AB, nomi, nomj, nomAB, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // let t
      xA = randint(2, 8) * choice([-1, 1])
      yA = randint(2, 8) * choice([-1, 1])
      ux = randint(3, 8) * choice([-1, 1])
      uy = randint(3, 8) * choice([-1, 1])
      xB = xA + ux
      yB = yA + uy
      while (Math.abs(xB) < 2 || Math.abs(xB) > 8) { // On s'assure de choisir des points bien placés dans le repère.
        xA = randint(3, 8) * choice([-1, 1])
        ux = randint(3, 8) * choice([-1, 1])
        xB = xA + ux
      }
      while (Math.abs(yB) < 2 || Math.abs(yB) > 8) { // Idem pour les ordonnées
        yA = randint(3, 8) * choice([-1, 1])
        uy = randint(3, 8) * choice([-1, 1])
        yB = yA + uy
      }
      A = point(xA, yA)
      B = point(xB, yB)
      AB = vecteur(A, B)
      r = repere({ axesEpaisseur: 1 })// On définit le repère
      posLabelA = homothetie(B, A, -0.7 / longueur(A, B), '', 'center') // pour positionner les noms des points aux extrémités proprement
      posLabelB = homothetie(A, B, -0.7 / longueur(A, B), '', 'center')
      labelA = latexParPoint('A', posLabelA, 'red', 10, 12, '')
      labelB = latexParPoint('B', posLabelB, 'red', 10, 12, '')

      H = point(xA + ux, yA)
      s = AB.representant(A) // On trace en rouge [AB]
      h1 = segment(A, H, 'blue')
      h2 = segment(B, H, 'green')
      O = point(0, 0)// On définit et on trace le point O
      o = texteParPosition('O', -0.3, -0.3, 0, 'blue', 0.5, 'milieu', true)
      I = point(1, 0)// On définit sans tracer le point I
      J = point(0, 1)// On définit sans tracer le point J
      k = vecteur(O, I).representant(O, 'blue') // Variable qui trace [OI] en bleu
      j = vecteur(O, J).representant(O, 'blue')// Variable qui trace [OJ] en bleu
      s.epaisseur = 1.5// Variable qui grossit le tracé du vecteur AB
      s.color = colorToLatexOrHTML('red')
      k.epaisseur = 1.1// Variable qui grossit le tracé du vecteur OI
      j.epaisseur = 1.1// Variable qui grossit le tracé du vecteur OJ
      h1.epaisseur = 1.5// Variable qui grossit le tracé bleu
      h2.epaisseur = 1.5// Variable qui grossit le tracé bleu
      nomi = nomVecteurParPosition('i', 0.5, -0.7, 0.7, 0, 'blue')
      nomj = nomVecteurParPosition('j', -0.7, 0.5, 0.7, 0, 'blue')
      nomAB = AB.representantNomme(A, 'u', 0.7, 'red')
      if (this.sup === 1) {
        l = labelPoint(A, 'red')// Variable qui trace les nom s A et B
        //  t = tracePoint(A, 'red') // Variable qui trace les points avec une croix

        texte = ` Dans un repère orthonormé $\\big(O ; \\vec \\imath,\\vec \\jmath\\big)$, représenter le vecteur $\\vec{u}\\begin{pmatrix}${ux} \\\\${uy}\\end{pmatrix}$, `
        texte += `ayant pour origine le point $A\\left(${xA};${yA}\\right)$.`

        texteCorr = 'On sait qu\'un vecteur mesure un déplacement.'
        texteCorr += `<br> À partir du point $A$,  on trace donc le déplacement correspondant à $${ux}$ unités horizontalement (en bleu) puis $${uy}$ unités verticalement (en vert) pour arriver au point $B$, extrémité du vecteur $\\vec{u}$.`
        texteCorr += '<br> Voir les déplacements dans le repère et le tracé en rouge du vecteur $\\vec{u}$.<br>'
      } else {
        texte = ` Dans un repère orthonormé $\\big(O ; \\vec \\imath,\\vec \\jmath\\big)$, représenter le vecteur $\\vec{u}\\begin{pmatrix}${ux} \\\\${uy}\\end{pmatrix}$, `
        texte += `ayant pour extrémité le point $B\\left(${xB};${yB}\\right)$.`

        texteCorr = 'On sait qu\'un vecteur mesure un déplacement.'
        texteCorr += `<br> On cherche donc un point $A$, à partir duquel en traçant le déplacement correspondant à $${ux}$ unités horizontalement (en bleu)  puis $${uy}$ unités verticalement (en vert), on arrive au point $B$.`
        texteCorr += '<br> Voir le déplacement en bleu dans le repère et le tracé en rouge du vecteur $\\vec{u}$.<br>'
        //  t = tracePoint(A, 'red') // Variable qui trace les points avec une croix
        l = labelPoint(A, B, 'red')// Variable qui trace les nom s A et B
      }
      texteCorr += mathalea2d({
        xmin: -10,
        ymin: -10,
        xmax: 10,
        ymax: 10,
        scale: 0.4
      }, r, l, k, j, s, o, nomi, nomj, nomAB, h1, h2, labelA, labelB
      //, t
      )// On trace le graphique

      if (this.questionJamaisPosee(i, xA, yA, xB, yB)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
