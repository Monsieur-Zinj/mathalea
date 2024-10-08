import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { lampeMessage } from '../../lib/format/message.js'
import { numAlpha, sp } from '../../lib/outils/outilString.js'
import { prenomF, prenomM } from '../../lib/outils/Personne'
import { texPrix } from '../../lib/format/style'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { texNombre } from '../../lib/outils/texNombre'
import { egalOuApprox } from '../../lib/outils/ecritures'

export const titre = 'Augmenter ou diminuer d\'un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '23/07/2021'
export const dateDeModifImportante = '16/04/2023'

/**
 * Description didactique de l'exercice
 * augmenter ou diminuer un prix d'un pourcentage,
 * le calcul intermédiaire du montant de l'augmentation ou de la baisse est demandé
 * Quatre niveaux :
 * - 1 valeurs entières et 10%, 20%...;
 * - 2 Comme le 1 mais avec 25% et 75% en plus ;
 * - 3 valeurs entières et 13%, 28%...;
 * - 4 valeurs décimale comme 13,5%...;
 * @author Laurence CANDILLE (Rajout de 25% et 50% par Eric Elter)
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '064ce'
export const ref = '6P13'
export const refs = {
  'fr-fr': ['6P13'],
  'fr-ch': ['9FA3-13']
}
export default function AugmenterEtReduireDunPourcentage () {
  Exercice.call(this)
  this.nbQuestions = 2
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = 1 // Niveau de difficulté
  this.sup2 = 2
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  function nombreDecimales (prMin, prMax, n) {
    let pourcent
    if (n === 0) {
      do {
        pourcent = randint(1, 9) * 10
      } while (pourcent < prMin || pourcent > prMax)
    } else if (n === 1) {
      do {
        pourcent = choice([10, 20, 25, 30, 50, 60, 70, 75])
      } while (pourcent < prMin || pourcent > prMax)
    } else if (n === 2) {
      do {
        pourcent = randint(1, 9) + randint(1, 9) * 10
      } while (pourcent < prMin || pourcent > prMax)
    } else {
      do {
        pourcent = (randint(10, 90) * 100 + randint(1, 9) * 10) / 100
      } while (pourcent < prMin || pourcent > prMax)
    }
    return pourcent
  }
  const situationsAugmentations = [
    {
      quoi: 'Le loyer de l\'appartement de',
      quoiReponse: 'son loyer',
      verbe: 'il augmente',
      moitieMin: 250,
      moitieMax: 500,
      prMin: 2,
      prMax: 15
    },
    {
      quoi: 'L\'abonnement à la salle de sport de',
      quoiReponse: 'son abonnement',
      verbe: 'il augmente',
      moitieMin: 15,
      moitieMax: 40,
      prMin: 2,
      prMax: 10
    },
    {
      quoi: 'Les frais de scolarité de',
      quoiReponse: 'ses frais de scolarité',
      verbe: 'ils augmentent',
      moitieMin: 200,
      moitieMax: 400,
      prMin: 5,
      prMax: 20
    },
    {
      quoi: 'Les frais de transport annuels de',
      quoiReponse: 'ses frais de transport',
      verbe: 'ils augmentent',
      moitieMin: 500,
      moitieMax: 800,
      prMin: 5,
      prMax: 15
    }
  ]
  const situationsReductions = [
    {
      quoi: 'Un billet d\'avion',
      quoiReponse: 'son billet d\'avion',
      moitieMin: 50,
      moitieMax: 100,
      prMin: 10,
      prMax: 60
    },
    {
      quoi: 'Un pantalon',
      quoiReponse: 'son pantalon',
      moitieMin: 25,
      moitieMax: 40,
      prMin: 10,
      prMax: 70
    },
    {
      quoi: 'Un billet de cinéma',
      quoiReponse: 'son billet de cinéma',
      moitieMin: 3,
      moitieMax: 6,
      prMin: 20,
      prMax: 50
    },
    {
      quoi: 'Un gâteau au chocolat',
      quoiReponse: 'son gâteau au chocolat',
      moitieMin: 15,
      moitieMax: 25,
      prMin: 10,
      prMax: 40
    }
  ]

  this.nouvelleVersion = function () {
    this.introduction = (this.sup2 && this.interactif && context.isHtml)
      ? lampeMessage({
        titre: 'Calculatrice autorisée.',
        texte: 'Écrire les réponses dans les cases sans arrondir, ne pas préciser "€" ni "euros" ...',
        couleur: 'nombres'
      })
      : ''
    const typeQuestionsDisponibles = ['augmentation', 'réduction'] // On créé 2 types de questions
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"

    for (let i = 0, texte, texteCorr, enonceInit, enonceAMC, propositionsAMC, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      const prenom1 = prenomM()
      const prenom2 = prenomF()
      let prixIntial, prixFinal

      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'réduction': {
          const situation = choice(situationsReductions)
          const pourcent = nombreDecimales(situation.prMin, situation.prMax, this.sup - 1)
          prixIntial = 2 * randint(situation.moitieMin, situation.moitieMax)
          const montantReduction = pourcent * prixIntial / 100
          prixFinal = prixIntial - montantReduction
          texte = `${situation.quoi} coûte $${prixIntial}$${sp(1)}€. ${prenom1} bénéficie d'une réduction de $${pourcent}${sp(1)}\\%$.`
          enonceInit = texte
          enonceAMC = (this.interactif && context.isHtml) ? `${numAlpha(0)} Le montant de la réduction est :` : `${numAlpha(0)} Calculer le montant de la réduction.`
          texte = enonceInit + '<br>' + enonceAMC
          texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur01 inline nospacebefore', { texteApres: ' €.' })
          texte += '<br>'
          if (!context.isAmc && this.interactif) {
            handleAnswers(this, 2 * i, { reponse: { value: String(montantReduction), compare: fonctionComparaison } })
          } else {
            propositionsAMC = [
              {
                type: 'AMCNum',
                propositions: [
                  {
                    texte: texteCorr,
                    reponse: {
                      texte: enonceInit + '<br>' + enonceAMC,
                      valeur: [montantReduction],
                      param: {
                        digits: 5,
                        decimals: 2,
                        signe: false,
                        approx: 0,
                        exposantNbChiffres: 0
                      }
                    }
                  }
                ]
              }
            ]
          }
          enonceAMC = (this.interactif && context.isHtml) ? `${numAlpha(1)} Finalement, ${prenom1} paiera ${situation.quoiReponse} :` : `${numAlpha(1)} Calculer le prix de ${situation.quoiReponse}.`
          texte += enonceAMC
          texte += (this.interactif && context.isHtml) ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur01 inline nospacebefore', { texteApres: ' €.' }) : ''
          if (!context.isAmc) {
            handleAnswers(this, 2 * i + 1, { reponse: { value: String(prixFinal), compare: fonctionComparaison } })
          } else {
            propositionsAMC.push(
              {
                type: 'AMCNum',
                propositions: [
                  {
                    texte: '',
                    reponse: {
                      texte: enonceAMC,
                      valeur: [prixFinal],
                      param: {
                        digits: 5,
                        decimals: 2,
                        signe: false,
                        approx: 0,
                        exposantNbChiffres: 0
                      }
                    }
                  }
                ]
              }
            )
          }
          texteCorr = `${numAlpha(0)} Le montant de la réduction est : $${prixIntial}${sp()}€ \\times ${pourcent} \\div 100${egalOuApprox(montantReduction, 2)}`
          texteCorr += miseEnEvidence(`${texPrix(montantReduction)}${sp()}€`) + '$.<br>'
          texteCorr += `${numAlpha(1)} Finalement, ${prenom1} paiera ${situation.quoiReponse} : $${prixIntial}${sp()}€-${texPrix(montantReduction)}${sp()}€=`
          texteCorr += miseEnEvidence(`${texPrix(prixFinal)}${sp()}€`) + '$.'
        }
          break
        case 'augmentation': {
          const situation = choice(situationsAugmentations)
          const pourcent = nombreDecimales(situation.prMin, situation.prMax, this.sup - 1)
          prixIntial = 2 * randint(situation.moitieMin, situation.moitieMax)
          const montantAugmentation = pourcent * prixIntial / 100
          prixFinal = prixIntial + montantAugmentation

          enonceInit = `${situation.quoi} ${prenom2} coûte $${prixIntial}$${sp()}€. Au 1er janvier, ${situation.verbe} de $${texNombre(pourcent, 1)}${sp()}\\%$.`
          enonceAMC = (this.interactif && context.isHtml) ? `${numAlpha(0)} Le montant de l'augmentation est :` : `${numAlpha(0)} Calculer le montant de l'augmentation.`
          texte = enonceInit + '<br>' + enonceAMC
          texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur01 inline nospacebefore', { texteApres: ' €.' })
          texte += '<br>'
          if (!context.isAmc) {
            handleAnswers(this, 2 * i, { reponse: { value: texNombre(montantAugmentation, 2), compare: fonctionComparaison } })
          } else {
            propositionsAMC = [
              {
                type: 'AMCNum',
                propositions: [
                  {
                    texte: texteCorr,
                    reponse: {
                      texte: enonceInit + '<br>' + enonceAMC,
                      valeur: [montantAugmentation],
                      param: {
                        digits: 5,
                        decimals: 2,
                        signe: false,
                        approx: 0,
                        exposantNbChiffres: 0
                      }
                    }
                  }
                ]
              }
            ]
          }
          enonceAMC = (this.interactif && context.isHtml) ? `${numAlpha(1)} Au 1er janvier, ${prenom2} paiera ${situation.quoiReponse} :` : `${numAlpha(1)} Calculer le montant au 1er janvier de ${situation.quoiReponse}.`
          texte += enonceAMC
          texte += (this.interactif && context.isHtml) ? ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur01 inline nospacebefore', { texteApres: ' €.' }) : ''
          if (!context.isAmc) {
            handleAnswers(this, 2 * i + 1, { reponse: { value: texNombre(prixFinal, 2), compare: fonctionComparaison } })
          } else {
            propositionsAMC.push(
              {
                type: 'AMCNum',
                propositions: [
                  {
                    texte: texteCorr,
                    reponse: {
                      texte: enonceAMC,
                      valeur: [prixFinal],
                      param: {
                        digits: 5,
                        decimals: 2,
                        signe: false,
                        approx: 0,
                        exposantNbChiffres: 0
                      }
                    }
                  }
                ]
              }
            )
          }
          texteCorr = `${numAlpha(0)} Le montant de l'augmentation est :     $${prixIntial}${sp()}€ \\times ${texNombre(pourcent, 1)} \\div 100${egalOuApprox(montantAugmentation, 2)}`
          texteCorr += miseEnEvidence(`${texPrix(montantAugmentation)}${sp()}€`) + '$.<br>'
          texteCorr += `${numAlpha(1)} Finalement, ${prenom2} paiera ${situation.quoiReponse} : $${prixIntial}${sp()}€+${texPrix(montantAugmentation)}${sp()}€ =`
          texteCorr += miseEnEvidence(`${texPrix(prixFinal)}${sp()}€`) + '$.'
        }
          break
      }
      if (this.questionJamaisPosee(i, prixIntial, prixFinal)) {
        // Si la question n'a jamais été posée, on en crée une autre
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: '',
            options: { multicols: true, barreseparation: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
            propositions: propositionsAMC
          }
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Valeurs entières et 10%, 20%...\n2 : Valeurs entières et 10%, 20%... mais aussi 25% et 50%\n3 : Valeurs entières et 4%, 23%...\n4 : Une décimale comme 34,5%']
  this.besoinFormulaire2CaseACocher = ['Avec indication de la calculatrice (en interactif)']
}
