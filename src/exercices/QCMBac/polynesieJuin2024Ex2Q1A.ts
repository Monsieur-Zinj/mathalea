import qcmCamExport from '../../lib/amc/qcmCam'
import { propositionsQcm } from '../../lib/interactif/qcm'
import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { premierAvec } from '../../lib/outils/primalite'
import { fraction } from '../../modules/fractions'
import { randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const uuid = 'PJE2Q1A'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 */
class PolynesieJuin2024Ex2Q1 extends Exercice {
  constructor () {
    super()
    // Il n'est pas prévu d'avoir plus d'une question car ceci est prévu pour un seul énoncé statique à la base même si on pourra changer les valeurs et prévoir une aléatoirisation
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.besoinFormulaireCaseACocher = ['version originale(si cochée)/version aléatoire', true]
    this.spacing = 1 // à adapter selon le contenu de l'énoncé
    this.spacingCorr = 3 // idem pour la correction
  }

  nouvelleVersion (): void {
    // Ici, on définit les variables de l'exo (soit celle de l'énoncé original, soit des valeurs choisies aléatoirement... si on a le temps de le faire bien sûr)
    const originale = this.sup
    const a = originale ? -3 : randint(-5, 5, [1, 0, -1])
    const b = originale ? 7 : premierAvec(Math.abs(a), [], false) * choice([-1, 1])
    const c = originale ? 1 : randint(1, 3) * choice([-1, 1])
    const alpha = fraction(b, -a).simplifie()
    const K = alpha.oppose().ajouteEntier(c).simplifie().texFSD
    const fauxK = alpha.ajouteEntier(c).oppose().simplifie().texFSD
    const texAlpha = alpha.ecritureAlgebrique
    const texMoinsAlpha = alpha.oppose().ecritureAlgebrique
    // Le texte récupéré avant le bloc des réponses (il ne faut pas oublier de doubler les \ du latex et de vérifier que les commandes latex sont supportées par Katex)
    // Note, avec la définition conditionnelle de a,b et c ci-dessus, cette version fait le job pour les deux cas (original ou aléatoire)
    let texte = `  La solution $f$ de l'équation différentielle $y^{\\prime}=${String(a)}y${ecritureAlgebrique(b)}$ telle que $f(0) =${String(c)}$ est la fonction définie sur $\\R$ par :<br>`

    this.autoCorrection[0] = {}

    // Ajouter éventuellement des options pour la mise en forme du qcm (ordered, vertical par exemple)
    // this.autoCorrection[0].options = {vertical: true, ordered: false}
    // Ici, on colle les différentes réponses prise dans le latex en remplaçant les constantes originales par les valeurs issus de l'aléatoirisation et on renseigne le statut (bonne réponse = true)
    this.autoCorrection[0].propositions = [
      {
        texte: `$f(x) = \\mathrm{e}^{${String(a)}x}$`,
        statut: false
      },
      {
        texte: `$f(x) = ${K} \\mathrm{e}^{${String(a)}x} ${texAlpha}$`,
        statut: true
      },
      {
        texte: `$f(x) = \\mathrm{e}^{${String(a)}x} ${texAlpha}$`,
        statut: false
      },
      {
        texte: `$f(x) = ${fauxK} \\mathrm{e}^{${String(a)}x} ${texMoinsAlpha}$`,
        statut: false
      }
    ]

    const monQcm = propositionsQcm(this, 0)
    texte += monQcm.texte

    // Ici on a introduit dans le latex d'origine les éléments qui dépendent de l'aléatoire
    const texteCorr = `${monQcm.texteCorr}<br>L'équation différentielle $y' = ${String(a)}y$ a pour solutions les fonctions $x \\longmapsto f(x) = K \\mathrm{e}^{${String(a)}x}$, avec $K \\in \\R$.<br>
    La fonction $x \\longmapsto \\alpha$, avec $\\alpha \\in \\R$ est solution de l'équation différentielle $y' = ${String(a)}y ${ecritureAlgebrique(b)}$ si et seulement si $y' = 0 = ${String(a)}\\alpha ${ecritureAlgebrique(b)}\\iff ${String(-a)}\\alpha = ${String(b)} \\iff \\alpha = ${alpha.texFSD}$.<br>
    On sait qu'alors les solutions de l'équation différentielle $y' = ${String(a)}y ${ecritureAlgebrique(b)}$ sont les fonctions $x \\longmapsto K \\mathrm{e}^{${String(a)}x} ${texAlpha}$.<br>
    En particulier la fonction $f$ solution telle que $f(0) = ${String(c)} \\iff K ${texAlpha} = ${String(c)} \\iff K = ${K}$.<br>
    La seule solution est donc la fonction définie par $f(x) = ${K} \\mathrm{e}^{${String(a)}x} ${texAlpha}$ <br>`
    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
  }

  // Une fonction pour récupérer le texte au format qcmCam... usage : exercice.qcmCamExport()
  qcmCamExport (): string {
    return qcmCamExport(this)
  }
}
export default PolynesieJuin2024Ex2Q1
