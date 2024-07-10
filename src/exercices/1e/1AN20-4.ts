import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'
import {
  ecritureAlgebrique,
  reduireAxPlusB,
  reduirePolynomeDegre3
} from '../../lib/outils/ecritures'
import FractionEtendue from '../../modules/FractionEtendue'
import { tableauVariationsFonction } from '../../lib/mathFonctions/etudeFonction'
import Trinome from '../../modules/Trinome'
export const titre = 'Étudier le sens de variations d\'une fonction polynôme du troisième degré'
export const dateDePublication = '08/07/2024'
export const interactifReady = false
export const uuid = 'e1890'
export const refs = {
  'fr-fr': ['1AN20-4'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice
 * @author Gilles Mora
*/

export default class EtudeFctPoly3 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 : Dérivée avec des racines entières\n2 : Dérivée sans racine\n3: Mélange']
    this.sup = '3'
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const listeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 2,
      melange: 3,
      defaut: 3,
      nbQuestions: this.nbQuestions

    })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let fonction // La fonction étudiée
      let derivee // Sa dérivée
      let xMin // La borne gauche de l'intervalle d'étude (prévoir une valeur de remplacement pour les infinis + et -)
      let xMax // La borne droite de l'intervalle d'étude
      let substituts = [] // les valeur de substitution pour xMin ou xMax...
      let tolerance // la tolérance doit être réglée au cas par cas, car pour la dérivée de 1/x entre 17 et 19 par exemple, il y a trop peu de différence avec zéro !
      switch (listeDeQuestions[i]) {
        case 1://
          {
            const a = randint(-2, 2, 0)
            const x1 = randint(-3, 3)
            const x2 = randint(-5, 5, x1)
            const k = randint(-3, 3)
            const p = new Trinome(6 * a, -6 * a * (x1 + x2), 6 * a * x1 * x2)
            fonction = x => 2 * a * x ** 3 - 3 * a * x1 * x ** 2 - 3 * a * x2 * x ** 2 + 6 * a * x1 * x2 * x + k
            derivee = x => 6 * a * x ** 2 - 6 * a * x1 * x - 6 * a * x2 * x + 6 * a * x1 * x2
            tolerance = 0.005
            xMin = -10
            xMax = 10
            substituts = [{ antVal: -10, antTex: '$-\\infty$', imgVal: 2 * a * (-10) ** 3 - 3 * a * x1 * (-10) ** 2 - 3 * a * x2 * (-10) ** 2 + 6 * a * x1 * x2 * (-10) + k, imgTex: '' }, { antVal: 10, antTex: '$+\\infty$', imgVal: 2 * a * 10 ** 3 - 3 * a * x1 * 10 ** 2 - 3 * a * x2 * 10 ** 2 + 6 * a * x1 * x2 * 10 + k, imgTex: '' }]
            const tableau = tableauVariationsFonction(fonction, derivee, xMin, xMax, { ligneDerivee: true, substituts, step: 1, tolerance })

            texte = `On considère la fonction $f$ définie sur $\\mathbb{R}$ par : $f(x)=${reduirePolynomeDegre3(2 * a, -3 * a * x1 - 3 * a * x2, 6 * a * x1 * x2, k)}$.<br>
      Étudier le sens de variations de la fonction $f$ sur $\\mathbb{R}$.
      `

            texteCorr += `$f$ est une fonction polynôme du troisième degré, dérivable sur $\\mathbb{R}$.<br>
            Pour tout  $x\\in\\mathbb{R}$, $f'(x)=${reduirePolynomeDegre3(0, 6 * a, -6 * a * (x1 + x2), 6 * a * x1 * x2)}$.<br><br>
            $f'(x)$ est une fonction polynôme du second degré. <br>`
            if (6 * a * x1 * x2 === 0 || -6 * a * (x1 + x2) === 0) {
              if (6 * a * x1 * x2 === 0) {
                texteCorr += `En factorisant par $x$, on obtient $f'(x)=x(${reduireAxPlusB(6 * a, -6 * a * (x1 + x2))})$.<br>
       Les racines de $f'(x)$ sont les solutions de l'équation produit-nul :  $x(${reduireAxPlusB(6 * a, -6 * a * (x1 + x2))})=0$.<br>
       Cette équation a pour solution $${x1 > x2 ? `${x2}` : `${x1}`}$ et $${x1 > x2 ? `${x1}` : `${x2}`}$.<br><br>
       `
              } else {
                texteCorr += `Les racines de $f'(x)$ sont les solutions de l'équation $${6 * a}x^2${ecritureAlgebrique(6 * a * x1 * x2)}=0$, soit $x^2=${x1 ** 2}$.<br>
    Cette équation a pour solutions  $${x1 > x2 ? `${x2}` : `${x1}`}$ et $${x1 > x2 ? `${x1}` : `${x2}`}$.<br><br>

    `
              }
            } else {
              texteCorr += `Comme $\\Delta=${p.texCalculDiscriminant}$, le discriminant est strictement positif, donc le polynôme a deux racines.`
              texteCorr += `<br><br>$${p.texCalculRacine1}$`
              texteCorr += `<br><br>$${p.texCalculRacine2}$<br>`
            }
            texteCorr += ` $f'(x)$ est du signe de   $${6 * a}$ ${6 * a > 0 ? 'donc positif' : 'donc négatif'} sauf entre ses racines. <br><br>
        On en déduit le tableau de signes de $f'(x)$ et le tableau de variations de $f$ :<br><br>`
            texteCorr += `${tableau}`
          }
          break

        case 2://
          {
            let a = randint(-5, 5, 0)
            let b = randint(-4, 4)
            let c = randint(-5, 5, 0)
            let d = randint(-3, 3, 0)
            do {
              a = randint(-5, 5, 0)
              b = randint(-4, 4)
              c = randint(-5, 5, 0)
              d = randint(-3, 3)
            } while (4 * b ** 2 - 12 * a * c >= 0)
            const p = new Trinome(a, b, c)
            const sol = new FractionEtendue(-c, 3 * a)
            fonction = x => a * x ** 3 + b * x ** 2 + c * x + d
            derivee = x => 3 * a * x ** 2 + 2 * b * x + c
            tolerance = 0.005
            xMin = -10
            xMax = 10
            substituts = [{
              antVal: -10,
              antTex: '$-\\infty$',
              imgVal: a * (-10) ** 3 + b * (-10) ** 2 + c * (-10) + d,
              imgTex: ''
            }, { antVal: 10, antTex: '$+\\infty$', imgVal: a * 10 ** 3 + b * 10 ** 2 + c * 10 + d, imgTex: '' }]
            const tableau = tableauVariationsFonction(fonction, derivee, xMin, xMax, { ligneDerivee: true, substituts, step: 1, tolerance })

            texte = `On considère la fonction $f$ définie sur $\\mathbb{R}$ par : $f(x)=${reduirePolynomeDegre3(a, b, c, d)}$.<br>
      Étudier le sens de variations de la fonction $f$ sur $\\mathbb{R}$.`
            texteCorr = `$f$ est une fonction polynôme du troisième degré, dérivable sur $\\mathbb{R}$.<br>
      Pour tout  $x\\in\\mathbb{R}$, $f'(x)=${reduirePolynomeDegre3(0, 3 * a, 2 * b, c)}$.<br><br>
      $f'(x)$ est une fonction polynôme du second degré. <br>`

            if (2 * b === 0) {
              texteCorr += `Les racines de $f'(x)$ sont les solutions de l'équation $${reduirePolynomeDegre3(0, 3 * a, 2 * b, c)}=0$, soit $x^2=${sol.simplifie().texFraction}$.<br>
      Cette équation n'a pas de solution et par suite $f'(x)$ n'a pas de racine.`
            } else { texteCorr += `Comme $\\Delta=${p.texCalculDiscriminant}$, le discriminant est strictement négatif, donc $f'(x)$ n'a pas de racine.` }

            texteCorr += `<br> $f'(x)$ est  du signe de   $${3 * a}$ ${3 * a > 0 ? 'donc positif' : 'donc négatif'} sur $\\mathbb{R}$. <br><br>
        On en déduit le tableau de signes de $f'(x)$ et le tableau de variations de $f$ :<br><br>`
            texteCorr += `${tableau}`
          }
          break
      }
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
