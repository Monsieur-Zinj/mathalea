import { codageAngle } from '../../lib/2d/angles.js'
import { point, pointAdistance, tracePoint } from '../../lib/2d/points.js'
import { demiDroite } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPoint } from '../../lib/2d/textes.js'
import { rotation } from '../../lib/2d/transformations.js'
import { triangle2points1angle1longueur } from '../../lib/2d/triangle.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { degCos, degSin } from '../../lib/mathFonctions/trigo.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice'

export const interactifReady = true
export const interactifType = 'qcm'
export const amcType = 'qcmMono'
export const amcReady = true

export const titre = 'Reconnaître un angle particulier'

export const dateDePublication = '03/12/2022'

/**
 * Reconnaître un angle nul, aigu, droit, obtus, plat
 * @author Guillaume Valmont
 * 6G22-2
 */
export const uuid = 'fe08e'
export const ref = '6G22-2'
export const refs = {
  'fr-fr': ['6G22-2'],
  'fr-ch': []
}
export default class ReconnaitreUnAngleParticulier extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.correctionDetailleeDisponible = true
    this.nbQuestions = 4
    this.nbColsCorr = 2
    this.besoinFormulaireCaseACocher = ['Points confondus dans le cas des angles nuls']
    this.sup = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typeQuestionsDisponibles = ['nul', 'aigu', 'droit', 'obtus', 'plat']
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, triangle, explications, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const objets2d = []
      const indiceNomA = randint(1, 26)
      const indiceNomB = randint(1, 26, [indiceNomA])
      const indiceNomC = randint(1, 26, [indiceNomA, indiceNomB])
      const distanceAB = 3
      const distanceCB = this.sup ? 3 : 4
      const A = point(0, 0, lettreDepuisChiffre(indiceNomA))
      let B = pointAdistance(A, distanceAB, lettreDepuisChiffre(indiceNomB))
      switch (listeTypeQuestions[i]) {
        case 'nul':
          triangle = triangle2points1angle1longueur(B, A, 0, distanceCB, -1)
          explications = 'Un angle nul est un angle dont la mesure est égale à 0°.'
          break
        case 'aigu':
          triangle = triangle2points1angle1longueur(B, A, randint(10, 80), distanceCB, -1)
          explications = 'Un angle aigu est un angle dont la mesure est comprise entre 0° et 90°.'
          break
        case 'droit':
          triangle = triangle2points1angle1longueur(B, A, 90, distanceCB, -1)
          explications = 'Un angle nul est un angle dont la mesure est égale à 0°.'
          break
        case 'obtus':
          B = point(A.x + distanceAB * degCos(randint(-30, 30)), A.y + distanceAB * degSin(randint(-30, 30)), lettreDepuisChiffre(indiceNomB))
          triangle = triangle2points1angle1longueur(B, A, randint(100, 170), distanceCB, -1)
          explications = 'Un angle nul est un angle dont la mesure est égale à 0°.'
          break
        case 'plat':
          B = point(A.x + distanceAB * degCos(randint(-30, 30)), A.y + distanceAB * degSin(randint(-30, 30)), lettreDepuisChiffre(indiceNomB))
          triangle = triangle2points1angle1longueur(B, A, 179.99, distanceCB, -1)
          explications = 'Un angle aigu est un angle dont la mesure est comprise entre 0° et 90°.'
          break
      }
      const C = triangle.listePoints[2]
      C.nom = lettreDepuisChiffre(indiceNomC)
      const points = [A, B, C]
      const angle = codageAngle(A, B, C, listeTypeQuestions[i] === 'droit' ? 1 : 2)
      const demiDroiteBA = demiDroite(B, A)
      const demiDroiteCA = demiDroite(B, C)
      objets2d.push(tracePoint(...points), texteParPoint(A.nom, rotation(A, B, 10)), texteParPoint(C.nom, rotation(C, B, -10)), texteParPoint(B.nom, rotation(B, A, -10)), angle, demiDroiteBA, demiDroiteCA)
      // On affiche le cadre mathalea2d
      const pointsX = []
      const pointsY = []
      for (const point of points) {
        pointsX.push(point.x)
        pointsY.push(point.y)
      }
      const xmin = Math.min(...pointsX) - 2.2
      const xmax = Math.max(...pointsX) + 2.2
      const ymin = Math.min(...pointsY) - 2.2
      const ymax = Math.max(...pointsY) + 2.2
      const parametres2d = { xmin, ymin, xmax, ymax, pixelsParCm: 20, scale: 0.4 }
      const enonceFigure = 'Dans la figure ci-dessous :<br>' + mathalea2d(parametres2d, objets2d) + '<br>'
      texte = ''
      texteCorr = ''
      // On construit les questions

      const questionReponse =
        {
          question: enonceFigure + '$\\widehat{' + A.nom + B.nom + C.nom + '}$ est un angle :',
          propositions: ['nul', 'aigu', 'droit', 'obtus', 'plat'],
          reponses: [listeTypeQuestions[i]],
          explications
        }
      const propositions = []
      for (const proposition of questionReponse.propositions) {
        let statut = false
        for (const reponse of questionReponse.reponses) {
          if (proposition === reponse) statut = true
        }
        propositions.push({
          texte: proposition,
          statut,
          feedback: ''
        })
      }
      this.autoCorrection[i] = {
        enonce: questionReponse.question,
        options: { ordered: true },
        propositions
      }
      const monQcm = propositionsQcm(this, i)
      texte += context.isAmc ? '' : questionReponse.question + '<br>'
      texte += monQcm.texte
      texteCorr += context.isAmc ? '' : questionReponse.question + '<br>'
      texteCorr += monQcm.texteCorr
      this.correctionDetaillee ? texteCorr += questionReponse.explications + '<br><br>' : texteCorr += '<br>'
      if (this.questionJamaisPosee(i, ...pointsX, ...pointsY, listeTypeQuestions[i])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
