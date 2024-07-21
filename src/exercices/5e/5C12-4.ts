// import { choice } from '../../lib/outils/arrayOutils'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { choice } from '../../lib/outils/arrayOutils'
import { gestionnaireFormulaireTexte } from '../../modules/outils'
import { aleaExpression, aleaVariables, type Variables } from '../../modules/outilsMathjs'
import Exercice from '../Exercice'
import { evaluate } from 'mathjs'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'e2a95'
export const titre = 'Mettre des parenthèses ou pas pour qu\'une égalité soit juste'
export const refs = {
  'fr-fr': ['5C12-4'],
  'fr-ch': []
}

type Materiel = {expSP: string, expAP: string, test: string}
// Les tirets bas sont placés là où il n'y a pas de parenthèses mais qu'il pourrait y en avoir une. Cela sert à placer les placeholders et à savoir à quelle position on a quelle parenthèse
// Pour l'analyse et l'utilisation de l'expression, ces tirets bas sont remplacés par du vide.
const dicoDesExpressions: {troisSignesToutPositif: Materiel[], troisSignesRelatifs: Materiel[], quatreSignesToutPositif: Materiel[], quatreSignesRelatifs: Materiel[] } = {
  troisSignesToutPositif: [
    { expSP: '_a*_b_+c_', expAP: '_a*(b_+c)', test: 'a*b+c != a*(b+c)' },
    { expSP: '_a+_b_*c_', expAP: '(a+_b)*c_', test: 'a+b*c != (a+b)*c' },
    { expSP: '_a*_b_-c_', expAP: '_a*(b_-c)', test: 'a*b-c != a*(b-c) and b>c and a*b>c' },
    { expSP: '_a-_b_*c_', expAP: '(a-_b)*c_', test: 'a-b*c != (a-b)*c and a>b and a>b*c' }
  ],
  troisSignesRelatifs: [
    { expSP: '_a*_b_+c_', expAP: '_a*(b_+c)', test: 'a*b+c != a*(b+c)' },
    { expSP: '_a+_b_*c_', expAP: '(a+_b)*c_', test: 'a+b*c != (a+b)*c' },
    { expSP: '_a*_b_-c_', expAP: '_a*(b_-c)', test: 'a*b-c != a*(b-c)' },
    { expSP: '_a-_b_*c_', expAP: '(a-_b)*c_', test: 'a-b*c != (a-b)*c' }
  ],
  quatreSignesToutPositif: [
    { expSP: '_a+_b_*_c_+d_', expAP: '(a+_b)*(c_+d)', test: '(a+b)*(c+d)!=a+b*c+d and (a+b)*(c+d)!=(a+b)*c+d and (a+b)*(c+d)!=a+b*(c+d)' },
    { expSP: '_a+_b_*_c_+d_', expAP: '_a+_b_*(c_+d)', test: 'a+b*(c+d)!=a+b*c+d and a+b*(c+d)!=(a+b)*(c+d) and a+b*(c+d)!=(a+b)*c+d' },
    { expSP: '_a+_b_*_c_+d_', expAP: '(a+_b)*_c_+d_', test: '(a+b)*c+d!=a+b*c+d and (a+b)*c+d!=(a+b)*(c+d) and (a+b)*c+d!=a+b*(c+d)' },
    { expSP: '_a-_b_*_c_+d_', expAP: '(a-_b)*(c_+d)', test: '(a-b)*(c+d)!=a-b*c+d and (a-b)*(c+d)!=(a-b)*c+d and (a-b)*(c+d)!=a-b*(c+d) and a>b' },
    { expSP: '_a-_b_*_c_+d_', expAP: '_a-_b_*(c_+d)', test: 'a-b*(c+d)!=a-b*c+d and a-b*(c+d)!=(a-b)*(c+d) and a-b*(c+d)!=(a-b)*c+d and a>b' },
    { expSP: '_a-_b_*_c_+d_', expAP: '(a-_b)*_c_+d_', test: '(a-b)*c+d!=a-b*c+d and (a-b)*c+d!=(a-b)*(c+d) and (a-b)*c+d!=a-b*(c+d) and a>b' }
  ],
  quatreSignesRelatifs: [
    { expSP: '_a+_b_*_c_+d_', expAP: '(a+_b)*(c_+d)', test: '(a+b)*(c+d)!=a+b*c+d and (a+b)*(c+d)!=(a+b)*c+d and (a+b)*(c+d)!=a+b*(c+d)' },
    { expSP: '_a+_b_*_c_+d_', expAP: '_a+_b_*(c_+d)', test: 'a+b*(c+d)!=a+b*c+d and a+b*(c+d)!=(a+b)*(c+d) and a+b*(c+d)!=(a+b)*c+d' },
    { expSP: '_a+_b_*_c_+d_', expAP: '(a+_b)*_c_+d_', test: '(a+b)*c+d!=a+b*c+d and (a+b)*c+d!=(a+b)*(c+d) and (a+b)*c+d!=a+b*(c+d)' },
    { expSP: '_a-_b_*_c_+d_', expAP: '(a-_b)*(c_+d)', test: '(a-b)*(c+d)!=a-b*c+d and (a-b)*(c+d)!=(a-b)*c+d and (a-b)*(c+d)!=a-b*(c+d)' },
    { expSP: '_a-_b_*_c_+d_', expAP: '_a-_b_*(c_+d)', test: 'a-b*(c+d)!=a-b*c+d and a-b*(c+d)!=(a-b)*(c+d) and a-b*(c+d)!=(a-b)*c+d' },
    { expSP: '_a-_b_*_c_+d_', expAP: '(a-_b)*_c_+d_', test: '(a-b)*c+d!=a-b*c+d and (a-b)*c+d!=(a-b)*(c+d) and (a-b)*c+d!=a-b*(c+d)' }
  ]
}

class MettreDesParentheses extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    this.besoinFormulaireTexte = ['Complexité (nombres séparés par des tirets)', '1 : 2 opérations\n2 : 3 opérations\n3 Mélange']
    this.besoinFormulaire2CaseACocher = ['Avec des nombres relatifs', false]
    this.sup = '3'
    this.sup2 = false
  }

  // const changeSigne = (a:number, yesOrNo: boolean) => yesOrNo ? choice([a, -a]) : a
  nouvelleVersion () {
    this.reinit()
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, nbQuestions: this.nbQuestions, min: 1, max: 3, melange: 3, defaut: 3 })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const choix: Materiel[] = []
      if (listeTypeDeQuestion[i] === 1) {
        if (this.sup2) choix.push(...dicoDesExpressions.troisSignesRelatifs)
        choix.push(...dicoDesExpressions.troisSignesToutPositif)
      } else {
        if (this.sup2) {
          choix.push(...dicoDesExpressions.quatreSignesRelatifs)
        }
        choix.push(...dicoDesExpressions.quatreSignesToutPositif)
      }

      const materiel = choice(choix)

      const assignations: Variables = aleaVariables({
        a: `randomInt(1,10)*${this.sup2 ? 'randomInt(0,1)*2-1' : '1'}`,
        b: `randomInt(1,10)*${this.sup2 ? 'randomInt(0,1)*2-1' : '1'}`,
        c: `randomInt(1,10)*${this.sup2 ? 'randomInt(0,1)*2-1' : '1'}`,
        d: `randomInt(1,10)*${this.sup2 ? 'randomInt(0,1)*2-1' : '1'}`,
        test: materiel.test
      })
      const a = Number(assignations.a)
      const b = Number(assignations.b)
      const c = Number(assignations.c)
      const d = Number(assignations.d)
      const parentheses = choice([true, true, true, false])
      const resultat = parentheses ? evaluate(materiel.expAP.replaceAll('_', ''), assignations) : evaluate(materiel.expSP.replaceAll('_', ''), assignations)
      let texte: string = 'Mettre des parenthèses dans l\'égalité afin que celle-ci soit juste:<br>'
      let index = 1
      let content = ''
      for (let c = 0; c < materiel.expSP.length; c++) {
        const char = materiel.expSP[c]
        if (char === '+' || char === '-') content += `~${char}`
        if (char === '*') content += '~\\times'
        if (['a', 'b', 'c', 'd'].includes(char)) {
          const value = Number(assignations[char as keyof Variables])
          if (value < 0) content += `~(${value})`
          else content += `~${value}`
        }
        if (char === '_') content += `~%{champ${index++}}`
      }
      content += `~=~${resultat}`
      texte += remplisLesBlancs(this, i, content)
      const answer = parentheses
        ? `${aleaExpression(materiel.expAP.replaceAll('_', ''), assignations).toTex}=${resultat}`
        : `${aleaExpression(materiel.expSP.replaceAll('_', ''), assignations).toTex}=${resultat}`
      const texteCorr: string = `$${answer}$`
      if (listeTypeDeQuestion[i] === 1) {
        if (parentheses) {
          // On récupère la liste des parenthèses (ou absence de parenthèses) pour renseigner les goodAnswers
          const listePar = materiel.expAP.match(/[_()]/g)
          if (listePar != null && listePar.length === 4) {
            handleAnswers(this,
              i,
              {
                champ1: { value: listePar[0] === '(' ? '(' : '' },
                champ2: { value: listePar[1] === '(' ? '(' : '' },
                champ3: { value: listePar[2] === ')' ? ')' : '' },
                champ4: { value: listePar[3] === ')' ? ')' : '' }
              })
          } else {
            throw Error(`Il y a un problème avec cette expressions, on n'a pas trouvé 4 symboles : ${materiel.expAP}`)
          }
        } else {
          // Ici, il ne faut pas de parenthèses !
          handleAnswers(this,
            i,
            {
              champ1: { value: '' },
              champ2: { value: '' },
              champ3: { value: '' },
              champ4: { value: '' }
            })
        }
      } else {
        if (parentheses) {
          // On récupère la liste des parenthèses (ou absence de parenthèses) pour renseigner les goodAnswers
          const listePar = materiel.expAP.match(/[()]/g)
          if (listePar != null && listePar.length === 6) {
            handleAnswers(this,
              i,
              {
                champ1: { value: listePar[0] === '(' ? '(' : '' },
                champ2: { value: listePar[1] === '(' ? '(' : '' },
                champ3: { value: listePar[2] === '(' ? '(' : listePar[2] === ')' ? ')' : '' },
                champ4: { value: listePar[3] === '(' ? '(' : listePar[3] === ')' ? ')' : '' },
                champ5: { value: listePar[4] === '(' ? '(' : listePar[4] === ')' ? ')' : '' },
                champ6: { value: listePar[5] === '(' ? '(' : listePar[5] === ')' ? ')' : '' }

              })
          } else {
            throw Error(`Il y a un problème avec cette expressions, on n'a pas trouvé 6 symboles : ${materiel.expAP}`)
          }
        } else {
          // Ici, il ne faut pas de parenthèses !
          handleAnswers(this,
            i,
            {
              champ1: { value: '' },
              champ2: { value: '' },
              champ3: { value: '' },
              champ4: { value: '' },
              champ5: { value: '' },
              champ6: { value: '' }
            })
        }
      }

      if (this.questionJamaisPosee(i, a, b, c, d, materiel.expAP)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
  }
}

export default MettreDesParentheses
