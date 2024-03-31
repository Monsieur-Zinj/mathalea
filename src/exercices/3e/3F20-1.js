import { droite } from '../../lib/2d/droites.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { polyline } from '../../lib/2d/polygones.js'
import { repere } from '../../lib/2d/reperes.js'
import { texteParPoint } from '../../lib/2d/textes.ts'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { rangeMinMax } from '../../lib/outils/nombres'
import { pgcd, premierAvec } from '../../lib/outils/primalite'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { fraction } from '../../modules/fractions.js'
import { contraindreValeur, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Fonctions affines'
export const interactifType = 'mathLive'
export const interactifReady = true
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '08/05/2023'
export const ref = '3F20-1'
export const refs = {
  'fr-fr': ['3F20-1'],
  'fr-ch': ['10FA5-13', '11FA8-7']
}
export const uuid = '20d20'
/**
 * Questions sur les fonctions affines
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FonctionsAffines () {
  Exercice.call(this)
  this.comment = `L'exercice propose différents types de questions sur les fonctions affines comme son homologue 3F20 sur les fonctions affines :<br>
calcul d'image, calcul d'antécédent.<br>
Ce coefficient peut être au choix entier relatif ou rationnel relatif.<br>
Certaines questions de calcul d'image nécessitent des calculs préalables.<br>
Le choix a été fait d'un antécédent primaire entier positif, le coefficient étant négatif avec une probabilité de 50% ainsi que l'ordonnée à l'origine.<br>`
  this.sup = 1 // coefficient entier relatif
  this.nbQuestions = 8
  this.sup2 = this.lycee ? '11' : '9'
  this.spacingCorr = 3

  this.besoinFormulaireNumerique = ['Coefficient : ', 3, '1: Coefficient entier\n2: Coefficient rationnel\n3: Mélange']

  this.nouvelleVersion = function () {
    this.besoinFormulaire2Texte = this.lycee
      ? ['Types de questions', 'Nombres séparés par des tirets :\n1: Image par expression\n2: Image par valeurs\n3: Image par graphique\n4: Antécédent par expression\n5: Antécédent par valeurs\n6: Antécédent par graphique\n7: Expression par valeurs\n8: Expression par graphique\n9: Expression par graphique (formule des accroissements)\n10: Expression par valeurs (formule des accroissements)\n11: Mélange']
      : ['Types de questions', 'Nombres séparés par des tirets :\n1: Image par expression\n2: Image par valeurs\n3: Image par graphique\n4: Antécédent par expression\n5: Antécédent par valeurs\n6: Antécédent par graphique\n7: Expression par valeurs\n8: Expression par graphique\n9: Mélange']
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = this.lycee
      ? [
          'imageParExpression',
          'imageParValeurs',
          'imageParGraphique',
          'antecedentParExpression',
          'antecedentParValeurs',
          'antecedentParGraphique',
          'expressionParValeurs',
          'expressionParGraphique',
          'expressionParGraphique2',
          'expressionParValeurs2'
        ]
      : [
          'imageParExpression',
          'imageParValeurs',
          'imageParGraphique',
          'antecedentParExpression',
          'antecedentParValeurs',
          'antecedentParGraphique',
          'expressionParValeurs',
          'expressionParGraphique'
        ]
    const questionsDisponibles = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: this.lycee ? 10 : 8,
      defaut: this.lycee ? 11 : 9,
      nbQuestions: this.nbQuestions,
      listeOfCase: typesDeQuestionsDisponibles,
      melange: this.lycee ? 11 : 9
    })
    this.sup = contraindreValeur(1, 3, this.sup, 1)
    const listeTypeDeCoeff = this.sup === 1
      ? combinaisonListes([1], this.nbQuestions)
      : this.sup === 2
        ? combinaisonListes([1], this.nbQuestions)
        : combinaisonListes([1, 2], this.nbQuestions)
    const listeTypesDeQuestions = combinaisonListes(questionsDisponibles, this.nbQuestions)
    const antecedents = []
    for (let i = 0, texteAMC, valeurAMC, texte2AMC, valeur2AMC, texte3AMC, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      texte2AMC = ''
      texte3AMC = ''
      valeur2AMC = ''
      const elementAmc = {}
      const nomFonction = String.fromCharCode(102 + i)
      let texte = ''
      let texteCorr = ''
      // valeur associée à image0 pour le calcul de coefficient : image0 = coefficient * antecedent0
      // on retrouve ces valeurs antecedent0 et image0 dans l'énoncé pour certaines questions.
      // ce sont antecedent et image qui seront à calculer.
      const antecedent0 = 2 * randint(2, 5) + 1
      const ordonneeOrigine = randint(-10, 10, [0])
      let coefficient, image
      switch (listeTypeDeCoeff[i]) {
        case 1:
          coefficient = randint(2, 8) * choice([-1, 1])
          break
        case 2:
          coefficient = new FractionEtendue(premierAvec(antecedent0, antecedents, false) * choice([-1, 1]), antecedent0)
          break
      }
      const coeffRationnel = coefficient instanceof FractionEtendue
      let imageString, formatInteractif
      const antecedent = choice(rangeMinMax(-10, 10, [antecedent0, 0, 1, -1]))
      const image0 = ordonneeOrigine + (coeffRationnel ? coefficient.num : coefficient * antecedent0)
      if (coeffRationnel) {
        image = coefficient.multiplieEntier(antecedent).ajouteEntier(ordonneeOrigine)
        imageString = image.texFSD
        formatInteractif = 'fractionEgale'
      } else {
        image = ordonneeOrigine + coefficient * antecedent
        imageString = texNombre(image, 0)
        formatInteractif = 'calcul'
      }
      antecedents.push(antecedent, antecedent0)
      const coefficientString = coeffRationnel ? coefficient.simplifie().texFSD : coefficient.toString()
      let xUnite, yUnite, xThickDistance, yThickDistance, xThickMin, yThickMin
      const tableauEchelleX = [[5, 1, 1], [10, 0.5, 2], [20, 0.25, 4], [50, 0.1, 10], [100, 0.05, 20], [250, 0.02, 50], [500, 0.01, 100], [1000, 0.005, 200], [2000, 0.00025, 400]]
      const tableauEchelleY = [[5, 1, 1], [10, 0.5, 2], [20, 0.25, 4], [50, 0.1, 10], [100, 0.05, 20], [250, 0.02, 50], [500, 0.01, 100], [1000, 0.005, 200], [2000, 0.00025, 400]]
      xUnite = tableauEchelleX[0][1]
      xThickDistance = tableauEchelleX[0][2]
      xThickMin = -tableauEchelleX[0][0] - xThickDistance
      for (let k = 1; Math.abs(antecedent0) > tableauEchelleX[k - 1][0]; k++) {
        if (k >= tableauEchelleX.length) break
        xUnite = tableauEchelleX[k][1]
        xThickDistance = tableauEchelleX[k][2]
        xThickMin = -tableauEchelleX[k][0] - xThickDistance
      }
      yUnite = tableauEchelleY[0][1]
      yThickDistance = tableauEchelleY[0][2]
      yThickMin = -tableauEchelleY[0][0] - yThickDistance
      for (let k = 1; Math.max(Math.abs(image0), Math.abs(ordonneeOrigine)) > tableauEchelleY[k - 1][0]; k++) {
        if (k >= tableauEchelleY.length) break
        yUnite = tableauEchelleY[k][1]
        yThickDistance = tableauEchelleY[k][2]
        yThickMin = -tableauEchelleY[k][0] - yThickDistance
      }
      const xMin = xThickMin
      const xMax = -xThickMin + xThickDistance
      const yMin = yThickMin
      const yMax = -yThickMin
      const xmin = xMin * xUnite - 1
      const ymin = yMin * yUnite - 1
      const xmax = xMax * xUnite + 1
      const ymax = yMax * yUnite + 1
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
      const origine = point(0, ordonneeOrigine * yUnite)
      const M = point(antecedent0 * xUnite, image0 * yUnite)
      const d = droite(origine, M)
      const t = tracePoint(M)
      const projeteX = point(M.x, 0)
      const projeteY = point(0, M.y)
      const pointilles = polyline([projeteY, M, projeteX], 'red')
      pointilles.pointilles = 2
      pointilles.epaisseur = 1
      const coordonnees = texteParPoint(`(${antecedent0};${image0})`, point(M.x + 0.2, M.y), 0, 'black', 1, 'gauche')
      switch (listeTypesDeQuestions[i]) {
        // On détermine l'image à partir de l'expression générale de la fonction
        case 'imageParExpression':
          texte += `Soit $${nomFonction}(x)=${coeffRationnel ? coefficient.texFSD : texNombre(coefficient)}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `$${nomFonction}(${texNombre(antecedent, 0)})=${coeffRationnel ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coeffRationnel ? coefficient.multiplieEntier(antecedent).texFraction : texNombre(coefficient * antecedent, 0)}${coeffRationnel ? fraction(ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique : ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coeffRationnel ? image.texFSD : texNombre(image, 0)}$`
          if (context.isAmc) {
            texteAMC = `image de $${antecedent}$ par $${nomFonction}$`
            valeurAMC = image
          } else setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParValeurs':
          texte += `Soit $${nomFonction}$ la fonction affine telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$ et $${nomFonction}(0)=${ordonneeOrigine}$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $${nomFonction}(0)=${ordonneeOrigine}$, la fonction $${nomFonction}(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et par suite $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `$${nomFonction}(${texNombre(antecedent, 0)})=${coeffRationnel ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coeffRationnel ? coefficient.multiplieEntier(antecedent).texFraction : texNombre(coefficient * antecedent, 0)}${coeffRationnel ? fraction(ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique : ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coeffRationnel ? image.texFSD : texNombre(image, 0)}$`
          if (context.isAmc) {
            texteAMC = `image de $${antecedent}$ par $${nomFonction}$`
            valeurAMC = image
          } else setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParGraphique':
          texte += `La droite représentant la fonction affine $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$ et coupe l'axe des ordonnées en $(0;${ordonneeOrigine})$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)

          texteCorr += `Comme $${nomFonction}(0)=${ordonneeOrigine}$, la fonction $${nomFonction}(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et par suite $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `$${nomFonction}(${texNombre(antecedent, 0)})=${coeffRationnel ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coeffRationnel ? coefficient.multiplieEntier(antecedent).texFraction : texNombre(coefficient * antecedent, 0)}${coeffRationnel ? fraction(ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique : ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coeffRationnel ? image.texFSD : texNombre(image, 0)}$`
          if (context.isAmc) {
            texteAMC = `image de $${antecedent}$ par $${nomFonction}$`
            valeurAMC = image
          } else setReponse(this, i, image, { formatInteractif })
          break
        case 'antecedentParExpression':
          texte += `Soit $${nomFonction}(x)=${coeffRationnel ? coefficient.texFSD : texNombre(coefficient)}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $${nomFonction}(b)=${coefficientString}\\times b${ecritureAlgebrique(ordonneeOrigine)}=${imageString}$.<br>`
          texteCorr += `On en déduit $${coefficientString}b=${imageString}${ecritureAlgebrique(-ordonneeOrigine)}`
          if (coeffRationnel) {
            texteCorr += `=${imageString}${fraction(-ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique}`
          }
          texteCorr += `=${coeffRationnel ? image.ajouteEntier(-ordonneeOrigine).texFraction : image - ordonneeOrigine}$.<br>`
          if (coeffRationnel) {
            texteCorr += `Donc $b=\\dfrac{${image.ajouteEntier(-ordonneeOrigine).texFSD}}{${coefficientString}}=`
            texteCorr += `${image.ajouteEntier(-ordonneeOrigine).texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image - ordonneeOrigine, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          if (context.isAmc) {
            texteAMC = `antécédent de $${imageString}$ par $${nomFonction}$`
            valeurAMC = antecedent
          } else setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParValeurs':
          texte += `Soit $${nomFonction}$ la fonction affine telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$ et $${nomFonction}(0)=${ordonneeOrigine}$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $${nomFonction}(0)=${ordonneeOrigine}$, la fonction $${nomFonction}(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $${nomFonction}(b)=${coefficientString}\\times b${ecritureAlgebrique(ordonneeOrigine)}=${imageString}$.<br>`
          texteCorr += `On en déduit $${coefficientString}b=${imageString}${ecritureAlgebrique(-ordonneeOrigine)}`
          if (coeffRationnel) {
            texteCorr += `=${imageString}${fraction(-ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique}`
          }
          texteCorr += `=${coeffRationnel ? image.ajouteEntier(-ordonneeOrigine).texFraction : image - ordonneeOrigine}$.<br>`
          if (coeffRationnel) {
            texteCorr += `Donc $b=\\dfrac{${image.ajouteEntier(-ordonneeOrigine).texFSD}}{${coefficientString}}=`
            texteCorr += `${image.ajouteEntier(-ordonneeOrigine).texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image - ordonneeOrigine, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          if (context.isAmc) {
            texteAMC = `antécédent de $${imageString}$ par $${nomFonction}$`
            valeurAMC = antecedent
          } else setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParGraphique':
          texte += `La droite représentant la fonction affine $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$ et coupe l'axe des ordonnées en $(0;${ordonneeOrigine})$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $${nomFonction}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $${nomFonction}(0)=${ordonneeOrigine}$, la fonction $${nomFonction}(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $${nomFonction}(b)=${coefficientString}\\times b${ecritureAlgebrique(ordonneeOrigine)}=${imageString}$.<br>`
          texteCorr += `On en déduit $${coefficientString}b=${imageString}${ecritureAlgebrique(-ordonneeOrigine)}`
          if (coeffRationnel) {
            texteCorr += `=${imageString}${fraction(-ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique}`
          }
          texteCorr += `=${coeffRationnel ? image.ajouteEntier(-ordonneeOrigine).texFraction : image - ordonneeOrigine}$.<br>`
          if (coeffRationnel) {
            texteCorr += `Donc $b=\\dfrac{${image.ajouteEntier(-ordonneeOrigine).texFSD}}{${coefficientString}}=`
            texteCorr += `${image.ajouteEntier(-ordonneeOrigine).texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image - ordonneeOrigine, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          if (context.isAmc) {
            texteAMC = `antécédent de $${imageString}$ par $${nomFonction}$`
            valeurAMC = antecedent
          } else setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'expressionParValeurs':
          texte += `Soit $${nomFonction}$ la fonction affine telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$ et $${nomFonction}(0)=${ordonneeOrigine}$.<br>`
          texte += `Donner l'expression de  $${nomFonction}(x)$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $${nomFonction}(0)=${ordonneeOrigine}$, la fonction $${nomFonction}(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          if (context.isAmc) {
            texteAMC = `Valeur de $a$ dans $${nomFonction}(x)=ax+b$`
            valeurAMC = coefficient
            texte2AMC = `Valeur de $b$ dans $${nomFonction}(x)=ax+b$`
            valeur2AMC = ordonneeOrigine
            texte3AMC = 'Vos calculs et votre réponse<br>'
          } else setReponse(this, i, [`${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}`, `${coefficientString}${ecritureAlgebrique(ordonneeOrigine)}`, `${ordonneeOrigine}${coefficientString}x`, `${nomFonction}(x)=${ordonneeOrigine}${coefficientString}x`], { formatInteractif: 'calcul' })
          break
        case 'expressionParGraphique':
          texte += `La droite représentant la fonction affine $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$ et coupe l'axe des ordonnées en $(0;${ordonneeOrigine})$.<br>`
          texte += `Donner l'expression de  $${nomFonction}(x)$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $${nomFonction}(0)=${ordonneeOrigine}$, la fonction $${nomFonction}(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $${nomFonction}(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          if (context.isAmc) {
            texteAMC = `Valeur de $a$ dans $${nomFonction}(x)=ax+b$`
            valeurAMC = coefficient
            texte2AMC = `Valeur de $b$ dans $${nomFonction}(x)=ax+b$`
            valeur2AMC = ordonneeOrigine
            texte3AMC = 'Vos calculs et votre réponse<br>'
          } else {
            setReponse(this, i, [`${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}`, `${coefficientString}${ecritureAlgebrique(ordonneeOrigine)}`, `${ordonneeOrigine}${coefficientString}x`, `${nomFonction}(x)=${ordonneeOrigine}${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
        case 'expressionParGraphique2': {
          let coefficientString
          const denCoefficient = randint(2, 6)
          const numCoefficient = randint(-7, 7, 0)
          if (coeffRationnel) { // on redéfinit le coefficient et les images pour ce cas de figure
            coefficient = new FractionEtendue(numCoefficient, denCoefficient)
            coefficientString = coefficient.texFSD
          } else {
            coefficient = randint(-4, 4, 0)
            coefficientString = coefficient.toString()
          }
          const antecedent2 = randint(-4, 4, [-1, 0, 1]) * denCoefficient
          const antecedent0 = randint(Math.abs(antecedent2), 8, [-1, 0, 1]) * denCoefficient
          const ordonneeOrigine = randint(-10, 10, 0)
          const image2 = coeffRationnel ? coefficient.multiplieEntier(antecedent2).ajouteEntier(ordonneeOrigine) : coefficient * antecedent2 + ordonneeOrigine
          const image2String = coeffRationnel ? image2.texFraction : image2
          const image0 = coeffRationnel ? coefficient.multiplieEntier(antecedent0).ajouteEntier(ordonneeOrigine) : coefficient * antecedent0 + ordonneeOrigine
          xUnite = tableauEchelleX[0][1]
          xThickDistance = tableauEchelleX[0][2]
          xThickMin = -tableauEchelleX[0][0] - xThickDistance
          for (let k = 1; Math.abs(antecedent0) > tableauEchelleX[k - 1][0]; k++) {
            if (k >= tableauEchelleX.length) break
            xUnite = tableauEchelleX[k][1]
            xThickDistance = tableauEchelleX[k][2]
            xThickMin = -tableauEchelleX[k][0] - xThickDistance
          }
          yUnite = tableauEchelleY[0][1]
          yThickDistance = tableauEchelleY[0][2]
          yThickMin = -tableauEchelleY[0][0] - yThickDistance
          for (let k = 1; Math.max(Math.abs(image0), Math.abs(ordonneeOrigine)) > tableauEchelleY[k - 1][0]; k++) {
            if (k >= tableauEchelleY.length) break
            yUnite = tableauEchelleY[k][1]
            yThickDistance = tableauEchelleY[k][2]
            yThickMin = -tableauEchelleY[k][0] - yThickDistance
          }
          const xMin = xThickMin
          const xMax = -xThickMin + xThickDistance
          const yMin = yThickMin
          const yMax = -yThickMin
          const xmin = xMin * xUnite - 1
          const ymin = yMin * yUnite - 1
          const xmax = xMax * xUnite + 1
          const ymax = yMax * yUnite + 1
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
          const origine = point(0, ordonneeOrigine * yUnite)
          const M = point(antecedent0 * xUnite, image0 * yUnite)
          const d = droite(origine, M)
          const t = tracePoint(M)
          const projeteX = point(M.x, 0)
          const projeteY = point(0, M.y)
          const pointilles = polyline([projeteY, M, projeteX], 'red')
          pointilles.pointilles = 2
          pointilles.epaisseur = 1
          const coordonnees = texteParPoint(`(${antecedent0};${image0})`, point(M.x + 0.2, M.y), 0, 'black', 1, 'gauche')
          const N = point(antecedent2 * xUnite, coeffRationnel ? image2.valeurDecimale * yUnite : image2 * yUnite)
          const u = tracePoint(N)
          const projeteNX = point(N.x, 0)
          const projeteNY = point(0, N.y)
          const pointillesN = polyline([projeteNY, N, projeteNX], 'blue')
          pointilles.pointilles = 2
          pointilles.epaisseur = 1
          const positionCoord = antecedent2 < 0 ? N.x - 0.5 : N.x + 0.5
          const orientationCoord = antecedent2 < 0 ? 'droite' : 'gauche'
          const coordonneesN = coeffRationnel
            ? texteParPoint(`(${stringNombre(antecedent2)};${image2})`, point(positionCoord, N.y), 0, 'black', 1, orientationCoord)
            : texteParPoint(`(${antecedent2};${image2})`, point(positionCoord, N.y), 0, 'black', 1, orientationCoord)
          texte += `La droite représentant la fonction affine $${nomFonction}$ passe par le point de coordonnées $(${antecedent0};${image0})$ et par le point de coordonnées $(${stringNombre(antecedent2)};${image2})$.<br>`
          texte += `Donner l'expression de  $${nomFonction}(x)$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles, u, coordonneesN, pointillesN)
          texteCorr += `La fonction $${nomFonction}(x)=ax+b$ est telle que `
          if (antecedent2 - antecedent0 > 0) {
            texteCorr += `$a=\\dfrac{f(${stringNombre(antecedent2)})-f(${antecedent0})}{${stringNombre(antecedent2)}-${ecritureParentheseSiNegatif(antecedent0)}}=\\dfrac{${image2String}-${ecritureParentheseSiNegatif(image0)}}{${antecedent2 - antecedent0}}=\\dfrac{${image2 - image0}}{${antecedent2 - antecedent0}}=${coefficientString}$.<br>`
          } else {
            texteCorr += `$a=\\dfrac{f(${antecedent0})-f(${stringNombre(antecedent2)})}{${antecedent0}-${ecritureParentheseSiNegatif(antecedent2)}}=\\dfrac{${image0}-${ecritureParentheseSiNegatif(image2)}}{${antecedent0 - antecedent2}}=\\dfrac{${image0 - image2}}{${antecedent0 - antecedent2}}=${coefficientString}$.<br>`
          }
          texteCorr += `On en déduit que $${nomFonction}(x)=${coefficientString}x+b$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${image0}$, on a $${coefficientString}\\times ${ecritureParentheseSiNegatif(antecedent0)}+b=${image0}$ et par suite `
          texteCorr += coeffRationnel
            ? `$b=${image0}${coefficient.multiplieEntier(-1).ecritureAlgebrique}\\times ${ecritureParentheseSiNegatif(antecedent0)}=${ordonneeOrigine}$.<br>`
            : `$b=${image0}${ecritureAlgebrique(-coefficient)}\\times ${ecritureParentheseSiNegatif(antecedent0)}=${ordonneeOrigine}$.<br>`
          texteCorr += `D'où $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.`
          if (context.isAmc) {
            texteAMC = `Valeur de $a$ dans $${nomFonction}(x)=ax+b$`
            valeurAMC = coefficient
            texte2AMC = `Valeur de $b$ dans $${nomFonction}(x)=ax+b$`
            valeur2AMC = ordonneeOrigine
            texte3AMC = 'Vos calculs et votre réponse<br>'
          } else {
            setReponse(this, i, [`${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}`, `${coefficientString}${ecritureAlgebrique(ordonneeOrigine)}`, `${ordonneeOrigine}${coefficientString}x`, `${nomFonction}(x)=${ordonneeOrigine}${coefficientString}x`], { formatInteractif: 'calcul' })
          }
        }
          break
        case 'expressionParValeurs2': {
          texte += `Soit $${nomFonction}$ la fonction affine telle que $${nomFonction}(${antecedent0})=${texNombre(image0, 0)}$ et $${nomFonction}(${antecedent})=${imageString}$.<br>`
          texte += `Donner l'expression de  $${nomFonction}(x)$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `La fonction $${nomFonction}(x)=ax+b$ est telle que `
          if (antecedent - antecedent0 > 0) {
            if (coeffRationnel) {
              texteCorr += `$a=\\dfrac{f(${antecedent})-f(${antecedent0})}{${antecedent}-${ecritureParentheseSiNegatif(antecedent0)}}=\\dfrac{${imageString}-${ecritureParentheseSiNegatif(image0)}}{${antecedent - antecedent0}}=\\dfrac{${imageString}-${new FractionEtendue(image0 * image.den, image.den).ecritureParentheseSiNegatif}}{${antecedent - antecedent0}}=\\dfrac{${image.ajouteEntier(-image0).texFraction}}{${antecedent - antecedent0}}=${image.ajouteEntier(-image0).texFraction}\\times \\dfrac{1}{${antecedent - antecedent0}}=${coefficientString}$.<br>`
            } else {
              texteCorr += `$a=\\dfrac{f(${antecedent})-f(${antecedent0})}{${antecedent}-${ecritureParentheseSiNegatif(antecedent0)}}=\\dfrac{${imageString}-${ecritureParentheseSiNegatif(image0)}}{${antecedent - antecedent0}}=\\dfrac{${image - image0}}{${antecedent - antecedent0}}=${coefficientString}$.<br>`
            }
          } else {
            if (coeffRationnel) {
              texteCorr += `$a=\\dfrac{f(${antecedent0})-f(${antecedent})}{${antecedent0}-${ecritureParentheseSiNegatif(antecedent)}}=\\dfrac{${image0}-${image.ecritureParentheseSiNegatif}}{${antecedent0 - antecedent}}=\\dfrac{${new FractionEtendue(image0 * image.den, image.den).texFraction}-${image.ecritureParentheseSiNegatif}}{${antecedent0 - antecedent}}=\\dfrac{${image.multiplieEntier(-1).ajouteEntier(image0).texFraction}}{${antecedent0 - antecedent}}=${image.multiplieEntier(-1).ajouteEntier(image0).texFraction}\\times \\dfrac{1}{${antecedent0 - antecedent}}=${coefficientString}$.<br>`
            } else {
              texteCorr += `$a=\\dfrac{f(${antecedent0})-f(${antecedent})}{${antecedent0}-${ecritureParentheseSiNegatif(antecedent)}}=\\dfrac{${image0}-${ecritureParentheseSiNegatif(image)}}{${antecedent0 - antecedent}}=\\dfrac{${image0 - image}}{${antecedent0 - antecedent}}=${coefficientString}$.<br>`
            }
          }
          texteCorr += `On en déduit que $${nomFonction}(x)=${coefficientString}x+b$.<br>`
          texteCorr += `Comme $${nomFonction}(${antecedent0})=${image0}$, on a $${coefficientString}\\times ${ecritureParentheseSiNegatif(antecedent0)}+b=${image0}$ et par suite `
          texteCorr += coeffRationnel
            ? `$b=${image0}${coefficient.multiplieEntier(-1).ecritureAlgebrique}\\times ${ecritureParentheseSiNegatif(antecedent0)}=${ordonneeOrigine}$.<br>`
            : `$b=${image0}${ecritureAlgebrique(-coefficient)}\\times ${ecritureParentheseSiNegatif(antecedent0)}=${ordonneeOrigine}$.<br>`
          texteCorr += `D'où $${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$.`
          if (context.isAmc) {
            texteAMC = `Valeur de $a$ dans $${nomFonction}(x)=ax+b$`
            valeurAMC = coefficient
            texte2AMC = `Valeur de $b$ dans $${nomFonction}(x)=ax+b$`
            valeur2AMC = ordonneeOrigine
            texte3AMC = 'Vos calculs et votre réponse<br>'
          } else {
            setReponse(this, i, [`${nomFonction}(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}`, `${coefficientString}${ecritureAlgebrique(ordonneeOrigine)}`, `${ordonneeOrigine}${coefficientString}x`, `${nomFonction}(x)=${ordonneeOrigine}${coefficientString}x`], { formatInteractif: 'calcul' })
          }

          break
        }
      }

      const JCAMC = false || (texte2AMC !== '') // Si besoin de prendre en compte une info supplémentaire avant les cases à cocher dans AMC

      if (this.questionJamaisPosee(i, coefficient, antecedent0, image0) && Math.abs(image0) > 1) {
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
          if (texte2AMC !== '') {
            elementAmc.propositions.push(
              {
                type: 'AMCNum',
                propositions: [{
                  reponse: {
                    texte: texte2AMC,
                    valeur: valeur2AMC,
                    param: {
                      signe: true,
                      digits: 2 // Ainsi, les réponses décimales auront toujours 2 digits et les réponses fractionnaires auront 2 digits pour le numérateur ET le dénominateur.
                    }
                  }
                }
                ]
              },
              {
                type: 'AMCOpen',
                propositions: [
                  {
                    statut: 3,
                    enonce: texte3AMC
                  }
                ]
              }
            )
          }
          elementAmc.enonce = texte + '\\\\'
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
