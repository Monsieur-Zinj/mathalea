import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { texteGras } from '../../lib/format/style'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
export const titre = 'Justifier l\'existence d\'une racine carrée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '15/11/2023'
/**
 * 2N32-1, ex 2N10
 * @author Stéphane Guyon et Gilles Mora (interactif + modif correction)
 */
export const uuid = '55cc0'
export const ref = '2N32-1'
export const refs = {
  'fr-fr': ['2N32-1'],
  'fr-ch': ['11NO1-4']
}
export default function ExistenceDUneRacineCarree () {
  Exercice.call(this)
  this.titre = titre

  this.nbQuestions = 5
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 1 //
  this.correctionDetaillee = true
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    if (!this.interactif) {
      this.consigne = ' Le nombre proposé existe-t-il ? Justifier.'
    } else {
      this.consigne = `Le nombre proposé existe-t-il ? <br>
    Répondre par Oui (saisir O) ou Non (saisir N).`
    }
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8]; let typesDeQuestions//,
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    let a; let b; let c; let d; let e; let f; let g; let h; let j; let k = 0
    for (let i = 0, texte, texteCorr, reponse, corr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      const corrDetail = `${texteGras('Définition')} : $\\sqrt{a}$ est le nombre positif dont le carré est $a$.<br>
      Il vérifie donc $\\sqrt{a}\\times \\sqrt{a}=a$. <br>
      Comme $a$ est un carré, c'est un nombre positif.<br>
      Ainsi, la racine carrée d'un nombre négatif n'existe pas. <br><br>
      ${texteGras('Méthode')} : Pour montrer qu'une racine carrée existe, il suffit de montrer que le nombre sous le radical est positif. <br><br>`

      switch (typesDeQuestions) {
        // Cas par cas, on définit le type de nombres que l'on souhaite
        // Combien de chiffres ? Quelles valeurs ?
        case 1:
          a = randint(2, 9)
          corr = `Comme $\\sqrt{${a}} \\geqslant 0$, alors $\\sqrt{\\sqrt{${a}}}$ existe.`
          texte = `$\\sqrt{\\sqrt{${a}}}$`
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          reponse = 'O'

          break
        case 2:
          b = randint(2, 9) * (-1)
          texte = `$\\sqrt{${b}}$`
          reponse = 'N'
          corr = `$${b}$ est un nombre négatif donc $\\sqrt{${b}}$ n'existe pas. `
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          break
        case 3:
          c = randint(2, 9) * (-1)
          d = c * c
          texte = `$\\sqrt{\\left(${c}\\right)^{2}}$`
          reponse = 'O'
          corr = `On a $\\left(${c}\\right)^{2}=\\left(${c}\\right)\\times \\left(${c}\\right)=${d}$. <br>
          Comme $${d}$ est un nombre positf, $\\sqrt{\\left(${c}\\right)^{2}}$ existe.`
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }

          break
        case 4:
          e = randint(2, 9)
          texte = `$-\\sqrt{${e}}$`
          reponse = 'O'
          corr = `${e} est un nombre positif donc $-\\sqrt{${e}}$ existe.<br>
          ${texteGras('Remarque')} :   Le signe $-$ étant placé devant le symbole radical, le nombre $-\\sqrt{${e}}$ est donc négatif. `
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          break
        case 5:
          f = randint(2, 9) * (-1)
          g = f * f
          texte = `$\\sqrt{-\\left(${f}\\right)^{2}}$`
          reponse = 'N'
          corr = `On a $-\\left(${f}\\right)^{2}=-\\left(${f}\\right)\\times \\left(${f}\\right)=-${g}$.<br>
          Comme $-${g}$ est un nombre négatif,   $\\sqrt{-\\left(${f}\\right)^{2}}$ n'existe pas.`
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          break
        case 6:
          h = randint(2, 3)
          texte = `$\\sqrt{${h}-\\pi}$`
          reponse = 'N'
          corr = `Comme $\\pi>3$ alors $${h}-\\pi$ est un nombre négatif. <br>
          Ainsi, $\\sqrt{${h}-\\pi}$ n'existe pas.`
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          break

        case 7:
          k = randint(4, 8)
          texte = `$\\sqrt{${k}-\\pi}$`
          reponse = 'O'
          corr = `Comme  $\\pi\\approx 3,14$ alors $${k}-\\pi$  est un nombre positif.<br>
          Ainsi, $\\sqrt{${k}-\\pi}$ existe.`
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          break

        case 8:
          j = randint(2, 12)
          texte = `$\\sqrt{-${j}^{2}}$`
          reponse = 'N'
          corr = `On a $-${j}^{2}=-${j}\\times ${j}=-${j * j}$. <br>
          Comme $-${j * j}$ est un réel négatif,  $\\sqrt{-${j}^{2}}$ n'existe pas.`
          if (this.correctionDetaillee) {
            texteCorr = corrDetail
            texteCorr += corr
          } else {
            texteCorr = corr
          }
          break
      }
      setReponse(this, i, reponse, { formatInteractif: 'texte' })
      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, i, KeyboardType.vFON, 'largeur01 inline')
      }
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
