/* eslint-disable @typescript-eslint/no-explicit-any */

import type Grandeur from '../modules/Grandeur'
import { exportedApplyNewSeed, exportedNouvelleVersionWrapper, exportedQuestionJamaisPosee, exportedReinit } from './exerciseMethods'
import type { AutoCorrection } from '../lib/interactif/gestionInteractif'

/**
 *
 *  Classe parente de tous les exercices.
 *
 * @author Rémi Angot
 */
export default class Exercice {
  titre: string
  id?: string
  uuid!: string
  sup: any
  sup2: any
  sup3: any
  sup4: any
  correctionInteractive?: (i: number) => string | string[] | Promise<string | string[]>
  exoCustomResultat?: boolean // Lorsqu'il est à true, correctionInteractive renvoie un tableau de string ce qui permet à une question de rapporter plusieurs points
  duree?: number
  seed?: string
  numeroExercice?: number
  typeExercice?: string
  duration?: number
  boutonAide: boolean | HTMLButtonElement
  consigne: string
  consigneCorrection: string
  introduction: string
  listeQuestions: string[] = []
  listeCorrections: string[] = []
  listeCanReponsesACompleter?: string[] = []
  listeCanEnonces?: string[] = []
  question?: string // Seulement pour les exercices de type simple
  reponse?: string | number | object// Seulement pour les exercices de type simple
  correction?: string // Seulement pour les exercices de type simple
  canOfficielle?: boolean = false
  canEnonce?: string // Seulement pour les exercices de type simple
  canReponseACompleter?: string // Seulement pour les exercices de type simple
  formatChampTexte?: string // Seulement pour les exercices de type simple
  optionsChampTexte?: object // Seulement pour les exercices de type simple
  compare?: ((input: string, goodAnswer: string) => { isOk: boolean, feedback?: string }) | ((input: string, goodAnswer: Grandeur) => { isOk: boolean, feedback?: string }) // Seulement pour les exercices de type simple
  formatInteractif?: string // Options par défaut pour les champs Mathlive (très utile dans les exercices simples)
  contenu?: string
  contenuCorrection?: string
  autoCorrection: AutoCorrection[]
  figures?: Array<{id: string, solution: boolean}>[]
  amcType?: string
  tableauSolutionsDuQcm?: object[]
  spacing: number
  spacingCorr: number
  pasDeVersionLatex: boolean
  listePackages?: string[]
  consigneModifiable: boolean
  nbQuestionsModifiable: boolean
  nbCols: number // Nombre de colonnes pour la sortie LaTeX
  nbColsCorr: number
  nbColsModifiable: boolean
  nbColsCorrModifiable: boolean
  spacingModifiable: boolean
  spacingCorrModifiable: boolean
  listeAvecNumerotation?: boolean
  beamer: boolean
  nbQuestions: number
  pointsParQuestions: number
  correctionDetailleeDisponible: boolean
  correctionDetaillee: boolean
  correctionIsCachee: boolean
  video: string
  interactif: boolean // l'exercice est affiché en mode interactif si `true`
  interactifObligatoire: boolean
  interactifReady: boolean // flag pour indiquer si l'exercice est dispo en interactif ou pas
  interactifType?: string
  besoinFormulaireNumerique: boolean | [titre: string, max: number, tooltip: string] | [titre: string, max: number]
  besoinFormulaireTexte: boolean | [string, string]
  besoinFormulaireCaseACocher: boolean | [string] | [string, boolean]
  besoinFormulaire2Numerique: boolean | [titre: string, max: number, tooltip: string] | [titre: string, max: number]
  besoinFormulaire2Texte: boolean | [string, string]
  besoinFormulaire2CaseACocher: boolean | [string] | [string, boolean]
  besoinFormulaire3Numerique: boolean | [titre: string, max: number, tooltip: string] | [titre: string, max: number]
  besoinFormulaire3Texte: boolean | [string, string]
  besoinFormulaire3CaseACocher: boolean | [string] | [string, boolean]
  besoinFormulaire4Numerique: boolean | [titre: string, max: number, tooltip: string] | [titre: string, max: number]
  besoinFormulaire4Texte: boolean | [string, string]
  besoinFormulaire4CaseACocher: boolean | [string] | [string, boolean]
  mg32Editable: boolean
  listeArguments: string[] // Variable servant à comparer les exercices pour ne pas avoir deux exercices identiques
  examen?: string // Pour les exercices statiques
  mois?: string // Pour les exercices statiques
  annee?: string // Pour les exercices statiques
  lieu?: string // Pour les exercices statiques
  content?: string // Pour les exercices statiques
  contentCorr?: string // Pour les exercices statiques
  comment?: string // Commentaire facultatif de l'auteur de l'exercice
  answers?: { [key: string]: string } // Réponses de l'élève
  isDone?: boolean
  private _html: HTMLElement = document.createElement('div')
  score?: number
  constructor () {
  // ////////////////////////////////////////////////
  // Autour de l'exercice
  // ////////////////////////////////////////////////
    this.titre = '' // Chaîne de caractère sans point à la fin. C'est le titre de l'exercice qui sera affiché avec la référence dans le générateur d'exercices.
    this.boutonAide = false // Bouton en haut à droite des questions permettant d'afficher un pdf, texte, image, vidéo, contenu d'un autre site en "pop-up" via les fonctions modalXXXXXXX de outils.js.
    // Ci-dessous des exemples d'utilisation du this.boutonAide.
    // Noter que pour récupérer le numeroExercice dont il est question, au lieu d'écrire "this.nouvelleVersion = function () {" comme d'habitude, on écrit "this.nouvelleVersion = function (numeroExercice) {".
    // this.boutonAide = modalImage(numeroExercice, urlImage, titre, labelBouton = 'Illustration', icone = 'image')
    // this.boutonAide = modalPdf(numeroExercice, urlPdf, titre='Aide', labelBouton = 'Aide - PDF', icone = 'file pdf')
    // this.boutonAide = modalTexteCourt(numeroExercice, texte, labelBouton = 'Aide', icone = 'info circle')
    // this.boutonAide = modalTexteLong(numeroExercice, titre, texte, labelBouton = 'Aide', icone = 'info circle')
    // this.boutonAide = modalUrl(numeroExercice, url, labelBouton = 'Aide', icone) pour afficher le contenu de url dans un iframe
    // this.boutonAide = modalVideo(numeroExercice, urlVideo, titre, labelBouton, icone)
    // this.boutonAide = modalYoutube(numeroExercice, idYoutube, titre, labelBouton = 'Aide - Vidéo', icone = 'youtube')

    // ///////////////////////////////////////////////
    // Construction de l'exercice
    // ///////////////////////////////////////////////
    this.consigne = '' // Chaîne de caractère qui apparaît en gras au-dessus des questions de préférence à l'infinitif et AVEC point à la fin.
    this.consigneCorrection = '' // Chaîne de caractère en général vide qui apparaît au-dessus des corrections.
    this.introduction = '' // Texte qui n'est pas forcément en gras et qui apparaît entre la consigne et les questions.
    this.listeQuestions = [] // Liste de chaînes de caractères avec chacune correspondant à une question. Chaque question est définie par la méthode this.nouvelleVersion puis `listeDeQuestionToContenu(this)` mettra en forme `this.contenu` et `this.contenuCorrection` suivant `context` (sortie HTML ?...)
    this.listeCorrections = [] // Idem avec la correction.
    this.contenu = '' // Chaîne de caractères avec tout l'énoncé de l'exercice construit à partir de `this.listeQuestions` suivant le `context`
    this.contenuCorrection = '' // Idem avec la correction
    this.autoCorrection = [] // Liste des objets par question pour correction interactive || export AMC.
    this.tableauSolutionsDuQcm = [] // Pour sauvegarder les solutions des QCM.

    // ///////////////////////////////////////////////
    // Mise en forme de l'exercice
    // ///////////////////////////////////////////////
    this.spacing = 1 // Interligne des questions
    this.spacingCorr = 1 // Interligne des réponses

    // ////////////////////////////////////////////
    // Gestion de la sortie LateX
    // ////////////////////////////////////////////
    this.pasDeVersionLatex = false // booléen qui indique qu'une sortie LateX est impossible.
    this.consigneModifiable = true // booléen pour déterminer si la consigne est modifiable en ligne dans la sortie LaTeX.
    this.nbQuestionsModifiable = true // booléen pour déterminer si le nombre de questions est modifiable en ligne.
    this.nbCols = 1 // Nombre de colonnes pour la sortie LaTeX des questions (environnement multicols).
    this.nbColsCorr = 1 // Nombre de colonnes pour la sortie LaTeX des réponses (environnement multicols).
    this.nbColsModifiable = true // booléen pour déterminer si le nombre de colonnes est modifiable en ligne dans la sortie LaTeX.
    this.nbColsCorrModifiable = true // booléen pour déterminer si le nombre de colonnes de la correction est modifiable en ligne dans la sortie LaTeX.
    this.spacingModifiable = true // booléen pour déterminer si l'espacement est modifiable en ligne dans la sortie LaTeX.
    this.spacingCorrModifiable = true // booléen pour déterminer si l'espacement est modifiable en ligne dans la sortie LaTeX.
    // this.vspace = -1 //Ajoute un \vspace{-1cm} avant l'énoncé ce qui peut être pratique pour des exercices avec des figures.

    // ////////////////////////////////////////////
    // Gestion de la sortie autre que LateX
    // ////////////////////////////////////////////
    this.beamer = false // booléen pour savoir si la sortie devra être un diaporama beamer

    // ////////////////////////////////////////////
    // Paramètres
    // ////////////////////////////////////////////
    this.nbQuestions = 10 // Nombre de questions par défaut (récupéré dans l'url avec le paramètre `,n=`)
    this.pointsParQuestions = 1 // Pour définir la note par défaut d'un exercice dans sa sortie Moodle
    this.correctionDetailleeDisponible = false // booléen qui indique si une correction détaillée est disponible.
    this.correctionDetaillee = true // booléen indiquant si la correction détaillée doit être affiché par défaut (récupéré dans l'url avec le paramètre `,cd=`).
    this.correctionIsCachee = false // pour cacher une correction
    this.video = '' // Chaine de caractère pour un complément numérique (id Youtube, url, code iframe...).
    // Interactivité
    this.interactif = false // Exercice sans saisie utilisateur par défaut.
    this.interactifReady = false // Exercice sans saisie utilisateur par défaut.
    this.interactifObligatoire = false // Certains exercices sont uniquement des QCM et n'ont pas de version non interactive.
    // Ajoute un formulaire de paramétrage par l'utilisateur récupéré via this.sup ou dans le paramètre d'url ',s='
    this.besoinFormulaireNumerique = false // Sinon this.besoinFormulaireNumerique = [texte, max, tooltip facultatif]
    this.besoinFormulaireTexte = false // Sinon this.besoinFormulaireTexte = [texte, tooltip]
    this.besoinFormulaireCaseACocher = false // Sinon this.besoinFormulaireCaseACocher = [texte]
    // Ajoute un formulaire de paramétrage par l'utilisateur récupéré via this.sup2 ou dans le paramètre d'url ',s2='
    this.besoinFormulaire2Numerique = false // Sinon this.besoinFormulaire2Numerique = [texte, max, tooltip facultatif]
    this.besoinFormulaire2Texte = false // Sinon this.besoinFormulaire2Texte = [texte, tooltip]
    this.besoinFormulaire2CaseACocher = false // Sinon this.besoinFormulaire2CaseACocher = [texte]
    // Ajoute un formulaire de paramétrage par l'utilisateur récupéré via this.sup3 ou dans le paramètre d'url ',s3='
    this.besoinFormulaire3Numerique = false // Sinon this.besoinFormulaire3Numerique = [texte, max, tooltip facultatif]
    this.besoinFormulaire3Texte = false // Sinon this.besoinFormulaire3Texte = [texte, tooltip]
    this.besoinFormulaire3CaseACocher = false // Sinon this.besoinFormulaire3CaseACocher = [texte]
    // Ajoute un formulaire de paramétrage par l'utilisateur récupéré via this.sup4 ou dans le paramètre d'url ',s4='
    this.besoinFormulaire4Numerique = false // Sinon this.besoinFormulaire4Numerique = [texte, max, tooltip facultatif]
    this.besoinFormulaire4Texte = false // Sinon this.besoinFormulaire4Texte = [texte, tooltip]
    this.besoinFormulaire4CaseACocher = false // Sinon this.besoinFormulaire4CaseACocher = [texte]

    // ///////////////////////////////////////////////
    // Exercice avec des dépendances particulières
    // ///////////////////////////////////////////////
    // this.typeExercice = 'MG32' // Pour charger MathGraph32.
    this.mg32Editable = false // Les figures MG32 ne sont pas interactives par défaut.
    // this.dimensionsDivMg32 = [500, 450] // Dimensions du SVG créé par MathGraph32.

    // this.typeExercice = 'Scratch' // Pour charger Scratchblocks.
    // this.typeExercice = 'IEP' // Pour charger InstrumEnPoche.
    // this.typeExercice = 'dnb' // Ce n’est pas un exercice aléatoire il est traité différemment. Les exercices DNB sont des images pour la sortie Html et du code LaTeX statique pour la sortie latex.
    // this.typeExercice = 'XCas' // Pour charger le JavaScript de XCas qui provient de https://www-fourier.ujf-grenoble.fr/~parisse/giac_fr.html
    // this.typeExercice = 'simple' // Pour les exercices plus simples destinés aux courses aux nombres

    this.listeArguments = [] // Variable servant à comparer les exercices pour ne pas avoir deux exercices identiques
    this.answers = {}
    this.listeAvecNumerotation = true
  }

  get html (): HTMLElement {
    return this._html
  }

  set html (value: HTMLElement) {
    this._html = value
  }

  nouvelleVersionWrapper = exportedNouvelleVersionWrapper.bind(this as Exercice)

  nouvelleVersion (numeroExercice?: number): void {
    console.log(numeroExercice)
  }

  reinit = exportedReinit.bind(this as Exercice)

  applyNewSeed = exportedApplyNewSeed.bind(this as Exercice)

  questionJamaisPosee = exportedQuestionJamaisPosee.bind(this as Exercice)
}
