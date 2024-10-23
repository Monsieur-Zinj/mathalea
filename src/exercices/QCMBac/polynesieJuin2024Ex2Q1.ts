import qcmCamExport from '../../lib/amc/qcmCam'
import { propositionsQcm } from '../../lib/interactif/qcm'
import Exercice from '../Exercice'

export const uuid = 'PJE2Q1'
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
    this.spacing = 1 // à adapter selon le contenu de l'énoncé
    this.spacingCorr = 3 // idem pour la correction
  }

  nouvelleVersion (): void {
    // Le texte récupéré avant le bloc des réponses (il ne faut pas oublier de doubler les \ du latex et de vérifier que les commandes latex sont supportées par Katex)
    // la première version est l'originale recopié des annales,
    // Note, avec la définition conditionnelle de a,b et c ci-dessus, la deuxième version fait le job pour les deux cas (mais on ne fera pas toujours une version aléatoire comme ici)
    let texte = '  La solution $f$ de l\'équation différentielle $y^{\\prime}=-3y+7$ telle que $f(0) =1$ est la fonction définie sur $\\R$ par :<br>'

    this.autoCorrection[0] = {}

    // Ajouter éventuellement des options pour la mise en forme du qcm (ordered, vertical par exemple)
    // this.autoCorrection[0].options = {vertical: true, ordered: false}
    // Ici, on colle les différentes réponses prise dans le latex et on renseigne le statut (bonne réponse = true)
    this.autoCorrection[0].propositions = [
      {
        texte: '$f(x) = \\mathrm{e}^{-3x}$',
        statut: false
      },
      {
        texte: '$f(x) = - \\dfrac43 \\mathrm{e}^{-3x} + \\dfrac73$',
        statut: true
      },
      {
        texte: '$f(x) = \\mathrm{e}^{-3x} + \\dfrac73$',
        statut: false
      },
      {
        texte: '$f(x) = - \\dfrac{10}{3} \\mathrm{e}^{-3x} - \\dfrac73$',
        statut: false
      }
    ]

    const monQcm = propositionsQcm(this, 0)
    texte += monQcm.texte

    // Ici on colle le texte de la correction à partir du latex d'origine (vérifier la compatibilité Katex et doubler les \)s
    const texteCorr = `${monQcm.texteCorr}<br>L'équation différentielle $y' = - 3y$ a pour solutions les fonctions $x \\longmapsto f(x) = K \\mathrm{e}^{- 3x}$, avec $K \\in \\R$.<br>
    La fonction $x \\longmapsto \\alpha$, avec $\\alpha \\in \\R$ est solution de l'équation différentielle $y' = - 3y + 7$ si et seulement si $y' = 0 = - 3\\alpha + 7 \\iff 3\\alpha = 7 \\iff \\alpha = \\dfrac73$.<br>
    On sait qu'alors les solutions de l'équation différentielle $y' = - 3y + 7$ sont les fonctions $x \\longmapsto K \\mathrm{e}^{- 3x} + \\dfrac73$.<br>
    En particulier la fonction $f$ solution telle que $f(0) = 1 \\iff K + \\dfrac73 = 1 \\iff K = - \\dfrac43$.<br>
    La seule solution est donc la fonction définie par $f(x) = - \\dfrac43 \\mathrm{e}^{-3x} + \\dfrac73$ <br>`

    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
  }

  // fonctionnalité non encore implémentée dans l'interface : permettre d'exporter tous les qcm pour en faire des séries de questions pour QcmCam.
  // Une fonction pour récupérer le texte au format qcmCam... usage : exercice.qcmCamExport()
  qcmCamExport (): string {
    return qcmCamExport(this)
  }
}
export default PolynesieJuin2024Ex2Q1
