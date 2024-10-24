import qcmCamExport from '../lib/amc/qcmCam'
import { propositionsQcm } from '../lib/interactif/qcm'
import Exercice from './Exercice'

// export const uuid = 'UUID à modifier'
// export const titre = 'Titre de l'exercice à modifier'
// export const refs = [{'fr-fr',['ref française à renseigner']},{'fr-ch', ['ref suisse à renseigner]}]

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
// class à utiliser pour fabriquer des Qcms sans aléatoirisation (en cas d'aléatoirisation, on utilisera ExerciceQcmA à la place)
class ExerciceQcm extends Exercice {
  enonce: string
  reponses: string[]
  bonneReponse: number
  correction: string
  reponsesA?: string[]
  enonceA?: string
  correctionA?: string
  options: {vertical?: boolean, ordered: boolean, lastchoice?: number}
  qcmAleatoire: boolean
  constructor () {
    super()
    // Il n'est pas prévu d'avoir plus d'une question car ceci est prévu pour un seul énoncé statique à la base même si on pourra changer les valeurs et prévoir une aléatoirisation
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false

    // #####################################################################
    // #### Les propriétés à modifier dans l'instance se trouvent ici ! ####
    // ####                    Ne pas modifier ce moule !               ####
    // #####################################################################
    this.spacing = 1 // à adapter selon le contenu de l'énoncé
    this.spacingCorr = 3 // idem pour la correction
    // Les options pour le qcm à modifier éventuellement (vertical à true pour les longues réponses par exemple)
    this.options = { vertical: false, ordered: false }
    // Le texte récupéré avant le bloc des réponses (il ne faut pas oublier de doubler les \ du latex et de vérifier que les commandes latex sont supportées par Katex)
    this.enonce = 'Enoncé de la question'
    // Ici, on colle les différentes réponses prise dans le latex et on renseigne le statut (bonne réponse = true)
    this.reponses = [
      'réponse A',
      'réponse B',
      'réponse C',
      'réponse D'
    ]

    this.correction = 'La correction'
    this.bonneReponse = 0 // index de la bonne réponse dans l'array this.reponses
    this.qcmAleatoire = false

    // ####################################################
    // #### à partir d'ici, il n'y a rien à modifier ! ####
    // ####################################################
  }

  nouvelleVersion () {
    let texte = this.enonce
    this.autoCorrection[0] = {}
    if (this.options != null) {
      this.autoCorrection[0].options = this.options
    }
    const originale = this.qcmAleatoire ? Boolean(this.sup) : true
    this.autoCorrection[0].propositions = []
    if (this.enonceA != null) {
      for (let i = 0; i < this.reponses.length; i++) {
        if (this.qcmAleatoire && this.reponsesA != null) {
          this.autoCorrection[0].propositions.push({
            texte: originale ? this.reponses[i] : this.reponsesA[i],
            statut: this.bonneReponse === i
          })
        }
      }
    } else {
      for (let i = 0; i < this.reponses.length; i++) {
        this.autoCorrection[0].propositions.push({
          texte: this.reponses[i],
          statut: this.bonneReponse === i
        })
      }
    }

    const monQcm = propositionsQcm(this, 0)
    texte += monQcm.texte

    // Ici on colle le texte de la correction à partir du latex d'origine (vérifier la compatibilité Katex et doubler les \)s
    const texteCorr = `${monQcm.texteCorr}${originale ? this.correction : this.correctionA}`

    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
  }

  // Pour permettre d'exporter tous les qcm pour en faire des séries de questions pour QcmCam. Ne pas y toucher
  qcmCamExport (): string {
    return qcmCamExport(this)
  }
}

export default ExerciceQcm
