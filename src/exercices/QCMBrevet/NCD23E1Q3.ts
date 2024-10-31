import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { nombreElementsDifferents } from '../ExerciceQcm'
import ExerciceQcmA from '../ExerciceQcmA'
import { texNombre } from '../../lib/outils/texNombre'

export const uuid = 'e4292'
export const refs = {
  'fr-fr': ['3QCMNNC23-3'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul d\'un pourcentage (issu du brevet décembre 2023 Nouvelle Calédonie)'
export const dateDePublication = '29/10/2024'
// Ceci est un exemple de QCM avec version originale et version aléatoire
export default class MetropoleJuin24Exo4Q1 extends ExerciceQcmA {
  // Ceci est la fonction qui s'occupe d'écrire l'énoncé, la correction et les réponses
  // Elle factorise le code qui serait dupliqué dans versionAleatoire et versionOriginale
  private appliquerLesValeurs (a: number, b: number, c: number): void {
    this.reponses = [
      `$${String(c)}$ %`,
      `$${String(100 - c)}$ %`,
      `$${String(b - a)}$ %`
    ]
    this.enonce = `Sur un site, un pantalon est vendu $${a}$ € au lieu de $${b}$ €.<br>Le pourcentage de réduction est de ...`
    this.correction = `La réduction est de $${b - a}$ € car $${b}-${a} = ${b - a}$.<br> Or $${b - a}$ sur un total de $${b}$, c'est : <br>
    $
    \\begin{aligned}
    \\dfrac{${b - a}}{${b}} &= ${texNombre((b - a) / b)} \\\\
                          &= ${miseEnEvidence(`${String(c)} \\%`)} 
    \\end{aligned}$`
  }

  // S'occupe de passser les données originales à la fonction appliquerLesValeurs
  versionOriginale: () => void = () => {
    this.appliquerLesValeurs(60, 80, 25) // valeurs originales
  }

  // s'occupe d'aléatoiriser les valeurs à passer à la fonction appliquerLesValeurs en vérifiant qu'on a bien 3 réponses différentes
  // Pour un qcm à n réponses, il faudrait vérifier que nombreElementsDifferents(this.reponses) < n
  versionAleatoire: () => void = () => {
    const n = 3 // nombre de réponses différentes voulues (on rappelle que la première réponse est la bonne)

    do {
      const tripletPrixPourcentage = choice([[160, 120, 25], [120, 90, 25], [60, 45, 25], [50, 40, 20],
        [75, 60, 20], [125, 100, 20], [90, 72, 20], [140, 112, 20], [60, 42, 30], [90, 63, 30], [120, 84, 30], [150, 105, 30]])
      const a = tripletPrixPourcentage[1]
      const b = tripletPrixPourcentage[0]
      const c = tripletPrixPourcentage[2]
      this.appliquerLesValeurs(a, b, c)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  // Ici il n'y a rien à faire, on appelle juste la version aleatoire (pour un qcm aleatoirisé, c'est le fonctionnement par défaut)
  constructor () {
    super()
    this.versionAleatoire()
  }
}
