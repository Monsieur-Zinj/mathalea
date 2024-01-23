import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import Decimal from 'decimal.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
export const titre = 'Connaître les différentes écritures d\'une proportion'
export const dateDePublication = '21/04/2023'

/**
* Ecriture des  proportions
*
* * 3 Situations :
*Pourcentage-->fraction-->décimal
*Pourcentage-->fraction-->décimal
*Pourcentage-->fraction-->décimal

* @author Gilles Mora
* *
*/
export const uuid = 'ae913'
export const ref = '2S10-1'
export default function DiffentesEcrituresProportions () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 4
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 4 // type de questions

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = [] // Cette ligne doit être ajoutée afin de vider les précédentes valeurs pour AMC
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = ['Decimal']
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = ['Pourcentage']
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = ['Fraction']
    }
    if (this.sup === 4) {
      typesDeQuestionsDisponibles = ['Decimal', 'Pourcentage', 'Fraction']//,
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, listeFractions, fraction, dec, pourc, n, d, f, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (randint(1, 4)) {
        case 1:
          dec = new Decimal(randint(1, 99)).div(100)
          pourc = new Decimal(dec).mul(100)
          listeFractions = [
            [1, 2], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [6, 5], [7, 5], [3, 4], [5, 8], [7, 8], [3, 8],
            [1, 8], [3, 10], [7, 10], [3, 20], [7, 20], [9, 20], [11, 20], [13, 20], [17, 20]] //
          fraction = choice(listeFractions)
          n = fraction[0]
          d = fraction[1]
          f = new Decimal(n).div(d)
          break
        case 2:
          dec = new Decimal(randint(1, 99)).div(1000)
          pourc = new Decimal(dec).mul(100)
          n = randint(1, 49)
          d = choice([1000, 100, 50, 500])
          f = new Decimal(n).div(d)
          break
        case 3:
          dec = new Decimal(randint(1, 99)).div(10000)
          pourc = new Decimal(dec).mul(100)
          n = randint(1, 24)
          d = choice([25, 100, 200])
          f = new Decimal(n).div(d)
          break
        case 4:
          dec = new Decimal(randint(11, 99)).div(10)
          pourc = new Decimal(dec).mul(100)
          listeFractions = [
            [32, 125], [32, 125], [2, 125], [7, 125], [9, 125], [13, 125], [32, 125], [71, 125], [108, 125], [9, 250], [17, 250],
            [81, 1250], [91, 1250], [87, 1250], [91, 1250], [47, 1250], [59, 1250], [31, 1250], [63, 1250], [117, 2500], [91, 2500]] //
          fraction = choice(listeFractions)
          n = fraction[0]
          d = fraction[1]
          f = new Decimal(n).div(d)
          break
      }

      switch (listeTypeDeQuestions[i]) {
        case 'Decimal':

          texte = 'Écrire sous la forme d\'une fraction de dénominateur $100$, puis sous la forme d\'un pourcentage.<br>'
          if (context.isHtml) {
            texte += ''
          } else {
            texte += '<br>'
          }
          texte += `$${texNombre(dec, 4)}=${context.isHtml ? '\\ldots' : '\\makebox[.08\\linewidth]{\\dotfill}'}=${context.isHtml ? '\\ldots' : '\\makebox[.08\\linewidth]{\\dotfill}'}\\,\\%$`
          if (context.isHtml) {
            texte += ''
          } else {
            texte += '<br>'
          }
          texteCorr = `$${texNombre(dec, 4)}=\\dfrac{${texNombre(pourc, 3)}}{100}=${texNombre(pourc, 3)} \\,\\%$`
          break

        case 'Pourcentage':
          texte = 'Écrire sous forme décimale, puis sous la forme d\'une fraction de dénominateur $100$.<br>'
          if (context.isHtml) {
            texte += ''
          } else {
            texte += '<br>'
          }
          texte += `$${texNombre(pourc, 4)}\\,\\%=${context.isHtml ? '\\ldots' : '\\makebox[.08\\linewidth]{\\dotfill}'}=${context.isHtml ? '\\ldots' : '\\makebox[.08\\linewidth]{\\dotfill}'}$`
          if (context.isHtml) {
            texte += ''
          } else {
            texte += '<br>'
          }
          texteCorr = `$${texNombre(pourc, 3)}\\,\\%=${texNombre(dec, 4)}=\\dfrac{${texNombre(pourc, 3)}}{100}$`

          break
        case 'Fraction':
          texte = 'Écrire sous forme décimale, puis sous la forme d\'un pourcentage.<br>'
          if (context.isHtml) {
            texte += ''
          } else {
            texte += '<br>'
          }
          texte += `$\\dfrac{${texNombre(n, 0)}}{${texNombre(d, 0)}}=${context.isHtml ? '\\ldots' : '\\makebox[.08\\linewidth]{\\dotfill}'}=${context.isHtml ? '\\ldots' : '\\makebox[.08\\linewidth]{\\dotfill}'}\\,\\%$`
          if (context.isHtml) {
            texte += ''
          } else {
            texte += '<br>'
          }
          texteCorr = `$\\dfrac{${texNombre(n, 0)}}{${texNombre(d, 0)}}=${texNombre(f, 4)}=${texNombre(f * 100, 4)}\\,\\%$`
          break
      }

      if (this.questionJamaisPosee(i, dec, pourc)) { // on utilise donc cette fonction basée sur les variables aléatoires pour éviter les doublons
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de questions', 4, '1 : Décimal vers fraction ou pourcentage \n2 : Pourcentage vers fraction ou décimal\n3 : Fraction vers décimal ou pourcentage \n4 : Mélange']
}
