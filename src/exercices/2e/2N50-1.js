import { codageSegments } from '../../lib/2d/codages.js'
import { point } from '../../lib/2d/points.js'
import { polygone, polygoneAvecNom } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../lib/2d/textes.ts'
import { homothetie } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { abs, arrondi } from '../../lib/outils/nombres'
import { prenom } from '../../lib/outils/Personne'
import { texPrix } from '../../lib/format/style'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { resoudre } from '../../modules/outilsMathjs.ts'
import Exercice from '../Exercice'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Mettre en équation un problème et le résoudre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '15/02/2022'
export const dateDeModifImportante = '23/09/2024'
/**
 * @author Jean-Claude Lhote
 * Différents problèmes à résoudre.
 * Mise en équation de degré 1 à une inconnue, résolution et vérification.
 * Ajout du choix des types de problèmes par Guillaume Valmont le 06/04/2023
 * Ajout d'un paramètre permettant d'avoir uniquement des nombres entiers dans l'énoncé par Guillaume-Valmont le 06/04/2023
 * Date de publication 15/02/2022
 * * cloner par Gilles Mora pour le ref seconde le 05/06/23.
 */
export const uuid = '622b9'
export const ref = '2N50-1'
export const refs = {
  'fr-fr': ['2N50-1'],
  'fr-ch': ['11FA6-7']
}
export default class ProblemesAvecEquations extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.besoinFormulaireTexte = ['Choix des problèmes', 'Nombres séparés par des tirets\n1 : basket\n2 : basket2\n3 : achats\n4 : polygone\n5 : programmes\n6 : programmes2\n7 : spectacle\n8 : isocèle\n9 : Mélange']
    this.sup = '9'
    this.besoinFormulaire2CaseACocher = ['Uniquement des nombres entiers']
    this.sup2 = false
    this.spacing = 1.5
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
      max: 8,
      melange: 9,
      defaut: 1,
      shuffle: true,
      nbQuestions: this.nbQuestions
    })
    for (let i = 0, cpt = 0, texte, x, a, b, c, d, enonce, figure, intro, conclusion, equation, resolution, verification, texteCorr; i < this.nbQuestions && cpt < 50;) {
      const quidam = prenom(2)
      // const n = 0 // un paramètre entier qui peut servir dans certains cas.
      const produit = choice(['fraises', 'pêches', 'poires', 'pommes', 'mangues', 'prunes', 'citrons'])
      const polygones = ['triangle', 'quadrilatère', 'pentagone', 'hexagone']
      switch (listeDeProblemes[i]) {
        case 1: // basket
          /* variables = aleaVariables(
            {
              x: 'randomInt(5,15)',
              a: 'randomInt(5,12)',
              b: 'randomInt(15,30)',
              d: 'b+(a+x)*2+x*3'
            }
            , { valueOf: true, type: 'number' })
          x = variables.x // nombre de paniers à trois points
          a = variables.a // nombres de paniers à deux points de plus que x
          b = variables.b // nombre de points marqués au lancer franc
          d = variables.d // nombre de points de la partie
          */
          x = randint(5, 15)
          a = randint(5, 12)
          b = randint(15, 30)
          d = b + (a + x) * 2 + x * 3
          equation = `x*3+(${a}+x)*2+${b}=${d}`
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: false })
          enonce = `Une équipe de basket a marqué ${d} points lors d'un match. Au cours de ce match, elle a marqué ${b} points sur lancers francs.<br>`
          enonce += `L'équipe a marqué ${a} paniers à deux points de plus que de paniers à trois points.<br>
          Combien a-t-elle marqué de paniers à trois points ?`
          intro = `Posons $x$ le nombre de paniers à trois points.<br>Le nombre de paniers à deux points est donc $${a}+x$.<br>`
          intro += 'Le score de l\'équipe fournit donc l\'équation: <br>'
          conclusion = `<br>L'équipe a donc marqué ${texteEnCouleurEtGras(x)} paniers à trois points.`
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers)
          break
        case 2: // basket2
          /* variables = aleaVariables(
            {
              x: 'randomInt(17,27)',
              a: 'randomInt(5,12)',
              b: 'randomInt(15,30)',
              d: 'b+(x-a)*3+x*2'
            }
            , { valueOf: true })
          x = variables.x // nombre de paniers à deux points
          a = variables.a // nombres de paniers à trois points de moins que de paniers à 2 points
          b = variables.b // nombre de points marqués au lancer franc
          d = variables.d // nombre de points de la partie
          */
          x = randint(17, 27)
          a = randint(5, 12)
          b = randint(15, 30)
          d = b + (x - a) * 3 + x * 2
          equation = `x*2+(x-${a})*3+${b}=${d}`
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: false, suppr1: false })
          enonce = `Une équipe de basket a marqué ${d} points lors d'un match. Au cours de ce match, elle a marqué ${b} points sur lancers francs.<br>`
          enonce += `L'équipe a marqué ${a} paniers à trois points de moins que de paniers à deux points.<br>Combien a-t-elle marqué de paniers à deux points ?          `
          intro = `Posons $x$ le nombre de paniers à deux points.<br>Le nombre de paniers à trois points est donc $x-${a}$.<br>`
          intro += 'Le score de l\'équipe fournit donc l\'équation: <br>'
          conclusion = `<br>L'équipe a donc marqué ${texteEnCouleurEtGras(x)} paniers à trois points.`
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers)
          break

        case 3: // achats
          /* variables = aleaVariables(
            {
              a: `randomInt(2,5)${this.sup2 ? '' : '+randomInt(0,4)/5'}`,
              x: `randomInt(2,5)${this.sup2 ? '' : '+randomInt(0,1)/2'}`,
              b: 'a*x',
              test: 'b<100 and b>5 and b%10!=0'
            }
            , { valueOf: true })
          x = variables.x // prix de 1kg de produit
          a = variables.a // nombre de kg de produit
          b = variables.b // prix total du produit
          */
          do {
            x = randint(2, 5) + (this.sup2 ? 0 : randint(0, 1) / 2)
            a = randint(2, 5) + (this.sup2 ? 0 : randint(0, 4) / 5)
            b = a * x
          } while (!(b < 100 && b > 5 && b % 10 !== 0))
          d = b > 50 ? 100 : b > 20 ? 50 : b > 10 ? 20 : 10 // valeur du billet donné
          equation = `${a}*x+${arrondi(d - b, 2)}=${d}`
          resolution = resoudre(equation, { substeps: false, comment: false })
          enonce = `${quidam[0]} a acheté $${texNombre(a)}$ kg de ${produit} avec un billet de $${d}$ €. Le marchand lui a rendu $${texPrix(d - b)}$ €.<br>`
          enonce += `Quel est le prix d'un kilogramme de ${produit} ?`
          intro = `Posons $x$  le prix d'un kilogramme de ${produit}.<br>L'énoncé se traduit par l'équation suivante :<br>`
          conclusion = `<br>Le prix d'un kilogramme de ${produit} est donc de $${miseEnEvidence(texNombre(x))}$ €.`
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers, { texteApres: '€' })
          break
        case 4: // polygone
          /* variables = aleaVariables(
            {
              x: `randomInt(2,4)${this.sup2 ? '' : '+randomInt(0,45)/5'}`,
              a: `randomInt(2,5)${this.sup2 ? '' : '+randomInt(0,45)/5'}`,
              b: 'randomInt(2,5)',
              d: 'b*x+a'
            }
            , { valueOf: true })
          x = variables.x // longueur d'un des côtés égaux
          a = variables.a // longueur du côté différent
          b = variables.b // nombre de côtés égaux du polygone
          d = variables.d // périmètre du polygone */
          x = randint(2, 4) + (this.sup2 ? 0 : randint(0, 45) / 5)
          a = randint(2, 5) + (this.sup2 ? 0 : randint(0, 45) / 5)
          b = randint(2, 5)
          d = b * x + a
          equation = `${b}*x+${a}=${stringNombre(d).replace(',', '.').replace(/\s+/g, '')}`
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: false })
          enonce = `Un ${polygones[b - 2]} possède un côté de longueur $${texNombre(a)}$ cm et tous ses autres côtés ont même longueur.<br>Son périmètre est $${texNombre(d)}$ cm.<br>`
          enonce += ' Quelle est la longueur des côtés de même longueur ? '
          intro = 'Posons $x$  la longueur des côtés de même longueur.<br>'
          intro += `Un ${polygones[b - 2]} possède ${b + 1} côtés, donc celui-ci possède ${b} côtés de même longueur.<br>`
          intro += 'L\'énoncé se traduit par l\'équation suivante :<br>'
          conclusion = `<br>Les côtés de même longueur mesure donc $${miseEnEvidence(texNombre(x))}$ cm.`
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers, { texteApres: ' $cm$' })
          break
        case 5: // programmes
          /* variables = aleaVariables(
            {
              a: 'randomInt(2,15)',
              b: 'randomInt(1,10)',
              c: 'randomInt(2,15)',
              d: 'randomInt(1,10)',
              test: 'abs((c*d-a*b))%abs(a-c) == 0 and (c*d-a*b)*(a-c)>0'
            }
            , { valueOf: true }) */
          do {
            a = randint(2, 15)
            b = randint(1, 10)
            c = randint(2, 15)
            d = randint(1, 10)
          } while (!(abs((c * d - a * b)) % abs(a - c) === 0 && (c * d - a * b) * (a - c) > 0))
          // falls through
        case 6: // programmes2
          /* variables = aleaVariables(
            {
              a: 'randomInt(2,15)',
              b: 'randomInt(1,10)',
              c: 'randomInt(2,15)',
              d: 'randomInt(1,10)',
              test: 'abs((c*d-a*b))%abs(a-c) == 0 and (c*d-a*b)*(a-c)<0'
            }
            , { valueOf: true })
          a = variables.a
          b = variables.b
          c = variables.c
          d = variables.d
          */
          if (listeDeProblemes[i] === 6) { // A cause du case 5 impliqué dans le case 6
            do {
              a = randint(2, 15)
              b = randint(1, 10)
              c = randint(2, 15)
              d = randint(1, 10)
            } while (!(abs((c * d - a * b)) % abs(a - c) === 0 && (c * d - a * b) * (a - c) < 0))
          }
          x = Math.round((c * d - a * b) / (a - c))
          equation = `(x+${b})*${a}=(x+${d})*${c}`
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: false })
          enonce = `${quidam[0]} et ${quidam[1]} choisissent un même nombre.<br> ${quidam[0]} lui ajoute ${b} puis multiplie le résultat par ${a} alors que `
          enonce += `${quidam[1]} lui ajoute ${d} puis multiplie le résultat par ${c}.<br>`
          enonce += `${quidam[0]} et ${quidam[1]} obtiennent le même résultat.<br>`
          enonce += `Quel nombre commun ont choisi ${quidam[0]} et ${quidam[1]} ?`
          intro = 'Posons $x$ le nombre choisi au départ.<br>'
          intro += `Le programme de calcul effectué par ${quidam[0]} se traduit par : $(x+${b})\\times ${a}$.<br>`
          intro += `Le programme de calcul effectué par ${quidam[1]} se traduit par : $(x+${d})\\times ${c}$.<br>`
          intro += 'L\'égalité des résultats se traduit par l\'équation suivante :<br>'
          conclusion = `<br>${quidam[0]} et ${quidam[1]} ont donc choisi au départ le nombre ${texteEnCouleurEtGras(x)}.`
          verification = `<br>Vérification :
          <br>
          D'une part : $${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$
          <br>
          D'autre part : $${resolution.verifRightSide.printExpression}=${resolution.verifRightSide.printResult}$
          `
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers)
          break

        case 7: // spectacle
          /* variables = aleaVariables(
            {
              a: 'randomInt(200,300)*10',
              b: this.sup2 ? 'randomInt(10,20)' : 'randomInt(100,200)/10',
              c: this.sup2 ? 'randomInt(5,15)' : 'randomInt(50,150)/10',
              x: 'randomInt(1000,a-500)',
              d: 'b*x+(a-x)*c',
              test: 'b>c'
            }
            , { valueOf: true })
          a = variables.a
          b = variables.b
          c = variables.c
          d = variables.d
          x = variables.x
          */
          do {
            b = this.sup2 ? randint(10, 20) : randint(100, 200) / 10
            c = this.sup2 ? randint(5, 15) : randint(50, 150) / 10
          } while (!(b > c))
          a = randint(200, 300) * 10
          x = randint(1000, a - 500)
          d = b * x + (a - x) * c

          equation = `x*${b}+(${a}-x)*${c}=${d}`
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: false })
          enonce = `Dans une salle de spectacle de $${texNombre(a)}$ places, le prix d'entrée pour un adulte est $${texPrix(b)}$ € et pour un enfant il est de $${texPrix(c)}$ €.<br>`
          enonce += `Le spectacle de ce soir s'est déroulé devant une salle pleine et la recette est de $${texPrix(d)}$ €.<br>`
          enonce += 'Combien d\'adultes y avait-il dans la salle ?'
          intro = 'Posons $x$ le nombre de places adultes vendues.<br>'
          intro += `Comme les $${texNombre(a)}$ places ont été vendues, le nombre de places enfants est : $${texNombre(a)}-x$.<br>`
          intro += 'Le calcul de la recette donne l\'équation suivante.<br>'
          conclusion = `<br>Il y a donc eu $${miseEnEvidence(texNombre(x))}$ adultes au spectacle.`
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers)
          break
        case 8: // isocele
          /* variables = aleaVariables(
            {
              a: 'randomInt(50,100)',
              c: '(1-2*round(randomInt(0,2)))*randomInt(10,30)',
              b: 'a+c',
              d: 'd=2*a+b',
              test: 'a+a>b and b>0'
            }
            , { valueOf: true })
          a = variables.a
          b = variables.b
          c = variables.c
          d = variables.d */
          do {
            a = randint(50, 100)
            c = (1 - 2 * randint(0, 2)) * randint(10, 30)
            b = a + c
          } while (!(a + a > b && b > 0))
          d = 2 * a + b

          enonce = `Un triangle isocèle a pour périmètre $${d}$ mm. `
          if (c > 0) { // La base est le plus grand côté
            enonce += `Sa base est plus grande que les côtés égaux de $${c}$ mm.`
          } else { // La base est plus petite que les autres côtés
            enonce += `Sa base est plus petite que les côtés égaux de $${-c}$ mm.`
          }
          if (choice([true, false])) {
            enonce += '<br>Quelle est la mesure de sa base ? (la figure n\'est pas en vraie grandeur)'
            intro = `Posons $x$ la longueur de sa base. La longueur des côtés égaux est : $x${ecritureAlgebrique(-c)}$.<br>`
            intro += 'Le calcul du périmètre donne l\'équation suivante :<br>'
            equation = `2*(x${ecritureAlgebrique(-c)})+x=${d}`
            conclusion = `<br>La base de ce triangle isocèle mesure donc $${miseEnEvidence(b)}$ mm.`
            x = b
          } else {
            enonce += '<br>Quelle est la mesure de ses côtés égaux ? (la figure n\'est pas en vraie grandeur)'
            intro = `Posons $x$ la longueur d'un des côtés égaux. La longueur de la base est : $x${ecritureAlgebrique(c)}$.<br>`
            intro += 'Le calcul du périmètre donne l\'équation suivante :<br>'
            equation = `2*x+x${ecritureAlgebrique(c)}=${d}`
            conclusion = `<br>Les deux côtés égaux de ce triangle isocèle mesurent donc $${miseEnEvidence(a)}$ mm.`
            x = a
          }
          resolution = resoudre(equation, { reduceSteps: true, substeps: false, comment: false, suppr1: false })
          if (c > 0) figure = this.triangleIsocele2()
          else figure = this.triangleIsocele1()
          verification = `<br>Vérification :<br>$${resolution.verifLeftSide.printExpression}=${resolution.verifLeftSide.printResult}$`
          texte = enonce + figure + ajouteChampTexteMathLive(this, i, 'largeur01 inline ' + KeyboardType.clavierNumbers, { texteApres: ' $cm$' })
          break
      }

      texteCorr = intro
      texteCorr += `$${resolution.equation.replace(/\b\d{4,}\b/g, (match) => { // Afin de mettre des espaces dans les grands nombres
        // Convertir le nombre en entier et appliquer texNombre
        const nombre = parseInt(match, 10)
        return texNombre(nombre)
      })}$`
      texteCorr += '<br><br>Résolvons l\'équation :<br>'
      texteCorr += resolution.texteCorr.replace(/\b\d{4,}\b/g, (match) => { // Afin de mettre des espaces dans les grands nombres
        // Convertir le nombre en entier et appliquer texNombre
        const nombre = parseInt(match, 10)
        return texNombre(nombre)
      })
      texteCorr += verification.replace(/\b\d{4,}\b/g, (match) => { // Afin de mettre des espaces dans les grands nombres
        // Convertir le nombre en entier et appliquer texNombre
        const nombre = parseInt(match, 10)
        return texNombre(nombre)
      })
      texteCorr += conclusion

      if (this.questionJamaisPosee(i, x, a, b, d)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        setReponse(this, i, x, { formatInteractif: 'calcul' })
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
