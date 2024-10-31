import { droite } from '../../lib/2d/droites'
import { point } from '../../lib/2d/points'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { latex2d } from '../../lib/2d/textes'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import { nombreElementsDifferents } from '../ExerciceQcm'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = '1c2db'
export const refs = {
  'fr-fr': ['3QCMF-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM Lecture graphique d\'antécédent (issu du brevet 202 Métropole)'
export const dateDePublication = '28/10/2024'

export default class MetropoleJuin24Exo4Q4 extends ExerciceQcmA {
  private appliquerLesValeurs (a: number): void {
    this.reponses = [
      '$0$',
      `$${String(a)}$`,
      `$${String(-a)}$`
    ]
    const xMax = Math.abs(a) + 1
    const yMin = -Math.abs(a) - 0.5
    const yMax = Math.abs(a) + 1
    this.enonce = 'Quel est l\'antécédent de 3 par la fonction $f$ ?'
    const theRepere = new RepereBuilder({ xMin: -1, xMax, yMin, yMax }).setGrille({ grilleX: { dx: 1, xMin: -1, xMax }, grilleY: { yMin: yMin + 0.5, yMax, dy: 1 } }).buildStandard().objets
    const cF = droite(point(0, a), point(Math.abs(a), -a))
    cF.color = colorToLatexOrHTML('blue')
    const labelF = latex2d('\\mathcal{C_F}', 1.5, 1.7, { color: 'blue' })
    const objets = [...theRepere, cF, labelF]
    this.enonce += mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets)), objets)
    this.correction = `L'antécédent de ${a} est $${miseEnEvidence('0')}$, on note $f(0) = ${a}$.`
  }

  versionOriginale: () => void = () => {
    this.appliquerLesValeurs(3)
  }

  versionAleatoire: () => void = () => {
    const n = 3
    do {
      const a = choice([2, 4, 5]) * choice([-1, 1])
      this.appliquerLesValeurs(a)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  constructor () {
    super()
    this.versionAleatoire()
  }
}
