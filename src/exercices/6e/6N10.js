import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import { nombreEnLettres } from '../../modules/nombreEnLettres.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Écrire un nombre entier en chiffres ou en lettres'
export const amcReady = true
export const amcType = 'AMCOpen'

export const interactifReady = true
export const interactifType = 'mathLive'

// Gestion de la date de publication initiale
export const dateDePublication = '19/09/2021'
export const dateDeModifImportante = '14/09/2022'

/**
 * Écrire en chiffres ou en lettres un nombre entier inférieur à 1 000 000.
 * Avec des paramètres sur le nombre de chiffres des nombres voulus
 * Avec des paramètres sur la présence obligatoire de nombres avec 80 (et ses copains qui n'aiment pas mettre de S dans leur vin) et avec 100 (et ses copains comme ceux de 80)
 * @author Eric Elter
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '0688e'
export const ref = '6N10'
export const refs = {
  'fr-fr': ['6N10'],
  'fr-ch': ['9NO1-1']
}
export default function EcrirePetitsNombresEntiers () {
  Exercice.call(this)
  this.nbQuestions = 5

  this.besoinFormulaireTexte = ['Type de nombres', 'Nombres séparés par des tirets\n2 : À deux chiffres\n3 : À trois chiffres\n4 : À quatre chiffres\n5 : À cinq chiffres\n6 : À six chiffres\n7 : À neuf chiffres\n8 : À douze chiffres']
  this.sup = 4 // Valeur du paramètre par défaut
  this.besoinFormulaire2Texte = ['Demande particulière', 'Nombres séparés par des tirets\n0 : Aucune demande particulière.\n1 : Les nombres se terminent par 80.\n2 : Les nombres contiennent un nombre entre 81 et 99.\n3 : Les nombres se terminent par un multiple de 100.\n4 : Les nombres commencent par mille.\n5 : Les nombres ne possèdent ni centaines ou ni centaines de mille.']
  this.sup2 = 0 // Valeur du paramètre par défaut
  this.besoinFormulaire3Numerique = ['Type de questions', 3, '1 : Écrire en lettres un nombre donné en chiffres\n2 : Écrire en chiffres un nombre donné en lettres\n3 : Passer d\'une écriture à l\'autre']
  this.sup3 = 1 // Valeur du paramètre par défaut

  this.nbCols = 1
  this.nbColsCorr = 1
  this.tailleDiaporama = 3
  this.video = ''

  this.nouvelleVersion = function () {
    let typeDeConsigne = []
    if (this.sup3 === 1) {
      this.consigne = 'Écrire le nombre en lettres.'
      typeDeConsigne = combinaisonListes([1], this.nbQuestions)
    } else if (this.sup3 === 2) {
      this.consigne = 'Écrire le nombre en chiffres.'
      typeDeConsigne = combinaisonListes([2], this.nbQuestions)
      if (this.interactif) this.consigne = 'Écrire le nombre en chiffres sans oublier les espaces.'
    } else {
      this.consigne = 'Passer de l\'écriture en chiffres à celle en lettres et inversement.'
      typeDeConsigne = combinaisonListes([1, 2], this.nbQuestions)
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []

    const listeQuestions = gestionnaireFormulaireTexte({
      min: 2,
      max: 8,
      defaut: 8,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    const OptionsDisponibles = gestionnaireFormulaireTexte({
      min: 0,
      max: 5,
      defaut: 0,
      nbQuestions: this.nbQuestions,
      saisie: this.sup2,
      shuffle: false
    })

    for (let i = OptionsDisponibles.length; i < this.nbQuestions; i++) { // On finit de remplir le tableau par des zéros (aucune demande particulière)
      OptionsDisponibles[i] = 0
    }
    const listeOptions = shuffle(OptionsDisponibles)

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let NombreAEcrire // Comme la valeur sera modifiée, on la déclare avec let
      switch (listeOptions[i]) {
        case 0 :
          if (listeQuestions[i] < 7) {
            NombreAEcrire = randint(1 + Math.pow(10, listeQuestions[i] - 1), Math.pow(10, listeQuestions[i]) - 1)
          } else if (listeQuestions[i] === 7) {
            NombreAEcrire = randint(1 + Math.pow(10, 8), Math.pow(10, 9) - 1)
          } else {
            NombreAEcrire = randint(1 + Math.pow(10, 11), Math.pow(10, 12) - 1)
          }
          if (!context.isHtml) {
            this.canEnonce = `Écrire le nombre en chiffres.


            ${nombreEnLettres(NombreAEcrire)}`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          break
        case 1 : // Se termine par 80
          if (listeQuestions[i] === 2) {
            NombreAEcrire = 80
          } else if (listeQuestions[i] < 7) {
            NombreAEcrire = 80 + 100 * Math.trunc(randint(1 + Math.pow(10, listeQuestions[i] - 3), Math.pow(10, listeQuestions[i] - 2) - 1)) // Se termine par 80
          } else if (listeQuestions[i] === 7) {
            NombreAEcrire = 80 + 100 * Math.trunc(randint(1 + Math.pow(10, 6), Math.pow(10, 7) - 1))
          } else {
            NombreAEcrire = 80 + 100 * Math.trunc(randint(1 + Math.pow(10, 9), Math.pow(10, 10) - 1))
          }
          if (!context.isHtml) {
            this.canEnonce = `Écrire le nombre en chiffres.


            ${nombreEnLettres(NombreAEcrire)}`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          break
        case 2 : // Contient 80 et quelques
          if (listeQuestions[i] === 2) {
            NombreAEcrire = 80 + randint(1, 19)
          } else if (listeQuestions[i] < 5) {
            NombreAEcrire = 80 + randint(1, 19) + 100 * Math.trunc(randint(1 + Math.pow(10, listeQuestions[i] - 3), Math.pow(10, listeQuestions[i] - 2) - 1)) // Se termine par 80
          } else if (listeQuestions[i] < 7) { // Pour mettre aussi 80 et quelques dans la classe des milliers
            if (choice([true, false])) {
              NombreAEcrire = Math.pow(10, 3) * (80 + randint(1, 19) + 100 * (listeQuestions[i] - 5) * randint(1, 9)) + randint(0, 999)
            } else {
              NombreAEcrire = 80 + randint(1, 19) + 100 * Math.trunc(randint(1 + Math.pow(10, listeQuestions[i] - 3), Math.pow(10, listeQuestions[i] - 2) - 1)) // Se termine par 80
            }
          } else if (listeQuestions[i] === 7) { // Pour mettre aussi 80 et quelques dans la classe des millions
            switch (choice([1, 2, 3])) {
              case 1 :
                NombreAEcrire = Math.pow(10, 6) * (80 + randint(1, 19) + 100 * randint(1, 9)) + randint(0, 999999)
                break
              case 2:
                NombreAEcrire = Math.pow(10, 6) * randint(101, 999) + Math.pow(10, 3) * (80 + randint(1, 19) + 100 * Math.trunc(randint(11, 99))) + randint(0, 999)
                break
              case 3:
                NombreAEcrire = Math.pow(10, 3) * randint(100001, 999999) + (80 + randint(1, 19) + 100 * randint(1, 9))
                break
            }
          } else { // Pour mettre aussi 80 et quelques dans la classe des milliards
            switch (choice([1, 2, 3, 4])) {
              case 1 :
                NombreAEcrire = Math.pow(10, 9) * (80 + randint(1, 19) + 100 * randint(1, 9)) + randint(0, 999999999)
                break
              case 2:
                NombreAEcrire = Math.pow(10, 9) * randint(101, 999) + Math.pow(10, 6) * (80 + randint(1, 19) + 100 * randint(1, 9)) + randint(0, 999999)
                break
              case 3:
                NombreAEcrire = Math.pow(10, 6) * randint(100001, 999999) + Math.pow(10, 3) * (80 + randint(1, 19) + 100 * randint(1, 9)) + randint(0, 999)
                break
              case 4:
                NombreAEcrire = Math.pow(10, 3) * randint(100000001, 999999999) + 80 + randint(1, 19) + 100 * randint(1, 9)
                break
            }
          }
          if (!context.isHtml) {
            this.canEnonce = `Écrire le nombre en chiffres.


            ${nombreEnLettres(NombreAEcrire)}`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          break
        case 3 : // Se termine par 100

          if (listeQuestions[i] < 7) {
            NombreAEcrire = 100 * Math.trunc(10 * randint(1 + Math.round(Math.pow(10, Math.max(listeQuestions[i] - 4, -1))), Math.pow(10, Math.max(listeQuestions[i] - 3, 0)) - 1) + randint(2, 8)) // Ne pas mettre 9 à la place de 8, sinon on pourrait obtenir 10 pour des nombres à 3 chiffres
          } else if (listeQuestions[i] === 7) {
            NombreAEcrire = 100 * (randint(Math.pow(10, 5), Math.pow(10, 6)) * 10 + randint(2, 9))
          } else {
            NombreAEcrire = 100 * (randint(Math.pow(10, 8), Math.pow(10, 9)) * 10 + randint(2, 9))
          }
          if (!context.isHtml) {
            this.canEnonce = `Écrire le nombre en chiffres.


            ${nombreEnLettres(NombreAEcrire)}`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          break
        case 4 : // Commence par mille.... (et non un-mille...)
          NombreAEcrire = 1000 + randint(1, 999)
          break
        case 5 : // Pas de centaines ou pas de centaines de mille
          if (listeQuestions[i] === 7) {
            NombreAEcrire = Math.trunc(Math.pow(10, 7) * randint(1, 9)) + randint(1, 99999)
          } else if (listeQuestions[i] > 3) {
            NombreAEcrire = 1000 * (randint(Math.pow(10, listeQuestions[i] - 4), Math.pow(10, listeQuestions[i] - 3) - 1)) + randint(1, 99)
          } else {
            NombreAEcrire = randint(1 + Math.pow(10, 1), Math.pow(10, 2) - 1)
          }
          if (!context.isHtml) {
            this.canEnonce = `Écrire le nombre en chiffres.


            ${nombreEnLettres(NombreAEcrire)}`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          break
      }

      if (typeDeConsigne[i] === 1) {
        if (context.isAmc) {
          this.autoCorrection[i] =
            {
              enonce: texte + '<br>',
              propositions: [
                {
                  texte: texteCorr,
                  statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  sanscadre: true
                }
              ]
            }
        } else {
          setReponse(this, i, nombreEnLettres(NombreAEcrire))
        }
        if (context.vue !== 'diap') texte = `$${texNombre(NombreAEcrire)} ${!this.interactif ? ' : \\dotfill $' : '$ <br>' + ajouteChampTexteMathLive(this, i, 'alphanumeric')}`
        else texte = `$${texNombre(NombreAEcrire)}$`
        if (context.vue !== 'diap') texteCorr = `$${texNombre(NombreAEcrire)}$ : ${nombreEnLettres(NombreAEcrire)}`
        else texteCorr = `${nombreEnLettres(NombreAEcrire)}`
      } else {
        if (context.isAmc) {
          setReponse(this, i, NombreAEcrire)
          this.autoCorrection[i].enonce = this.consigne + '\\\\' + nombreEnLettres(NombreAEcrire) + '\\\\'
        } else {
          handleAnswers(this, i, { reponse: { value: texNombre(NombreAEcrire), compare: fonctionComparaison, options: { nombreAvecEspace: true } } })
        }
        if (context.vue !== 'diap') texte = `${nombreEnLettres(NombreAEcrire)} ${!this.interactif ? ' : $\\dotfill$' : ' <br>' + ajouteChampTexteMathLive(this, i, KeyboardType.numbersSpace, { espace: true })}`
        else texte = `${nombreEnLettres(NombreAEcrire)}`
        if (context.vue !== 'diap') texteCorr = `${nombreEnLettres(NombreAEcrire)} : $${texNombre(NombreAEcrire)}$`
        else texteCorr = `$${texNombre(NombreAEcrire)}$`
      }

      texte += ajouteFeedback(this, i)

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce ?? '')
        this.listeCanReponsesACompleter.push(this.canReponseACompleter ?? '')
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
