import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { minToHour } from '../../lib/outils/dateEtHoraires'
import { prenomF, prenomM } from '../../lib/outils/Personne'
import { nombreAvecEspace, stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import FractionEtendue from '../../modules/FractionEtendue'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { sp } from '../../lib/outils/outilString'

export const dateDeModifImportante = '29/02/2024'
export const titre = 'Problème de vitesse'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Recherche de la vitesse, du temps ou de la distance en utilisant un tableau de proportionnalité et le produit en croix
 * @author Rémi Angot
 */
export const uuid = 'a29bd'
export const ref = '5P11-1'
export const refs = {
  'fr-fr': ['5P11-1'],
  'fr-ch': ['11FA11-1']
}
export default class VitesseDistanceTemps extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    if (this.sup2 === 1) {
      this.consigneCorrection = ' À vitesse constante, la distance et le temps du trajet sont proportionnels. On peut donc utiliser la technique du produit en croix.'
    } else {
      this.consigneCorrection = ''
    }
    this.sup = 4
    this.sup2 = 1
    this.besoinFormulaireNumerique = ['Type de problème', 4, '1: Déterminer la vitesse\n2 : Déterminer la durée\n3 : Déterminer la distance \n4: Mélange ']
    this.besoinFormulaire2Numerique = ['Type de correction', 2, '1: Avec un tableau de proportionnalité\n2: Avec les formules']
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    let typesDeQuestionsDisponibles = ['vitesse', 'temps', 'distance']
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = ['vitesse']
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = ['temps']
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = ['distance']
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    let texteApres
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let t; let prenom; let destination; let texte; let texteCorr
      const v = randint(8, 26, [12]) * 5 // On évite le 60 km/h trop trivial
      if (v % 2 === 0) {
        t = randint(5, 39) * 3
      } else {
        t = randint(2, 19) * 6
      } // On s'assure que le produit v*t est divisible par 6
      const tHour = Math.floor(t / 60)
      const tMin = t % 60
      const d = v * t / 60
      const pronomgenre = choice(['il', 'elle'])
      if (pronomgenre === 'il') {
        prenom = prenomM()
      } else {
        prenom = prenomF()
      }
      if (d < 60) {
        destination = choice(['à son travail', "à l'école de ses enfants", 'au cinéma', 'au centre de loisirs'])
      } else {
        destination = choice(["jusqu'à sa location de vacances", 'dans la maison de ses parents', 'à une conférence'])
      }
      switch (listeTypeDeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'vitesse':
          texte = `${prenom} met ${minToHour(t)} pour aller ${destination} qui est à une distance de ${nombreAvecEspace(d)} km. Déterminer sa vitesse moyenne`
          texte += this.interactif ? ' : ' : '.'
          if (this.sup2 === 1) {
            if (context.isHtml) {
              texteCorr = '$\\def\\arraystretch{2.5}\\begin{array}{|l|c|c|}\n'
            } else {
              texteCorr = '$\\begin{array}{|l|c|c|}\n'
            }
            texteCorr += '\\hline\n'
            texteCorr += `\\text{Distance (en km)} & ${texNombre(d)} & v\\\\ \n`
            texteCorr += '\\hline\n'
            texteCorr += `\\text{Temps (en min)} & ${t} & 60 \\\\ \n`
            texteCorr += '\\hline\n'
            texteCorr += '\\end{array}$'
            texteCorr += '<br><br>'
            texteCorr += `$v=\\dfrac{${texNombre(d)}\\times 60}{${t}}=${v}$ \n`
          } else {
            if (tHour === 0) {
              texteCorr = `$v = \\dfrac{d}{t} = \\dfrac{${texNombre(d)}~\\text{km}}{\\dfrac{${t}}{60}~\\text{h}}$`
            } else {
              texteCorr = `$v = \\dfrac{d}{t} = \\dfrac{${texNombre(d)}~\\text{km}}{${tHour} + \\dfrac{${tMin}}{60}~\\text{h}}$`
            }
          }
          texteCorr += '<br><br>'
          texteCorr += `Sa vitesse moyenne est de ${texteEnCouleurEtGras(v)} km/h.`
          texteApres = sp() + ' km/h'
          setReponse(this, i, v)
          break
        case 'temps':
          texte = `Si ${prenom} roule à ${v} km/h, combien de temps`
          texte += this.interactif ? ' (en minutes)' : ''
          texte += ' lui faudra-t-'
          texte += `${pronomgenre}`
          texte += `  pour aller ${destination} qui est à une distance de ${nombreAvecEspace(d)} km ?`
          if (this.sup2 === 1) {
            if (context.isHtml) {
              texteCorr = '$\\def\\arraystretch{2.5}\\begin{array}{|l|c|c|}\n'
            } else {
              texteCorr = '$\\begin{array}{|l|c|c|}\n'
            }
            texteCorr += '\\hline\n'
            texteCorr += `\\text{Distance (en km)} & ${texNombre(d)} & ${v}\\\\ \n`
            texteCorr += '\\hline\n'
            texteCorr += '\\text{Temps (en min)} & t & 60 \\\\ \n'
            texteCorr += '\\hline\n'
            texteCorr += '\\end{array}$'
            texteCorr += '<br><br>'
            texteCorr += `$t=\\dfrac{${texNombre(d)}\\times 60}{${v}}=${t}$ \n`
          } else {
            const tFrac = new FractionEtendue(d, v)
            texteCorr = `$t = \\dfrac{d}{v} = \\dfrac{${texNombre(d)}~\\text{km}}{${v}~\\text{km/h}} = ${tFrac.texFractionSimplifiee}~\\text{h} = ${tFrac.texFractionSimplifiee} \\times 60~\\text{min} = ${t}~\\text{min}$`
          }
          texteCorr += '<br><br>'
          texteCorr += `${prenom} mettra`
          texteCorr += this.interactif ? ` ${texteEnCouleurEtGras(t)} min` : ` ${texteEnCouleurEtGras(minToHour(t))}`
          texteCorr += ` pour aller ${destination}.`
          texteApres = sp() + ' minutes'
          setReponse(this, i, t)
          break
        case 'distance':
          texte = `${prenom} roule à ${v} km/h de moyenne pendant ${minToHour(t)}. Calculer la distance parcourue`
          texte += this.interactif ? ' : ' : '.'
          if (this.sup2 === 1) {
            if (context.isHtml) {
              texteCorr = '$\\def\\arraystretch{2.5}\\begin{array}{|l|c|c|}\n'
            } else {
              texteCorr = '$\\begin{array}{|l|c|c|}\n'
            }
            texteCorr += '\\hline\n'
            texteCorr += `\\text{Distance (en km)} & d & ${v}\\\\ \n`
            texteCorr += '\\hline\n'
            texteCorr += `\\text{Temps (en min)} & ${t} & 60 \\\\ \n`
            texteCorr += '\\hline\n'
            texteCorr += '\\end{array}$'
            texteCorr += '<br><br>'
            texteCorr += `$d=\\dfrac{${texNombre(t)}\\times ${v}}{60}=${texNombre(d)}$ \n`
          } else {
            if (tHour === 0) {
              texteCorr = `$d = v \\times t = ${v}~\\text{km/h} \\times \\dfrac{${t}}{60}~\\text{h} = ${texNombre(d)}~\\text{km}$`
            } else {
              texteCorr = `$d = v \\times t = ${v}~\\text{km/h} \\times \\left(${tHour} + \\dfrac{${tMin}}{60}\\right)~\\text{h} = ${texNombre(d)}~\\text{km}$`
            }
          }
          texteCorr += '<br><br>'
          texteCorr += `${pronomgenre.charAt(0).toUpperCase() + pronomgenre.slice(1)} a donc parcouru ${texteEnCouleurEtGras(stringNombre(d))} km.`
          texteApres = sp() + ' km'
          setReponse(this, i, d)
          break
      }
      texte += ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore', { texteApres })
      if (this.questionJamaisPosee(i, v, t)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
