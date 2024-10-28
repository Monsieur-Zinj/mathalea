import { qcmCamExport } from '../lib/amc/qcmCam'
import { propositionsQcm } from '../lib/interactif/qcm'
import { texteEnCouleurEtGras } from '../lib/outils/embellissements'
import { context } from '../modules/context'
import Exercice from './Exercice'

// export const uuid = 'UUID à modifier'
// export const titre = 'Titre de l'exercice à modifier'
// export const refs = [{'fr-fr',['ref française à renseigner']},{'fr-ch', ['ref suisse à renseigner]}]

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'

export const nombreElementsDifferents = (liste: string[]) => {
  const elements = new Set(liste)
  return elements.size
}

function ajouteLettres (texte: string) {
  const separateur = context.isHtml ? '<label' : !context.isAmc ? '\\square' : '\\AMCBox'
  // Pour AMC ça ne marche pas parce que texte est vide : c'est AMC qui crée le qcm... je ne sais pas comment faire pour le moment
  // Mais ça reste compatible...
  const chunks = texte.split(separateur)
  let texteAvecLettres = chunks[0]
  const lettres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  for (let i = 0; i < chunks.length - 1; i++) {
    texteAvecLettres += `${lettres[i]}:${separateur}${chunks[i + 1]}`
  }
  return texteAvecLettres
}

function retrouveLaBonneReponse (texte: string) {
  const separateur = context.isHtml ? '<label' : !context.isAmc ? '\\square' : '\\AMCBox'
  const matcher = context.isHtml ? 'checked' : '\\blacksquare'
  const chunks = texte.split(separateur)
  for (let i = 0; i < chunks.length - 1; i++) {
    if (chunks[i].includes(matcher)) {
      return i
    }
  }
  return -1
}

// class à utiliser pour fabriquer des Qcms sans aléatoirisation (en cas d'aléatoirisation, on utilisera ExerciceQcmA à la place)
export default class ExerciceQcm extends Exercice {
  enonce!: string
  reponses!: string[]
  options: {vertical?: boolean, ordered: boolean, lastchoice?: number}
  qcmAleatoire: boolean
  versionAleatoire?: ()=>void
  versionOriginale:()=>void = () => {
    // Le texte récupéré avant le bloc des réponses (il ne faut pas oublier de doubler les \ du latex et de vérifier que les commandes latex sont supportées par Katex)
    this.enonce = 'Enoncé de la question'
    // Ici, on colle les différentes réponses prise dans le latex : attention !!! mettre la bonne en premier (elles seront brassées par propositionsQcm)
    this.reponses = [
      'réponse A', // La bonne réponse !
      'réponse B',
      'réponse C',
      'réponse D'
    ]
    this.correction = 'La correction'
  }

  constructor () {
    super()
    // Il n'est pas prévu d'avoir plus d'une question car ceci est prévu pour un seul énoncé statique à la base même si on pourra changer les valeurs et prévoir une aléatoirisation
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.spacing = 1 // à adapter selon le contenu de l'énoncé
    this.spacingCorr = 3 // idem pour la correction
    // Les options pour le qcm à modifier éventuellement (vertical à true pour les longues réponses par exemple)
    this.options = { vertical: false, ordered: false }
    this.qcmAleatoire = false
    this.versionOriginale()
  }

  nouvelleVersion () {
    if (this.qcmAleatoire && this.versionAleatoire != null) {
      if (this.sup) this.versionOriginale()
      else this.versionAleatoire()
    } // il n'y a pas de else car si qcmAleatoire est faux, on reste sur la version originale qui est définie depuis le constructeur
    let texte = this.enonce
    this.autoCorrection[0] = {}
    if (this.options != null) {
      this.autoCorrection[0].options = this.options
    }

    this.autoCorrection[0].propositions = []
    for (let i = 0; i < this.reponses.length; i++) {
      this.autoCorrection[0].propositions.push({
        texte: this.reponses[i],
        statut: i === 0
      })
    }
    const lettres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].slice(0, this.reponses.length)

    const monQcm = propositionsQcm(this, 0)
    texte += `<br>${ajouteLettres(monQcm.texte)}`

    const laBonneLettre = lettres[retrouveLaBonneReponse(monQcm.texteCorr)]
    // Ici on colle le texte de la correction à partir du latex d'origine (vérifier la compatibilité Katex et doubler les \)s
    const texteCorr = `${this.correction}<br>La bonne réponse est la réponse ${texteEnCouleurEtGras(laBonneLettre)}.`

    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
  }

  // Pour permettre d'exporter tous les qcm pour en faire des séries de questions pour QcmCam. Ne pas y toucher
  qcmCamExport (): string {
    return qcmCamExport(this)
  }
}
