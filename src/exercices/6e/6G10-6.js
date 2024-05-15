import { droite } from '../../lib/2d/droites.js'
import { point, pointSurDroite, tracePoint } from '../../lib/2d/points.js'
import { grille, seyes } from '../../lib/2d/reperes.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { deuxColonnesResp } from '../../lib/format/miseEnPage.js'
import { rangeMinMax } from '../../lib/outils/nombres'
import { lettreDepuisChiffre, numAlpha, sp } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice'
import { context } from '../../modules/context.js'
import { mathalea2d, vide2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { choixDeroulant } from '../../lib/interactif/questionListeDeroulante.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const titre = 'Appartient ou n\'appartient pas ?'
export const dateDePublication = '05/10/2022'
export const dateDeModifImportante = '4/10/2023'
// Ajout de l'interactivité et suppression de (AB] par Rémi Angot
export const interactifReady = true
export const interactifType = 'listeDeroulante'
export const amcReady = true
export const amcType = 'AMCHybride'
/**
 * Fonction générale pour la notion d'appartenance
 * @author Mickael Guironnet
 */

export const uuid = '9af23'
export const ref = '6G10-6'
export const refs = {
  'fr-fr': ['6G10-6'],
  'fr-ch': ['9ES1-5']
}
export default class constructionElementaire extends Exercice {
//
  constructor () {
    super()
    this.nbQuestions = 1
    this.nbCols = 1
    this.nbColsCorr = 1
    this.sup = 1
    this.sup2 = 4
    this.besoinFormulaireNumerique = [
      'Type de cahier',
      3,
      ' 1 : Cahier à petits carreaux\n 2 : Cahier à gros carreaux (Seyes)\n 3 : Feuille blanche'
    ]
    this.besoinFormulaire2Numerique = [
      'Nombre de phrases à compléter',
      10
    ]
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, colonne1, colonne2, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const objetsEnonce = []
      const objetsCorrection = []
      const propositionsAMC = []
      const indLettre = randint(1, 15)
      const A = point(0, 0, lettreDepuisChiffre(indLettre), 'above left')
      const B = point(randint(10, 11), randint(-4, 4, [-1, 0, 1]), lettreDepuisChiffre(indLettre + 1), 'above right')
      const d = droite(A, B, '', 'blue')
      const AA = pointSurDroite(d, randint(1, 2), lettreDepuisChiffre(indLettre + 6), 'below')
      const BB = pointSurDroite(d, randint(3, 5), lettreDepuisChiffre(indLettre + 7), 'below')
      const CC = pointSurDroite(d, randint(6, 7), lettreDepuisChiffre(indLettre + 8), 'below')
      const DD = pointSurDroite(d, randint(8, 9), lettreDepuisChiffre(indLettre + 9), 'below')
      const C = point(randint(2, 4, [A.x]), randint(3, 6, [A.y]), lettreDepuisChiffre(indLettre + 2), 'above left')
      const D = point(randint(6, 8), randint(-7, -6, [A.y]), lettreDepuisChiffre(indLettre + 3))
      const T = tracePoint(A, B, C, D, AA, BB, CC, DD)
      T.tailleTikz = 0.3
      objetsEnonce.push(T, labelPoint(A, B, C, D, AA, BB, CC, DD), d)
      const Xmin = Math.floor(Math.min(A.x, B.x, C.x, D.x) - 1)
      const Xmax = Math.ceil(Math.max(A.x, B.x, C.x, D.x) + 1)
      const Ymin = Math.floor(Math.min(A.y, B.y, C.y, D.y) - 1)
      const Ymax = Math.ceil(Math.max(A.y, B.y, C.y, D.y) + 1)

      let g, sc, carreaux
      if (this.sup < 3) { g = grille(Xmin, Ymin, Xmax, Ymax, 'gray', 0.7) } else { g = vide2d() }
      if (this.sup === 2) { carreaux = seyes(Xmin, Ymin, Xmax, Ymax); sc = 0.8 } else { carreaux = vide2d(); sc = 0.5 }

      objetsEnonce.push(g, carreaux)
      objetsCorrection.push(g, carreaux)
      const ppc = 20
      const figure = mathalea2d(
        {
          xmin: Xmin,
          ymin: Ymin,
          xmax: Xmax,
          ymax: Ymax,
          pixelsParCm: ppc,
          scale: sc
        },
        objetsEnonce
      )
      colonne1 = (context.vue === 'diap' ? '<center>' : '') + figure + (context.vue === 'diap' ? '</center>' : '<br>')

      colonne2 = 'Compléter avec $\\in$ ou $\\notin$. <br>'
      let correction2 = colonne2
      let questind = 0
      const points = [A, AA, BB, CC, DD, B, C, D]
      const tirage = []
      const typeOld = []
      for (let k = 0; k < Math.max(2, this.sup2); k++) {
        const ind = randint(0, 7)
        const ind1 = randint(0, 4, [ind])
        const ind2 = randint(0, 5, rangeMinMax(0, ind1))
        if (typeOld.length > 3) {
          typeOld.length = 0
        }
        const type = randint(0, 3, typeOld)
        typeOld.push(type)
        const tira = ind.toString() + ind1.toString() + ind2.toString() + type.toString()
        if (tirage.indexOf(tira) > -1) {
          k--
          continue
        } else {
          tirage.push(tira)
        }
        let lettre = ['(', ')']
        let sol = ''
        switch (type) {
          case 0 : // droite
            lettre = ['(', ')']
            if (ind <= 5) { sol = '\\in' } else { sol = '\\notin' }
            break
          case 1 : // segment
            lettre = ['[', ']']
            if (ind <= 5 && ind >= ind1 && ind <= ind2) { sol = '\\in' } else { sol = '\\notin' }
            break
          case 2 : // demi-droite [)
            lettre = ['[', ')']
            if (ind <= 5 && ind >= ind1) { sol = '\\in' } else { sol = '\\notin' }
            break
          case 3 : // demi-droite [)
            lettre = ['[', ')']
            if (ind <= 5 && ind >= ind1) { sol = '\\in' } else { sol = '\\notin' }
            break
        }
        if (this.interactif) {
          colonne2 +=
            numAlpha(questind) +
            `$${points[ind].nom}${sp(3)}$` + choixDeroulant(this, i * this.sup2 + k, ['∈', '∉'], '...') + `$${sp(3)}${lettre[0]}${points[ind1].nom}${points[ind2].nom}${lettre[1]}$<span id="resultatCheckEx${numeroExercice}Q${i * this.sup2 + k}"></span><br>`
          handleAnswers(this, i * this.sup2 + k, { reponse: { value: sol === '\\notin' ? '∉' : '∈' } }, { formatInteractif: 'listeDeroulante' })
        } else {
          const enonce = `$${points[ind].nom}${sp(3)}\\ldots\\ldots\\ldots${sp(3)}${lettre[0]}${points[ind1].nom}${points[ind2].nom}${lettre[1]}$`
          colonne2 += numAlpha(questind) + enonce + '<br>'
          if (context.isAmc) {
            propositionsAMC[k] = {
              type: 'qcmMult', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              enonce,
              options: { ordered: true },
              propositions: [
                {
                  texte: '$\\notin$',
                  statut: sol === '\\notin'
                },
                {
                  texte: '$\\in$',
                  statut: sol !== '\\notin'
                }
              ]
            }
          }
        }
        correction2 +=
          numAlpha(questind++) +
          `$${points[ind].nom} ${sol} ${lettre[0]}${points[ind1].nom}${points[ind2].nom}${lettre[1]}$<br>`
      }

      const options = { eleId: numeroExercice + '_' + i, widthmincol1: '500px', widthmincol2: '300px' }
      const enonce = deuxColonnesResp(colonne1, colonne2, options)
      const optionsSol = { eleId: 's-' + numeroExercice + '_' + i, widthmincol1: '500px', widthmincol2: '300px' }
      const correction = deuxColonnesResp(colonne1, correction2, optionsSol)

      /****************************************************/
      if (this.questionJamaisPosee(i, enonce)) {
      // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(enonce + '<br>')
        this.listeCorrections.push(correction + '<br>')

        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: figure + 'À partir de la figure ci-dessus, compléter les phrases suivantes par $\\notin$ ou $\\in$.',
            enonceAvant: true, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
            enonceCentre: true, // EE : ce champ est facultatif et permet (si true) de centrer le champ 'enonce' ci-dessus.
            melange: true, // EE : ce champ est facultatif et permet (si false) de ne pas provoquer le mélange des questions.
            options: { avecSymboleMult: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) des propositions : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
            propositions: propositionsAMC
          }
        }

        // listener
        const reportWindowSize = function () {
          const element = document.getElementById('cols-responsive1-' + options.eleId)
          const element3 = document.getElementById('cols-responsive1-s-' + options.eleId)
          if (element !== null &&
            element3 !== null &&
            element !== undefined &&
            element3 !== undefined &&
            element.clientWidth !== 0) {
            const qcms = element.querySelectorAll('.mathalea2d')
            const widthMathalea2d = parseInt(qcms[0].getAttribute('width'))
            let col1 = parseInt(options.widthmincol1.replaceAll('px', ''))
            const col2 = parseInt(options.widthmincol2.replaceAll('px', ''))
            col1 = widthMathalea2d
            options.widthmincol1 = col1 + 'px'
            const diff = element.parentElement.clientWidth - parseInt(options.widthmincol1.replaceAll('px', ''))
            element.style.minWidth = options.widthmincol1
            element3.style.minWidth = options.widthmincol1
            if (diff > col2) {
              element.parentElement.style.gridTemplateColumns = 'repeat(2, 1fr)'
              element3.parentElement.style.gridTemplateColumns = 'repeat(2, 1fr)'
            } else {
              element.parentElement.style.gridTemplateColumns = 'auto'
              element3.parentElement.style.gridTemplateColumns = 'auto'
            }
          }
        }

        const removelistener = function () {
          document.removeEventListener('exercicesAffiches', reportWindowSize)
          document.removeEventListener('exercicesDiap', reportWindowSize)
          document.removeEventListener('zoominOrout', reportWindowSize)
          document.removeEventListener('pleinEcran', reportWindowSize)
          window.removeEventListener('resize', reportWindowSize)
          document.removeEventListener('buildex', removelistener)
        }

        const createlistener = function () {
          document.addEventListener('exercicesAffiches', reportWindowSize)
          document.addEventListener('exercicesDiap', reportWindowSize)
          document.addEventListener('zoominOrout', reportWindowSize)
          document.addEventListener('pleinEcran', reportWindowSize)
          window.addEventListener('resize', reportWindowSize)
          document.addEventListener('buildex', removelistener)
        }
        createlistener()
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }
}
