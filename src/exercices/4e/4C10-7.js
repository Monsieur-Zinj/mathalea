import { combinaisonListes } from '../../lib/outils/arrayOutils'
import {
  ecritureAlgebrique,
  ecritureNombreRelatif,
  ecritureNombreRelatifc,
  ecritureParentheseSiNegatif
} from '../../lib/outils/ecritures'
import { nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { context } from '../../modules/context.js'
import { sp } from '../../lib/outils/outilString'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Opérations avec deux entiers relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Effectuer des opérations avec 2 nombres relatifs
 *
 * * On peut choisir les 4 opérations
 * @author Mickael Guironnet - Rémi Angot
 */
export const uuid = '0b020'
export const ref = '4C10-7'
export const refs = {
  'fr-fr': ['4C10-7'],
  'fr-ch': ['10NO4-9']
}
export default function ExerciceOperationsRelatifs () {
  Exercice.call(this)
  this.sup = false // écriture simplifiée
  this.sup2 = 5 // Mélange par défaut
  this.sup3 = 10 // Valeur maximum
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.nbQuestions = 10

  this.nouvelleVersion = function () {
    const listeTypeDeSignes = combinaisonListes(['-+', '+-', '--', '-+', '+-', '--', '++'], this.nbQuestions)
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      nbQuestions: this.nbQuestions,
      saisie: this.sup2,
      max: 4,
      melange: 5,
      defaut: 2
    })
    for (let i = 0, a, b, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // On limite le nombre d'essais pour chercher des valeurs nouvelles
      switch (listeTypeDeQuestions[i]) {
        case 2:
          b = randint(2, 9)
          a = b * randint(2, this.sup3)
          break
        case 1:
        case 3:
        case 4:
          b = randint(2, this.sup3)
          a = randint(2, this.sup3)
          break
      }
      switch (listeTypeDeSignes[i]) {
        case '-+':
          a *= -1
          break
        case '+-':
          b *= -1
          break
        case '--':
          a *= -1
          b *= -1
          break
      }
      switch (listeTypeDeQuestions[i]) {
        case 1: // multiplications
          if (this.sup) {
            texte = `$ ${a}  \\times ${ecritureParentheseSiNegatif(b)}$`
            texteCorr = `$ ${a}  \\times ${ecritureParentheseSiNegatif(b)} = ${calculANePlusJamaisUtiliser(a * b)} $`
          } else {
            texte = `$ ${ecritureNombreRelatif(a)}  \\times ${ecritureNombreRelatif(b)}$`
            texteCorr = `$ ${ecritureNombreRelatifc(a)} \\times ${ecritureNombreRelatifc(b)}  = ${ecritureNombreRelatifc(a * b, { color: '#f15929' })} $`
          }
          setReponse(this, i, a * b, {
            signe: true,
            digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(a * b)),
            decimals: 0
          })
          break
        case 2: // quotients
          if (this.sup) {
            texte = `$ ${a} \\div ${ecritureParentheseSiNegatif(b)}$`
            texteCorr = `$ ${a} \\div ${ecritureParentheseSiNegatif(b)} = ${calculANePlusJamaisUtiliser(a / b)}$`
          } else {
            texte = `$ ${ecritureNombreRelatif(a)}  \\div ${ecritureNombreRelatif(b)}$`
            texteCorr = `$ ${ecritureNombreRelatifc(a)}  \\div ${ecritureNombreRelatifc(b)} = ${ecritureNombreRelatifc(a / b, { color: '#f15929' })}$`
          }
          setReponse(this, i, calculANePlusJamaisUtiliser(a / b), {
            signe: true,
            digits: 1,
            decimals: 0
          })
          break
        case 3: // additions
          if (this.sup) {
            texte = `$ ${a} + ${ecritureParentheseSiNegatif(b)} $`
            texteCorr = `$ ${a} + ${ecritureParentheseSiNegatif(b)}  = ${calculANePlusJamaisUtiliser(a + b)} $`
          } else {
            texte = `$ ${ecritureNombreRelatif(a)} + ${ecritureNombreRelatif(b)} $`
            texteCorr = `$  ${ecritureNombreRelatifc(a)} + ${ecritureNombreRelatifc(b)} = ${ecritureNombreRelatifc(a + b, { color: '#f15929' })} $`
          }
          setReponse(this, i, a + b, {
            signe: true,
            digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(a + b)),
            decimals: 0
          })
          break
        case 4: // soustractions
          if (this.sup) {
            texte = `$ ${a} - ${ecritureNombreRelatif(b)}$`
            texteCorr = `$ ${a} - ${ecritureNombreRelatif(b)} = ${a - b} $`
          } else {
            texte = `$ ${ecritureNombreRelatif(a)} - ${ecritureNombreRelatif(b)} $`
            texteCorr = `$  ${ecritureNombreRelatifc(a)} - ${ecritureNombreRelatifc(b)} = ${ecritureNombreRelatifc(a - b, { color: '#f15929' })} $`
          }
          setReponse(this, i, [a - b, `(${ecritureAlgebrique(a - b)})`], {
            signe: true,
            digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(a - b)),
            decimals: 0
          })
          break
      }
      texte += ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore', { texteAvant: sp() + '$=$' })

      if (this.sup) {
      // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras

        const textCorrSplit = texteCorr.split('=')
        let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
        aRemplacer = aRemplacer.replace('$', '').replace('<br>', '')

        texteCorr = ''
        for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
          texteCorr += textCorrSplit[ee] + '='
        }
        texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`

      // Fin de cette uniformisation
      }

      if (this.questionJamaisPosee(i, listeTypeDeQuestions[i], a, b)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i].propositions = [{ statut: 0, sanscadre: false, texte: texteCorr }]
          this.autoCorrection[i].enonce = 'Calculer.\\\\' + texte
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Avec des écritures simplifiées']
  this.besoinFormulaire2Texte = [
    'Type de questions', [
      'Nombres séparés par des tirets',
      '1 : multiplication',
      '2 : division',
      '3 : addition',
      '4 : soustraction',
      '5 : Mélange'
    ].join('\n')
  ]
  this.besoinFormulaire3Numerique = ['Valeur maximale', 99999]
}
