import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer un prix après une évolution en pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export const uuid = '7487c'
export const ref = 'can5P01'
export const refs = {
  'fr-fr': ['can5P01'],
  'fr-ch': []
}
export default function PoucentageE () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.optionsChampTexte = { texteApres: ' €' }
  this.nouvelleVersion = function () {
    let a, b, n
    switch (choice(['a', 'b', 'c', 'd', 'e'])) { //
      case 'a':
        a = calculANePlusJamaisUtiliser(randint(4, 13) * 5)
        n = choice(['pull', 'pantalon', 'tee-shirt', 'vêtement', 'blouson', 'sweat'])
        b = choice([10, 20])
        this.question = `Le prix d'un ${n} est $${a}$ €.<br>
        Il baisse de $${b}${sp(1)}\\%$.<br>
         Quel est son nouveau prix ? `
        this.optionsChampTexte = { texteApres: '€' }
        this.correction = `Le nouveau prix est de $${texNombre(a - (b * a) / 100)} $ €.`
        if (b === 10) {
          this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On calcule d'abord le montant de la réduction. <br>
    Prendre $10${sp(1)}\\%$  d'une quantité revient à la diviser par $10$. <br>
    Ainsi, $${b}${sp(1)}\\%$  de $${a}$ est égal à $${a}\\div 10=${a / 10}$.<br>
                 La réduction est donc de : $${texNombre(b * a / 100)}$ €.<br>
         Le nouveau prix est :   $${a}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
    
  `)
        } else {
          this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On calcule d'abord le montant de la réduction. <br>
    Pour calculer $20${sp(1)}\\%$  d'une quantité, on commence par calculer $10${sp(1)}\\%$  en divisant
    par $10$ :<br> $10${sp(1)}\\%$ de $${a}$ est égal à $${a}\\div 10=${a / 10}$.<br>
    Puisque $20${sp(1)}\\%$  est deux fois plus grand que $10${sp(1)}\\%$ ,  $20${sp(1)}\\%$  de $${a}$ est égal à $2\\times ${a / 10}=${2 * a / 10}$.<br>
                    La réduction est donc de : $${texNombre(b * a / 100)}$ €.<br>
         Le nouveau prix est :   $${a}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
    
`)
        }
        this.reponse = calculANePlusJamaisUtiliser(a - (b * a) / 100)
        break
      case 'b':
        a = calculANePlusJamaisUtiliser(randint(2, 6) * 10)
        n = choice(['pull', 'pantalon', 'tee-shirt', 'vêtement', 'blouson', 'sweat'])
        b = choice([5, 15])
        this.question = `Le prix d'un ${n} est $${a}$ €.<br>
        Il baisse de $${b}${sp(1)}\\%$.<br>
         Quel est son nouveau prix ? `
        this.optionsChampTexte = { texteApres: '€' }
        this.correction = `
         Le nouveau prix est :  $ ${texNombre(a - (b * a) / 100)} $ €.`
        if (b === 5) {
          this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On calcule d'abord le montant de la réduction. <br>
    Pour calculer $5${sp(1)}\\%$  d'une quantité, on commence par calculer $10${sp(1)}\\%$  en divisant
    par $10$ :<br> $10${sp(1)}\\%$  de $${a}$ est égal à $${a}\\div 10=${a / 10}$.<br>
    Puisque $5${sp(1)}\\%$  est deux fois plus petit  que $10${sp(1)}\\%$ ,  $5${sp(1)}\\%$  de $${a}$ est égal à $ ${a / 10}\\div 2=${a / 20}$.<br>
                 La réduction est donc de : $${texNombre(b * a / 100)}$ €.<br>
         Le nouveau prix est :   $${a}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
    
  `)
        } else {
          this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On calcule d'abord le montant de la réduction. <br>
    Pour calculer $15${sp(1)}\\%$  d'une quantité, on commence par calculer $10${sp(1)}\\%$  en divisant
    par $10$ :<br> $10${sp(1)}\\%$ de $${a}$ est égal à $${a}\\div 10=${a / 10}$.<br>
    Puis on calcule $5${sp(1)}\\%$  de $${a}$ qui est égal à la moitié de $10${sp(1)}\\%$  de $${a}$, soit
    $${a / 10}\\div 2=${a / 20}$.<br>
    Puisque $15${sp(1)}\\%$  est égal à $10${sp(1)}\\%$  $+5${sp(1)}\\%$ ,  $15${sp(1)}\\%$  de $${a}$ est égal à $${a / 10}+${a / 20}=${3 * a / 20}$.<br>
                    La réduction est donc de : $${texNombre(3 * a / 20)}$ €.<br>
         Le nouveau prix est :   $${a}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
    
`)
        }

        this.reponse = calculANePlusJamaisUtiliser(a - (b * a) / 100)
        break
      case 'c':
        a = calculANePlusJamaisUtiliser(randint(4, 13) * 5)
        n = choice(['pull', 'pantalon', 'tee-shirt', 'vêtement', 'blouson'])
        b = choice([10, 20])
        this.question = `Le prix d'un ${n} est $${a}$ €.<br>
        Il augmente de $${b}${sp(1)}\\%$.<br>
        Quel est son nouveau prix ? `
        this.optionsChampTexte = { texteApres: '€' }
        this.correction = `
         Le nouveau prix est :  $ ${texNombre(a + (b * a) / 100)} $ €.`
        this.reponse = calculANePlusJamaisUtiliser(a + (b * a) / 100)
        if (b === 10) {
          this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On calcule d'abord le montant de l'augmentation. <br>
    Prendre $10${sp(1)}\\%$  d'une quantité revient à la diviser par $10$. <br>
    Ainsi, $${b}${sp(1)}\\%$ de $${a}$ est égal à $${a}\\div 10=${texNombre(a / 10)}$.<br>
                 L'augmentation est donc de : $${texNombre(b * a / 100)}$ €.<br>
         Le nouveau prix est :   $${a}+${texNombre(b * a / 100)}= ${texNombre(a + (b * a) / 100)}$  €.
    
  `)
        } else {
          this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On calcule d'abord le montant de l'augmentation. <br>
    Pour calculer $20${sp(1)}\\%$ d'une quantité, on commence par calculer $10${sp(1)}\\%$  en divisant
    par $10$ :<br> $10${sp(1)}\\%$  de $${a}$ est égal à $${a}\\div 10=${texNombre(a / 10)}$.<br>
    Puisque $20${sp(1)}\\%$  est deux fois plus grand que $10${sp(1)}\\%$ ,  $20${sp(1)}\\%$  de $${a}$ est égal à $2\\times ${a / 10}=${2 * a / 10}$.<br>
                    L'augmentation est donc de : $${texNombre(b * a / 100)}$ €.<br>
         Le nouveau prix est :   $${a}+${texNombre(b * a / 100)}= ${texNombre(a + (b * a) / 100)}$  €.
    
`)
        }
        break
      case 'd':
        a = calculANePlusJamaisUtiliser(randint(10, 20) * 1000)
        b = randint(1, 5)
        this.question = `Le prix d'une voiture est $${texNombre(a)}$ €.<br>
        Il augmente de $${b}${sp(1)}\\%$.<br>
         Quel est son nouveau prix ? `
        this.optionsChampTexte = { texteApres: '€' }
        this.correction = `
         Le nouveau prix est :   $ ${texNombre(a + (b * a) / 100)} $ €.`
        this.reponse = calculANePlusJamaisUtiliser(a + (b * a) / 100)
        if (b === 1) {
          this.correction += texteEnCouleur(`
        <br> Mentalement : <br>
        On calcule d'abord le montant de l'augmentation. <br>
        Prendre $1${sp(1)}\\%$  d'une quantité revient à la diviser par $100$. <br>
        Ainsi, $${texNombre(b)}${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(a)}\\div 100=${texNombre(a / 100)}$.<br>
                     L'augmentation est donc de : $${texNombre(b * a / 100)}$ €.<br>
             Le nouveau prix est :   $${texNombre(a)}+${texNombre(b * a / 100)}= ${texNombre(a + (b * a) / 100)}$  €.
        
      `)
        }
        if (b === 5) {
          this.correction += texteEnCouleur(`
        <br> Mentalement : <br>
        On calcule d'abord le montant de l'augmentation. <br>
        Pour calculer $5${sp(1)}\\%$  d'une quantité, on commence par calculer $10${sp(1)}\\%$  en divisant
        par $10$ :<br> $10${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(a)}\\div 10=${texNombre(a / 10)}$.<br>
        Puisque $5${sp(1)}\\%$  est deux fois plus petit  que $10${sp(1)}\\%$ ,  $5${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $ ${texNombre(a / 10)}\\div 2=${texNombre(a / 20)}$.<br>
                     L'augmentation est donc de : $${texNombre(b * a / 100)}$ €.<br>
             Le nouveau prix est :   $${texNombre(a)}+${texNombre(b * a / 100)}= ${texNombre(a + (b * a) / 100)}$  €.
        
      `)
        }
        if (b === 2 || b === 3 || b === 4) {
          this.correction += texteEnCouleur(`
        <br> Mentalement : <br>
        On calcule d'abord le montant de l'augmenattion. <br>
        Pour calculer $${texNombre(b)}${sp(1)}\\%$  d'une quantité, on commence par calculer $1${sp(1)}\\%$  en divisant
        par $100$ :<br> $1${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(a)}\\div 100=${texNombre(a / 100)}$.<br>
        Puisque $${texNombre(b)}${sp(1)}\\%$  est $${b}$ fois plus grand que $1${sp(1)}\\%$ ,  $${texNombre(b)}${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(b)}\\times ${texNombre(a / 100)}=${texNombre(b * a / 100)}$.<br>
                        L'augmentation est donc de : $${texNombre(b * a / 100)}$ €.<br>
             Le nouveau prix est :   $${texNombre(a)}+${texNombre(b * a / 100)}= ${texNombre(a + (b * a) / 100)}$  €.
        
    `)
        }

        break
      case 'e':
        a = calculANePlusJamaisUtiliser(randint(10, 20) * 1000)
        b = randint(1, 5)
        this.question = `Le prix d'une voiture est $${texNombre(a)}$ €.<br>
        Il baisse de $${b}${sp(1)}\\%$.<br>
        Quel est son nouveau prix ? `
        this.optionsChampTexte = { texteApres: '€' }
        this.correction = `
         Le nouveau prix est :   $ ${texNombre(a - (b * a) / 100)} €.$`
        this.reponse = calculANePlusJamaisUtiliser(a - (b * a) / 100)
        if (b === 1) {
          this.correction += texteEnCouleur(`
        <br> Mentalement : <br>
        On calcule d'abord le montant de la réduction. <br>
        Prendre $1${sp(1)}\\%$  d'une quantité revient à la diviser par $100$. <br>
        Ainsi, $${b}${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(a)}\\div 100=${texNombre(a / 100)}$.<br>
        La réduction est donc de : $${texNombre(b * a / 100)}$ €.<br>
             Le nouveau prix est :   $${texNombre(a)}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
        
      `)
        }
        if (b === 5) {
          this.correction += texteEnCouleur(`
        <br> Mentalement : <br>
        On calcule d'abord le montant de la réduction. <br>
        Pour calculer $5${sp(1)}\\%$  d'une quantité, on commence par calculer $10${sp(1)}\\%$  en divisant
        par $10$ :<br> $10${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(a)}\\div 10=${texNombre(a / 10)}$.<br>
        Puisque $5${sp(1)}\\%$  est deux fois plus petit  que $10${sp(1)}\\%$ ,  $5${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $ ${a / 10}\\div 2=${a / 20}$.<br>
        La réduction est donc de : $${texNombre(b * a / 100)}$ €.<br>
             Le nouveau prix est :   $${texNombre(a)}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
        
      `)
        }
        if (b === 2 || b === 3 || b === 4) {
          this.correction += texteEnCouleur(`
        <br> Mentalement : <br>
        On calcule d'abord le montant de la réduction. <br>
        Pour calculer $${b}${sp(1)}\\%$  d'une quantité, on commence par calculer $1${sp(1)}\\%$  en divisant
        par $100$ :<br> $1${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${texNombre(a)}\\div 100=${texNombre(a / 100)}$.<br>
        Puisque $${b}${sp(1)}\\%$  est $${b}$ fois plus grand que $1${sp(1)}\\%$,  $${b}${sp(1)}\\%$  de $${texNombre(a)}$ est égal à $${b}\\times ${a / 100}=${b * a / 100}$.<br>
        La réduction est donc de : $${texNombre(b * a / 100)}$ €.<br>
             Le nouveau prix est :   $${texNombre(a)}-${texNombre(b * a / 100)}= ${texNombre(a - (b * a) / 100)}$  €.
        
    `)
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = '$\\ldots$ €'
  }
}
