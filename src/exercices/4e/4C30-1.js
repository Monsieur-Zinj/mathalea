import { choice } from '../../lib/outils/arrayOutils.js'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { calcul, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const dateDeModifImportante = '05/09/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Encadrer des nombres positifs avec des puissances de 10'

/**
 * Encadrer par des puissances de 10
 * 4C30-1
 * @author Sébastien Lozano (Modifications apportées par Eric Elter)
 */
export const uuid = '760d7'
export const ref = '4C30-1'
export default function PuissancesEncadrement () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = 4
  this.nbQuestions = 5

  this.nbCols = 1
  this.nbColsCorr = 1
  this.classe = 4
  this.nouvelleVersion = function () {
    const listeTypeDeQuestions = []
    let signeChange
    this.consigne = this.nbQuestions === 1
      ? 'Encadrer le nombre suivant par deux puissances de 10 d\'exposants consécutifs.'
      : 'Encadrer les nombres suivants par deux puissances de 10 d\'exposants consécutifs.'

    signeChange = this.level === 2

    const typeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: this.classe === 4 ? 3 : 4,
      melange: this.classe === 4 ? 4 : 5,
      defaut: 1,
      nbQuestions: this.nbQuestions
    })
    for (let ee = 0; ee < this.nbQuestions; ee++) {
      switch (typeDeQuestions[ee]) {
        case 1: // nombre enier positif
          listeTypeDeQuestions.push(choice([1, 2, 3, 4, 5, 6]))
          break
        case 2: // nombre décimal positif
          listeTypeDeQuestions.push(choice([7, 8, 9, 10]))
          break
        case 3: // nombre décimal positif inférieur à 1
          listeTypeDeQuestions.push(choice([11, 12, 13, 14]))
          break
        case 4: // Mélange
          listeTypeDeQuestions.push(choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]))
          signeChange = true
          break
      }
    }
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    for (
      let i = 0, signe, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      // nombre entier positif, entre 1 et 10, puis 10 et 100 puis ....100 000 et 1 000 000
      const entPos = []
      const nombreEntier = []
      const nombreDecimal = []
      const nombreDecInfUn = []
      for (let i = 0; i < 6; i++) {
        signe = signeChange ? choice([-1, 1]) : 1
        entPos.push({
          val: `${texNombre(signe * randint(10 ** i + 1, 10 ** (i + 1) - 1))}`,
          puissance_inf: signe === 1 ? `10^{${i}}` : `-10^{${i + 1}}`,
          puissance_sup: signe === 1 ? `10^{${i + 1}}` : `-10^{${i}}`,
          puissance_inf_num: signe === 1 ? `${texNombre(10 ** i)}` : `${texNombre(-1 * 10 ** (i + 1))}`,
          puissance_sup_num: signe === 1 ? `${texNombre(10 ** (i + 1))}` : `${texNombre(-1 * 10 ** i)}`
        })
        nombreEntier.push(signe * randint(10 ** i + 1, 10 ** (i + 1)))
      }

      // nombre décimal positif 1 et 10 000 avec 1,2,3 puis 4 décimales
      const decPos = []
      for (let i = 0; i < 4; i++) {
        decPos.push({
          val: `${texNombre(calcul(signe * randint(10001, 99999) / 10 ** (4 - i)))}`,
          puissance_inf: signe === 1 ? `10^{${i}}` : `-10^{${i + 1}}`,
          puissance_sup: signe === 1 ? `10^{${i + 1}}` : `-10^{${i}}`,
          puissance_inf_num: signe === 1 ? `${texNombre(10 ** i)}` : `${texNombre(-1 * 10 ** (i + 1))}`,
          puissance_sup_num: signe === 1 ? `${texNombre(10 ** (i + 1))}` : `${texNombre(-1 * 10 ** i)}`
        })
        nombreDecimal.push(calcul(signe * randint(10001, 99999) / 10 ** (4 - i)))
      }
      // nombre décimal positif inférieur à 1, entre 0,1 et 1 puis entre 0,01 et 0,1 puis 0,001 et 0,0001
      const decPosInfUn = []
      for (let i = 0; i < 4; i++) {
        decPosInfUn.push({
          val: `${texNombre(calcul(signe * randint(10 ** (4 - i - 1) + 1, 10 ** (4 - i) - 1) / 10000))}`,
          puissance_inf: signe === 1 ? `10^{${-(i + 1)}}` : `-10^{${-i}}`,
          puissance_sup: signe === 1 ? `10^{${-i}}` : `-10^{${-(i + 1)}}`,
          puissance_inf_num: signe === 1 ? `${texNombre(calcul(10 ** -(i + 1)))}` : `${texNombre(calcul(-1 * 10 ** -i))}`,
          puissance_sup_num: signe === 1 ? `${texNombre(calcul(10 ** -i))}` : `${texNombre(calcul(-1 * 10 ** -(i + 1)))}`
        })
        nombreDecInfUn.push(calcul(randint(signe * 10 ** (4 - i - 1) + 1, 10 ** (4 - i)) / 10000))
      }
      if (listeTypeDeQuestions[i] < 7) { // nombre entier positif
        texte = this.interactif
          ? ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texteApres: sp(10) }) + `$\\leqslant ${entPos[listeTypeDeQuestions[i] - 1].val}\\leqslant $` + ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline')
          : `$\\dots\\dots\\dots${sp(1)}\\leqslant ${entPos[listeTypeDeQuestions[i] - 1].val}\\leqslant${sp(1)}\\dots\\dots\\dots$`
        setReponse(this, 2 * i, entPos[listeTypeDeQuestions[i] - 1].puissance_inf, { formatInteractif: 'puissance' })
        setReponse(this, 2 * i + 1, entPos[listeTypeDeQuestions[i] - 1].puissance_sup, { formatInteractif: 'puissance' })
        texteCorr = `$${entPos[listeTypeDeQuestions[i] - 1].puissance_inf} \\leqslant ${entPos[listeTypeDeQuestions[i] - 1].val} \\leqslant ${entPos[listeTypeDeQuestions[i] - 1].puissance_sup}$`
        texteCorr += ` car $${entPos[listeTypeDeQuestions[i] - 1].puissance_inf} = ${entPos[listeTypeDeQuestions[i] - 1].puissance_inf_num}$ et $${entPos[listeTypeDeQuestions[i] - 1].puissance_sup} = ${entPos[listeTypeDeQuestions[i] - 1].puissance_sup_num}.$`
      } else if (listeTypeDeQuestions[i] < 11) { // nombre décimal positif
        texte = this.interactif
          ? ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texteApres: sp(10) }) + `$\\leqslant ${decPos[listeTypeDeQuestions[i] - 7].val}\\leqslant $` + ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline')
          : `$\\dots\\dots\\dots${sp(1)}\\leqslant ${decPos[listeTypeDeQuestions[i] - 7].val}\\leqslant${sp(1)}\\dots\\dots\\dots$`
        setReponse(this, 2 * i, decPos[listeTypeDeQuestions[i] - 7].puissance_inf, { formatInteractif: 'puissance' })
        setReponse(this, 2 * i + 1, decPos[listeTypeDeQuestions[i] - 7].puissance_sup, { formatInteractif: 'puissance' })
        texteCorr = `$${decPos[listeTypeDeQuestions[i] - 7].puissance_inf} \\leqslant ${decPos[listeTypeDeQuestions[i] - 7].val} \\leqslant ${decPos[listeTypeDeQuestions[i] - 7].puissance_sup}$`
        texteCorr += ` car $${decPos[listeTypeDeQuestions[i] - 7].puissance_inf} = ${decPos[listeTypeDeQuestions[i] - 7].puissance_inf_num}$ et $${decPos[listeTypeDeQuestions[i] - 7].puissance_sup} = ${decPos[listeTypeDeQuestions[i] - 7].puissance_sup_num}.$`
      } else { // nombre décimal positif inferieur à 1
        texte = this.interactif
          ? ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texteApres: sp(10) }) + `$\\leqslant ${decPosInfUn[listeTypeDeQuestions[i] - 11].val}\\leqslant $` + ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline')
          : `$\\dots\\dots\\dots${sp(1)}\\leqslant ${decPosInfUn[listeTypeDeQuestions[i] - 11].val}\\leqslant${sp(1)}\\dots\\dots\\dots$`
        setReponse(this, 2 * i, decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_inf, { formatInteractif: 'puissance' })
        setReponse(this, 2 * i + 1, decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_sup, { formatInteractif: 'puissance' })
        texteCorr = `$${decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_inf} \\leqslant ${decPosInfUn[listeTypeDeQuestions[i] - 11].val} \\leqslant ${decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_sup}$`
        texteCorr += ` car $${decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_inf} = ${decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_inf_num}$ et $${decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_sup} = ${decPosInfUn[listeTypeDeQuestions[i] - 11].puissance_sup_num}.$`
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // ToDo pour les exercices interactifs vérifier l'unicité des questions
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  this.besoinFormulaireTexte = [
    'Niveau de difficulté',
    'Nombres séparés par des tirets\n1 : Nombre entier positif\n2 : Nombre décimal positif\n3 : Nombre entier positif inférieur à 1\n4 : Mélange'
  ]
}
