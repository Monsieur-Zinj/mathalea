import Exercice from '../Exercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, lettreDepuisChiffre, choice, numAlpha, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { point, tracePoint, longueur, codageAngle, demiDroite, texteParPoint, rotation, homothetie, angle } from '../../modules/2d.js'
import { propositionsQcm } from '../../modules/interactif/questionQcm.js'
import { context } from '../../modules/context.js'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcType = 'AMCHybride'
export const amcReady = true
export const titre = 'Connaître le vocabulaire de base des angles'

export const dateDePublication = '03/12/2022'
export const dateDeModifImportante = '02/07/2023'

/**
 * Connaissance du vocabulaire de base des angles : nom, sommet, côté
 * @author Guillaume Valmont (modifié par EE pour modifier le nb de questions et rajouter un paramètre)
 * 6G22-1
*/
export const uuid = 'e8d33'
export const ref = '6G22-1'
export default class VocabulaireDeBaseDesAngles extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.correctionDetailleeDisponible = true
    this.nbQuestions = 4
    this.sup = 5
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const listeTypeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 4,
      melange: 5,
      defaut: 5,
      shuffle: true,
      listeOfCase: ['nom', 'sommet', 'cote', 'autre'],
      enleveDoublons: true,
      nbQuestions: 999
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      texte = ''
      texteCorr = ''
      const propositionsAMC = []
      const objets2d = []
      const xMin = -4
      const xMax = 4
      const yMin = -3
      const yMax = 3
      const distanceMin = 3
      const indiceNomA = randint(1, 26)
      const indiceNomB = randint(1, 26, [indiceNomA])
      const indiceNomC = randint(1, 26, [indiceNomA, indiceNomB])
      const A = point(randint(xMin, xMax), randint(yMin, yMax), lettreDepuisChiffre(indiceNomA))
      let B = point(randint(xMin, xMax), randint(yMin, yMax), lettreDepuisChiffre(indiceNomB))
      while (longueur(A, B) < distanceMin) {
        B = point(randint(xMin, xMax), randint(yMin, yMax), lettreDepuisChiffre(indiceNomB))
      }
      let C = point(randint(xMin, xMax), randint(yMin, yMax), lettreDepuisChiffre(indiceNomC))
      while (longueur(A, C) < distanceMin || longueur(B, C) < distanceMin || angle(A, B, C) < 10 || angle(A, B, C) > 170) {
        C = point(randint(xMin, xMax), randint(yMin, yMax), lettreDepuisChiffre(indiceNomC))
      }
      const points = [A, B, C]
      const angleABC = codageAngle(A, B, C, 2)
      const demiDroiteBA = demiDroite(B, A)
      const demiDroiteCA = demiDroite(B, C)
      objets2d.push(tracePoint(...points), texteParPoint(A.nom, rotation(A, B, -10)), texteParPoint(C.nom, rotation(C, B, 10)), texteParPoint(B.nom, homothetie(B, A, 1.2)), angleABC, demiDroiteBA, demiDroiteCA)
      // On affiche le cadre mathalea2d
      const pointsX = []
      const pointsY = []
      for (const point of points) {
        pointsX.push(point.x)
        pointsY.push(point.y)
      }
      const xmin = Math.min(...pointsX) - 2
      const xmax = Math.max(...pointsX) + 2
      const ymin = Math.min(...pointsY) - 2
      const ymax = Math.max(...pointsY) + 2
      const parametres2d = { xmin, ymin, xmax, ymax, pixelsParCm: 20, scale: 0.6 }
      const texteFigure = `À propos de l'angle ci-dessous, compléter ${this.listeTypeQuestions === 1 ? 'la' : 'chaque'} phrase par la case adéquate.<br>` + mathalea2d(parametres2d, objets2d)

      for (let ee = 0, texteQuestion, texteCorrQuestion; ee < listeTypeQuestions.length;) {
        texteQuestion = ''
        texteCorrQuestion = ''
        // On construit les questions

        const nomDirectCorrect = '\\widehat{' + A.nom + B.nom + C.nom + '}'
        const nomIndirrectIncorrect = '\\widehat{' + B.nom + C.nom + A.nom + '}'
        let questionReponse
        switch (listeTypeQuestions[ee]) {
          case 'nom':
            questionReponse =
          {
            question: (context.isAmc ? '' : ((ee !== 0 ? '<br>' : '') + (listeTypeQuestions.length === 1 ? '' : numAlpha(ee)))) + `$${nomDirectCorrect}$ est :`,
            propositions: ['le sommet', 'un côté', 'le nom de l\'angle', 'rien de cela'],
            reponses: ['le nom de l\'angle'],
            explications: `C'est l'angle de sommet $${B.nom}$, formé par les demi-droites $[${B.nom}${A.nom})$ et $[${B.nom}${C.nom})$.`
          }
            break
          case 'sommet':
            questionReponse =
          {
            question: (context.isAmc ? '' : ((ee !== 0 ? '<br>' : '') + (listeTypeQuestions.length === 1 ? '' : numAlpha(ee)))) + `$${B.nom}$ est :`,
            propositions: ['le sommet', 'un côté', 'le nom de l\'angle', 'rien de cela'],
            reponses: ['le sommet'],
            explications: 'Le sommet de l\'angle est l\'origine commune des demi-droites qui le forment.'
          }

            break
          case 'cote':
            questionReponse =
          {
            question: (context.isAmc ? '' : ((ee !== 0 ? '<br>' : '') + (listeTypeQuestions.length === 1 ? '' : numAlpha(ee)))) + `$[${B.nom}${C.nom})$ est :`,
            propositions: ['le sommet', 'un côté', 'le nom de l\'angle', 'rien de cela'],
            reponses: ['un côté'],
            explications: 'Les côtés sont les demi-droites qui forment l\'angle.'
          }

            break
          case 'autre': {
            let question = ''
            let explications = ''
            switch (choice(['sommet', 'cote', 'nom'])) {
              case 'sommet':
                question = `$${A.nom}$ est :`
                explications = 'Le sommet de l\'angle est l\'origine commune des demi-droites qui le forment.'
                break
              case 'cote':
                question = `$${B.nom}${A.nom}$ est :`
                explications = 'Les côtés sont des demi-droites et se notent donc avec un crochet et une parenthèse.'
                break
              case 'nom':
                question = `$${nomIndirrectIncorrect}$ est :`
                explications = `C'est l'angle de sommet $${B.nom}$, formé par les demi-droites $[${B.nom}${A.nom})$ et $[${B.nom}${C.nom})$, c'est donc l'angle $${nomDirectCorrect}$.`
                break
            }
            questionReponse =
            {
              question: context.isAmc ? question : ((ee !== 0 ? '<br>' : '') + (listeTypeQuestions.length === 1 ? '' : numAlpha(ee)) + question),
              propositions: ['le sommet', 'un côté', 'le nom de l\'angle', 'rien de cela'],
              reponses: ['rien de cela'],
              explications
            }

            break
          }
        }
        const propositions = []
        for (const proposition of questionReponse.propositions) {
          let statut = false
          for (const reponse of questionReponse.reponses) {
            if (proposition === reponse) statut = true
          }
          propositions.push({
            texte: proposition,
            statut,
            feedback: ''
          })
        }
        if (!context.isAmc) {
          this.autoCorrection[ee + i * listeTypeQuestions.length] = {
            enonce: questionReponse.question,
            options: { ordered: true },
            propositions
          }
        }
        const monQcm = propositionsQcm(this, ee + i * listeTypeQuestions.length)
        texteQuestion += '<br>'
        texteQuestion += questionReponse.question + '<br>'
        texteQuestion += monQcm.texte
        texteCorrQuestion += questionReponse.question + '<br>'
        texteCorrQuestion += monQcm.texteCorr
        texteCorrQuestion += this.correctionDetaillee ? ('<br>' + questionReponse.explications + '<br><br>') : '<br>'
        texte += texteQuestion
        texteCorr += texteCorrQuestion
        if (context.isAmc) {
          propositionsAMC[ee] = {
            type: 'qcmMult', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
            enonce: questionReponse.question,
            propositions
          }
        }

        ee++
      }

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texteFigure,
          enonceAvant: true, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
          enonceCentre: true, // EE : ce champ est facultatif et permet (si true) de centrer le champ 'enonce' ci-dessus.
          melange: true, // EE : ce champ est facultatif et permet (si false) de ne pas provoquer le mélange des questions.
          options: { avecSymboleMult: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) des propositions : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
          propositions: propositionsAMC
        }
      }

      if (this.questionJamaisPosee(i, ...pointsX, ...pointsY)) {
        this.listeQuestions.push(texteFigure + texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.besoinFormulaireTexte = ['Cas à traiter ', 'Nombres séparés par des tirets\n1 : Nom de l\'angle\n2 : Sommet de l\'angle\n3 : Côté de l\'angle\n4 : Rien de cela\n5 : Mélange']
  }
}
