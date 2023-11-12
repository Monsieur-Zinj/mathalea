import { choice, combinaisonListesSansChangerOrdre, compteOccurences, shuffle } from '../../lib/outils/arrayOutils.js'
import { ecritureAlgebrique, rienSi1, reduirePolynomeDegre3, ecritureParentheseSiNegatif, reduireAxPlusB } from '../../lib/outils/ecritures.js'
import { arrondi, range1, abs, range, rangeMinMax } from '../../lib/outils/nombres.js'
import { codageSegments } from '../../lib/2d/codages.js'
import { codageAngleDroit } from '../../lib/2d/angles.js'
import { milieu, point } from '../../lib/2d/points.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPosition, labelPoint } from '../../lib/2d/textes.js'
import { droiteGraduee } from '../../lib/2d/reperes.js'
import { creerNomDePolygone, sp } from '../../lib/outils/outilString.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { texNombre, stringNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Decimal from 'decimal.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import Hms from '../../modules/Hms.js'
import { prenomF } from '../../lib/outils/Personne.js'
// import { resoudre } from '../../modules/outilsMathjs.js'
export const titre = 'CAN Spéciale année 2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '8ff87'
export const ref = 'can2024'
// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '20/12/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
// export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export default function CourseAuxNombres2024 () {
  Exercice.call(this) // Héritage de la classe Exercice()

  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.tailleDiaporama = 2 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
  this.sup2 = 'x'
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let questions = []

    if (!this.sup) {
      // Si aucune question n'est sélectionnée
      questions = combinaisonListesSansChangerOrdre(range1(70), this.nbQuestions)
    } else {
      if (typeof this.sup === 'number') {
        // Si c'est un nombre c'est qu'il y a qu'une seule question
        questions[0] = this.sup
        this.nbQuestions = 1
      } else {
        questions = this.sup.split('-') // Sinon on créé un tableau à partir des valeurs séparées par des -
        this.nbQuestions = questions.length
      }
    }
    for (let i = 0; i < questions.length; i++) {
      questions[i] = parseInt(questions[i]) - 1
    }
    const listeIndex = combinaisonListesSansChangerOrdre(questions, this.nbQuestions)
    // const fruits2 = [
    //   ['pêches', 4.5, 10, 30],
    //   ['noix', 5.2, 4, 13],
    //   ['cerises', 6.4, 11, 20],
    //   ['pommes', 2.7, 20, 40],
    //   ['framboises', 10.5, 1, 5],
    //   ['fraises', 7.5, 5, 10],
    //   ['citrons', 1.8, 15, 30],
    //   ['bananes', 1.7, 15, 25]
    // ]

    let niveauAttendu = parseInt(this.sup2[0])
    if (isNaN(niveauAttendu)) {
      niveauAttendu = choice(range(7)) // Niveau au Hasard
    } else if (niveauAttendu > 6) niveauAttendu = choice(range(7)) // Si erreur du nombre choisi, niveau au hasard

    let niveauChoisi = ''
    switch (niveauAttendu) {
      case 0 :
        niveauChoisi = 'Terminale'
        break
      case 1 :
        niveauChoisi = 'Première'
        break
      case 2 :
        niveauChoisi = 'Seconde'
        break
      case 3 :
        niveauChoisi = 'Troisième'
        break
      case 4 :
        niveauChoisi = 'Quatrième'
        break
      case 5 :
        niveauChoisi = 'Cinquième'
        break
      case 6 :
        niveauChoisi = 'Sixième'
        break
      case 7 :
        niveauChoisi = 'CM'
        break
    }
    // this.consigne = 'Gilles, je te laisse modifier la consigne mais cela pourrait être du genre : <br>'
    this.consigne = 'Course Aux Nombres 2024 de niveau ' + niveauChoisi

    const listeCAN = [ // Pour chaque question de la CAN, on établit son niveauMax et son niveauMin
      rangeMinMax(4, 7), // Q1
      rangeMinMax(0, 2), // Q2
      rangeMinMax(1, 7) // etc... Ici, ce ne sont que des exemples mis au hasard pour pouvoir tester
    ]

    for (let i = 0; i < 72; i++) { // A supprimer... C'est pour faire des tests...
      listeCAN[i] = range(7)
    }
    // const typeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]// 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42
    const typeQuestionsDisponibles = []

    for (let i = 70; i < 72; i++) { // Ici, selon le niveau attendu, on ne sélectionne que les questions qu'il faut
      if (compteOccurences(listeCAN[i], niveauAttendu) === 1) typeQuestionsDisponibles.push(i + 1)
    }
    for (let i = 0, index = 0, reponse, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 71;) {
      // Boucle principale où i+1 correspond au numéro de la question
      // texNombre(n) permet d'écrire un nombre avec le bon séparateur décimal !! à utiliser entre $  $
      // calcul(expression) permet d'éviter les erreurs de javascript avec les approximations décimales
      // texNombre(expression) fait les deux choses ci-dessus.
      switch (typeQuestionsDisponibles[listeIndex[i]]) { // Suivant le type de question, le contenu sera différent
        case 1:{
          const a = randint(1, 3)
          if (a === 1) {
            texte = `$${texNombre(2024)}\\times 2$`
            texteCorr = `$${texNombre(2024)}\\times 2=${miseEnEvidence(texNombre(4048))}$`
            reponse = 4048
          } else if (a === 2) {
            texte = `$${texNombre(2024)}\\div 2$`
            texteCorr = `$${texNombre(2024)}\\div 2=${miseEnEvidence(texNombre(1012))}$`
            reponse = 1012
          } else {
            texte = `$${texNombre(2024)}\\times 3$`
            texteCorr = `$${texNombre(2024)}\\times 3=${miseEnEvidence(texNombre(6072))}$`
            reponse = 6072
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 2:{
          const a = randint(1, 3)
          if (a === 1) {
            texte = `La moitié de $${texNombre(2024)}$.`
            texteCorr = `La moitié de $${texNombre(2024)}$ est : $${texNombre(2024)}\\div 2=${miseEnEvidence(texNombre(1012))}$.`
            reponse = 1012
          } else if (a === 2) {
            texte = `Le quart de $${texNombre(2024)}$.`
            texteCorr = `Le quart de $${texNombre(2024)}$ est : $${texNombre(2024)}\\div 4=${miseEnEvidence(texNombre(506))}$.`
            reponse = 506
          } else if (a === 3) {
            texte = `Le double de $${texNombre(2024)}$.`
            texteCorr = `$${texNombre(2024)}\\times 2=${miseEnEvidence(texNombre(2048))}$`
            reponse = 2048
          } else {
            texte = `Le triple de $${texNombre(2024)}$.`
            texteCorr = `$${texNombre(2024)}\\times 3=${miseEnEvidence(texNombre(6072))}$`
            reponse = 6072
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 3:{
          const a = new Decimal(randint(1, 29, [10, 20])).div(choice([10, 100]))
          reponse = new Decimal(2024).sub(a)
          texte = `$${texNombre(2024)}-${texNombre(a, 2)}$`
          texteCorr = `$${texNombre(2024)}-${texNombre(a, 2)}=${miseEnEvidence(texNombre(reponse, 2))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 4:
          {
            const b = choice([2, 3, 4, 5, 10, 20, 100, 1000])
            if (choice([true, false])) {
              texte = `Quel est le plus grand entier multiple de  $${texNombre(b)}$ inférieur à $${texNombre(2024)}$ ?`
              if (2024 % b === 0) {
                reponse = 2024 - b
                texteCorr = `Comme $${texNombre(2024)}$ est lui-même divisible par $${texNombre(b)}$, le plus grand multiple cherché est $${texNombre(2024)}-${texNombre(b)}=${miseEnEvidence(texNombre(reponse))}$.`
              } else {
                reponse = Math.floor(2024 / b) * b
                texteCorr = `Comme $${b}\\times ${Math.floor(2024 / b)} =${Math.floor(2024 / b) * b} < ${texNombre(2024)}$ et
          $ ${b}\\times${Math.floor(2024 / b) + 1}=${(Math.floor(2024 / b + 1)) * b} > ${texNombre(2024)}$,
          alors le plus grand multiple cherché est $${miseEnEvidence(texNombre(reponse))}$.`

                // EE : Elle est chaude cette correction ci-dessus.... On pourrait la simplifier.
              }
            } else {
              texte = `Quel est le plus petit entier multiple de $${texNombre(b)}$  supérieur à $${texNombre(2024)}$ ?`
              if (2024 % b === 0) {
                reponse = 2024 + b
                texteCorr = `Comme $${texNombre(2024)}$ est lui-même divisible par $${b}$, le plus petit multiple cherché est $${texNombre(2024)}+${b}= ${texNombre(2024)}+${b}=${miseEnEvidence(reponse)}$.`
              } else {
                reponse = Math.ceil(2024 / b) * b
                texteCorr = ` Comme $${b}\\times ${Math.ceil(2024 / b) - 1} =${Math.ceil(2024 / b) * b - b} < ${texNombre(2024)}$ et
                $ ${b}\\times${Math.ceil(2024 / b)}=${(Math.ceil(2024 / b)) * b} > ${texNombre(2024)}$,
                alors le plus petit multiple cherché est $${miseEnEvidence(texNombre(reponse))}$.`
              }
            }
            setReponse(this, index, reponse)
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push('')
          }
          break

        case 5: {
          const a = randint(78, 299, [100, 200])
          texte = `$${texNombre(2024)}+${a}$`
          reponse = 2024 + a
          texteCorr = `$${texNombre(2024)}+${a}=${miseEnEvidence(texNombre(reponse, 0))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 6: {
          const a = randint(25, 60)
          texte = `$${texNombre(2024)}-${a}$`
          reponse = 2024 - a
          texteCorr = `$${texNombre(2024)}-${a}=${miseEnEvidence(texNombre(reponse, 0))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 7: {
          const a = randint(25, 60)
          texte = `$${a}-${texNombre(2024)}$`
          reponse = a - 2024
          texteCorr = `$${a}-${texNombre(2024)}=${miseEnEvidence(texNombre(reponse, 0))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 8:
          texte = `Notation scientifique de $${texNombre(2024)}$.`
          reponse = '2,024\\times 10^{3}'
          texteCorr = `L'écriture scientique de $${texNombre(2024)}$ est $${miseEnEvidence(`${reponse}`)}$.`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
          break
        case 9: {
          const calc = [10, 100, 1000]
          const calc1 = choice(calc)
          texte = ` $${texNombre(2024)}\\times ${calc1}$`
          texteCorr = `$${texNombre(2024)}\\times ${calc1}=${miseEnEvidence(texNombre(2024 * calc1, 0))}$`
          reponse = arrondi(calc1 * 2024, 0)
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 10: {
          const a = new Decimal(1).div(choice([10, 100, 1000]))
          texte = ` $${texNombre(2024)}\\times ${texNombre(a, 3)}$`
          texteCorr = `$${texNombre(2024)}\\times ${texNombre(a, 3)}=${miseEnEvidence(texNombre(2024 * a, 3))}$`
          reponse = arrondi(a * 2024, 3)
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 11: {
          const a = new Decimal(2024).div(choice([10, 100, 1000]))
          const calc = [10, 100, 1000]
          const calc1 = choice(calc)
          const choix = choice([true, false])
          const calc2 = new Decimal(1).div(calc1)
          reponse = arrondi(a * (choix ? calc1 : calc2), 3)
          texte = `$${texNombre(a, 3)}\\times ${texNombre(choix ? calc1 : calc2)}$`
          texteCorr = ` $${texNombre(a, 3)}\\times ${texNombre(choix ? calc1 : calc2)}=${miseEnEvidence(texNombre(a * (choix ? calc1 : calc2), 6))}$ `
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 12: {
          const choix = choice([true, false])
          if (choix) {
            reponse = 20.24
            texte = `$${texNombre(2024)}$ cm  $=$`

            texteCorr = `
          Comme $1$ m $=100$ cm, alors $1$ cm $=0,01$ m.<br>
          Ainsi  $${texNombre(2024)}$ cm$=${miseEnEvidence(texNombre(2024 / 100, 2))}$ m.  `
            setReponse(this, index, reponse)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01') + 'm'
            } else {
              texte += '  $\\ldots$ m'
            }
          } else {
            reponse = 202400
            texte = `$${texNombre(2024)}$ m  $=$ `
            texteCorr = ` Comme $1$ m $=100$ cm,  alors $${texNombre(2024)}$ m$=${miseEnEvidence(texNombre(202400))}$ cm.`
            setReponse(this, index, reponse)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01') + 'cm'
            } else {
              texte += '  $\\ldots$ cm'
            }
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 13: {
          const a = choice([2, 3, 4, 10, 20, 50, 100, 200, 1000, 2000])
          reponse = 2024 % a
          texte = `Quel est le reste de la division euclidienne de $${texNombre(2024)}$ par $${texNombre(a)}$ ?`
          if (reponse === 0) { texteCorr = `$${texNombre(2024)}$ est divisible par $${a}$, donc le reste est $${miseEnEvidence(0)}$.` } else {
            texteCorr = `$${texNombre(2024)}=${texNombre(a)}\\times ${texNombre((2024 - reponse) / a, 0)}+${reponse}$<br>
            Donc le reste est $${miseEnEvidence(reponse)}$.`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 14: {
          const a = new Decimal(2024).div(choice([10, 100]))
          const b = randint(1, 20)
          texte = ` $${texNombre(a, 3)}-${b}$`
          reponse = new Decimal(a).sub(b)
          texteCorr = `$${texNombre(a, 3)}-${b}=${miseEnEvidence(texNombre(reponse, 3))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 15: {
          const a = new Decimal(2024).div(choice([10000, 1000]))
          const b = randint(3, 10)
          texte = ` $${texNombre(a, 4)}-${b}$`
          reponse = new Decimal(a).sub(b)
          texteCorr = `$${texNombre(a, 3)}-${b}=${miseEnEvidence(texNombre(reponse, 4))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 16: {
          const a = 2024
          const b = randint(11, 59, [20, 30, 40, 50])
          const c = new Decimal(a).div(10)
          const d = new Decimal(b).div(100)
          const e = new Decimal(a).div(100)
          const f = new Decimal(b).div(10)
          if (choice([true, false])) {
            reponse = new Decimal(c).add(d)
            texte = `Écrire sous forme décimale $\\dfrac{${texNombre(a)}}{10}+\\dfrac{${b}}{100}$. `
            texteCorr = `$\\dfrac{${texNombre(a)}}{10}+\\dfrac{${b}}{100}=${texNombre(a / 10, 1)}+${texNombre(b / 100, 2)}=${miseEnEvidence(texNombre(reponse, 2))}$<br>`
          } else {
            reponse = new Decimal(e).add(f)
            texte = `Écrire sous forme décimale $\\dfrac{${b}}{10}+\\dfrac{${texNombre(a)}}{100}$. `
            texteCorr = `$\\dfrac{${b}}{10}+\\dfrac{${texNombre(a)}}{100}=${texNombre(b / 10, 1)}+${texNombre(a / 100, 2)}=${miseEnEvidence(texNombre(reponse, 2))}$<br>`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 17: {
          const a = randint(2040, 2080)
          const prenom = prenomF(1)
          texte = 'Si ' + prenom + ` naît en $${texNombre(2024)}$, quel âge aura-t-elle en $${texNombre(a)}$ ?`
          reponse = a - 2024
          texteCorr = prenom + ` aura $(${texNombre(a)}-${texNombre(2024)})$ ans, soit $${miseEnEvidence(texNombre(reponse))}$ ans.`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 18:
          if (choice([true, false])) {
            const abs0 = 2000
            const abs1 = new Decimal(abs0).add(24)
            const abs2 = new Decimal(abs0).add(48)
            const x1 = choice([new Decimal('0.25'), new Decimal('0.5'), new Decimal('0.75'), new Decimal('1.25'), new Decimal('1.5'), new Decimal('1.75')])
            const d = droiteGraduee({
              Unite: 4,
              Min: 0,
              Max: 2.1,
              thickSecDist: 0.25,
              axeStyle: '->',
              pointTaille: 4,
              pointStyle: 'x',
              labelsPrincipaux: false,
              thickSec: true,
              labelListe: [[0, `${stringNombre(abs0)}`], [1, `${stringNombre(abs1)}`], [2, `${stringNombre(abs2)}`]],
              pointListe: [[x1, '']]
            })
            reponse = new Decimal(x1).mul(24).add(abs0)
            texte = 'Déterminer l\'abscisse du point $A$. <br>' + mathalea2d({ xmin: -0.9, ymin: -1.5, xmax: 10, ymax: 1.5, pixelsParCm: 30, scale: 0.6 }, texteParPosition('A', 4 * x1, 0.8, 'milieu', 'blue', 1.5), d)
            texteCorr = `Entre $${texNombre(abs0)}$ et $${texNombre(abs1)}$, il y a $4$ intervalles.<br>
               Une graduation correspond donc à $6$ unités. Ainsi, l'abscisse du point $A$ est $${miseEnEvidence(texNombre(reponse))}$.`
          } else {
            const abs0 = 2000
            const abs1 = new Decimal(abs0).add(24)
            const abs2 = new Decimal(abs0).add(48)
            const x1 = choice([new Decimal(1).div(3), new Decimal(2).div(3), new Decimal(4).div(3), new Decimal(5).div(3)])
            const d = droiteGraduee({
              Unite: 4,
              Min: 0,
              Max: 2.1,
              thickSecDist: 0.3333,
              axeStyle: '->',
              pointTaille: 4,
              pointStyle: 'x',
              labelsPrincipaux: false,
              thickSec: true,
              labelListe: [[0, `${stringNombre(abs0)}`], [1, `${stringNombre(abs1)}`], [2, `${stringNombre(abs2)}`]],
              pointListe: [[x1, '']]
            })
            reponse = new Decimal(x1).mul(24).add(abs0)
            texte = 'Déterminer l\'abscisse du point $A$. <br>' + mathalea2d({ xmin: -0.9, ymin: -1.5, xmax: 10, ymax: 1.5, pixelsParCm: 30, scale: 0.6 }, texteParPosition('A', 4 * x1, 0.8, 'milieu', 'blue', 1.5), d)
            texteCorr = `Entre $${texNombre(abs0)}$ et $${texNombre(abs1)}$, il y a $3$ intervalles.<br>
                     Une graduation correspond donc à $8$ unités. Ainsi, l'abscisse du point $A$ est $${miseEnEvidence(texNombre(reponse))}$.`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
          break
        case 19:
          if (choice([true, false])) {
            const abs0 = 2023
            const abs1 = 2024
            const abs2 = 2025
            const x1 = choice([new Decimal('0.25'), new Decimal('0.5'), new Decimal('0.75'), new Decimal('1.25'), new Decimal('1.5'), new Decimal('1.75')])
            const d = droiteGraduee({
              Unite: 4,
              Min: 0,
              Max: 2.1,
              thickSecDist: 0.25,
              axeStyle: '->',
              pointTaille: 4,
              pointStyle: 'x',
              labelsPrincipaux: false,
              thickSec: true,
              labelListe: [[0, `${stringNombre(abs0)}`], [1, `${stringNombre(abs1)}`], [2, `${stringNombre(abs2)}`]],
              pointListe: [[x1, '']]
            })
            reponse = new Decimal(x1).add(abs0)
            texte = 'Déterminer l\'abscisse du point $A$. <br>' + mathalea2d({ xmin: -0.5, ymin: -1.5, xmax: 10, ymax: 1.5, pixelsParCm: 35, scale: 0.75 }, texteParPosition('A', 4 * x1, 0.8, 'milieu', 'blue', 2), d)
            texteCorr = `Entre $${texNombre(abs0)}$ et $${texNombre(abs1)}$, il y a $4$ intervalles.<br>
             Une graduation correspond donc à $0,25$ unité. Ainsi, l'abscisse du point $A$ est $${miseEnEvidence(texNombre(reponse, 2))}$.`
          } else {
            const abs0 = 2023
            const abs1 = 2024
            const abs2 = 2025
            const x1 = choice([new Decimal('0.2'), new Decimal('0.4'), new Decimal('0.6'), new Decimal('0.8'), new Decimal('1.2'), new Decimal('1.4'), new Decimal('1.6'), new Decimal('1.8')])
            const d = droiteGraduee({
              Unite: 4,
              Min: 0,
              Max: 2.1,
              thickSecDist: 0.2,
              axeStyle: '->',
              pointTaille: 4,
              pointStyle: 'x',
              labelsPrincipaux: false,
              thickSec: true,
              labelListe: [[0, `${stringNombre(abs0)}`], [1, `${stringNombre(abs1)}`], [2, `${stringNombre(abs2)}`]],
              pointListe: [[x1, '']]
            })
            reponse = new Decimal(x1).add(abs0)
            texte = 'Déterminer l\'abscisse du point $A$. <br>' + mathalea2d({ xmin: -0.5, ymin: -1.5, xmax: 10, ymax: 1.5, pixelsParCm: 35, scale: 0.75 }, texteParPosition('A', 4 * x1, 0.8, 'milieu', 'blue', 2), d)
            texteCorr = `Entre $${texNombre(abs0)}$ et $${texNombre(abs1)}$, il y a $5$ intervalles.<br>
             Une graduation correspond donc à $0,2$ unité. Ainsi, l'abscisse du point $A$ est $${miseEnEvidence(texNombre(reponse, 2))}$.`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
          break
        case 20: {
          const n = 2024
          const d = choice([-1, 1, 2024, 2, -2024, -2])
          reponse = new FractionEtendue(2024, d).simplifie()
          texte = `Écrire le plus simplement possible : $\\dfrac{${n}}{${d}}$.`
          texteCorr = `$\\dfrac{${n}}{${d}}=${miseEnEvidence(reponse)}$`
          setReponse(this, index, reponse, { formatInteractif: 'fraction' })
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 21: {
          const a = randint(-5, 5, [0, -1, 1])
          reponse = randint(-9, 9, [-1, 0, 1])
          const b = -a * reponse + 2024
          texte = `Donner la solution de l'équation : $${a}x+${texNombre(b)}=${texNombre(2024)}$`
          texteCorr = `On procède par étapes successives :<br>
              On commence par isoler $${a}x$ dans le membre de gauche en ajoutant
              $${ecritureAlgebrique(-b)}$ dans chacun des membres, puis on divise
              par $${a}$ pour obtenir la solution : <br>
              $\\begin{aligned}
              ${a}x${ecritureAlgebrique(b)}&=${texNombre(2024)}\\\\
             ${a}x&=${texNombre(2024)}${ecritureAlgebrique(-b)}\\\\
             ${a}x&=${texNombre(2024 - b)}\\\\
             x&=\\dfrac{${texNombre(2024 - b)}}{${a}}\\\\
             x&=${reponse}
             \\end{aligned}$<br>
             La solution de l'équation est : $${miseEnEvidence(reponse)}$.
             `
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 22: {
          const nom = creerNomDePolygone(2, 'PQDO')
          const b = randint(-5, 5) * 2
          const c = randint(-5, 5) * 2
          texte = `Dans un repère du plan, on donne $${nom[0]}(${texNombre(2024)}\\,;\\,${c})$ et $${nom[1]}(${b}\\,;\\,${texNombre(2024)})$.<br>
        Déterminer les coordonnées du milieu de $[${nom[0] + nom[1]}]$.`
          this.optionsChampTexte = { texteApres: '' }
          texteCorr = `Les coordonnées du milieu sont données par :
        $\\left(\\dfrac{${texNombre(2024)}+${b}}{2};\\dfrac{${c}+${texNombre(2024)}}{2}\\right)=
        \\left(\\dfrac{${texNombre(2024 + b, 0)}}{2};\\dfrac{${texNombre(c + 2024, 0)}}{2}\\right)=
        ${miseEnEvidence(`(${texNombre((2024 + b) / 2, 1)};${texNombre((c + 2024) / 2, 1)})`)}$.<br>`
          reponse = `(${arrondi((2024 + b) / 2, 1)};${arrondi((c + 2024) / 2, 1)})`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 23: {
          const a = randint(-9, -4)
          const c = randint(2, 5)
          texte = `$f(x)=${a}x+${texNombre(2024)}$<br>
         Calculer $f(${c})$.`
          reponse = a * c + 2024
          texteCorr = `$f(${c})=${a}\\times ${c}+${texNombre(2024)}=${a * c}+${texNombre(2024)}=${miseEnEvidence(texNombre(reponse))}$`
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push(`$f(${c})=\\ldots$`)
        }
          break
        case 24: {
          const n1 = choice([-2024, 2024])
          const d1 = choice([-1, 1])
          const n2 = choice([-2024, 2024])
          const d2 = n2 * choice([-1, 1])
          if (choice([true, false])) {
            reponse = new FractionEtendue(n1, d1).simplifie()
            texte = `Écrire le plus simplement possible : $\\dfrac{${texNombre(n1)}}{${d1}}$.`
            texteCorr = `$\\dfrac{${texNombre(n1)}}{${d1}}=${miseEnEvidence(reponse)}$`
          } else {
            reponse = new FractionEtendue(n2, d2).simplifie()
            texte = `Écrire le plus simplement possible : $\\dfrac{${texNombre(n2)}}{${d2}}$.`
            texteCorr = `$\\dfrac{${texNombre(n2)}}{${d2}}=${miseEnEvidence(reponse)}$`
          }
          setReponse(this, index, reponse, { formatInteractif: 'fraction' })
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 25: {
          const a = randint(-10, 10, 0)
          const ant = randint(2020, 2030)
          texte = `Déterminer l'antécédent de $${texNombre(ant)}$ par la fonction $f$ définie par : $f(x)=${rienSi1(a)}x+${texNombre(2024)}$.`
          reponse = new FractionEtendue(ant - 2024, a).simplifie()
          texteCorr = `L'antécédent est la solution de l'équation  $${rienSi1(a)}x+${texNombre(2024)}=${texNombre(ant)}$.<br>
          Il s'agit  de $${miseEnEvidence(reponse.texFSD)}$.`
          // EE : On n'a pas une fonction qui rédige tout seule la rédaction d'une solution d'une équation.
          // texteCorr += '<br>' + resoudre('2*x+4=4*x-5').texteCorr
          // console.log(resoudre('2*x+4=4*x-5'))
          setReponse(this, index, reponse, { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 26: {
          const a = 2024
          const b = randint(2015, 2033)
          texte = ` Combien de solutions réelles possède l'équation  ${choice([true, false]) ? `$-x^2+${texNombre(a)}=${texNombre(b)}$` : `$${texNombre(a)}-x^2=${texNombre(b)}$`} ?`
          if (a - b > 0) {
            texteCorr = `L'équation est équivalente à $-x^2=${b}-${a}$, soit $x^2=${a - b}$.<br>
            $${a - b}$ étant strictement positif, cette équation a $${miseEnEvidence('2')}$ solutions.`
            reponse = 2
          } else if (a - b === 0) {
            texteCorr = `L'équation est équivalente à$-x^2=${b}-${a}$, soit $x^2=${a - b}$.<br>
            cette équation a $${miseEnEvidence('1')}$  seule solution réelle : 0.`
            reponse = 1
          } else {
            texteCorr = `L'équation est équivalente à $-x^2=${b}-${a}$, soit $x^2=${a - b}$.<br>
           Cette équation n'a pas de solution réelle ($${miseEnEvidence('0')}$ solution) car $${a - b}<0$.`
            reponse = 0
          }
        }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
          break
        case 27: {
          const prefixes = [[10, 'd'], [100, 'c'], [1000, 'm'], [10, 'da'], [100, 'h'], [1000, 'k']]
          const unite = choice(['g', 'm'])
          const typeDeQuestion = randint(0, 5)
          const a = 2024
          if (typeDeQuestion < 3) {
            texte = `Compléter avec l'unité qui convient : $${a}$ ${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ ${this.interactif ? '' : '$\\ldots$'}`
            texteCorr = `$${a}$ ${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ `
            this.listeCanReponsesACompleter.push(`$${a}$ ${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ $\\ldots$`)
          } else {
            texte = `Compléter avec l'unité qui convient : $${a}$ ${unite} $= ${texNombre(a / prefixes[typeDeQuestion][0])}$ ${this.interactif ? '' : '$\\ldots$'}`
            texteCorr = `$${a}$ ${unite} $= ${texNombre(a / prefixes[typeDeQuestion][0])}$ `
            this.listeCanReponsesACompleter.push(`$${a}$ ${unite} $= ${texNombre(a / prefixes[typeDeQuestion][0])}$ $\\ldots$`)
          }
          texteCorr += `${texteEnCouleurEtGras(prefixes[typeDeQuestion][1] + unite)}`
          this.listeCanEnonces.push('Compléter avec l\'unité qui convient. ')
          reponse = `${prefixes[typeDeQuestion][1]}${unite}`
          setReponse(this, index, reponse, { formatInteractif: 'texte' })
          texte += ajouteChampTexteMathLive(this, index, 'largeur01 inline nospacebefore ')
        }
          break
        case 28: {
          const choix = randint(1, 5)
          if (choix === 1) {
            texte = ` $${texNombre(2024)}$ dixièmes est égal à : `
            reponse = new Decimal(2024).div(10)
            texteCorr = `$${texNombre(2024)}$ dixièmes est égal à : $${texNombre(2024)}\\div 10=${miseEnEvidence(texNombre(reponse, 1))}$.`
          } else if (choix === 2) {
            texte = ` $${texNombre(2024)}$ centièmes est égal à : `
            reponse = new Decimal(2024).div(100)
            texteCorr = `$${texNombre(2024)}$ centièmes est égal à : $${texNombre(2024)}\\div 100=${miseEnEvidence(texNombre(reponse, 2))}$.`
          } else if (choix === 3) {
            texte = ` $${texNombre(2024)}$ millièmes est égal à : `
            reponse = new Decimal(2024).div(1000)
            texteCorr = `$${texNombre(2024)}$ millièmes est égal à : $${texNombre(2024)}\\div 1000=${miseEnEvidence(texNombre(reponse, 3))}$.`
          } else if (choix === 4) {
            texte = ` $${texNombre(2024)}$ dizaines est égal à : `
            reponse = new Decimal(2024).mul(10)
            texteCorr = `$${texNombre(2024)}$ dizaines est égal à : $${texNombre(2024)}\\times 10=${miseEnEvidence(texNombre(reponse, 0))}$.`
          } else {
            texte = ` $${texNombre(2024)}$ centaines est égal à : `
            reponse = new Decimal(2024).mul(100)
            texteCorr = `$${texNombre(2024)}$ centaines est égal à : $${texNombre(2024)}\\times 100=${miseEnEvidence(texNombre(reponse, 0))}$.`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('$\\ldots$')
        }
          break
        case 29: {
          const a = 2
          const b = 0
          const c = 2
          const d = 4
          const m = choice(['centaines', 'dizaines'])
          const n = a * 1000 + b * 100 + c * 10 + d
          texte = `Quel est le nombre entier de ${m} dans $${texNombre(n)}$ ? `
          if (m === 'centaines') {
            texteCorr = `Comme $${a * 1000 + b * 100 + c * 10 + d}=${a * 10 + b}\\times 100+${c * 10 + d}$, il y a $${miseEnEvidence(a * 10 + b)}$ ${m} dans $${a * 1000 + b * 100 + c * 10 + d}$.`
            reponse = a * 10 + b
          } else {
            texteCorr = `Comme $${a * 1000 + b * 100 + c * 10 + d}=${a * 100 + b * 10 + c}\\times 10+${d}$, il y a $${miseEnEvidence(a * 100 + b * 10 + c)}$ ${m} dans $${a * 1000 + b * 100 + c * 10 + d}$.`
            reponse = a * 100 + b * 10 + c
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 30: {
          const objets = []
          const a = randint(11, 15) * 100
          const b = 2024
          const A = point(0, 0, 'A', 'below')
          const B = point(5, 0, 'B', 'below')
          const C = point(2.5, 2, 'C', 'below')
          const s1 = segment(A, B)
          const s2 = segment(B, C)
          const s3 = segment(A, C)
          if (choice([true, false])) {
            objets.push(codageSegments('||', 'blue', B, C),
              codageSegments('||', 'blue', C, A),
              texteParPosition('2024 cm', milieu(A, B).x, milieu(A, B).y - 0.7),
              texteParPosition(`${a} cm`, milieu(B, C).x + 1, milieu(B, C).y + 0.5),
              s1, s2, s3)
            texte = 'Quel est  le périmètre de ce triangle ? <br>' +
             mathalea2d({ xmin: -0.5, ymin: -1.5, xmax: 6, ymax: 3, scale: 0.7, style: 'margin: auto' }, objets) +
            '<br>La figure n\'est pas à l\'échelle.'
            reponse = 2 * a + b
            texteCorr = `Le triangle est isocèle.<br>
            Son périmètre est : $2\\times ${texNombre(a)}$ cm $+${texNombre(b)}$ cm $=${miseEnEvidence(texNombre(2 * a + b))}$ cm.`
          } else {
            objets.push(codageSegments('||', 'blue', B, C),
              codageSegments('||', 'blue', C, A),
              texteParPosition(`${b} cm`, milieu(A, B).x, milieu(A, B).y - 0.7),
              texteParPosition('?', milieu(B, C).x + 1, milieu(B, C).y + 0.5),
              s1, s2, s3)
            texte = `Le périmètre de ce triangle est  $${texNombre(2 * a + b)}$ cm, quelle est la longueur manquante ?<br>
                ` + mathalea2d({ xmin: -0.5, ymin: -1.5, xmax: 6, ymax: 2.5, scale: 0.7, style: 'margin: auto' }, objets) +
                '<br>La figure n\'est pas à l\'échelle.'
            reponse = a
            texteCorr = `Le triangle est isocèle, il possède donc deux longueurs égales.<br>
                Puisque le périmètre est  $${texNombre(2 * a + b)}$ cm, on obtient la somme des deux longueurs égales  du triangle en effectuant la différence $${2 * a + b}-${b}=${2 * a}$ cm.<br>
                On obtient la longueur cherchée en divisant par $2$, soit $${texNombre(2 * a)}\\div 2=${miseEnEvidence(texNombre(a))}$ cm.`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01', { texteApres: 'cm' })
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 31:{
          const a = randint(1, 4)
          const val = new Decimal(2024).div(choice([1, 10, 100, 1000]))
          if (a === 1) {
            texte = `Calculer ${choice([true, false]) ? `$4 \\times ${texNombre(val, 3)}\\times 25$` : `$4 \\times ${texNombre(val, 3)}\\times 25$`}.`
            reponse = new Decimal(val).mul(100)
            texteCorr = `${choice([true, false]) ? `$4 \\times ${texNombre(val, 3)}\\times 25$` : `$4 \\times ${texNombre(val, 3)}\\times 25`}=100 \\times ${texNombre(val, 3)}=${miseEnEvidence(texNombre(reponse, 3))}$`
          } else if (a === 2) {
            texte = `Calculer ${choice([true, false]) ? `$2 \\times ${texNombre(val, 3)}\\times 50$` : `$50 \\times ${texNombre(val, 3)}\\times 2$`}.`
            reponse = new Decimal(val).mul(100)
            texteCorr = ` ${choice([true, false]) ? `$2 \\times ${texNombre(val, 3)}\\times 50$` : `$50 \\times ${texNombre(val, 3)}\\times 2`}=100 \\times ${texNombre(val, 3)}=${miseEnEvidence(texNombre(reponse, 3))}$`
          } else if (a === 3) {
            texte = `Calculer ${choice([true, false]) ? `$0,25 \\times ${texNombre(val, 3)}\\times 4$` : `$4 \\times ${texNombre(val, 3)}\\times 0,25$`}.`
            reponse = new Decimal(val).mul(1)
            texteCorr = ` ${choice([true, false]) ? `$0,25 \\times ${texNombre(val, 3)}\\times 4$` : `$4 \\times ${texNombre(val, 3)}\\times 0,25`}=1 \\times ${texNombre(val, 3)}=${miseEnEvidence(texNombre(reponse, 3))}$`
          } else {
            texte = `Calculer ${choice([true, false]) ? `$4 \\times ${texNombre(val, 3)}\\times 2,5$` : `$2,5 \\times ${texNombre(val, 3)}\\times 4$`}.`
            reponse = new Decimal(val).mul(1)
            texteCorr = `  ${choice([true, false]) ? `$4 \\times ${texNombre(val, 3)}\\times 2,5$` : `$2,5 \\times ${texNombre(val, 3)}\\times 4`}=10 \\times ${texNombre(val, 3)}=${miseEnEvidence(texNombre(reponse, 3))}$`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 32:{
          const val = new Decimal(2024).div(choice([1, 10, 100, 1000]))
          const coeff = randint(15, 59, [20, 30, 40, 50])
          const b = 100 - coeff
          const coeff2 = randint(2, 8)
          const b2 = 10 - coeff2
          if (choice([true, false])) {
            texte = `Calculer $ ${coeff}\\times ${texNombre(val, 3)}+ ${b}\\times ${texNombre(val, 3)}$.`
            reponse = new Decimal(val).mul(100)
            texteCorr = `$ ${coeff}\\times ${texNombre(val, 3)}+ ${b}\\times ${texNombre(val, 3)}=${texNombre(val, 3)}\\times\\underbrace{(${texNombre(coeff)}+${texNombre(b)})}_{=100}=${miseEnEvidence(texNombre(reponse, 3))}$`
          } else {
            texte = `Calculer $ ${coeff2}\\times ${texNombre(val, 3)}+ ${b2}\\times ${texNombre(val, 3)}$.`
            reponse = new Decimal(val).mul(10)
            texteCorr = `$ ${coeff2}\\times ${texNombre(val, 3)}+ ${b2}\\times ${texNombre(val, 3)}=${texNombre(val, 3)}\\times\\underbrace{(${texNombre(coeff2)}+${texNombre(b2)})}_{=10}=${miseEnEvidence(texNombre(reponse, 3))}$`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 33: {
          const choix = randint(1, 4)
          if (choix === 1) {
            texte = `What is the value of $2^{${texNombre(2024)}}-2^{${texNombre(2023)}}$ ? `
            texteCorr = `$2^{${texNombre(2024)}}-2^{${texNombre(2023)}}=2^{${texNombre(2023)}}(2-1)=${miseEnEvidence('2')}$`
            reponse = 2
          } else if (choix === 2) {
            texte = `What is the value of $2^{${texNombre(2025)}}-2^{${texNombre(2024)}}$ ? `
            texteCorr = `$2^{${texNombre(2025)}}-2^{${texNombre(2024)}}=2^{${texNombre(2024)}}(2-1)=${miseEnEvidence('2')}$`
            reponse = 2
          } else if (choix === 3) {
            texte = `What is the value of $-1^{${texNombre(2024)}}-(-1^{${texNombre(2024)}})$ ? `
            texteCorr = `$-1{${texNombre(2024)}}-(-1^{${texNombre(2024)}})=-1-(-1)=${miseEnEvidence('0')}$`
            reponse = 0
          } else {
            texte = `What is the value of $\\dfrac{\\left(${texNombre(2024)}^0\\right)^{${texNombre(2024)}}}{\\left(${texNombre(2024)}^{${texNombre(2024)}}\\right)^{0}}$ ? `
            texteCorr = `$\\dfrac{\\left(${texNombre(2024)}^0\\right)^{${texNombre(2024)}}}{\\left(${texNombre(2024)}^{${texNombre(2024)}}\\right)^{0}}
              =\\dfrac{1^{${texNombre(2024)}}}{1}=${miseEnEvidence('1')}$`
            reponse = 1
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 34 ://  [a;b] inter [c;d] avec c<b resultat [c;b]
          {
            const a = -2024
            const b = randint(-10, 5)
            const c = a + randint(1, 9)
            const d = 2024
            const choix = choice([true, false])
            const crochet1 = choice([']', '['])
            const crochet2 = choice([']', '['])
            const crochet3 = choice([']', '['])
            const crochet4 = choice([']', '['])
            reponse = `${crochet3}${c};${b}${crochet2}`
            texte = `Donner une écriture simplifiée de
          ${choix ? `$${crochet1} ${texNombre(a)}\\,;\\,${texNombre(b)}${crochet2}\\,\\cap \\,${crochet3}${texNombre(c)}\\,;\\,${texNombre(d)}${crochet4}$.` : `$${crochet3}${texNombre(c)}\\,;\\,${texNombre(d)}${crochet4}\\,\\cap \\,${crochet1} ${texNombre(a)}\\,;\\,${texNombre(b)}${crochet2}$.`}`
            texteCorr = 'L’intersection de deux intervalles $I$ et $J$ (notée $I\\cap J$) est l’ensemble qui contient les nombres appartenant à $I$ et à $J$.<br>' + `Ainsi, ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$`} $= ${miseEnEvidence(`${crochet3}${c}\\,;\\,${b}${crochet2}`)}$.<br>
          Les nombres de l'intervalle $${crochet3}${texNombre(c)}\\,;\\,${texNombre(b)}${crochet2}$ appartiennent à l'intervalle $${crochet1} ${texNombre(a)}\\,;\\,${texNombre(b)}${crochet2}$ et à l'intervalle $${crochet3}${texNombre(c)}\\,;\\,${texNombre(d)}${crochet4}$.`
            setReponse(this, index, reponse)
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 lycee')
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push('')
          }
          break
        case 35 : {
          const crochet1 = choice([']', '['])
          const crochet2 = choice([']', '['])
          if (choice([true, false])) {
            texte = `Quel est le plus grand entier relatif appartenant à l'intervalle $${crochet1} ${texNombre(-2024)}\\,;\\,${texNombre(2024)}${crochet2}$ ? `
            texteCorr = `${crochet2 === ']' ? `C'est $${miseEnEvidence(`${texNombre(2024)}`)}$` : `C'est $${miseEnEvidence(`${texNombre(2023)}`)}$`}.`
            reponse = `${crochet2 === ']' ? '2024' : '2023'}`
          } else {
            texte = `Quel est le plus petit entier relatif appartenant à l'intervalle $${crochet1} ${texNombre(-2024)}\\,;\\,${texNombre(2024)}${crochet2}$ ? `
            texteCorr = `${crochet1 === '[' ? `C'est $${miseEnEvidence(`${texNombre(-2024)}`)}$` : `C'est $${miseEnEvidence(`${texNombre(-2023)}`)}$`}.`
            reponse = `${crochet1 === '[' ? '-2024' : '-2023'}`
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 36 ://
          { let solution1
            const a = choice([-2024, 2024])
            const b = choice([-2024, 2024])
            const inegalite = choice(['>', '\\geqslant', '<', '\\leqslant'])
            texte = `Donner l'ensemble des solutions dans $\\mathbb R$ de l'inéquation
          $${rienSi1(a)}(x${ecritureAlgebrique(-b)})^2 ${inegalite} 0$.`
            if (this.interactif) {
              texte += '<br>$S=$' + ajouteChampTexteMathLive(this, index, 'inline largeur01 lycee nospacebefore')
            }
            if (a > 0) {
              texteCorr = `Pour tout réel $x$, $${rienSi1(a)}(x${ecritureAlgebrique(-b)})^2$ est positif et s'annule en $${b}$.<br>
            Ainsi, l'ensemble des solutions de l'inéquation est `
            } else {
              texteCorr = `Pour tout réel $x$, $${rienSi1(a)}(x${ecritureAlgebrique(-b)})^2$ est négatif et s'annule en $${b}$.<br>
            Ainsi, l'ensemble des solutions de l'inéquation est `
            }
            if ((inegalite === '>' && a > 0) || (inegalite === '<' && a < 0)) {
              //  solution1 = `$\\mathbb{R}\\setminus\\{${b}\\}$`
              solution1 = `$\\mathbb{R}\\\\left\\lbrace${b}\\right\\rbrace$`
              texteCorr += ` $${miseEnEvidence(`\\mathbb{R}\\smallsetminus\\{${texNombre(b)}\\}`)}$.`
            } else if ((inegalite === '\\geqslant' && a > 0) || (inegalite === '\\leqslant' && a < 0)) {
              solution1 = '$\\mathbb{R}$'
              texteCorr += ` $${miseEnEvidence('\\mathbb{R}')}$.`
            } else if ((inegalite === '<' && a > 0) || (inegalite === '>' && a < 0)) {
              solution1 = '$\\emptyset$'
              texteCorr += ` $${miseEnEvidence('\\emptyset')}$.`
            } else if ((inegalite === '\\leqslant' && a > 0) || (inegalite === '\\geqslant' && a < 0)) {
              // solution1 = `$\\{${b}\\}$`
              solution1 = `$\\left\\lbrace${b}\\right\\rbrace$`
              texteCorr += ` $${miseEnEvidence(`\\{${texNombre(b)}\\}`)}$.`
            }
            reponse = solution1
            setReponse(this, index, reponse)
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push('')
          }
          break
        case 37: {
          const nbre = choice([-2024, 2024])
          if (choice([true, false])) {
            texte = `Quel est l'opposé de  $${texNombre(nbre)}$ ? `
            texteCorr = `L'opposé de $${texNombre(nbre)}$ est $${miseEnEvidence(`${texNombre(-nbre)}`)}$.`
            reponse = -nbre
          } else {
            texte = `Quel est l'inverse de  $${texNombre(nbre)}$ ? `
            texteCorr = `L'inverse de $${texNombre(nbre)}$ est $${miseEnEvidence(`\\dfrac{1}{${texNombre(nbre)}}`)}$.`
            if (nbre === 2024) { reponse = `\\dfrac{1}{${nbre}}` } else { reponse = [`-\\dfrac{1}{${-nbre}}`, `\\dfrac{1}{${nbre}}`] }
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 38: {
          const a = -2024
          let b = randint(6, 15)
          const k = choice([-1, 1]) // Les deux nombres relatifs ne peuvent pas être tous les deux positifs
          b = b * k
          if (this.interactif) {
            texte = `$${texNombre(a)}${ecritureAlgebrique(b)} =$`
          } else {
            texte = `Calculer $${texNombre(a)}${ecritureAlgebrique(b)}$.`
          }
          texteCorr = `$ ${a}${ecritureAlgebrique(b)} = ${miseEnEvidence(a + b)} $`
          reponse = a + b
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 39: {
          const choix = randint(1, 4)
          const nbre = choice([-2024, 2024])
          if (choix === 1) {
            texte = `En ajoutant un nombre à  $${texNombre(nbre)}$, on trouve $0$. <br>
              Quel est ce nombre ? `
            texteCorr = ` $${texNombre(nbre)}+${ecritureParentheseSiNegatif(-nbre)}=0$.<br>
              Le nombre est donc $${miseEnEvidence(`${texNombre(-nbre)}`)}$.`
            reponse = -nbre
          } else if (choix === 2) {
            texte = `En multipliant un nombre par  $${texNombre(nbre)}$, on trouve $1$. <br>
              Quel est ce nombre ? `
            texteCorr = ` $${texNombre(nbre)}\\times\\dfrac{1}{${nbre}}=1$.<br>
              Le nombre est donc $${miseEnEvidence(`\\dfrac{1}{${nbre}}`)}$.`
            if (nbre === 2024) { reponse = `\\dfrac{1}{${nbre}}` } else { reponse = [`-\\dfrac{1}{${-nbre}}`, `\\dfrac{1}{${nbre}}`] }
          } else if (choix === 3) {
            texte = `En ajoutant un nombre à  $${texNombre(nbre)}$, on trouve $-1$. <br>
            Quel est ce nombre ? `
            texteCorr = ` $${texNombre(nbre)}+${ecritureParentheseSiNegatif(-nbre - 1)}=-1$.<br>
            Le nombre est donc $${miseEnEvidence(`${texNombre(-nbre - 1)}`)}$.`
            reponse = -nbre - 1
          } else {
            texte = `En ajoutant un nombre à  $${texNombre(nbre)}$, on trouve $1$. <br>
            Quel est ce nombre ? `
            texteCorr = ` $${texNombre(nbre)}+${ecritureParentheseSiNegatif(-nbre + 1)}=1$.<br>
            Le nombre est donc $${miseEnEvidence(`${texNombre(-nbre + 1)}`)}$.`
            reponse = -nbre + 1
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 40:
          if (choice([true, false])) {
            texte = `En multipliant un nombre positif par lui-même, on trouve $${texNombre(2024)}$. <br>
                Quel est ce nombre ? `
            texteCorr = ` $\\sqrt{${texNombre(2024)}}\\times \\sqrt{${texNombre(2024)}}=${texNombre(2024)}$.<br>
                Le nombre est donc $${miseEnEvidence(`\\sqrt{${texNombre(2024)}}`)}$.`
            reponse = '\\sqrt{2024}'
          } else {
            texte = `En multipliant un nombre négatif par lui-même, on trouve $${texNombre(2024)}$. <br>
                Quel est ce nombre ? `
            texteCorr = ` $-\\sqrt{${texNombre(2024)}}\\times (-\\sqrt{${texNombre(2024)}})=${texNombre(2024)}$.<br>
                Le nombre est donc $${miseEnEvidence(`-\\sqrt{${texNombre(2024)}}`)}$.`
            reponse = '-\\sqrt{2024}'
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
          break
        case 41: {
          const choix = randint(1, 3)
          const nbre = choice([-2024, 2024])
          if (choix === 1) {
            texte = `Écrire $\\sqrt{${ecritureParentheseSiNegatif(nbre)}^2}$ le plus simplement possible.`
            texteCorr = ` $\\sqrt{${ecritureParentheseSiNegatif(nbre)}^2}=${miseEnEvidence(`${texNombre(abs(nbre))}`)}$.`
            reponse = -nbre
          } else if (choix === 2) {
            texte = `Écrire $(\\sqrt{${ecritureParentheseSiNegatif(2024)}})^2$ le plus simplement possible.`
            texteCorr = ` $(\\sqrt{${ecritureParentheseSiNegatif(2024)}})^2=${miseEnEvidence(`${texNombre(2024)}`)}$.`
            reponse = 2024
          } else {
            texte = `Écrire $\\sqrt{${ecritureParentheseSiNegatif(2024)}}+\\sqrt{${ecritureParentheseSiNegatif(2024)}}$ le plus simplement possible.`
            texteCorr = ` $\\sqrt{${ecritureParentheseSiNegatif(2024)}}+\\sqrt{${ecritureParentheseSiNegatif(2024)}}=${miseEnEvidence(`2\\sqrt{${texNombre(2024)}}`)}$.`
            reponse = '2\\sqrt{2024}'
          }
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 42: {
          const a = choice([-2024, 2024])
          const b = choice([-2024, 2024])
          const c = choice([-2024, 2024])
          texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par  $f(x)=${texNombre(a)}(x${ecritureAlgebrique(b)})^2${ecritureAlgebrique(c)}$.<br>
          Donner le plus grand intervalle sur lequel la fonction $f$ est croissante.`
          if (a > 0) {
            if (b > 0) {
              texteCorr = `On reconnaît la forme canonique d'une fonction polynôme du second degré :
                  <br>  $f(x)=a(x-\\alpha)^2+\\beta$
              <br>    Le changement de variation de la fonction $f$ se fait en $\\alpha$.
              <br>  Ici,  $f(x)=${reduireAxPlusB(0, a)}(${reduireAxPlusB(1, b)})^2${ecritureAlgebrique(c)}=
             ${reduireAxPlusB(0, a)}(x-(\\underbrace{-${b}}_{\\alpha}))^2${ecritureAlgebrique(c)}$, d'où $\\alpha=-${b}$.
             <br> Le coefficient $${a}$ devant la parenthèse est strictement positif, la fonction est donc
             d'abord décroissante puis croissante (la parabole est "tournée vers le haut").
             <br>  Ainsi, $f$ est croissante sur $${miseEnEvidence(`[-${b} \\, ;\\, +\\infty[`)}$.    `
              reponse = [`]-${b};+\\infty[`, `[-${b};+\\infty[`]
            } else {
              texteCorr = `On reconnaît la forme canonique d'une fonction polynôme du second degré :
                  <br>$f(x)=a(x-\\alpha)^2+\\beta$
               <br> Le changement de variation de la fonction $f$ se fait en $\\alpha$.
               <br>
               Ici,  $f(x)=${reduireAxPlusB(0, a)}(${reduireAxPlusB(1, b)})^2${ecritureAlgebrique(c)}$, d'où $\\alpha=${-b}$.
               <br>  Le coefficient $${a}$ devant la parenthèse est strictement positif, la fonction est donc
              d'abord décroissante puis croissante (la parabole est "tournée vers le haut").
              <br>  Ainsi, $f$ est croissante sur $${miseEnEvidence(`[${-b} \\, ;\\, +\\infty[`)}$.    `
              reponse = [`]${-b};+\\infty[`, `[${-b};+\\infty[`]
            }
          } else { // a < 0
            if (b > 0) {
              texteCorr = `On reconnaît la forme canonique d'une fonction polynôme du second degré :
                  <br>$f(x)=a(x-\\alpha)^2+\\beta$<br>
              Le changement de variation de la fonction $f$ se fait en $\\alpha$.
              <br> Ici,  $f(x)=${reduireAxPlusB(0, a)}(${reduireAxPlusB(1, b)})^2${ecritureAlgebrique(c)}=
             ${reduireAxPlusB(0, a)}(x-(\\underbrace{-${b}}_{\\alpha}))^2${ecritureAlgebrique(c)}$, d'où $\\alpha=-${b}$.
             <br> Comme le coefficient $${a}$ devant la parenthèse est strictement négatif, la fonction est d'abord croissante puis décroissante (la parabole est "tournée vers le bas").
             <br>    Ainsi, $f$ est croissante sur $${miseEnEvidence(`]-\\infty \\, ;\\, -${b}]`)}$.    `
              reponse = [`]-\\infty;-${b}[`, `]-\\infty;-${b}]`]
            } else {
              texteCorr = `On reconnaît la forme canonique d'une fonction polynôme du second degré :
                  <br>  $f(x)=a(x-\\alpha)^2+\\beta$
                  <br> Le changement de variation de la fonction $f$ se fait en $\\alpha$.
               <br> Ici,  $f(x)=${reduireAxPlusB(0, a)}(${reduireAxPlusB(1, b)})^2${ecritureAlgebrique(c)}$, d'où $\\alpha=${-b}$.
               <br> Comme le coefficient $${a}$ devant la parenthèse est strictement négatif, la fonction est d'abord croissante puis décroissante (la parabole est "tournée vers le bas").
               Ainsi, $f$ est croissante sur $${miseEnEvidence(`]-\\infty \\, ;\\, ${-b}]`)}$.    `
              reponse = [`]-\\infty;${-b}[`, `]-\\infty;${-b}]`]
            }
          }
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 lycee')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 43: {
          const date = randint(27, 30)
          const nbre = randint(1, 23)
          texte = `Nous sommes le $${date}$ décembre $${texNombre(2023)}$. Il est $${nbre}$ h${nbre < 12 ? ' du matin' : ''}.<br>
                  Combien  d'heures faut-il attendre avant de pouvoir se souhaiter la nouvelle année (à minuit le $31$ décembre $${texNombre(2023)}$) ? <br>`
          texteCorr = ` Jusqu'au $${date}$ décembre minuit, il y a $${24 - nbre}$ heures.  <br>
              Du $${date + 1}$ (0 h) au $31$ décembre (minuit), il y a $${31 - date}$ jour${31 - date > 1 ? 's' : ''}, soit $${24 * (31 - date)}$ heures. <br>
              Il faudra donc attendre $${24 * (31 - date)}+${24 - nbre}$ heures, soit $${miseEnEvidence(24 * (31 - date) + 24 - nbre)}$ heures avant de se souhaiter la bonne année.
             `
          reponse = 24 * (31 - date) + 24 - nbre
          setReponse(this, index, reponse)
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01', { texteApres: 'heures' })
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('$\\ldots$ heures')
        }
          break
        case 44:
          if (choice([true, false])) {
            reponse = '20,4'
            setReponse(this, index, reponse)
            if (this.interactif) {
              texte = `Compléter avec un nombre décimal  :<br>
              $20$ h $24$ min $=$`
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore', { texteApres: ' h' })
            } else {
              texte = `Compléter avec un nombre décimal  :<br>
            $20$ h $24$ min $=\\ldots$ h`
            }
            texteCorr = `Un dixième d'heure est égal à 6 minutes. <br>
            24 minutes correspondent donc à 4 dixièmes d'heure, soit 0,4 h.<br>
            $20$ h $24$ min $= ${miseEnEvidence('20,4')}$ h`
            this.listeCanEnonces.push('Compléter avec un nombre décimal.')
            this.listeCanReponsesACompleter.push(' $20$ h $24$ min $=\\ldots$ heures')
          } else {
            if (!this.interactif) {
              texte = `Compléter :<br>
            $20,4$ h  $=\\ldots$ h $\\ldots$ min`
            } else {
              texte = `Compléter (en heures/minutes):<br>
            $20,4$ h  $=$`
            }
            texteCorr = ` Comme $0,4$ h $=0,4\\times 60$ min $= 24$ min, on en déduit $20,4$ h  $=${miseEnEvidence('20')}$ h $${miseEnEvidence('24')}$ min.`
            reponse = new Hms({ hour: 20, minute: 24 })
            setReponse(this, index, reponse, { formatInteractif: 'hms' })
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 clavierHms inline')
            this.listeCanEnonces.push('Compléter.')
            this.listeCanReponsesACompleter.push('$20,4$ h  $=\\ldots$ h $\\ldots$ min')
          }
          break
        case 45: {
          const b = choice([8, 11, 23])
          const c = choice([13, 17, 19, 31])
          if (choice([true, false])) {
            reponse = '0'
            setReponse(this, index, reponse)

            texte = `Utiliser l'égalité suivante pour donner le reste de la division euclidienne de $ ${texNombre(2024)} $ par $ ${b} $.<br>
                  $ ${texNombre(2024)} = ${b} \\times ${texNombre(2024 / b, 0)} $`
            texteCorr = `L'égalité $ ${texNombre(2024)} = ${b} \\times ${texNombre(2024 / b, 0)} $ correspond bien à l'expression de la division euclidienne de $ ${texNombre(2024)} $ par $ ${b} $. <br> Le reste est $${miseEnEvidence(0)}$.`
          } else {
            texte = `Utiliser l'égalité suivante pour donner le reste de la division euclidienne de $ ${texNombre(2024)} $ par $ ${c} $.<br>
                $ ${texNombre(2024)} = ${c} \\times ${Math.floor(2024 / c)} + ${2024 - c * Math.floor(2024 / c)} $`
            texteCorr = ` $${2024 - c * Math.floor(2024 / c)}$ est inférieur à $${c}$, l'égalité $ ${texNombre(2024)} = ${c} \\times ${Math.floor(2024 / c)} + ${2024 - c * Math.floor(2024 / c)} $ correspond bien à l'expression de la division euclidienne de $ ${texNombre(2024)} $ par ${c}. <br>Le reste est donc donné par  $${miseEnEvidence(2024 - c * Math.floor(2024 / c))}$.`
            reponse = `${2024 - c * Math.floor(2024 / c)}`
            setReponse(this, index, reponse)
          }
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 ')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 46: {
          const b = choice([8, 11, 23])
          const c = choice([13, 17, 19, 31])
          if (choice([true, false])) {
            reponse = '0'
            setReponse(this, index, reponse)

            texte = `Utiliser l'égalité suivante pour donner le reste de la division euclidienne de $ ${texNombre(2024)} $ par $ ${b} $.<br>
              $ ${texNombre(2024)} = ${b} \\times  ${texNombre(2024 / b - 1, 0)} + ${b} $`
            texteCorr = ` Comme $${b}$ n'est pas inférieur à $${b}$, l'égalité 
              $ ${texNombre(2024)} = ${b} \\times  ${texNombre(2024 / b - 1, 0)} + ${b} $ ne traduit pas directement la division euclidienne de $ ${texNombre(2024)} $ par ${b}. <br>
              Transformons cette égalité en :  $${texNombre(2024)}= ${texNombre(2024)} = ${b} \\times  ${texNombre(2024 / b - 1, 0)} + 1\\times ${b}=${b} \\times  ${texNombre(2024 / b, 0)} $  qui montre que le reste  de la division euclidienne de $ ${texNombre(2024)} $ par $ ${b} $ est $${miseEnEvidence(0)}$.`
          } else {
            texte = `Utiliser l'égalité suivante pour donner le reste de la division euclidienne de $ ${texNombre(2024)} $ par $ ${c} $.<br>
                  $ ${texNombre(2024)} = ${c} \\times ${Math.floor(2024 / c) - 1} + ${2024 - c * Math.floor(2024 / c) + c} $`
            texteCorr = ` Comme $${2024 - c * Math.floor(2024 / c) + c}$ n'est pas inférieur à $${c}$, l'égalité 
              $ ${texNombre(2024)} = ${c} \\times ${Math.floor(2024 / c) - 1} + ${2024 - c * Math.floor(2024 / c) + c} $ ne traduit pas directement l'expression de la division euclidienne de $ ${texNombre(2024)} $ par ${c}. <br>
              Transformons cette égalité en :
              $${texNombre(2024)}= ${c} \\times ${Math.floor(2024 / c) - 1}+ ${c} + ${2024 - c * Math.floor(2024 / c)}=${c} \\times ${Math.floor(2024 / c)} + ${2024 - c * Math.floor(2024 / c)}$.<br>
              Le reste est donc   $${miseEnEvidence(2024 - c * Math.floor(2024 / c))}$.`
            reponse = `${2024 - c * Math.floor(2024 / c)}`
            setReponse(this, index, reponse)
          }
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 ')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 47: {
          const b = new Decimal(randint(1, 9)).div(10)
          const r1 = new Decimal(2024).sub(b)
          const r2 = new Decimal(2024).sub(b).mul(-1)
          if (choice([true, false])) {
            reponse = `${new Decimal(2024).sub(b)}x`
            setReponse(this, index, reponse)

            texte = `Réduire l'écriture de $${texNombre(2024)}x -${texNombre(b, 1)}x$.`
            texteCorr = `$${texNombre(2024)}x -${texNombre(b, 1)}x= (${texNombre(2024)} -${texNombre(b, 1)})x=${miseEnEvidence(texNombre(r1, 1) + 'x')}$ `
          } else {
            reponse = `${new Decimal(2024).sub(b).mul(-1)}x`
            setReponse(this, index, reponse)

            texte = `Réduire l'écriture de $${texNombre(b, 1)}x-${texNombre(2024)}x $.`
            texteCorr = `$${texNombre(b, 1)}x-${texNombre(2024)}x=(${texNombre(b, 1)}-${texNombre(2024)})x=${miseEnEvidence(texNombre(r2, 1) + 'x')}$ `
          }
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 ')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 48: {
          const puissance = randint(1, 5)
          const puissance10 = 10 ** puissance
          const a = choice([2024, -2024])
          const dec = new Decimal(a).div(puissance10)
          reponse = `\\dfrac{${a}}{10^{${puissance}}}`
          setReponse(this, index, reponse)
          texte = `Écrire $${texNombre(dec, 5)}$ sous la forme $\\dfrac{a}{10^n}$ avec $a\\in \\mathbb{Z}$ et $n\\in \\mathbb{N}$.`
          texteCorr = `$${texNombre(dec, 5)}=${miseEnEvidence(`\\dfrac{${texNombre(a, 0)}}{10^{${puissance}}}`)}$`
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 ')
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 49: {
          const choix = randint(1, 6)
          if (choix === 1) {
            texte = 'Quel est le chiffre des unités dans $20,24$?'
            texteCorr = ` Dans $20,24$,  le chiffre des unités est $${miseEnEvidence('0')}$.`
            reponse = '0'
          }
          if (choix === 2) {
            texte = 'Quel est le chiffre des centièmes dans $20,24$ ?'
            texteCorr = ` Dans $20,24$,  le chiffre des centièmes est $${miseEnEvidence('4')}$.`
            reponse = '4'
          }
          if (choix === 3) {
            texte = 'Quel est le chiffre des centaines dans $2024$ ?'
            texteCorr = ` Dans $2024$,  le chiffre des centaines est $${miseEnEvidence('0')}$.`
            reponse = '0'
          }
          if (choix === 4) {
            texte = 'Quel est le chiffre des dixièmes dans $202,4$ ?'
            texteCorr = ` Dans $202,4$,  le chiffre des dixièmes est $${miseEnEvidence('4')}$.`
            reponse = '4'
          }
          if (choix === 5) {
            texte = 'Quel est le chiffre des dizaines dans $202,4$ ?'
            texteCorr = ` Dans $202,4$,  le chiffre des dizaines est $${miseEnEvidence('0')}$.`
            reponse = '0'
          }
          if (choix === 6) {
            texte = 'Quel est le chiffre des millièmes dans $2,024$ ?'
            texteCorr = ` Dans $2,024$,  le chiffre des millièmes est $${miseEnEvidence('4')}$.`
            reponse = '4'
          }
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 50: {
          const choixPG = [[0, 2030], [1, 2031], [2, 2032], [3, 2033]]
          const choixPP = [[0, 2020], [9, 2019], [8, 2018], [7, 2017]]
          const PlusGrand = choice(choixPG)
          const PlusPetit = choice(choixPP)
          const PGouPP = choice([PlusGrand, PlusPetit])
          texte = `Quel est le plus ${PGouPP === PlusGrand ? 'petit nombre supérieur' : 'grand nombre inférieur'} à $${texNombre(2024, 0)}$  dont le chiffre des unités est $${PGouPP[0]}$ ?`
          texteCorr = `Le plus ${PGouPP === PlusGrand ? 'petit nombre supérieur' : 'grand nombre inférieur'} à $${texNombre(2024, 0)}$  dont le chiffre des unités est $${PGouPP[0]}$ est $${miseEnEvidence(texNombre(PGouPP[1]))}$.`
          reponse = PGouPP[1]
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 51: {
          const Diviseurs = choice([8, 23, 46, 11, 22, 44])
          const NonDiviseurs = choice([6, 13, 17, 20, 7, 19, 16])
          const choix = choice([Diviseurs, NonDiviseurs])
          const correctionOui = `$${choix}$ ${texteEnCouleurEtGras('est  un diviseur')} de $${texNombre(2024, 0)}$ car `
          texte = `$${choix}$ est-il un diviseur de $${texNombre(2024, 0)}$ ? <br>
              On pourra s'aider de la décomposition  en produits de facteurs premiers :  $${texNombre(2024, 0)}=2^3\\times 11 \\times 23$. `
          if (choix === 13 || choix === 17 || choix === 19 || choix === 7) {
            texteCorr = `$${choix}$ est un nombre premier, il n'apparaît pas dans la décomposition, donc $${choix}$ ${texteEnCouleurEtGras('n\'est pas un diviseur')} de $${texNombre(2024, 0)}$.`
          }
          if (choix === 16) {
            texteCorr = `$${choix}$ ${texteEnCouleurEtGras('n\'est pas un diviseur')} de $${texNombre(2024, 0)}$ car $2^4=16$ n'apparaît pas dans la décomposition. `
          }
          if (choix === 20) {
            texteCorr = `$${choix}$ ${texteEnCouleurEtGras('n\'est pas un diviseur')} de $${texNombre(2024, 0)}$ car $10$ n'est pas un diviseur de $${texNombre(2024, 0)}$. `
          }
          if (choix === 6) {
            texteCorr = `$${choix}$ ${texteEnCouleurEtGras('n\'est pas un diviseur')} de $${texNombre(2024, 0)}$ car $3$ n'est pas un diviseur de $${texNombre(2024, 0)}$. `
          }
          if (choix === 8) {
            texteCorr = `${correctionOui}` + ` $2^3=8$ est un diviseur de  $${texNombre(2024, 0)}$ (on le sait grâce à la décomposition).`
          }
          if (choix === 23 || choix === 11) {
            texteCorr = `$${choix}$   ${texteEnCouleurEtGras('est  un diviseur')} de $${texNombre(2024, 0)}$ car $${choix}$ apparaît dans la décomposition).`
          }
          if (choix === 46) {
            texteCorr = `${correctionOui}` + ` $2$ et $23$  sont des diviseurs de $${texNombre(2024, 0)}$ (on le sait grâce à la décomposition).`
          }
          if (choix === 22) {
            texteCorr = `${correctionOui}` + ` car $2$ et $11$  sont des diviseurs de $${texNombre(2024, 0)}$ (on le sait grâce à la décomposition).`
          }
          if (choix === 44) {
            texteCorr = `${correctionOui}` + ` car $2^2$ et $11$  sont des diviseurs de $${texNombre(2024, 0)}$ (on le sait grâce à la décomposition).`
          }
          reponse = choix === Diviseurs ? ['oui', 'OUI', 'Oui'] : ['non', 'NON', 'Non']
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += 'Répondre par oui ou non. <br>'
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 52: {
          const choixDiv = choice([[10, 'dix'], [100, 'cent'], [1000, 'mille']])
          const nbre = choice([2024, new Decimal(2024).mul(10), new Decimal(2024).div(10), new Decimal(2024).div(100)])
          const resultat1 = new Decimal(nbre).div(choixDiv[0])
          const resultat2 = new Decimal(nbre).mul(choixDiv[0])
          const resultat = choice([resultat1, resultat2])
          texte = `Quel est le nombre ${choixDiv[1]} fois plus ${resultat === resultat1 ? 'petit' : 'grand'} que $${texNombre(nbre)}$ ?`
          texteCorr = `Il s'agit de : $${resultat === resultat1 ? `${texNombre(nbre, 3)}\\div ${choixDiv[0]}` : `${texNombre(nbre, 3)}\\times ${choixDiv[0]}`}=${miseEnEvidence(texNombre(resultat, 6))}$.`
          reponse = resultat
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 53: {
          const a = choice([2024, -2024])
          const b = choice([2024, -2024])
          const c = choice([-1, 1])
          if (choice([true, false])) {
            texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par : $f(x)=\\text{e}^{${reduireAxPlusB(a, b)}}$.<br>
            Donner sa fonction dérivée. `
            texteCorr = `$f$ est de la forme $\\text{e}^{u}$ avec $u(x)=${reduireAxPlusB(a, b)}$. On a donc $u'(x)=${a}$.<br>
            Comme $f'=u'\\text{e}^u$,  $f'(x)=${miseEnEvidence(`${texNombre(a)}\\text{e}^{${reduireAxPlusB(a, b)}}`)}$
             `
            reponse = `${a}e^{${reduireAxPlusB(a, b)}}`
          } else {
            texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par : $f(x)=${texNombre(a)}\\text{e}^{${rienSi1(c)}x}$.<br>
          Donner sa fonction dérivée. `
            texteCorr = `$f$ est de la forme $\\text{e}^{u}$ avec $u(x)=${rienSi1(c)}x$. On a donc $u'(x)=${c}$.<br>
          Comme $f'=u'\\text{e}^u$,  $f'(x)=${miseEnEvidence(`${texNombre(a * c)}\\text{e}^{${rienSi1(c)}x}`)}$
           `
            reponse = `${a * c}e^{${rienSi1(c)}x}`
          }
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += '<br>$f\'(x)=$' + ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 54:
          if (choice([true, false])) {
            texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par : $f(x)=x^{${texNombre(2024)}}$.<br>
              Donner sa fonction dérivée. `
            texteCorr = `$f'(x)=${miseEnEvidence(`${texNombre(2024)}x^{${texNombre(2023)}}`)}$
               `
            reponse = '2024x^{2023}'
          } else {
            texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par : $f(x)=${texNombre(2024)}x^2+${texNombre(2024)}x+${texNombre(2024)}$.<br>
            Donner sa fonction dérivée. `
            texteCorr = ` $f'(x)=2\\times ${texNombre(2024)}x+${texNombre(2024)}=${miseEnEvidence(`${texNombre(4048)}x+${texNombre(2024)}`)}$
             `
            reponse = '4048*x+2024'
          }
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += '<br>$f\'(x)=$' + ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')

          break

        case 55: {
          const a = choice([-1, 1])
          const c = choice([-1, 1])
          const b = randint(1, 4) * c
          texte = `Quel est le coefficient directeur de la tangente au point d'abscisse $${texNombre(2024)}$ de la courbe d'équation $y=${reduirePolynomeDegre3(0, a, b, 2024)}$.  `
          texteCorr = `Si $f$ est la fonction définie par $f(x)=${reduirePolynomeDegre3(0, a, b, 2024)}$, le coeffcient directeur de la tangente au point d'abscisse  $${texNombre(2024)}$ est donné par le nombre dérivé  $f'(${texNombre(2024)})$.<br>
              Comme $f'(x)=${reduireAxPlusB(2 * a, b)}$, $f'(${texNombre(2024)})=${texNombre(2 * a)}\\times ${texNombre(2024)}${ecritureAlgebrique(b)}= ${miseEnEvidence(`${texNombre(2 * a * 2024 + b)}`)}$.
               `
          reponse = `${4048 * a + b}`

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break
        case 56: {
          const choix = randint(1, 3)
          if (choix === 1) {
            texte = `Calculer $${texNombre(2024)}^2-${texNombre(2023)}^2$. `
            texteCorr = `On utilise l'égalité remarquable $a^2-b^2=(a-b)(a+b)$ avec $a=${texNombre(2024)}$ et $b=${texNombre(2023)}$.<br>
            $${texNombre(2024)}^2-${texNombre(2023)}^2=(${texNombre(2024)}-${texNombre(2023)})(${texNombre(2024)}+${texNombre(2023)})=1\\times ${texNombre(4047)}=${miseEnEvidence(`${texNombre(4047)}`)}$.
                 `
            reponse = '4047'
          }
          if (choix === 2) {
            texte = `Calculer $${texNombre(2025)}^2-${texNombre(2024)}^2$. `
            texteCorr = `On utilise l'égalité remarquable $a^2-b^2=(a-b)(a+b)$ avec $a=${texNombre(2025)}$ et $b=${texNombre(2024)}$.<br>
              $${texNombre(2025)}^2-${texNombre(2024)}^2=(${texNombre(2025)}-${texNombre(2024)})(${texNombre(2025)}+${texNombre(2024)})=1\\times ${texNombre(4049)}=${miseEnEvidence(`${texNombre(4049)}`)}$.
                   `
            reponse = '4049'
          }
          if (choix === 3) {
            texte = `Développer $(x-\\sqrt{${texNombre(2024)}})(x+\\sqrt{${texNombre(2024)}})$. `
            texteCorr = `On utilise l'égalité remarquable $(a-b)(a+b)=a^2-b^2$ avec $a=x$ et $b=\\sqrt{${texNombre(2024)}}$.<br>
                $(x-\\sqrt{${texNombre(2024)}})(x+\\sqrt{${texNombre(2024)}})=${miseEnEvidence(`x^2-${texNombre(2024)}`)}$.
                     `
            reponse = 'x^2-2024'
          }

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 57: {
          const choix = randint(1, 2)
          const a = randint(5, 15)
          const c = 2024 - a
          const b = 2024 + a
          const listeNombre1 = ['2024', b, c]
          const Nombre1 = shuffle(listeNombre1)
          const listeNombre2 = ['2024', 2024 - a, 2024 - 2 * a]
          const Nombre2 = shuffle(listeNombre2)
          if (choix === 1) {
            texte = `On donne la série de nombres : $${texNombre(Nombre1[0])}$${sp(2)} ; ${sp(2)} $${texNombre(Nombre1[1])}$ ${sp(2)} ; ${sp(2)}$${texNombre(Nombre1[2])}$<br>
              Quelle est la moyenne de cette série ?`
            texteCorr = `On remarque que $${texNombre(c)}=${texNombre(2024)}-${a}$ et $${texNombre(b)}=${texNombre(2024)}+${a}$, donc la moyenne est $${miseEnEvidence(`${texNombre(2024)}`)}$.`
            reponse = '2024'
          }
          if (choix === 2) {
            texte = `On donne la série de nombres : $${texNombre(Nombre2[0])}$${sp(2)} ; ${sp(2)} $${texNombre(Nombre2[1])}$ ${sp(2)} ; ${sp(2)}$${texNombre(Nombre2[2])}$<br>
            Quelle est la moyenne de cette série ?`
            texteCorr = `On remarque que $${texNombre(2024)}=${texNombre(2024 - a)}+${a}$ et $${texNombre(2024 - 2 * a)}=${texNombre(2024 - a)}-${a}$, donc la moyenne est $${miseEnEvidence(`${texNombre(2024 - a)}`)}$.`
            reponse = `${2024 - a}`
          }

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 58: {
          const d = randint(3, 6)
          const u = randint(1, 9)
          const a = d * 10 + u
          const listeResultat = [2024 * a, 2024 * a + 1, 2024 * a - 1]
          const Resultat = shuffle(listeResultat)
          texte = `Recopier le résultat du calcul $${texNombre(2024)}\\times ${a}$ parmi les trois propositions suivantes : <br>
            $${texNombre(Resultat[0])}$${sp(2)} ; ${sp(2)} $${texNombre(Resultat[1])}$ ${sp(2)} ; ${sp(2)}$${texNombre(Resultat[2])}$  `
          texteCorr = `Le chiffre des unités de ce produit est donné par le chiffre des unités de $4\\times ${u}$, soit $${4 * u % 10}$.<br>
            Ainsi,  $${texNombre(2024)}\\times ${a}=${miseEnEvidence(`${texNombre(2024 * a)}`)}$.
                 `
          reponse = `${2024 * a}`

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 59: {
          const P = prenomF()
          const a = randint(11, 19) * 100
          texte = `${P} a acheté un scooter électrique coûtant $${texNombre(2024)}$ €. 
            Elle règle $${texNombre(a)}$ € à la livraison du scooter puis règlera la moitié du montant restant le mois suivant. <br>
            Quelle somme lui restera-t-il à payer ensuite pour le dernier versement ?  `
          texteCorr = `Après le premier versement de $${texNombre(a)}$, ${P} doit encore payer $${texNombre(2024 - a)}$ €. <br>
            La moitié de $${texNombre(2024 - a)}$ € est $${texNombre((2024 - a) / 2, 0)}$ €. <br>
              Ainsi, son dernier versement sera de $${miseEnEvidence(`${texNombre((2024 - a) / 2, 0)}`)}$ €.
                   `
          reponse = `${(2024 - a) / 2}`

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore', { texteApres: '€' })
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('$\\ldots$ €')
        }
          break

        case 60:
          if (choice([true, false])) {
            texte = `$\\cos(${texNombre(2024)}\\pi)=$ `
            texteCorr = `$\\cos(${texNombre(2024)}\\pi)=\\cos(0)=${miseEnEvidence(1)}$`
            reponse = '1'
            setReponse(this, index, reponse)
            this.listeCanEnonces.push('Compléter.')
            this.listeCanReponsesACompleter.push(`$\\cos(${texNombre(2024)}\\pi)=\\ldots$`)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
            } else { texte += '$\\ldots$' }
          } else {
            texte = `$\\sin(${texNombre(2024)}\\pi)=$ `
            texteCorr = `$\\sin(${texNombre(2024)}\\pi)=\\sin(0)=${miseEnEvidence(0)}$`
            reponse = '0'
            setReponse(this, index, reponse)
            this.listeCanEnonces.push('Compléter.')
            this.listeCanReponsesACompleter.push(`$\\sin(${texNombre(2024)}\\pi)=\\ldots$`)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
            } else { texte += '$\\ldots$' }
          }

          break

        case 61:
          texte = `En utilisant l'égalité $\\dfrac{${texNombre(2022)}}{3}=674$, compléter : `
          if (choice([true, false])) {
            texte += `$\\cos \\dfrac{${texNombre(2024)}\\pi}{3}=$ `
            texteCorr = `$\\cos \\dfrac{${texNombre(2024)}\\pi}{3}=\\cos\\dfrac{${texNombre(2022)}\\pi+2\\pi}{3}=\\cos\\left(674\\pi+\\dfrac{2\\pi}{3}\\right)=
              \\cos\\dfrac{2\\pi}{3}=${miseEnEvidence('-\\dfrac{1}{2}')}$`
            reponse = ['-\\dfrac{1}{2}', '\\dfrac{-1}{2}', '-0,5']
            setReponse(this, index, reponse)
            this.listeCanEnonces.push('Compléter.')
            this.listeCanReponsesACompleter.push(`$\\cos \\dfrac{${texNombre(2024)}\\pi}{3}=\\ldots$`)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
            } else { texte += '$\\ldots$' }
          } else {
            texte += `$\\sin \\dfrac{${texNombre(2024)}\\pi}{3}=$ `
            texteCorr = `$\\sin \\dfrac{${texNombre(2024)}\\pi}{3}=\\sin\\dfrac{${texNombre(2022)}\\pi+2\\pi}{3}=\\sin\\left(674\\pi+\\dfrac{2\\pi}{3}\\right)=
                \\sin\\dfrac{2\\pi}{3}=${miseEnEvidence('\\dfrac{\\sqrt{3}}{2}')}$`
            reponse = '\\dfrac{\\sqrt{3}}{2}'
            setReponse(this, index, reponse)
            this.listeCanEnonces.push('Compléter.')
            this.listeCanReponsesACompleter.push(`$\\cos \\dfrac{${texNombre(2024)}\\pi}{3}=\\ldots$`)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 nospacebefore')
            } else { texte += '$\\ldots$' }
          }

          break

        case 62:
          {
            const choix = randint(1, 3)
            const a = randint(2000, 2023)
            if (choix === 1) {
              texte = `Simplifier l'écriture de $\\dfrac{${texNombre(2024)}}{\\sqrt{${texNombre(2024)}}}$. `
              texteCorr = `$\\dfrac{${texNombre(2024)}}{\\sqrt{${texNombre(2024)}}}=\\dfrac{\\sqrt{${texNombre(2024)}}\\times \\sqrt{${texNombre(2024)}}}{\\sqrt{${texNombre(2024)}}}=${miseEnEvidence(`\\sqrt{${texNombre(2024)}}`)}$`
              reponse = '\\sqrt{2024}'
              setReponse(this, index, reponse)
            }
            if (choix === 2) {
              texte = `Simplifier l'écriture de $\\sqrt{${texNombre(2024)}}\\times \\sqrt{${texNombre(2024)}}$. `
              texteCorr = `$\\sqrt{${texNombre(2024)}}\\times {\\sqrt{${texNombre(2024)}}}=${miseEnEvidence(`${texNombre(2024)}`)}$`
              reponse = '2024'
              setReponse(this, index, reponse)
            }
            if (choix === 3) {
              texte = `Simplifier l'écriture de $${texNombre(2024)}\\times \\dfrac{${texNombre(a)}}{${texNombre(2024)}}$. `
              texteCorr = `$${texNombre(2024)}\\times \\dfrac{${texNombre(a)}}{${texNombre(2024)}}=\\dfrac{${texNombre(2024)}\\times ${texNombre(a)}}{${texNombre(2024)}}=${miseEnEvidence(`${a}`)}$`
              reponse = a
              setReponse(this, index, reponse)
            }
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push('')
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
            }
          }

          break

        case 63:

          if (!this.interactif) {
            texte = `Compléter :<br>
              $${texNombre(2024)}$ min  $=\\ldots$ h $\\ldots$ min<br>
              On pourra utiliser le résultat suivant : $\\dfrac{${texNombre(2024)}}{60}\\approx 33,7$.`
          } else {
            texte = `Compléter (en heures/minutes) :<br>
                $${texNombre(2024)}$ min  $=$`
            reponse = new Hms({ hour: 33, minute: 44 })
            setReponse(this, index, reponse, { formatInteractif: 'hms' })
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01 clavierHms inline')
            texte += `<br>On pourra utiliser le résultat suivant : $\\dfrac{${texNombre(2024)}}{60}\\approx 33,73$.`
          }
          texteCorr = ` Le résultat indique qu'il y a 33 heures pleines dans $${texNombre(2024)}$ min. <br>
              Or, $33\\times 60=${texNombre(1980)}$. <br>
              Ainsi, $${texNombre(2024)}$ min  $=${miseEnEvidence('33')}$ h $${miseEnEvidence('44')}$ min.`
          this.listeCanEnonces.push('Compléter.')
          this.listeCanReponsesACompleter.push('$20,4$ h  $=\\ldots$ h $\\ldots$ min')

          break

        case 64: {
          const a = randint(1, 3) * choice([-1, 1])
          const b = randint(1, 3) * choice([-1, 1])
          const inconnue = choice(['x', 'y', 'z', 't', 'u'])
          reponse = a * 2024 + b
          texte = `Calculer $${reduireAxPlusB(a, b, inconnue)}$ pour $${inconnue}=${texNombre(2024)}$. 
             `
          if (a === 1 || a === -1) {
            texteCorr = `Lorsque $${inconnue}=${texNombre(2024)}$, on a $${reduireAxPlusB(a, b, inconnue)}=${a * 2024}${ecritureAlgebrique(b)}=${miseEnEvidence(`${reponse}`)}$.`
          } else { texteCorr = `Lorsque $${inconnue}=${texNombre(2024)}$, on a $${reduireAxPlusB(a, b, inconnue)}=${a}\\times 2024${ecritureAlgebrique(b)}=${miseEnEvidence(reponse)}$.` }

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 65: {
          const a = randint(-5, 5, 0)
          const fraction = new FractionEtendue(1 + 2 * a, 2024)
          reponse = fraction
          texte = `Calculer sous la forme d'une fraction : <br>
          ${a > 0 ? `$\\dfrac{1}{${texNombre(2024)}} +\\dfrac{${a}}{${texNombre(1012)}}$` : `$\\dfrac{1}{${texNombre(2024)}} -\\dfrac{${-a}}{${texNombre(1012)}}$`}.
               `

          texteCorr = ` $${a > 0 ? `\\dfrac{1}{${texNombre(2024)}} +\\dfrac{${a}}{${texNombre(1012)}}` : `\\dfrac{1}{${texNombre(2024)}} -\\dfrac{${-a}}{${texNombre(1012)}}`}
            =${miseEnEvidence(`\\dfrac{${1 + 2 * a}}{2024}`)}$.`

          setReponse(this, index, reponse, { formatInteractif: 'fraction' })
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 66: {
          const choix = randint(1, 3)
          if (choix === 1) {
            reponse = -1
            texte = `Calculer  : $(-1)^{${texNombre(2023)}}+(-1)^{${texNombre(2024)}}+(-1)^{${texNombre(2025)}}$.
                 `
            texteCorr = ` Si $n$ est pair, $(-1)^n=1$ et si $n$ est impair, $(-1)^n=-1$. <br>
              Ainsi, $(-1)^{${texNombre(2023)}}+(-1)^{${texNombre(2024)}}+(-1)^{${texNombre(2025)}}=-1+1-1=${miseEnEvidence(-1)}$.`
          }
          if (choix === 2) {
            reponse = -1
            texte = `Calculer  : $\\dfrac{(-1)^{${texNombre(2023)}}}{(-1)^{${texNombre(2024)}}}$.
                   `
            texteCorr = ` Si $n$ est pair, $(-1)^n=1$ et si $n$ est impair, $(-1)^n=-1$. <br>
                Ainsi, $\\dfrac{(-1)^{${texNombre(2023)}}}{(-1)^{${texNombre(2024)}}}=\\dfrac{-1}{1}=${miseEnEvidence(-1)}$.`
          }
          if (choix === 3) {
            reponse = -1
            texte = `Calculer  : $(-1)^{${texNombre(2023)}}\\times(-1)^{${texNombre(2024)}}$.
                       `
            texteCorr = ` Si $n$ est pair, $(-1)^n=1$ et si $n$ est impair, $(-1)^n=-1$. <br>
                    Ainsi, $(-1)^{${texNombre(2023)}}\\times(-1)^{${texNombre(2024)}}=-1\\times 1=${miseEnEvidence(-1)}$.`
          }
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        }
          break

        case 67: {
          const objets = []
          const a = 506
          const A = point(0, 0, 'A', 'below')
          const B = point(6, 0, 'B', 'below')
          const C = point(6, 6, 'C', 'below')
          const D = point(0, 6, 'D', 'below')
          const s1 = segment(A, B)
          const s2 = segment(B, C)
          const s3 = segment(C, D)
          const s4 = segment(A, D)
          if (choice([true, false])) {
            objets.push(codageSegments('||', 'blue', A, B), codageSegments('||', 'blue', B, C),
              codageSegments('||', 'blue', C, D), codageSegments('||', 'blue', A, D),
              texteParPosition(`${a} cm`, 7.5, milieu(B, C).y + 0.5),
              codageAngleDroit(D, A, B), codageAngleDroit(A, B, C), codageAngleDroit(B, C, D), codageAngleDroit(C, D, A), s1, s2, s3, s4)
            texte = 'Quel est le périmètre de ce carré ? <br>' + mathalea2d({ xmin: -0.5, ymin: -1.2, xmax: 8.5, ymax: 7, scale: 0.4, style: 'margin: auto' }, objets)
            reponse = 4 * a
            texteCorr = `Il s'agit d'un carré. <br>
          Son périmètre est donc
         $4$ fois la longueur de son côté, soit $4\\times ${texNombre(a)}=${miseEnEvidence(`${texNombre(4 * a)}`)}$ cm.`
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01', { texteApres: ' cm' })
            }
          } else {
            objets.push(codageSegments('||', 'blue', A, B), codageSegments('||', 'blue', B, C),
              codageSegments('||', 'blue', C, D), codageSegments('||', 'blue', A, D),
              texteParPosition('?', 7, milieu(B, C).y + 0.5),
              codageAngleDroit(D, A, B), codageAngleDroit(A, B, C), codageAngleDroit(B, C, D), codageAngleDroit(C, D, A), s1, s2, s3, s4)
            texte = `Le périmètre  de ce carré est $${texNombre(4 * a)}$ cm.<br>
              Quelle est la longueur de son côté ? <br>
              
              ` + mathalea2d({ xmin: -0.5, ymin: -1.5, xmax: 8, ymax: 7, scale: 0.4, style: 'margin: auto' }, objets)
            reponse = a
            texteCorr = `Il s'agit d'un carré. <br>
              Son côté est  donc le quart de son périmètre, soit $${texNombre(4 * a)}\\div 4=${miseEnEvidence(`${texNombre(a)}`)}$ cm.`
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01', { texteApres: 'cm' })
            }
          }
          setReponse(this, index, reponse)

          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('$\\ldots$ cm')
        }
          break

        case 68:
          {
            const nom = creerNomDePolygone(5, ['QD'])
            const a = 2024
            const A = point(0, 0, nom[0], 'below')
            const B = point(6, 0, nom[1], 'below')
            const C = point(5, 4, nom[2], 'above')
            const D = point(2.5, 2, nom[3], 'above')
            const E = point(3, 0, nom[4], 'below')
            const objets = []
            objets.push(segment(A, B), segment(D, E), segment(A, C), segment(B, C),
              codageSegments('||', 'blue', A, D, D, C), labelPoint(A, B, C, D, E))
            if (choice([true, false])) {
              texte = `$(${nom[3]}${nom[4]})//(${nom[1]}${nom[2]})$ et
      $${nom[3]}${nom[4]}=${texNombre(a)}$.<br>
      Calculer $${nom[1]}${nom[2]}$.<br> `
              texte += mathalea2d({ xmin: -1, ymin: -1, xmax: 8, ymax: 5, scale: 0.7, pixelsParCm: 18, mainlevee: false, style: 'margin: auto' }, objets)
              texteCorr = ` Les longueurs du triangle $${nom[0]}${nom[1]}${nom[2]}$ sont 2 fois plus grandes que les longueurs du triangle $${nom[0]}${nom[3]}${nom[4]}$.<br>
      Le triangle $${nom[0]}${nom[1]}${nom[2]}$ est un agrandissement du triangle $${nom[0]}${nom[3]}${nom[4]}$.<br>
      Ainsi : $${nom[1]}${nom[2]}=2\\times ${nom[3]}${nom[4]}=2\\times ${texNombre(a)}=${miseEnEvidence(`${texNombre(2 * a)}`)}$.
  `
              reponse = 2 * a
            } else {
              texte = `$(${nom[3]}${nom[4]})//(${nom[1]}${nom[2]})$ et
       $${nom[1]}${nom[2]}=${texNombre(a)}$. <br>
         Calculer $${nom[3]}${nom[4]}$.<br>`
              texte += mathalea2d({ xmin: -1, ymin: -1, xmax: 8, ymax: 5, scale: 0.7, pixelsParCm: 18, mainlevee: false, style: 'margin: auto' }, objets)
              texteCorr = ` Les longueurs du triangle $${nom[0]}${nom[3]}${nom[4]}$ sont 2 fois plus petites que les longueurs du triangle $${nom[0]}${nom[1]}${nom[2]}$.<br>
      Le triangle $${nom[0]}${nom[3]}${nom[4]}$ est une réduction du triangle $${nom[0]}${nom[1]}${nom[2]}$. <br>
            Ainsi : $${nom[3]}${nom[4]}= ${nom[1]}${nom[2]} \\div 2 = ${texNombre(a)}\\div 2 =${miseEnEvidence(`${texNombre(a / 2, 0)}`)}$.
     `
              reponse = a / 2
            }
            setReponse(this, index, reponse)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
            }
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push(`$${nom[1]}${nom[2]}=\\ldots$`)
          }
          break

        case 69: {
          const nom = creerNomDePolygone(3, ['QD'])
          const a = randint(1, 6)
          const A = point(0, 0, nom[0], 'below')
          const B = point(6, 0, nom[1], 'below')
          const C = point(6, 2, nom[2], 'above')

          const objets = []

          if (choice([true, false])) {
            objets.push(segment(A, B), segment(A, C), segment(B, C), labelPoint(A, B, C), codageAngleDroit(A, B, C),
              texteParPosition('$\\sqrt{2024}$', 2.6, 2), texteParPosition(`$${a}$`, 6.8, 1))
            texte = `
      Calculer $${nom[0]}${nom[1]}$.<br> `
            texte += mathalea2d({ xmin: -1, ymin: -1, xmax: 8, ymax: 3, scale: 0.7, pixelsParCm: 18, mainlevee: false, style: 'margin: auto' }, objets)
            texteCorr = ` On utilise le théorème de Pythagore dans le triangle $${nom[0]}${nom[1]}${nom[2]}$,  rectangle en $${nom[1]}$.<br>
              On obtient :<br>
              $\\begin{aligned}
                ${nom[0]}${nom[2]}^2&=${nom[1]}${nom[2]}^2+${nom[0]}${nom[1]}^2\\\\
                ${nom[0]}${nom[1]}^2&=${nom[0]}${nom[2]}^2-${nom[1]}${nom[2]}^2\\\\
                ${nom[0]}${nom[1]}^2&=(\\sqrt{${texNombre(2024)}})^2-${a}^2\\\\
                ${nom[0]}${nom[1]}^2&=${texNombre(2024)}-${a * a}\\\\
                ${nom[0]}${nom[1]}^2&=${texNombre(2024 - a * a)}\\\\
                ${nom[0]}${nom[1]}&= ${miseEnEvidence(`\\sqrt{${texNombre(2024 - a * a)}}`)}\\\\
                \\end{aligned}$ `
            reponse = `\\sqrt{${2024 - a * a}}`
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push(`$${nom[0]}${nom[1]}=\\ldots$`)
          } else {
            objets.push(segment(A, B), segment(A, C), segment(B, C), labelPoint(A, B, C), codageAngleDroit(A, B, C),
              texteParPosition('$\\sqrt{2024}$', 2.6, -1), texteParPosition(`$${a}$`, 6.8, 1))
            texte = `
            Calculer $${nom[0]}${nom[2]}$.<br> `
            texte += mathalea2d({ xmin: -1, ymin: -2, xmax: 8, ymax: 3, scale: 0.7, pixelsParCm: 18, mainlevee: false, style: 'margin: auto' }, objets)
            texteCorr = ` On utilise le théorème de Pythagore dans le triangle $${nom[0]}${nom[1]}${nom[2]}$,  rectangle en $${nom[1]}$.<br>
                    On obtient :<br>
                    $\\begin{aligned}
                      ${nom[0]}${nom[2]}^2&=${nom[1]}${nom[2]}^2+${nom[0]}${nom[1]}^2\\\\
                      ${nom[0]}${nom[2]}^2&=(\\sqrt{${texNombre(2024)}})^2+${a}^2\\\\
                      ${nom[0]}${nom[2]}^2&=${texNombre(2024)}+${a * a}\\\\
                      ${nom[0]}${nom[2]}^2&=${texNombre(2024 + a * a)}\\\\
                      ${nom[0]}${nom[2]}&= ${miseEnEvidence(`\\sqrt{${texNombre(2024 + a * a)}}`)}\\\\
                      \\end{aligned}$ `
            reponse = `\\sqrt{${2024 + a * a}}`
            this.listeCanEnonces.push(texte)
            this.listeCanReponsesACompleter.push(`$${nom[0]}${nom[2]}=\\ldots$`)
          }
          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
        }
          break

        case 70: 
          reponse = 4220
          texte = 'Quel est le plus grand nombre de quatre chiffres que l\'on peut écrire en utilisant les quatre chiffres : $2$, $0$, $2$ et $4$ ?'
          texteCorr = ` Le plus grand nombre est $${miseEnEvidence(`${texNombre(4220)}`)}$.`

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')
        
          break

        case 71:

          reponse = 'MMXXIV'
          texte = `Comment s'écrit $${texNombre(2024)}$ en chiffres romains ? `

          texteCorr = `$${texNombre(2024)}=${miseEnEvidence('MMXXIV')}$`

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')

          break

        case 72:

          reponse = ['oui', 'OUI', 'Oui']
          texte = `$${texNombre(2024)}$ est il un multiple de la somme de ses chiffres ? `

          texteCorr = `La somme des chiffres de $${texNombre(2024)}$  est $8$. <br>
            On a $${texNombre(2024)}\\div 2=${texNombre(1012)}$, <br>
            $${texNombre(1012)}\\div 2=${texNombre(506)}$,<br>
             $${texNombre(506)}\\div 2=${texNombre(253)}$.<br>
            Donc  $${texNombre(2024)}$  ${texteEnCouleurEtGras('est un multiple ')} de $8$.`

          setReponse(this, index, reponse)
          if (this.interactif) {
            texte += '<br>Répondre par oui ou non. <br>'
            texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          }
          this.listeCanEnonces.push(texte)
          this.listeCanReponsesACompleter.push('')

          break
      }
      // texte += '<br>Réponse attendue : ' + reponse // Pour avoir les réponses quand on débuggue.

      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
        index++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.besoinFormulaire2Texte = [
      'Niveau attendu de la CAN',
      '7 : CM2\n6 : 6ème\n5 : 5ème\n4 : 4ème\n3 : 3ème\n2 : Seconde\n1 : Première\n0 : Terminale\nx : Au Hasard'
    ]
  }
}
