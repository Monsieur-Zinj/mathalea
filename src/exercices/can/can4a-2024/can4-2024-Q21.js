import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { scratchblock } from '../../../modules/scratchblock'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Comprendre un programme scratch'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'fdd2f'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore'
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    let prog1 = '\\begin{scratch}[print,fill,blocks,scale=0.8]\n'
    prog1 += '\\blockinit{quand \\greenflag est cliqué}\n'
    prog1 += '\\blockrepeat{répéter \\ovalnum{4} fois}\n'
    prog1 += '{\n'
    prog1 += '\\blockpen{stylo en position d\'écriture} \n'
    prog1 += '\\blockmove{avancer de \\ovalnum{100} pas}\n'
    prog1 += '\\blockmove{tourner \\turnright{} de \\ovalnum{90} degrés}\n'
    prog1 += '}\n'
    prog1 += '\\end{scratch}'

    let prog2 = '\\begin{scratch}[print,fill,blocks,scale=0.8]\n'
    prog2 += '\\blockinit{quand \\greenflag est cliqué}\n'
    prog2 += '\\blockrepeat{répéter \\ovalnum{4} fois}\n'
    prog2 += '{\n'
    prog2 += '\\blockpen{stylo en position d\'écriture} \n'
    prog2 += '\\blockmove{avancer de \\ovalnum{100} pas}\n'
    prog2 += '\\blockmove{tourner \\turnright{} de \\ovalnum{...} degrés}\n'
    prog2 += '}\n'
    prog2 += '\\end{scratch}'

    let prog3 = '\\begin{scratch}[print,fill,blocks,scale=0.8]\n'
    prog3 += '\\blockinit{quand \\greenflag est cliqué}\n'
    prog3 += '\\blockrepeat{répéter \\ovalnum{3} fois}\n'
    prog3 += '{\n'
    prog3 += '\\blockpen{stylo en position d\'écriture} \n'
    prog3 += '\\blockmove{avancer de \\ovalnum{100} pas}\n'
    prog3 += '\\blockmove{tourner \\turnright{} de \\ovalnum{...} degrés}\n'
    prog3 += '}\n'
    prog3 += '\\end{scratch}'

    let prog4 = '\\begin{scratch}[print,fill,blocks,scale=0.8]\n'
    prog4 += '\\blockinit{quand \\greenflag est cliqué}\n'
    prog4 += '\\blockrepeat{répéter \\ovalnum{...} fois}\n'
    prog4 += '{\n'
    prog4 += '\\blockpen{stylo en position d\'écriture} \n'
    prog4 += '\\blockmove{avancer de \\ovalnum{100} pas}\n'
    prog4 += '\\blockmove{tourner \\turnright{} de \\ovalnum{90} degrés}\n'
    prog4 += '\\blockmove{avancer de \\ovalnum{50} pas}\n'
    prog4 += '\\blockmove{tourner \\turnright{} de \\ovalnum{90} degrés}\n'
    prog4 += '}\n'
    prog4 += '\\end{scratch}'
    if (this.canOfficielle) {
      this.formatInteractif = 'texte'
      this.reponse = ['carré', 'carre', 'Carré', 'carré de côté 100', 'carré de côté 100 pas']
      this.question = `${scratchblock(prog1)}`
      if (this.interactif) {
        this.question += 'La nature de la figure tracée est  un  '
      } else { this.question += 'La nature de la figure tracée est : ' }
      this.correction = `La figure obtenue est $${miseEnEvidence('carré')}$.`
    } else {
      const choix = choice(['a', 'b', 'c', 'd'])//, 'b'
      if (choix === 'a') {
        this.formatInteractif = 'texte'
        this.reponse = ['carré', 'carre', 'Carré', 'carré de côté 100', 'carré de côté 100 pas']
        this.question = `${scratchblock(prog1)}`
        if (this.interactif) {
          this.question += 'La nature de la figure tracée est  un  '
        } else { this.question += 'La nature de la figure tracée est : ' }
        this.correction = `La figure obtenue est $${miseEnEvidence('carré')}$.`
      }
      if (choix === 'b') {
        this.formatInteractif = 'calcul'
        this.reponse = 90
        this.question = `${scratchblock(prog2)}`

        this.question += 'Quel nombre doit-on écrire à la place des pointillés pour tracer un carré ?'

        this.correction = `Un carré a des angles droits, il faut donc écrire  $${miseEnEvidence(90)}$.`
      }
      if (choix === 'c') {
        this.formatInteractif = 'calcul'
        this.reponse = 120
        this.question = `${scratchblock(prog3)}`

        this.question += 'Quel nombre doit-on écrire à la place des pointillés pour tracer un triangle équilatéral ?'

        this.correction = `Un triangle équilatéral a des anlges de $60°$.<br>
     Le lutin doit tourner de $180-60=120°$ après avoir tracé un côté. <br>
     Ainsi, à la place des pointillés il faut écrire  $${miseEnEvidence(120)}$.`
      }
      if (choix === 'd') {
        this.formatInteractif = 'calcul'
        this.reponse = 2
        this.question = `${scratchblock(prog4)}`

        this.question += 'Quel nombre doit-on écrire à la place des pointillés pour tracer un triangle rectangle ?'

        this.correction = `
      La boucle contient le tracé d'une longueur et d'une largeur du rectangle. <br>
      Ainsi, à la place des pointillés il faut écrire  $${miseEnEvidence(2)}$.`
      }
    }

    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
  }
}
