import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Encadrer une racine carrée et en donner un arrondi'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Encadrer une racine carrée et en donner une valeur approchée
 * @author Guillaume Valmont  (Amélioration AMC par Eric Elter)
 * Référence 4G20-6
 * Date de publication : 08/08/2021
 */
export const uuid = '516d1'
export const ref = '4G20-6'
export const refs = {
  'fr-fr': ['4G20-6'],
  'fr-ch': ['10NO3-4']
}
export default function CalculValeurApprocheeRacineCarree () {
  Exercice.call(this)
  this.nbQuestions = 6

  this.nbCols = 2
  this.nbColsCorr = 2
  this.tailleDiaporama = 3
  this.video = ''
  this.besoinFormulaireNumerique = ['Avec ou sans calculatrice', 3, '1 : Avec calculatrice\n2 : Sans calculatrice\n3 : Mélange']
  this.besoinFormulaire2Numerique = ['Choix des corrections', 2, '1 : Collège\n2 : Lycée']
  this.sup = 3
  this.sup2 = 1
  this.nouvelleVersion = function () {
    this.autoCorrection = []
    this.listeQuestions = []
    this.listeCorrections = []
    this.sup = parseInt(this.sup)
    let listeAvecOuSansCalculatrice
    if (this.sup === 1) {
      listeAvecOuSansCalculatrice = ['avec']
    } else if (this.sup === 2) {
      listeAvecOuSansCalculatrice = ['sans']
    } else {
      listeAvecOuSansCalculatrice = ['avec', 'sans']
    }
    listeAvecOuSansCalculatrice = combinaisonListes(listeAvecOuSansCalculatrice, this.nbQuestions)
    const typeQuestionsDisponibles = ['unite', 'dixieme', 'centieme']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, indexRep = 0, type, a, nbDec, reponse, pasReponse, reponseG, reponseD, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (listeAvecOuSansCalculatrice[i] === 'avec') {
        a = randint(2, 300, [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289])
        switch (listeTypeQuestions[i]) {
          case 'unite':
            type = 'à l\'unité'
            reponse = texNombre(Math.sqrt(a), 0)
            reponseG = texNombre(Math.floor(Math.sqrt(a)), 0)
            reponseD = texNombre(Math.ceil(Math.sqrt(a)), 0)
            setReponse(this, indexRep, Math.round(Math.sqrt(a)))
            nbDec = 0
            break
          case 'dixieme':
            type = 'au dixième'
            reponse = texNombre(Math.sqrt(a), 1)
            reponseG = texNombre(Math.floor(Math.sqrt(a) * 10) / 10, 1)
            reponseD = texNombre(Math.ceil(Math.sqrt(a) * 10) / 10, 1)
            setReponse(this, indexRep, Math.sqrt(a).toFixed(1))
            nbDec = 1
            break
          case 'centieme':
            type = 'au centième'
            reponse = texNombre(Math.sqrt(a), 2)
            reponseG = texNombre(Math.floor(Math.sqrt(a) * 100) / 100, 2)
            reponseD = texNombre(Math.ceil(Math.sqrt(a) * 100) / 100, 2)
            setReponse(this, indexRep, Math.sqrt(a).toFixed(2))
            nbDec = 2
            break
        }
        if (reponse === reponseG) pasReponse = reponseD
        else pasReponse = reponseG
        if (!this.interactif) {
          texte = `Encadrer $\\sqrt{${a}}$ ${type} près et en donner un arrondi ${type} près.`
        } else {
          texte = `Donner la valeur arrondie de $\\sqrt{${a}}$ ${type} près : `
          texte += ajouteChampTexteMathLive(this, indexRep, '')
        }
        texteCorr = `$\\sqrt{${a}} \\simeq ${texNombre(Math.sqrt(a), 6)}$.<br>`
        texteCorr += `Or $${reponseG} < ${texNombre(Math.sqrt(a), 6)} < ${reponseD}$,<br>`
        texteCorr += `et $${texNombre(Math.sqrt(a), 6)}$ est plus proche de $${reponse}$ que de $${pasReponse}$.<br>`
        texteCorr += `Donc l'arrondi ${type} près de $\\sqrt{${a}}$ est $${reponse}$.`
      } else if (listeAvecOuSansCalculatrice[i] === 'sans') {
        a = randint(2, 143, [4, 9, 16, 25, 36, 49, 64, 81, 100, 121])
        reponseG = Math.floor(Math.sqrt(a))
        reponseD = Math.ceil(Math.sqrt(a))
        texte = `Sans utiliser de calculatrice, encadrer $\\sqrt{${a}}$ entre deux nombres entiers consécutifs.<br>`
        if (this.interactif) {
          texte += ajouteChampTexteMathLive(this, indexRep, '')
          texte += ` $< \\sqrt{${a}} <$ `
          texte += ajouteChampTexteMathLive(this, indexRep + 1, '')
          setReponse(this, indexRep, reponseG)
          setReponse(this, indexRep + 1, reponseD)
        }
        texteCorr = `$${reponseG}^2 = ${reponseG ** 2}$ et $${reponseD}^2 = ${reponseD ** 2}$.<br>`
        texteCorr += `Or $${reponseG ** 2} < ${a} < ${reponseD ** 2}$,<br>`
        if (this.sup2 === 1) {
          texteCorr += `donc $\\sqrt{${reponseG ** 2}} < \\sqrt{${a}} < \\sqrt{${reponseD ** 2}}$,<br>`
        } else { texteCorr += `donc $\\sqrt{${reponseG ** 2}} < \\sqrt{${a}} < \\sqrt{${reponseD ** 2}}$ puisque la fonction racine carrée est strictement croissante sur $\\mathbb{R}_+$,<br>` }
        texteCorr += `enfin $${reponseG} < \\sqrt{${a}} < ${reponseD}$.`
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        if (context.isAmc) {
          if (listeAvecOuSansCalculatrice[i] === 'avec') {
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCOpen',
                  propositions: [{
                    texte: texteCorr,
                    enonce: `À l'aide de la calculatrice, donner un encadrement de $\\sqrt{${a}}$ ${type} près puis la valeur arrondie ${type} près: \\\\`,
                    statut: 1
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: `arrondi de $\\sqrt{${a}}$ ${type} près :`,
                      valeur: [parseFloat(reponse.replaceAll(',', '.'))],
                      param: {
                        digits: nombreDeChiffresDansLaPartieEntiere(parseFloat(reponse.replaceAll(',', '.'))) + nbDec,
                        decimals: nbDec,
                        signe: false,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          } else {
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCOpen',
                  propositions: [{
                    texte: texteCorr,
                    enonce: `Sans utiliser de calculatrice, encadrer $\\sqrt{${a}}$ entre deux nombres entiers.\\\\`,
                    statut: 2
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'Entier inférieur',
                      valeur: [reponseG],
                      param: {
                        digits: nombreDeChiffresDansLaPartieEntiere(reponseG),
                        decimals: 0,
                        signe: false,
                        approx: 0
                      }
                    }
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'Entier supérieur',
                      valeur: [reponseD],
                      param: {
                        digits: nombreDeChiffresDansLaPartieEntiere(reponseD),
                        decimals: 0,
                        signe: false,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          }
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (listeAvecOuSansCalculatrice[i] === 'avec') {
          indexRep++
        } else {
          indexRep += 2
        }

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
