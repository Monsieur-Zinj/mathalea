import { droiteGraduee } from '../../lib/2d/reperes.js'
import { shuffle } from '../../lib/outils/arrayOutils'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import {
  nombreDeChiffresDansLaPartieDecimale,
  nombreDeChiffresDansLaPartieEntiere,
  nombreDeChiffresDe
} from '../../lib/outils/nombres'
import { numAlpha, sp } from '../../lib/outils/outilString.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { fraction } from '../../modules/fractions.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Lire des abscisses décimales sous trois formes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const dateDeModifImportante = '22/11/2022'
/**
 * @author Jean-Claude Lhote (sauf erreur de ma part)
 * amélioré par Eric Elter
 * Trois points sont placés sur un droite graduée
 * Il faut donner leurs abscisses respectives
 * Trois formes sont demandées : décimale, fraction décimale, décomposition partie entière + partie décimale fractionnaire.
 * 6N23-2
 */
export const uuid = '12773'
export const ref = '6N23-2'
export const refs = {
  'fr-fr': ['6N23-2'],
  'fr-ch': ['9NO11-7']
}
export default function LireAbscisseDecimaleTroisFormes () {
  Exercice.call(this)
  this.niveau = 'sixième'
  this.consigne = ''
  if (context.isHtml) {
    this.spacing = 2
    this.spacingCorr = 3
  } else {
    this.spacing = 1
    this.spacingCorr = 1
  }
  this.vspace = -1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.nbQuestions = 1
  // this.nbQuestionsModifiable = false

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let d1
      let extremite
      const noms = choisitLettresDifferentes(3, 'Q')
      let x1 = 0
      let x2 = 0
      let x3 = 0
      let thickOff
      let tableau = []
      let xmin
      let xmax
      let unite
      if (this.sup === 1) {
        if (this.niveau === 'CM') {
          xmin = 0
          thickOff = 0
        } else {
          xmin = randint(1, 15)
          thickOff = calculANePlusJamaisUtiliser(2 / (10 ** (parseInt(this.sup))))
        }
        if (xmin === 0) extremite = '|->'
        else extremite = '->'
        xmax = xmin + 9
        x1 = xmin * 10 + randint(0, 2) * 10 + randint(2, 8)
        x2 = xmin * 10 + randint(3, 5) * 10 + randint(2, 8)
        x3 = xmin * 10 + randint(6, 8) * 10 + randint(2, 8)
        x1 = calculANePlusJamaisUtiliser(x1 / 10)
        x2 = calculANePlusJamaisUtiliser(x2 / 10)
        x3 = calculANePlusJamaisUtiliser(x3 / 10)

        tableau = shuffle([x1, x2, x3])
        x1 = tableau[0]
        x2 = tableau[1]
        x3 = tableau[2]
        unite = 3
        d1 = droiteGraduee({
          x: 0,
          y: 0,
          Min: xmin,
          axePosition: 'H',
          Max: xmax,
          thickSec: true,
          thickTer: false,
          Unite: unite,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          pointListe: [[x1, `${noms[0]}`], [x2, `${noms[1]}`], [x3, `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        const texte1 = `${numAlpha(0)} Donner l'abscisse de $${noms[0]}$ en écriture décimale.`
        texte = texte1 + ajouteChampTexteMathLive(this, i * 4, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[0]}($`,
          texteApres: `$${sp(1)})$`
        })
        texte += `<br>${numAlpha(1)} Donner l'abscisse de $${noms[1]}$ comme la somme d'un nombre entier et d'une fraction décimale inférieure à 1.` + ajouteChampTexteMathLive(this, i * 4 + 1, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[1]}($`,
          texteApres: `$${sp(2)}+$`
        }) + ajouteChampTexteMathLive(this, i * 4 + 2, 'largeur10 inline nospacebefore', { texteApres: `$${sp(1)})$` })
        let texte3 = `Donner l'abscisse de $${noms[2]}$ sous la forme d'une fraction décimale.`
        texte += `<br>${numAlpha(2)} ` + texte3 + ajouteChampTexteMathLive(this, i * 4 + 3, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[2]}($`,
          texteApres: `$${sp(1)})$`
        })
        texte3 = `${numAlpha(1)} ` + texte3
        texteCorr = `${numAlpha(0)} L'abscisse de $${noms[0]}$ est : $${texNombre(x1)}$.<br>`
        texteCorr += `${numAlpha(1)} L'abscisse de $${noms[1]}$ est : $${texNombre(Math.floor(x2))} + ${texFractionFromString(calculANePlusJamaisUtiliser(10 * (x2 - Math.floor(x2))), 10)}$.<br>`
        texteCorr += `${numAlpha(2)} L'abscisse de $${noms[2]}$ est : $${texFractionFromString(calculANePlusJamaisUtiliser(x3 * 10), 10)}$.`
        if (!context.isAmc) {
          setReponse(this, 0, x1, { formatInteractif: 'calcul' })
          setReponse(this, 1, Math.floor(x2), { formatInteractif: 'calcul' })
          setReponse(this, 2, fraction(calculANePlusJamaisUtiliser(10 * (x2 - Math.floor(x2))), 10), { formatInteractif: 'fraction' })
          setReponse(this, 3, fraction(calculANePlusJamaisUtiliser(x3 * 10), 10), { formatInteractif: 'fraction' })
        } else {
          this.autoCorrection[i] = {
            enonce: '', // on le remplira à la fin.
            options: { multicols: true, barreseparation: true },
            propositions: [
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: texteCorr,
                  statut: '',
                  reponse: {
                    texteAvant: texte1,
                    valeur: x1,
                    param: {
                      digits: nombreDeChiffresDe(x1),
                      decimals: nombreDeChiffresDansLaPartieDecimale(x1),
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: texte3,
                    valeur: new FractionEtendue(10 * x3, 10),
                    param: {
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(x3) + 1,
                      digitsDen: 3,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: `${numAlpha(2)} Donner la partie entière de l'abscisse de $${noms[1]}$.`,
                    valeur: Math.floor(x2),
                    param: {
                      digits: nombreDeChiffresDansLaPartieEntiere(Math.floor(x2)) + 1,
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
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: `${numAlpha(3)} Donner la partie décimale de l'abscisse de $${noms[1]}$.`,
                    valeur: new FractionEtendue(calculANePlusJamaisUtiliser(10 * (x2 - Math.floor(x2))), 10),
                    param: {
                      digits: nombreDeChiffresDansLaPartieEntiere(calculANePlusJamaisUtiliser(10 * (x2 - Math.floor(x2)))),
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(calculANePlusJamaisUtiliser(10 * (x2 - Math.floor(x2)))),
                      digitsDen: 2,
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
      } else if (this.sup === 2) {
        if (this.niveau === 'CM') {
          xmin = 0
          thickOff = 0
        } else {
          xmin = randint(1, 15) - 0.1
          thickOff = calculANePlusJamaisUtiliser(2 / (10 ** (parseInt(this.sup))))
        }
        if (xmin === 0) extremite = '|->'
        else extremite = '->'
        xmax = calculANePlusJamaisUtiliser(xmin + 1.5)
        x1 = 10 + xmin * 100 + randint(1, 3) * 10 + randint(2, 8)
        x2 = 10 + xmin * 100 + randint(4, 6) * 10 + randint(2, 8)
        x3 = 10 + xmin * 100 + randint(7, 9) * 10 + randint(2, 8)

        x1 = calculANePlusJamaisUtiliser(x1 / 100)
        x2 = calculANePlusJamaisUtiliser(x2 / 100)
        x3 = calculANePlusJamaisUtiliser(x3 / 100)
        tableau = shuffle([x1, x2, x3])
        x1 = tableau[0]
        x2 = tableau[1]
        x3 = tableau[2]
        unite = 20
        d1 = droiteGraduee({
          x: 0,
          y: 0,
          Min: xmin,
          axePosition: 'H',
          Max: xmax,
          thickSec: true,
          thickTer: true,
          Unite: unite,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          pointListe: [[x1, `${noms[0]}`], [x2, `${noms[1]}`], [x3, `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        const texte1 = `${numAlpha(0)} Donner l'abscisse de $${noms[0]}$ en écriture décimale.`
        texte = texte1 + ajouteChampTexteMathLive(this, i * 4, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[0]}($`,
          texteApres: `$${sp(1)})$`
        })
        texte += `<br>${numAlpha(1)} Donner l'abscisse de $${noms[1]}$ comme la somme d'un entier et d'une fraction décimale inférieure à 1.` + ajouteChampTexteMathLive(this, i * 4 + 1, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[1]}($`,
          texteApres: `$${sp(2)}+$`
        }) + ajouteChampTexteMathLive(this, i * 4 + 2, 'largeur10 inline nospacebefore', { texteApres: `$${sp(1)})$` })
        let texte3 = `Donner l'abscisse de $${noms[2]}$ sous la forme d'une fraction décimale.`
        texte += `<br>${numAlpha(2)} ` + texte3 + ajouteChampTexteMathLive(this, i * 4 + 3, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[2]}($`,
          texteApres: `$${sp(1)})$`
        })
        texte3 = `${numAlpha(1)} ` + texte3
        texteCorr = `${numAlpha(0)} L'abscisse de $${noms[0]}$ est : $${texNombre(x1)}$.<br>`
        texteCorr += `${numAlpha(1)} L'abscisse de $${noms[1]}$ est : $${texNombre(Math.floor(x2))} + ${texFractionFromString(calculANePlusJamaisUtiliser(100 * (x2 - Math.floor(x2))), 100)}$.<br>`
        texteCorr += `${numAlpha(2)} L'abscisse de $${noms[2]}$ est : $${texFractionFromString(calculANePlusJamaisUtiliser(x3 * 100), 100)}$.`
        if (!context.isAmc) {
          setReponse(this, 0, x1)
          setReponse(this, 1, Math.floor(x2))
          setReponse(this, 2, fraction(calculANePlusJamaisUtiliser(100 * (x2 - Math.floor(x2))), 100), { formatInteractif: 'fraction' })
          setReponse(this, 3, fraction(calculANePlusJamaisUtiliser(x3 * 100), 100), { formatInteractif: 'fraction' })
        } else {
          this.autoCorrection[i] = {
            enonce: '', // on le remplira à la fin.
            options: { multicols: true, barreseparation: true },
            propositions: [
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: texteCorr,
                  statut: '',
                  reponse: {
                    texteAvant: texte1,
                    valeur: x1,
                    param: {
                      digits: nombreDeChiffresDe(x1),
                      decimals: nombreDeChiffresDansLaPartieDecimale(x1),
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: texte3,
                    valeur: new FractionEtendue(100 * x3, 100),
                    param: {
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(100 * x3) + 1,
                      digitsDen: 4,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: `${numAlpha(2)} Donner la partie entière de l'abscisse de $${noms[1]}$.`,
                    valeur: Math.floor(x2),
                    param: {
                      digits: nombreDeChiffresDansLaPartieEntiere(Math.floor(x2)) + 1,
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
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: `${numAlpha(3)} Donner la partie décimale de l'abscisse de $${noms[1]}$.`,
                    valeur: new FractionEtendue(calculANePlusJamaisUtiliser(100 * (x2 - Math.floor(x2))), 100),
                    param: {
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(calculANePlusJamaisUtiliser(100 * (x2 - Math.floor(x2)))),
                      digitsDen: 3,
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
      } else if (this.sup === 3) {
        if (this.niveau === 'CM') {
          xmin = 0
          thickOff = 0
        } else {
          xmin = calculANePlusJamaisUtiliser(randint(0, 15) + randint(0, 9) * 0.1)
          thickOff = calculANePlusJamaisUtiliser(2 / (10 ** (parseInt(this.sup))))
        }
        if (xmin === 0) extremite = '|->'
        else extremite = '->'
        xmax = calculANePlusJamaisUtiliser(xmin + 0.15)

        x1 = xmin * 1000 + randint(1, 5) * 10 + randint(2, 8)
        x2 = xmin * 1000 + randint(6, 9) * 10 + randint(2, 8)
        x3 = xmin * 1000 + randint(11, 14) * 10 + randint(2, 8)
        x1 = calculANePlusJamaisUtiliser(x1 / 1000)
        x2 = calculANePlusJamaisUtiliser(x2 / 1000)
        x3 = calculANePlusJamaisUtiliser(x3 / 1000)

        tableau = shuffle([x1, x2, x3])
        x1 = tableau[0]
        x2 = tableau[1]
        x3 = tableau[2]
        unite = 200
        d1 = droiteGraduee({
          x: 0,
          y: 0,
          Min: xmin,
          axePosition: 'H',
          Max: xmax,
          thickSec: true,
          thickTer: true,
          Unite: unite,
          thickOffset: thickOff,
          thickDistance: 0.1,
          thickSecDist: 0.01,
          thickTerDist: 0.001,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          pointListe: [[x1, `${noms[0]}`], [x2, `${noms[1]}`], [x3, `${noms[2]}`]],
          labelListe: [[xmin + 0.09, stringNombre(xmin + 0.09, 2)], [xmin + 0.1, stringNombre(xmin + 0.1, 1)]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })

        const texte1 = `${numAlpha(0)} Donner l'abscisse de $${noms[0]}$ en écriture décimale.`
        texte = texte1 + ajouteChampTexteMathLive(this, i * 4, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[0]}($`,
          texteApres: `$${sp(1)})$`
        })
        texte += `<br>${numAlpha(1)} Donner l'abscisse de ${noms[1]} comme la somme d'un entier et d'une fraction décimale inférieure à 1.` + ajouteChampTexteMathLive(this, i * 4 + 1, 'largeur10 inline nospacebefore', {
          texteAvant: ` ${noms[1]}(`,
          texteApres: `$${sp(2)}+$`
        }) + ajouteChampTexteMathLive(this, i * 4 + 2, 'largeur10 inline nospacebefore', { texteApres: ')' })
        let texte3 = `Donner l'abscisse de $${noms[2]}$ sous la forme d'une fraction décimale.`
        texte += `<br>${numAlpha(2)} ` + texte3 + ajouteChampTexteMathLive(this, i * 4 + 3, 'largeur10 inline nospacebefore', {
          texteAvant: `${sp(10)} $${noms[2]}($`,
          texteApres: `$${sp(1)})$`
        })
        texte3 = `${numAlpha(1)} ` + texte3
        texteCorr = `${numAlpha(0)} L'abscisse de ${noms[0]} est : $${texNombre(x1)}$.<br>`
        texteCorr += `${numAlpha(1)} L'abscisse de ${noms[1]} est : $${texNombre(Math.floor(x2))} + ${texFractionFromString(calculANePlusJamaisUtiliser(1000 * (x2 - Math.floor(x2))), 1000)}$.<br>`
        texteCorr += `${numAlpha(2)} L'abscisse de ${noms[2]} est : $${texFractionFromString(calculANePlusJamaisUtiliser(x3 * 1000), 1000)}$.`
        if (!context.isAmc) {
          setReponse(this, 0, x1)
          setReponse(this, 1, Math.floor(x2))
          setReponse(this, 2, fraction(calculANePlusJamaisUtiliser(1000 * (x2 - Math.floor(x2))), 1000), { formatInteractif: 'fraction' })
          setReponse(this, 3, fraction(calculANePlusJamaisUtiliser(x3 * 1000), 1000), { formatInteractif: 'fraction' })
        } else {
          this.autoCorrection[i] = {
            enonce: '', // on le remplira à la fin.
            options: { multicols: true, barreseparation: true },
            propositions: [
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: texteCorr,
                  statut: '',
                  reponse: {
                    texteAvant: texte1,
                    valeur: x1,
                    param: {
                      digits: nombreDeChiffresDe(x1),
                      decimals: nombreDeChiffresDansLaPartieDecimale(x1),
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: texte3,
                    valeur: new FractionEtendue(1000 * x3, 1000),
                    param: {
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(1000 * x3) + 1,
                      digitsDen: 5,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: `${numAlpha(2)} Donner la partie entière de l'abscisse de $${noms[1]}$.`,
                    valeur: Math.floor(x2),
                    param: {
                      digits: nombreDeChiffresDansLaPartieEntiere(Math.floor(x2)) + 1,
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
                  texteAvant: '',
                  statut: '',
                  reponse: {
                    texteAvant: `${numAlpha(3)} Donner la partie décimale de l'abscisse de $${noms[1]}$.`,
                    valeur: new FractionEtendue(calculANePlusJamaisUtiliser(1000 * (x2 - Math.floor(x2))), 1000),
                    param: {
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(calculANePlusJamaisUtiliser(1000 * (x2 - Math.floor(x2)))),
                      digitsDen: 4,
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
      const textedroite = '<br>' + mathalea2d({
        xmin: -1.5,
        xmax: (xmax - xmin) * unite + 1.5, // la longueur totale de l'axe flèche comprise+ 1,
        ymin: -1.5,
        ymax: 1.5,
        pixelsParCm: 25,
        scale: 0.5
      }, d1)
      texte += textedroite
      if (context.isAmc) {
        this.autoCorrection[i].enonce = 'À partir de la droite graduée ci-dessous, répondre aux questions ci-dessous.' + textedroite
      }
      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Au dixième\n2 : Au centième\n3 : Au millième']
}
