import { choice } from '../../lib/outils/arrayOutils'
import Hms from '../../modules/Hms'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Additionner des durées'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Additions de durées de différents :
 * * MS+MS=1hMS sans retenue sur les s
 * * MS+MS=1hMS avec retenue
 * * HM+HM avec retenue
 * * HMS+HMS avec retenue sur les min
 * * HMS+HMS avec retenues min et s
 * @author Rémi Angot
 * Référence 6D11
 */
export const uuid = '5f315'
export const ref = '6D11'
export const refs = {
  'fr-fr': ['6D11'],
  'fr-ch': ['10GM3-3']
}
export default function SommeDeDurees () {
  Exercice.call(this)
  this.titre = titre
  this.keyboard = ['hms']
  this.consigne = this.nbQuestions > 1 ? 'Compléter les égalités suivantes.' : 'Compléter l\'égalité suivante.'
  this.sup = '1-2' // 2 niveaux de difficultés
  this.spacing = 2
  this.nbQuestions = 5
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    /*
    if (this.sup === 1) {
      typesDeQuestions = combinaisonListes([1, 3], this.nbQuestions)
    } else {
      typesDeQuestions = combinaisonListes(
        [1, 2, 3, 4, 5],
        this.nbQuestions
      )
    } */
    const typesDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 5,
      defaut: 6,
      melange: 6,
      nbQuestions: this.nbQuestions
    })

    for (let i = 0, h1, h2, m1, m2, s1, s2, t1, t2, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (typesDeQuestions[i] === 1) {
        s1 = randint(11, 39)
        s2 = randint(1, 20)
        m1 = randint(20, 59)
        m2 = randint(40, 59)
        t1 = new Hms({ minute: m1, second: s1 })
        t2 = new Hms({ minute: m2, second: s2 })
        setReponse(this, i, t1.add(t2), { formatInteractif: 'hms' })
        texte = `$${m1}~\\text{min}~${s1}~\\text{s}+${m2}~\\text{min}~${s2}~\\text{s}=$`
        texteCorr = `$${m1}~\\text{min}~${s1}~\\text{s}+${m2}~\\text{min}~${s2}~\\text{s}= ${m1 + m2}~\\text{min}~${s1 + s2}~\\text{s}= ${miseEnEvidence(`1~\\text{h}~${m1 + m2 - 60}~\\text{min}~${s1 + s2}~\\text{s}`)}$`
      } else if (typesDeQuestions[i] === 2) {
        h1 = randint(2, 12)
        h2 = randint(2, 11)
        m1 = randint(30, 50)
        m2 = randint(30, 50)
        t1 = new Hms({ minute: m1, hour: h1 })
        t2 = new Hms({ minute: m2, hour: h2 })
        setReponse(this, i, t1.add(t2), { formatInteractif: 'hms' })
        texte = `$${h1}~\\text{h}~${m1}~\\text{min}+${h2}~\\text{h}~${m2}~\\text{min}=$`
        texteCorr = `$${h1}~\\text{h}~${m1}~\\text{min}+${h2}~\\text{h}~${m2}~\\text{min}= ${h1 + h2}~\\text{h}~${m1 + m2}~\\text{min} = ${miseEnEvidence(`${h1 + h2 + 1}~\\text{h}~${m1 + m2 - 60}~\\text{min}`)}$`
      } else if (typesDeQuestions[i] === 3) {
        h1 = randint(2, 12)
        h2 = randint(2, 11)
        m1 = randint(20, 40)
        m2 = randint(10, 59 - m1)
        s1 = randint(2, 55)
        s2 = randint(1, 59 - s1)
        t1 = new Hms({ hour: h1, minute: m1, second: s1 })
        t2 = new Hms({ hour: h2, minute: m2, second: s2 })
        setReponse(this, i, t1.add(t2), { formatInteractif: 'hms' })
        texte = `$${h1}~\\text{h}~${m1}~\\text{min}~${s1}~\\text{s}+${h2}~\\text{h}~${m2}~\\text{min}~${s2}~\\text{s}=$`
        texteCorr = `$${h1}~\\text{h}~${m1}~\\text{min}~${s1}~\\text{s}+${h2}~\\text{h}~${m2}~\\text{min}~${s2}~\\text{s}= ${miseEnEvidence(`${h1 + h2}~\\text{h}~${m1 + m2}~\\text{min}~${s1 + s2}~\\text{s}`)}$`
      } else if (typesDeQuestions[i] === 4) {
        s1 = randint(21, 39)
        s2 = randint(40, 59)
        m1 = randint(20, 59)
        m2 = randint(40, 59)
        t1 = new Hms({ minute: m1, second: s1 })
        t2 = new Hms({ minute: m2, second: s2 })
        setReponse(this, i, t1.add(t2), { formatInteractif: 'hms' })
        texte = `$${m1}~\\text{min}~${s1}~\\text{s}+${m2}~\\text{min}~${s2}~\\text{s}=$`
        texteCorr = `$${m1}~\\text{min}~${s1}~\\text{s}+${m2}~\\text{min}~${s2}~\\text{s}= ${m1 + m2}~\\text{min}~${s1 + s2}~\\text{s} = ${m1 + m2 + 1}~\\text{min}~${s1 + s2 - 60}~\\text{s} = ${miseEnEvidence(`1~\\text{h}~${m1 + m2 + 1 - 60}~\\text{min}~${s1 + s2 - 60}~\\text{s}`)}$`
      } else if (typesDeQuestions[i] === 5) {
        if (choice([true, false])) {
          h1 = randint(2, 12)
          h2 = randint(2, 11)
          m1 = randint(30, 50)
          m2 = randint(30, 50)
          s1 = randint(2, 55)
          s2 = randint(1, 60 - s1 - 1)
          t1 = new Hms({ hour: h1, minute: m1, second: s1 })
          t2 = new Hms({ hour: h2, minute: m2, second: s2 })
          setReponse(this, i, t1.add(t2), { formatInteractif: 'hms' })
          texte = `$${h1}~\\text{h}~${m1}~\\text{min}~${s1}~\\text{s}+${h2}~\\text{h}~${m2}~\\text{min}~${s2}~\\text{s}=$`
          texteCorr = `$${h1}~\\text{h}~${m1}~\\text{min}~${s1}~\\text{s}+${h2}~\\text{h}~${m2}~\\text{min}~${s2}~\\text{s}= ${h1 + h2}~\\text{h}~${m1 + m2}~\\text{min}~${s1 + s2}~\\text{s} = ${miseEnEvidence(`${h1 + h2 + 1}~\\text{h}~${m1 + m2 - 60}~\\text{min}~${s1 + s2}~\\text{s}`)}$`
        } else {
          h1 = randint(2, 12)
          h2 = randint(2, 11)
          m1 = randint(30, 50)
          m2 = randint(30, 50)
          s1 = randint(2, 55)
          s2 = randint(60 - s1, 59)
          t1 = new Hms({ hour: h1, minute: m1, second: s1 })
          t2 = new Hms({ hour: h2, minute: m2, second: s2 })
          setReponse(this, i, t1.add(t2), { formatInteractif: 'hms' })
          texte = `$${h1}~\\text{h}~${m1}~\\text{min}~${s1}~\\text{s}+${h2}~\\text{h}~${m2}~\\text{min}~${s2}~\\text{s}=$`
          texteCorr = `$${h1}~\\text{h}~${m1}~\\text{min}~${s1}~\\text{s}+${h2}~\\text{h}~${m2}~\\text{min}~${s2}~\\text{s}=`
          texteCorr += ` ${h1 + h2}~\\text{h}~${m1 + m2}~\\text{min}~${s1 + s2}~\\text{s} = ${h1 + h2}~\\text{h}~${m1 + m2 + 1}~\\text{min}~${s1 + s2 - 60}~\\text{s} =${miseEnEvidence(`${h1 + h2 + 1}~\\text{h}~${m1 + m2 + 1 - 60}~\\text{min}~${s1 + s2 - 60}~\\text{s}`)}$`
        }
      }

      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, i, ' clavierHms')
      }

      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Niveau de difficulté', 'Nombres séparés par des tirets\n1 : Additions minutes-secondes sans conversion\n2 : Additions heures-minutes sans conversion\n3 : Additions heures-minutes-secondes sans conversion\n4 : Additions minutes-secondes avec potentielle conversion\n5 : Additions heures-minutes-secondes avec potentielle conversion\n6 : Mélange']
}
