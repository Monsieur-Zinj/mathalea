import { miseEnEvidence } from '../../lib/outils/embellissements'
import { labyrinthe } from '../../modules/Labyrinthe.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
export const titre = 'Parcourir un labyrinthe de numération décimale'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '9/12/2020'
export const dateDeModifImportante = '22/09/2024' // Le nb de lignes et celui de colonnes du labyrinthe sont paramétrables.
/**
 * @author Jean-Claude Lhote (remaniée par EE pour la prise en compte du nb de lignes et de colonnes du labyrinthe)
 * Publié le 9/12/2020
 * Ref 6N10-5
 * Sortir du labyrinthe en utilisant la numération décimale.
 * Ajout AMC et remaniement du code pour moins d'évidence dans la solution : Janvier 2022 par EE
 */
export const uuid = '80645'
export const ref = '6N10-5'
export const refs = {
  'fr-fr': ['6N10-5'],
  'fr-ch': ['9NO1-6']
}
export default function ExerciceLabyrintheNumeration () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup2 = 1
  this.sup3 = 1
  this.sup4 = 1
  this.sup = true
  this.sup5 = false

  this.nouvelleVersion = function () {
    this.listeCorrections = []
    this.listeQuestions = []
    this.autoCorrection = []
    const tailleChiffre = !this.sup5 ? 0.7 : 1.1
    let texte, texteCorr
    const nbL = this.sup3 === 1 ? randint(2, 7) : Math.max(2, this.sup3)
    const nbC = this.sup4 === 1 ? randint(3, 7) : Math.max(3, this.sup4)
    const laby = labyrinthe({ nbLignes: nbL, nbColonnes: nbC })
    laby.niveau = randint(1, 6) // Le niveau (de 1 à 6=mélange) définit le nombre d'étapes
    const monchemin = laby.choisitChemin(laby.niveau) // On choisit un chemin
    laby.murs2d = laby.construitMurs(monchemin) // On construit le labyrinthe
    laby.chemin2d = laby.traceChemin(monchemin) // On trace le chemin solution
    const positions = this.sup ? ['dix-millièmes', 'millièmes', 'centièmes', 'dixièmes', 'unités', 'dizaines', 'centaines', 'unités de mille', 'dizaines de mille'] : ['millièmes', 'centièmes', 'dixièmes', 'unités', 'dizaines', 'centaines', 'unités de mille']
    let rang; let rangbis; let nombretemp

    const rangMax = this.sup ? 8 : 6
    const rangMin = !this.sup5 ? 0 : this.sup ? 4 : 3

    if (this.sup2 === 3) {
      rang = randint(rangMin, rangMax)
    } else if (this.sup2 === 2 && !this.sup5) {
      rang = this.sup ? randint(0, 3) : randint(0, 2)
    } else {
      rang = this.sup ? randint(4, rangMax) : randint(3, rangMax)
    }
    const chiffre = randint(1, 9)
    texte = `Trouver la sortie en ne passant que par les cases contenant un nombre dont le chiffre des ${positions[rang]} est un $${miseEnEvidence(chiffre, 'black')}$.<br>`
    texteCorr = `Voici le chemin en couleur et la sortie était le numéro $${miseEnEvidence(nbL - monchemin[monchemin.length - 1][1])}$.<br>`
    const reponsesOK = []
    for (let a = 0; a < nbC * nbL; a++) {
      let partieEntiere = this.sup ? randint(1, Math.pow(10, 5)) : randint(1, Math.pow(10, 4))
      let partieDecimale = this.sup ? randint(1, Math.pow(10, 5)) : randint(1, Math.pow(10, 4))
      if (this.sup) {
        if (rang > 3) {
          partieEntiere = Math.floor(partieEntiere / Math.pow(10, rang - 3)) * Math.pow(10, rang - 3) + chiffre * Math.pow(10, rang - 4) + (partieEntiere % Math.pow(10, rang - 4))
        } else {
          partieDecimale = Math.floor(partieDecimale / Math.pow(10, rang + 2)) * Math.pow(10, rang + 2) + chiffre * Math.pow(10, rang + 1) + (partieDecimale % Math.pow(10, rang + 1))
        }
      } else {
        partieEntiere = Math.floor(partieEntiere / Math.pow(10, rang - 2)) * Math.pow(10, rang - 2) + chiffre * Math.pow(10, rang - 3) + (partieEntiere % Math.pow(10, rang - 3))
      }

      nombretemp = !this.sup5 ? partieEntiere + partieDecimale / (this.sup ? Math.pow(10, 5) : Math.pow(10, 4)) : partieEntiere
      reponsesOK.push(nombretemp)
    }
    const reponsesPasOK = []
    for (let a = 0; a < nbC * nbL; a++) {
      let partieEntiere = this.sup ? randint(1, Math.pow(10, 5)) : randint(1, Math.pow(10, 4))
      let partieDecimale = this.sup ? randint(1, Math.pow(10, 5)) : randint(1, Math.pow(10, 4))
      if (this.sup) {
        if (rang > 3) {
          partieEntiere = Math.floor(partieEntiere / Math.pow(10, rang - 3)) * Math.pow(10, rang - 3) + randint(0, 9, [chiffre]) * Math.pow(10, rang - 4) + (partieEntiere % Math.pow(10, rang - 4))
        } else {
          partieDecimale = Math.floor(partieDecimale / Math.pow(10, rang + 2)) * Math.pow(10, rang + 2) + randint(0, 9, [chiffre]) * Math.pow(10, rang + 1) + (partieDecimale % Math.pow(10, rang + 1))
        }
        rangbis = randint(rangMin, rangMax, [rang])
        if (rangbis > 3) {
          partieEntiere = Math.floor(partieEntiere / Math.pow(10, rangbis - 3)) * Math.pow(10, rangbis - 3) + chiffre * Math.pow(10, rangbis - 4) + (partieEntiere % Math.pow(10, rangbis - 4))
        } else {
          partieDecimale = Math.floor(partieDecimale / Math.pow(10, rangbis + 2)) * Math.pow(10, rangbis + 2) + chiffre * Math.pow(10, rangbis + 1) + (partieDecimale % Math.pow(10, rangbis + 1))
        }
      } else {
        partieEntiere = Math.floor(partieEntiere / Math.pow(10, rang - 2)) * Math.pow(10, rang - 2) + randint(0, 9, [chiffre]) * Math.pow(10, rang - 3) + (partieEntiere % Math.pow(10, rang - 3))
        rangbis = randint(rangMin, rangMax, [rang])
        partieEntiere = Math.floor(partieEntiere / Math.pow(10, rangbis - 2)) * Math.pow(10, rangbis - 2) + chiffre * Math.pow(10, rangbis - 3) + (partieEntiere % Math.pow(10, rangbis - 3))
      }
      nombretemp = !this.sup5 ? partieEntiere + partieDecimale / (this.sup ? Math.pow(10, 5) : Math.pow(10, 4)) : partieEntiere
      reponsesPasOK.push(nombretemp)
    }
    // Le tableau de nombre étant fait, on place les objets nombres.
    laby.nombres2d = laby.placeNombres(monchemin, reponsesOK, reponsesPasOK, tailleChiffre)
    const params = { xmin: -4, ymin: 0, xmax: 5 + 3 * nbC, ymax: 2 + 3 * nbL, pixelsParCm: 20, scale: 0.7 }
    texte += mathalea2d(params, laby.murs2d, laby.nombres2d)
    texteCorr += mathalea2d(params, laby.murs2d, laby.nombres2d, laby.chemin2d)
    if (context.isAmc) {
      this.autoCorrection = [
        {
          enonce: texte,
          propositions: [
            {
              statut: 3, // (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
              sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève

            }
          ]
        }
      ]
    }
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Avec des dizaines de mille et des dix-millièmes']
  // this.besoinFormulaire2Numerique = ['Niveau de rapidité', 6, ' 1 : Escargot\n 2 : Tortue\n 3 : Lièvre\n 4 : Antilope\n 5 : Guépard\n 6 : Au hasard']
  this.besoinFormulaire2Numerique = ['Quel chiffre recherché ?', 3, ' 1 : Unité ou au-dessus\n 2 : En dessous de l\'unité\n 3 : Peu importe']
  this.besoinFormulaire3Numerique = ['Nombre de lignes du labyrinthe (entre 2 et 7 ou bien 1 si vous laissez le hasard décider)', 7]
  this.besoinFormulaire4Numerique = ['Nombre de colonnes du labyrinthe (entre 2 et 7 ou bien 1 si vous laissez le hasard décider)', 7]
  this.besoinFormulaire5CaseACocher = ['Que des nombres entiers']
} // Fin de l'exercice.
