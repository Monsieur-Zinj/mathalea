import { droite } from '../../lib/2d/droites'
import { point } from '../../lib/2d/points'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { latex2d } from '../../lib/2d/textes'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '1c2db'
export const refs = {
  'fr-fr': ['3QCMF4-4'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM Lecture graphique d\'antécédent (issu du brevet 202 Métropole)'
export const dateDePublication = '28/10/2024'

export default class MetropoleJuin24Exo4Q4 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$0$',
      '$3$',
      '$-3$'
    ]
    this.enonce = 'Quel est l\'antécédent de 3 par la fonction $f$ ?'
    const theRepere = new RepereBuilder({ xMin: -1, xMax: 4, yMin: -3.5, yMax: 4 }).setGrille({ grilleX: { dx: 1, xMin: -1, xMax: 4 }, grilleY: { yMin: -3, yMax: 4, dy: 1 } }).buildStandard().objets
    const cF = droite(point(0, 3), point(1, 1))
    cF.color = colorToLatexOrHTML('blue')
    const labelF = latex2d('\\mathcal{C_F}', 1.5, 1.7, { color: 'blue' })
    const objets = [...theRepere, cF, labelF]
    this.enonce += mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
    this.correction = `L'antécédent de 3 est $${miseEnEvidence('0')}$, on note $f(0) = 3$.`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
