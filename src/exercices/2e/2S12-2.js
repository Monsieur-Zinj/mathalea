import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { texteGras } from '../../lib/format/style'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import Decimal from 'decimal.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Déterminer un taux d\'évolution global'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '06/01/2022'
export const dateDeModifImportante = '04/05/2023'
/**
 * Problèmes d'évolutions successives'
 *
 * * Situations variées : prix, habitants, adhérents  ##
 *
 * * Déterminer un taux d'évolution global ou un taux intermédiaire
 * * Mélange des 3 types de problèmes
 * @author Florence Tapiero et Gilles Mora pour le cas problème taux intermédiaire
 * 2S12-2
 */

export const uuid = '018f3'
export const ref = '2S12-2'
export const refs = {
  'fr-fr': ['2S12-2'],
  'fr-ch': []
}
export default function EvolutionsSuccesives () {
  Exercice.call(this)
  this.titre = titre
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.consigne = ''
  this.nbQuestions = 1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1 // type de question

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = [] // Cette ligne doit être ajoutée afin de vider les précédentes valeurs pour AMC
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1, 2, 3]
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [4, 5, 6]
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    let typesDeQuestions, CM1, CM2, CM, p1, p2, p, verbe1, nom1, verbe2, verbe3, nom2, nom, nom3, taux, t1, t2, t
    for (let i = 0, texte, texteCorr, taux1, taux2, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1 :
          taux1 = randint(-80, 80, 0)
          taux2 = randint(-80, 80, 0)
          if (taux1 > 0) {
            verbe1 = 'Augmenter'
            nom1 = 'hausse'
          }
          if (taux2 > 0) {
            verbe2 = 'Augmenter'
            nom2 = 'hausse'
          }
          if (taux1 < 0) {
            verbe1 = 'Diminuer'
            nom1 = 'baisse'
          }
          if (taux2 < 0) {
            verbe2 = 'Diminuer'
            nom2 = 'baisse'
          }
          p1 = new Decimal(taux1).div(100)
          p2 = new Decimal(taux2).div(100)
          t1 = Math.abs(taux1)
          t2 = Math.abs(taux2)
          CM1 = p1.plus(1)
          CM2 = p2.plus(1)
          CM = CM1.mul(CM2)
          p = CM.sub(1)
          taux = p.mul(100)
          t = taux.abs()
          if (taux.isPos()) {
            nom = 'hausse'
          }
          if (taux.isNeg()) {
            nom = 'baisse'
          }
          texte = `Le prix d'un article subit une ${nom1} de $${t1}~\\%$ puis une ${nom2} de $${t2}~\\%$.<br>Déterminer le taux d'évolution global du prix de cet article.`
          texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texteApres: '%' })
          texteCorr = 'Pour déterminer le taux d\'évolution global, on commence par calculer le coefficient multiplicateur global.'
          texteCorr += '<br>Si une grandeur subit des évolutions successives, le coefficient multiplicateur global est le produit des coefficients multiplicateurs de chaque évolution :'
          texteCorr += `<br><br>${texteGras('Première évolution :')} <br>
          ${verbe1} de $${t1}~\\%$ revient à multiplier par `
          if (taux1 > 0) {
            texteCorr += `$CM_1 = 1 + \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.`
          }
          if (taux1 < 0) {
            texteCorr += `$CM_1 = 1 - \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.`
          }
          texteCorr += `<br><br>${texteGras('Deuxième évolution :')}<br> ${verbe2} de $${t2}~\\%$ revient à multiplier par `
          if (taux2 > 0) {
            texteCorr += `$CM_2 = 1 + \\dfrac{${t2}}{100} = ${texNombre(CM2, 2)}$.`
          }
          if (taux2 < 0) {
            texteCorr += `$CM_2 = 1 - \\dfrac{${t2}}{100} = ${texNombre(CM2, 2)}$.`
          }
          texteCorr += `<br><br>Le coefficient multiplicateur global est égal à $CM = CM_1 \\times CM_2 = ${texNombre(CM1, 2)} \\times ${texNombre(CM2, 2)} =${texNombre(CM, 4)}$.`
          if (CM > 1) {
            texteCorr += `<br><br>Or $CM =${texNombre(CM, 4)} = 1 + ${texNombre(Math.abs(p), 4)} = 1 + \\dfrac{${texNombre(t, 2)}}{100}$ ce qui correspond à une hausse de $${texNombre(t, 2)}~\\%$.`
          }
          if (CM < 1) {
            texteCorr += `<br><br>Or $CM = ${texNombre(CM, 4)} = 1 - ${texNombre(Math.abs(p), 4)} = 1-\\dfrac{${texNombre(t, 2)}}{100}$ ce qui correspond à une baisse de $${texNombre(t, 2)}~\\%$.`
          }
          texteCorr += `<br>Le prix de l'article a subi une ${nom} globale de $${texNombre(taux.abs(), 2)}~\\%$.`
          setReponse(this, i, taux)
          break
        case 2 :
          taux1 = randint(-20, 20, 0)
          taux2 = randint(-20, 20, 0)
          if (taux1 > 0) {
            verbe1 = 'Augmenter'
            nom1 = 'augmenté'
          }
          if (taux2 > 0) {
            verbe2 = 'Augmenter'
            nom2 = 'augmenté'
          }
          if (taux1 < 0) {
            verbe1 = 'Diminuer'
            nom1 = 'diminué'
          }
          if (taux2 < 0) {
            verbe2 = 'Diminuer'
            nom2 = 'diminué'
          }
          p1 = new Decimal(taux1).div(100)
          p2 = new Decimal(taux2).div(100)
          t1 = Math.abs(taux1)
          t2 = Math.abs(taux2)
          CM1 = p1.plus(1)
          CM2 = p2.plus(1)
          CM = CM1.mul(CM2)
          p = CM.sub(1)
          taux = p.mul(100)
          t = taux.abs()
          if (taux.isPos()) {
            nom = 'augmenté'
          }
          if (taux.isNeg()) {
            nom = 'diminué'
          }
          texte = `La population d'une ville a ${nom1} de $${t1}~\\%$ en $2021$ puis a ${nom2} de $${t2}~\\%$ en $2022$.<br>Quel est le taux d'évolution global ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texteApres: '%' })
          texteCorr = 'Pour déterminer le taux d\'évolution global, on commence par calculer le coefficient multiplicateur global.'
          texteCorr += '<br>Si une grandeur subit des évolutions successives, le coefficient multiplicateur global est le produit des coefficients multiplicateurs de chaque évolution :'
          texteCorr += `<br><br>${texteGras('Première évolution :')} <br>
           ${verbe1} de $${t1}~\\%$ revient à multiplier par `
          if (taux1 > 0) {
            texteCorr += `$CM_1 = 1 + \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.`
          }
          if (taux1 < 0) {
            texteCorr += `$CM_1 = 1 - \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.`
          }
          texteCorr += `<br><br>${texteGras('Deuxième évolution :')} <br>
           ${verbe2} de $${t2}~\\%$ revient à multiplier par `
          if (taux2 > 0) {
            texteCorr += `$CM_2 = 1 + \\dfrac{${t2}}{100} = ${texNombre(CM2, 2)}$.`
          }
          if (taux2 < 0) {
            texteCorr += `$CM_2 = 1 - \\dfrac{${t2}}{100} = ${texNombre(CM2, 2)}$.`
          }
          texteCorr += `<br><br>Le coefficient multiplicateur global est égal à $CM = CM_1 \\times CM_2 = ${texNombre(CM1, 2)} \\times ${texNombre(CM2, 2)} =${texNombre(CM, 4)}$.`
          if (CM > 1) {
            texteCorr += `<br><br>Or $CM =${texNombre(CM, 4)} = 1 + ${texNombre(Math.abs(p), 4)} = 1 + \\dfrac{${texNombre(t, 2)}}{100}$ ce qui correspond à une hausse de $${texNombre(t, 2)}~\\%$.`
          }
          if (CM < 1) {
            texteCorr += `<br><br>Or $CM = ${texNombre(CM, 4)} = 1 - ${texNombre(Math.abs(p), 4)} = 1-\\dfrac{${texNombre(t, 2)}}{100}$ ce qui correspond à une baisse de $${texNombre(t, 2)}~\\%$.`
          }
          texteCorr += `<br>Le nombre d'habitants de cette ville a ${nom} de $${texNombre(taux.abs(), 2)}~\\%$ entre $2021$ et $2022$.`
          setReponse(this, i, taux)
          break
        case 3 :
          taux1 = randint(-40, 40, 0)
          taux2 = randint(-40, 40, 0)
          if (taux1 > 0) {
            verbe1 = 'Augmenter'
            nom1 = 'augmenté'
          }
          if (taux2 > 0) {
            verbe2 = 'Augmenter'
            nom2 = 'augmenté'
          }
          if (taux1 < 0) {
            verbe1 = 'Diminuer'
            nom1 = 'diminué'
          }
          if (taux2 < 0) {
            verbe2 = 'Diminuer'
            nom2 = 'diminué'
          }
          p1 = new Decimal(taux1).div(100)
          p2 = new Decimal(taux2).div(100)
          t1 = Math.abs(taux1)
          t2 = Math.abs(taux2)
          CM1 = p1.plus(1)
          CM2 = p2.plus(1)
          CM = CM1.mul(CM2)
          p = CM.sub(1)
          taux = p.mul(100)
          t = taux.abs()
          if (taux.isPos()) {
            nom = 'augmenté'
          }
          if (taux.isNeg()) {
            nom = 'diminué'
          }
          texte = `Le nombre d'adhérents d'une association a ${nom1} de $${t1}~\\%$ entre $2020$ et $2021$ puis a ${nom2} de $${t2}~\\%$ entre $2021$ et $2022$.<br>Quel est le taux d'évolution global du nombre d'adhérents ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texteApres: '%' })
          texteCorr = 'Pour déterminer le taux d\'évolution global, on commence par calculer le coefficient multiplicateur global.'
          texteCorr += '<br>Si une grandeur subit des évolutions successives, le coefficient multiplicateur global est le produit des coefficients multiplicateurs de chaque évolution :'
          texteCorr += `<br><br>${texteGras('Première évolution :')} <br> ${verbe1} de $${t1}~\\%$ revient à multiplier par `
          if (taux1 > 0) {
            texteCorr += `$CM_1 = 1 + \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.`
          }
          if (taux1 < 0) {
            texteCorr += `$CM_1 = 1 - \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.`
          }
          texteCorr += `<br><br>${texteGras('Deuxième évolution :')}<br>
           ${verbe2} de $${t2}~\\%$ revient à multiplier par `
          if (taux2 > 0) {
            texteCorr += `$CM_2 = 1 + \\dfrac{${t2}}{100} = ${texNombre(CM2, 2)}$.`
          }
          if (taux2 < 0) {
            texteCorr += `$CM_2 = 1 - \\dfrac{${t2}}{100} = ${texNombre(CM2, 2)}$.`
          }
          texteCorr += `<br><br>Le coefficient multiplicateur global est égal à $CM = CM_1 \\times CM_2 = ${texNombre(CM1, 2)} \\times ${texNombre(CM2, 2)} =${texNombre(CM, 4)}$.`
          if (CM > 1) {
            texteCorr += `<br><br>Or $CM =${texNombre(CM, 4)} = 1 + ${texNombre(Math.abs(p), 4)} = 1 + \\dfrac{${texNombre(t, 2)}}{100}$ ce qui correspond à une hausse de $${texNombre(t, 2)}~\\%$.`
          }
          if (CM < 1) {
            texteCorr += `<br><br>Or $CM = ${texNombre(CM, 4)} = 1 - ${texNombre(Math.abs(p), 4)} = 1-\\dfrac{${texNombre(t, 2)}}{100}$ ce qui correspond à une baisse de $${texNombre(t, 2)}~\\%$.`
          }
          texteCorr += `<br>Le nombre d'adhérents de cette association a ${nom} de $${texNombre(taux.abs(), 2)}~\\%$ entre $2020$ et $2022$.`
          setReponse(this, i, taux)
          break

        case 4 :
          taux1 = randint(-80, 80, 0)
          taux2 = randint(-80, 80, 0)
          if (taux1 > 0) {
            verbe1 = 'Augmenter'
            nom1 = 'hausse'
          }
          if (taux2 > 0) {
            verbe2 = 'Augmenter'
            nom2 = 'hausse'
          }
          if (taux1 < 0) {
            verbe1 = 'Diminuer'
            nom1 = 'baisse'
          }
          if (taux2 < 0) {
            verbe2 = 'Diminuer'
            nom2 = 'baisse'
          }
          p1 = new Decimal(taux1).div(100)
          p2 = new Decimal(taux2).div(100)
          t1 = Math.abs(taux1)
          t2 = Math.abs(taux2)
          CM1 = p1.plus(1)
          CM2 = p2.plus(1)
          CM = CM1.mul(CM2)
          p = CM.sub(1)
          p2 = CM2.sub(1)
          taux = p.mul(100)
          t = taux.abs()
          if (taux.isPos()) {
            nom = 'hausse'
            nom3 = 'augmenté'
            verbe3 = 'Augmenter'
          }
          if (taux.isNeg()) {
            nom = 'baisse'
            nom3 = 'baissé'
            verbe3 = 'Diminuer'
          }
          texte = `Le prix d'un article subit une ${nom1} $${t1}~\\%$ puis une ${nom2} de $t\\,\\%$.<br>
          Globalement, le prix de cet article a ${nom3} de $${texNombre(t, 2)} \\,\\%$.<br>
          Quelle est la valeur de $t$ ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texteApres: '%' })

          texteCorr = 'Si une grandeur subit des évolutions successives, le coefficient multiplicateur global est le produit des coefficients multiplicateurs de chaque évolution.'
          texteCorr += `<br><br>${texteGras('Première évolution :')} <br> ${verbe1} de $${t1}~\\%$ revient à multiplier par `
          if (taux1 > 0) {
            texteCorr += `$CM_1 = 1 + \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.<br>`
          }
          if (taux1 < 0) {
            texteCorr += `$CM_1 = 1 - \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.<br>`
          }
          texteCorr += `<br>${texteGras('Évolution globale :')} <br>
           ${verbe3} de $${texNombre(t, 2)}~\\%$ revient à multiplier par `
          if (taux > 0) {
            texteCorr += `$CM = 1 + \\dfrac{${texNombre(t, 2)}}{100} = ${texNombre(CM, 4)}$.`
          }
          if (taux < 0) {
            texteCorr += `$CM = 1 - \\dfrac{${texNombre(t, 2)}}{100} = ${texNombre(CM, 4)}$.`
          }
          texteCorr += `<br><br>En notant $CM_2$ le coefficient multiplicateur de la deuxième évolution, on a : $CM = CM_1 \\times CM_2$, soit
             $${texNombre(CM1, 2)} \\times CM_2 =${texNombre(CM, 4)}$ et par suite $ CM_2 =\\dfrac{${texNombre(CM, 4)}}{${texNombre(CM1, 2)} }=${texNombre(CM2, 2)}$<br>
             `
          if (CM2 > 1) {
            texteCorr += `<br>Or $CM_2 =${texNombre(CM2, 2)} = 1 + ${texNombre(Math.abs(p2), 2)} = 1 + \\dfrac{${texNombre(t2, 2)}}{100}$ ce qui correspond à une hausse de $${texNombre(t2, 2)}~\\%$.`
          }
          if (CM2 < 1) {
            texteCorr += `<br>Or $CM_2 = ${texNombre(CM2, 2)} = 1 - ${texNombre(Math.abs(p2), 2)} = 1-\\dfrac{${texNombre(t2)}}{100}$ ce qui correspond à une baisse de $${texNombre(t2, 2)}~\\%$.`
          }
          texteCorr += `<br>Le prix de l'article a subi une ${nom2}  $${texNombre(t2)}~\\%$  lors de la deuxième évolution.`
          setReponse(this, i, t2)
          break

        case 5 :
          taux1 = randint(-20, 20, 0)
          taux2 = randint(-20, 20, 0)
          if (taux1 > 0) {
            verbe1 = 'Augmenter'
            nom1 = 'augmenté'
          }
          if (taux2 > 0) {
            verbe2 = 'Augmenter'
            nom2 = 'hausse'
          }
          if (taux1 < 0) {
            verbe1 = 'Diminuer'
            nom1 = 'baissé'
          }
          if (taux2 < 0) {
            verbe2 = 'Diminuer'
            nom2 = 'baissé'
          }
          p1 = new Decimal(taux1).div(100)
          p2 = new Decimal(taux2).div(100)
          t1 = Math.abs(taux1)
          t2 = Math.abs(taux2)
          CM1 = p1.plus(1)
          CM2 = p2.plus(1)
          CM = CM1.mul(CM2)
          p = CM.sub(1)
          p2 = CM2.sub(1)
          taux = p.mul(100)
          t = taux.abs()
          if (taux.isPos()) {
            nom = 'hausse'
            nom3 = 'augmenté'
            verbe3 = 'Augmenter'
          }
          if (taux.isNeg()) {
            nom = 'baisse'
            nom3 = 'baissé'
            verbe3 = 'Diminuer'
          }
          texte = `La population d'une ville a ${nom1} de $${t1}~\\%$ en $2021$ puis a ${nom3} de $t~\\%$ en $2022$.<br>
          Globalement, sur ces deux années, la population de cette ville a ${nom3} de $${texNombre(t, 2)} \\,\\%$.<br>
          Quelle est la valeur de $t$ ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texteApres: '%' })

          texteCorr = 'Si une grandeur subit des évolutions successives, le coefficient multiplicateur global est le produit des coefficients multiplicateurs de chaque évolution.'
          texteCorr += `<br><br>${texteGras('Première évolution :')} <br> ${verbe1} de $${t1}~\\%$ revient à multiplier par `
          if (taux1 > 0) {
            texteCorr += `$CM_1 = 1 + \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.<br>`
          }
          if (taux1 < 0) {
            texteCorr += `$CM_1 = 1 - \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.<br>`
          }
          texteCorr += `<br>${texteGras('Évolution globale :')} <br>
           ${verbe3} de $${texNombre(t, 2)}~\\%$ revient à multiplier par `
          if (taux > 0) {
            texteCorr += `$CM = 1 + \\dfrac{${texNombre(t, 2)}}{100} = ${texNombre(CM, 4)}$.`
          }
          if (taux < 0) {
            texteCorr += `$CM = 1 - \\dfrac{${texNombre(t, 2)}}{100} = ${texNombre(CM, 4)}$.`
          }
          texteCorr += `<br><br>En notant $CM_2$ le coefficient multiplicateur de la deuxième évolution, on a : $CM = CM_1 \\times CM_2$, soit
             $${texNombre(CM1, 2)} \\times CM_2 =${texNombre(CM, 4)}$ et par suite $ CM_2 =\\dfrac{${texNombre(CM, 4)}}{${texNombre(CM1, 2)} }=${texNombre(CM2, 2)}$<br>
             `
          if (CM2 > 1) {
            texteCorr += `<br>Or $CM_2 =${texNombre(CM2, 2)} = 1 + ${texNombre(Math.abs(p2), 2)} = 1 + \\dfrac{${texNombre(t2, 2)}}{100}$ ce qui correspond à une hausse de $${texNombre(t2, 2)}~\\%$.`
          }
          if (CM2 < 1) {
            texteCorr += `<br>Or $CM_2 = ${texNombre(CM2, 2)} = 1 - ${texNombre(Math.abs(p2), 2)} = 1-\\dfrac{${texNombre(t2)}}{100}$ ce qui correspond à une baisse de $${texNombre(t2, 2)}~\\%$.`
          }
          texteCorr += `<br>En $2022$, le nombre d'habitants de cette ville a ${nom2} de $${texNombre(t2)}\\,\\%$.`
          setReponse(this, i, t2)
          break

        case 6 :
          taux1 = randint(-40, 40, 0)
          taux2 = randint(-40, 40, 0)
          if (taux1 > 0) {
            verbe1 = 'Augmenter'
            nom1 = 'augmenté'
          }
          if (taux2 > 0) {
            verbe2 = 'Augmenter'
            nom2 = 'augmenté'
          }
          if (taux1 < 0) {
            verbe1 = 'Diminuer'
            nom1 = 'baissé'
          }
          if (taux2 < 0) {
            verbe2 = 'Diminuer'
            nom2 = 'baissé'
          }
          p1 = new Decimal(taux1).div(100)
          p2 = new Decimal(taux2).div(100)
          t1 = Math.abs(taux1)
          t2 = Math.abs(taux2)
          CM1 = p1.plus(1)
          CM2 = p2.plus(1)
          CM = CM1.mul(CM2)
          p = CM.sub(1)
          p2 = CM2.sub(1)
          taux = p.mul(100)
          t = taux.abs()
          if (taux.isPos()) {
            nom = 'hausse'
            nom3 = 'augmenté'
            verbe3 = 'Augmenter'
          }
          if (taux.isNeg()) {
            nom = 'baisse'
            nom3 = 'baissé'
            verbe3 = 'Diminuer'
          }
          texte = `Le nombre d'adhérents d'une association a ${nom1} de $${t1}\\,\\%$ entre $2021$ et $2022$ puis a ${nom2} de $t\\,\\%$ entre $2022$ et $2023$.<br>
          Globalement, entre 2021 et 2023, le  nombre d'adhérents a ${nom3} de $${texNombre(t, 2)}\\,\\%$.<br>
          Déterminer la valeur de $t$.
          `
          texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texteApres: '%' })

          texteCorr = 'Si une grandeur subit des évolutions successives, le coefficient multiplicateur global est le produit des coefficients multiplicateurs de chaque évolution.'
          texteCorr += `<br><br>${texteGras('Première évolution :')} <br> ${verbe1} de $${t1}~\\%$ revient à multiplier par `
          if (taux1 > 0) {
            texteCorr += `$CM_1 = 1 + \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.<br>`
          }
          if (taux1 < 0) {
            texteCorr += `$CM_1 = 1 - \\dfrac{${t1}}{100} = ${texNombre(CM1, 2)}$.<br>`
          }
          texteCorr += `<br>${texteGras('Évolution globale :')} <br>
          ${verbe3} de $${texNombre(t, 2)}~\\%$ revient à multiplier par `
          if (taux > 0) {
            texteCorr += `$CM = 1 + \\dfrac{${texNombre(t, 2)}}{100} = ${texNombre(CM, 4)}$.`
          }
          if (taux < 0) {
            texteCorr += `$CM = 1 - \\dfrac{${texNombre(t, 2)}}{100} = ${texNombre(CM, 4)}$.`
          }
          texteCorr += `<br><br>En notant $CM_2$ le coefficient multiplicateur de la deuxième évolution, on a : $CM = CM_1 \\times CM_2$, soit
             $${texNombre(CM1, 2)} \\times CM_2 =${texNombre(CM, 4)}$ et par suite $ CM_2 =\\dfrac{${texNombre(CM, 4)}}{${texNombre(CM1, 2)} }=${texNombre(CM2, 2)}$<br>
             `
          if (CM2 > 1) {
            texteCorr += `<br>Or $CM_2 =${texNombre(CM2, 2)} = 1 + ${texNombre(Math.abs(p2), 2)} = 1 + \\dfrac{${texNombre(t2, 2)}}{100}$ ce qui correspond à une hausse de $${texNombre(t2, 2)}~\\%$.`
          }
          if (CM2 < 1) {
            texteCorr += `<br>Or $CM_2 = ${texNombre(CM2, 2)} = 1 - ${texNombre(Math.abs(p2), 2)} = 1-\\dfrac{${texNombre(t2)}}{100}$ ce qui correspond à une baisse de $${texNombre(t2, 2)}~\\%$.`
          }
          texteCorr += `<br>Le nombre d'adhérents de cette association a ${nom2} de $${texNombre(t2)}\\,\\%$ en $2022$.`

          setReponse(this, i, t2)
          break
      }
      if (this.questionJamaisPosee(i, taux1, taux2)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de questions', 4, '1 : Déterminer un taux global \n2 : Déterminer un taux intermédiaire\n3 : Mélange']
}
