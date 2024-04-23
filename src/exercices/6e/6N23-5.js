import { choice } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { texNombre2 } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import {
  listeQuestionsToContenu,
  randint,
  calculANePlusJamaisUtiliser,
  gestionnaireFormulaireTexte
} from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'

export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Donner une écriture fractionnaire'

/**
 * Donner la fraction correspondant à un nombre ou à un calcul
 * @author Jean-Claude Lhote
 * Ref 6N23-5
 * Publié le 10/03/2021
 */
export const uuid = '4d0dd'
export const ref = '6N23-5'
export const refs = {
  'fr-fr': ['6N23-5'],
  'fr-ch': ['9NO10-4']
}
export default function SensDeLaFraction () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.pasDeVersionLatex = false
  this.pas_de_version_HMTL = false
  this.sup = '5'

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, nin: 1, max: 4, defaut: 5, melange: 5, nbQuestions: this.nbQuestions })

    for (let i = 0, texte, texteCorr, a, b, f, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      texte = ''
      texteCorr = ''

      switch (listeTypeDeQuestions[i]) {
        case 1:
          a = randint(10, 25)
          b = randint(10, 25, a)
          texte = `Le quotient de $${a}$ par $${b}$ s'écrit en écriture fractionnaire : $${texFractionFromString(
              '\\phantom{00000}',
              '\\phantom{00000}'
            )}$`
          texteCorr = `Le quotient de $${a}$ par $${b}$ s'écrit $${texFractionFromString(a, b)}$.`
          this.autoCorrection[i] = {}
          this.autoCorrection[i].enonce = `${texte}\n`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${texFractionFromString(a, b)}$`,
              statut: true
            },
            {
              texte: `$${texFractionFromString(b, a)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(Math.abs(a - b), b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a + b, b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a * 10, b)}$`,
              statut: false
            }
          ]
          break

        case 2:
          a = randint(10, 25)
          b = randint(10, 25, a)
          texte = `Le nombre qui, multiplié par $${b}$, donne $${a}$ s'écrit en écriture fractionnaire : $${texFractionFromString(
              '\\phantom{00000}',
              '\\phantom{00000}'
            )}$`
          texteCorr = `Le nombre qui, multiplié par $${b}$, donne $${a}$ s'écrit $${texFractionFromString(a, b)}$.`
          this.autoCorrection[i] = {}
          this.autoCorrection[i].enonce = `${texte}\n`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${texFractionFromString(a, b)}$`,
              statut: true
            },
            {
              texte: `$${texFractionFromString(b, a)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(Math.abs(a - b), b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a + b, b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a * 10, b)}$`,
              statut: false
            }
          ]
          break

        case 3:
          a = randint(10, 25)
          b = randint(10, 25, a)
          texte = `$${a}\\div ${b}$ s'écrit en écriture fractionnaire : $${texFractionFromString(
              '\\phantom{00000}',
              '\\phantom{00000}'
            )}$`
          texteCorr = `$${a}\\div ${b}$ s'écrit  $${texFractionFromString(a, b)}$.`
          this.autoCorrection[i] = {}
          this.autoCorrection[i].enonce = `${texte}\n`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${texFractionFromString(a, b)}$`,
              statut: true
            },
            {
              texte: `$${texFractionFromString(b, a)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(Math.abs(a - b), b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a + b, b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a * 10, b)}$`,
              statut: false
            }
          ]
          break

        case 4:

          a = randint(1, 5) * 2 + 1
          b = choice([2, 4, 5, 10])
          a += b
          if (Number.isInteger(a / b)) {
            a++
          }
          f = fraction(a, b)

          texte = `Le nombre $${texNombre2(calculANePlusJamaisUtiliser(a / b))}$ s'écrit en écriture fractionnaire : $${texFractionFromString(
            '\\phantom{00000}',
            '\\phantom{00000}'
          )}$`
          texteCorr = `Le nombre $${texNombre2(calculANePlusJamaisUtiliser(a / b))}$ s'écrit  $${f.fractionDecimale().texFraction}$`
          if (f.fractionDecimale().texFraction !== f.texFractionSimplifiee) {
            texteCorr += ` ou $${f.texFractionSimplifiee}$.`
          } else texte += '.'
          this.autoCorrection[i] = {}
          this.autoCorrection[i].enonce = `${texte}\n`
          this.autoCorrection[i].propositions = [
            {
              texte: `$${f.fractionDecimale().texFraction}$`,
              statut: true
            },
            {
              texte: `$${texFractionFromString(b, a)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a, b * 10)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(a * 10, b)}$`,
              statut: false
            },
            {
              texte: `$${texFractionFromString(Math.floor(a / b), fraction(calculANePlusJamaisUtiliser((a / b - Math.floor(a / b))) * 100, 100).fractionDecimale().n)}$`,
              statut: false
            }
          ]
          break
      }
      this.autoCorrection[i].options = {
        ordered: false,
        lastChoice: 5
      }
      if (this.interactif) {
        texte += '<br>' + propositionsQcm(this, i).texte
        texte = texte.replace(`$${texFractionFromString('\\phantom{00000}', '\\phantom{00000}')}$`, '')
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  this.besoinFormulaireTexte = ['Type de questions', '1: Le quotient de a par b\n2: Le nombre qui, multiplié par b, donne a\n3: a divisé par b\n4 Nombre décimal\n5: Mélange']
}
