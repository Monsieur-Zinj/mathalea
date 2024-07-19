// import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import { aleaVariables } from '../../modules/outilsMathjs'
import Exercice from '../Exercice'

export const uuid = 'e2a95'
export const titre = 'Mettre des parenthèses ou pas pour qu\'une égalité soit juste'
export const refs = {
  'fr-fr': ['5C12-4'],
  'fr-ch': []
}

class MettreDesParentheses extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    this.besoinFormulaireCaseACocher = ['Avec des nombres relatifs', false]
    this.sup = false
  }

  // const changeSigne = (a:number, yesOrNo: boolean) => yesOrNo ? choice([a, -a]) : a
  nouvelleVersion () {
    this.reinit()
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const variables: {a:number, b:number, c:number, d:number} = aleaVariables({
        a: this.sup,
        b: this.sup,
        c: this.sup,
        d: this.sup,
        test: this.sup ? 'a+b mod c=0 and d*(a+b)/c<50' : 'a+b mod c=0 and d*(a+b)/c<100'
      })
      const a = variables.a
      const b = variables.b
      const c = variables.c
      const d = variables.d
      const texte: string = `$\\dfrac{${texNombre(a, 0)}+${texNombre(b, 0)}}{${texNombre(c, 0)}}\\times ${texNombre(d, 0)}=${texNombre((a + b) / c * d, 0)}$`
      const texteCorr: string = ''

      if (this.questionJamaisPosee(i, a, b, c, d)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
      }
    }
  }
}

export default MettreDesParentheses
