import { codageAngle } from '../../lib/2d/angles.js'
import { point, pointSurSegment } from '../../lib/2d/points.js'
import { texteParPoint } from '../../lib/2d/textes.ts'
import { rotation } from '../../lib/2d/transformations.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { sp } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const dateModification = '27/03/2024'
export const titre = 'Résoudre des problèmes de calcul de pourcentage par complément à 100%'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const amcReady = true

/**
 * Déduire un pourcentage par complément à 100%
 * @author Jean-Claude Lhote
 */
export const uuid = 'db772'
export const ref = '6N33-2'
export const refs = {
  'fr-fr': ['6N33-2'],
  'fr-ch': ['9NO15-1']
}
export default function CalculerUnPourcentage () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.spacing = 2
  this.spacingCorr = 2
  this.nbCols = 1
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    const typesDeQuestionsDisponibles = [1, 2, 3]
    const listeChoix = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeMoyens = ['en bus', 'en deux-roues', 'à  pied', 'en voiture']
    const listeSports = ['le foot', 'la natation', 'le basket', 'le ping-pong', 'le volley', 'la gym']
    const listeHobbies = ['la couture', 'le cinéma', 'la musique', 'le sport', 'le codage', 'le jardinage', 'la cuisine']
    let p1, p2, p3, moy1, moy2, moy3
    let objets
    const centre = point(5, 5)
    const depart = point(10, 5)
    for (
      let i = 0, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      objets = []
      p1 = randint(6, 9) * 5
      p2 = randint(6, 9) * 5
      p3 = 100 - p1 - p2
      switch (listeChoix[i]) {
        case 1: // Les moyens de déplacement maison collège
          [moy1, moy2, moy3] = combinaisonListes(listeMoyens, 3)
          texte = `Dans un collège, $${p1}${sp(1)}\\%$ des élèves se déplacent ${moy1}, $${p2}${sp(1)}\\%$ ${moy2} et les autres ${moy3}.<br>
          
          `
          texte += `Quel est le pourcentage des élèves qui se déplacent ${moy3} ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: ' %' })
          texteCorr = `Les élèves qui ${moy1} ou qui ${moy2} représentent $${p1}${sp(1)}\\%$ + $${p2}${sp(1)}\\% = ${p1 + p2}${sp(1)}\\%$.<br>`
          texteCorr += `Donc on calcule : $100 - ${p1 + p2}${sp(1)}\\% = ${p3}${sp(1)}\\%$.<br>`
          texteCorr += `$${miseEnEvidence(p3)}${sp(1)}\\%$ des élèves de ce collège se déplacent ${moy3}.<br>`
          if (!context.isHtml) {
            this.canEnonce = texte
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = `$\\ldots ${sp(1)}\\%$`
          }
          break
        case 2: // Les sports pratiqués par les ados
          [moy1, moy2, moy3] = combinaisonListes(listeSports, 3)
          texte = `Dans une association sportive, $${p1}${sp(1)}\\%$ des ados pratiquent ${moy1}, $${p2}${sp(1)}\\%$ ${moy2} et les autres ${moy3}.<br>
          
          `
          texte += `Quel est le pourcentage des ados qui pratiquent ${moy3} ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: ' %' })
          texteCorr = `Les ados qui pratiquent ${moy1} ou ${moy2} représentent $${p1}${sp(1)}\\% + ${p2}${sp(1)}\\% = ${p1 + p2}${sp(1)}\\%$.<br>`
          texteCorr += `Donc on calcule : $100${sp(1)}\\% - ${p1 + p2}${sp(1)}\\% = ${p3}${sp(1)}\\%$.<br>`
          texteCorr += `$${miseEnEvidence(p3)}${sp(1)}\\%$ des ados de cette association sportive pratiquent ${moy3}.<br>`
          if (!context.isHtml) {
            this.canEnonce = texte
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = `$\\ldots ${sp(1)}\\%$`
          }
          break
        case 3: // Les hobbys pratiqués par les ados
          [moy1, moy2, moy3] = combinaisonListes(listeHobbies, 3)
          texte = `Dans une association culturelle, $${p1}${sp(1)}\\%$ des membres ont comme passe-temps favori ${moy1}, pour $${p2}${sp(1)}\\%$ c'est ${moy2} et pour les autres ${moy3}.<br>
          
          `
          texte += `Quel est le pourcentage des membres qui préfèrent ${moy3} ?`
          texte += ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: ' %' })
          texteCorr = `Les membres qui préfèrent ${moy1} ou ${moy2} représentent $${p1}${sp(1)}\\% + ${p2}${sp(1)}\\% = ${p1 + p2}${sp(1)}\\%$.<br>`
          texteCorr += `Donc on calcule : $100${sp(1)}\\% - ${p1 + p2}${sp(1)}\\% = ${p3}${sp(1)}\\%$.<br>`
          texteCorr += `$${miseEnEvidence(p3)}${sp(1)}\\%$ des membres de cette association culturelle préfèrent ${moy3}.<br>`
          if (!context.isHtml) {
            this.canEnonce = texte
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = `$\\ldots ${sp(1)}\\%$`
          }
          break
      }
      objets.push(codageAngle(depart, centre, p1 * 3.6, 4.9, '', 'black', 2, 1, 'red', 0.4), texteParPoint(`${moy1.substring(3)}`, pointSurSegment(centre, rotation(depart, centre, p1 * 1.8), 3), 0))
      objets.push(codageAngle(rotation(depart, centre, p1 * 3.6), centre, p2 * 3.6, 4.9, '', 'black', 2, 1, 'blue', 0.4), texteParPoint(`${moy2.substring(3)}`, pointSurSegment(centre, rotation(depart, centre, p1 * 3.6 + p2 * 1.8), 3), 0))
      objets.push(codageAngle(depart, centre, -p3 * 3.6, 4.9, '', 'black', 2, 1, 'yellow', 0.4, false, true), texteParPoint(`${moy3.substring(3)}`, pointSurSegment(centre, rotation(depart, centre, -p3 * 1.8), 3), 0))
      texteCorr += mathalea2d({
        xmin: 0,
        ymin: 0,
        xmax: 10,
        ymax: 10,
        pixelsParCm: 20,
        scale: 0.5,
        mainlevee: false,
        amplitude: 1
      }, ...objets)
      setReponse(this, i, p3, { formatInteractif: 'calcul', digits: 5, decimals: 2, signe: false })

      if (this.questionJamaisPosee(i, moy1, moy2, moy3)) {
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
