import { droiteGraduee } from '../../lib/2d/reperes.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { lettreIndiceeDepuisChiffre } from '../../lib/outils/outilString.js'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { texteGras } from '../../lib/outils/embellissements'

export const titre = 'Lire l\'abscisse entière d\'un point (grands nombres)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Lire l'abscisse entière d'un point
 * @author Jean-Claude Lhote et Rémi Angot
 * référence 6N11
 * Relecture : Novembre 2021 par EE
 */
export const uuid = 'acd4a'
export const ref = '6N11'
export const refs = {
  'fr-fr': ['6N11'],
  'fr-ch': ['9NO2-1']
}
export default function LireAbscisseEntiere2d () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.sup = 4
  this.interactif = false

  this.nouvelleVersion = function () {
    // numeroExercice est 0 pour l'exercice 1
    this.consigne = "Lire l'abscisse de chacun des points suivants."
    if (this.interactif) this.consigne += texteGras(' Penser à mettre les espaces nécessaires.')
    let typesDeQuestions
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    if (this.sup === 4) {
      typesDeQuestions = combinaisonListes([1, 2, 3], this.nbQuestions)
    } else {
      typesDeQuestions = combinaisonListes(
        [this.sup],
        this.nbQuestions
      )
    }
    const d = []
    for (let i = 0, abs0, l1, l2, l3, x1, x2, x3, reponse1, reponse2, reponse3, pas1, texte = '', texteCorr = '', cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // La ligne suivante ne doit pas être mise après les setReponses car sinon elle les efface
      this.autoCorrection[3 * i] = { propositions: [{ statut: 4, feedback: '' }] }
      this.autoCorrection[3 * i + 1] = { propositions: [{ statut: 4, feedback: '' }] }
      this.autoCorrection[3 * i + 2] = { propositions: [{ statut: 4, feedback: '' }] }
      l1 = lettreIndiceeDepuisChiffre(i * 3 + 1)
      l2 = lettreIndiceeDepuisChiffre(i * 3 + 2)
      l3 = lettreIndiceeDepuisChiffre(i * 3 + 3)
      switch (typesDeQuestions[i]) {
        case 1: // Placer des entiers sur un axe (milliers)
          abs0 = randint(1, 9) * 1000
          pas1 = 0.001
          break

        case 2: // Placer des entiers sur un axe (dizaines de mille)
          abs0 = randint(5, 15) * 10000
          pas1 = 0.0001
          break

        case 3: // Placer des entiers sur un axe (centaines de mille)
          abs0 = randint(35, 85) * 100000
          pas1 = 0.00001
          break
      }
      x1 = calculANePlusJamaisUtiliser(randint(0, 27) / 10)
      x2 = calculANePlusJamaisUtiliser(randint(33, 47) / 10)
      x3 = calculANePlusJamaisUtiliser(randint(53, 67) / 10)
      reponse1 = calculANePlusJamaisUtiliser(x1 / pas1 + abs0)
      reponse2 = calculANePlusJamaisUtiliser(x2 / pas1 + abs0)
      reponse3 = calculANePlusJamaisUtiliser(x3 / pas1 + abs0)
      d[2 * i] = droiteGraduee({
        Unite: 4,
        Min: 0,
        Max: 7.1,
        axeStyle: '->',
        pointTaille: 5,
        pointStyle: 'x',
        labelsPrincipaux: false,
        thickSec: true,
        step1: 10,
        labelListe: [[0, context.isAmc ? `${texNombre(abs0, 0)}` : `${stringNombre(abs0)}`], [1, context.isAmc ? `${texNombre(calculANePlusJamaisUtiliser(abs0 + 1 / pas1), 0)}` : `${stringNombre(calculANePlusJamaisUtiliser(abs0 + 1 / pas1))}`]],
        pointListe: [[x1, l1], [x2, l2], [x3, l3]]
      })
      d[2 * i + 1] = droiteGraduee({
        Unite: 4,
        Min: 0,
        Max: 7.1,
        axeStyle: '->',
        pointTaille: 5,
        pointStyle: 'x',
        labelsPrincipaux: false,
        thickSec: true,
        step1: 10,
        labelListe: [
          [x1, !context.isAmc ? stringNombre(reponse1) : texNombre(reponse1, 0)],
          [x2, !context.isAmc ? stringNombre(reponse2) : texNombre(reponse2, 0)],
          [x3, !context.isAmc ? stringNombre(reponse3) : texNombre(reponse3, 0)]
        ],
        pointListe: [[x1, l1], [x2, l2], [x3, l3]]

      })

      texte = mathalea2d({ xmin: -2, ymin: -1, xmax: 30, ymax: 2, pixelsParCm: 20, scale: 0.5 }, d[2 * i])
      texteCorr = mathalea2d({ xmin: -2, ymin: -2, xmax: 30, ymax: 2, pixelsParCm: 20, scale: 0.5 }, d[2 * i + 1])

      if (this.interactif && context.isHtml) {
        setReponse(this, 3 * i, texNombre(reponse1, 0), { formatInteractif: 'texte' })
        setReponse(this, 3 * i + 1, texNombre(reponse2, 0), { formatInteractif: 'texte' })
        setReponse(this, 3 * i + 2, texNombre(reponse3, 0), { formatInteractif: 'texte' })
        texte += '<br>' + ajouteChampTexteMathLive(this, 3 * i, 'inline largeur50 college6eme', { texteAvant: l1 })
        texte += '<br>' + ajouteChampTexteMathLive(this, 3 * i + 1, 'inline largeur50 college6eme', { texteAvant: l2 })
        texte += '<br>' + ajouteChampTexteMathLive(this, 3 * i + 2, 'inline largeur50 college6eme', { texteAvant: l3 })
      } else if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          enonceAvant: false,
          propositions: [
            {
              type: 'AMCNum',
              propositions: [{
                texte: '',
                statut: '',
                reponse: {
                  texte: 'Lire l\'abscisse de chacun des points.<br>' + texte + `<br>Abscisse de $${l1}$ :`,
                  valeur: reponse1,
                  param: {
                    digits: nombreDeChiffresDansLaPartieEntiere(reponse1),
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
                  texte: `Abscisse de $${l2}$ :`,
                  valeur: reponse2,
                  param: {
                    digits: nombreDeChiffresDansLaPartieEntiere(reponse2),
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
                  texte: `Abscisse de $${l3}$ :`,
                  valeur: reponse3,
                  param: {
                    digits: nombreDeChiffresDansLaPartieEntiere(reponse3),
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

      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Niveau de difficulté',
    4,
    '1 : Milliers\n2 : Dizaines de mille\n3 : Centaines de mille\n4 : Mélange'
  ]
}
