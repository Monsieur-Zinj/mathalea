import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import { randint } from '../../modules/outils'
import { nombreElementsDifferents } from '../ExerciceQcm'
import ExerciceQcmA from '../ExerciceQcmA'
export const uuid = '67e1a'
export const refs = {
  'fr-fr': ['3QCMN-8'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM équation produit nul (issu du brevet 2013 Centres étrangers)'
export const dateDePublication = '30/10/2024'
export default class EtrangersJuin13Exo1Q1 extends ExerciceQcmA {
  private appliquerLesValeurs (a: number, b: number, c: number): void {
    const s1 = -a
    const s2 = c / b
    this.reponses = [
      `$${String(s1)}$ et $${texNombre(s2, 2)}$`,
      `$${String(-s1)}$ et $${texNombre(-s2, 2)}$`,
      `$${String(s1)}$ et $${String(c - b)}$`
    ]
    this.enonce = `Les solutions de l'équation  $(x+${String(a)})(${String(b)}x-${String(c)})$ ?`
    this.correction = 'Un produit est nul quand l\'un de ses facteurs est nul.<br>'
    this.correction += `Donc, l'équation $(x+${String(a)})=0$ a pour solution $x=${String(s1)}$.<br>`
    this.correction += `Et l'équation $(${String(b)}x-${String(c)})=0$ qui est équivalente a $(${String(b)}x=${String(c)})$ dont la solution est $x=${texNombre(s2, 2)}$.<br>`
    this.correction += `Donc, l'équation $(x+${String(a)})(${String(b)}x-${String(c)})=0$ a pour solutions $x=${miseEnEvidence(`${String(s1)} \\text{ et } ${texNombre(s2, 2)}`)}$.`
  }

  versionOriginale: () => void = () => {
    this.appliquerLesValeurs(7, 2, 7)
  }

  versionAleatoire: () => void = () => {
    const n = 3
    do {
      const a = randint(2, 9)
      const c = randint(5, 9)
      const b = choice([2, 4])
      this.appliquerLesValeurs(a, b, c)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  constructor () {
    super()
    this.versionAleatoire()
  }
}
