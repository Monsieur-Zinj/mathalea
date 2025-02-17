import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Convertir des m$^3$ et litres'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6M05
 */
export const uuid = 'a39f6'
export const ref = 'can6M05'
export const refs = {
  'fr-fr': ['can6M05'],
  'fr-ch': []
}
export default function ConversionM3EtLitres () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a, resultat
    switch (choice(['a', 'b'])) {
      case 'a':
        a = calculANePlusJamaisUtiliser(randint(1, 12) + randint(1, 9) / 10)
        resultat = calculANePlusJamaisUtiliser(a * 1000)
        this.question = ` $${texNombre(a)}$ m$^3 =$ `
        if (!this.interactif) {
          this.question += '$ ....$ L'
        }
        this.formatChampTexte = ''
        this.optionsChampTexte = { texteApres: ' L' }
        this.correction = ` $${texNombre(a)}$ m$^3 = ${texNombre(a * 1000)}$ L`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        Comme $1$ m$^3 = ${texNombre(1000)}$ L,  alors pour passer des «${sp()}m$^3$ ${sp()}» au «${sp()}L ${sp()}», on multiplie par $${texNombre(1000)}$.<br>
          Comme $${texNombre(a)}\\times ${texNombre(1000)} =${texNombre(a * 1000)}$, alors $${texNombre(a)}$ m$^3${sp()}=${resultat}$ L.  `)
        this.canEnonce = 'Compléter.'
        this.canReponseACompleter = `$${texNombre(a)}$ m$^3 = \\dots$ L`
        break
      case 'b':
        a = calculANePlusJamaisUtiliser(randint(1, 9) + randint(1, 9) * 10 + randint(0, 9) * 100)
        resultat = calculANePlusJamaisUtiliser(a / 1000)
        this.question = `$${texNombre(a)}$  L $=$ `
        if (!this.interactif) {
          this.question += ' .... m$^3$ '
        }
        this.formatChampTexte = ''
        this.optionsChampTexte = { texteApres: ' m$^3$' }
        this.canEnonce = 'Compléter.'
        this.canReponseACompleter = `$${texNombre(a)}$ L $ = \\dots$ m$^3$`
        this.correction = ` $${texNombre(a)}$ L $=${texNombre(a / 1000)}$ m$^3$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
           Comme $1$ m$^3 = ${texNombre(1000)}$ L, alors $1$ L$${sp()} = ${texNombre(0.001)}$ m$^3$. Donc, pour passer des «${sp()}L ${sp()}» au «${sp()}m$^3$ ${sp()}», on divise par $${texNombre(1000)}$.<br>
          Comme $${texNombre(a)}\\div ${texNombre(1000)} =${texNombre(a / 1000)}$, alors $${texNombre(a)}$ L$${sp()}=${texNombre(a / 1000)}$ m$^3$.  `)

        break
    }

    this.reponse = resultat
  }
}
