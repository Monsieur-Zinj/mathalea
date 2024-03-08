import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { premiereLettreEnMajuscule } from '../../lib/outils/outilString.js'
import { prenomPronom } from '../../lib/outils/Personne'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import {
  randint,
  listeQuestionsToContenu,
  gestionnaireFormulaireTexte
} from '../../modules/outils.js'
import Decimal from 'decimal.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'
export const titre = 'Utiliser les ordres de grandeur pour vérifier ses résultats'

export const dateDePublication = '23/05/2022'
export const dateDeModifImportante = '18/06/2022'

/**
 * @author Guillaume Valmont
 * Reformulation de l'énoncé et ajout de problèmes avec des puissances de 10 par Guillaume Valmont le 18/06/2022
*/
export const uuid = '975cc'
export const ref = '4C36'
export const refs = {
  'fr-fr': ['4C36'],
  'fr-ch': ['10NO2-13']
}
export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.nbQuestions = 5
    this.besoinFormulaireTexte = ['Choix des problèmes', 'Nombres séparés par des tirets\n1 : Problèmes \'\'naturels\'\'\n2 : Problèmes avec des puissances de 10\n3 : Mélange']
    this.sup = '3'
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const problemesNaturels = [
      /* {
        intitule: 'la distance entre la Terre et la Lune',
        puissanceDe10: 5,
        unite: 'km'
      },
      {
        intitule: 'le rayon de la Terre',
        puissanceDe10: 3,
        unite: 'km'
      }, */
      {
        intitule: 'la hauteur d\'un immeuble',
        puissanceDe10: 2,
        unite: 'm'
      },
      {
        intitule: 'la longueur d\'un smartphone',
        puissanceDe10: -1,
        unite: 'm'
      },
      {
        intitule: 'la longueur d\'une fourmi',
        puissanceDe10: -3,
        unite: 'm'
      },
      {
        intitule: 'la masse d\'un camion',
        puissanceDe10: 4,
        unite: 'kg'
      },
      {
        intitule: 'la masse d\'une voiture',
        puissanceDe10: 3,
        unite: 'kg'
      },
      {
        intitule: 'la masse d\'une pomme',
        puissanceDe10: -1,
        unite: 'kg'
      },
      {
        intitule: 'le volume d\'une bouteille d\'eau',
        puissanceDe10: 0,
        unite: 'L'
      },
      {
        intitule: 'le volume d\'une bouteille d\'eau',
        puissanceDe10: 0,
        unite: 'dm³'
      },
      {
        intitule: 'le volume d\'une bouteille d\'eau',
        puissanceDe10: -3,
        unite: 'm³'
      },
      {
        intitule: 'le volume d\'une bouteille d\'eau',
        puissanceDe10: 3,
        unite: 'mm³'
      },
      {
        intitule: 'la surface d\'une table',
        puissanceDe10: 0,
        unite: 'm²'
      }
    ]
    const problemesDePuissances = [
      {
        intitule: 'la taille d\'un tardigrade',
        puissanceDe10: -4,
        unite: 'm'
      },
      {
        intitule: 'la vitesse de la lumière',
        puissanceDe10: 8,
        unite: 'm/s'
      },
      {
        intitule: 'la distance entre la Terre et le Soleil',
        puissanceDe10: 8,
        unite: 'km'
      },
      {
        intitule: 'la vitesse de la station spatiale internationale',
        puissanceDe10: 4,
        unite: 'km/h'
      },
      {
        intitule: 'la masse de la station spatiale internationale',
        puissanceDe10: 5,
        unite: 'kg'
      },
      {
        intitule: 'l\'épaisseur d\'un fil de soie',
        puissanceDe10: -4,
        unite: 'm'
      },
      {
        intitule: 'la taille d\'une bactérie',
        puissanceDe10: -6,
        unite: 'm'
      },
      {
        intitule: 'la taille d\'un pixel de téléviseur à haute résolution',
        puissanceDe10: -4,
        unite: 'm'
      },
      {
        intitule: 'la masse du Titanic',
        puissanceDe10: 7,
        unite: 'kg'
      },
      {
        intitule: 'la masse de la grande pyramide de Gizeh',
        puissanceDe10: 9,
        unite: 'kg'
      },
      {
        intitule: 'la production de pétrole mondiale en 2020',
        puissanceDe10: 9,
        unite: 'kg'
      }
    ]
    const justesseResultats = combinaisonListes([-1, 0, 1], this.nbQuestions)

    const valMaxParametre = 3

    const listeDesProblemes = gestionnaireFormulaireTexte({ nbQuestions: this.nbQuestions, saisie: this.sup, max: valMaxParametre - 1, defaut: 1, melange: valMaxParametre })

    for (let i = 0, texte, texteCorr, probleme, resultatObtenu, puissanceObtenue, remarque, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const prenom = prenomPronom()
      switch (listeDesProblemes[i]) {
        case 1:
          probleme = problemesNaturels[randint(0, problemesNaturels.length - 1)]
          break
        case 2:
          probleme = problemesDePuissances[randint(0, problemesDePuissances.length - 1)]
          break
      }
      resultatObtenu = new Decimal(randint(101, 199)).div(100)
      let QCMPossible = false
      let QCMImpossible = true
      switch (justesseResultats[i]) {
        case 1:
          puissanceObtenue = probleme.puissanceDe10 + 2
          remarque = 'Ce qui est beaucoup trop !'
          break
        case 0:
          puissanceObtenue = probleme.puissanceDe10
          remarque = 'Ce qui correspond bien à l\'ordre de grandeur qu\'on pouvait attendre'
          QCMPossible = true
          QCMImpossible = false
          break
        case -1:
          puissanceObtenue = probleme.puissanceDe10 - 2
          remarque = 'Ce qui est trop peu !'
          break
      }
      resultatObtenu = resultatObtenu.times(10 ** puissanceObtenue)
      texteCorr = `${premiereLettreEnMajuscule(prenom[1])} a obtenu un résultat de l'ordre de $10^{${puissanceObtenue}}$ ${probleme.unite}. `
      texteCorr += remarque
      switch (listeDesProblemes[i]) {
        case 1:
          texte = `${prenom[0]} a calculé ${probleme.intitule} et a obtenu $${texNombre(resultatObtenu)}$ ${probleme.unite}.<br>
          En utilisant les ordres de grandeur, dire si ce résultat est plausible.`
          if (justesseResultats[i] !== 0) texteCorr += `<br>${premiereLettreEnMajuscule(probleme.intitule)} serait plutôt de l'ordre de grandeur de $10^{${probleme.puissanceDe10}}$ ${probleme.unite}.`
          break
        case 2:
          texte = `${prenom[0]} sait que ${probleme.intitule} est de l'ordre de $10^{${probleme.puissanceDe10}}$ ${probleme.unite}.<br>
          Comme résultat d'un exercice, ${prenom[1]} a obtenu $${texNombre(resultatObtenu)}$ ${probleme.unite}.<br>
          Ce résultat est-il plausible ?`
          break
      }

      this.autoCorrection[i] = {
        enonce: texte,
        propositions: [
          {
            texte: 'C\'est plausible',
            statut: QCMPossible, // true ou false pour indiquer si c'est une bonne réponse (true)
            feedback: '' // qui s'affichera si la réponse est juste ou s'il n'y a qu'une erreur
          },
          {
            texte: 'C\'est impossible',
            statut: QCMImpossible, // true ou false pour indiquer si c'est une bonne réponse (true)
            feedback: ''
          }
        ],
        options: {
          ordered: true, // (true si les réponses doivent rester dans l'ordre ci-dessus, false s'il faut les mélanger),
          vertical: true, // facultatif. true : si on veut une présentation en plusieurs colonnes. false : valeur par défaut, les cases à cocher sont à la suite, toutes sur une colonne. Exercice-témoin : can5A01
          nbCols: 2 // Le nb de colonnes si vertical est true. Sans effet si vertical est false.
        }
      }
      const monQcm = propositionsQcm(this, i) // Les deux paramètres sont obligatoires et désignent, respectivement, l'exercice appelant, le numéro de la question dans la programmation de l'exercice.
      if (this.interactif) {
        texte += monQcm.texte // enonce est l'énoncé global de l'exercice
        texteCorr += '<br>' + monQcm.texteCorr // texteCorr est la correction globale de l'exercice
      }
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
