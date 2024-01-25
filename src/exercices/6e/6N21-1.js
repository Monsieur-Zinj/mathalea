import { point, tracePoint } from '../../lib/2d/points.js'
import { droiteGraduee } from '../../lib/2d/reperes.js'
import { labelPoint } from '../../lib/2d/textes.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreIndiceeDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { pointCliquable } from '../../modules/2dinteractif.js'
import { context } from '../../modules/context.js'
import { fraction } from '../../modules/fractions.js'
export const titre = 'Placer des points d’abscisses fractionnaires (niv 2)'
export const interactifReady = true
// remettre interactif_Ready à true qd point_Cliquable sera de nouveau opérationnel
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '11/05/2023'

/**
 * Description didactique de l'exercice :
 * Cherche des abscisses sous forme de fractions avec possibilté d'avoir des fractions simplifiées
 * @author Mickael Guironnet
 * Référence 6N21-1
 * publié le 10/05/2023
*/
export const uuid = 'a2582'
export const ref = '6N21-1'
export default function PlacerPointsAbscissesFractionnairesComplexes () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = ''
  this.nbQuestions = 5
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = 1 // Niveau de difficulté
  this.sup2 = true // avec des fractions simplifiées
  this.sup3 = false // valeurs positives si false sinon valeurs positives et négatives
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    let typeDeQuestions
    if (this.sup > 2) {
      typeDeQuestions = combinaisonListes([0, 1], this.nbQuestions)
    } else {
      typeDeQuestions = combinaisonListes([parseInt(this.sup) - 1], this.nbQuestions)
    }
    const data = {
      4: { id: 4, den: [2, 4], max: !this.sup3 ? 8 : 4, min: !this.sup3 ? 0 : -4 },
      6: { id: 6, den: [2, 3, 6], max: !this.sup3 ? 6 : 3, min: !this.sup3 ? 0 : -3 },
      8: { id: 8, den: [2, 4, 8], max: !this.sup3 ? 4 : 2, min: !this.sup3 ? 0 : -2 },
      9: { id: 9, den: [3, 9], max: !this.sup3 ? 4 : 2, min: !this.sup3 ? 0 : -2 },
      10: { id: 10, den: [2, 5, 10], max: !this.sup3 ? 4 : 2, min: !this.sup3 ? 0 : -2 },
      12: { id: 12, den: [2, 3, 4, 6, 12], max: !this.sup3 ? 3 : 2, min: !this.sup3 ? 0 : -1 },
      14: { id: 14, den: [2, 7, 14], max: !this.sup3 ? 2 : 1, min: !this.sup3 ? 0 : -1 },
      15: { id: 15, den: [3, 5, 15], max: !this.sup3 ? 2 : 1, min: !this.sup3 ? 0 : -1 },
      16: { id: 16, den: [2, 4, 8, 16], max: !this.sup3 ? 1 : 1, min: !this.sup3 ? 0 : -1 },
      18: { id: 18, den: [2, 3, 6, 9, 18], max: !this.sup3 ? 1 : 1, min: !this.sup3 ? 0 : -1 },
      20: { id: 20, den: [2, 4, 5, 10, 20], max: !this.sup3 ? 1 : 1, min: !this.sup3 ? 0 : -1 }
    }
    const tableDisponibles = [
      [4, 6, 8, 9, 10],
      [12, 14, 15, 16, 18, 20]]

    const tableUtilisees = [[], []]
    const pointsSolutions = []
    const pointsNonSolutions = [] // Pour chaque question, la liste des points qui ne doivent pas être cliqués
    const fractionsUtilisees = [] // Pour s'assurer de ne pas poser 2 fois la même question
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      if (tableDisponibles[typeDeQuestions[i]].length === tableUtilisees[typeDeQuestions[i]].length) {
        tableUtilisees[typeDeQuestions[i]] = []
      }
      const tab = choice(tableDisponibles[typeDeQuestions[i]], tableUtilisees[typeDeQuestions[i]])
      tableUtilisees[typeDeQuestions[i]].push(tab)
      // console.log(data[tab])

      let num2, num3, den2, den3
      const den1 = !this.sup2 ? data[tab].id : choice(data[tab].den)
      const num1 = trouveNumerateur(den1, data[tab].min, data[tab].max)
      if (this.interactif) {
        texte = `Placer le point $${lettreIndiceeDepuisChiffre(i + 1)}\\left(${fraction(num1, den1).texFraction}\\right).$`
      } else {
        den2 = !this.sup2 ? data[tab].id : choice(data[tab].den, den1)
        num2 = trouveNumerateur(den2, data[tab].min, data[tab].max, [{ num: num1, den: den1 }])
        den3 = !this.sup2 ? data[tab].id : choice(data[tab].den, (data[tab].den.length > 2 ? [den1, den2] : [den1]))
        num3 = trouveNumerateur(den3, data[tab].min, data[tab].max, [{ num: num1, den: den1 }, { num: num2, den: den2 }])
        texte = `Placer les points $${lettreIndiceeDepuisChiffre(i * 3 + 1)}\\left(${fraction(num1, den1).texFraction}\\right)$, $~${lettreIndiceeDepuisChiffre(i * 3 + 2)}\\left(${fraction(num2, den2).texFraction}\\right)$ et $~${lettreIndiceeDepuisChiffre(i * 3 + 3)}\\left(${fraction(num3, den3).texFraction}\\right)$.`
      }
      const origine = data[tab].min
      const tailleUnite = 20 / (data[tab].max - data[tab].min)
      const d = droiteGraduee({
        Min: data[tab].min,
        Max: data[tab].max,
        Unite: tailleUnite,
        thickSec: true,
        thickSecDist: 1 / data[tab].id,
        thickEpaisseur: 3
      })
      const mesObjets = [d]
      pointsNonSolutions[i] = []
      if (this.interactif) {
        for (let indicePoint = 0, monPoint; indicePoint < 1 + data[tab].id * (data[tab].max - data[tab].min); indicePoint++) {
          monPoint = pointCliquable(indicePoint / data[tab].id * tailleUnite, 0, { size: 8, width: 5, color: 'blue', radius: tailleUnite / data[tab].id / 2 })
          mesObjets.push(monPoint)
          if (Math.abs(indicePoint / data[tab].id + origine - num1 / den1) < 0.5 / data[tab].id) {
            pointsSolutions[i] = monPoint
          } else {
            pointsNonSolutions[i].push(monPoint)
          }
        }
      }
      texte += '<br>' + mathalea2d({ xmin: -0.2, xmax: (data[tab].max - data[tab].min) * tailleUnite + 1, ymin: -1, ymax: 1, style: 'margin-top:30px ', scale: 0.6 }, mesObjets)
      if (this.interactif && context.isHtml) {
        texte += `<div id="resultatCheckEx${this.numeroExercice}Q${i}"></div>`
      }

      let A, B, C, traceB, traceC, labels
      if (context.isHtml) {
        A = point(((num1 / den1) - origine) * tailleUnite, 0, `$${lettreIndiceeDepuisChiffre(i + 1)}$`)
      } else {
        A = point(((num1 / den1) - origine) * tailleUnite, 0, lettreIndiceeDepuisChiffre(i + 1))
      }
      const traceA = tracePoint(A, 'blue')
      traceA.epaisseur = this.interactif ? 3 : 2
      traceA.taille = this.interactif ? 5 : 3
      labels = labelPoint(A)
      if (!this.interactif) {
        if (context.isHtml) {
          A.nom = `$${lettreIndiceeDepuisChiffre(i * 3 + 1)}$`
          B = point(((num2 / den2) - origine) * tailleUnite, 0, `$${lettreIndiceeDepuisChiffre(i * 3 + 2)}$`)
        } else {
          A.nom = lettreIndiceeDepuisChiffre(i * 3 + 1)
          B = point(((num2 / den2) - origine) * tailleUnite, 0, lettreIndiceeDepuisChiffre(i * 3 + 2))
        }
        traceB = tracePoint(B, 'blue')
        traceB.epaisseur = 2
        traceB.taille = 3
        if (context.isHtml) {
          C = point(((num3 / den3) - origine) * tailleUnite, 0, `$${lettreIndiceeDepuisChiffre(i * 3 + 3)}$`)
        } else {
          C = point(((num3 / den3) - origine) * tailleUnite, 0, lettreIndiceeDepuisChiffre(i * 3 + 3))
        }
        traceC = tracePoint(C, 'blue')
        traceC.epaisseur = 2
        traceC.taille = 3
        labels = labelPoint(A, B, C)
      }

      if (!context.isHtml) {
        A.positionLabel = 'above = 0.2'
        if (B) B.positionLabel = 'above = 0.2'
        if (C) C.positionLabel = 'above = 0.2'
      }

      if (this.interactif) {
        texteCorr = `$${lettreIndiceeDepuisChiffre(i + 1)}\\left(${fraction(num1, den1).texFraction}\\right).$`
        texteCorr += '<br>' + mathalea2d({ xmin: -0.2, xmax: (data[tab].max - data[tab].min) * tailleUnite + 1, ymin: -1, ymax: 2, style: 'margin-top:30px ', scale: 0.6 }, d, traceA, labels)
      } else {
        texteCorr = `$${lettreIndiceeDepuisChiffre(i * 3 + 1)}\\left(${fraction(num1, den1).texFraction}\\right)$, $~${lettreIndiceeDepuisChiffre(i * 3 + 2)}\\left(${fraction(num2, den2).texFraction}\\right)$ et $~${lettreIndiceeDepuisChiffre(i * 3 + 3)}\\left(${fraction(num3, den3).texFraction}\\right)$`
        texteCorr += '<br>' + mathalea2d({ xmin: -0.2, xmax: (data[tab].max - data[tab].min) * tailleUnite + 1, ymin: -1, ymax: 2, style: 'margin-top:5px ', scale: 1 }, d, traceA, traceB, traceC, labels)
      }

      if (!isArrayInArray(fractionsUtilisees, [num1, den1])) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        fractionsUtilisees[i] = [num1, den1]

        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: texte + '\n',
            propositions: [{ texte: texteCorr, statut: 5, sanscadre: true, pointilles: true, feedback: '' }]
          }
        }

        i++
      }
    }

    // Pour distinguer les deux types de codage de recuperation des résultats
    this.exoCustomResultat = true
    // Gestion de la correction
    this.correctionInteractive = (i) => {
      let resultat
      let aucunMauvaisPointsCliques = true
      pointsSolutions[i].stopCliquable()
      for (const monPoint of pointsNonSolutions[i]) {
        if (monPoint.etat) aucunMauvaisPointsCliques = false
        monPoint.stopCliquable()
      }
      const divFeedback = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`)
      if (aucunMauvaisPointsCliques && pointsSolutions[i].etat) {
        divFeedback.innerHTML = '😎'
        resultat = 'OK'
      } else {
        divFeedback.innerHTML = '☹️'
        resultat = 'KO'
      }
      return resultat
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté :', 3, '1 : Graduation en 1/4, 1/6, 1/8, 1/9, 1/10\n2 : Graduation en 1/12, 1/14, 1/16, 1/18 et 1/20\n3 : Mélange']
  this.besoinFormulaire2CaseACocher = ['Avec des fractions simplifiées', true]
  this.besoinFormulaire3CaseACocher = ['Avec des valeurs négatives', false]
}

/**
 * Vérifie la présence d'un tableau dans un tableau de tableau
 * @param {array} arr
 * @param {array} item
 * @returns {boolean}
 */
function isArrayInArray (arr, item) {
  const itemAsString = JSON.stringify(item)
  const contains = arr.some(function (ele) {
    return JSON.stringify(ele) === itemAsString
  })
  return contains
}

function trouveNumerateur (den, min, max, fractionsAEviter = []) {
  const isNombreEntier = function (nu, de) {
    if (nu % de === 0) return true
    return false
  }

  let trouve = false
  let num = 0
  let i = 0
  while (!trouve && i < 10) {
    num = randint(min * den, den * max)

    // on veut éviter l'entier
    let k = 0
    while (isNombreEntier(num, den) && k < 5) {
      num = randint(min * den, den * max)
      k++
    }

    // on veut éviter d'être trop proche d'un autre point
    trouve = true
    for (const fraction of fractionsAEviter) {
      if (Math.abs(fraction.num / fraction.den - num / den) < 2 / den) {
        trouve = false
        break
      }
    }
    i++
  }
  return num
}
