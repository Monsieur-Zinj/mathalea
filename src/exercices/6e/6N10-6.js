import { choice, combinaisonListes2 } from '../../lib/outils/arrayOutils.js'
import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDe } from '../../lib/outils/nombres.js'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { calcul, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { max } from 'mathjs'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Donner l\'écriture (décimale ou en fraction décimale) d\'une somme (ou différence) de nombres avec fractions décimales'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '20/01/2022'
/**
 * Donner l\'écriture (décimale ou en fraction décimale) d\'une somme (ou différence) de nombres avec fractions décimales
 *
 * * La somme avec entiers peut être avec retenue (genre 2+23/10) ou sans retenue (3+7/10)
 * * Tous les choix sont paramétrables
 * *
 * @author Eric Elter
 * Référence 6N10-6
 */

export const uuid = 'c5438'
export const ref = '6N10-6'
export default function SommeFractionsDecimales () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbQuestions = 6
  this.besoinFormulaireTexte = ['Type des calculs', 'Nombres séparés par des tirets\n(Les fractions sont décimales et de même dénominateur)\n1 : Somme de 2 fractions\n2 : Différence de 2 fractions\n3 : Somme (sans retenue) d\'un entier et d\'une somme de 2 fractions\n4 : Somme (sans retenue) d\'un entier et d\'une différence de 2 fractions\n5 : Somme d\'un entier et d\'une somme de 2 fractions\n6 : Somme d\'un entier et d\'une différence de 2 fractions\n7 : Mélange']
  this.besoinFormulaire2Numerique = ['Forme de la solution', 3, '1 : Un nombre décimal\n2 : Une fraction décimale\n3 : Les deux']
  this.sup = 7
  this.sup2 = 3
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    // this.sup2 = contraindreValeur(1, 3, this.sup2, 3)
    this.consigne = 'Donner le résultat de '
    this.consigne += this.nbQuestions === 1 ? 'ce' : 'chaque'
    switch (this.sup2) {
      case 1 :
        this.consigne += ' calcul.'
        break
      case 2 :
        this.consigne += ' calcul sous forme d\'une fraction décimale.'
        break
      case 3 :
        this.consigne += ' calcul sous forme d\'une fraction décimale puis en écriture décimale.'
        break
    }

    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      max: 6,
      defaut: 7,
      melange: 7,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    const listeTypeDeQuestions = combinaisonListes2(typesDeQuestionsDisponibles, this.nbQuestions)
    for (
      let i = 0, texte, texteCorr, cpt = 0, a, b, c, reponseAMC, denAMC, numAMC, choix; i < this.nbQuestions && cpt < 50;) {
      a = randint(2, 19)
      b = randint(2, 19, a)
      c = randint(2, 19, [a, b])
      choix = randint(1, 3)
      denAMC = Math.pow(10, choix)
      switch (listeTypeDeQuestions[i]) {
        case 1: // Somme de deux fractions décimales de même dénominateur
          b = randint(2, 50)
          c = randint(2, 50, [b])
          while ((b + c) % 10 === 0) {
            c = randint(2, 50, [b])
          } // Pour éviter d'avoir une somme multiple de 10
          texte = `$${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}$`
          numAMC = calcul(b + c)
          reponseAMC = calcul(numAMC / denAMC)
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}$ sous forme d'une fraction décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          switch (this.sup2) {
            case 2 :
              texteCorr = `$${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}$`
              break
            default :
              texteCorr = `$${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}=${texNombre(reponseAMC)}$`
              break
          }
          break
        case 2: // Différence de deux fractions décimales de même dénominateur
          b = randint(3, 50)
          c = randint(2, b - 1)
          texte = `$${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}$`
          numAMC = calcul(b - c)
          reponseAMC = calcul(numAMC / denAMC)
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}$ sous forme d'une fraction décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          switch (this.sup2) {
            case 2 :
              texteCorr = `$${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}$`
              break
            default :
              texteCorr = `$${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}=${texNombre(reponseAMC)}$`
              break
          }
          break
        case 3: // Somme d'un entier avec une somme de deux fractions décimales de même dénominateur, sans retenue
          b = (choix === 1) ? randint(2, 7) : randint(2, 50)
          c = (choix === 1) ? randint(2, 7, [b, 10 - b]) : randint(2, 50, [b])
          a = randint(2, 20, [b, c])
          while ((b + c) % 10 === 0) {
            c = randint(2, 50, [a, b])
          } // Pour éviter d'avoir une somme multiple de 10
          texte = `$${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}$`
          numAMC = calcul(a * denAMC + b + c)
          reponseAMC = calcul(numAMC / denAMC)
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          switch (this.sup2) {
            case 2 :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}$`
              break
            default :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}=${texNombre(reponseAMC)}$`
              break
          }
          break
        case 4: // Somme d'un entier avec une différence de deux fractions décimales de même dénominateur, sans retenue
          b = randint(3, 50)
          c = (choix === 1) ? randint(max(b - 9, 2), b - 1) : randint(2, b - 1)
          a = randint(2, 20, [b, c])
          texte = `$${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}$`
          numAMC = calcul(a * denAMC + b - c)
          reponseAMC = calcul(numAMC / denAMC)
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          switch (this.sup2) {
            case 2 :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}$`
              break
            default :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}=${texNombre(reponseAMC)}$`
              break
          }
          break
        case 5: // Somme d'un entier avec une somme de deux fractions décimales de même dénominateur, avec éventuelle retenue
          b = randint(2, 50)
          c = randint(2, 50, [b])
          a = randint(2, 20, [b, c])
          while ((b + c) % 10 === 0) {
            c = randint(2, 50, [a, b])
          } // Pour éviter d'avoir une somme multiple de 10
          texte = `$${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}$`
          numAMC = calcul(a * denAMC + b + c)
          reponseAMC = calcul(numAMC / denAMC)
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          switch (this.sup2) {
            case 2 :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}$`
              break
            default :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}+${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b + c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}=${texNombre(reponseAMC)}$`
              break
          }
          break
        case 6: // Somme d'un entier avec une différence de deux fractions décimales de même dénominateur, avec éventuelle retenue
          b = randint(3, 50)
          c = randint(2, b - 1)
          a = randint(2, 20, [b, c])
          texte = `$${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}$`
          numAMC = calcul(a * denAMC + b - c)
          reponseAMC = calcul(numAMC / denAMC)
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          switch (this.sup2) {
            case 2 :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}$`
              break
            default :
              texteCorr = `$${a}+${deprecatedTexFraction(b, denAMC)}-${deprecatedTexFraction(c, denAMC)}=${a}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(a * denAMC, denAMC)}+${deprecatedTexFraction(b - c, denAMC)}=${deprecatedTexFraction(numAMC, denAMC)}=${texNombre(reponseAMC)}$`
              break
          }
          break
      }
      const choixDigit = randint(0, 1)
      switch (this.sup2) {
        case 1 :
          setReponse(this, i, reponseAMC, {
            digits: nombreDeChiffresDe(reponseAMC) + randint(choixDigit, choixDigit + 1),
            decimals: nombreDeChiffresDansLaPartieDecimale(reponseAMC) + choixDigit,
            signe: false
          })

          break
        case 2 :
          setReponse(this, i, new FractionEtendue(numAMC, denAMC), {
            digitsNum: nombreDeChiffresDe(numAMC),
            digitsDen: nombreDeChiffresDe(denAMC) + 1,
            signe: false,
            formatInteractif: 'fraction'
          })
          break
        case 3 :
          if (context.isAmc) {
            if (choice([0, 1]) === 0) {
              setReponse(this, i, new FractionEtendue(numAMC, denAMC), {
                digitsNum: nombreDeChiffresDe(numAMC),
                digitsDen: nombreDeChiffresDe(denAMC) + 1,
                signe: false,
                formatInteractif: 'fraction'
              })
            } else {
              setReponse(this, i, reponseAMC, {
                digits: nombreDeChiffresDe(reponseAMC) + randint(choixDigit, choixDigit + 1),
                decimals: nombreDeChiffresDansLaPartieDecimale(reponseAMC) + choixDigit,
                signe: false
              })
            }
          } else {
            setReponse(this, 2 * i, new FractionEtendue(numAMC, denAMC), {
              digitsNum: nombreDeChiffresDe(numAMC),
              digitsDen: nombreDeChiffresDe(denAMC) + 1,
              signe: false,
              formatInteractif: 'fraction'
            })
            setReponse(this, 2 * i + 1, reponseAMC, {
              digits: nombreDeChiffresDe(reponseAMC) + randint(choixDigit, choixDigit + 1),
              decimals: nombreDeChiffresDansLaPartieDecimale(reponseAMC) + choixDigit,
              signe: false
            })
          }
          break
      }

      if (this.interactif) {
        if (this.sup2 === 3) {
          texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur25 inline', { texte: `${sp(6)}=` })
          texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur25 inline', { texte: `${sp(6)}=` })
        } else {
          texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texte: `${sp(6)}=` })
        }
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        if (!context.isHtml && i === 0) {
          texteCorr = '\\setlength\\itemsep{2em}' + texteCorr
        } // espacement entre les questions
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
