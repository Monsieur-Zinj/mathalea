import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { texNombre } from '../../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import { randint } from '../../../modules/outils'
import { Arbre } from '../../../modules/arbres'
import { mathalea2d } from '../../../modules/2dGeneralites'
export const titre = 'Calculer une probabilité dans un arbre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'fe2e1'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class probaArbre extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    const pA = this.canOfficielle ? new Decimal(0.4) : (new Decimal(randint(1, 9, 5))).div(10)
    const pAbarre = (new Decimal((pA)).mul(-1)).add(1)
    const pBsachantA = this.canOfficielle ? new Decimal(0.5) : (new Decimal(randint(1, 9, 5))).div(10)

    const pBsachantAbarre = this.canOfficielle ? new Decimal(0.1) : (new Decimal(randint(1, 9, 5))).div(10)

    this.reponse = new Decimal((pA)).mul(pBsachantA).add((pAbarre).mul(pBsachantAbarre))

    const omega = new Arbre({
      racine: true,
      rationnel: false,
      nom: '',
      proba: 1,
      visible: false,
      alter: '',
      enfants: [
        new Arbre(
          {
            rationnel: false,
            nom: 'A',
            proba: pA,
            visible: true,
            alter: '',
            enfants: [new Arbre(
              {
                rationnel: false,
                nom: 'B',
                proba: pBsachantA,
                visible: true,
                alter: ''
              }),
            new Arbre(
              {
                rationnel: false,
                visible: false,
                nom: '\\overline{B}',
                proba: 1
              })
            ]
          }),
        new Arbre({
          rationnel: false,
          nom: '\\overline{A}',
          proba: 1,
          visible: false,
          enfants: [new Arbre({
            rationnel: false,
            visible: true,
            nom: 'B',
            proba: new Decimal(pBsachantAbarre)
          }),
          new Arbre({
            rationnel: false,
            visible: false,
            nom: '\\overline{B}',
            proba: new Decimal(pBsachantAbarre).sub(1).mul(-1)
          })
          ]
        })
      ]
    })

    omega.setTailles() // On calcule les tailles des arbres.
    const objets = omega.represente(0, 7, 0, 1.5, true, 1) // On crée l'arbre complet echelle 1.4 feuilles verticales sens gauche-droite
    this.question = 'On donne l\'arbre de probabilités ci-dessous :<br>'
    this.question += mathalea2d({
      xmin: -0.1,
      xmax: 14,
      ymin: 1.5,
      ymax: 7,
      style: 'inline',
      scale: 0.8
    }, ...objets)

    if (this.interactif) {
      this.question += '<br> $P(B)=$ '
    } else {
      this.question += '<br>$P(B)=\\ldots$ '
    }

    this.correction = `On utilise la formule des probabilités totales pour calculer $P(B)$ :<br>
          $\\begin{aligned}
          P(B)&=P(A\\cap B)+P(\\bar{A}\\cap B)\\\\
          &=${texNombre(pA, 1)}\\times ${texNombre(pBsachantA, 1)}+${texNombre(pAbarre, 1)}\\times ${texNombre(pBsachantAbarre, 1)}\\\\
&=${miseEnEvidence(texNombre(this.reponse, 2))}
          \\end{aligned}$
      `
    this.canEnonce = 'On donne l\'arbre de probabilités ci-dessous :<br>' + mathalea2d({
      xmin: -0.1,
      xmax: 14,
      ymin: 1,
      ymax: 7,
      style: 'inline',
      scale: 0.7
    }, ...objets)

    this.canReponseACompleter = '$P(B)=\\ldots$'
  }
}
