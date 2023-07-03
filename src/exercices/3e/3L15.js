import { deprecatedTexFraction, texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../../lib/outils/ecritures.js'
import { pgcd } from '../../lib/outils/primalite.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, combinaisonListes, randint, choice, miseEnEvidence, sp } from '../../modules/outils.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
export const titre = 'Résoudre une équation du second degré se ramenant au premier degré'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '21/06/2023' // EE : Rajout d'un paramètre, correction de coquilles, création interactivité et meilleure conclusion des corrections
/**
 *
 * Résoudre une équation du type (ax)2 - b2 = 0
 *
 * Résoudre une équation du type ax2 + bx = 0
 *
 * @author Rémi Angot
 * Référence 3L15
*/
export const uuid = '231d2'
export const ref = '3L15'
export default function ExerciceEquations () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = 'Résoudre ' + (this.nbQuestions !== 1 ? 'les équations suivantes' : 'l\'équation suivante') + '.'
  this.nbQuestions = 6
  this.nbCols = 2
  this.nbColsCorr = 1
  this.sup = 4
  this.sup2 = true
  this.spacingCorr = 3
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url
  this.comment = 'Dans le niveau plus facile, l\'énoncé contient un maximum d\'entiers positifs. <br>'
  this.comment += 'Dans le niveau moins facile, l\'énoncé contient aléatoirement des entiers positifs ou négatifs. <br>'

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let typeQuestionsDisponibles = []
    switch (this.sup) {
      case 1 :
        typeQuestionsDisponibles = ['ax2+bx', 'ax2+bxAvec1']
        break
      case 2 :
        typeQuestionsDisponibles = ['ax2-b2', 'ax2=b2']
        break
      case 3 :
        typeQuestionsDisponibles = ['bcx2+a=bx(cx+d)', 'bcx2+a=bx(cx+d)', '(ax+b)(cx+d)=acx2']
        break
      case 4 :
        typeQuestionsDisponibles = ['ax2+bx', 'ax2+bxAvec1', 'bcx2+a=bx(cx+d)', 'ax2-b2', 'ax2=b2', '(ax+b)(cx+d)=acx2']
    }
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, indiceQ = 0, fracReponse, a, b, c, d, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'ax2+bx':
          a = this.sup2 ? randint(2, 9) : randint(-9, 9, [0, -1, 1]) // Le cas 1 (ou -1) est traité ensuite
          b = this.sup2 ? randint(2, 9) : randint(-9, 9, [0, -1, 1])
          texte = ax2plusbx(a, b)[0]
          texteCorr = ax2plusbx(a, b)[1]
          fracReponse = new FractionEtendue(-b, a)
          setReponse(this, fracReponse.signe === -1 ? indiceQ : indiceQ + 1, fracReponse, { formatInteractif: 'fractionEgale' })
          setReponse(this, fracReponse.signe === 1 ? indiceQ : indiceQ + 1, 0)
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus petite : ` })
          texte += ajouteChampTexteMathLive(this, indiceQ + 1, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus grande : ` })
          indiceQ += 2
          break
        case 'ax2+bxAvec1':
          if (this.sup2) {
            if (randint(1, 2) === 1) {
              a = 1
              b = randint(2, 9)
            } else {
              b = 1
              a = randint(2, 9)
            }
          } else {
            if (randint(1, 2) === 1) {
              a = choice([-1, 1])
              b = randint(-9, 9, [-1, 0, 1])
            } else {
              b = choice([-1, 1])
              a = randint(-9, 9, [-1, 0, 1])
            }
          }
          texte = ax2plusbx(a, b)[0]
          texteCorr = ax2plusbx(a, b)[1]
          fracReponse = new FractionEtendue(-b, a)
          setReponse(this, fracReponse.signe === -1 ? indiceQ : indiceQ + 1, fracReponse, { formatInteractif: 'fractionEgale' })
          setReponse(this, fracReponse.signe === 1 ? indiceQ : indiceQ + 1, 0)
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus petite : ` })
          texte += ajouteChampTexteMathLive(this, indiceQ + 1, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus grande : ` })
          indiceQ += 2
          break
        case 'ax2-b2':
          a = randint(1, 10)
          b = randint(1, 10)
          texte = this.sup2 ? `$ ${rienSi1(a ** 2)}x^2 - ${b ** 2} = 0 $ ` : choice([`$ -${rienSi1(a ** 2)}x^2 + ${b ** 2} = 0 $ `, `$ ${rienSi1(a ** 2)}x^2 - ${b ** 2} = 0 $ `])
          texteCorr = `$ ${rienSi1(a ** 2)}x^2 - ${b ** 2} = 0 $ `
          texteCorr += '<br>'
          texteCorr += a !== 1 ? `$ (${a}x)^2 - ${b}^2 = 0 $ ` : `$ x^2 - ${b}^2 = 0 $ `
          texteCorr += '<br>'
          texteCorr += `$ (${rienSi1(a)}x+${b})(${rienSi1(a)}x-${b}) = 0 $ `
          texteCorr += '<br>'
          texteCorr += `$${rienSi1(a)}x+${b} = 0 \\quad \\text{ou} \\quad ${rienSi1(a)}x-${b} = 0$ `
          texteCorr += '<br>'
          texteCorr += `$${rienSi1(a)}x = ${-b} \\quad \\text{ou} \\quad ${rienSi1(a)}x = ${b}$ `
          if (a !== 1) {
            texteCorr += '<br>'
            if (pgcd(a, b) === 1) {
              texteCorr += `$x = ${deprecatedTexFraction(-b, a)} \\quad \\text{ou} \\quad x = ${deprecatedTexFraction(b, a)}$ `
            } else {
              texteCorr += `$x = ${deprecatedTexFraction(-b, a)}=${texFractionReduite(-b, a)} \\quad \\text{ou} \\quad x = ${deprecatedTexFraction(b, a)}=${texFractionReduite(b, a)}$ `
            }
          }
          texteCorr += `<br>Les solutions de l'équation sont : $${miseEnEvidence(texFractionReduite(-b, a))}$ et $${miseEnEvidence(texFractionReduite(b, a))}$.`
          fracReponse = new FractionEtendue(-b, a)
          setReponse(this, fracReponse.signe === -1 ? indiceQ : indiceQ + 1, fracReponse, { formatInteractif: 'fractionEgale' })
          setReponse(this, fracReponse.signe !== -1 ? indiceQ : indiceQ + 1, new FractionEtendue(b, a), { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus petite : ` })
          texte += ajouteChampTexteMathLive(this, indiceQ + 1, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus grande : ` })
          indiceQ += 2
          break
        case 'ax2=b2':
          a = randint(1, 10)
          b = randint(1, 10)
          texte = this.sup2 ? `$ ${rienSi1(a ** 2)}x^2 = ${b ** 2}$ ` : choice([`$ -${rienSi1(a ** 2)}x^2 = -${b ** 2}$ `, `$ ${rienSi1(a ** 2)}x^2 = ${b ** 2}$ `])
          texteCorr = `$ ${rienSi1(a ** 2)}x^2 = ${b ** 2}$ `
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a ** 2)}x^2 - ${b ** 2} = 0 $ `
          texteCorr += '<br>'
          texteCorr += a !== 1 ? `$ (${a}x)^2 - ${b}^2 = 0 $ ` : `$ x^2 - ${b}^2 = 0 $ `
          texteCorr += '<br>'
          texteCorr += `$ (${rienSi1(a)}x+${b})(${rienSi1(a)}x-${b}) = 0 $ `
          texteCorr += '<br>'
          texteCorr += `$${rienSi1(a)}x+${b} = 0 \\quad \\text{ou} \\quad ${rienSi1(a)}x-${b} = 0$ `
          texteCorr += '<br>'
          texteCorr += `$${rienSi1(a)}x = ${-b} \\quad \\text{ou} \\quad ${rienSi1(a)}x = ${b}$ `
          if (a !== 1) {
            texteCorr += '<br>'
            if (pgcd(a, b) === 1) {
              texteCorr += `$x = ${deprecatedTexFraction(-b, a)} \\quad \\text{ou} \\quad x = ${deprecatedTexFraction(b, a)}$ `
            } else {
              texteCorr += `$x = ${deprecatedTexFraction(-b, a)}=${texFractionReduite(-b, a)} \\quad \\text{ou} \\quad x = ${deprecatedTexFraction(b, a)}=${texFractionReduite(b, a)}$ `
            }
          }
          texteCorr += `<br>Les solutions de l'équation sont : $${miseEnEvidence(texFractionReduite(-b, a))}$ et $${miseEnEvidence(texFractionReduite(b, a))}$.`
          fracReponse = new FractionEtendue(-b, a)
          setReponse(this, fracReponse.signe === -1 ? indiceQ : indiceQ + 1, fracReponse, { formatInteractif: 'fractionEgale' })
          setReponse(this, fracReponse.signe !== -1 ? indiceQ : indiceQ + 1, new FractionEtendue(b, a), { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus petite : ` })
          texte += ajouteChampTexteMathLive(this, indiceQ + 1, 'largeur15 inline', { texte: `<br>${sp(5)} Solution la plus grande : ` })
          indiceQ += 2
          break
        case 'bcx2+a=bx(cx+d)':
          a = this.sup2 ? randint(1, 10) : randint(-10, 10, [0])
          b = this.sup2 ? randint(1, 10) : randint(-10, 10, [0])
          c = this.sup2 ? randint(1, 10) : randint(-10, 10, [0])
          d = this.sup2 ? randint(1, 10) : randint(-10, 10, [0])
          if (randint(1, 2) === 1) {
            texte = `$ ${rienSi1(b * c)}x^2 ${ecritureAlgebrique(a)} = ${rienSi1(b)}x(${rienSi1(c)}x ${ecritureAlgebrique(d)}) $`
            texteCorr = `$ ${rienSi1(b * c)}x^2 ${ecritureAlgebrique(a)} = ${rienSi1(b)}x(${rienSi1(c)}x ${ecritureAlgebrique(d)}) $`
            texteCorr += '<br>'
            texteCorr += `$ ${rienSi1(b * c)}x^2 ${ecritureAlgebrique(a)} = ${rienSi1(b * c)}x^2 ${ecritureAlgebriqueSauf1(d * b)}x $`
            texteCorr += '<br>'
            texteCorr += `$ ${a} = ${rienSi1(d * b)}x $`
            if (d * b !== 1) texteCorr += `<br>$ ${deprecatedTexFraction(a, d * b)} = x $`
            if ((a < 0 && d * b < 0) || pgcd(a, d * b) !== 1) {
              texteCorr += '<br>'
              texteCorr += ` $ ${texFractionReduite(a, d * b)} = x $`
            }
          } else {
            texte = `$ ${rienSi1(b)}x(${rienSi1(c)}x ${ecritureAlgebrique(d)}) = ${rienSi1(b * c)}x^2 ${ecritureAlgebrique(a)} $`
            texteCorr = `$  ${rienSi1(b)}x(${rienSi1(c)}x ${ecritureAlgebrique(d)}) = ${rienSi1(b * c)}x^2 ${ecritureAlgebrique(a)} $`
            texteCorr += '<br>'
            texteCorr += `$ ${rienSi1(b * c)}x^2 ${ecritureAlgebriqueSauf1(b * d)}x = ${rienSi1(b * c)}x^2 ${ecritureAlgebrique(a)}$`
            texteCorr += '<br>'
            texteCorr += `$ ${rienSi1(b * d)}x = ${a} $`
            if (d * b !== 1) texteCorr += `<br>$ x = ${deprecatedTexFraction(a, d * b)}$`
            if ((a < 0 && b * d < 0) || pgcd(a, b * d) !== 1) {
              texteCorr += '<br>'
              texteCorr += ` $ x = ${texFractionReduite(a, b * d)} $`
            }
          }
          texteCorr += `<br>La solution de l'équation est : $${miseEnEvidence(texFractionReduite(a, b * d))}$.`
          fracReponse = new FractionEtendue(a, b * d)
          setReponse(this, indiceQ, fracReponse, { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution : ` })
          indiceQ += 1
          break
        case '(ax+b)2=0':
          a = this.sup2 ? randint(1, 5) : randint(-5, 5, [0])
          b = this.sup2 ? randint(1, 5) : randint(-5, 5, [0])
          texte = `$ (${rienSi1(a)}x ${ecritureAlgebrique(b)})^2 = 0 $`
          texteCorr = `$ (${rienSi1(a)}x ${ecritureAlgebrique(b)})^2 = 0 $`
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a)}x ${ecritureAlgebrique(b)} = 0$`
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a)}x = ${-b} $`
          if (a !== 1) texteCorr += `<br>$ x = ${deprecatedTexFraction(-b, a)}$`
          if ((-b < 0 && a < 0) || pgcd(a, b) !== 1) {
            texteCorr += '<br>'
            texteCorr += ` $ x = ${texFractionReduite(-b, a)} $`
          }
          texteCorr += `<br>La solution de l'équation est : $${miseEnEvidence(texFractionReduite(-b, a))}$.`
          fracReponse = new FractionEtendue(-b, a)
          setReponse(this, indiceQ, fracReponse, { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution : ` })
          indiceQ += 1
          break
        case '(ax+b)(cx+d)=acx2':
          a = this.sup2 ? randint(1, 5) : randint(-5, 5, [0])
          b = this.sup2 ? randint(1, 5) : randint(-5, 5, [0])
          c = this.sup2 ? randint(1, 5) : randint(-5, 5, [0])
          d = this.sup2 ? randint(1, 5) : randint(-5, 5, [0])
          texte = `$ (${rienSi1(a)}x ${ecritureAlgebrique(b)})(${rienSi1(c)}x ${ecritureAlgebrique(d)}) = ${rienSi1(a * c)}x^2 $`
          texteCorr = `$ (${rienSi1(a)}x ${ecritureAlgebrique(b)})(${rienSi1(c)}x ${ecritureAlgebrique(d)}) = ${rienSi1(a * c)}x^2 $`
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a * c)}x^2 ${ecritureAlgebriqueSauf1(a * d)}x ${ecritureAlgebriqueSauf1(b * c)}x ${ecritureAlgebrique(b * d)} = ${rienSi1(a * c)}x^2 $`
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a * c)}x^2 ${ecritureAlgebriqueSauf1(a * d + b * c)}x ${ecritureAlgebrique(b * d)} = ${rienSi1(a * c)}x^2 $`
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a * d + b * c)}x ${ecritureAlgebrique(b * d)} = 0 $`
          texteCorr += '<br>'
          texteCorr += `$ ${rienSi1(a * d + b * c)}x = ${-b * d}$ `
          texteCorr += '<br>'
          texteCorr += `$ x = ${deprecatedTexFraction(-b * d, a * d + b * c)}$`
          if ((-b * d < 0 && a * d + b * c < 0) || pgcd(-b * d, a * d + b * c) !== 1) {
            texteCorr += '<br>'
            texteCorr += `$ x = ${texFractionReduite(-b * d, a * d + b * c)}$`
          }
          texteCorr += `<br>La solution de l'équation est : $${miseEnEvidence(texFractionReduite(-b * d, a * d + b * c))}$.`
          fracReponse = new FractionEtendue(-b * d, a * d + b * c)
          setReponse(this, indiceQ, fracReponse, { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, indiceQ, 'largeur15 inline', { texte: `<br>${sp(5)} Solution : ` })
          indiceQ += 1
          break
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ["Type d'équations", 4, "1 : Factoriser avec x en facteur commun\n2 : Factoriser avec l'identité remarquable\n3 : Développer et réduire\n4 : Mélange"]
  this.besoinFormulaire2CaseACocher = ['Niveau plus facile']
}

function ax2plusbx (a, b) {
  const texte = `$ ${rienSi1(a)} x^2 ${ecritureAlgebriqueSauf1(b)} x=0$`
  let texteCorr = `$ ${rienSi1(a)} x^2 ${ecritureAlgebriqueSauf1(b)} x=0$`
  texteCorr += '<br>'
  texteCorr += `$x(${rienSi1(a)} x ${ecritureAlgebrique(b)})=0$`
  texteCorr += '<br>'
  texteCorr += `$ x = 0 \\text{ \\quad ou \\quad } ${rienSi1(a)} x ${ecritureAlgebrique(b)} = 0 $ `
  texteCorr += '<br>'
  texteCorr += `$ \\phantom{x = 0 \\text{ \\quad ou \\quad }} ${rienSi1(a)} x = ${-b} $ `
  texteCorr += '<br>'
  texteCorr += `$ \\phantom{x = 0 \\text{ \\quad ou \\quad }}  x = ${deprecatedTexFraction(-b, a)} `
  if ((b > 0 && a < 0) || pgcd(a, b) !== 1) {
    texteCorr += ` = ${texFractionReduite(-b, a)} `
  }
  texteCorr += '$'
  texteCorr += `<br>Les solutions de l'équation sont : $${miseEnEvidence(0)}$ et $${miseEnEvidence(texFractionReduite(-b, a))}$.`
  return [texte, texteCorr]
}
