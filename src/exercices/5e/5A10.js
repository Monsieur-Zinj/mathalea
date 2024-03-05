import { combinaisonListesSansChangerOrdre } from '../../lib/outils/arrayOutils'
import { listeDesDiviseurs } from '../../lib/outils/primalite'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { contraindreValeur, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'

import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Écrire la liste de tous les diviseurs d\'un entier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '03/10/2023'

export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * 5A10 - Division Euclidienne; diviseurs, multiples, critères de divisibilité
 * Exercice bilan
 * @author Sébastien Lozano & Jean Claude Lhote
 */
export const uuid = '4828d'
export const ref = '5A10'
export const refs = {
  'fr-fr': ['5A10'],
  'fr-ch': ['9NO4-6']
}
export default function ListeDesDiviseurs5e () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  context.isHtml ? this.spacing = 2 : this.spacing = 1
  context.isHtml ? this.spacingCorr = 2 : this.spacingCorr = 1
  this.nbQuestions = 3
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 2
  this.sup2 = 6
  this.sup3 = 10
  this.sup4 = 3

  this.nouvelleVersion = function () {
    let typesDeQuestions
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    this.autoCorrection = []

    this.sup3 = contraindreValeur(2, 16, parseInt(this.sup3), 10)
    const nombresDeChiffresMax = gestionnaireFormulaireTexte({
      max: 5,
      defaut: 2,
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      shuffle: false
    })

    const nombresDeDiviseursMax = gestionnaireFormulaireTexte({
      min: 2,
      max: parseInt(this.sup3),
      defaut: 6,
      nbQuestions: this.nbQuestions,
      saisie: this.sup2,
      shuffle: false
    })

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      nbQuestions: this.nbQuestions,
      saisie: this.sup4,
      max: 2,
      shuffle: false,
      melange: 3,
      defaut: 2
    })

    // const typesDeQuestionsDisponibles = [1, 1, 2]
    const nbChiffresMax = combinaisonListesSansChangerOrdre(nombresDeChiffresMax, this.nbQuestions)
    const nbDiviseursMax = combinaisonListesSansChangerOrdre(nombresDeDiviseursMax, this.nbQuestions)

    // const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions)
    const listeDesMDejaTrouves = []
    for (let i = 0, listeDiviseursM = [], nbDiviseursM, M, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      if (nbDiviseursMax[i] > 10) {
        nbChiffresMax[i] = Math.min(nbChiffresMax[i], 3)
      }
      do {
        M = randint(10 ** (nbChiffresMax[i] - 1), 10 ** nbChiffresMax[i] - 1)
        listeDiviseursM = listeDesDiviseurs(M)
        nbDiviseursM = listeDiviseursM.length
      } while (nbDiviseursM < Math.max(2, nbDiviseursMax[i] - 3) || nbDiviseursM > nbDiviseursMax[i] || listeDesMDejaTrouves.indexOf(M) !== -1)
      listeDesMDejaTrouves.push(M)

      switch (typesDeQuestions) {
        case 1:
          texte = ''
          if (this.interactif) {
            texte += `À l'aide du tableau, écrire la liste de tous les diviseurs de $${texNombre(M)}$ <b>dans l'ordre croissant séparés par un point-virgule.</b>`
          } else {
            texte += `Compléter le tableau suivant et faire la liste de tous les diviseurs de ${texNombre(M)}.`
          }
          if (!context.isHtml) {
            texte += '$\\medskip$'
          }
          texte += '<br>'
          if (context.isHtml) {
            texte += '$\\def\\arraystretch{2.5}\\begin{array}{|c|c|c|}\n'
          } else {
            texte += '$\\begin{array}{|c|c|c|}\n'
          }
          texte += '\\hline\n'
          texte += `\\text{Facteur n°1} & \\text{Facteur n°2} & \\text{Produit donnant } ${M} \\\\\n`
          texte += '\\hline\n'

          if (nbDiviseursM % 2 === 0) { // si il y a un nombre pair de diviseurs
            for (let m = 0; m < (listeDesDiviseurs(M).length / 2); m++) {
              texte += texteOuPas(listeDesDiviseurs(M)[m]) + ' & ' + texteOuPas(listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - m - 1)]) + `& ${texteOuPas(M)} \\\\\n`
              texte += '\\hline\n'
            }
          } else { // sinon il est impair, cela n'arrive qu'avvec les carrés parfaits
            for (let m = 0; m < ((listeDesDiviseurs(M).length - 1) / 2); m++) {
              texte += texteOuPas(listeDesDiviseurs(M)[m]) + ' & ' + texteOuPas(listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - m - 1)]) + `& ${texteOuPas(M)} \\\\\n`
            }
            texte += texteOuPas(listeDesDiviseurs(M)[(nbDiviseursM - 1) / 2]) + ' & ' + texteOuPas(listeDesDiviseurs(M)[(nbDiviseursM - 1) / 2]) + `& ${texteOuPas(M)} \\\\\n`
            texte += '\\hline\n'
          }
          texte += '\\end{array}\n$'
          texte += '<br>'
          // correction
          texteCorr = `Le tableau suivant contient tous les couples de facteurs dont le produit vaut ${M}.`
          if (!context.isHtml) {
            texteCorr += '$\\medskip$'
          }
          texteCorr += '<br>'
          if (context.isHtml) {
            texteCorr += '$\\def\\arraystretch{2.5}\\begin{array}{|c|c|c|}\n'
          } else {
            texteCorr += '$\\begin{array}{|c|c|c|}\n'
          }
          texteCorr += '\\hline\n'
          texteCorr += `\\text{Facteur n°1} & \\text{Facteur n°2} & \\text{Produit donnant } ${M} \\\\\n`
          texteCorr += '\\hline\n'

          if (nbDiviseursM % 2 === 0) { // si il y a un nombre pair de diviseurs
            for (let m = 0; m < (listeDesDiviseurs(M).length / 2); m++) {
              texteCorr += listeDesDiviseurs(M)[m] + ' & ' + listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - m - 1)] + `& ${M} \\\\\n`
              texteCorr += '\\hline\n'
            }
          } else { // sinon il est impair, cela n'arrive qu'avvec les carrés parfaits
            for (let m = 0; m < ((listeDesDiviseurs(M).length - 1) / 2); m++) {
              texteCorr += listeDesDiviseurs(M)[m] + ' & ' + listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - m - 1)] + `& ${M} \\\\\n`
            }
            texteCorr += listeDesDiviseurs(M)[(nbDiviseursM - 1) / 2] + ' & ' + listeDesDiviseurs(M)[(nbDiviseursM - 1) / 2] + `& ${M} \\\\\n`
            texteCorr += '\\hline\n'
          }
          texteCorr += '\\end{array}\n$'
          if (!context.isHtml) {
            texteCorr += '$\\medskip$'
          }
          texteCorr += '<br>'
          texteCorr += `${M} a donc ${nbDiviseursM} diviseurs qui sont : `
          texteCorr += '1'
          for (let w = 1; w < listeDesDiviseurs(M).length; w++) {
            texteCorr += ' ; ' + listeDesDiviseurs(M)[w]
          }
          texteCorr += '.'
          break
        case 2: // liste des diviseurs
          texte = ''
          if (this.interactif) {
            texte += `Écrire la liste de tous les diviseurs de $${texNombre(M)}$ <b>dans l'ordre croissant séparés par un point-virgule.</b>`
          } else {
            texte += `Écrire la liste de tous les diviseurs de ${texNombre(M)}.`
          }
          texteCorr = `Pour trouver la liste des diviseurs de ${M}, on cherche tous les produits de deux facteurs qui donnent ${M}, en écrivant toujours le plus petit facteur en premier.<br>`
          texteCorr += `On vérifie si les nombres de 1 à ${Math.trunc(Math.sqrt(M))} sont des diviseurs de ${M} (inutile d’aller au-delà car $${1 + Math.trunc(Math.sqrt(M))} \\times ${1 + Math.trunc(Math.sqrt(M))} = ${(1 + Math.trunc(Math.sqrt(M))) ** 2})$, on trouve alors :<br>`
          // texteCorr += `Il est suffisant de chercher des diviseurs inférieurs au plus grand nombre dont le carré vaut ${M}, par exemple ici, ${Math.trunc(Math.sqrt(M))}$\\times $${Math.trunc(Math.sqrt(M))} = ${Math.trunc(Math.sqrt(M)) * Math.trunc(Math.sqrt(M))}<${M}`
          // texteCorr += ` et ${Math.trunc(Math.sqrt(M)) + 1}$\\times $${Math.trunc(Math.sqrt(M)) + 1} = ${(Math.trunc(Math.sqrt(M)) + 1) * (Math.trunc(Math.sqrt(M)) + 1)}>${M} donc il suffit d'arrêter la recherche de facteur à ${Math.trunc(Math.sqrt(M))}.`
          // texteCorr += ` En effet, si ${M} est le produit de deux entiers p et q  (p$\\times $q = ${M}) avec p < q alors, si p$\\times $p > ${M}, c'est que q$\\times $q < ${M} mais dans ce cas p serait supérieur à q sinon p$\\times $q serait inférieur à ${M} ce qui ne doit pas être le cas.<br>`
          if (listeDesDiviseurs(M).length % 2 === 0) { // si il y a un nombre pair de diviseurs
            for (let m = 0; m < (listeDesDiviseurs(M).length / 2); m++) {
              texteCorr += '' + listeDesDiviseurs(M)[m] + '$\\times $' + listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - m - 1)] + ` = ${M}<br>`
            }
          } else {
            for (let m = 0; m < ((listeDesDiviseurs(M).length - 1) / 2); m++) {
              texteCorr += '' + listeDesDiviseurs(M)[m] + '$\\times $' + listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - m - 1)] + '<br>'
            }
            texteCorr += '' + listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - 1) / 2] + '$\\times $' + listeDesDiviseurs(M)[(listeDesDiviseurs(M).length - 1) / 2] + ` = ${M}<br>`
          }
          texteCorr += `Chacun des facteurs de la liste ci-dessus est un diviseur de ${M}.<br>`
          texteCorr += `La liste des diviseurs de ${M} est donc `
          texteCorr += '1'
          for (let w = 1; w < listeDesDiviseurs(M).length; w++) {
            texteCorr += ' ; ' + listeDesDiviseurs(M)[w]
          }
          texteCorr += '.'
          break
      }
      setReponse(this, i, listeDesDiviseurs(M).join(';'), { formatInteractif: 'calcul' })
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte + '\n',
          propositions: [{ texte: texteCorr, statut: 5, sanscadre: false, pointilles: true, feedback: '' }]
        }
      }
      texte += ajouteChampTexteMathLive(this, i, 'largeur35 inline', { texteAvant: `<br> Les diviseurs de $${texNombre(M)}$ sont : ` })

      if (this.questionJamaisPosee(i, texte)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Nombre de chiffres des entiers (entre 1 et 5)', 'Nombres séparés par des tirets']
  this.besoinFormulaire2Texte = ['Nombre maximum de diviseurs des entiers', 'Nombres séparés par des tirets']
  this.besoinFormulaire4Texte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : Avec aide (tableau)',
      '2 : Sans Aide (tableau)',
      '3 : Mélange'
    ].join('\n')
  ]
}

/**
 * tire à pile ou face pour écrire ou non un texte
 * @param {string} texte
 * @author Sébastien Lozano
 */

function texteOuPas (texte) {
  const bool = randint(0, 1)
  if (bool === 0) {
    return '\\ldots'
  } else {
    return texte
  }
}
