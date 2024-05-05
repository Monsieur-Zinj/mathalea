import { droite } from '../../lib/2d/droites.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { polyline } from '../../lib/2d/polygones.js'
import { repere } from '../../lib/2d/reperes.js'
import { texteParPoint } from '../../lib/2d/textes.ts'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { rangeMinMax } from '../../lib/outils/nombres'
import { pgcd, premierAvec } from '../../lib/outils/primalite'
import { texNombre } from '../../lib/outils/texNombre'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { contraindreValeur, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Fonctions linéaires'
export const interactifType = 'mathLive'
export const interactifReady = true
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '13/04/2023'
export const ref = '3F20'
export const refs = {
  'fr-fr': ['3F20'],
  'fr-ch': ['10FA5-12', '11FA8-6']
}
export const uuid = 'aeb5a'
/**
 * Questions sur les fonctions linéaires
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FonctionsLineaires () {
  Exercice.call(this)
  this.comment = `L'exercice propose différents types de questions sur les fonctions linéaires :<br>
calcul d'image, calcul d'antécédent ou détermination du coefficient.<br>
Ce coefficient peut être au choix entier relatif ou rationnel relatif.<br>
Certaines questions de calcul d'image nécessitent le calcul du coefficient au prélable.<br>
Le choix a été fait d'un antécédent primaire entier positif, le coefficient étant négatif avec une probabilité de 50%.<br>`
  this.sup = 1 // coefficient entier relatif
  this.nbQuestions = 8
  this.sup2 = '9'

  this.besoinFormulaireNumerique = ['Coefficient : ', 3, '1: Coefficient entier\n2: Coefficient rationnel\n3: Mélange']
  this.besoinFormulaire2Texte = ['Types de questions', 'Nombres séparés par des tirets :\n1: Image par expression\n2: Image par valeurs\n3: Image par graphique\n4: Antécédent par expression\n5: Antécédent par valeurs\n6: Antécédent par graphique\n7: Expression par valeurs\n8: Expression par graphique\n9: Mélange']

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = [
      'imageParExpression',
      'imageParValeurs',
      'imageParGraphique',
      'antecedentParExpression',
      'antecedentParValeurs',
      'antecedentParGraphique',
      'expressionParValeurs',
      'expressionParGraphique'
    ]
    const listeTypesDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 8,
      defaut: 9,
      nbQuestions: this.nbQuestions,
      listeOfCase: typesDeQuestionsDisponibles,
      melange: 9
    })
    this.sup = contraindreValeur(1, 3, this.sup, 1)
    const listeTypeDeCoeff = this.sup === 1
      ? combinaisonListes([1], this.nbQuestions)
      : this.sup === 2
        ? combinaisonListes([1], this.nbQuestions)
        : combinaisonListes([1, 2], this.nbQuestions)
    const antecedents = []
    for (let i = 0, texteAMC, valeurAMC, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const elementAmc = {}
      const nomFonction = String.fromCharCode(102 + i)
      let texte = ''
      let texteCorr = ''
      // valeur associée à image0 pour le calcul de coefficient : image0 = coefficient * antecedent0
      // on retrouve ces valeurs antecedent0 et image0 dans l'énoncé pour certaines questions.
      // ce sont antecedent et image qui seront à calculer.
      const antecedent0 = 2 * randint(2, 10) + 1
      let coefficient, image
      switch (listeTypeDeCoeff[i]) {
        case 1:
          coefficient = randint(2, 10) * choice([-1, 1])
          break
        case 2:
          coefficient = new FractionEtendue(premierAvec(antecedent0, antecedents, false) * choice([-1, 1]), antecedent0)
          break
      }
      let imageString, formatInteractif
      //
      const antecedent = choice(rangeMinMax(-10, 10, [antecedent0, 0, 1, -1, 2 * antecedent0]))
      const image0 = coefficient instanceof FractionEtendue ? coefficient.num : coefficient * antecedent0
      if (coefficient instanceof FractionEtendue) {
        image = coefficient.multiplieEntier(antecedent)
        imageString = image.texFSD
        formatInteractif = 'fractionEgale'
      } else {
        image = coefficient * antecedent
        imageString = texNombre(image, 0)
        formatInteractif = 'calcul'
      }
      antecedents.push(antecedent, antecedent0)
      const coefficientString = coefficient instanceof FractionEtendue ? coefficient.simplifie().texFSD : coefficient.toString()
      let xUnite, yUnite, xThickDistance, yThickDistance, xThickMin, yThickMin
      const tableauEchelleX = [[5, 1, 1], [10, 0.5, 2], [20, 0.25, 4], [50, 0.1, 10], [100, 0.05, 20]]
      const tableauEchelleY = [[5, 1, 1], [10, 0.5, 2], [20, 0.25, 4], [50, 0.1, 10], [100, 0.05, 20], [200, 0.025, 40], [500, 0.01, 100]]
      xUnite = tableauEchelleX[0][1]
      xThickDistance = tableauEchelleX[0][2]
      xThickMin = -tableauEchelleX[0][0] - xThickDistance
      for (let k = 1; Math.abs(antecedent0) > tableauEchelleX[k - 1][0]; k++) {
        xUnite = tableauEchelleX[k][1]
        xThickDistance = tableauEchelleX[k][2]
        xThickMin = -tableauEchelleX[k][0] - xThickDistance
      }
      yUnite = tableauEchelleY[0][1]
      yThickDistance = tableauEchelleY[0][2]
      yThickMin = -tableauEchelleY[0][0] - yThickDistance
      for (let k = 1; Math.abs(image0) > tableauEchelleY[k - 1][0]; k++) {
        yUnite = tableauEchelleY[k][1]
        yThickDistance = tableauEchelleY[k][2]
        yThickMin = -tableauEchelleY[k][0] - yThickDistance
      }
      const xMin = xThickMin
      const xMax = -xThickMin + xThickDistance
      const yMin = yThickMin
      const yMax = -yThickMin
      const xmin = xMin * xUnite
      const ymin = yMin * yUnite
      const xmax = xMax * xUnite + 0.5
      const ymax = yMax * yUnite + 0.5
      const r = repere({
        xUnite,
        yUnite,
        xMin,
        yMin,
        xMax,
        yMax,
        xThickDistance,
        yThickDistance,
        yLabelEcart: 0.8,
        grille: false
      })
      const origine = point(0, 0)
      const M = point(antecedent0 * xUnite, image0 * yUnite)
      const d = droite(origine, M)
      const t = tracePoint(M)
      const projeteX = point(M.x, 0)
      const projeteY = point(0, M.y)
      const pointilles = polyline([projeteY, M, projeteX], 'red')
      pointilles.pointilles = 2
      pointilles.epaisseur = 1
      const coordonnees = texteParPoint(`(${antecedent0};${image0})`, point(M.x + 0.2, M.y), 0, 'black', 1, 'droite')

      switch (listeTypesDeQuestions[i]) {
        // On détermine l'image à partir de l'expression générale de la fonction
        case 'imageParExpression':
          texte += `Soit $${nomFonction}(x)=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient)}x$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `$${nomFonction}(${texNombre(antecedent, 0)})=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}`
          texteCorr += `=${coefficient instanceof FractionEtendue ? image.texFSD : texNombre(image, 0)}$`
          if (context.isAmc) {
            texteAMC = `image de $${antecedent}$ par $${nomFonction}$`
            valeurAMC = image
          } else setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParValeurs':
          texte += `Soit $${nomFonction}$ la fonction linéaire telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax$ vérifie $a\\times ${antecedent0} = ${image0}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et par suite $${nomFonction}(x)=${coefficientString}x$.<br>`
          texteCorr += `Donc $${nomFonction}(${texNombre(antecedent, 0)})=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}`
          texteCorr += `=${coefficient instanceof FractionEtendue ? image.texFSD : texNombre(image, 0)}$.`
          if (context.isAmc) {
            texteAMC = `image de $${antecedent}$ par $${nomFonction}$`
            valeurAMC = image
          } else setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParGraphique':
          texte += `La droite représentant la fonction linéaire $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${image0}$ et $${nomFonction}(x)=ax$ on en déduit $a\\times ${antecedent0} = ${image0}$ soit $a=\\dfrac{${image0}}{${antecedent0}}${coefficient instanceof FractionEtendue ? '' : '=' + coefficientString}$.<br>`
          texteCorr += `Ainsi $${nomFonction}(${antecedent})=${coefficientString}\\times ${ecritureParentheseSiNegatif(antecedent)}=${imageString}$.`
          if (context.isAmc) {
            texteAMC = `image de $${antecedent}$ par $${nomFonction}$`
            valeurAMC = image
          } else setReponse(this, i, image, { formatInteractif })
          break
        case 'antecedentParExpression':
          texte += `Soit $${nomFonction}(x)=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient)}x$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $${nomFonction}(b)=${coefficientString}\\times b=${imageString}$.<br>`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `Donc $b=\\dfrac{${image.texFSD}}{${coefficientString}}=`
            texteCorr += `${image.texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$.`
          if (context.isAmc) {
            texteAMC = `antécédent de $${imageString}$ par $${nomFonction}$`
            valeurAMC = antecedent
          } else setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParValeurs':
          texte += `Soit $${nomFonction}$ la fonction linéaire telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax$ vérifie $a\\times ${antecedent0} = ${image0}$.<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$.<br>Posons $b$ l'antécédent de $${imageString}$, alors $${nomFonction}(b)=${coefficientString} \\times b=${imageString}$.<br>`
          texteCorr += `On en déduit que $b=\\dfrac{${imageString}}{${coefficientString}}=`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `${imageString}\\times ${coefficient.inverse().texFSP}=`
          }
          texteCorr += `${antecedent}$.`
          if (context.isAmc) {
            texteAMC = `antécédent de $${imageString}$ par $${nomFonction}$`
            valeurAMC = antecedent
          } else setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParGraphique':
          texte += `La droite représentant la fonction linéaire $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${image0}$ alors $${nomFonction}(x)=\\dfrac{${image0}}{${antecedent0}}x`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}x`
          }
          texteCorr += `$<br>Posons $b$ l'antécédent de $${imageString}$, alors $${nomFonction}(b)=${coefficientString}\\times b=${imageString}$.<br>`
          texteCorr += `On en déduit que $b=\\dfrac{${imageString}}{${coefficientString}}=`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `${imageString}\\times ${coefficient.inverse().texFSP}=`
          }
          texteCorr += `${antecedent}$.`
          if (context.isAmc) {
            texteAMC = `antécédent de $${imageString}$ par $${nomFonction}$`
            valeurAMC = antecedent
          } else setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'expressionParValeurs':
          texte += `Soit $${nomFonction}$ la fonction linéaire telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          if (context.isAmc) {
            texte += `Donner le coefficient de  $${nomFonction}$.`
          } else {
            texte += `Donner l'expression de  $${nomFonction}(x)$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          }
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax$ vérifie $a\\times ${antecedent0} = ${image0}$.<br>`
          texteCorr += `Soit $a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$.<br>Donc $${nomFonction}(x)=${coefficientString}x$.`
          if (context.isAmc) {
            texteAMC = `coefficient de $${nomFonction}$ : valeur de $a$ dans $${nomFonction}(x)=ax$`
            valeurAMC = coefficient
          } else {
            setReponse(this, i, [`${nomFonction}(x)=${coefficientString}x`, `${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
        case 'expressionParGraphique':
          texte += `La droite représentant la fonction linéaire $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$.<br>`
          if (context.isAmc) {
            texte += `Donner le coefficient de  $${nomFonction}$.`
          } else {
            texte += `Donner l'expression de  $${nomFonction}(x)$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          }
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax$ est :<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$.<br>Donc $${nomFonction}(x)=${coefficientString}x$.`
          if (context.isAmc) {
            texteAMC = `Coefficient de $${nomFonction}$ : valeur de $a$ dans $${nomFonction}(x)=ax$`
            valeurAMC = coefficient
          } else {
            setReponse(this, i, [`${nomFonction}(x)=${coefficientString}x`, `${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
      }
      const JCAMC = false // Si besoin de prendre en compte une info supplémentaire avant les cases à cocher dans AMC

      if (this.questionJamaisPosee(i, coefficient, antecedent0, image0)) {
        if (context.isAmc) {
          elementAmc.propositions = [
            {
              type: 'AMCNum',
              propositions: [{
                reponse: {
                  texte: JCAMC ? texteAMC : '',
                  valeur: valeurAMC,
                  param: {
                    signe: true,
                    digits: 2 // Ainsi, les réponses décimales auront toujours 2 digits et les réponses fractionnaires auront 2 digits pour le numérateur ET le dénominateur.
                  }
                }
              }
              ]
            }
          ]
          elementAmc.enonce = texte + (valeurAMC instanceof FractionEtendue ? ' On donnera la réponse sous forme d\'une fraction irréductible.' : '') + '\\\\'
          elementAmc.enonceAvant = false
          elementAmc.enonceApresNumQuestion = true
          elementAmc.propositions[0].propositions[0].texte = texteCorr
          elementAmc.options = { multicolsAll: true }
          this.autoCorrection[i] = elementAmc
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
