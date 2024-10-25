import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { premierAvec } from '../../lib/outils/primalite'
import { fraction } from '../../modules/fractions'
import { randint } from '../../modules/outils'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = 'PJE2Q1'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il utilise la classe ExerciceQcmA qui définit les contours de l'exo (avec une version aléatoire : voir la méthode aleatoire ci-dessous)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam hérité de ExerciceQcm.
 * Il est interactif et dispose d'un export AMC d'office
 */
class PolynesieJuin2024Ex2Q1 extends ExerciceQcmA {
  constructor () {
    super()
    this.aleatoire()
  }

  aleatoire = () => {
    const a = this.sup ? -3 : randint(-5, 5, [1, 0, -1]) // En premier, ce sont les valeurs originales et en deuxième, les valeurs aléatoires
    const b = this.sup ? 7 : premierAvec(Math.abs(a), [], false) * choice([-1, 1])
    const c = this.sup ? 1 : randint(1, 3) * choice([-1, 1])
    const alpha = fraction(b, -a).simplifie()
    const K = alpha.oppose().ajouteEntier(c).simplifie().texFSD
    const fauxK = alpha.ajouteEntier(c).oppose().simplifie().texFSD
    const texAlpha = alpha.ecritureAlgebrique
    const texMoinsAlpha = alpha.oppose().ecritureAlgebrique
    this.enonce = `La solution $f$ de l'équation différentielle $y^{\\prime}=${String(a)}y${ecritureAlgebrique(b)}$ telle que $f(0) =${String(c)}$ est la fonction définie sur $\\R$ par :<br>`
    this.correction = `L'équation différentielle $y' = ${String(a)}y$ a pour solutions les fonctions $x \\longmapsto f(x) = K \\mathrm{e}^{${String(a)}x}$, avec $K \\in \\R$.<br>
    La fonction $x \\longmapsto \\alpha$, avec $\\alpha \\in \\R$ est solution de l'équation différentielle $y' = ${String(a)}y ${ecritureAlgebrique(b)}$ si et seulement si $y' = 0 = ${String(a)}\\alpha ${ecritureAlgebrique(b)}\\iff ${String(-a)}\\alpha = ${String(b)} \\iff \\alpha = ${alpha.texFSD}$.<br>
    On sait qu'alors les solutions de l'équation différentielle $y' = ${String(a)}y ${ecritureAlgebrique(b)}$ sont les fonctions $x \\longmapsto K \\mathrm{e}^{${String(a)}x} ${texAlpha}$.<br>
    En particulier la fonction $f$ solution telle que $f(0) = ${String(c)} \\iff K ${texAlpha} = ${String(c)} \\iff K = ${K}$.<br>
    La seule solution est donc la fonction définie par $f(x) = ${K} \\mathrm{e}^{${String(a)}x} ${texAlpha}$ <br>`
    this.reponses = [
      `$f(x) = \\mathrm{e}^{${String(a)}x}$`,
      `$f(x) = ${K} \\mathrm{e}^{${String(a)}x} ${texAlpha}$`,
      `$f(x) = \\mathrm{e}^{${String(a)}x} ${texAlpha}$`,
       `$f(x) = ${fauxK} \\mathrm{e}^{${String(a)}x} ${texMoinsAlpha}$`
    ]
    this.bonneReponse = 1
  }
}
export default PolynesieJuin2024Ex2Q1
