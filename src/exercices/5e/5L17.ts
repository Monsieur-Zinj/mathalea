import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre'
import { tableau, type StyledText } from '../../lib/2d/tableau'
import { arrondi } from '../../lib/outils/nombres'
import { lister } from '../../lib/outils/ecritures'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'

export const titre = 'Traduire la relation de dépendance entre deux grandeurs par un tableau de valeur'
export const dateDePublication = '28/05/2024'

/**
 * Description didactique de l'exercice
 * @author Guillaume Valmont
*/
export const uuid = '01387'
export const refs = {
  'fr-fr': ['5L17'],
  'fr-ch': []
}
export default class TraduireDependanceGrandeursTableau extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup = 3
    this.besoinFormulaireNumerique = ['Nombre de calculs par question ', 10]
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const nbCalculsParQuestion = Number(this.sup)

    const typeQuestionsDisponibles = ['Température ressentie', 'Distance de freinage']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    let ligne1: StyledText[] = []
    let ligne2: StyledText[] = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      switch (listeTypeQuestions[i]) {
        case 'Température ressentie': {
          // https://fr.wikipedia.org/wiki/Temp%C3%A9rature_ressentie
          const vitesseDuVent = randint(1, 50)
          const a = vitesseDuVent > 4.8 ? arrondi(0.6215 + 0.3965 * vitesseDuVent ** 0.16, 2) : arrondi(1 + 0.2 * 0.1345 * vitesseDuVent, 2)
          const b = vitesseDuVent > 4.8 ? arrondi(13.12 - 11.37 * vitesseDuVent ** 0.16, 2) : arrondi(-0.2 * 1.59 * vitesseDuVent, 2)
          const temperaturesACalculer: number[] = []
          for (let i = 0; i < nbCalculsParQuestion; i++) {
            temperaturesACalculer.push(randint(0, 10, temperaturesACalculer))
          }
          temperaturesACalculer.sort()
          texte = `La température ressentie dépend de la vitesse du vent et de la température ambiante.<br>
Pour un vent de ${vitesseDuVent} km/h, on peut calculer la Température Ressentie ($T_R$) à partir de la Température Ambiante ($T_A$) à l'aide de la formule suivante : $T_R = ${texNombre(a, 2)}T_A ${texNombre(b, 2)}$.<br>
En s'aidant d'un tableau, calculer les températures ressenties correspondant à des températures ambiantes de ${lister(temperaturesACalculer.map(t => ` $${t}$ °C`))}.`
          ligne1 = makeLine('\\text{Température Ambiante en °C } (T_A)', temperaturesACalculer.map(t => t.toString()))
          ligne2 = makeLine('\\text{Température Ressentie en °C } (T_R)', temperaturesACalculer.map(t => texNombre(a * t + b, 2, true)))
          break
        }
        case 'Distance de freinage': {
          // https://fr.wikipedia.org/wiki/Distance_d%27arr%C3%AAt
          const secheOuMouillee = choice(['sèche', 'mouillée'])
          const msOuKmh = choice(['m/s', 'km/h'])
          const a0 = secheOuMouillee === 'sèche' ? -11 : -8.5
          const denominateur = msOuKmh === 'm/s' ? -2 * a0 : arrondi(-2 * a0 * 3.6 ** 2, 2)
          const vitesses: number[] = []
          for (let i = 0; i < nbCalculsParQuestion; i++) {
            vitesses.push(randint(10, msOuKmh === 'm/s' ? 36 : 130, vitesses))
          }
          texte = `La distance de freinage d'un véhicule dépend de l'état de la route et de la vitesse à laquelle il roulait avant de commencer à freiner.<br>
Sur une route ${secheOuMouillee}, on peut calculer la Distance de Freinage $(DF)$ en mètres à partir de sa vitesse initiale $(v_0)$ en ${msOuKmh} à l'aide de la formule $DF = \\dfrac{v_0^2}{${texNombre(denominateur, 2)}}$.<br>
En s'aidant d'un tableau, calculer les distances de freinage correspondant à des vitesses de ${lister(vitesses.map(t => ` $${t}$ ${msOuKmh}`))}.`
          ligne1 = makeLine(`\\text{Vitesse initiale en ${msOuKmh}} (v_0)`, vitesses)
          ligne2 = makeLine('\\text{Distance de Freinage en m} (DF)', vitesses.map(v0 => texNombre(v0 ** 2 / (denominateur), 2, true)))
          break
        }
      }
      const monTableau = tableau({ ligne1, ligne2, largeur: 3, largeurTitre: 13 })
      const bordures = fixeBordures([monTableau])
      texteCorr = mathalea2d(Object.assign(bordures, {
        scale: 0.6,
        style: 'display:block'
      }), monTableau)
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    function makeLine (label: string, values: (string | number)[]): StyledText[] {
      return ([label].concat(values.map(t => t.toString()))).map(texte => ({ texte, latex: true, math: true }))
    }
  }
}
