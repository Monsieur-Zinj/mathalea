import { choice } from '../../lib/outils/arrayOutils'
import { sommeDesTermesParSigne } from '../../lib/outils/calculs'
import {
  ecritureAlgebrique,
  ecritureAlgebriquec,
  ecritureNombreRelatif,
  ecritureNombreRelatifc,
  ecritureParentheseSiNegatif
} from '../../lib/outils/ecritures'
import { nombreDeChiffresDansLaPartieEntiere, signe, triePositifsNegatifs } from '../../lib/outils/nombres'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Additions de 5 nombres relatifs'
export const interactifReady = true

export const amcReady = true
export const amcType = 'AMCNum'
export const interactifType = 'mathLive'
export const dateDeModifImportante = '25/9/2024'

/**
 * Effectuer la somme de 5 nombres relatifs.
 *
 * Pour la correction, on commence par effectuer la somme des termes de même signe
 *
 * * On peut paramétrer les distances à zéro qui sont par défaut inférieures à 20
 * * On peut utiliser des écritures simplifiées (ce qui n'est pas le cas par défaut)
 * @author Rémi Angot
 * 5R20-3
 */
export const uuid = '36e2a'
export const ref = '5R20-3'
export const refs = {
  'fr-fr': ['5R20-3'],
  'fr-ch': ['9NO9-8']
}
export default class ExerciceAdditionsDe5Relatifs extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4
    this.sup = 20
    this.sup2 = 1
    this.consigne = 'Calculer.'
    this.spacing = 2
    this.spacingCorr = context.isHtml ? 3 : 0.5
    this.nbCols = 2
    this.nbColsCorr = 2
    this.interactifReady = interactifReady
    this.interactifType = interactifType
    this.amcType = amcType
    this.amcReady = amcReady
    this.besoinFormulaireNumerique = ['Valeur maximale', 99999]
    this.besoinFormulaire2Numerique = ['Type de questions', 3, 'Tous les nombres entre parenthèses \n2 : Seul les termes négatifs sont entre parenthèses \n3 : Écriture simplifiée']
  }

  nouvelleVersion () {
    // Rétrocompatibilité avec les liens vers les exercices quand c'était des cases à cocher
    if (this.sup2 === false) {
      this.sup2 = 1
    } else if (this.sup2 === true) {
      this.sup2 = 3
    }
    if (!context.isHtml) this.interactif = false
    if (this.interactif) {
      this.spacing = 3
    }
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let c, relatifs
      let texte = ''
      let texteCorr = ''
      // On limite le nombre d'essais pour chercher des valeurs nouvelles
      const a = randint(1, this.sup) * choice([-1, 1])
      const b = randint(1, this.sup) * choice([-1, 1])
      if (a * b > 0) {
        // On s'assure que les 3 premières termes n'ont pas le même signe
        c = randint(1, this.sup) * (a > 0 ? -1 : 1)
      } else {
        c = randint(1, this.sup) * choice([-1, 1])
      }
      const d = randint(1, this.sup) * choice([-1, 1])
      const e = randint(1, this.sup) * choice([-1, 1])
      const s1 = 1 // Que des additions
      const s2 = 1
      const s3 = 1
      const s4 = 1
      const reponse = a + b + c + d + e
      if (this.sup2 === 3) {
        texte = `$ ${lettreDepuisChiffre(i + 1)} = ${a}${ecritureAlgebrique(b)}${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}${ecritureAlgebrique(
                    e
                )}$`

        texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${a}${ecritureAlgebrique(b)}${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}${ecritureAlgebrique(
                    e
                )}$`
        texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)} = ${sommeDesTermesParSigne([a, b, c, d, e])[0]}${ecritureAlgebrique(sommeDesTermesParSigne([a, b, c, d, e])[1])} $`
        texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)} = ${a + b + c + d + e} $`
      } else if (this.sup2 === 2) {
        texte = `$ ${lettreDepuisChiffre(i + 1)} = ${a} + ${ecritureParentheseSiNegatif(b)} + ${ecritureParentheseSiNegatif(c)} + ${ecritureParentheseSiNegatif(d)} + ${ecritureParentheseSiNegatif(
                    e
                )}$`

        texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${a} + ${ecritureParentheseSiNegatif(b)} + ${ecritureParentheseSiNegatif(c)} + ${ecritureParentheseSiNegatif(d)} + ${ecritureParentheseSiNegatif(
                    e
                )}$`
        texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)} = ${sommeDesTermesParSigne([a, b, c, d, e])[0]} + ${ecritureParentheseSiNegatif(sommeDesTermesParSigne([a, b, c, d, e])[1])}$`
        texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)} = ${a + b + c + d + e} $`
      } else if (this.sup2 === 1) {
        texte = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(
                    c
                )}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`

        texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(
                    c
                )}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)} $`
        relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])

        if ((relatifs[0] > 0) & (relatifs[4] < 0)) {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(relatifs[0])}+${ecritureNombreRelatifc(relatifs[1])}+${ecritureNombreRelatifc(
                        relatifs[2]
                    )}+${ecritureNombreRelatifc(relatifs[3])}+${ecritureNombreRelatifc(relatifs[4])} $`
        }
        const sommesSignees = sommeDesTermesParSigne([relatifs[0], relatifs[1], relatifs[2], relatifs[3], relatifs[4]])
        if (sommesSignees[0] !== 0 && sommesSignees[1] !== 0) {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(sommesSignees[0])}+${ecritureNombreRelatifc(sommesSignees[1])} $`
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureAlgebriquec(a + s1 * b + s2 * c + s3 * d + s4 * e)}$<br>`
        } else if (sommesSignees[0] !== 0) {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[0])}$`
        } else {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[1])}$<br>`
        }
      }

      if (!context.isHtml && !context.isAmc) {
        texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
      }

      if (this.interactif && !context.isAmc) {
        // Supprime le dernier caractère de texte et le remplace par = $
        texte += `<br> $${lettreDepuisChiffre(i + 1)} = $ ` + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en créé une autre
        setReponse(this, i, reponse, {
          signe: true,
          digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(reponse)),
          decimals: 0
        })
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
