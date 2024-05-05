import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, rienSi1 } from '../../lib/outils/ecritures'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { contraindreValeur, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import FractionEtendue from '../../modules/FractionEtendue'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Calculer images (et antécédents) de fonctions'

/**
 * Répondre à des questions sur les fonctions.
 * Aout 2021
 * @author Jean-Claude Lhote
 */
export const uuid = 'ba520'
export const ref = '3F10-2'
export const refs = {
  'fr-fr': ['3F10-2'],
  'fr-ch': ['10FA5-6', '11FA8-2']
}
export default function CalculsImagesFonctions () {
  Exercice.call(this)
  this.sup = 2
  this.sup2 = 1
  this.sup3 = 1
  this.consigne = ''
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = false
  this.spacing = 2
  this.nbQuestions = 3
  this.nbQuestionsModifiable = true
  this.nouvelleVersion = function () {
    this.autoCorrection = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles
    this.sup = contraindreValeur(1, 5, this.sup, 1)
    this.sup2 = contraindreValeur(1, 3, this.sup2, 1)
    this.sup3 = contraindreValeur(1, 5, this.sup3, 1)
    switch (this.sup) {
      case 1:
        typesDeQuestionsDisponibles = ['linéaire']
        break
      case 2:
        typesDeQuestionsDisponibles = ['affine']
        break
      case 3:
        typesDeQuestionsDisponibles = ['polynôme']
        break
      case 4:
        typesDeQuestionsDisponibles = ['fraction']
        break
      case 5:
        typesDeQuestionsDisponibles = ['linéaire', 'affine', 'polynôme', 'fraction']
        break
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    let sousChoix
    if (this.sup2 === 1) { // Pour paramétrer plus finement le type de question
      if (this.sup3 < 3 || this.sup3 === 4) {
        sousChoix = combinaisonListes([0], this.nbQuestions)
      } else if (this.sup3 === 3) {
        sousChoix = combinaisonListes([1], this.nbQuestions)
      } else {
        sousChoix = combinaisonListes([0, 1], this.nbQuestions)
      }
    } else if (this.sup2 === 2) {
      if (this.sup3 < 3 || this.sup3 === 4) {
        sousChoix = combinaisonListes([2, 3], this.nbQuestions)
      } else if (this.sup3 === 3) {
        sousChoix = combinaisonListes([4], this.nbQuestions)
      } else {
        sousChoix = combinaisonListes([2, 3, 4], this.nbQuestions)
      }
    } else {
      if (this.sup3 < 3 || this.sup3 === 4) {
        sousChoix = combinaisonListes([0, 2, 3], this.nbQuestions)
      } else if (this.sup3 === 3) {
        sousChoix = combinaisonListes([1, 4], this.nbQuestions)
      } else {
        sousChoix = combinaisonListes([0, 1, 2, 3, 4], this.nbQuestions)
      }
    }
    for (let i = 0, texte, texteCorr, x, y, m, n, enonce, correction, reponses = [], tagImage, ant, img, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // on ne choisit que des nombres compris entre 1 et 20
      if (this.sup3 === 1) {
        x = randint(2, 9)
        y = randint(-9, 9, [x, 0])
        n = choice([2, 4, 5])
        m = randint(2, 6, [n, n * 2, n * 3])
      } else if (this.sup3 === 2) {
        x = randint(-9, 9, [0, 1, -1])
        y = randint(-9, 9, [x, 0])
        n = choice([2, 4, 5])
        m = randint(2, 6, [n, n * 2, n * 3])
      } else {
        if (this.sup3 === 3) {
          x = randint(2, 9)
        } else {
          x = randint(-9, 9, [0, 1, -1])
        }
        y = randint(-9, 9, [x, 0])
        n = choice([2, 4, 5])
        m = randint(2, 6, [n, n * 2, n * 3])
      }
      if (this.sup3 === 4) {
        x = -Math.abs(x)
      }
      tagImage = true
      switch (listeTypeDeQuestions[i]) {
        case 'linéaire':
          switch (sousChoix[i]) {
            case 0:
              enonce = `Soit $f: x \\longmapsto ${m}x$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=${m}x$ donc ici on a : $f(${x})=${m} \\times ${ecritureParentheseSiNegatif(x)}=${m * x}$`
              reponses[i] = m * x
              ant = x
              tagImage = true
              break
            case 1:
              enonce = `Soit $f$ la fonction définie par $f(x)=\\dfrac{${m}}{${n}}x$. ${sp(5)} Quelle est l'image de $${n * x}$ ?<br>`
              correction = `$f(x)=\\dfrac{${m}}{${n}}x$ donc ici on a : $f(${n * x})=\\dfrac{${m}}{${n}} \\times ${ecritureParentheseSiNegatif(n * x)}=\\dfrac{${m * x * n}}{${n}}=${m * x}$`
              ant = n * x
              tagImage = true
              reponses[i] = m * x
              break
            case 2:
              enonce = `Soit $f$ la fonction qui à $x$ associe $${m}x$. ${sp(5)} Quel est l'antécédent de $${m * x}$ ?<br>`
              correction = `$f(x)=${m}x$ donc ici on a : $${m}x=${m * x}$<br> soit $x=\\dfrac{${m * x}}{${m}}=${x}$`
              reponses[i] = x
              img = m * x
              tagImage = false
              break
            case 3:
              enonce = `Soit $f: x \\longmapsto ${-m}x$. ${sp(5)} Quel est l'antécédent de $${m * x}$ ?<br>`
              correction = `$f(x)=${-m}x$ donc ici on a : $${-m}x=${m * x}$<br> soit $x=\\dfrac{${-m * x}}{${m}}=${-x}$`
              img = m * x
              reponses[i] = -x
              tagImage = false
              break

            case 4:
              enonce = `Soit $f$ la fonction telle que $f(x)=\\dfrac{${m}}{${n}}x$. ${sp(5)} Quel est l'antécédent de $${m * x}$ ?<br>`
              correction = `$f(x)=\\dfrac{${m}}{${n}}x$ donc ici on a : $\\dfrac{${m}}{${n}}x=${m * x}$<br> soit $x=${m * x}\\times \\dfrac{${n}}{${m}}=${x * n}$`
              img = m * x
              reponses[i] = n * x
              tagImage = false
              break
          }
          setReponse(this, i, reponses[i])
          break
        case 'affine':
          switch (sousChoix[i]) {
            case 0:
              enonce = `Soit $f: x \\longmapsto ${m}x+${n}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=${m}x+${n}$ donc ici on a : $f(${x})=${m}\\times ${ecritureParentheseSiNegatif(x)}+${n}=${m * x}+${n}=${m * x + n}$`
              ant = x
              reponses[i] = m * x + n
              break
            case 1:
              enonce = `Soit $f$ la fonction définie par $f(x)=\\dfrac{${m}}{${n}}x${ecritureAlgebrique(y)}$. ${sp(5)} Quelle est l'image de $${n * x}$ ?<br>`
              correction = `$f(x)=\\dfrac{${m}}{${n}}x${ecritureAlgebrique(y)}$ donc ici on a : $f(${n * x})=\\dfrac{${m}}{${n}}\\times ${ecritureParentheseSiNegatif(n * x)}${ecritureAlgebrique(y)}=${m * x}${ecritureAlgebrique(y)}=${m * x + y}$`
              ant = n * x
              reponses[i] = m * x + y
              break
            case 2:
              enonce = `Soit $f$ la fonction qui à $x$ associe $${m}x+${n}$. ${sp(5)} Quel est l'antécédent de $${m * x + n}$ ?<br>`
              correction = `$f(x)=${m}x+${n}$ donc ici on a : $${m}x+${n}=${m * x + n}$ <br>Soit $${m}x=${m * x + n}-${n}=${m * x}$ d'où $x=\\dfrac{${m * x}}{${m}}=${x}$`
              img = m * x + n
              reponses[i] = x
              tagImage = false
              break
            case 3:
              enonce = `Soit $f: x \\longmapsto ${-m}x${ecritureAlgebrique(y)}$. ${sp(5)} Quel est l'antécédent de $${m * x + y}$ ?<br>`
              correction = `$f(x)=${-m}x${ecritureAlgebrique(y)}$ donc ici on a : $${-m}x${ecritureAlgebrique(y)}=${m * x + y}$ <br>Soit $x=\\dfrac{(${m * x + y}${ecritureAlgebrique(-y)})}{${-m}}=${-x}$`
              img = m * x + y
              reponses[i] = -x
              tagImage = false
              break
            case 4:
              enonce = `Soit $f$ la fonction telle que $f(x)=\\dfrac{${m}}{${n}}x${ecritureAlgebrique(y)}$. ${sp(5)} Quel est l'antécédent de $${m * x + y}$ ?<br>`
              correction = `$f(x)=\\dfrac{${m}}{${n}}x${ecritureAlgebrique(y)}$ donc ici on a : $\\dfrac{${m}}{${n}}x${ecritureAlgebrique(y)}=${m * x + y}$<br>Soit $x=(${m * x + y}${ecritureAlgebrique(-y)})\\times \\dfrac{${n}}{${m}}=${m * x}\\times \\dfrac{${n}}{${m}}=${n * x}$`
              img = m * x + y
              reponses[i] = n * x
              tagImage = false
              break
          }
          setReponse(this, i, reponses[i])
          break
        case 'polynôme':
          ant = x
          sousChoix[i] = randint(0, 4)
          switch (sousChoix[i]) {
            case 0:
              enonce = `Soit $f: x \\longmapsto x^2+${m}x+${n}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=x^2+${m}x+${n}$ donc ici on a : $f(${x})=${ecritureParentheseSiNegatif(x)}^2+${m}\\times ${ecritureParentheseSiNegatif(x)}+${n}=${x * x}${ecritureAlgebrique(m * x)}+${n}=${x ** 2 + m * x + n}$`
              reponses[i] = x ** 2 + m * x + n
              break

            case 1:
              enonce = `Soit $f(x)=x^2-${m}x+${n}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=x^2-${m}x+${n}$ donc ici on a : $f(${x})=${ecritureParentheseSiNegatif(x)}^2-${m}\\times ${ecritureParentheseSiNegatif(x)}+${n}=${x * x}${ecritureAlgebrique(-m * x)}+${n}=${x ** 2 - m * x + n}$`
              reponses[i] = x ** 2 - m * x + n
              break

            case 2:
              enonce = `Soit $f$ la fonction qui à $x$ associe $${m}x^2+${n}x$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=${m}x^2+${n}x$ donc ici on a : $f(${x})=${m}\\times${ecritureParentheseSiNegatif(x)}^2+${n}\\times ${ecritureParentheseSiNegatif(x)}=${m}\\times ${x * x}${ecritureAlgebrique(n * x)}=${m * x ** 2 + n * x}$`
              reponses[i] = m * x ** 2 + n * x
              break
            case 3:
              enonce = `Soit $f: x \\longmapsto ${m}x^2+${n}x${ecritureAlgebrique(y)}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=${m}x^2+${n}x${ecritureAlgebrique(y)}$ donc ici on a : $f(${x})=${m}\\times${ecritureParentheseSiNegatif(x)}^2+${n}\\times ${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(y)}=${m}\\times ${x * x}${ecritureAlgebrique(n * x)}${ecritureAlgebrique(y)}=${m * x ** 2 + n * x + y}$`
              reponses[i] = m * x ** 2 + n * x + y
              break
            case 4:
              enonce = `Soit $f(x)=${m}x^2-${n}x${ecritureAlgebrique(y)}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=${m}x^2-${n}x${ecritureAlgebrique(y)}$ donc ici on a : $f(${x})=${m}\\times${ecritureParentheseSiNegatif(x)}^2-${n}\\times ${ecritureParentheseSiNegatif(x)}${ecritureAlgebrique(y)}=${m}\\times ${x * x}${ecritureAlgebrique(-n * x)}${ecritureAlgebrique(y)}=${m * x ** 2 - n * x + y}$`
              reponses[i] = m * x ** 2 - n * x + y
              break
          }
          setReponse(this, i, reponses[i])
          break
        case 'fraction':
          ant = x
          switch (sousChoix[i] % 4) {
            case 0:
              if (n !== x) m = n - x // n différent de 0 donc m + x différent de zéro
              else m = n ** 2 - x // idem
              enonce = `Soit $f$ la fonction qui à $x$ associe $\\dfrac{x}{x${ecritureAlgebrique(m)}}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=\\dfrac{x}{x${ecritureAlgebrique(m)}}$ donc ici on a : $f(${x})=\\dfrac{${x}}{${x}${ecritureAlgebrique(m)}}=\\dfrac{${x}}{${x + m}}$`
              reponses[i] = new FractionEtendue(x, x + m)
              break
            case 1:
              if (n !== x) m = n - x // n différent de 0 donc m + x différent de zéro
              else m = n ** 2 - x
              enonce = `Soit $f$ telle que $f(x)=\\dfrac{${m}x}{x${ecritureAlgebrique(m)}}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=\\dfrac{${rienSi1(m)}x}{x${ecritureAlgebrique(m)}}$ donc ici on a : $f(${x})=\\dfrac{${m}\\times ${ecritureParentheseSiNegatif(x)}}{${x}${ecritureAlgebrique(m)}}=\\dfrac{${m * x}}{${x}${ecritureAlgebrique(m)}}=\\dfrac{${m * x}}{${x + m}}`
              reponses[i] = new FractionEtendue(m * x, x + m)
              correction += reponses[i].estEntiere ? `=${reponses[i].simplifie().texFraction}$` : '$'
              break
            case 2:
              if (n !== x) m = n - x // // n différent de 0 donc m + x différent de zéro et x différent de zéro
              else m = n ** 2 - x
              enonce = `Soit $f$ telle que $f(x)=\\dfrac{${m}x^2+${n}x}{x^2${ecritureAlgebrique(m)}x}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)=\\dfrac{${rienSi1(m)}x^2+${n}x}{x^2${ecritureAlgebrique(m)}x}$ donc ici on a : $f(${x})=\\dfrac{${m}\\times ${ecritureParentheseSiNegatif(x)}^2+${n}\\times ${ecritureParentheseSiNegatif(x)}}{${ecritureParentheseSiNegatif(x)}^2${ecritureAlgebrique(m)}\\times ${ecritureParentheseSiNegatif(x)}}=\\dfrac{${m * x ** 2}${ecritureAlgebrique(n * x)}}{${x ** 2}${ecritureAlgebrique(m * x)}}=\\dfrac{${m * x ** 2 + n * x}}{${x ** 2 + m * x}}=\\dfrac{${m * x + n}}{${x + m}}$`
              reponses[i] = new FractionEtendue(m * x ** 2 + n * x, x ** 2 + m * x)
              break
            case 3:
              if (n !== x && n !== 2 * x) m = n - x // x - m = 2x - n donc différent de zéro
              else if (n ** 2 !== 2 * x) m = n ** 2 - x // x-m = 2x - n**2 donc différent de zéro
              else m = n + x // x-m = n donc différent de zéro
              enonce = `Soit $f: x \\longmapsto \\dfrac{x${ecritureAlgebrique(-m)}}{x^2${ecritureAlgebrique(-2 * m)}x+${m * m}}$. ${sp(5)} Quelle est l'image de $${x}$ ?<br>`
              correction = `$f(x)= \\dfrac{x${ecritureAlgebrique(-m)}}{x^2${ecritureAlgebrique(-2 * m)}x+${m * m}}$`
              correction += `donc ici on a : $f(${x})= \\dfrac{${x}${ecritureAlgebrique(-m)}}{${ecritureParentheseSiNegatif(x)}^2${ecritureAlgebrique(-2 * m)}\\times ${ecritureParentheseSiNegatif(x)}+${m * m}}`
              correction += `=\\dfrac{${x - m}}{${x ** 2}${ecritureAlgebrique(-2 * m * x)}+${m * m}}=\\dfrac{${x - m}}{${x ** 2 - 2 * m * x + m * m}}`
              reponses[i] = new FractionEtendue(1, x - m)
              correction += `=${reponses[i].texFSD}$`

              break
          }
          setReponse(this, i, reponses[i], { formatInteractif: 'fractionEgale' })
          break
      }
      if (this.interactif) {
        if (tagImage) {
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: `$f(${ant})=$` })
        } else {
          texte = enonce + ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', {
            texteAvant: '$f($',
            texteApres: `$)=${img}$`
          })
        }
      } else {
        texte = enonce
      }

      if (tagImage) {
        texteCorr = correction + '<br>' + `$f(${ant})=${miseEnEvidence(reponses[i] instanceof FractionEtendue ? reponses[i].simplifie().texFSD : texNombre(reponses[i], 5))}$`
      } else {
        texteCorr = correction + '<br>' + `$f(${miseEnEvidence(reponses[i] instanceof FractionEtendue ? reponses[i].simplifie().texFSD : texNombre(reponses[i], 5))})=${img}$`
      }
      if (this.questionJamaisPosee(i, listeTypeDeQuestions[i], x, y, sousChoix[i])) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    let maxNbChiffresAvantLaVirgule = 0
    let maxNbDecimals = 0
    if (context.isAmc) {
      for (let i = 0; i < this.nbQuestions; i++) {
        maxNbChiffresAvantLaVirgule = Math.max(maxNbChiffresAvantLaVirgule, nombreDeChiffresDansLaPartieEntiere(this.autoCorrection[i].reponse.valeur[0]))
        maxNbDecimals = Math.max(maxNbDecimals, nombreDeChiffresDansLaPartieDecimale(this.autoCorrection[i].reponse.valeur[0]))
      }
      for (let i = 0; i < this.nbQuestions; i++) {
        this.autoCorrection[i].reponse.param.digits = maxNbChiffresAvantLaVirgule + maxNbDecimals
        this.autoCorrection[i].reponse.param.decimals = maxNbDecimals
        this.autoCorrection[i].reponse.param.signe = true
      }
    }
  }
  this.besoinFormulaireNumerique = [
    'Choix des questions',
    5,
    '1 : Fonction linéaire\n2 : Fonction affine \n3 : Polynome de degré 2 \n4 : Fonction rationnelle \n5 : Mélange'
  ]
  this.besoinFormulaire2Numerique = ['Image ou antécédent', 3, "1 : Calcul d'image\n2 : Calcul d'antécédent (uniquement pour linéaire et affine)\n3 : Mélange"]
  this.besoinFormulaire3Numerique = ['Niveau de difficulté', 5, '1 : Que des entiers positifs\n2 : Avec des entiers relatifs\n3 : Avec des fractions dans les coefficients (antécédents positifs)\n4 : Avec des antécédents tous négatifs (pas de fraction)\n5 : Mélange']
}
