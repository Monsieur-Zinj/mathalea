import { codageAngle, codageAngleDroit } from '../../lib/2d/angles'
import { point } from '../../lib/2d/points'
import { polygone } from '../../lib/2d/polygones'
import { labelPoint } from '../../lib/2d/textes'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '4e9ed'
export const refs = {
  'fr-fr': ['3QCM1-6'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM cosinus dans le triangle rectangle (issu du brevet 2023 Métropole)'

export default class MetropoleJuin24Exo4Q3 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$0{,}8$',
      '$0{,}75$',
      '$0{,}6$'
    ]
    this.enonce = 'Dans le triangle ABC rectangle en A ci-contre, qui n\'est pas en vraie grandeur, quelle est la valeur de $\\cos \\alpha$ ?'
    const triangle = polygone([
      point(0, 0, 'A', 'below left'),
      point(0, 3, 'C', 'above left'),
      point(4, 0, 'B', 'below right')
    ])
    const angleDroit = codageAngleDroit(triangle.listePoints[1], triangle.listePoints[0], triangle.listePoints[2])
    const labels = labelPoint(...triangle.listePoints)
    const angleAlpha = codageAngle(triangle.listePoints[0], triangle.listePoints[2], triangle.listePoints[1], 1.5, '', 'black', 1, 1, 'none', 0, false, false, '$\\alpha$')
    const objets = [triangle, labels, angleDroit, angleAlpha]
    this.enonce += mathalea2d(Object.assign({ pixelsParCm: 20, scale: 1 }, fixeBordures(objets)), objets)
    this.correction = `$\\cos\\alpha=\\dfrac{AB}{BC}=\\dfrac45=${miseEnEvidence('0{,}8')}$.`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
