import { codageAngleDroit } from '../../lib/2d/angles.js'
import { afficheLongueurSegment } from '../../lib/2d/codages.js'
import { droite } from '../../lib/2d/droites.js'
import { milieu, point, pointAdistance } from '../../lib/2d/points.js'
import { parallelogramme2points1hauteur } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { projectionOrtho } from '../../lib/2d/transformations.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'

export const titre = 'Aire du parallélogramme'

export const dateDeModifImportante = '08/05/2022'

/**
 * Des parallélogrammes sont tracés, on connaît les 2 côtés et une hauteur.
 * Il faut calculer leurs aires.
 *
 * @author Rémi Angot
 * Ajout de la possibilité de choisir le nombre de questions par Guillaume Valmont le 08/05/2022
 **/
export const uuid = 'd6cd1'
export const ref = '5M10'
export const refs = {
  'fr-fr': ['5M10'],
  'fr-ch': ['9GM1-5']
}
export default function AireDuParallelogramme () {
  Exercice.call(this)
  this.consigne = "Calculer l'aire des parallélogrammes suivants."
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 1
  this.nbCols = 1
  this.nbColsCorr = 1

  /* const cadre = function (p, params) {
    let xmin = 0; let xmax = 0; let ymin = 0; let ymax = 0
    for (let i = 0; i < 4; i++) {
      xmin = Math.min(xmin, p[0].listePoints[i].x - 1)
      ymin = Math.min(ymin, p[0].listePoints[i].y - 1)
      xmax = Math.max(xmax, p[0].listePoints[i].x + 1)
      ymax = Math.max(ymax, p[0].listePoints[i].y + 1)
    }
    params.xmin = xmin
    params.xmax = xmax
    params.ymin = ymin
    params.ymax = ymax
    return params
  } */

  this.nouvelleVersion = function () {
    this.listeCorrections = [] // Liste de questions corrigées
    this.listeQuestions = []
    this.autoCorrection = []
    if (this.nbQuestions === 1) this.consigne = "Calculer l'aire du parallélogramme suivant."
    const typeQuestionsDisponibles = ['type1', 'type2', 'type3'] // On créé 3 types de questions
    const nom = creerNomDePolygone(this.nbQuestions * 4, 'QD')

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, c, h, A, B, P, C, I, H, s, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      texteCorr = `Dans chaque parallélogramme, le segment en pointillés est ${texteEnCouleurEtGras('perpendiculaire', 'blue')} à deux côtés opposés, c'est donc une ${texteEnCouleurEtGras('hauteur', 'blue')}.<br>`
      texteCorr += `Pour obtenir l'aire, il faut multiplier cette ${texteEnCouleurEtGras('hauteur', 'blue')} par la longueur de la ${texteEnCouleurEtGras('base', 'blue')} correspondante.`
      switch (listeTypeQuestions[i]) {
        case 'type1':
          c = randint(3, 7)
          h = randint(3, 5)
          A = point(0, 0, nom[i * 4])
          B = pointAdistance(A, c, randint(-20, 20), nom[i * 4 + 1])
          P = parallelogramme2points1hauteur(nom.slice(i * 4, i * 4 + 4), A, B, h)
          I = milieu(A, B)
          H = projectionOrtho(I, droite(P[0].listePoints[3], P[0].listePoints[2]))
          s = segment(I, H)
          s.pointilles = 2
          texteCorr += `<br>$\\mathcal{A}_{${nom.slice(i * 4, i * 4 + 4)}}=${c}~\\text{cm}\\times  ${h}~\\text{cm}=${c * h}~\\text{cm}^2$`
          break
        case 'type2':
          c = randint(3, 7)
          h = randint(3, 7)
          A = point(0, 0)
          B = pointAdistance(A, c, randint(-20, 20), nom[i * 4 + 1])
          P = parallelogramme2points1hauteur(nom.slice(i * 4, i * 4 + 4), A, B, h)
          I = milieu(A, B)
          H = projectionOrtho(I, droite(P[0].listePoints[3], P[0].listePoints[2]))
          s = segment(I, H)
          s.pointilles = 2
          texteCorr += `<br>$\\mathcal{A}_{${nom.slice(i * 4, i * 4 + 4)}}=${c}~\\text{cm}\\times  ${h}~\\text{cm}=${c * h}~\\text{cm}^2$`
          break
        case 'type3':
          c = randint(3, 10)
          h = randint(3, 5)
          A = point(0, 0)
          B = pointAdistance(A, c, randint(-20, 20), nom[i * 4 + 1])
          P = parallelogramme2points1hauteur(nom.slice(i * 4, i * 4 + 4), A, B, h)
          I = milieu(A, B)
          H = projectionOrtho(I, droite(P[0].listePoints[3], P[0].listePoints[2]))
          s = segment(I, H)
          s.pointilles = 2
          texteCorr += `<br>$\\mathcal{A}_{${nom.slice(i * 4, i * 4 + 4)}}=${c}~\\text{cm}\\times  ${h}~\\text{cm}=${c * h}~\\text{cm}^2$`
          break
      }
      C = P[0].listePoints[2]
      const D = P[0].listePoints[3]

      const objets = [P[0], P[1], afficheLongueurSegment(B, A), afficheLongueurSegment(C, B), afficheLongueurSegment(I, H), s, codageAngleDroit(B, I, H), codageAngleDroit(D, H, I)]
      texte = mathalea2d(Object.assign({}, fixeBordures(objets)), objets)

      // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
      const textCorrSplit = texteCorr.split('=')
      let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
      aRemplacer = aRemplacer.replace('$', '').replace('<br>', '')

      texteCorr = ''
      for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
        texteCorr += textCorrSplit[ee] + '='
      }
      texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`
      // Fin de cette uniformisation

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, c, h, A, B, P, C, I, H, s)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
