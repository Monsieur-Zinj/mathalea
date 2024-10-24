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
 * Il utilise la classe ExerciceQcmA qui définit les contours de l'exo (avec une version aléatoire)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 * Il est interactif et dispose d'un export AMC d'office
 */
class PolynesieJuin2024Ex2Q1 extends ExerciceQcmA {
  constructor () {
    super()
    // Ligne à décommenter en cas de changement dans les options du qcm (ici, valeurs par défaut)
    // this.options = {vertical: false, ordered: false}

    // Ci-dessous, les propriétés à renseigner pour créer un nouvel exo
    this.enonce = 'La solution $f$ de l\'équation différentielle $y^{\\prime}=-3y+7$ telle que $f(0) =1$ est la fonction définie sur $\\R$ par :<br>'
    this.correction = `L'équation différentielle $y' = - 3y$ a pour solutions les fonctions $x \\longmapsto f(x) = K \\mathrm{e}^{- 3x}$, avec $K \\in \\R$.<br>
    La fonction $x \\longmapsto \\alpha$, avec $\\alpha \\in \\R$ est solution de l'équation différentielle $y' = - 3y + 7$ si et seulement si $y' = 0 = - 3\\alpha + 7 \\iff 3\\alpha = 7 \\iff \\alpha = \\dfrac73$.<br>
    On sait qu'alors les solutions de l'équation différentielle $y' = - 3y + 7$ sont les fonctions $x \\longmapsto K \\mathrm{e}^{- 3x} + \\dfrac73$.<br>
    En particulier la fonction $f$ solution telle que $f(0) = 1 \\iff K + \\dfrac73 = 1 \\iff K = - \\dfrac43$.<br>
    La seule solution est donc la fonction définie par $f(x) = - \\dfrac43 \\mathrm{e}^{-3x} + \\dfrac73$ <br>`
    this.reponses = [
      '$f(x) = \\mathrm{e}^{-3x}$',
      '$f(x) = - \\dfrac43 \\mathrm{e}^{-3x} + \\dfrac73$',
      '$f(x) = \\mathrm{e}^{-3x} + \\dfrac73$',
      '$f(x) = - \\dfrac{10}{3} \\mathrm{e}^{-3x} - \\dfrac73$'
    ]
    // ici, c'est la réponse B qui est bonne (ordre identique pour la version aléatoire impérativement vu qu'on n'a qu'une propriété pour les 2 versions)
    this.bonneReponse = 1

    // Partie aléatoire (à supprimer si l'exo n'a pas de version aléatoire, à remplacer par le code nécessaire du nouvel exo si version aléatoire)
    const originale = this.sup
    const a = originale ? -3 : randint(-5, 5, [1, 0, -1])
    const b = originale ? 7 : premierAvec(Math.abs(a), [], false) * choice([-1, 1])
    const c = originale ? 1 : randint(1, 3) * choice([-1, 1])
    const alpha = fraction(b, -a).simplifie()
    const K = alpha.oppose().ajouteEntier(c).simplifie().texFSD
    const fauxK = alpha.ajouteEntier(c).oppose().simplifie().texFSD
    const texAlpha = alpha.ecritureAlgebrique
    const texMoinsAlpha = alpha.oppose().ecritureAlgebrique
    this.enonceA = `La solution $f$ de l'équation différentielle $y^{\\prime}=${String(a)}y${ecritureAlgebrique(b)}$ telle que $f(0) =${String(c)}$ est la fonction définie sur $\\R$ par :<br>`
    this.correctionA = `L'équation différentielle $y' = ${String(a)}y$ a pour solutions les fonctions $x \\longmapsto f(x) = K \\mathrm{e}^{${String(a)}x}$, avec $K \\in \\R$.<br>
    La fonction $x \\longmapsto \\alpha$, avec $\\alpha \\in \\R$ est solution de l'équation différentielle $y' = ${String(a)}y ${ecritureAlgebrique(b)}$ si et seulement si $y' = 0 = ${String(a)}\\alpha ${ecritureAlgebrique(b)}\\iff ${String(-a)}\\alpha = ${String(b)} \\iff \\alpha = ${alpha.texFSD}$.<br>
    On sait qu'alors les solutions de l'équation différentielle $y' = ${String(a)}y ${ecritureAlgebrique(b)}$ sont les fonctions $x \\longmapsto K \\mathrm{e}^{${String(a)}x} ${texAlpha}$.<br>
    En particulier la fonction $f$ solution telle que $f(0) = ${String(c)} \\iff K ${texAlpha} = ${String(c)} \\iff K = ${K}$.<br>
    La seule solution est donc la fonction définie par $f(x) = ${K} \\mathrm{e}^{${String(a)}x} ${texAlpha}$ <br>`
    this.reponsesA = [
      `$f(x) = \\mathrm{e}^{${String(a)}x}$`,
      `$f(x) = ${K} \\mathrm{e}^{${String(a)}x} ${texAlpha}$`,
      `$f(x) = \\mathrm{e}^{${String(a)}x} ${texAlpha}$`,
       `$f(x) = ${fauxK} \\mathrm{e}^{${String(a)}x} ${texMoinsAlpha}$`
    ]
    // fin de la partie concernant la version aléatoire (à supprimer si pas d'aléatoire)
  }
}
export default PolynesieJuin2024Ex2Q1
