import { sp } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { randint, listeQuestionsToContenu, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { min } from 'mathjs'
import { propositionsQcm } from '../../lib/interactif/qcm'
export const titre = 'Connaître le vocabulaire lié aux 4 opérations'
export const interactifReady = true
export const interactifType = 'qcm'

/**
 * Exercice sur le vocabulaire : somme, différence, produit, quotient...
 * @author Mickael Guironnet
 */
export const uuid = '32e02'
export const ref = '6C13-1'
export const refs = {
  'fr-fr': ['6C13-1'],
  'fr-ch': ['9NO1-7']
}
export default function VocabulaireSur4Operations () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 5
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 15
  this.spacing = 2

  this.nouvelleVersion = function () {
    /*
    let typesDeQuestionsDisponibles = []
    if (!this.sup || this.sup === '0') { // Si aucune liste n'est saisie
      typesDeQuestionsDisponibles = rangeMinMax(1, 14)
    } else {
      if (typeof (this.sup) === 'number') { // Si c'est un nombre, c'est que le nombre a été saisi dans la barre d'adresses
        this.sup === 0 ? typesDeQuestionsDisponibles = rangeMinMax(1, 14) : typesDeQuestionsDisponibles = contraindreValeur(1, 14, this.sup, 4)
      } else {
        typesDeQuestionsDisponibles = this.sup.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
        for (let i = 0; i < typesDeQuestionsDisponibles.length; i++) { // on a un tableau avec des strings : ['1', '5', '2','toto','45']
          typesDeQuestionsDisponibles[i] = contraindreValeur(1, 14, parseInt(typesDeQuestionsDisponibles[i]), randint(1, 14)) // parseInt en fait un tableau d'entiers
        }
      }
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    */
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 14,
      defaut: 15,
      melange: 15,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeVoc = ['des termes', 'des facteurs', 'le diviseur', 'le dividende', 'le reste', 'la somme', 'la différence', 'le produit', 'le quotient']
    for (let i = 0, texte, a, b, reste, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const reponse = {
        textes: [],
        statuts: []
      }
      do {
        a = randint(2, 10)
        b = randint(2, 10, [a])
        if (a < b) { [a, b] = [b, a] }
      } while (a - b === a || a - b === b)
      texte = ''
      texteCorr = ''
      switch (listeTypeDeQuestions[i]) {
        case 1:
          texte +=

            `Dans l'opération «${sp()}$${a} + ${b}$${sp()}», comment s'appellent les nombres $${a}$ et $${b}$ ?`
          texteCorr += `Dans l'opération «${sp()}$${a} + ${b}$${sp()}», $${a}$ et $${b}$ s'appellent des termes.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'des termes')
          break
        case 2:
          texte +=

            `Dans l'égalité «${sp()}$${a} + ${b} = ${a + b}$ ${sp()}», comment s'appelle le nombre $${a + b}$ ?`
          texteCorr += `Dans l'égalité «${sp()}$${a} + ${b} = ${a + b}$${sp()}», $${a + b}$ s'appelle la somme de $${a}$ et $${b}$.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'la somme')
          break
        case 3:
          texte +=

            `Quelle est la somme de $${a}$ et $${b}$ ?`
          texteCorr += `La somme de $${a}$ et $${b}$ est $${a + b}$ car $${a}+${b}=${a + b}$.`
          reponse.textes = [a, b, a + b, a * b, a - b]
          reponse.statuts = [false, false, true, false, false]
          break
        case 4:
          texte +=

            `Dans l'opération «${sp()}$${a} - ${b}$${sp()}», comment s'appellent les nombres $${a}$ et $${b}$ ?`
          texteCorr += `Dans l'opération «${sp()}$${a} - ${b}$${sp()}», $${a}$ et $${b}$ s'appellent des termes.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'des termes')
          break
        case 5:
          texte +=

            `Dans l'égalité «${sp()}$${a} - ${b} = ${a - b}$${sp()}», comment s'appelle le nombre $${a - b}$ ?`
          texteCorr += `Dans l'égalité «${sp()}$${a} - ${b} = ${a - b}$${sp()}», $${a - b}$ s'appelle la différence entre $${a}$ et $${b}$.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'la différence')
          break
        case 6:
          texte +=

            `Quelle est la différence entre $${a}$ et $${b}$ ?`
          texteCorr += `La différence entre $${a}$ et $${b}$ est $${a - b}$ car $${a}-${b}=${a - b}$.`
          reponse.textes = [a, b, a + b, a * b, a - b]
          reponse.statuts = [false, false, false, false, true]
          break
        case 7:
          texte +=

            `Dans l'opération «${sp()}$${a} \\times ${b}$${sp()}», comment s'appellent les nombres $${a}$ et $${b}$ ?`
          texteCorr += `Dans l'opération «${sp()}$${a} \\times ${b}$${sp()}», $${a}$ et $${b}$ s'appellent des facteurs.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'des facteurs')
          break
        case 8:
          texte +=

            `Dans l'égalité «${sp()}$${a} \\times ${b} = ${a * b}$${sp()}», comment s'appelle le nombre $${a * b}$ ?`
          texteCorr += `Dans l'égalité «${sp()}$${a} \\times ${b} = ${a * b}$${sp()}», $${a * b}$ s'appelle le produit de $${a}$ et $${b}$.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'le produit')
          break
        case 9:
          texte +=

            `Quel est le produit de $${a}$ et $${b}$ ?`
          texteCorr += `Le produit de $${a}$ et $${b}$ est $${a * b}$ car $${a}\\times${b}=${a * b}$.`
          reponse.textes = [a, b, a + b, a * b, a - b]
          reponse.statuts = [false, false, false, true, false]
          break
        case 10:
          texte +=

            `Dans l'opération «${sp()}$${a * b} \\div ${b}$${sp()}», comment s'appelle le nombre $${a * b}$ ?`
          texteCorr += `Dans l'opération «${sp()}$${a * b} \\div ${b}$${sp()}», $${a * b}$ s'appelle le dividende.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'le dividende')
          break
        case 11:
          texte +=

            `Dans l'opération «${sp()}$${a * b} \\div ${b}$${sp()}», comment s'appelle le nombre $${b}$ ?`
          texteCorr += `Dans l'opération «${sp()}$${a * b} \\div ${b}$${sp()}», $${b}$ s'appelle le diviseur.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'le diviseur')
          break
        case 12:
          texte +=

            `Dans l'égalité «${sp()}$${a * b} \\div ${b} = ${a}$${sp()}», comment s'appelle le nombre $${a}$ ?`
          texteCorr += `Dans l'égalité «${sp()}$${a * b} \\div ${b} = ${a}$${sp()}», $${a}$ s'appelle le quotient de  $${a * b}$ par $${b}$.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'le quotient')
          break
        case 13:
          reste = randint(1, min(a, b) - 1)
          texte +=

            `Dans l'égalité «${sp()}$${a * b + reste} = ${b} \\times ${a} + ${reste} $${sp()}», comment s'appelle le nombre $${reste}$ ?`
          texteCorr += `Dans l'égalité «${sp()}$${a * b + reste} = ${b} \\times ${a} + ${reste} $${sp()}», $${reste}$ s'appelle le reste du quotient de  $${a * b + reste}$ par $${b}$ ou de $${a * b + reste}$ par $${a}$.`
          reponse.textes = listeVoc
          reponse.statuts = listeVoc.map(el => el === 'le reste')
          break
        case 14:
          texte +=

            `Quel est le quotient de $${a * b}$ par $${b}$ ?`
          texteCorr += `Le quotient de $${a * b}$ par $${b}$ est $${a}$ car $${a * b}\\div${b}=${a}$.`
          reponse.textes = [a, b, a * b, a * b + b, a * b - b]
          reponse.statuts = [true, false, false, false, false]
          break
      }
      const props = []
      for (let j = 0; j < reponse.textes.length; j++) {
        props.push({
          texte: reponse.textes[j],
          statut: reponse.statuts[j]
        })
      }
      this.autoCorrection[i] = {
        propositions: props,
        options: {
          ordered: true,
          nbCols: 5
        }
      }
      const monQcm = propositionsQcm(this, i)
      if (this.interactif) {
        texte += monQcm.texte
      }
      if (this.questionJamaisPosee(this, i, a, b, listeTypeDeQuestions[i])) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Type de questions', [
    'Nombres séparés par des tirets',
    '1 : Addition (terme)',
    '2 : Addition (somme)',
    '3 : Addition (calcul)',
    '4 : Soustraction (terme)',
    '5 : Soustraction (différence)',
    '6 : Soustraction (calcul)',
    '7 : Multiplication (facteur)',
    '8 : Multiplication (produit)',
    '9 : Multiplication (calcul)',
    '10 : Division (dividende)',
    '11 : Division (diviseur)',
    '12 : Division (quotient)',
    '13 : Division (reste)',
    '14 : Division (calcul)`',
    '15 : Mélange'
  ].join('\n')
  ]
}
