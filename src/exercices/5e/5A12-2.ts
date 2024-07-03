import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { listeNombresPremiersStrictJusqua } from '../../lib/outils/primalite'
import Decimal from 'decimal.js'
import { egalOuApprox } from '../../lib/outils/ecritures'
import { texNombre } from '../../lib/outils/texNombre'
import { context } from '../../modules/context'
import { propositionsQcm } from '../../lib/interactif/qcm'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Déterminer si un nombre est premier'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '11/07/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '27/01/2024' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Description didactique de l'exercice:
 * Dire si un nombre est premier : Un nombre premier inférieur à 30, Un nombre premier entre 30 et 500,
 * un produit de nombres premiers inférieur à 30 : tester les divisions
 * @author Olivier Mimeau
 * Refonte de l'exercice et ajout de la possibilité de choisir le plus grand nombre possible par Guillaume Valmont le 27/01/2024
 * Référence 5A12-2
*/
export const uuid = '03d65'
export const ref = '5A12-2'
export const refs = {
  'fr-fr': ['5A12-2'],
  'fr-ch': ['9NO4-14']
}
export default class PremierOuPas extends Exercice {
  constructor () {
    super()
    this.consigneCorrection = 'Il faut mémoriser la liste des nombres premiers inférieurs à $30$ : $2, 3, 5, 7, 11, 13, 17, 19, 23$ et $29$.'
    this.besoinFormulaireNumerique = ['Plus grand nombre possible', 10000]
    this.sup = 500
    this.nbQuestions = 3
    this.nbCols = 2
    this.nbColsCorr = 2
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const max = Number(this.sup) > 1 ? Number(this.sup) : 100

    const typeQuestionsDisponibles = ['oui', 'non']
    const listePremiers = listeNombresPremiersStrictJusqua(max + 1)

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let nombreATrouver: number = 0
      switch (listeTypeQuestions[i]) {
        case 'oui': {
          nombreATrouver = listePremiers[randint(0, listePremiers.length - 1)]
          if (nombreATrouver < 30) {
            texteCorr = `$${nombreATrouver}$ est un nombre premier qui fait partie de la liste à apprendre.`
          } else {
            const racineNombreATrouver = Math.sqrt(nombreATrouver)
            texteCorr = `$${nombreATrouver}$ est un nombre premier.<br>`
            texteCorr += `En effet, on teste les divisions de $${nombreATrouver}$ par les nombres premiers dans l'ordre :<br>`
            const { txt } = EcritListeDivisions(nombreATrouver, racineNombreATrouver)
            texteCorr += txt
            const nb1 = listePremiers.find(el => el > racineNombreATrouver) ?? Math.max(...listePremiers)
            texteCorr += `$${nombreATrouver} \\div  ${nb1}$ `
            const rsltTemp = new Decimal(nombreATrouver).div(nb1)
            texteCorr += `$${egalOuApprox(rsltTemp.toNumber(), 2)}$ $${texNombre(rsltTemp, 2)}$`
            texteCorr += ` et $${texNombre(rsltTemp, 2)} < ${nb1}$, donc on peut arrêter de chercher.<br>`
            texteCorr += `$${nombreATrouver}$ n'a donc pas d'autres diviseurs que $1$ et lui même.`
          }
          break
        }
        case 'non': {
          nombreATrouver = randint(0, max, listePremiers)
          if (nombreATrouver === 0) {
            texteCorr = '$0$ a plus que deux diviseurs (il est divisible par 1, par 2, par 3, par 4, ...) et n\'est donc pas un nombre premier.'
          } else if (nombreATrouver === 1) {
            texteCorr = '$1$ n\'a qu\'un seul diviseur (lui-même) et n\'est donc pas un nombre premier.'
          } else {
            const { txt, rsltDiv } = EcritListeDivisions(nombreATrouver)
            const quotient = new Decimal(nombreATrouver).div(rsltDiv)
            texteCorr = `$${nombreATrouver}$ n'est pas un nombre premier`
            if ((nombreATrouver !== 49) && (nombreATrouver !== 77)) {
              texteCorr += `.<br>En effet, on teste les divisions de $${nombreATrouver}$ par les nombres premiers  dans l'ordre :<br> `
              texteCorr += txt
              texteCorr += `La dernière division permet d'écrire $${nombreATrouver} = ${rsltDiv} \\times ${quotient}$.<br>`
              texteCorr += `$${nombreATrouver}$ a donc d'autres diviseurs que $1$ et lui même.`
            } else {
              texteCorr += `, car $${nombreATrouver} = ${rsltDiv} \\times ${quotient}$.`
            }
          }
          break
        }
      }
      if (context.isDiaporama) {
        texte = `${nombreATrouver} est un nombre premier.<br>Vrai ou Faux ?`
      } else {
        if (this.interactif) {
          texte = `${nombreATrouver} est un nombre premier.`
        } else {
          texte = `${nombreATrouver} est-il un nombre premier ?`
        }
      }
      this.autoCorrection[i] = {
        enonce: `${nombreATrouver}`,
        propositions: [
          {
            texte: 'Vrai',
            statut: listeTypeQuestions[i] === 'oui'
          },
          {
            texte: 'Faux',
            statut: listeTypeQuestions[i] === 'non'
          }
        ],
        options: {
          ordered: true
        }
      }
      if (this.questionJamaisPosee(i, texte)) {
        const props = propositionsQcm(this, i)
        if (this.interactif) {
          texte += props.texte
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    function EcritListeDivisions (dividende: number, nombreMax?: number) {
      let ind
      let rsltDiv: Decimal = new Decimal(dividende + 1)
      let txt
      ind = 0
      txt = ''
      do {
        txt += `$${dividende} \\div  ${listePremiers[ind]}$ `
        rsltDiv = new Decimal(dividende).div(listePremiers[ind])
        txt += `$${egalOuApprox(rsltDiv.toNumber(), 2)}$ $${texNombre(rsltDiv, 2)}$<br>`
        ind = ind + 1
      } while (nombreMax ? listePremiers[ind] <= nombreMax : !rsltDiv.equals(Math.floor(rsltDiv.toNumber())))
      return { txt, rsltDiv }
    }
  }
}
