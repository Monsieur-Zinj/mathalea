import { codageAngle } from '../../lib/2d/angles'
import { droite } from '../../lib/2d/droites.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { polygone } from '../../lib/2d/polygones.js'
import { demiDroite, segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { texcolors, texteGras } from '../../lib/format/style'
import { lettreDepuisChiffre, numAlpha, reverseString } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { randint, listeQuestionsToContenu } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { generateCleaner } from '../../lib/interactif/comparisonFunctions'
const cleaner = generateCleaner(['parentheses', 'espaces'])
export const titre = 'Appliquer les propriétés de conservation de la symétrie axiale'

export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

// Gestion de la date de publication initiale
export const dateDePublication = '26/10/2020'
export const dateDeModifImportante = '27/06/2024' // EE : Rajout du paramètre du nombre de symétriques // interactivité ajouté par Jean-Claude Lhote

/**
 * @author Jean-Claude Lhote
 * Relecture : Novembre 2021 par EE
 */
export const uuid = 'cd69a'
export const ref = '6G32-1'
export const refs = {
  'fr-fr': ['6G32-1'],
  'fr-ch': ['9ES6-26']
}
export default function SymetrieAxialeConservation1 () {
  Exercice.call(this)
  this.titre = titre
  this.spacing = 2
  this.nbQuestions = 1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.sup2 = false
  this.sup3 = 4

  this.nouvelleVersion = function () {
    const typesDeQuestionsDisponibles = ['Segment', 'Droite', '1/2droite', 'Triangle', 'Angle']
    const points = []; const traces = []; const nom = []; let alternance
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      for (let ii = 0; ii < 25; ii++) nom.push(lettreDepuisChiffre(ii + 1))
      const noms = shuffle(nom)
      const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.sup3)
      texteCorr = `${texteGras('Dans la symétrie d\'axe (d), on observe les choses suivantes.')}`
      // On prépare la figure...
      let axe = this.sup
      let d; let nonchoisi; const coords = []; let x; let y; const objetsEnonce = []; const objetsCorrection = []; let nomd; let labelPos
      if (axe === 5) axe = randint(1, 4) // choix de l'axe et des coordonnées
      switch (axe) {
        case 1: d = droite(1, 0, 0)
          nomd = texteParPosition('(d)', 0.3, 5.6)
          labelPos = 'above left'
          for (let ii = 0; ii < 12; ii++) {
            nonchoisi = false
            while (!nonchoisi) { // Le nouveau point est-il déjà dans la liste ?
              [x, y] = [randint(-5, 0), randint(-5, 5)]
              nonchoisi = true
              for (let j = 0; j < ii; j++) { if (coords[j][0] === x && coords[j][1] === y) nonchoisi = false }
            }
            coords.push([x, y]) // on stocke les 12 points
          }
          for (let j = 0; j < 12; j++) coords.push([-coords[j][0], coords[j][1]]) // on stocke les 12 images
          break
        case 2: d = droite(0, 1, 0)
          labelPos = 'above'
          nomd = texteParPosition('(d)', 5.6, 0.3)
          for (let ii = 0; ii < 12; ii++) {
            nonchoisi = false
            while (!nonchoisi) { // Le nouveau point est-il déjà dans la liste ?
              [x, y] = [randint(-5, 5), randint(-5, 0)]
              nonchoisi = true
              for (let j = 0; j < ii; j++) { if (coords[j][0] === x && coords[j][1] === y) nonchoisi = false }
            }
            coords.push([x, y]) // on stocke les 12 points
          }
          for (let j = 0; j < 12; j++) coords.push([coords[j][0], -coords[j][1]]) // on stocke les 12 images
          break
        case 3: d = droite(1, -1, 0)
          labelPos = 'above'
          nomd = texteParPosition('(d)', -5.8, -5.4)
          for (let ii = 0; ii < 12; ii++) {
            nonchoisi = false
            while (!nonchoisi) { // Le nouveau point est-il déjà dans la liste ?
              x = randint(-5, 5)
              y = randint(x, 5)
              nonchoisi = true
              for (let j = 0; j < ii; j++) { if (coords[j][0] === x && coords[j][1] === y) nonchoisi = false }
            }
            coords.push([x, y]) // on stocke les 12 points
          }
          for (let j = 0; j < 12; j++) coords.push([coords[j][1], coords[j][0]]) // on stocke les 12 images
          break
        case 4: d = droite(1, 1, 0)
          labelPos = 'above'
          nomd = texteParPosition('(d)', -5.8, 5.4)
          for (let ii = 0; ii < 12; ii++) {
            nonchoisi = false
            while (!nonchoisi) { // Le nouveau point est-il déjà dans la liste ? Si oui, on recommence.
              x = randint(-5, 5)
              y = randint(-5, -x)
              nonchoisi = true
              for (let j = 0; j < ii; j++) {
                if (coords[j][0] === x && coords[j][1] === y) { nonchoisi = false }
              }
            }
            coords.push([x, y]) // on stocke les 12 points
          }
          for (let j = 0; j < 12; j++) { coords.push([-coords[j][1], -coords[j][0]]) } // on stocke les 12 images
          break
      }
      for (let ii = 0; ii < 24; ii++) {
        if (ii < 12) points.push(point(coords[ii][0], coords[ii][1], noms[ii], labelPos))
        else if (coords[ii][0] === coords[ii - 12][0] && coords[ii][1] === coords[ii - 12][1]) {
          points.push(point(coords[ii][0], coords[ii][1], noms[ii - 12], labelPos))
          noms[ii] = noms[ii - 12]
        } else points.push(point(coords[ii][0], coords[ii][1], noms[ii], labelPos))
        traces.push(tracePoint(points[ii]))
      }
      // On rédige les questions et les réponses
      if (this.sup2 === true) alternance = 2
      else alternance = 1
      const index = function (ii) {
        return (ii + 12 * (ii % alternance)) % 24
      }
      objetsEnonce.length = 0
      objetsCorrection.length = 0

      if (context.isAmc) {
        this.autoCorrection[i] =
        {
          propositions: [],
          options: { numerotationEnonce: true }
        }
      }

      texte = 'Dans la symétrie d\'axe (d), répondre aux questions suivantes.<br>'
      for (let ii = 0, s1, s2, texteAMC, choix; ii < this.sup3;) {
        let reponse
        switch (listeTypeDeQuestions[ii]) {
          case 'Segment':
            choix = randint(0, 10) + randint(0, 1) * 12
            texteAMC = numAlpha(ii) + `Quel est le symétrique du segment $[${noms[index(choix)]}${noms[index(choix + 1)]}]$ ?`
            texteCorr += numAlpha(ii) + `Le symétrique du segment $[${noms[index(choix)]}${noms[index(choix + 1)]}]$ est le segment $[${noms[index(choix + 12)]}${noms[index(choix + 13)]}]$.<br>`
            s1 = segment(points[index(choix)], points[index(choix + 1)], texcolors(ii * 3 + 2))
            s2 = segment(points[index(choix + 12)], points[index(choix + 13)], texcolors(ii * 3 + 2))
            s1.epaisseur = 2
            s2.epaisseur = 2
            objetsCorrection.push(s1, s2)
            reponse = `[${noms[index(choix + 12)]}${noms[index(choix + 13)]}]`
            break
          case 'Droite':
            choix = randint(0, 10) + randint(0, 1) * 12
            texteAMC = numAlpha(ii) + `Quel est le symétrique de la droite $(${noms[index(choix)]}${noms[index(choix + 1)]})$ ?`
            texteCorr += numAlpha(ii) + `Le symétrique de la droite $(${noms[index(choix)]}${noms[index(choix + 1)]})$ est la droite $(${noms[index(choix + 12)]}${noms[index(choix + 13)]})$.<br>`
            objetsCorrection.push(droite(points[index(choix)], points[index(choix + 1)], '', texcolors(ii * 3 + 2)))
            objetsCorrection.push(droite(points[index(choix + 12)], points[index(choix + 13)], '', texcolors(ii * 3 + 2)))
            reponse = `(${noms[index(choix + 12)]}${noms[index(choix + 13)]})`
            break
          case '1/2droite':
            choix = randint(0, 10) + randint(0, 1) * 12
            texteAMC = numAlpha(ii) + `Quel est le symétrique de la demi-droite $[${noms[index(choix)]}${noms[index(choix + 1)]})$ ?`
            texteCorr += numAlpha(ii) + `Le symétrique de la demi-droite $[${noms[index(choix)]}${noms[index(choix + 1)]})$ est la demi-droite $[${noms[index(choix + 12)]}${noms[index(choix + 13)]})$.<br>`
            objetsCorrection.push(demiDroite(points[index(choix)], points[index(choix + 1)], texcolors(ii * 3 + 2)))
            objetsCorrection.push(demiDroite(points[index(choix + 12)], points[index(choix + 13)], texcolors(ii * 3 + 2)))
            reponse = `[${noms[index(choix + 12)]}${noms[index(choix + 13)]})`
            break
          case 'Triangle':
            choix = randint(0, 9) + randint(0, 1) * 12
            while (points[index(choix)].estSur(droite(points[index(choix + 1)], points[index(choix + 2)]))) {
              choix = randint(0, 9) + randint(0, 1) * 12
            }
            texteAMC = numAlpha(ii) + `Quel est le symétrique du triangle $${noms[index(choix)]}${noms[index(choix + 1)]}${noms[index(choix + 2)]}$ ?`
            texteCorr += numAlpha(ii) + `Le symétrique du triangle $${noms[index(choix)]}${noms[index(choix + 1)]}${noms[index(choix + 2)]}$ est le triangle $${noms[index(choix + 12)]}${noms[index(choix + 13)]}${noms[index(choix + 14)]}$.<br>`
            objetsCorrection.push(polygone([points[index(choix)], points[index(choix + 1)], points[index(choix + 2)]], texcolors(ii * 3 + 2)))
            objetsCorrection.push(polygone([points[index(choix + 12)], points[index(choix + 13)], points[index(choix + 14)]], texcolors(ii * 3 + 2)))
            reponse = `${noms[index(choix + 12)]}${noms[index(choix + 13)]}${noms[index(choix + 14)]}`
            break
          case 'Angle':
            choix = randint(0, 9) + randint(0, 1) * 12
            while (points[index(choix)].estSur(droite(points[index(choix + 1)], points[index(choix + 2)]))) {
              choix = randint(0, 9) + randint(0, 1) * 12
            }
            texteAMC = numAlpha(ii) + `Quel est le symétrique de l'angle $\\widehat{${noms[index(choix)]}${noms[index(choix + 1)]}${noms[index(choix + 2)]}}$ ?`
            texteCorr += numAlpha(ii) + `Le symétrique de l'angle $\\widehat{${noms[index(choix)]}${noms[index(choix + 1)]}${noms[index(choix + 2)]}}$ est l'angle $\\widehat{${noms[index(choix + 12)]}${noms[index(choix + 13)]}${noms[index(choix + 14)]}}$.<br>`
            objetsCorrection.push(codageAngle(points[index(choix)], points[index(choix + 1)], points[index(choix + 2)], 2, '', texcolors(ii * 3 + 2), 2, 0.5, texcolors(ii * 3 + 2), 0.2))
            objetsCorrection.push(codageAngle(points[index(choix + 12)], points[index(choix + 13)], points[index(choix + 14)], 2, '', texcolors(ii * 3 + 2), 2, 0.5, texcolors(ii * 3 + 2), 0.2))
            objetsCorrection.push(segment(points[index(choix)], points[index(choix + 1)], texcolors(ii * 3 + 2)))
            objetsCorrection.push(segment(points[index(choix + 1)], points[index(choix + 2)], texcolors(ii * 3 + 2)))
            objetsCorrection.push(segment(points[index(choix + 12)], points[index(choix + 13)], texcolors(ii * 3 + 2)))
            objetsCorrection.push(segment(points[index(choix + 13)], points[index(choix + 14)], texcolors(ii * 3 + 2)))
            reponse = `\\whidehat{${noms[index(choix + 12)]}${noms[index(choix + 13)]}${noms[index(choix + 14)]}}`
            break
        }

        if (this.interactif) {
          const typeDeQuestion = listeTypeDeQuestions[ii]
          const callback = function (exercice, question) {
            let feedback = ''
            const mfe = document.querySelector(`#champTexteEx${exercice.numeroExercice}Q${question}`)
            let saisie = cleaner(mfe.value)
            let isOk = false
            switch (typeDeQuestion) {
              case 'Segment':
                if (saisie.startsWith('[') && saisie.endsWith(']')) {
                  saisie = saisie.slice(1, -1)
                  reponse = reponse.slice(1, -1)
                  if (saisie === reponse || saisie === reverseString(reponse)) {
                    isOk = true
                    feedback = ''
                    break
                  } else {
                    isOk = false
                    feedback = ''
                    break
                  }
                }
                isOk = false
                feedback = 'Un segment doit se noter entre crochets.'
                break
              case 'Droite':
                if (saisie.startsWith('(') && saisie.endsWith(')')) {
                  saisie = saisie.slice(1, -1)
                  reponse = reponse.slice(1, -1)
                  if (saisie === reponse || saisie === reverseString(reponse)) {
                    isOk = true
                    feedback = ''
                    break
                  } else {
                    isOk = false
                    feedback = ''
                    break
                  }
                }
                isOk = false
                feedback = 'Une droite doit se noter entre parenthèses.'
                break

              case '1/2droite':
                if (saisie.startsWith('[') && saisie.endsWith(')')) {
                  saisie = saisie.slice(1, -1)
                  reponse = reponse.slice(1, -1)
                  if (saisie === reponse) {
                    isOk = true
                    feedback = ''
                    break
                  } else {
                    isOk = false
                    feedback = ''
                    break
                  }
                }
                isOk = false
                feedback = 'Une demi-droite doit se noter avec un crochet et une parenthèse.'
                break

              case 'Triangle':
                if (saisie.length === 3) {
                  if (reponse.includes(saisie[0]) && reponse.includes(saisie[1]) && reponse.includes(saisie[2])) {
                    isOk = true
                    feedback = ''
                    break
                  } else {
                    isOk = false
                    feedback = ''
                    break
                  }
                }
                isOk = false
                feedback = 'Un triangle est défini par trois points'
                break

              case 'Angle':
                if (saisie.startsWith('\\widehat{')) {
                  saisie = saisie.slice(9, -1)
                  if (saisie.length === 3) {
                    if (reponse.includes(saisie[0]) && reponse.includes(saisie[1]) && reponse.includes(saisie[2])) {
                      isOk = true
                      feedback = ''
                      break
                    } else {
                      isOk = false
                      feedback = ''
                      break
                    }
                  }
                  isOk = false
                  feedback = 'Un triangle est défini par trois points'
                  break
                }
                isOk = false
                feedback = 'Un angle doit avoir un chapeau.'
                break
            }
            const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${question}`)
            if (spanReponseLigne != null) {
              spanReponseLigne.innerHTML = isOk ? '😎' : '☹️'
            }

            return {
              isOk,
              feedback,
              score: {
                nbBonnesReponses: isOk ? 1 : 0,
                nbReponses: 1
              }
            }
          }
          texteAMC += ajouteChampTexteMathLive(this, i * this.sup3 + ii, 'inline largeur01 angles')
          handleAnswers(this, i * this.sup3 + ii, { reponse: { value: reponse }, callback })
        }
        if (context.isAmc) {
          this.autoCorrection[i].propositions.push(
            {
              type: 'AMCOpen',
              propositions: [
                {
                  texte: ' ',
                  numQuestionVisible: false,
                  statut: 1, // (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  feedback: '',
                  enonce: texteAMC, // EE : ce champ est facultatif et fonctionnel qu'en mode hybride (en mode normal, il n'y a pas d'intérêt)
                  sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                }
              ]
            }
          )
        }
        texte += texteAMC + '<br>'
        ii++
      }
      d.isVisible = true
      objetsEnonce.push(nomd, d)
      objetsCorrection.push(nomd, d)
      for (let ii = 0; ii < 24; ii++) {
        objetsEnonce.push(labelPoint(points[ii]), tracePoint(points[ii], 'blue'))
        objetsCorrection.push(labelPoint(points[ii]), tracePoint(points[ii], 'blue'))
      }
      const enonceAMC = mathalea2d(Object.assign({ pixelsParCm: 30, scale: 1 }, fixeBordures(objetsEnonce)), objetsEnonce)
      if (context.isAmc) {
        this.autoCorrection[i].enonce = 'Pour chaque question ci-dessous, placer sur cette figure, l\'objet mathématique cité puis tracer son symétrique. Répondre ensuite à la question.<br>' + enonceAMC + '<br>'
        this.autoCorrection[i].enonceAvant = false
        this.autoCorrection[i].enonceAvantUneFois = true
      }

      texte += enonceAMC
      texteCorr += (mathalea2d(Object.assign({ pixelsParCm: 30, scale: 1 }, fixeBordures(objetsCorrection)), objetsCorrection))
      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type d\'axe :', 5, '1 : Axe vertical\n2 : Axe horizontal\n3 : Axe oblique 1\n4 : Axe oblique 2\n5 : Axe aléatoire']
  this.besoinFormulaire3Numerique = ['Nombre de symétriques à trouver', 26]
  this.besoinFormulaire2CaseACocher = ["Avec des points de part et d'autre"]
}
