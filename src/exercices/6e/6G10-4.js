import { cercle } from '../../lib/2d/cercle.js'
import { droite } from '../../lib/2d/droites.js'
import { point, pointAdistance, pointIntersectionLC, tracePoint } from '../../lib/2d/points.js'
import { polygoneAvecNom } from '../../lib/2d/polygones.js'
import { longueur, segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { numAlpha, premiereLettreEnMajuscule } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { contraindreValeur, listeQuestionsToContenu } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { context } from '../../modules/context.js'
import { clone } from 'mathjs'
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Connaître le vocabulaire du cercle'

export const dateDePublication = '19/08/2022'
export const dateDeModifImportante = '07/11/2023'

/**
 * Exercice testant les connaissances des élèves sur le vocabulaire du cercle dans les deux sens (Un rayon est ... et [AB] est ...)
 * et en travaillant la reconnaissance et la production (QCM ou réponse libre)
 * @author Guillaume Valmont
 * Référence 6G10-4
 */
export const uuid = '03b49'
export const ref = '6G10-4'
export const refs = {
  'fr-fr': ['6G10-4'],
  'fr-ch': ['9ES1-9']
}

function ajouterAlternatives (fonction, reponses) {
  const copieReponses = []
  for (const reponse of reponses) {
    copieReponses.push(reponse)
  }
  for (const reponse of copieReponses) {
    reponses.push(fonction(reponse))
  }
  return reponses
}

function longueurAlternative (longueur) {
  return longueur.slice(1) + longueur.slice(0, 1)
}

// const mots = ['un diamètre', 'le diamètre', 'un rayon', 'le rayon', 'une corde']
// @todo relire la définition de cette fonction et la déplacer
function segmentAlternatif (reponses) {
  if (reponses[0] != null) {
    return '[' + reponses[0].slice(2, 3) + reponses[0].slice(1, 2) + ']'
  } else {
    window.notify('segmentAlternatif n\'a pas de matière pour choisir', { reponses })
  }
}

export default function VocabulaireDuCercle () {
  Exercice.call(this)
  this.nbQuestions = 1

  this.besoinFormulaireNumerique = ['Sens des questions', 3, '1 : Un rayon est...\n2 : [AB] est ...\n3 : Mélange']
  this.sup = 3
  this.besoinFormulaire2CaseACocher = ['QCM']
  this.sup2 = true
  this.correctionDetailleeDisponible = true
  this.sup3 = 5
  this.besoinFormulaire3Numerique = ['Nombre de sous-questions', 5]

  this.spacing = 1 // Interligne des questions
  this.spacingCorr = 1.5 // Interligne des réponses

  this.nouvelleVersion = function () {
    this.consigne = this.sup2 ? 'Cocher la (ou les) bonne(s) réponse(s).' : 'Compléter.'
    if (context.isHtml) this.consigne += '<br><br>'
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.interactifType = this.sup2 ? 'qcm' : 'mathLive'
    const nbSousQuestionMax = 5 // Il y a 5 types de sous-questions pour l'instant... si ça venait à changer, mettre à jour ce paramètre
    let sensDesQuestionsDisponibles
    switch (this.sup) {
      case 1:
        sensDesQuestionsDisponibles = ['Un rayon est ...']
        break
      case 2:
        sensDesQuestionsDisponibles = ['[AB] est ...']
        break
      default:
        sensDesQuestionsDisponibles = ['Un rayon est ...', '[AB] est ...']
        break
    }
    const nbSousQuestions = contraindreValeur(1, 5, this.sup3, nbSousQuestionMax)
    const sensDesQuestions = combinaisonListes(sensDesQuestionsDisponibles, this.nbQuestions * nbSousQuestionMax)
    const distanceMinEntrePoints = 2
    const distanceMinCorde = 3
    const distanceMaxCorde = 5.9
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
      const propositionsAMC = []

      texte = ''
      texteCorr = ''
      const nomsDesPoints = choisitLettresDifferentes(6)
      const O = point(0, 0, nomsDesPoints[0])
      const leCercle = cercle(O, 3)
      const A = pointAdistance(O, 3, nomsDesPoints[1])
      let B, C, D, E
      do {
        B = pointAdistance(O, 3, nomsDesPoints[2])
        C = pointIntersectionLC(droite(O, B), leCercle, nomsDesPoints[3])
      } while (longueur(A, B) < distanceMinEntrePoints || longueur(A, C) < distanceMinEntrePoints || longueur(B, C) < distanceMinEntrePoints)
      do {
        D = pointAdistance(O, 3, nomsDesPoints[4])
      } while (longueur(A, D) < distanceMinEntrePoints || longueur(B, D) < distanceMinEntrePoints || longueur(C, D) < distanceMinEntrePoints)
      do {
        E = pointAdistance(O, 3, nomsDesPoints[5])
      } while (longueur(A, E) < distanceMinEntrePoints || longueur(B, E) < distanceMinEntrePoints || longueur(C, E) < distanceMinEntrePoints || longueur(D, E) < distanceMinCorde || longueur(D, E) > distanceMaxCorde)
      const OA = segment(O, A)
      const BC = segment(B, C)
      const DE = segment(D, E)
      const polygon = polygoneAvecNom(A, B, C, D, E)
      objetsEnonce.push(leCercle, labelPoint(O), tracePoint(O), OA, BC, DE, polygon[1])
      const params = { xmin: -4, ymin: -4, xmax: 4, ymax: 4, pixelsParCm: 20, scale: 1, optionsTikz: 'baseline=(current bounding box.north)' }
      // On ajoute au texte de l'énoncé, la figure à main levée et la figure de l'enoncé.
      const figure = mathalea2d(params, objetsEnonce)
      texte += figure + '<br>'
      // On ajoute au texte de la correction, la figure de la correction
      texteCorr += texte

      let questions = [
        {
          nom: `[$${O.nom + A.nom}$]`,
          nature: 'un rayon',
          commentaire: `${texteEnCouleurEtGras('Un', 'blue')} rayon est un ${texteEnCouleurEtGras('segment', 'blue')}, il se note donc avec des crochets.`,
          commentaireAlt: `${texteEnCouleurEtGras('Le', 'blue')} rayon est une ${texteEnCouleurEtGras('longueur', 'blue')}, il se note donc sans crochet.`,
          sens: sensDesQuestions[i * nbSousQuestions]
        },
        {
          nom: `[$${B.nom + C.nom}$]`,
          nature: 'un diamètre',
          commentaire: `${texteEnCouleurEtGras('Un', 'blue')} diamètre est un ${texteEnCouleurEtGras('segment', 'blue')}, il se note donc avec des crochets.<br>Un diamètre est une corde qui passe par le centre du cercle.`,
          commentaireAlt: `${texteEnCouleurEtGras('Le', 'blue')} diamètre est une ${texteEnCouleurEtGras('longueur', 'blue')}, il se note donc sans crochet.`,
          sens: sensDesQuestions[i * nbSousQuestions + 1]
        },
        {
          nom: `$${O.nom + A.nom}$`,
          nature: 'le rayon',
          commentaire: `${texteEnCouleurEtGras('Le', 'blue')} rayon est une ${texteEnCouleurEtGras('longueur', 'blue')}, il se note donc sans crochet.`,
          commentaireAlt: `${texteEnCouleurEtGras('Un', 'blue')} rayon est un ${texteEnCouleurEtGras('segment', 'blue')}, il se note donc avec des crochets.`,
          sens: sensDesQuestions[i * nbSousQuestions + 2]
        },
        {
          nom: `$${B.nom + C.nom}$`,
          nature: 'le diamètre',
          commentaire: `${texteEnCouleurEtGras('Le', 'blue')} diamètre est une ${texteEnCouleurEtGras('longueur', 'blue')}, il se note donc sans crochet.`,
          commentaireAlt: `${texteEnCouleurEtGras('Un', 'blue')} diamètre est un ${texteEnCouleurEtGras('segment', 'blue')}, il se note donc avec des crochets.`,
          sens: sensDesQuestions[i * nbSousQuestions + 3]
        },
        {
          nom: `[$${D.nom + E.nom}$]`,
          nature: 'une corde',
          commentaire: '',
          commentaireAlt: '',
          sens: sensDesQuestions[i * nbSousQuestions + 4]
        }
      ]
      const propositionsUnRayonEst = []
      for (const question of questions) {
        const texteProposition = question.nom
        propositionsUnRayonEst.push({
          texte: texteProposition,
          statut: false,
          feedback: question.commentaire,
          feedbackAlt: question.commentaireAlt
        })
      }
      const propositionsABEst = []
      for (const question of questions) {
        const texteProposition = question.nature
        propositionsABEst.push({
          texte: texteProposition,
          statut: false,
          feedback: question.commentaire,
          feedbackAlt: question.commentaireAlt
        })
      }
      let j = 0
      let nomDiametre = ''
      for (const question of questions) {
        if (question.nature === 'un diamètre') {
          nomDiametre = question.nom
          break
        }
      }
      questions = shuffle(questions).slice(0, nbSousQuestions)
      for (const question of questions) {
        let enonce
        const propositionsEE = []
        texte += numAlpha(j)
        texteCorr += numAlpha(j)
        if (question.sens === 'Un rayon est ...') {
          enonce = `${premiereLettreEnMajuscule(question.nature)} est ...`
          texte += enonce
          texteCorr += `${premiereLettreEnMajuscule(question.nature)} est ${texteEnCouleurEtGras(question.nom)}.<br>`
          if (question.nature === 'une corde') texteCorr += `${texteEnCouleurEtGras(nomDiametre)} étant un diamètre, c'est aussi une corde.<br>`
        }
        if (question.sens === '[AB] est ...') {
          enonce = `${question.nom} est ...`
          texte += enonce
          texteCorr += `${premiereLettreEnMajuscule(question.nom)} est ${texteEnCouleurEtGras(question.nature)}${question.nom === nomDiametre ? ' et aussi ' + texteEnCouleurEtGras('une corde') : ''}.<br>`
        }
        if (this.correctionDetaillee && question.commentaire !== '') texteCorr += question.commentaire + '<br>'
        if (this.sup2 || context.isAmc) {
          let propositions = []
          if (question.sens === 'Un rayon est ...') {
            // clone réalise la deep copy d'un array ou d'un objet... ce qui rend propositions indépendant des changements de propositionsUnRayonEst
            propositions = clone(propositionsUnRayonEst)
          }
          if (question.sens === '[AB] est ...') {
            // clone réalise la deep copy d'un array ou d'un objet... ce qui rend propositions indépendant des changements de propositionsABEst
            propositions = clone(propositionsABEst)
          }
          for (let ee = 0; ee < propositions.length; ee++) {
            const statut = propositions[ee].texte === question.nom || propositions[ee].texte === question.nature || (question.nature === 'un diamètre' && propositions[ee].texte === 'une corde') || (question.nature === 'une corde' && propositions[ee].texte === nomDiametre)
            let feedback
            statut ? feedback = propositions[ee].feedback : feedback = propositions[ee].feedbackAlt
            propositionsEE.push({
              texte: propositions[ee].texte,
              statut,
              feedback
            })
          }
          if (!context.isAmc) {
            this.autoCorrection[i * questions.length + j] = {
              enonce,
              options: { ordered: false },
              propositions: propositionsEE
            }
            texte += propositionsQcm(this, i * questions.length + j).texte + '<br>'
          } else if (context.isAmc) {
            propositionsAMC[j] = {
              type: 'qcmMult', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              enonce,
              propositions: propositionsEE
            }
          }
        } else {
          let reponses
          if (question.sens === 'Un rayon est ...') {
            reponses = [question.nom.replace(/\$/g, '')]
            switch (question.nature) {
              case 'le rayon':
                reponses.push(O.nom + B.nom, O.nom + C.nom, O.nom + D.nom, O.nom + E.nom)
                reponses = ajouterAlternatives(longueurAlternative, reponses)
                break
              case 'le diamètre':
                reponses.push(longueurAlternative(reponses))
                break
              case 'un rayon':
                reponses.push('[' + O.nom + B.nom + ']', '[' + O.nom + C.nom + ']', '[' + O.nom + D.nom + ']', '[' + O.nom + E.nom + ']')
                reponses = ajouterAlternatives(segmentAlternatif, reponses)
                break
              case 'un diamètre':
                reponses.push(segmentAlternatif(reponses))
                break
              case 'une corde':
                for (const point1 of [A, B, C, D, E]) {
                  for (const point2 of [A, B, C, D, E]) {
                    if (point1.nom !== point2.nom) {
                      reponses.push('[' + point1.nom + point2.nom + ']')
                    }
                  }
                }
                reponses = ajouterAlternatives(segmentAlternatif, reponses)
                break
            }
            texte += ajouteChampTexteMathLive(this, i * questions.length + j, 'inline largeur25 nospacebefore college6eme alphanumericAvecEspace')
            setReponse(this, i * questions.length + j, reponses, { formatInteractif: 'texteAvecEspace' })
          }
          if (question.sens === '[AB] est ...') {
            reponses = [question.nature]
            texte += ajouteChampTexteMathLive(this, i * questions.length + j, 'inline largeur25 nospacebefore college6eme alphanumericAvecEspace')
            //  setReponse(this, i * questions.length + j, reponses, { formatInteractif: 'ignorerCasse' })
            setReponse(this, i * questions.length + j, reponses, { formatInteractif: 'texteAvecEspace' })
          }
        }
        texte += '<br>'
        texte += ajouteFeedback(this, i)

        if (this.correctionDetaillee) texteCorr += '<br>'
        j++
      }

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, nomsDesPoints, objetsEnonce)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        // Dans cet exercice, on n'utilise pas a, b, c et d mais A, B, C et D alors remplace-les !
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)

        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: figure + 'À partir de la figure ci-dessus, compléter les phrases suivantes.',
            enonceAvant: true, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
            enonceCentre: true, // EE : ce champ est facultatif et permet (si true) de centrer le champ 'enonce' ci-dessus.
            melange: true, // EE : ce champ est facultatif et permet (si false) de ne pas provoquer le mélange des questions.
            options: { avecSymboleMult: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) des propositions : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
            propositions: propositionsAMC
          }
        }

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
