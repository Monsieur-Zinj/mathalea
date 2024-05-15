import { choice, combinaisonListes, compteOccurences } from '../../lib/outils/arrayOutils'
import { rangeMinMax } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { texTexte } from '../../lib/format/texTexte'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import Decimal from 'decimal.js'
import { fraction } from '../../modules/fractions.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '17/09/2022' // Modifications pour les octets. Pas de nombres décimaux => uniquement des multiplications pour convertir
// Modification le 18/10 pour supprimer math.evaluate et le remplacer par un arrondi

/**
 * Conversions  mètres, litres, grammes, octets (et euros pour la version LaTeX) en utilisant le préfixe pour déterminer la multiplication ou division à faire.
 *
 * * 1 : De da, h, k vers l'unité de référence
 * * 2 : De d, c, m vers l'unité de référence
 * * 3 : Multiplications ou divisions vers l'unité de référence
 * * 4 : Conversions d'octets
 * * 5 : Un mélange de toutes les conversions
 * * Paramètre supplémentaire : utiliser des nombres décimaux (par défaut tous les nombres sont entiers)
 * @author Rémi Angot
 * Relecture : Novembre 2021 par EE
 */
export default function ExerciceConversions (niveau = 1) {
  Exercice.call(this)
  this.sup = niveau // Niveau de difficulté de l'exercice
  this.sup2 = false // Avec des nombres décimaux ou pas
  this.titre =
        'Convertir des longueurs, masses, contenance, prix ou unités informatiques'
  this.consigne = 'Compléter : '
  this.spacing = 2
  this.correction_avec_des_fractions = false

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const prefixeMulti = [
      ['da', 10],
      ['h', 100],
      ['k', 1000]
    ] // ['M',1000000],['G',1000000000],['T',1000000000000]];
    const prefixeDiv = [
      ['d', 10],
      ['c', 100],
      ['m', 1000]
    ]
    let listeDesProblemes = []
    listeDesProblemes[0] = this.sup
    if (compteOccurences(listeDesProblemes, 5) > 0) listeDesProblemes = rangeMinMax(1, 4) // Teste si l'utilisateur a choisi tout
    listeDesProblemes = combinaisonListes(listeDesProblemes, this.nbQuestions)
    const listeDesOperations = combinaisonListes([true, false], this.nbQuestions)
    for (let i = 0,
      val,
      k,
      div,
      resultat,
      unite,
      texte,
      texteCorr,
      listeUniteInfo,
      cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // On limite le nombre d'essais pour chercher des valeurs nouvelles
      k = randint(0, 2) // Choix du préfixe
      switch (listeDesProblemes[i]) {
        case 1 :
          div = false // Il n'y aura pas de division
          break
        case 2 :
          div = true // Avec des divisions
          break
        case 3 :
          div = listeDesOperations[i] // Avec des multiplications ou des divisions
          break
        case 4 :
          listeUniteInfo = ['octets', 'ko', 'Mo', 'Go', 'To']
          break
      }
      let nbChiffreArrondi
      if (this.sup2) {
        // Si la case pour les nombres décimaux est cochée
        nbChiffreArrondi = 2
        val = choice([
          new Decimal(randint(1, 9)).div(10).add(randint(1, 19)),
          new Decimal(randint(1, 9)).div(10),
          new Decimal(randint(1, 9)).div(100),
          new Decimal(randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9)).div(100)
        ])
        // XX,X 0,X 0,0X X,XX
      } else {
        nbChiffreArrondi = 0
        val = new Decimal(choice([
          randint(1, 9),
          randint(1, 9) * 10,
          randint(1, 9) * 100,
          randint(1, 9) * 10 + randint(1, 9)
        ]))
        // X, X0, X00, XX
      }

      if (!div && listeDesProblemes[i] < 4) {
        // Si il faut multiplier pour convertir
        if (k < 2) {
          // Choix de l'unité
          unite = choice(['m', 'L', 'g'])
        } else if (k === 2) {
          if (context.isHtml) {
            unite = choice(['m', 'L', 'g']) // pas de signe € pour KaTeX
          } else {
            unite = choice(['m', 'L', 'g', '€'])
          }
        } else {
          unite = 'o'
        }

        resultat = val.mul(prefixeMulti[k][1])
        texte = '$ ' + texNombre(val, nbChiffreArrondi) + texTexte(prefixeMulti[k][0] + unite) + ' = ' + (this.interactif && context.isHtml ? `$ ${ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteApres: '$' + texTexte(unite) + '$' })}` : `\\dotfill ${texTexte(unite)}$`)

        texteCorr =
                    '$ ' +
                    texNombre(val, nbChiffreArrondi) +
                    texTexte(prefixeMulti[k][0] + unite) +
                    ' =  ' +
                    texNombre(val, nbChiffreArrondi) +
                    '\\times' +
                    texNombre(prefixeMulti[k][1], nbChiffreArrondi) +
                    texTexte(unite) +
                    ' = ' +
                    texNombre(resultat, Math.max(0, nbChiffreArrondi - k - 1)) +
                    texTexte(unite) +
                    '$'
      } else if (div &&
                listeDesProblemes[i] < 4 &&
                this.correction_avec_des_fractions) {
        unite = choice(['m', 'L', 'g'])
        resultat = val.div(prefixeDiv[k][1])
        texte =
                    '$ ' +
                    texNombre(val, nbChiffreArrondi) +
                    texTexte(prefixeDiv[k][0] + unite) +
                    ' = ' + (this.interactif && context.isHtml ? `$ ${ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteApres: ' $' + texTexte(unite) + '$' })}` : ` \\dotfill ${texTexte(unite)}$`)
        texteCorr =
                    '$ ' +
                    texNombre(val, nbChiffreArrondi) +
                    texTexte(prefixeDiv[k][0] + unite) +
                    ' =  ' +
                    fraction(texNombre(val), prefixeDiv[k][1]).texFraction +
                    texTexte(unite) +
                    ' = ' +
                    texNombre(resultat, nbChiffreArrondi + 3) +
                    texTexte(unite) +
                    '$'
      } else if (div && listeDesProblemes[i] < 4) {
        unite = choice(['m', 'L', 'g'])
        resultat = val.div(prefixeDiv[k][1])
        texte =
                    '$ ' +
                    texNombre(val, nbChiffreArrondi) +
                    texTexte(prefixeDiv[k][0] + unite) +
                    ' = ' + (this.interactif && context.isHtml ? `$ ${ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteApres: ' $' + texTexte(unite) + '$' })}` : ` \\dotfill ${texTexte(unite)}$`)
        texteCorr =
                    '$ ' +
                    texNombre(val, nbChiffreArrondi) +
                    texTexte(prefixeDiv[k][0] + unite) +
                    ' =  ' +
                    texNombre(val, nbChiffreArrondi) +
                    '\\div' +
                    texNombre(prefixeDiv[k][1], 0) +
                    texTexte(unite) +
                    ' = ' +
                    texNombre(resultat, nbChiffreArrondi + k + 1) +
                    texTexte(unite) +
                    '$'
      } else {
        // pour type de question = 4
        div = (!this.sup2) ? false : listeDesOperations[i] // Pas de décimaux ? Alors que des multiplications
        let unite1 // unité de résultat
        let unite2 // unité du départ
        if (!div) {
          unite2 = randint(1, 4)
          unite1 = randint(0, unite2 - 1)
        } else {
          unite1 = randint(1, 4)
          unite2 = randint(0, unite1 - 1)
        }
        const ecart = unite2 - unite1 // nombre de multiplication par 1000 pour passer de l'un à l'autre
        if (unite1 === 0 && val % 1 !== 0) val = new Decimal(randint(3, 100)) // Pas de nombre d'octets non entiers
        if (!div) {
          resultat = val.mul(Math.pow(10, 3 * ecart))
          unite = listeUniteInfo[unite1]
          texte =
                        '$ ' +
                        texNombre(val, nbChiffreArrondi) +
                        texTexte(listeUniteInfo[unite2]) +
                        ' = ' + (this.interactif && context.isHtml ? `$ ${ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteApres: ' $' + texTexte(unite) + '$' })}` : ` \\dotfill ${texTexte(unite)}$`)
          texteCorr =
                        '$ ' +
                        texNombre(val, nbChiffreArrondi) +
                        texTexte(listeUniteInfo[unite2]) +
                        ' =  ' +
                        texNombre(val, nbChiffreArrondi) +
                        '\\times' +
                        texNombre(Math.pow(10, 3 * ecart), 0) +
                        texTexte(unite) +
                        ' = ' +
                        texNombre(resultat, 0) +
                        texTexte(unite) +
                        '$'
        } else {
          val = val.div(Math.pow(10, randint(3 * ecart - 1, 3 * ecart + 1)))
          resultat = val.mul(Math.pow(10, 3 * ecart))
          unite = listeUniteInfo[unite1]
          texte = '$ ' +
                        texNombre(val, nbChiffreArrondi + 3 * ecart) +
                        texTexte(listeUniteInfo[unite2]) +
                        ' = ' + (this.interactif && context.isHtml ? `$ ${ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteApres: ' $' + texTexte(unite) + '$' })}` : ` \\dotfill ${texTexte(unite)}$`)
          texteCorr =
                        '$ ' +
                        texNombre(val, nbChiffreArrondi + 3 * ecart) +
                        texTexte(listeUniteInfo[unite2]) +
                        ' =  ' +
                        texNombre(val, nbChiffreArrondi + 3 * ecart) +
                        '\\div' +
                        texNombre(Math.pow(10, -3 * ecart), 3 * ecart) +
                        texTexte(unite) +
                        ' = ' +
                        texNombre(resultat) +
                        texTexte(unite) +
                        '$'
        }
      }

      // EE : Mise en couleur de la réponse interactive
      const aMettreEnCouleur = miseEnEvidence(texteCorr.split('=').pop().replaceAll('$', '')) + '$'
      texteCorr = texteCorr.replace(texteCorr.split('=').pop(), '') + aMettreEnCouleur.replace(texTexte(unite), '') + '$' + texTexte(unite) + '$'

      if (this.questionJamaisPosee(i, val, resultat)) {
        setReponse(this, i, resultat)
        // Si la question n'a jamais été posée, on en crée une autre
        if (context.vue === 'diap') {
          texte = texte.replace('= \\dotfill', '\\text{ en }')
        }
        if (context.isHtml) {
          texte = texte.replace(
            '\\dotfill',
            '................................................'
          )
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  this.besoinFormulaireNumerique = ['Niveau de difficulté', 5, "1 : De da, h, k vers l'unité de référence\n2 : De d, c, m vers l'unité de référence\n3 : Multiplications ou divisions vers l'unité de référence\n4 : Conversions avec les octets\n5 : Mélange"]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
}
