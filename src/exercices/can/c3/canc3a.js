import { afficheCoteSegment, codageSegments, texteSurSegment } from '../../../lib/2d/codages.js'
import { point } from '../../../lib/2d/points.js'
import { polygoneRegulier } from '../../../lib/2d/polygones.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { homothetie } from '../../../lib/2d/transformations.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { personne, prenom } from '../../../lib/outils/Personne'
import { texPrix } from '../../../lib/format/style'
import { stringNombre, texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../../modules/outils.js'

import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif'

export const titre = 'Course aux nombres CM1'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Ensemble de questions pour course aux nombres
 * @author Jean-Claude Lhote
 * Référence
 */
export const uuid = '32a0f'
export const ref = 'canc3a'
export const refs = {
  'fr-fr': ['canc3a'],
  'fr-ch': []
}
export default function CourseAuxNombresCM () {
  Exercice.call(this)
  this.nbQuestions = 30
  if (this.interactif) {
    this.consigne = "Saisir la réponse numérique uniquement sauf si l'unité est explicitement demandée."
  } else {
    this.consigne = ''
  }

  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
  this.nouvelleVersion = function () {
    let a, b, c, d, resultat, objets, A, B, C

    const listeIndex = gestionnaireFormulaireTexte({
      saisie: this.sup,
      nbQuestions: this.nbQuestions,
      max: 30,
      defaut: 31,
      melange: 31,
      shuffle: false
    }).map((index) => index - 1)

    const fruits2 = [
      ['pêches', 4.5, 10, 30],
      ['noix', 5.2, 4, 13],
      ['cerises', 6.4, 11, 20],
      ['pommes', 2.7, 20, 40],
      ['framboises', 10.5, 1, 5],
      ['fraises', 7.5, 5, 10],
      ['citrons', 1.8, 15, 30],
      ['bananes', 1.7, 15, 25]
    ]
    const typeQuestionsDisponibles = [ // Les dix premières sont identiques dans le fichier betaCaNCM2
      'q1', // Somme d'entiers
      'q2', // Différence d'entiers
      'q3', // Somme d'entiers avec retenue
      'q4', // Différence d'entiers avec retenue
      'q5', // Décomposition
      'q6', // Division d'entiers
      'q7', // Somme décimal et entier
      'q8', // Somme de décimaux
      'q9', // Différence de décimaux
      'q10', // Différence décimaux
      'q11', // Division d'entiers
      'q12', // Addition d'entiers
      'q13', // Différence d'entiers
      'q14', // Produit d'entiers
      'q15', // Produit décimal entier
      'q16', // Ajout d'un décimal à un entier
      'q17', // Fait numérique table de x
      'q18', // Multiplication par 4
      'q19', // Différence de décimaux
      'q20', // Somme de décimaux
      'q21', // Multiple de 8
      'q22', // Multiplication entier et décimal
      'q23', // Multiplier par 20
      'q24', // Proportionnalité
      'q25', // Quotient par 4
      'q26', // Triple d'entier
      'q27', // Soustraction entiers mesures
      'q28', // Durée
      'q29', // Proportionnalité
      'q30' // Addition d'entiers mesures
    ]
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      // texNombre(n) permet d'écrire un nombre avec le bon séparateur décimal !! à utiliser entre $  $
      // calcul(expression) permet d'éviter les erreurs de javascript avec les approximations décimales
      // texNombre(expression) fait les deux choses ci-dessus.
      switch (typeQuestionsDisponibles[listeIndex[i]]) { // Suivant le type de question, le contenu sera différent
        case 'q1': // somme d'entiers à deux chiffres sans retenue
          a = randint(1, 3) * 10 + randint(1, 5)
          b = randint(1, 5) * 10 + randint(1, 4)
          texte = `$${a}+${b}$`
          texteCorr = `$${a}+${b}=${a + b}$`
          setReponse(this, i, a + b, { formatInteractif: 'calcul' })
          break
        case 'q2': // différence d'entiers sans retenue
          a = randint(1, 3) * 10 + randint(1, 5)
          b = randint(1, 5) * 10 + randint(1, 4)
          texte = `$${a + b}-${a}$`
          texteCorr = `$${a + b}-${a}=${b}$`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q3': // somme d'entiers à deux chiffres avec retenue
          a = randint(1, 3) * 10 + randint(5, 9)
          b = randint(1, 5) * 10 + randint(11 - a % 10, 9)
          texte = `$${a}+${b}$`
          texteCorr = `$${a}+${b}=${a + b}$`
          setReponse(this, i, a + b, { formatInteractif: 'calcul' })
          break
        case 'q4': // difference avec retenue
          a = randint(1, 3) * 10 + randint(5, 9)
          b = randint(1, 5) * 10 + randint(11 - a % 10, 9)
          texte = `$${a + b}-${a}$`
          texteCorr = `$${a + b}-${a}=${b}$`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q5': // Décomposition
          a = randint(1, 3)
          b = randint(1, 9, a)
          c = randint(1, 9, [a, b])
          resultat = calculANePlusJamaisUtiliser(a * 1000 + b * 10 + c * 100)
          texte = `$${texNombre(a)}\\times ${texNombre(1000)} + ${texNombre(b)}\\times 10 + ${texNombre(c)}\\times 100$`
          texteCorr = `$${texNombre(a)}\\times ${texNombre(1000)} + ${texNombre(b)}\\times 10 + ${texNombre(c)}\\times 100 =${texNombre(resultat)}$`
          setReponse(this, i, resultat, { formatInteractif: 'calcul' })
          break
        case 'q6': // Division d'entiers
          a = randint(2, 9)
          b = randint(3, 9)
          texte = `$${a * b}\\div${a}$`
          texteCorr = `$${a * b}\\div${a}=${b}$`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q7': // Somme entier et décimal
          a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(1, 5) / 10)
          b = randint(1, 4)
          texte = `$${texNombre(a)}+${b}$`
          texteCorr = `$${texNombre(a)}+${b}=${texNombre(a + b)}$`
          setReponse(this, i, calculANePlusJamaisUtiliser(a + b), { formatInteractif: 'calcul' })
          break
        case 'q8': // Somme décimaux
          a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(1, 5) / 10)
          b = calculANePlusJamaisUtiliser(randint(1, 4) + randint(1, 4) / 10 + randint(1, 9) / 100)
          texte = `$${texNombre(a)}+${texNombre(b)}$`
          texteCorr = `$${texNombre(a)}+${texNombre(b)}=${texNombre(a + b)}$`
          setReponse(this, i, calculANePlusJamaisUtiliser(a + b), { formatInteractif: 'calcul' })
          break
        case 'q9': // Différence décimaux
          a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(1, 5) / 10)
          b = calculANePlusJamaisUtiliser(randint(1, 4) + randint(1, 4) / 10 + randint(1, 9) / 100)
          texte = `$${texNombre(a + b)}-${texNombre(a)}$`
          texteCorr = `$${texNombre(a + b)}-${texNombre(a)}=${texNombre(b)}$`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q10': // Différence décimaux avec retenue
          a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(5, 9) / 10)
          b = calculANePlusJamaisUtiliser(randint(1, 4) + randint(5, 9) / 10)
          texte = `$${texNombre(a + b)}-${texNombre(a)}$`
          texteCorr = `$${texNombre(a + b)}-${texNombre(a)}=${texNombre(b)}$`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q11' : // Divisions d'entiers
          a = choice([2, 3, 4, 5])
          b = randint(3, 9)
          c = prenom()
          texte = `J'ai $${calculANePlusJamaisUtiliser(a * b)}$ ans. Je suis $${a}$ fois plus âgé que ${c}.<br>Quel âge a ${c} ?`
          texteCorr = `L'âge de ${c} est : $${calculANePlusJamaisUtiliser(a * b)} \\div ${a}=${b}$ ans.`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q12' : // Addition d'entiers
          a = randint(1, 2) * 10 + randint(1, 9)
          b = randint(1, 2) * 10 + randint(1, 5)
          c = randint(1, 2) * 10 + randint(1, 9)
          d = personne()
          texte = `${d.prenom} participe à une course par étapes. La première étape fait $${a}$ km, la deuxième fait $${b}$ km et la dernière fait $${c}$ km.<br>Combien de kilomètres ${d.prenom} a-t-${d.pronom} parcourus ?`
          texteCorr = `${d.prenom} a parcouru : $${a} + ${b} + ${c} = ${a + b + c}$ km.`
          setReponse(this, i, calculANePlusJamaisUtiliser(a + b + c), { formatInteractif: 'calcul' })
          break
        case 'q13' : // Différence d'entiers
          a = randint(11, 19)
          b = randint(3, 8)
          c = calculANePlusJamaisUtiliser(a - b)
          d = personne()
          switch (randint(1, 2)) {
            case 1:
              texte = `${d.prenom} a $${a}$ ans. ${d.pronom} a $${b}$ ans de plus que son frère.<br>Quel âge a son frère ?`
              texteCorr = `Le frère de ${d.prenom} a : $${a} - ${b} = ${a - b}$ ans.`
              break
            case 2:
              texte = `${d.prenom} a $${a}$ ans. Sa sœur a $${b}$ ans.<br>Quelle est leur différence d'âge ?`
              texteCorr = `La différence d'âge entre ${d.prenom} et sa sœur est : $${a}-${b}=${a - b}$ ans.`
              break
          }
          setReponse(this, i, calculANePlusJamaisUtiliser(a - b), { formatInteractif: 'calcul' })
          break
        case 'q14' : // Produit d'entiers
          a = randint(2, 6)
          b = randint(7, 12)
          d = personne()
          switch (randint(1, 2)) {
            case 1:
              texte = `${d.prenom} possède $${a}$ lots de $${b}$ ${choice(['crayons', 'cartes', 'stylos', 'livres'])}. Combien en a-t-${d.pronom} ?`
              texteCorr = `${d.prenom} en possède : $${a} \\times ${b}=${calculANePlusJamaisUtiliser(a * b)}$.`
              break
            case 2:
              texte = `${d.prenom} a couru $${a}$ séquences de $${b}$ minutes. Combien de minutes a-t-${d.pronom} couru en tout ?`
              texteCorr = `${d.prenom} a couru : $${a} \\times ${b}=${calculANePlusJamaisUtiliser(a * b)}$ minutes.`
              break
          }
          setReponse(this, i, calculANePlusJamaisUtiliser(a * b), { formatInteractif: 'calcul' })
          break
        case 'q15': // Produit décimal entier
          a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(1, 5) / 10)
          b = randint(2, 5)
          c = choice(fruits2)
          d = personne()
          texte = `Les ${c[0]} sont vendus $${texPrix(c[1])}$ € par kilogramme. ${d.prenom} en achète $${b}$ kg. Combien va-t-${d.pronom} payer ?`
          texteCorr = `${d.prenom} devra payer $${b}\\times${texPrix(c[1])}=${texPrix(c[1] * b)}$ €.`
          setReponse(this, i, calculANePlusJamaisUtiliser(b * c[1]), { formatInteractif: 'calcul' })
          break
        case 'q16': // ajout d'un décimal à un entier
          a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(1, 5) / 10)
          b = randint(1, 15)
          switch (randint(1, 3)) {
            case 1:
              texte = `Combien font $${b}$ de plus que $${texNombre(a)}$ ?`
              texteCorr = `$${texNombre(a)}+${b}=${texNombre(a + b)}$`
              break
            case 2:
              texte = `$\\ldots - ${texNombre(a)}=${b}$`
              texteCorr = `$${miseEnEvidence(texNombre(a + b))} - ${texNombre(a)}=${b}$`
              break
            case 3:
              texte = `$\\ldots - ${b}=${texNombre(a)}$`
              texteCorr = `$${miseEnEvidence(texNombre(a + b))} - ${b}=${texNombre(a)}$`
              break
          }
          setReponse(this, i, calculANePlusJamaisUtiliser(a + b), { formatInteractif: 'calcul' })
          break
        case 'q17' : // fait numérique table de multiplication
          a = randint(2, 9)
          b = randint(5, 9)
          switch (randint(1, 3)) {
            case 1:
              texte = `$${a} \\times ${b}$`
              texteCorr = `$${a} \\times ${b}=${calculANePlusJamaisUtiliser(a * b)}$`
              setReponse(this, i, calculANePlusJamaisUtiliser(a * b), { formatInteractif: 'calcul' })
              break
            case 2:
              texte = `$${a} \\times \\ldots = ${calculANePlusJamaisUtiliser(a * b)}$`
              texteCorr = `$${a} \\times ${miseEnEvidence(b)}=${calculANePlusJamaisUtiliser(a * b)}$`
              setReponse(this, i, b, { formatInteractif: 'calcul' })
              break
            case 3:
              texte = `$\\ldots \\times ${b}= ${calculANePlusJamaisUtiliser(a * b)}$`
              texteCorr = `$${miseEnEvidence(a)} \\times ${b}=${calculANePlusJamaisUtiliser(a * b)}$`
              setReponse(this, i, a, { formatInteractif: 'calcul' })
              break
          }
          break
        case 'q18' : // fait numérique multiplication par 4
          a = randint(6, 19)
          switch (randint(1, 3)) {
            case 1:
              texte = choice([`$${a} \\times 4$`, `$4 \\times ${a}$`])
              break
            case 2:
              texte = `Quel est le périmètre d'un carré de côté ${a} ?`
              texteCorr = `$${a} \\times 4=${calculANePlusJamaisUtiliser(a * 4)}$`
              break
            case 3:
              texte = `Le double du double de $${a}$`
              break
          }
          texteCorr = `$${a} \\times 4=${calculANePlusJamaisUtiliser(a * 4)}$`
          setReponse(this, i, calculANePlusJamaisUtiliser(a * 4), { formatInteractif: 'calcul' })
          break
        case 'q19': // différences de décimaux
          a = calculANePlusJamaisUtiliser(randint(2, 5) + randint(1, 5) / 10)
          b = calculANePlusJamaisUtiliser(randint(2, 5) + randint(1, 5) / 10)
          c = calculANePlusJamaisUtiliser(a + b)
          switch (randint(1, 3)) {
            case 1:
              texte = `On a coupé $${texNombre(a)}$ cm d'une ficelle qui en faisait $${texNombre(c)}$.<br>Combien de centimètres en reste-t-il ?`
              texteCorr = `$${texNombre(c)}-${texNombre(a)}=${texNombre(b)}$`
              break
            case 2:
              texte = `$\\ldots + ${texNombre(a)}=${texNombre(c)}$`
              texteCorr = `$${miseEnEvidence(texNombre(b))} + ${texNombre(a)}=${texNombre(c)}$`
              break
            case 3:
              A = point(0, 0)
              B = point(5, 0)
              C = homothetie(B, A, a / c)
              objets = []
              objets[0] = segment(A, B)
              objets[0].styleExtremites = '|-|'
              objets[1] = texteSurSegment(`${stringNombre(c)}`, B, A, 'black', -0.5)
              objets[2] = segment(A, C)
              objets[2].styleExtremites = '|-|'
              objets[3] = afficheCoteSegment(segment(A, C), `${stringNombre(a)}`, -1, 'blue')
              objets[4] = afficheCoteSegment(segment(C, B), '?', -1, 'red')
              texte = mathalea2d({
                xmin: -0.1,
                xmax: 5.1,
                ymin: -1.5,
                ymax: 1.5,
                pixelsParCm: 20,
                scale: 1
              }, objets)
              texteCorr = `$${texNombre(c)} - ${texNombre(a)}=${texNombre(b)}$`
              break
          }
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q20': // somme de décimaux
          a = calculANePlusJamaisUtiliser(randint(2, 5) + randint(1, 5) / 10)
          b = calculANePlusJamaisUtiliser(randint(2, 5) + randint(1, 5) / 10)
          c = calculANePlusJamaisUtiliser(a + b)
          switch (randint(1, 3)) {
            case 1:
              texte = `On a soudé ensemble une barre de $${texNombre(a)}$ m et une autre de $${texNombre(b)}$ m.<br>Combien de mètres fait l'assemblage ?`
              texteCorr = `$${texNombre(a)}+${texNombre(b)}=${texNombre(c)}$`
              break
            case 2:
              texte = `$\\ldots - ${texNombre(a)}=${texNombre(b)}$`
              texteCorr = `$${miseEnEvidence(texNombre(c))} - ${texNombre(a)}=${texNombre(b)}$`
              break
            case 3:
              A = point(0, 0)
              B = point(5, 0)
              C = homothetie(B, A, a / c)
              objets = []
              objets[0] = segment(A, B)
              objets[0].styleExtremites = '|-|'
              objets[1] = afficheCoteSegment(objets[0], '?', 0.5, 'red')
              objets[2] = segment(A, C)
              objets[2].styleExtremites = '|-|'
              objets[3] = afficheCoteSegment(objets[2], `${stringNombre(a)}`, -1, 'blue')
              objets[4] = afficheCoteSegment(segment(C, B), `${stringNombre(b)}`, -1, 'green')
              texte = mathalea2d({
                xmin: -0.1,
                xmax: 5.1,
                ymin: -1.5,
                ymax: 1.5,
                pixelsParCm: 20,
                scale: 1
              }, objets)
              texteCorr = `$${miseEnEvidence(texNombre(a))} + ${texNombre(b)}=${texNombre(c)}$`
              break
          }
          setReponse(this, i, c, { formatInteractif: 'calcul' })
          break
        case 'q21' : // fait numérique multiplication par 8
          a = randint(4, 15)
          switch (randint(1, 3)) {
            case 1:
              texte = choice([`$${a} \\times 8$`, `$8 \\times ${a}$`])
              texteCorr = `$${a} \\times 8=${calculANePlusJamaisUtiliser(a * 8)}$`

              setReponse(this, i, calculANePlusJamaisUtiliser(a * 8), { formatInteractif: 'calcul' })
              break
            case 2:
              texte = `$\\ldots \\times 8=${calculANePlusJamaisUtiliser(a * 8)}$`
              texteCorr = `$${miseEnEvidence(a)} \\times 8=${calculANePlusJamaisUtiliser(a * 8)}$`
              setReponse(this, i, a, { formatInteractif: 'calcul' })
              break
            case 3:
              texte = `Le quadruple du double de $${a}$`
              texteCorr = `$${a} \\times 4=${calculANePlusJamaisUtiliser(a * 4)}$`
              setReponse(this, i, calculANePlusJamaisUtiliser(a * 4), { formatInteractif: 'calcul' })
              break
          }
          break
        case 'q22': // Produit décimal entier
          switch (randint(1, 3)) {
            case 1:
              a = calculANePlusJamaisUtiliser(randint(1, 5) + randint(1, 5) / 10)
              b = randint(3, 6)
              objets = []
              if (b < 5) {
                A = point(-2, 0)
              } else {
                A = point(0, 0)
              }
              B = point(2, 0)
              C = polygoneRegulier(A, B, b)
              objets[0] = C
              objets[1] = texteSurSegment(`${stringNombre(a)} cm`, B, A)
              objets[2] = codageSegments('//', 'red', C.listePoints)
              texte = 'Quel est le périmètre de ce polygone ?<br>'
              texte += mathalea2d({
                xmin: -2.5,
                xmax: 3,
                ymin: -1,
                ymax: 5,
                pixelsParCm: 20,
                scale: 0.8
              }, objets)
              texteCorr = `Le périmètre mesure : $${b} \\times ${texNombre(a)}$ cm $=${texNombre(a * b)}$ cm.`
              break
            case 2:
              a = calculANePlusJamaisUtiliser(randint(4, 5) + choice([0.1, 0.25, 0.5]))
              b = choice([2, 4, 8])
              d = personne()
              texte = `${d.prenom} a acheté $${b}$ ${choice(['livres', 'gâteaux', 'jouets'])} à $${texPrix(a)}$ € pièce.<br>Combien a-t-${d.pronom} dépensé ?`
              texteCorr = `${d.prenom} a dépensé : $${b} \\times ${texNombre(a)} = ${texPrix(calculANePlusJamaisUtiliser(a * b))} $ €.`
              break
            case 3:
              a = calculANePlusJamaisUtiliser(randint(1, 9) + randint(1, 5) / 10)
              b = randint(2, 9)
              d = personne()
              texte = `${d.prenom} a vendu $${b}$ ${choice(['tableaux', 'photos', 'poteries'])} à $${texPrix(a)}$ € pièce.<br>Quelle somme d'argent a-t-${d.pronom} obtenu ?`
              texteCorr = `${d.prenom} a obtenu : $${b} \\times ${texNombre(a)} = ${texPrix(calculANePlusJamaisUtiliser(a * b))} $ €.`
              break
          }
          setReponse(this, i, calculANePlusJamaisUtiliser(a * b), { formatInteractif: 'calcul' })
          break
        case 'q23' : // multiplication par 20
          a = calculANePlusJamaisUtiliser(randint(1, 9) + randint(1, 5) / 10)
          switch (randint(1, 2)) {
            case 1:
              texte = choice([`$${texNombre(a)} \\times 20$`, `$20 \\times ${texNombre(a)}$`])
              texteCorr = `$${texNombre(a)} \\times 20=${texNombre(a * 20)}$`
              setReponse(this, i, calculANePlusJamaisUtiliser(a * 20), { formatInteractif: 'calcul' })
              break
            case 2:
              texte = `$\\ldots \\times 20=${texNombre(a * 20)}$`
              texteCorr = `$${miseEnEvidence(texNombre(a))} \\times 20=${texNombre(a * 20)}$`
              setReponse(this, i, a, { formatInteractif: 'calcul' })
              break
          }
          break
        case 'q24': // proportionnalité
          a = randint(0, 7)
          b = fruits2[a][1]
          c = randint(2, 5)
          d = randint(2, 5)
          texte = `$${c}$ kg de ${fruits2[a][0]} coûtent $${texNombre(c * b)}$ €, combien coûtent $${c * d}$ kg de ${fruits2[a][0]} ?`
          texteCorr = `$${c * d}$ kg de ${fruits2[a][0]} coûtent : $${texNombre(c * b)} \\times ${d} = ${texPrix(c * b * d)}$ €.`
          setReponse(this, i, calculANePlusJamaisUtiliser(c * d * b), { formatInteractif: 'calcul' })
          break
        case 'q25' : // quotient par 4
          a = randint(4, 15)
          switch (randint(1, 3)) {
            case 1:
              texte = `$${4 * a} \\div 4$`
              texteCorr = `$${4 * a} \\div 4=${a}$`
              break
            case 2:
              texte = `$\\ldots \\times 4=${4 * a}$`
              texteCorr = `$${miseEnEvidence(a)} \\times 4=${calculANePlusJamaisUtiliser(a * 4)}$`
              break
            case 3:
              texte = `La moitié de la moitié de ${4 * a}`
              texteCorr = `$${4 * a} \\div 4=${a}$`
              break
          }
          setReponse(this, i, a, { formatInteractif: 'calcul' })
          break
        case 'q26' : // double d'entiers
          a = randint(11, 99)
          switch (randint(1, 3)) {
            case 1:
              texte = `Le double de $${a}$`
              texteCorr = `$2 \\times ${a} = ${2 * a}$`
              break
            case 2:
              texte = `Le diamètre d'un cercle de $${a}$ unités de rayon.`
              texteCorr = `Le diamètre est le double du rayon : $2 \\times ${a} = ${2 * a}$`
              break
            case 3:
              texte = choice([`$2 \\times ${a}$`, `$${a} \\times 2$`])
              texteCorr = `$2 \\times ${a} = ${2 * a}$`
              break
          }
          setReponse(this, i, 2 * a, { formatInteractif: 'calcul' })
          break
        case 'q27': // différences d'entiers mesure
          a = randint(20, 50)
          b = randint(20, 50)
          c = calculANePlusJamaisUtiliser(a + b)
          A = point(0, 0)
          B = point(5, 0)
          C = homothetie(B, A, a / c)
          objets = []
          objets[0] = segment(A, B)
          objets[0].styleExtremites = '|-|'
          objets[1] = afficheCoteSegment(objets[0], c, 0.5, 'green')
          objets[2] = segment(A, C)
          objets[2].styleExtremites = '|-|'
          objets[3] = afficheCoteSegment(objets[2], a, -1, 'blue')
          objets[4] = afficheCoteSegment(segment(C, B), '?', -1, 'red')
          texte = mathalea2d({
            xmin: -0.1,
            xmax: 5.1,
            ymin: -1.5,
            ymax: 1.5,
            pixelsParCm: 20,
            scale: 1
          }, objets)
          texteCorr = `$${miseEnEvidence(c)} - ${a}=${b}$`
          setReponse(this, i, b, { formatInteractif: 'calcul' })
          break
        case 'q28':
          a = randint(17, 21) // heure pleine de début
          b = randint(5, 6) * 5 // minutes de début
          c = randint(17, 23) * 5 // durée en minutes
          d = a + ((b + c) / 60 >> 0) // heure pleine de fin
          resultat = calculANePlusJamaisUtiliser((b + c) % 60) // minutes de fin
          if (resultat !== 0) {
            if (resultat !== 5) {
              texte = `Le film a commencé à $${a}$ h $${b}$. Il s'est terminé à $${d}$ h $${resultat}$.<br> Combien de minutes a-t-il duré ?`
            } else {
              texte = `Le film a commencé à $${a}$ h $${b}$. Il s'est terminé à $${d}$ h $0${resultat}$.<br> Combien de minutes a-t-il duré ?`
            }
          } else {
            texte = `Le film a commencé à $${a}$ h $${b}$. Il s'est terminé à $${d}$ h.<br> Combien de minutes a-t-il duré ?`
          }
          texteCorr = `Le film a duré $${calculANePlusJamaisUtiliser(c / 60 >> 0)}$ h $${c % 60}$ min soit $${c}$ minutes.`
          setReponse(this, i, c, { formatInteractif: 'calcul' })
          break
        case 'q29': // proportionnalité
          a = choice([2, 3, 4, 5]) // choix du coefficient
          b = randint(3, 10) // donnée 1
          c = randint(2, 10, b) // donnée 2
          d = choice([['un train électrique', 'il', 'ce train électrique'], ['une voiture électrique', 'elle', 'cette voiture électrique'], ['un manège', 'il', 'ce manège']])
          texte = `En $${a * b}$ minutes, ${d[0]} fait $${a * c}$ tours.<br>En $${b}$ minutes ${d[1]} fait \\ldots tours.`
          texteCorr = `En $${a}$ fois moins de temps, ${d[2]} fait $${a}$ fois moins de tours, soit : $${a * c}$ tours $\\div ${a}=${c}$ tours.`
          setReponse(this, i, c, { formatInteractif: 'calcul' })
          break
        case 'q30': // additions d'entiers mesure
          a = randint(20, 50)
          b = randint(20, 50)
          c = calculANePlusJamaisUtiliser(a + b)
          A = point(0, 0)
          B = point(5, 0)
          C = homothetie(B, A, a / c)
          objets = []
          objets[0] = segment(A, B)
          objets[0].styleExtremites = '|-|'
          objets[1] = afficheCoteSegment(objets[0], '?', 0.5, 'red')
          objets[2] = segment(A, C)
          objets[2].styleExtremites = '|-|'
          objets[3] = afficheCoteSegment(objets[2], a, -1, 'blue')
          objets[4] = afficheCoteSegment(segment(C, B), b, -1, 'green')
          texte = mathalea2d({
            xmin: -0.1,
            xmax: 5.1,
            ymin: -1.5,
            ymax: 1.5,
            pixelsParCm: 20,
            scale: 1
          }, objets)
          texteCorr = `$${a} + ${b}=${c}$`
          setReponse(this, i, c, { formatInteractif: 'calcul' })
          break
      }

      texte += ajouteChampTexteMathLive(this, i)
      if (this.questionJamaisPosee(i, typeQuestionsDisponibles[listeIndex[i]], a, b, c)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Choix des questions',
        ` Nombres séparés par des tirets\n1 : Somme d'entiers\n
  2 : Différence d'entiers\n
  3 : Somme d'entiers avec retenue\n
  4 : Différence d'entiers avec retenue\n
  5 : Décomposition\n
  6 : Division d'entiers\n
  7 : Somme décimal et entier\n
  8 : Somme de décimaux\n
  9 : Différence de décimaux\n
  10 : Différence décimaux\n
  11 : Division d'entiers\n
  12 : Addition d'entiers\n
  13 : Différence d'entiers\n
  14 : Produit d'entiers\n
  15 : Produit décimal entier\n
  16 : Ajout d'un décimal à un entier\n
  17 : Fait numérique table de x\n
  18 : Multiplication par 4\n
  19 : Différence de décimaux\n
  20 : Somme de décimaux\n
  21 : Multiple de 8\n
  22 : Multiplication entier et décimal\n
  23 : Multiplier par 20\n
  24 : Proportionnalité\n
  25 : Quotient par 4\n
  26 : Triple d'entier\n
  27 : Soustraction entiers mesures\n
  28 : Durée\n
  29 : Proportionnalité\n
  30 : Addition d'entiers mesures\n
  31 : Mélange`]
}
