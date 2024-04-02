import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

import { cube } from '../../modules/3d.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { deuxColonnes } from '../../lib/format/miseEnPage.js'

export const dateDePublication = '03/03/2021'
export const titre = 'Compter les cubes manquants ou pas'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const amcReady = true

/**
 * Compter des cubes dans un empilement de cubes
 * @author Erwan DUPLESSY
 * Source : http://cache.media.education.gouv.fr/file/Geometrie_et_espace/47/1/RA16_C4_MATH_geo_espace_flash_567471.pdf
 */

export const uuid = '5f115'
export const ref = '6G43'
export const refs = {
  'fr-fr': ['6G43'],
  'fr-ch': ['9ES7-6']
}
export default function DenombrerCubes () {
  Exercice.call(this)
  this.nbQuestions = 3 // Ici le nombre de questions
  this.nbQuestionsModifiable = true // Active le formulaire nombre de questions
  this.nbCols = 1 // Le nombre de colonnes dans l'énoncé LaTeX
  this.nbColsCorr = 1// Le nombre de colonne pour la correction LaTeX
  this.sup = 1 // A décommenter : valeur par défaut d'un premier paramètre
  this.sup2 = 1 // A décommenter : valeur par défaut d'un deuxième paramètre
  // c'est ici que commence le code de l'exercice cette fonction crée une copie de l'exercice
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // tableau contenant la liste des questions
    this.listeCorrections = []
    this.autoCorrection = []
    let typesDeQuestionsDisponibles = [] // tableau à compléter par valeurs possibles des types de questions
    switch (this.sup) {
      case 1:
        typesDeQuestionsDisponibles = [1]
        break
      case 2:
        typesDeQuestionsDisponibles = [2]
        break
      case 3:
        typesDeQuestionsDisponibles = [1, 2]
        break
    }

    function empilementCubes (long, larg, hmax) {
      const tabHauteurs = new Array(larg)
      for (let i = 0; i < larg; i++) {
        tabHauteurs[i] = new Array(long)
      }
      // premiere ligne
      for (let i = 0; i < larg; i++) {
        tabHauteurs[i][0] = randint(0, 1)
      }
      // deuxième ligne et suivantes
      for (let i = 0; i < larg; i++) {
        for (let j = 1; j < long; j++) {
          tabHauteurs[i][j] = Math.min(tabHauteurs[i][j - 1] + randint(1, 2), hmax)
        }
      }
      // Vérification Dernière Ligne : ne pas être vide.
      for (let i = 0; i < larg; i++) {
        tabHauteurs[i][long - 1] = Math.max(2, tabHauteurs[i][long - 1])
      }
      // Ajoute les cubes dans un tableau une dimension
      // il faut trier les cubes : x décroissant puis y décroissant, puis z croissant
      const lstCoordonneesCubes = []
      for (let i = larg - 1; i > -1; i = i - 1) {
        for (let j = long - 1; j > -1; j = j - 1) {
          for (let k = 0; k < tabHauteurs[i][j]; k++) {
            lstCoordonneesCubes.push([i, j, k])
          }
        }
      }
      return lstCoordonneesCubes
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    const longueur = 2 + parseInt(this.sup2) // longueur de l'empilement
    const largeur = longueur // largeur de l'empilement
    const hauteur = longueur // hauteur de l'empilement

    for (let q = 0, texte, texteCorr, cpt = 0; q < this.nbQuestions && cpt < 50;) {
      const objetsCorrection = [] // Idem pour la correction
      const objetsEnonce = []
      const objetsEnonce2 = []
      texte = 'Un empilement de cubes est représenté ci-dessous sous deux angles différents. <br>' // Nous utilisons souvent cette variable pour construire le texte de la question.
      texteCorr = '' // Idem pour le texte de la correction.

      let cosa, cosb, sina, sinb
      const L = empilementCubes(longueur, largeur, hauteur) // crée un empilement aléatoire
      const alpha1 = 10 // choix de la projection
      const beta1 = -40// choix de la projection
      const alpha2 = 35// choix de la projection
      const beta2 = -20 // choix de la projection
      for (let i = 0; i < L.length; i++) {
        objetsEnonce.push(...cube(L[i][0], L[i][1], L[i][2], alpha1, beta1, {}).c2d)
      }

      for (let i = 0; i < L.length; i++) {
        objetsEnonce2.push(...cube(L[i][0], L[i][1], L[i][2], alpha2, beta2, {}).c2d)
      }
      for (let i = 0; i < L.length; i++) {
        objetsCorrection.push(...cube(3 * L[i][0], L[i][1], L[i][2], alpha2, beta2, {}).c2d)
      }
      cosa = Math.cos(alpha1 * Math.PI / 180)
      sina = Math.sin(alpha1 * Math.PI / 180)
      cosb = Math.cos(beta1 * Math.PI / 180)
      sinb = Math.sin(beta1 * Math.PI / 180)
      const paramsEnonce = Object.assign({
        pixelsParCm: 20,
        scale: 0.6,
        mainlevee: false,
        style: 'display: inline'
      }, fixeBordures(objetsEnonce))

      cosa = Math.cos(alpha2 * Math.PI / 180)
      sina = Math.sin(alpha2 * Math.PI / 180)
      cosb = Math.cos(beta2 * Math.PI / 180)
      sinb = Math.sin(beta2 * Math.PI / 180)
      const paramsEnonce2 = Object.assign({
        pixelsParCm: 20,
        scale: 0.6,
        mainlevee: false,
        style: 'display: inline'
      }, fixeBordures(objetsEnonce2))
      const paramsCorrection = {
        xmin: -sina * largeur - 0.5,
        ymin: -0.5,
        xmax: cosa * longueur * 3 + 0.5,
        ymax: -sina * sinb * longueur * 1.5 - cosa * sinb * largeur + cosb * hauteur * 1.5 + 0.5,
        pixelsParCm: 20,
        scale: 0.6,
        mainlevee: false,
        style: 'display: inline'
      }
      // début de l'exercice
      switch (listeTypeDeQuestions[q]) {
        case 1:
          texte += 'Combien de petits cubes contient cet empilement de cubes ?' + ajouteChampTexteMathLive(this, q, 'largeur10 inline')
          texte += '<br>' + deuxColonnes(mathalea2d(paramsEnonce, objetsEnonce), mathalea2d(paramsEnonce2, objetsEnonce2))
          // correction :
          texteCorr += "On peut représenter l'empilement par tranches : <br>"
          texteCorr += mathalea2d(paramsCorrection, objetsCorrection) + '<br>'
          texteCorr += `Il y a au total ${L.length} cubes.`
          setReponse(this, q, L.length)
          break
        case 2:
          texte += `Combien de petits cubes manque-t-il pour reconstruire un grand cube de côté ${longueur} ?` + ajouteChampTexteMathLive(this, q, 'largeur10 inline')
          texte += '<br>' + deuxColonnes(mathalea2d(paramsEnonce, objetsEnonce), mathalea2d(paramsEnonce2, objetsEnonce2))
          // correction :
          texteCorr += "On peut, par exemple, représenter l'empilement par tranches : <br>"
          texteCorr += mathalea2d(paramsCorrection, objetsCorrection) + '<br>'
          texteCorr += `Il y a au total $${L.length}$ cubes. On en veut $${longueur}\\times ${largeur} \\times ${hauteur} = ${longueur * largeur * hauteur}$. <br>`
          texteCorr += `Il manque $${longueur * largeur * hauteur - L.length}$ cubes.`
          setReponse(this, q, longueur * largeur * hauteur - L.length)
          break
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        q++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
  this.besoinFormulaireNumerique = ['Type de questions', 3, '1 : Compter les cubes\n2 : Compter les cubes manquants\n3 : Mélange']
  this.besoinFormulaire2Numerique = ["Taille de l'empilement", 5, 'De taille 3\nDe taille 4\nDe taille 5\nDe taille 6\nDe taille 7']
}
