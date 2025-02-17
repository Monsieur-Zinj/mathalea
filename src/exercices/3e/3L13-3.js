import { codageSegments } from '../../lib/2d/codages.js'
import { point } from '../../lib/2d/points.js'
import { polygone, polygoneAvecNom } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../lib/2d/textes.ts'
import { homothetie } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { arrondi, nombreDeChiffresDe } from '../../lib/outils/nombres'
import { sp } from '../../lib/outils/outilString.js'
import { prenom } from '../../lib/outils/Personne'
import { texPrix } from '../../lib/format/style'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { resoudre } from '../../modules/outilsMathjs.ts'
import Exercice from '../Exercice'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import Grandeur from '../../modules/Grandeur'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Mettre en équation un problème et le résoudre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const dateDePublication = '15/02/2022'
export const dateDeModifImportante = '06/04/2023'
/**
 * @author Jean-Claude Lhote
 * Différents problèmes à résoudre.
 * Mise en équation de degré 1 à une inconnue, résolution et vérification.
 * Réf : 3L13-3
 * Ajout du choix des types de problèmes par Guillaume Valmont le 06/04/2023
 * Ajout d'un paramètre permettant d'avoir uniquement des nombres entiers dans l'énoncé par Guillaume-Valmont le 06/04/2023
 * Date de publication 15/02/2022
 */
export const uuid = '22412'
export const ref = '3L13-3'
export const refs = {
  'fr-fr': ['3L13-3'],
  'fr-ch': ['11FA6-6']
}
export default class ProblemesEnEquation extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 2
    this.besoinFormulaireTexte = ['Choix des problèmes', 'Nombres séparés par des tirets\n1 : basket\n2 : basket2\n3 : achats\n4 : polygone\n5 : programmes (produit vs produit,\n ... solution entière positive)\n6 : programmes (produit vs produit,\n ... solution entière négative)\n7 : programmes (somme vs produit,\n ... solution entière positive)\n8 : programmes (somme vs produit,\n ... solution entière négative)\n9 : tarifs\n10 : spectacle\n11 : isocèle\n12 : Thalès\n13 : Thalès2\n14 : Mélange']
    this.sup = '14'
    this.besoinFormulaire2CaseACocher = ['Uniquement des nombres entiers']
    this.sup2 = false
  }

  figureThales (a, b, c, OC) {
    const O = point(1.5, 0, 'O')
    const B = point(4, 6, 'B')
    const A = point(0, 5, 'A')
    const D = homothetie(B, O, 0.4, 'D')
    const C = homothetie(A, O, 0.4, 'C')
    const OAB = polygoneAvecNom(O, C, A, B, D)
    const CD = segment(C, D)
    const longOC = texteParPosition(`${OC}`, 0.5, 1)
    const longCA = texteParPosition(`${b}`, 0, 3)
    const longAB = texteParPosition(`${c}`, 2, 6)
    const longCD = texteParPosition(`${a}`, 1.5, 2.5)
    return mathalea2d({
      xmin: -1,
      xmax: 5,
      ymin: -1,
      ymax: 7,
      pixelsParCm: 20,
      scale: 0.8,
      zoom: 1
    }, OAB[0], OAB[1], longOC, longCA, longAB, longCD, CD)
  }

  triangleIsocele1 () {
    const O = point(6, 1.5)
    const B = point(0, 0)
    const A = point(0, 3)
    const OAB = polygone(O, A, B)
    const codage = codageSegments('//', 'black', O, A, O, B)
    return mathalea2d({ xmin: -1, xmax: 7, ymin: -1, ymax: 4, pixelsParCm: 20, scale: 0.8, zoom: 1 }, OAB, codage)
  }

  triangleIsocele2 () {
    const O = point(3, 1.5)
    const B = point(6, 0)
    const A = point(0, 0)
    const OAB = polygone(O, A, B)
    const codage = codageSegments('//', 'black', O, A, O, B)
    return mathalea2d({ xmin: -1, xmax: 7, ymin: -1, ymax: 2.5, pixelsParCm: 20, scale: 0.8, zoom: 1 }, OAB, codage)
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const listeDeProblemes = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 12,
      melange: 14,
      defaut: 1,
      shuffle: true,
      nbQuestions: this.nbQuestions
    })
    for (let i = 0, cpt = 0, uniteOptions, texte, x, a, b, c, d, enonce, figure, intro, conclusion, equation, resolution, verification, texteCorr; i < this.nbQuestions && cpt < 50;) {
      const quidam = prenom(2)
      // const n = 0 // un paramètre entier qui peut servir dans certains cas.
      const produit = choice(['fraises', 'pêches', 'poires', 'pommes', 'mangues', 'prunes', 'citrons'])
      const polygones = ['triangle', 'quadrilatère', 'pentagone', 'hexagone']
      const clubs = ['ciné-club', 'club de fitness', 'club de ski']
      uniteOptions = ['', '', '']
      switch (listeDeProblemes[i]) {
        case 1: // basket
          x = randint(5, 15) // variables.x // nombre de paniers à trois points
          a = randint(5, 12) // variables.a // nombres de paniers à deux points de plus que x
          b = randint(15, 30) // variables.b // nombre de points marqués au lancer franc
          c = 0 // ne sert pas dans ce cas
          d = b + (a + x) * 2 + x * 3 // variables.d // nombre de points de la partie
          equation = `x*3+(${a}+x)*2+${b}=${d}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: true, comment: true })
          enonce = `Une équipe de basket a marqué ${d} points lors d'un match. Au cours de ce match, elle a marqué ${b} points sur lancers francs.<br>`
          enonce += `L'équipe a marqué ${a} paniers à deux points de plus que de paniers à trois points.<br>Combien a-t-elle marqué de paniers à trois points ?`
          intro = `Posons $x$ le nombre de paniers à trois points.<br>Le nombre de paniers à deux points est donc $${a}+x$.<br>`
          intro += 'Le score de l\'équipe fournit donc l\'équation: <br>'
          conclusion = `<br>L'équipe a donc marqué ${x} paniers à trois points.`
          figure = ''
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          // uniteOptions[2] = 'paniers à trois points'
          break
        case 2: // basket2
          x = randint(17, 27) // variables.x // nombre de paniers à deux points
          a = randint(5, 12) // variables.a // nombres de paniers à trois points de moins que de paniers à 2 points
          b = randint(15, 30) // variables.b // nombre de points marqués au lancer franc
          d = b + (x - a) * 3 + x * 2 // variables.d // nombre de points de la partie
          c = 0 // ne sert pas dans ce cas
          equation = `x*2+(x-${a})*3+${b}=${d}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: true, comment: true, suppr1: false })
          enonce = `Une équipe de basket a marqué ${d} points lors d'un match. Au cours de ce match, elle a marqué ${b} points sur lancers francs.<br>`
          enonce += `L'équipe a marqué ${a} paniers à trois points de moins que de paniers à deux points.<br>Combien a-t-elle marqué de paniers à deux points ?`
          intro = `Posons $x$ le nombre de paniers à deux points.<br>Le nombre de paniers à trois points est donc $x-${a}$.<br>`
          intro += 'Le score de l\'équipe fournit donc l\'équation: <br>'
          conclusion = `<br>L'équipe a donc marqué ${x} paniers à deux points.`
          figure = ''
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          // uniteOptions[2] = 'paniers à deux points'
          break

        case 3: // achats
          do {
            x = randint(2, 5) + (this.sup2 ? 0 : randint(0, 4) / 5) // variables.x // prix de 1kg de produit
            a = randint(2, 5) + (this.sup2 ? 0 : randint(0, 1) / 5)// variables.a // nombre de kg de produit
            b = a * x // variables.b // prix total du produit
          } while (b >= 100 || b <= 5 || b % 10 === 0)
          d = b > 50 ? 100 : b > 20 ? 50 : b > 10 ? 20 : 10 // valeur du billet donné
          c = 0 // ne sert pas dans ce cas
          equation = `${a}*x+${arrondi(d - b, 2)}=${d}`
          resolution = resoudre(equation, { substeps: true, comment: true })
          enonce = `${quidam[0]} a acheté $${texNombre(a)}$ kg de ${produit} avec un billet de $${d}$ €. Le marchand lui a rendu $${texPrix(d - b)}$ €.<br>`
          enonce += `Quel est le prix d'un kilogramme de ${produit} ?`
          intro = `Posons $x$ le prix d'un kilogramme de ${produit}.<br>L'énoncé se traduit par l'équation suivante :<br>`
          conclusion = `<br>Le prix d'un kilogramme de ${produit} est donc de $${texNombre(x)}$ €.`
          figure = ''
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          uniteOptions[2] = '€'
          break
        case 4: // polygone
          x = randint(2, 4) + (this.sup2 ? 0 : randint(0, 45) / 5)// variables.x // longueur d'un des côtés égaux
          a = randint(2, 5) + (this.sup2 ? 0 : randint(0, 45) / 5) // variables.a // longueur du côté différent
          b = randint(2, 5) // variables.b // nombre de côtés égaux du polygone
          d = b * x + a // variables.d // périmètre du polygone
          c = 0 // ne sert pas dans ce cas
          equation = `${b}*x+${a}=${stringNombre(d).replace(',', '.').replace(/\s+/g, '')}`
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: true })
          enonce = `Un ${polygones[b - 2]} possède un côté de longueur $${texNombre(a)}$ cm et tous ses autres côtés ont même longueur.<br>Son périmètre est $${texNombre(d)}$ cm.<br>`
          enonce += 'Quelle est la longueur' + (context.isAmc ? ', en cm,' : '') + ' des côtés de même longueur ?'
          intro = 'Posons $x$ la longueur des côtés de même longueur.<br>'
          intro += `Un ${polygones[b - 2]} possède ${b + 1} côtés, donc celui-ci possède ${b} côtés de même longueur.<br>`
          intro += 'L\'énoncé se traduit par l\'équation suivante :<br>'
          conclusion = `<br>Les côtés de même longueur mesurent donc $${texNombre(x)}$ cm.`
          figure = ''
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          uniteOptions = [' unites[Longueurs]', new Grandeur(x, 'cm'), '']
          break
        case 5: // programmes
          do {
            a = randint(2, 15)
            b = randint(1, 10)
            c = randint(2, 15)
            d = randint(1, 10)
          } while ((c * d - a * b) * (a - c) <= 0 || (Math.abs(c * d - a * b) % Math.abs(a - c)) !== 0)

          // falls through
        case 6: // programmes2
          if (listeDeProblemes[i] === 6) {
            do {
              a = randint(2, 15)
              b = randint(1, 10)
              c = randint(2, 15)
              d = randint(1, 10)
            } while ((c * d - a * b) * (a - c) >= 0 || (Math.abs((c * d - a * b)) % Math.abs(a - c)) !== 0)
          }
          x = Math.round((c * d - a * b) / (a - c))
          equation = `(x+${b})*${a}=(x+${d})*${c}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: false, comment: true })
          enonce = `${quidam[0]} et ${quidam[1]} choisissent un même nombre.<br> ${quidam[0]} lui ajoute ${b} puis multiplie le résultat par ${a} alors que `
          enonce += `${quidam[1]} lui ajoute ${d} puis multiplie le résultat par ${c}.<br>`
          enonce += `${quidam[0]} et ${quidam[1]} obtiennent le même résultat.<br>`
          enonce += `Quel nombre commun ont choisi ${quidam[0]} et ${quidam[1]} ?`
          intro = 'Posons $x$ le nombre choisi au départ.<br>'
          intro += `Le programme de calcul effectué par ${quidam[0]} se traduit par : $(x+${b})\\times ${a}$.<br>`
          intro += `Le programme de calcul effectué par ${quidam[1]} se traduit par : $(x+${d})\\times ${c}$.<br>`
          intro += 'L\'égalité des résultats se traduit par l\'équation suivante :<br>'
          conclusion = `<br>${quidam[0]} et ${quidam[1]} ont donc choisi au départ le nombre ${x}.`
          figure = ''
          verification = `<br>Vérification :
          <br>
          D'une part : $${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$
          <br>
          D'autre part : $${resolution.verifRightSide.printExpression}=${resolution.verifRightSide.printResult}$
          `
          break
        case 7: // programmes
          do {
            a = randint(2, 15)
            b = randint(1, 10)
            c = randint(2, 15)
            d = randint(1, 10)
          } while ((d - a * b) * (a - c) <= 0 || (Math.abs((d - a * b)) % Math.abs(a - c)) !== 0)
          // falls through
        case 8: // programmes
          if (listeDeProblemes[i] === 8) {
            do {
              a = randint(2, 15)
              b = randint(1, 10)
              c = randint(2, 15)
              d = randint(1, 10)
            } while ((d - a * b) * (a - c) >= 0 || (Math.abs((d - a * b)) % Math.abs(a - c)) !== 0)
          }
          x = Math.round((d - a * b) / (a - c))
          equation = `(x+${b})*${a}=${c}*x+${d}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: false, comment: true })
          enonce = `${quidam[0]} et ${quidam[1]} choisissent un même nombre.<br> ${quidam[0]} lui ajoute ${b} puis multiplie le résultat par ${a} alors que `
          enonce += `${quidam[1]} le multiplie par ${c} puis ajoute au résultat ${d}.<br>`
          enonce += `${quidam[0]} et ${quidam[1]} obtiennent le même résultat.<br>`
          enonce += `Quel nombre commun ont choisi ${quidam[0]} et ${quidam[1]} ?`
          intro = 'Posons $x$ le nombre choisi au départ.<br>'
          intro += `Le programme de calcul effectué par ${quidam[0]} se traduit par : $(x+${b})\\times ${a}$.<br>`
          intro += `Le programme de calcul effectué par ${quidam[1]} se traduit par : $${c}x + ${d}$.<br>`
          intro += 'L\'égalité des résultats se traduit par l\'équation suivante :<br>'
          conclusion = `<br>${quidam[0]} et ${quidam[1]} ont donc choisi au départ le nombre ${x}.`
          figure = ''
          verification = `<br>Vérification :
          <br>
          D'une part : $${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$
          <br>
          D'autre part : $${resolution.verifRightSide.printExpression}=${resolution.verifRightSide.printResult}$
          `
          break
        case 9: // tarifs
          do {
            a = randint(0, 2)
            b = this.sup2 ? randint(5, 8) : randint(50, 80) / 10
            c = randint(4, 10) * 5
            d = b - (this.sup2 ? randint(1, 3) : randint(2, 6) * 0.5)
          } while (c / (b - d) >= 30 || c / (b - d) <= 10 || ((c * 2) % ((b - d) * 2)) !== 0)
          x = Math.ceil(c / (b - d))
          equation = `x*${b}>=${c}+x*${stringNombre(d).replace(',', '.').replace(/\s+/g, '')}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: false, comment: true })
          enonce = `Le ${clubs[a]} d'un village propose deux tarifs à ses pratiquants.<br>`
          enonce += `Le tarif A propose de payer $${texPrix(b)}$ € à chaque séance.<br>`
          enonce += `Le tarif B propose de payer un abonnement annuel de $${texPrix(c)}$ € puis de payer $${texPrix(d)}$ € par séance.<br>`
          enonce += 'Pour quel nombre de séances le tarif B devient-il plus avantageux que le tarif A ?'
          intro = 'Posons $x$ le nombre de séances.<br>'
          intro += `Le prix à payer avec le tarif A est : $x\\times ${texPrix(b)}$.<br>`
          intro += `Le prix à payer avec le tarif B est : $${texPrix(c)}+x\\times ${texPrix(d)}$.<br>`
          intro += 'Pour que le tarif B soit plus avantageux, $x$ doit vérifier l\'inéquation suivante:<br>'
          conclusion = `<br>C'est à partir de $${x}$ séances que le tarif B devient plus avantageux que le tarif A (pour $${x}$ séances, les deux tarifs sont équivalents).`
          figure = ''
          verification = `<br>Vérification :
          <br>
          D'une part : $${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$
          <br>
          D'autre part : $${resolution.verifRightSide.printExpression}=${resolution.verifRightSide.printResult}$
          `
          //  verification = `<br>Vérification :<br>$${x}\\times ${texPrix(b)}=${texPrix(x * b)}$ et $${c}+${x}\\times ${texPrix(d)}=${c}+${texPrix(x * d)}= ${texPrix(c + x * d)}$.<br>`
          break
        case 10: // spectacle
          do {
            a = randint(200, 300) * 10
            b = this.sup2 ? randint(10, 20) : randint(100, 200) / 10
            c = this.sup2 ? randint(5, 15) : randint(50, 150) / 10
            x = randint(1000, a - 500)
            d = b * x + (a - x) * c
          } while (b <= c)
          equation = `x*${b}+(${a}-x)*${c}=${stringNombre(d).replace(',', '.').replace(/\s+/g, '')}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: true, comment: true })
          enonce = `Dans une salle de spectacle de $${texNombre(a)}$ places, le prix d'entrée pour un adulte est $${texPrix(b)}$ € et, pour un enfant, il est de $${texPrix(c)}$ €.<br>`
          enonce += `Le spectacle de ce soir s'est déroulé devant une salle pleine et la recette est de $${texPrix(d)}$ €.<br>`
          enonce += 'Combien d\'adultes y avait-il dans la salle ?'
          intro = 'Posons $x$ le nombre de places adultes vendues.<br>'
          intro += `Comme les $${texNombre(a)}$ places ont été vendues, le nombre de places enfants est : $${a}-x$.<br>`
          intro += 'Le calcul de la recette donne l\'équation suivante.<br>'
          conclusion = `<br>Il y a donc eu $${texNombre(x)}$ adultes au spectacle.`
          figure = ''
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          break
        case 11: // isocele
          do {
            a = randint(50, 100)
            c = (1 - 2 * randint(0, 2)) * randint(10, 30) // variables.b
            b = a + c
            d = 2 * a + b
          } while (b <= 0 || 2 * a <= b)
          enonce = `Un triangle isocèle a pour périmètre $${d}$ mm. `
          if (c > 0) { // La base est le plus grand côté
            enonce += `Sa base est plus longue de $${c}$ mm que chacun des côtés égaux.`
          } else { // La base est plus petite que les autres côtés
            enonce += `Sa base est plus courte de $${-c}$ mm que chacun des côtés égaux.`
          }
          if (choice([true, false])) {
            enonce += '<br>Quelle est la mesure de sa base' + (context.isAmc ? ', en mm' : '') + ' ? (La figure n\'est pas en vraie grandeur.)'
            intro = `Posons $x$ la longueur de sa base. La longueur des côtés égaux est : $x${ecritureAlgebrique(-c)}$.<br>`
            intro += 'Le calcul du périmètre donne l\'équation suivante :<br>'
            equation = `2*(x${ecritureAlgebrique(-c)})+x=${d}`
            conclusion = `<br>La base de ce triangle isocèle mesure donc $${b}$ mm.`
            x = b
          } else {
            enonce += '<br>Quelle est la mesure de ses côtés égaux ? (la figure n\'est pas en vraie grandeur)'
            intro = `Posons $x$ la longueur d'un des côtés égaux. La longueur de la base est : $x${ecritureAlgebrique(c)}$.<br>`
            intro += 'Le calcul du périmètre donne l\'équation suivante :<br>'
            equation = `2*x+x${ecritureAlgebrique(c)}=${d}`
            conclusion = `<br>Les deux côtés égaux de ce triangle isocèle mesurent donc $${a}$ mm.`
            x = a
          }
          resolution = resoudre(equation, { reduceSteps: false, substeps: true, comment: true, suppr1: false })
          if (c > 0) figure = this.triangleIsocele2()
          else figure = this.triangleIsocele1()
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          uniteOptions = [' unites[Longueurs]', new Grandeur(x, 'mm'), '']
          break
        case 12: // Thalès
          do {
            a = randint(5, 40)
            b = randint(5, 40)
            c = randint(41, 100)
            d = a * b / (c - a)
          } while (d <= 0 || ((a * b) % Math.abs(c - a)) !== 0)
          x = Math.round(d)
          equation = `(x+${b})*${a}=x*${c}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: false, comment: true })
          figure = this.figureThales(a, b, c, '')
          enonce = 'Soit la figure ci-dessous qui n\'est pas en vraie grandeur où $[CD]$ et $[AB]$ sont parallèles.'
          enonce += ` $AB=${c}\\text{mm}$, $AC=${b}\\text{mm}$ et $CD=${a}\\text{mm}$.<br> Déterminer la longueur $OC$${context.isAmc ? ', en mm.' : '.'}`
          intro = 'Dans cette configuration de Thalès, on a l\'égalité suivante : $\\dfrac{OC}{OA}=\\dfrac{CD}{AB}$.<br>'
          intro += 'Cette égalité est équivalente à l\'égalité des produits en croix : $OC\\times AB = CD\\times OA$.<br>'
          intro += 'En remplaçant les longueurs par les données de l\'énoncé et en posant $x=OC$, on obtient l\'équation suivante :<br>'
          conclusion = `<br>donc $OA=${x}\\text{mm}$.<br>`
          verification = `<br>Vérification :
            <br>
            D'une part : $${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$
            <br>
            D'autre part : $${resolution.verifRightSide.printExpression}=${resolution.verifRightSide.printResult}$
            `
          uniteOptions = [' unites[Longueurs]', new Grandeur(x, 'mm'), '']
          break
        case 13: // Thales2
          do {
            a = randint(5, 40)
            x = randint(5, 40)
            c = randint(41, 100)
            d = a * x / (c - a)
          } while (d <= 0 || ((a * x) % Math.abs(c - a)) !== 0)
          b = Math.round(d)
          equation = `(x+${b})*${a}=${b}*${c}`
          resolution = resoudre(equation, { reduceSteps: false, substeps: false, comment: true })
          figure = this.figureThales(a, '', c, b)
          enonce = 'Soit la figure ci-dessous qui n\'est pas en vraie grandeur où $[CD]$ et $[AB]$ sont parallèles.'
          enonce += ` $AB=${c}\\text{mm}$, $OC=${b}\\text{mm}$ et $CD=${a}\\text{mm}$.<br> Déterminer la longueur $AC$${context.isAmc ? ', en mm.' : '.'}`
          intro = 'Dans cette configuration de Thalès, on a l\'égalité suivante : $\\dfrac{OA}{OC}=\\dfrac{AB}{CD}$.<br>'
          intro += 'Cette égalité est équivalente à l\'égalité des produits en croix : $CD\\times OA = OC\\times AB$.<br>'
          intro += 'En remplaçant les longueurs par les données de l\'énoncé et en posant $x=OC$, on obtient l\'équation suivante :<br>'
          conclusion = `<br>donc $CA=${x}\\text{mm}$.<br>`
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          uniteOptions = [' unites[Longueurs]', new Grandeur(x, 'mm'), '']
          break
      }

      texte = enonce + figure + ajouteChampTexteMathLive(this, i, '' + uniteOptions[0], { texteApres: sp(2) + uniteOptions[2] })
      texteCorr = intro
      texteCorr += `$${resolution.equation}$`
      texteCorr += '<br>Résolvons l\'équation :<br>'
      texteCorr += resolution.texteCorr
      texteCorr += verification
      texteCorr += conclusion

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte + '\\\\',
          enonceAvant: false,
          propositions: [
            {
              type: 'AMCOpen',
              propositions: [{
                enonce: texte + '<br>Mettre le problème en équation ci-dessous et la résoudre.',
                statut: 3,
                pointilles: true
              }]
            },
            {
              type: 'AMCNum',
              propositions: [{
                texte: '',
                statut: '',
                reponse: {
                  texte: 'Réponse au problème : ',
                  valeur: [x],
                  param: {
                    digits: Math.max(nombreDeChiffresDe(x), 2),
                    signe: true
                  }
                }
              }]
            }
          ]
        }
      }

      if (this.questionJamaisPosee(i, x, a, b, d)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (uniteOptions[0] === '') setReponse(this, i, x, { formatInteractif: 'calcul' })
        else setReponse(this, i, uniteOptions[1], { formatInteractif: 'unites' })
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
