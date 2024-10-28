import Exercice from '../Exercice'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { texteEnCouleur, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { context } from '../../modules/context'
import Trinome from '../../modules/Trinome'
import { createList } from '../../lib/format/lists'
import FractionEtendue from '../../modules/FractionEtendue'
import { choice } from '../../lib/outils/arrayOutils'
import { tableauVariationsFonction } from '../../lib/mathFonctions/etudeFonction'

export const titre = 'Étude d\'une suite $u_{n+1}=f(u_n)$ par récurrence'
export const dateDePublication = '25/10/2024'

/**
 * @author Rémi Angot
 * Étude d\'une suite par récurrence définie par une fonction polynôme du second degré.
*/

export const uuid = '787b5'
export const refs = {
  'fr-fr': ['TSpeS12'],
  'fr-ch': []
}

const bleuMathalea = context.isHtml ? '#216D9A' : 'black'

export default class EtudeSuiteFonctionRecurrence extends Exercice {
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
  }

  nouvelleVersion () {
    let texte = ''
    let texteCorr = ''

    const i1 = 1
    const i2 = 3

    const [a, b, c] = choice([
      [frac(1, 3), frac(-1, 3), frac(1, 1)],
      [frac(1, 3), frac(-2, 3), frac(4, 3)],
      [frac(1, 3), frac(-1, 1), frac(2, 1)],
      [frac(1, 4), frac(-1, 2), frac(5, 4)],
      [frac(1, 4), frac(-2, 3), frac(17, 12)],
      [frac(1, 4), frac(-1, 4), frac(1, 1)],
      [frac(1, 5), frac(-1, 5), frac(1, 1)],
      [frac(1, 5), frac(1, 5), frac(3, 5)]
    ])

    const f = new Trinome(a, b, c)
    const alpha = f.alpha.texFractionSimplifiee
    texte = `On considère la fonction définie sur $\\R$ par $f(x)=${f.tex}$ et la suite $(u_n)$ définie par $u_0 = ${i2}$ et pour tout $n\\in\\N$,&nbsp;&nbsp;$u_{n+1} = f(u_n)$. `
    const questions = [
      `Étudier le sens de variation de $f$ sur $[${i1}\\;;\\;${i2}]$.`,
      `Démontrer par récurrence que, pour tout entier naturel $n$, $${i1} \\leqslant u_n \\leqslant ${i2}$`,
      'Démontrer que la suite $(u_n)$ est décroissante.'
    ]
    const style = 'nombres'
    const classOptions = 'space-y-4 mt-3'
    texte += '<br>' + createList({
      items: questions,
      style,
      classOptions
    })
    let correction1 = 'La fonction $f$ est une fonction polynôme du second degré. Elle est donc dérivable sur $\\R$ et pour tout $x$ de $\\R$ :'
    correction1 += `<br><br> $f'(x)=${f.derivee.tex}$.`
    correction1 += `<br><br> $f'(x)=0 \\Leftrightarrow x=${alpha}$.`
    correction1 += `<br><br>Or $${alpha} \\geqslant ${i1}$ donc $f$ est croissante sur $[${i1}\\;;\\;${i2}]$.`

    const fonction = (x: number) => f.image(x).toNumber()
    const derivee = (x: number) => f.derivee.image(x).toNumber()
    correction1 += '<br><br>' + tableauVariationsFonction(fonction, derivee, i1, i2, {
      ligneDerivee: true,
      substituts: [
        // @ts-expect-error typage de tableauVariationsFonction
        { antVal: 3, antTex: '3', imgTex: '$ $' },
        // @ts-expect-error typage de tableauVariationsFonction
        { antVal: 1, antTex: '1', imgTex: '$ $' }
      ],
      step: new FractionEtendue(1, 100),
      tolerance: 0.001
    })

    let correction2 = `Démontrons par récurrence que, pour tout entier naturel $n$, $${i1} \\leqslant u_n \\leqslant ${i2}$`
    correction2 += `<br><br>${texteEnCouleurEtGras('Initialisation :', bleuMathalea)}`
    correction2 += `<br><br>$u_0 = ${i2}$, on a bien $${i1} \\leqslant u_0 \\leqslant ${i2}$.`
    correction2 += '<br><br>La propriété est donc vraie au rang 0.'

    correction2 += `<br><br>${texteEnCouleurEtGras('Hérédité :', bleuMathalea)}`
    correction2 += `<br><br>Soit $n$ un entier naturel. Supposons que $${i1} \\leqslant u_n \\leqslant ${i2}$.`
    correction2 += `<br><br>Montrons alors que $${i1} \\leqslant u_{n+1} \\leqslant ${i2}$.`
    correction2 += '<br><br>On a : '
    correction2 += `<br><br>$${i1} \\leqslant u_n \\leqslant ${i2}\\qquad$ ${texteEnCouleur('Hypothèse de récurrence', 'forestgreen')}`
    correction2 += `<br><br>$f(${i1}) \\leqslant f(u_n) \\leqslant f(${i2})\\qquad$ ${texteEnCouleur(`Car $f$ est croissante sur $[${i1}\\;;\\;${i2}]$`, 'forestgreen')}`
    correction2 += `<br><br>$${f.image(i1).texFractionSimplifiee} \\leqslant f(u_n) \\leqslant ${f.image(i2).texFractionSimplifiee}$`
    correction2 += `<br><br>Or $${f.image(i2).texFractionSimplifiee} \\leqslant ${i2}$.`
    correction2 += '<br><br>Donc la propriété est vraie au rang $n+1$.'

    correction2 += `<br><br>${texteEnCouleurEtGras('Conclusion :', bleuMathalea)}`
    correction2 += '<br><br>La propriété est vraie pour $n=0$ et héréditaire à partir de ce rang, donc par récurrence, elle est vraie pour tout entier naturel.'

    let correction3 = 'Démontrons par récurrence que pour tout $n$ entier naturel : $u_{n+1} \\leqslant u_n$.'
    correction3 += `<br><br>${texteEnCouleurEtGras('Initialisation :', bleuMathalea)}`
    correction3 += `<br><br>$u_1 = f(u_0) = f(${i2}) = ${f.image(i2).texFractionSimplifiee} \\leqslant u_0$`
    correction3 += '<br><br>La propriété est donc vraie au rang 0.'

    correction3 += `<br><br>${texteEnCouleurEtGras('Hérédité :', bleuMathalea)}`
    correction3 += '<br><br>Soit $n$ un entier naturel. Supposons que $u_{n+1} \\leqslant u_n$.'
    correction3 += '<br><br>Montrons alors que $u_{n+2} \\leqslant u_{n+1}$.'
    correction3 += '<br><br>On a : '
    correction3 += `<br><br>$u_{n+1} \\leqslant u_n \\qquad$ ${texteEnCouleur('Hypothèse de récurrence', 'forestgreen')}`
    correction3 += `<br><br>$f(u_{n+1}) \\leqslant f(u_n)\\qquad$ ${texteEnCouleur(`Car $f$ est croissante sur $[${i1}\\;;\\;${i2}]$`, 'forestgreen')}`
    correction3 += '<br><br>$u_{n+2} \\leqslant u_{n+1}$'

    correction3 += `<br><br>${texteEnCouleurEtGras('Conclusion :', bleuMathalea)}`
    correction3 += '<br><br>La propriété est vraie pour $n=0$ et héréditaire à partir de ce rang, donc par récurrence, elle est vraie pour tout entier naturel.'

    texteCorr = createList({
      items: [correction1, correction2, correction3],
      style,
      classOptions
    })

    if (!context.isHtml) {
      texte = texte.replaceAll('&nbsp;', ' ')
      texteCorr = texteCorr.replaceAll('forestgreen', 'black')
    }
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)

    listeQuestionsToContenu(this)
  }
}

function frac (a: number, b: number) {
  return new FractionEtendue(a, b)
}
