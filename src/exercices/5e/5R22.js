import { choice } from '../../lib/outils/arrayOutils'
import { sommeDesTermesParSigne } from '../../lib/outils/calculs'
import {
  ecritureAlgebrique,
  ecritureAlgebriquec,
  ecritureNombreRelatif,
  ecritureNombreRelatifc
} from '../../lib/outils/ecritures'
import { nombreDeChiffresDansLaPartieEntiere, signe, triePositifsNegatifs } from '../../lib/outils/nombres'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombreCoul } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Effectuer un enchaînement d\'additions et de soustractions de nombres relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Effectuer la somme ou la différence de plusieurs relatifs
 *
 * * On peut paramétrer les distances à zéro qui sont par défaut inférieures à 20
 * * On peut utiliser des écritures simplifiées (ce qui n'est pas le cas par défaut)
 * @author Rémi Angot modifications par Jean-Claude Lhote (Correction optimisée par Eric Elter)
 */
export const uuid = 'f6ea7'
export const ref = '5R22'
export const refs = {
  'fr-fr': ['5R22'],
  'fr-ch': ['9NO9-15']
}
export default function ExerciceAdditionsSoustractionRelatifsV2 (max = 20) {
  Exercice.call(this)
  this.sup = max
  this.sup2 = false // écriture simplifiée
  this.nbCols = 2
  this.nbColsCorr = 2
  this.nbQuestions = 6 // Pour que les colonnes soient équilibrées !
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.consigne = this.interactif ? 'Calculer.' : 'Calculer, en détaillant les calculs.'
    let relatifs
    let sommesSignees
    for (let i = 0, a, b, c, d, e, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // On limite le nombre d'essais pour chercher des valeurs nouvelles
      relatifs = []
      sommesSignees = []
      a = -1
      b = choice([-1, 1])
      if (a === -1 & b === -1) {
        c = 1
      } else { // On s'assure que les 3 premières termes n'ont pas le même signe
        c = choice([-1, 1])
      }
      a = randint(1, this.sup) * a
      b = randint(1, this.sup) * b
      c = randint(1, this.sup) * c
      d = randint(1, this.sup) * choice([-1, 1])
      e = randint(1, this.sup) * choice([-1, 1])
      const s1 = choice([-1, 1])
      const s2 = choice([-1, 1])
      const s4 = choice([-1, 1])
      let s3
      if (s1 === 1 & s2 === 1) { // On s'assure que les 3 premières opérations ne sont pas identiques
        s3 = -1
      } else if (s1 === -1 & s2 === -1) {
        s3 = 1
      } else {
        s3 = choice([-1, 1])
      }
      if (this.sup2) {
        texte = `$ ${lettreDepuisChiffre(i + 1)} = ${a}${ecritureAlgebrique(b)}${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}${ecritureAlgebrique(e)}$`
        if (this.interactif && context.isHtml) {
          texte += `$${sp(1)} = $` + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
        }
        if (!context.isHtml && !context.isAmc) {
          texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
        }
        relatifs = triePositifsNegatifs([a, b, c, d, e])
        texteCorr = `$ ${lettreDepuisChiffre(i + 1)}=${texNombreCoul(a, 'blue', '#f15929')}${ecritureAlgebriquec(b)}${ecritureAlgebriquec(c)}${ecritureAlgebriquec(d)}${ecritureAlgebriquec(e)}$<br>`
        texteCorr += `$${lettreDepuisChiffre(i + 1)}=`
        if (sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0 && sommeDesTermesParSigne([a, b, c, d, e])[1] !== 0) {
          texteCorr += `${texNombreCoul(relatifs[0], 'blue', '#f15929')}${ecritureAlgebriquec(relatifs[1])}${ecritureAlgebriquec(relatifs[2])}${ecritureAlgebriquec(relatifs[3])}${ecritureAlgebriquec(relatifs[4])}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)}=`
          texteCorr += `${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929')}${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1])}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)}=`
          texteCorr += `${texNombreCoul(a + b + c + d + e, 'blue', '#f15929')} $`
        } else if (sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0) {
          texteCorr += `${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929')}$`
        } else {
          texteCorr += `${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1], 'blue', '#f15929')}$`
        }
      } else {
        texte = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
        if (this.interactif && context.isHtml) {
          texte += `$${sp(1)} = $` + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
        }
        if (!context.isHtml && !context.isAmc) {
          texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
        }
        texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${a}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
        texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(a)}+${ecritureNombreRelatifc(s1 * b)}+${ecritureNombreRelatifc(s2 * c)}+${ecritureNombreRelatifc(s3 * d)}+${ecritureNombreRelatifc(s4 * e)} $`

        relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])

        if (relatifs[0] > 0 & relatifs[4] < 0) {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(relatifs[0])}+${ecritureNombreRelatifc(relatifs[1])}+${ecritureNombreRelatifc(relatifs[2])}+${ecritureNombreRelatifc(relatifs[3])}+${ecritureNombreRelatifc(relatifs[4])} $`
        }
        sommesSignees = sommeDesTermesParSigne([relatifs[0], relatifs[1], relatifs[2], relatifs[3], relatifs[4]])
        if (sommesSignees[0] !== 0 && sommesSignees[1] !== 0) {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(sommesSignees[0])}+${ecritureNombreRelatifc(sommesSignees[1])} $`
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureAlgebriquec(a + s1 * b + s2 * c + s3 * d + s4 * e, orangeMathalea)} $<br>`
        } else if (sommesSignees[0] !== 0) {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[0], orangeMathalea)}$`
        } else {
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[1], orangeMathalea)}$<br>`
        }
      }

      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (!this.sup2) {
          handleAnswers(this, i, { reponse: { value: a + s1 * b + s2 * c + s3 * d + s4 * e, compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCOpen',
                  propositions: [{
                    enonce: this.consigne + '<br>' + texte,
                    texte: texteCorr,
                    statut: 3,
                    pointilles: true
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'Résultat',
                      valeur: [a + s1 * b + s2 * c + s3 * d + s4 * e],
                      param: {
                        digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(a + s1 * b + s2 * c + s3 * d + s4 * e)),
                        decimals: 0,
                        signe: true,
                        exposantNbChiffres: 0,
                        exposantSigne: false,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          }
        } else {
          handleAnswers(this, i, { reponse: { value: a + b + c + d + e, compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCOpen',
                  propositions: [{
                    enonce: this.consigne + '<br>' + texte,
                    texte: texteCorr,
                    statut: 3,
                    pointilles: true
                  }]
                },
                {
                  type: 'AMCNum',
                  propositions: [{
                    texte: '',
                    statut: '',
                    reponse: {
                      texte: 'Résultat',
                      valeur: [a + b + c + d + e],
                      param: {
                        digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(a + b + c + d + e)),
                        decimals: 0,
                        signe: true,
                        exposantNbChiffres: 0,
                        exposantSigne: false,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          }
        }

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale', 99999]
  this.besoinFormulaire2CaseACocher = ['Avec des écritures simplifiées']
}
