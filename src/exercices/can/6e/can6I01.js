/* eslint-disable camelcase */
import { point, tracePoint } from '../../../lib/2d/points.js'
import { texteParPositionEchelle } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { createLink } from '../../../lib/outils/modales.js'
import { texteGras } from '../../../lib/format/style'
import { stringNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import { context } from '../../../modules/context.js'
import { contraindreValeur, listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { noteLaCouleur, plateau2dNLC } from '../../../modules/noteLaCouleur.js'
import {
  allerA,
  angleScratchTo2d,
  attendre,
  baisseCrayon,
  clone,
  creerLutin,
  orienter
} from '../../../modules/2dLutin.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { roseDesVents, scratchblock } from '../../../modules/scratchblock.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif'

export const dateDePublication = '11/04/2021'
export const titre = 'Noter la couleur (scratch)'
export const interactifType = 'mathLive'
export const interactifReady = true

/**
 * Note_la_couleur() Exercice inspiré de l'activité débranchée de Jean-Yves Labouche Note La Couleur
 * https://www.monclasseurdemaths.fr/profs/algorithmique-scratch/note-la-couleur/
 * @author Jean-Claude Lhote
 */
export const uuid = '667d1'
export const ref = 'can6I01'
export const refs = {
  'fr-fr': ['can6I01'],
  'fr-ch': []
}
export default function CanNoteLaCouleur6 () {
  Exercice.call(this)
  this.titre = titre
  this.nbQuestions = 1
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.pasDeVersionLatex = false
  this.pas_de_version_HMTL = false
  this.typeExercice = 'Scratch'
  this.sup = 1
  this.sup2 = true
  this.sup3 = 1
  this.sup4 = true
  this.relatif = false
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = true

  this.nouvelleVersion = function () {
    const damier = [
      ['Vert', 'Orange', 'Rose', 'Noir', 'Orange', 'Blanc'],
      ['Noir', 'Rouge', 'Rose', 'Vert', 'Orange', 'Rose'],
      ['Orange', 'Gris', 'Rouge', 'Jaune', 'Noir', 'Vert'],
      ['Bleu', 'Jaune', 'Orange', 'Vert', 'Gris', 'Jaune'],
      ['Rose', 'Bleu', 'Rouge', 'Bleu', 'Noir', 'Blanc']
    ]
    this.sup = contraindreValeur(1, 4, this.sup, 1)
    const echelleDessin = 0.4
    const rose = roseDesVents()
    this.listeQuestions = []
    this.listeCorrections = []
    let j, test
    let objetsEnonce = []
    let objetsCorrection = []
    const paramsCorrection = {
      xmin: -1,
      ymin: -1,
      xmax: 11,
      ymax: 9,
      pixelsParCm: 20,
      scale: echelleDessin,
      optionsTikz: 'baseline=3.5 cm'
    }
    let commandes_disponibles
    const sequences_disponibles = []
    let sequence
    let result
    let nb_couleurs
    let instruction
    let couleurs
    let liste_instructions

    let lutin, lutindepart
    let angledepart
    let xdepart
    let ydepart
    context.unitesLutinParCm = 13.33
    context.pixelsParCm = 20
    let pion
    const lePlateau = plateau2dNLC({
      type: this.sup,
      melange: !this.sup4,
      scale: echelleDessin,
      relatif: this.relatif,
      nx: 6,
      ny: 5,
      pas: 20,
      plateau: damier
    })
    for (let q = 0; q < this.nbQuestions;) {
      objetsCorrection = []
      objetsEnonce = []
      objetsEnonce.push(lePlateau.plateau2d)
      objetsCorrection.push(lePlateau.plateau2d)
      let texte = ''
      let texteCorr = ''
      let compteur = 0
      let retour_a_la_case_depart
      let compteur_essais_sequence
      commandes_disponibles = [['AV20', 'AV40'], ['TD90', 'TG90']]
      for (let m = 0; m < 2; m++) {
        for (let n = 0, ins1, ins2, ins3, ins4; n < 2; n++) {
          ins1 = commandes_disponibles[0][m]
          ins2 = commandes_disponibles[1][n]
          ins3 = commandes_disponibles[0][1 - m]
          ins4 = commandes_disponibles[1][1 - n]
          sequences_disponibles.push([ins1, ins2, ins3, 'NLC'], [ins3, ins2, ins1, 'NLC'], [ins1, ins4, ins3, 'NLC'], [ins3, ins4, ins1, 'NLC'])
        }
      }
      retour_a_la_case_depart = true
      while (retour_a_la_case_depart) {
        objetsEnonce.length = 1
        lutin = creerLutin()
        angledepart = choice([90, 0, -90, 180])
        xdepart = 10 + randint(1, 5) * 20
        ydepart = 10 + randint(1, 4) * 20

        pion = noteLaCouleur({
          x: xdepart,
          y: ydepart,
          orientation: angledepart,
          plateau: lePlateau.plateauNLC,
          relatif: this.relatif,
          nx: 6,
          ny: 5,
          pas: 20
        })
        lutin.color = context.isHtml ? colorToLatexOrHTML('green') : colorToLatexOrHTML('black')
        lutin.epaisseur = 2
        lutin.pointilles = 2
        allerA(xdepart, ydepart, lutin)
        orienter(angleScratchTo2d(angledepart), lutin)
        lutindepart = clone(lutin)
        baisseCrayon(lutindepart)
        allerA(xdepart, ydepart, lutindepart)
        objetsEnonce.push(lutindepart)
        baisseCrayon(lutin)
        compteur++
        if (compteur > 5) break
        pion.codeScratch = ''
        couleurs = []
        nb_couleurs = parseInt(this.sup3)
        liste_instructions = []
        j = 0
        compteur_essais_sequence = 0
        pion.codeScratch = '\\begin{scratch}[print,fill,blocks,scale=0.5]\n \\blockinit{quand \\greenflag est cliqué}\n '
        pion.codeScratch += `\\blockmove{aller à x: \\ovalnum{${xdepart}} y: \\ovalnum{${ydepart}}}\n \\blockmove{s'orienter à \\ovalnum{${angledepart}}}\n`
        pion.currentIndex += pion.codeScratch.length
        while (nb_couleurs > j && compteur_essais_sequence < 10) {
          compteur_essais_sequence = 0
          sequence = choice(sequences_disponibles)
          test = pion.testSequence(sequence)
          while (!test[0] && compteur_essais_sequence < 10) {
            compteur_essais_sequence++
            sequence = choice(sequences_disponibles)
            test = pion.testSequence(sequence)
          }
          if (compteur_essais_sequence < 10) {
            retour_a_la_case_depart = false
            for (let i = 0; i < sequence.length; i++) {
              instruction = sequence[i]
              result = pion.testInstruction(instruction, lutin)
              if (instruction === 'NLC') {
                liste_instructions.push(instruction)
                couleurs.push(pion.nlc())
                j++
                pion.codeScratch += result[4] + '\n'
                pion.currentIndex += result[4].length + 1
                lutin = result[5]
                attendre(5, lutin)
              } else {
                liste_instructions.push(instruction)
                pion.currentPos.x = result[1]
                pion.currentPos.y = result[2]
                pion.currentOrientation = result[3]
                pion.codeScratch += result[4] + '\n'
                pion.currentIndex += result[4].length + 1
                lutin = result[5]
              }
            }
          } else {
            angledepart = choice([90, 0, -90, 180])
            xdepart = 10 + randint(1, 5) * 20
            ydepart = 10 + randint(1, 4) * 20
          }
        }
      }
      if (this.sup2) {
        objetsEnonce.push(tracePoint(point(xdepart * 0.075, ydepart * 0.075)))
        for (let i = 1; i < 5; i++) {
          if (i !== 1) {
            objetsEnonce.push(texteParPositionEchelle(stringNombre(20 * i), 1.5 * i, -0.3, 'milieu', 'black', 1.2, 'middle', true, echelleDessin))
          }
        }
        for (let i = 1; i < 4; i++) {
          if (i !== 1) {
            objetsEnonce.push(texteParPositionEchelle(stringNombre(20 * i), -0.5, 1.5 * i, 'milieu', 'black', 1.2, 'middle', true, echelleDessin))
          }
        }
      }
      pion.codeScratch += '\\end{scratch}'
      if (context.isHtml && context.vue !== 'diap') {
        texte = `Cet exercice est tiré de l'excellente activité débranchée ${createLink({ url: 'https://www.monclasseurdemaths.fr/profs/algorithmique-scratch/note-la-couleur/', text: 'Note la couleur' })} de Jean-Yves Labouche.<br>`
        texte += 'Il a été conçu pour étendre les possibilités de fiches proposées.<br>'
        texte += `N'hésitez pas à vous rendre sur le site ${createLink({ url: 'https://www.monclasseurdemaths.fr', text: 'Mon classeur de Maths.fr' })} de Jean-Yves pour y découvrir la multitude de ressources qu'il propose.<br>`
        texte += `Pour jouer, regarder les ${createLink({ url: 'https://coopmaths.fr/alea/assets/pdf/reglesnlc.pdf', text: 'Règles du jeu' })} .<br>`
      } else { texte = '' }
      texte += `Exécuter le programme et trouver la couleur à noter. ${ajouteChampTexteMathLive(this, q, 'alphanumeric ')}<br><br>`
      if (context.isHtml) {
        texte += '<table><tr><td>' +
                    scratchblock(pion.codeScratch) + '</td><td>' + mathalea2d(Object.assign({}, fixeBordures([rose])), rose) +
                    '</td><td>' + `${this.sup === 4 || this.sup === 2
                        ? 'Correspondance chiffre-couleur : <br>0=Blanc ; 1=Noir ; 2=Rouge ; 3=Bleu ; 4=Orange ; 5=Rose ; 6=Jaune ; 7=Vert ; 8=Gris<br>'
                        : ''}` +
                    mathalea2d(paramsCorrection, objetsEnonce) +
                    '</td></tr></table>'
      } else {
        texte += `\\begin{minipage}{0.1\\textwidth} ${scratchblock(pion.codeScratch)} \n \\end{minipage}
        \\begin{minipage}{0.4\\textwidth} \n\t ${mathalea2d(Object.assign({}, fixeBordures([rose]), { scale: 0.5 }), rose)} \n \\end{minipage}
      \\begin{minipage}{0.3\\textwidth} \n\t ${this.sup === 4 || this.sup === 2
                    ? 'Correspondance chiffre-couleur : \\\\\n0=Blanc, 1=Noir, 2=Rouge, 3=Bleu, 4=Orange, 5=Rose, 6=Jaune, 7=Vert, 8=Gris\\\\\n'
                    : ''} ${mathalea2d(paramsCorrection, objetsEnonce)} \n\\end{minipage}`
        if (q < this.nbQuestions - 1 && !context.isHtml) {
          texte += '\n\\newpage'
        }
        this.canEnonce = 'Sur quelle case le lutin s\'arrête pour noter la couleur ?\\\\' + `\\begin{minipage}{0.1\\textwidth}\n${scratchblock(pion.codeScratch)}\n\\end{minipage}\n\\begin{minipage}{0.3\\textwidth}\n ${mathalea2d(Object.assign({}, fixeBordures([rose]), { scale: 0.5 }), rose)}\\end{minipage}`
        this.canReponseACompleter = `${this.sup === 4 || this.sup === 2
                    ? 'Correspondance chiffre-couleur : \\\\\n0=Blanc, 1=Noir, 2=Rouge, 3=Bleu, 4=Orange, 5=Rose, 6=Jaune, 7=Vert, 8=Gris\\\\\n'
                    : ''} ${mathalea2d(paramsCorrection, objetsEnonce)}`
      }
      texteCorr = 'On obtient la couleur suivante :<br> '
      texteCorr += `${texteGras(this.sup === 4 || this.sup === 2 ? '(' + lePlateau.traducNum(couleurs[0]) + ')' + couleurs[0] : couleurs[0])} `
      setReponse(this, q, [couleurs[0], couleurs[0].toLowerCase()], { formatInteractif: 'texte' })
      lutin.animation = `<radialGradient id="Ball" cx="8" cy="-3" r="20" gradientUnits="userSpaceOnUse">
    <stop offset="0" style="stop-color:#FFFF99"/>
    <stop offset="1" style="stop-color:#FF9400"/>
  </radialGradient> <circle fill="url(#Ball)"  r="12" stroke-width="1"
   x="${lutin.listeTraces[0][0] * context.pixelsParCm}"
    y="${-lutin.listeTraces[0][1] * context.pixelsParCm}">\n
    <animateMotion path="M ${lutin.listeTraces[0][0] * context.pixelsParCm} ${-lutin.listeTraces[0][1] * context.pixelsParCm} L`

      for (let i = 0; i < lutin.listeTraces.length; i++) {
        const B = point(lutin.listeTraces[i][2], lutin.listeTraces[i][3])
        lutin.animation += ` ${B.xSVG(context.pixelsParCm)} ${B.ySVG(context.pixelsParCm)} `
      }
      lutin.animation += '" begin="10s" dur="10s" repeatCount="indefinite" />; </circle>'
      objetsCorrection.push(tracePoint(point(xdepart * 0.075, ydepart * 0.075)))
      if (this.sup2) {
        for (let i = 1; i < 5; i++) {
          if (i !== 1) {
            objetsEnonce.push(texteParPositionEchelle(stringNombre(20 * i), 1.5 * i, -0.3, 'milieu', 'black', 1.2, 'middle', true, echelleDessin))
          }
        }
        for (let i = 1; i < 4; i++) {
          if (i !== 1) {
            objetsEnonce.push(texteParPositionEchelle(stringNombre(20 * i), -0.5, 1.5 * i, 'milieu', 'black', 1.2, 'middle', true, echelleDessin))
          }
        }
      }

      if (this.correctionDetaillee) {
        for (let i = 1; i < 5; i++) {
          if (i !== 1) {
            objetsCorrection.push(texteParPositionEchelle(stringNombre(20 * i), 1.5 * i, -0.3, 'milieu', 'black', 1.2, 'middle', true, echelleDessin))
          }
        }
        for (let i = 1; i < 4; i++) {
          if (i !== 1) {
            objetsCorrection.push(texteParPositionEchelle(stringNombre(20 * i), -0.5, 1.5 * i, 'milieu', 'black', 1.2, 'middle', true, echelleDessin))
          }
        }
      }
      texteCorr += '<br><br>' + mathalea2d(paramsCorrection, objetsCorrection, lutin)
      if (q < this.nbQuestions - 1 && !context.isHtml) {
        texteCorr += '\n\\newpage'
      }
      if (this.questionJamaisPosee(q, xdepart, ydepart, angledepart)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        q++
      }
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de plateau', 4, '1 : Plateau couleur sans numéro\n2 : Plateau couleur avec numéros\n3 : Plateau noir et blanc avec nom des couleurs\n4 : Plateau noir et blanc avec numéros']
  this.besoinFormulaire2CaseACocher = ['Graduations', true]
  // this.besoinFormulaire3Numerique = ['Nombre de couleurs (Maximum 6)', 6]
  this.besoinFormulaire4CaseACocher = ['Plateau de jeu original', false]
}
