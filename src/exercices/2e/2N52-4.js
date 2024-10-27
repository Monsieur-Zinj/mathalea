import { combinaisonListesSansChangerOrdre } from '../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../lib/outils/embellissements'
import { texFractionReduite, texFractionSigne } from '../../lib/outils/deprecatedFractions.js'
import { reduireAxPlusB } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Résoudre des équations se ramenant au produit-nul'

/**
 * Résoudre des équations se ramenant au produit-nul
* @author Stéphane Guyon
* 2N52-4 (ex 2L12-2)
*/
export const uuid = '93432'
export const ref = '2N52-4'
export const refs = {
  'fr-fr': ['2N52-4'],
  'fr-ch': ['11FA10-3']
}
export default function Equationspresqueproduitnulle () {
  Exercice.call(this)
  this.titre = titre
  this.video = ''
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 3
  this.spacingCorr = 3
  this.nbQuestions = 5
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = true

  this.nouvelleVersion = function () {
    this.consigne = `Résoudre dans $\\mathbb R$ ${this.nbQuestions > 1 ? 'les équations suivantes' : 'l\'équation suivante'} :`
    if (this.interactif) {
      this.consigne += "<br>On donnera la réponse sous forme d'un ensemble de solution."
    }
    const typesDeQuestionsDisponibles = [1, 2, 3, 4, 5]
    let valeursSolution

    const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, a, b, c, d, e, f, f1, f2, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(-9, 9, [-1, 0, 1]) // on évite a=1, -1 ou 0
      b = randint(-9, 9, 0)
      c = randint(-9, 9, 0)
      d = randint(-9, 9, 0)
      e = randint(-9, 9, [0, c, -c]) // on évite que c+e et c-e soit égal à 0 et on évite e=0
      f = randint(-9, 9, [0, d, -d]) // on évite que d+f et d-f soit égal à 0 et on évite f=0

      switch (typesDeQuestions) {
        case 1: // (ax+b)(cx+d)+(ax+b)(ex+f)=0
          texte = ` ($${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})+(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})=0$`
          texteCorr = ` $(${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})+(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += ` On observe que $(${reduireAxPlusB(a, b)})$ est un facteur commun dans les deux termes :<br>`
            texteCorr += ` $\\phantom{\\iff} (\\underline{${reduireAxPlusB(a, b)}})( ${reduireAxPlusB(c, d)})+(\\underline{${reduireAxPlusB(a, b)})}( ${reduireAxPlusB(e, f)})=0$<br>`
            texteCorr += ` $\\iff (\\underline{${reduireAxPlusB(a, b)}})\\Big(( ${reduireAxPlusB(c, d)})+(${reduireAxPlusB(e, f)})\\Big)=0$<br>`
          }
          texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c + e, d + f)})=0$<br>`
          if (c + e === 0) {
            texteCorr += `$\\iff ${reduireAxPlusB(a, b)}=0$<br>`
            texteCorr += `$x=${texFractionSigne(-b, a)}$<br>`
            texteCorr += `L'équation admet une unique solution : $S=\\left\\{${texFractionReduite(-b, a)}\\right\\}$.`
          } else {
            texteCorr += 'On reconnaît une équation produit-nul, donc on applique la propriété :<br>'
            texteCorr += `${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>`
            texteCorr += ` $\\iff ${reduireAxPlusB(a, b)}=0\\quad$ ou bien $\\quad ${reduireAxPlusB(c + e, d + f)}=0$<br>`
            texteCorr += `$\\iff x=${texFractionSigne(-b, a)}\\quad$ ou $\\quad x=${texFractionSigne(-d - f, c + e)}$<br>
                       On en déduit :  `
            if ((-d - f) / (c + e) < -b / a) {
              valeursSolution = `${fraction(-d - f, c + e).texFractionSimplifiee};${fraction(-b, a).texFractionSimplifiee}`
            } else {
              valeursSolution = `${fraction(-b, a).texFractionSimplifiee};${fraction(-d - f, c + e).texFractionSimplifiee}`
            }
          }

          break
        case 2: // (ax+b)(cx+d)+(ax+b)(ex+f)=0
          texte = ` ($${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})-
                    ( ${reduireAxPlusB(a, b)})( ${reduireAxPlusB(e, f)})=0$`
          texteCorr = ` $(${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})-
                    ( ${reduireAxPlusB(a, b)})( ${reduireAxPlusB(e, f)})=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += ` On observe que $(${reduireAxPlusB(a, b)})$ est un facteur commun dans les deux termes :<br>`
            texteCorr += ` $\\phantom{\\iff} (\\underline{${reduireAxPlusB(a, b)}})( ${reduireAxPlusB(c, d)})- (\\underline{${reduireAxPlusB(a, b)})}( ${reduireAxPlusB(e, f)})=0$<br>`
            texteCorr += ` $\\iff (\\underline{${reduireAxPlusB(a, b)}})\\Big(( ${reduireAxPlusB(c, d)})-( ${reduireAxPlusB(e, f)})\\Big)=0$<br>`
          }
          if (e > 0) texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)}${reduireAxPlusB(-e, -f)})=0$<br>`
          else texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)}+${reduireAxPlusB(-e, -f)})=0$<br>`
          texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c - e, d - f)})=0$<br>`
          if (c - e === 0) {
            texteCorr += `$\\iff ${reduireAxPlusB(a, b)}=0$<br>`
            texteCorr += `$x=${texFractionSigne(-b, a)}$<br>`
            texteCorr += `L'équation admet une unique solution : $S=\\left\\{${texFractionReduite(-b, a)}\\right\\}$.`
          } else {
            texteCorr += 'On reconnaît une équation produit-nul, donc on applique la propriété :<br>'
            texteCorr += `${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>`
            texteCorr += ` $\\iff ${reduireAxPlusB(a, b)}=0\\quad$ ou bien $\\quad ${reduireAxPlusB(c - e, d - f)}=0$<br>`
            texteCorr += `$\\iff x=${texFractionSigne(-b, a)}\\quad$ ou $\\quad x=${texFractionSigne(-d + f, c - e)}$<br>
                   On en déduit :  `
            if ((-d + f) / (c - e) < -b / a) {
              valeursSolution = `${fraction(-d + f, c - e).texFractionSimplifiee};${fraction(-b, a).texFractionSimplifiee}`
            } else {
              valeursSolution = `${fraction(-b, a).texFractionSimplifiee};${fraction(-d + f, c - e).texFractionSimplifiee}`
            }
          }

          break
        case 3: // (ax+b)²+(ax+b)(ex+f)=0
          texte = ` ($${reduireAxPlusB(a, b)})^{2}+(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})=0$`
          texteCorr = ` $(${reduireAxPlusB(a, b)})^{2}+(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})=0$<br>`
          texteCorr += ` $(${reduireAxPlusB(a, b)})(${reduireAxPlusB(a, b)})+(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += ` On observe que $(${reduireAxPlusB(a, b)})$ est un facteur commun dans les deux termes :<br>`
            texteCorr += ` $\\phantom{\\iff} (\\underline{${reduireAxPlusB(a, b)}})(${reduireAxPlusB(a, b)})+(\\underline{${reduireAxPlusB(a, b)})}( ${reduireAxPlusB(e, f)})=0$<br>`
            texteCorr += ` $\\iff (\\underline{${reduireAxPlusB(a, b)}})\\Big((${reduireAxPlusB(a, b)})+(${reduireAxPlusB(e, f)})\\Big)=0$<br>`
          }
          if (e < 0) texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(a, b)})${reduireAxPlusB(e, f)})=0$<br>`
          else texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(a, b)})+${reduireAxPlusB(e, f)})=0$<br>`
          texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(a + e, b + f)})=0$<br>`
          if (a + e === 0) {
            texteCorr += `$\\iff ${reduireAxPlusB(a, b)}=0$<br>`
            texteCorr += `$x=${texFractionSigne(-b, a)}$<br>`
            texteCorr += `L'équation admet une unique solution : $S=\\left\\{${texFractionReduite(-b, a)}\\right\\}$.`
          } else {
            texteCorr += 'On reconnaît une équation produit-nul, donc on applique la propriété :<br>'
            texteCorr += `${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>`
            texteCorr += ` $\\iff ${reduireAxPlusB(a, b)}=0\\quad$ ou bien $\\quad ${reduireAxPlusB(a + e, b + f)}=0$<br>`
            texteCorr += `$\\iff x=${texFractionSigne(-b, a)}\\quad$ ou $\\quad x=${texFractionSigne(-b - f, a + e)}$<br>
               On en déduit :  `
            if ((-b - f) / (a + e) < -b / a) {
              valeursSolution = `${fraction(-b - f, a + e).texFractionSimplifiee};${fraction(-b, a).texFractionSimplifiee}`
            } else {
              valeursSolution = `${fraction(-b, a).texFractionSimplifiee};${fraction(-b - f, a + e).texFractionSimplifiee}`
            }
          }

          break
        case 4: // (ax+b)(cx+d)-(ax+b)²=0
          texte = ` ($${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})-(${reduireAxPlusB(a, b)})^{2}=0$`
          texteCorr = ` ($${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})-(${reduireAxPlusB(a, b)})^{2}=0$<br>`
          texteCorr += ` ($${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)})-(${reduireAxPlusB(a, b)})( ${reduireAxPlusB(a, b)})=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += ` On observe que $(${reduireAxPlusB(a, b)})$ est un facteur commun dans les deux termes :<br>`
            texteCorr += ` $\\phantom{\\iff} (\\underline{${reduireAxPlusB(a, b)}})( ${reduireAxPlusB(c, d)})-(\\underline{${reduireAxPlusB(a, b)})}( ${reduireAxPlusB(a, b)})=0$<br>`
            texteCorr += ` $\\iff (\\underline{${reduireAxPlusB(a, b)}})\\Big(( ${reduireAxPlusB(c, d)})-( ${reduireAxPlusB(a, b)})\\Big)=0$<br>`
          }
          if (a > 0) texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)}${reduireAxPlusB(-a, -b)}))=0$<br>`
          else texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c, d)}+${reduireAxPlusB(-a, -b)}))=0$<br>`
          texteCorr += ` $\\iff (${reduireAxPlusB(a, b)})( ${reduireAxPlusB(c - a, d - b)})=0$<br>`
          if (c - a === 0) {
            texteCorr += `$\\iff ${reduireAxPlusB(a, b)}=0$<br>`
            texteCorr += `$x=${texFractionSigne(-b, a)}$<br>`
            texteCorr += `L'équation admet une unique solution : $S=\\left\\{${texFractionReduite(-b, a)}\\right\\}$.`
          } else {
            texteCorr += 'On reconnaît une équation produit-nul, donc on applique la propriété :<br>'
            texteCorr += `${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>`
            texteCorr += ` $\\iff ${reduireAxPlusB(a, b)}=0\\quad$ ou bien $\\quad ${reduireAxPlusB(c - a, d - b)}=0$<br>`
            texteCorr += `$\\iff x=${texFractionSigne(-b, a)}\\quad$ ou $\\quad x=${texFractionSigne(-d + b, c - a)}$<br>
           On en déduit :  `
            if ((-d + b) / (c - b) < -b / a) {
              valeursSolution = `${fraction(-d + b, c - a).texFractionSimplifiee};${fraction(-b, a).texFractionSimplifiee}`
            } else {
              valeursSolution = `${fraction(-b, a).texFractionSimplifiee};${fraction(-d + b, c - a).texFractionSimplifiee}`
            }
          }

          break

        case 5: // (ax+b)(cx+d)=(ax+b)(ex+f)
          texte = `$(${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})=(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})$`
          texteCorr = 'Deux nombres sont égaux si et seulement si leur différence est nulle.<br>'
          texteCorr += `$\\phantom{\\iff}(${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})=(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})$<br>`
          texteCorr += `$\\iff (${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})-(${reduireAxPlusB(a, b)})(${reduireAxPlusB(e, f)})=0$<br>`
          if (this.correctionDetaillee) {
            texteCorr += ` On observe que $(${reduireAxPlusB(a, b)})$ est un facteur commun dans les deux termes :<br>`
            texteCorr += `$\\phantom{\\iff}(\\underline{${reduireAxPlusB(a, b)}})(${reduireAxPlusB(c, d)})-(\\underline{${reduireAxPlusB(a, b)}})(${reduireAxPlusB(e, f)})=0$<br>`
            texteCorr += `$\\iff (\\underline{${reduireAxPlusB(a, b)}})\\Big((${reduireAxPlusB(c, d)})-(${reduireAxPlusB(e, f)})\\Big)=0$<br>`
          }
          if (e < 0) {
            texteCorr += `$\\iff (${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)}+${reduireAxPlusB(-e, -f)})=0$<br>`
          } else {
            texteCorr += `$\\iff (${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)}${reduireAxPlusB(-e, -f)})=0$<br>`
          }
          texteCorr += `$\\iff (${reduireAxPlusB(a, b)})(${reduireAxPlusB(c - e, d - f)})=0$<br>`
          texteCorr += `On reconnaît une équation produit-nul, donc on applique la propriété :<br>
        ${texteEnCouleur('Un produit est nul si et seulement si au moins un de ses facteurs est nul.')}<br>`
          texteCorr += `$(${reduireAxPlusB(a, b)})(${reduireAxPlusB(c - e, d - f)})=0$<br>`
          texteCorr += `$\\iff ${reduireAxPlusB(a, b)}=0$ ou $${reduireAxPlusB(c - e, d - f)}=0$<br>`
          if (this.correctionDetaillee) { // on ajoute les étapes de résolution si la correction détaillée est cochée.
            texteCorr += `$\\iff ${reduireAxPlusB(a, 0)}=${-b}$ ou $ ${reduireAxPlusB(c - e, 0)}=${-d + f}$<br>`
          }
          f1 = fraction(-b, a)
          f2 = fraction(-d + f, c - e)
          texteCorr += `$\\iff x=${f1.texFraction}$ ou $ x=${f2.texFraction}$<br>On en déduit :  `
          if (-b / a > (-d + f) / (c - e)) {
            valeursSolution = `${f2.texFractionSimplifiee};${f1.texFractionSimplifiee}`
          } else if (-b / a < (-d + f) / (c - e)) {
            valeursSolution = `${f1.texFractionSimplifiee};${f2.texFractionSimplifiee}`
          } else {
            valeursSolution = `${f1.texFractionSimplifiee}`
          }
          break
      }
      texteCorr += `$S=\\left\\{${valeursSolution}\\right\\}$`
      if (this.interactif) {
        texte += '<br>$S=$' + ajouteChampTexteMathLive(this, i, ' ')
      }
      handleAnswers(this, i, {
        reponse: {
          value: `\\{${valeursSolution}\\}`,
          compare: fonctionComparaison,
          options: { ensembleDeNombres: true }
        }
      }, { formatInteractif: 'calcul' })
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
