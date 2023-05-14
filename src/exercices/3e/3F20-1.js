import { droite, point, polyline, repere, texteParPoint, tracePoint } from '../../modules/2d.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { fraction } from '../../modules/fractions.js'
import {
  choice,
  combinaisonListes,
  contraindreValeur, ecritureAlgebrique,
  ecritureParentheseSiNegatif,
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  pgcd,
  premierAvec,
  randint,
  texNombre
} from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Fonctions affines'
export const interactifType = 'mathLive'
export const interactifReady = true
// export const amcReady = true
// export const amcType = 'AMCNum'
export const dateDePublication = '08/05/2023'
export const ref = '3F20-1'
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
  this.sup2 = '9'
  this.spacingCorr = 3

  this.besoinFormulaireNumerique = ['Coefficient : ', 3, '1: Coefficient entier\n2: Coefficient rationnel\n3: Mélange']
  this.besoinFormulaire2Texte = ['Types de questions', 'Nombres séparés par des tirets :\n1: Image par expression\n2: Image par valeurs\n3: Image par graphique\n4: Antécédent par expression\n5: Antécédent par valeurs\n6: Antécédent par graphique\n7: Expression par valeurs\n8: Expression par graphique\n9: Mélange']

  this.nouvelleVersion = function (numeroExercice) {
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
    const questionsDisponibles = gestionnaireFormulaireTexte({ saisie: this.sup2, min: 1, max: 8, defaut: 9, shuffle: true, nbQuestions: this.nbQuestions, listeOfCase: typesDeQuestionsDisponibles, melange: 9 })
    const listeTypesDeQuestions = combinaisonListes(questionsDisponibles, this.nbQuestions)
    const antecedents = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.sup = contraindreValeur(1, 3, this.sup, 1)
      let texte = ''; let texteCorr = ''
      // valeur associée à image0 pour le calcul de coefficient : image0 = coefficient * antecedent0
      // on retrouve ces valeurs antecedent0 et image0 dans l'énoncé pour certaines questions.
      // ce sont antecedent et image qui seront à calculer.
      const antecedent0 = 2 * randint(2, 10) + 1
      const ordonneeOrigine = randint(-10, 10, [0])
      let coefficient, image
      switch (this.sup) {
        case 1:
          coefficient = premierAvec(antecedent0, antecedents, true) * choice([-1, 1])
          break
        case 2:
          coefficient = new FractionEtendue(premierAvec(antecedent0, antecedents, false) * choice([-1, 1]), antecedent0)
          break
        case 3:
          if (Math.random() < 0.5) {
            coefficient = premierAvec(antecedent0, antecedents, false) * choice([-1, 1])
          } else {
            coefficient = new FractionEtendue(premierAvec(antecedent0, antecedents, false) * choice([-1, 1]), antecedent0)
          }
          break
      }
      let imageString, formatInteractif
      const antecedent = premierAvec(antecedent0, antecedents, false) * choice([-1, 1])
      const image0 = ordonneeOrigine + (coefficient instanceof FractionEtendue ? coefficient.num : coefficient * antecedent0)
      if (coefficient instanceof FractionEtendue) {
        image = coefficient.multiplieEntier(antecedent).ajouteEntier(ordonneeOrigine)
        imageString = image.texFSD
        formatInteractif = 'fractionEgale'
      } else {
        image = ordonneeOrigine + coefficient * antecedent
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
      for (let k = 1; Math.max(Math.abs(image0), Math.abs(ordonneeOrigine)) > tableauEchelleY[k - 1][0]; k++) {
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
      const origine = point(0, ordonneeOrigine * yUnite)
      const M = point(antecedent0 * xUnite, image0 * yUnite)
      const d = droite(origine, M)
      const t = tracePoint(M)
      const projeteX = point(M.x, 0)
      const projeteY = point(0, M.y)
      const pointilles = polyline([projeteY, M, projeteX], 'red')
      pointilles.pointilles = 2
      pointilles.epaisseur = 1
      const coordonnees = texteParPoint(`(${antecedent0};${image0})`, point(M.x + 0.2, M.y), 'droite')
      console.log('coefficient : ', coefficient, ' ordonnée à l\'origine : ', ordonneeOrigine)
      switch (listeTypesDeQuestions[i]) {
        // On détermine l'image à partir de l'expression générale de la fonction
        case 'imageParExpression':
          texte += `Soit $f(x)=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient)}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `$f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coefficient instanceof FractionEtendue ? coefficient.multiplieEntier(antecedent).texFraction : texNombre(coefficient * antecedent, 0)}${coefficient instanceof FractionEtendue ? fraction(ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique : ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coefficient instanceof FractionEtendue ? image.texFSD : texNombre(image, 0)}$`
          setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParValeurs':
          texte += `Soit $f$ la fonction affine telle que $f(${antecedent0})=${texNombre(image0, 0)}$ et $f(0)=${ordonneeOrigine}$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $f(0)=${ordonneeOrigine}$, la fonction $f(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et par suite $f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coefficient instanceof FractionEtendue ? coefficient.multiplieEntier(antecedent).texFraction : texNombre(coefficient * antecedent, 0)}${coefficient instanceof FractionEtendue ? fraction(ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique : ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coefficient instanceof FractionEtendue ? image.texFSD : texNombre(image, 0)}$`
          setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParGraphique':
          texte += `La droite représentant la fonction affine $f$ passe par le point de coordonnées $(${antecedent0};${image0})$ et coupe l'axe des ordonnées en $(0;${ordonneeOrigine})$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)

          texteCorr += `Comme $f(0)=${ordonneeOrigine}$, la fonction $f(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et par suite $f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coefficient instanceof FractionEtendue ? coefficient.multiplieEntier(antecedent).texFraction : texNombre(coefficient * antecedent, 0)}${coefficient instanceof FractionEtendue ? fraction(ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique : ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `$\\phantom{f(${texNombre(antecedent, 0)})}=${coefficient instanceof FractionEtendue ? image.texFSD : texNombre(image, 0)}$`
          setReponse(this, i, image, { formatInteractif })
          break
        case 'antecedentParExpression':
          texte += `Soit $f(x)=${coefficient instanceof FractionEtendue ? coefficient.texFSD : texNombre(coefficient)}x${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $f(b)=${coefficientString}\\times b${ecritureAlgebrique(ordonneeOrigine)}=${imageString}$<br>`
          texteCorr += `On en déduit $${coefficientString}b=${imageString}${ecritureAlgebrique(-ordonneeOrigine)}`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `=${imageString}${fraction(-ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique}`
          }
          texteCorr += `=${coefficient instanceof FractionEtendue ? image.ajouteEntier(-ordonneeOrigine).texFraction : image - ordonneeOrigine}$<br>`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `Donc $b=\\dfrac{${image.ajouteEntier(-ordonneeOrigine).texFSD}}{${coefficientString}}=`
            texteCorr += `${image.ajouteEntier(-ordonneeOrigine).texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image - ordonneeOrigine, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParValeurs':
          texte += `Soit $f$ la fonction affine telle que $f(${antecedent0})=${texNombre(image0, 0)}$ et $f(0)=${ordonneeOrigine}$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $f(0)=${ordonneeOrigine}$, la fonction $f(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $f(b)=${coefficientString}\\times b${ecritureAlgebrique(ordonneeOrigine)}=${imageString}$<br>`
          texteCorr += `On en déduit $${coefficientString}b=${imageString}${ecritureAlgebrique(-ordonneeOrigine)}`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `=${imageString}${fraction(-ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique}`
          }
          texteCorr += `=${coefficient instanceof FractionEtendue ? image.ajouteEntier(-ordonneeOrigine).texFraction : image - ordonneeOrigine}$<br>`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `Donc $b=\\dfrac{${image.ajouteEntier(-ordonneeOrigine).texFSD}}{${coefficientString}}=`
            texteCorr += `${image.ajouteEntier(-ordonneeOrigine).texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image - ordonneeOrigine, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParGraphique':
          texte += `La droite représentant la fonction affine $f$ passe par le point de coordonnées $(${antecedent0};${image0})$ et coupe l'axe des ordonnées en $(0;${ordonneeOrigine})$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $f(0)=${ordonneeOrigine}$, la fonction $f(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          texteCorr += `Posons $b$ l'antécédent de $${imageString}$, alors $f(b)=${coefficientString}\\times b${ecritureAlgebrique(ordonneeOrigine)}=${imageString}$<br>`
          texteCorr += `On en déduit $${coefficientString}b=${imageString}${ecritureAlgebrique(-ordonneeOrigine)}`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `=${imageString}${fraction(-ordonneeOrigine * coefficient.den, coefficient.den).ecritureAlgebrique}`
          }
          texteCorr += `=${coefficient instanceof FractionEtendue ? image.ajouteEntier(-ordonneeOrigine).texFraction : image - ordonneeOrigine}$<br>`
          if (coefficient instanceof FractionEtendue) {
            texteCorr += `Donc $b=\\dfrac{${image.ajouteEntier(-ordonneeOrigine).texFSD}}{${coefficientString}}=`
            texteCorr += `${image.ajouteEntier(-ordonneeOrigine).texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $b=\\dfrac{${texNombre(image - ordonneeOrigine, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'expressionParValeurs':
          texte += `Soit $f$ la fonction affine telle que $f(${antecedent0})=${texNombre(image0, 0)}$ et $f(0)=${ordonneeOrigine}$.<br>`
          if (context.isAmc) {
            texte += 'Donner le coefficient de  $f$.'
          } else {
            texte += 'Donner l\'expression de  $f(x)$.' + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          }
          texteCorr += `Comme $f(0)=${ordonneeOrigine}$, la fonction $f(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          if (context.isAmc) {
            setReponse(this, i, coefficient, { formatInteractif: 'calcul' })
          } else {
            setReponse(this, i, [`f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}`, `${coefficientString}${ecritureAlgebrique(ordonneeOrigine)}`, `${ordonneeOrigine}${coefficientString}x`, `f(x)=${ordonneeOrigine}${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
        case 'expressionParGraphique':
          texte += `La droite représentant la fonction affine $f$ passe par le point de coordonnées $(${antecedent0};${image0})$ et coupe l'axe des ordonnées en $(0;${ordonneeOrigine})$.<br>`
          if (context.isAmc) {
            texte += 'Donner le coefficient de  $f$.'
          } else {
            texte += 'Donner l\'expression de  $f(x)$.' + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          }
          texte += '<br>'
          texte += mathalea2d({
            scale: 0.6,
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texteCorr += `Comme $f(0)=${ordonneeOrigine}$, la fonction $f(x)=ax+b$ vérifie $a\\times 0 + b = b = ${ordonneeOrigine}$ et par suite $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$.<br>`
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax${ecritureAlgebrique(ordonneeOrigine)}$ vérifie $a\\times ${antecedent0}${ecritureAlgebrique(ordonneeOrigine)} = ${image0}$ soit $${antecedent0}a=${image0 - ordonneeOrigine}$.<br>`
          texteCorr += `On en déduit $a=\\dfrac{${texNombre(image0 - ordonneeOrigine, 0)}}{${antecedent0}}`
          if (pgcd(image0 - ordonneeOrigine, antecedent0) !== 1) {
            const simplification = (new FractionEtendue(image0 - ordonneeOrigine, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$ et ainsi que $f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}$<br>`
          if (context.isAmc) {
            setReponse(this, i, coefficient, { formatInteractif: 'calcul' })
          } else {
            setReponse(this, i, [`f(x)=${coefficientString}x${ecritureAlgebrique(ordonneeOrigine)}`, `${coefficientString}${ecritureAlgebrique(ordonneeOrigine)}`, `${ordonneeOrigine}${coefficientString}x`, `f(x)=${ordonneeOrigine}${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
      }
      if (this.questionJamaisPosee(i, coefficient, antecedent0, image0) && Math.abs(image0) > 1) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
