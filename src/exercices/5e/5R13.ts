import Exercice from '../Exercice.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import {listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import Decimal from 'decimal.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'

export const titre = 'Comparaison de nombres relatifs'
export const dateDePublication = '1/08/2024'
export const dateDeModificationImportante = '1/08/2024'
export const uuid = '19060'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['5R13'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice : Comparaison de nombres relatifs
 * @autor Claire Rousset
 * Référence 5R13
 */
export default class InequationsLog extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    this.consigne = 'Compléter avec le signe < ou >.'
    this.spacingCorr = 3
    this.sup = '1'
    this.besoinFormulaireTexte = ['Type de question (nombre séparés par des tirets', '1 : Entiers et nombres à une décimale \n2 : Nombres décimaux à une ou deux décimale(s) \n3 : Nombres décimaux à trois décimales \n4 : Mélange']
  }

  nouvelleVersion () {
    let typeQuestionsDisponibles = []
    if (this.sup === '1') {
      typeQuestionsDisponibles = ['dixiemeMemeSignePos', 'dixiemeMemeSigneNeg','dixiemeMemeSignePos','dixiemeSignesContraires', ]
    } else if (this.sup === '2') {
      typeQuestionsDisponibles = ['centiemeMemeSignePos', 'centiemeMemeSigneNeg', 'centiemePiege', 'centiemeSigneContraire' ]
    } else if (this.sup === '3') {
      typeQuestionsDisponibles = ['milliemeMemeSignePos', 'milliemeMemeSigneNeg', 'milliemePiege', 'milliemeSigneContraire' ]
    } else {
      typeQuestionsDisponibles = ['dixiemeMemeSignePos', 'dixiemeMemeSigneNeg', 'dixiemeSignesContraires', 'centiemeMemeSignePos', 'centiemeMemeSigneNeg', 'centiemePiege', 'centiemeSigneContraire', 'milliemeMemeSignePos', 'milliemeMemeSigneNeg', 'milliemePiege', 'milliemeSigneContraire']
    }

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      let texte = ''
      let texteCorr = ''
      let answer = ''
      let a
      let b
      switch (listeTypeQuestions[i]) {
        case 'dixiemeMemeSignePos': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9, dixiemeA)
          a = new Decimal(partieEntiere * 10 + dixiemeA).div(10)
          b = new Decimal(partieEntiere * 10 + dixiemeB).div(10)
          break
        }
        case 'dixiemeSignesContraires' : {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9, dixiemeA)
          a = new Decimal(partieEntiere * 10 + dixiemeA).div(10)
          b = new Decimal(partieEntiere * 10 + dixiemeB).div(10)
          break
        }
        case 'dixiemeMemeSigneNeg': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9, dixiemeA)
          a = new Decimal(partieEntiere * 10 + dixiemeA).div(10)
          b = new Decimal(partieEntiere * 10 + dixiemeB).div(10)
          a = a.neg()
          b = b.neg()
          break
        }
        case 'centiemeMemeSignePos': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0,9)
          const dixiemeB = randint(0,9)
          const centiemeA = randint(0,9)
          const centiemeB = randint(0,9, centiemeA) 
          a = new Decimal(partieEntiere * 100 + dixiemeA*10 +centiemeA).div(100)
          b = new Decimal(partieEntiere * 100 + dixiemeB*10 +centiemeB).div(100)
          break
        }
        case 'centiemeMemeSigneNeg': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9)
          const centiemeA = randint(0, 9)
          const centiemeB = randint(0, 9, centiemeA) 
          a = new Decimal(partieEntiere * 100 + dixiemeA*10 +centiemeA).div(100)
          b = new Decimal(partieEntiere * 100 + dixiemeB*10 +centiemeB).div(100)
          a = a.neg()
          b = b.neg()
          break
        }
        case 'centiemePiege': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9)
          const centiemeA = 0
          let centiemeB = 0
          if (dixiemeB == 0 ) {
            centiemeB = dixiemeA
          } else {
            centiemeB = randint(1,9) 
          }
          a = new Decimal(partieEntiere * 100 + dixiemeA*10 + centiemeA).div(100)
          b = new Decimal(partieEntiere * 100 + dixiemeB*10 + centiemeB).div(100)
          break
        }
        case 'centiemeSigneContraire': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9)
          const centiemeA = randint(0, 9)
          const centiemeB = randint(0, 9, centiemeA) 
          a = new Decimal(partieEntiere * 100 + dixiemeA*10 +centiemeA).div(100)
          b = new Decimal(partieEntiere * 100 + dixiemeB*10 +centiemeB).div(100)
          b = b.neg()
          break
        }
        case 'milliemeMemeSignePos': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9)
          const centiemeA = randint(0, 9)
          const centiemeB = randint(0, 9)
          const milliemeA = randint(0, 9)
          const milliemeB = randint(0, 9, milliemeA)
          a = new Decimal(partieEntiere * 1000 + dixiemeA*100 + centiemeA *10 + milliemeA).div(1000)
          b = new Decimal(partieEntiere * 1000 + dixiemeB*100 + centiemeB *10 + milliemeB).div(1000)
          break
        }
        case 'milliemeMemeSigneNeg': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9)
          const centiemeA = randint(0, 9)
          const centiemeB = randint(0, 9)
          const milliemeA = randint(0, 9)
          const milliemeB = randint(0, 9, milliemeA)
          a = new Decimal(partieEntiere * 1000 + dixiemeA*100 + centiemeA *10 + milliemeA).div(1000)
          b = new Decimal(partieEntiere * 1000 + dixiemeB*100 + centiemeB *10 + milliemeB).div(1000)
          a = a.neg()
          b = b.neg()
          break
      }
        case 'milliemePiege': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = 0
          const dixiemeB = randint(0, 9)
          const centiemeA = randint(0, 9)
          const milliemeA = randint(0, 9)
          let milliemeB = 0
          let centiemeB = 0
          if (milliemeA == 0) {
            milliemeB = centiemeA
            centiemeB = dixiemeA  
          } else {
            milliemeB = randint(1, 9)
            centiemeB = randint(1, 9)             
          }
          a = new Decimal(partieEntiere * 1000 + dixiemeA*100 + centiemeA *10 + milliemeA).div(1000)
          b = new Decimal(partieEntiere * 1000 + dixiemeB*100 + centiemeB *10 + milliemeB).div(1000)
          break
        }
        default : case 'milliemeSigneContraire': {
          const partieEntiere = randint(0, 9)
          const dixiemeA = randint(0, 9)
          const dixiemeB = randint(0, 9)
          const centiemeA = randint(0, 9)
          const centiemeB = randint(0, 9)
          const milliemeA = randint(0, 9)
          const milliemeB = randint(0, 9, milliemeA)
          a = new Decimal(partieEntiere * 1000 + dixiemeA*100 + centiemeA *10 + milliemeA).div(1000)
          b = new Decimal(partieEntiere * 1000 + dixiemeB*100 + centiemeB *10 + milliemeB).div(1000)
          a = a.neg()
          break
        }      
      }
      
      texte = `$${texNombre(a!)}$ &nbsp \\ldots\\ldots &nbsp $${texNombre(b!)}$`
      if (a.greaterThan(b)) {
        texteCorr = `$${texNombre(a!)} \\quad ${miseEnEvidence('>')} \\quad ${texNombre(b!)}$`
        answer = '>'
      } else if (a.lessThan(b)) {
        texteCorr = `$${texNombre(a!)} \\quad ${miseEnEvidence('<')} \\quad ${texNombre(b!)}$`
        answer = '<'
      } else {
        texteCorr = `$${texNombre(a!)} \\quad ${miseEnEvidence('=')} \\quad ${texNombre(b!)}$`
        answer = '='
      }
        
      if (this.interactif) {
        handleAnswers(this, i,
          {
            champ1: { value: answer }
          }
        )
        texte = remplisLesBlancs(this, i, `${texNombre(a!)} \\quad %{champ1} \\quad ${texNombre(b!)}`, KeyboardType.clavierCompare)
      }
      if (this.questionJamaisPosee(i, a!.toString(), b!.toString())) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this)
  }
}
