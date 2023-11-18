import { arcPointPointAngle } from '../../lib/2d/cercle.js'
import { texteSurArc } from '../../lib/2d/codages.js'
import { droite } from '../../lib/2d/droites.js'
import { point } from '../../lib/2d/points.js'
import { vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint } from '../../lib/2d/textes.js'
import { homothetie, rotation, translation } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import Exercice from '../Exercice.js'
import { mathalea2d, colorToLatexOrHTML, fixeBordures } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import { pickRandom } from 'mathjs'
import { aleaVariables } from '../../modules/outilsMathjs.js'
import { miseEnEvidence, texteEnCouleurEtGras, texteGras } from '../../lib/outils/embellissements.js'
export const titre = 'Effectuer des liens entre angles et parallélisme'
export const dateDeModifImportante = '18/08/2023'

function aleaName (names = [], n = names.length, result = []) {
  const r = Math.floor(Math.random() * names.length)
  result.push(names[r])
  names.splice(r, 1)
  if (result.length === n) {
    return result
  } else {
    return aleaName(names, n, result)
  }
}

export const dateDePublication = '15/01/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

function anglesSecantes (A, rot = { O: 60, A: 0 }) {
  const s = rotation(translation(A, vecteur(1, 0)), A, rot.A)
  const S = rotation(translation(A, vecteur(3, 0)), A, rot.A)
  const t = rotation(s, A, 180)
  const T = rotation(S, A, 180)
  const x = rotation(translation(A, vecteur(1, 0)), A, rot.O)
  const X = rotation(translation(A, vecteur(3, 0)), A, rot.O)
  const Ox = rotation(x, A, 180)
  const OX = rotation(X, A, 180)
  return {
    a: arcPointPointAngle(s, x, rot.O - rot.A, true, 'blue'),
    b: arcPointPointAngle(x, t, 180 - (rot.O - rot.A), true, 'green'),
    c: arcPointPointAngle(t, Ox, rot.O - rot.A, true, 'red'),
    d: arcPointPointAngle(Ox, s, 180 - (rot.O - rot.A), true, 'gray'),
    s,
    S,
    t,
    T,
    x,
    X,
    Ox,
    OX,
    As: droite(A, s),
    Ax: droite(A, x),
    A,
    labela: texteSurArc((rot.O - rot.A) % 180 + '°', s, x, rot.O - rot.A, 'black', 0.7, true),
    labelb: texteSurArc((180 - (rot.O - rot.A)) % 180 + '°', x, t, 180 - (rot.O - rot.A), 'black', 0.7, true),
    labelc: texteSurArc((rot.O - rot.A) % 180 + '°', t, Ox, rot.O - rot.A, 'black', 0.7, true),
    labeld: texteSurArc((180 - (rot.O - rot.A)) % 180 + '°', Ox, s, 180 - (rot.O - rot.A), 'black', 0.7, true)
  }
}
/**
 * Effectuer des liens entre angles et parallélisme
 * @author Frédéric PIOU
*/
export const uuid = '19812'
export const ref = '5G30-2'
export default function ExercicesAnglesAIC () {
  Exercice.call(this)
  const formulaire = [
    '1 : Angles marqués alternes-internes ou correspondants ?',
    '2 : Déterminer si des droites sont parallèles (angles marqués).',
    '3 : Déterminer si des droites sont parallèles (angles nommés).',
    '4 : Calculer la mesure d\'un angle (angles marqués).',
    '5 : Calculer la mesure d\'un angle (angles nommés).',
    '6 : Nommer un angle alterne-interne ou correspondant à un angle marqué.',
    '7 : Nommer un angle alterne-interne ou correspondant à un angle nommé.',
    '8 : Mélange'
  ]

  this.nbQuestions = 1
  this.besoinFormulaireTexte = ['Type de questions', 'Nombres séparés par des tirets\n' + formulaire.join('\n')]

  this.consigne = ''
  this.nbCols = 0
  this.nbColsCorr = 0
  this.tailleDiaporama = 1
  this.video = ''
  this.correctionDetailleeDisponible = false
  this.correctionDetaillee = true
  context.isHtml ? (this.spacing = 1.75) : (this.spacing = 0)
  context.isHtml ? (this.spacingCorr = 1.75) : (this.spacingCorr = 0)
  this.sup = 8 // Type d'exercice
  this.nbQuestions = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = [] // À placer même si l'exercice n'a pas vocation à être corrigé
    const nquestion = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 7,
      defaut: 8,
      melange: 8,
      nbQuestions: this.nbQuestions,
      shuffle: true
    })

    for (let i = 0, exercice, cpt = 0; i < this.nbQuestions && cpt < 100;) { // Boucle principale où i+1 correspond au numéro de la question
      switch (nquestion[i]) { // Chaque question peut être d'un type différent, ici 4 cas sont prévus...
        case 1: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'randomInt(-90,90)',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: 'O-A>30 and O-B>30'
            }
          )
          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.7
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].opaciteDeRemplissage = 0.7
          }
          const ab = choice([
            choice(['aa', 'bb', 'cc', 'dd']),
            choice(['ca', 'db']),
            choice(['a', 'b', 'c', 'd']) + choice(['a', 'b', 'c', 'd'])
          ])
          const a = ab[0]
          const b = ab[1]
          objetsEnonce.push(
            anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB[b],
            anglesB.As,
            anglesB.Ax,
            anglesA['label' + a],
            anglesB['label' + b]
          )
          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ])
          // On copie tout le contenu de objetsEnonce dans objetsCorrection
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          // ici sont créés les texte, tex_corr, objets mathalea2d divers entrant dans le contenu de l'exercice
          let texte = 'Les angles marqués sont-ils alternes-internes, correspondants ou ni l\'un, ni l\'autre ?<br>'
          let reponse
          if (a === b) {
            reponse = `sont ${texteEnCouleurEtGras('correspondants')}`
          } else if (a + b === 'ca' || a + b === 'db') {
            reponse = `sont ${texteEnCouleurEtGras('alternes-internes')}`
          } else {
            reponse = `ne sont ${texteEnCouleurEtGras('ni alternes-internes')}, ${texteEnCouleurEtGras('ni correspondants')}`
          }
          const texteCorr = `Par définition, les angles marqués ${reponse}.`
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
        case 2: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'A',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: '70>O-A>30 and 70>O-B>30 and abs(A-B)<45'
            }
          )
          const ab = aleaVariables(
            {
              a: 'randomInt(0,3)',
              b: 'randomInt(0,3)',
              test: 'a!=b and (a!=2 or b!=0) and (a!=3 or b!=1)'
            }
          )

          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.7
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].opaciteDeRemplissage = 0.7
          }
          anglesA.As.color = colorToLatexOrHTML('red')
          anglesB.As.color = colorToLatexOrHTML('red')
          const a = ['a', 'b', 'c', 'd'][parseInt(ab.a)]
          const b = ['a', 'b', 'c', 'd'][parseInt(ab.b)]
          const epsilon = choice([pickRandom([-2, -1, 1, 2]), 0])
          anglesA.labela = texteSurArc(((param.O - param.A) % 180 + epsilon) + '°', anglesA.s, anglesA.x, param.O - param.A, 'black', 0.7, true)
          anglesA.labelb = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.x, anglesA.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesA.labelc = texteSurArc((param.O - param.A + epsilon) % 180 + '°', anglesA.t, anglesA.Ox, param.O - param.A, 'black', 0.7, true)
          anglesA.labeld = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.Ox, anglesA.s, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labela = texteSurArc(((param.O - param.A) % 180) + '°', anglesB.s, anglesB.x, param.O - param.A, 'black', 0.7, true)
          anglesB.labelb = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.x, anglesB.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labelc = texteSurArc((param.O - param.A) % 180 + '°', anglesB.t, anglesB.Ox, param.O - param.A, 'black', 0.7, true)
          anglesB.labeld = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.Ox, anglesB.s, 180 - (param.O - param.A), 'black', 0.7, true)
          objetsEnonce.push(
            anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB[b],
            anglesB.As,
            anglesB.Ax,
            anglesA['label' + a],
            anglesB['label' + b]
          )
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          let angles, calculs
          anglesA[a].couleurDeRemplissage = colorToLatexOrHTML('red')
          anglesA.labela.color = 'red'
          anglesA.labelb.color = 'red'
          anglesA.labelc.color = 'red'
          anglesA.labeld.color = 'red'
          anglesB.labela.color = 'blue'
          anglesB.labelb.color = 'blue'
          anglesB.labelc.color = 'blue'
          anglesB.labeld.color = 'blue'

          switch (a + b) {
            case 'ab':
            case 'ad':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              break
            case 'ac':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              break
            case 'ba':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              break
            case 'bc':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelc.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              break
            case 'bd':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              break
            case 'cb':
            case 'cd':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              break
            case 'da':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              break
            case 'dc':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              calculs = `$180°-${miseEnEvidence(anglesB.labelc.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              angles = 'alternes-internes'
              break
          }
          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ])
          let texte = 'Les droites rouges sont-elles parallèles ?<br>'
          let sont, coord
          if (epsilon !== 0) {
            coord = 'mais pas'
            sont = 'ne sont pas'
          } else {
            coord = 'et'
            sont = 'sont'
          }
          const texteCorr = mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsCorrection) + String.raw`
          <br>
          ${calculs !== undefined ? calculs : 'Les angles bleu et vert sont opposés par le sommet. <br> Donc ils sont de même mesure.'}
          <br>
          Les angles rouge et vert sont ${angles} ${texteGras(coord + ' de même mesure')}.
          <br>
          Donc les droites rouges ${texteEnCouleurEtGras(sont + ' parallèles')}.
          `
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
        case 4: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'A',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: '70>O-A>30 and 70>O-B>30 and abs(A-B)<45'
            }
          )
          const ab = aleaVariables(
            {
              a: 'randomInt(0,3)',
              b: 'randomInt(0,3)',
              test: 'a!=b and (a!=2 or b!=0) and (a!=3 or b!=1)'
            }
          )
          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.7
            anglesB[i].opaciteDeRemplissage = 0.7
          }
          const a = ['a', 'b', 'c', 'd'][parseInt(ab.a)]
          const b = ['a', 'b', 'c', 'd'][parseInt(ab.b)]
          anglesA.As.color = colorToLatexOrHTML('red')
          anglesB.As.color = colorToLatexOrHTML('red')
          const epsilon = 0
          anglesA.labela = texteSurArc(((param.O - param.A) % 180 + epsilon) + '°', anglesA.s, anglesA.x, param.O - param.A, 'black', 0.7, true)
          anglesA.labelb = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.x, anglesA.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesA.labelc = texteSurArc((param.O - param.A + epsilon) % 180 + '°', anglesA.t, anglesA.Ox, param.O - param.A, 'black', 0.7, true)
          anglesA.labeld = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.Ox, anglesA.s, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labela = texteSurArc(((param.O - param.A) % 180) + '°', anglesB.s, anglesB.x, param.O - param.A, 'black', 0.7, true)
          anglesB.labelb = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.x, anglesB.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labelc = texteSurArc((param.O - param.A) % 180 + '°', anglesB.t, anglesB.Ox, param.O - param.A, 'black', 0.7, true)
          anglesB.labeld = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.Ox, anglesB.s, 180 - (param.O - param.A), 'black', 0.7, true)
          objetsEnonce.push(
            anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB[b],
            anglesB.As,
            anglesB.Ax,
            anglesA['label' + a]
          )
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          objetsCorrection.push(anglesB['label' + b])
          let angles, calculs, mesure
          anglesA[a].couleurDeRemplissage = colorToLatexOrHTML('red')
          anglesA.labela.color = 'red'
          anglesA.labelb.color = 'red'
          anglesA.labelc.color = 'red'
          anglesA.labeld.color = 'red'
          anglesB.labela.color = 'blue'
          anglesB.labelb.color = 'blue'
          anglesB.labelc.color = 'blue'
          anglesB.labeld.color = 'blue'

          switch (a + b) {
            case 'ab':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              mesure = anglesB.labelb.texte
              break
            case 'ac':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              mesure = anglesB.labela.texte
              break
            case 'ad':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              mesure = anglesB.labeld.texte
              break
            case 'ba':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              mesure = anglesB.labela.texte
              break
            case 'bc':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labelc.texte, 'green')}$`
              mesure = anglesB.labelc.texte
              break
            case 'bd':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              mesure = anglesB.labelb.texte
              break
            case 'cb':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              mesure = anglesB.labelb.texte
              break
            case 'cd':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labeld.texte, 'green')}$`
              mesure = anglesB.labeld.texte
              break
            case 'da':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              mesure = anglesB.labela.texte
              break
            case 'dc':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labelc.texte, 'green')}$`
              angles = 'alternes-internes'
              mesure = anglesB.labelc.texte
              break
          }
          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ])
          let texte = 'Sachant que les droites rouges sont parallèles, en déduire la mesure de l\'angle bleu. Justifier.<br>'
          const texteCorr = mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsCorrection) + String.raw`
          <br>
          Les angles rouge et vert sont ${texteGras(angles)} et formés par des droites ${texteGras('parallèles')}.
          <br>
          Donc ils sont ${texteGras('de même mesure')}.
          <br>De plus,
          ${calculs !== undefined ? calculs : ' les angles bleu et vert sont opposés par le sommet.<br> Donc ils sont de même mesure.'}
          <br>
          L'angle bleu mesure donc $${miseEnEvidence(mesure)}$.
          `
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
        case 6: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'randomInt(-90,90)',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: '40<O-A<140 and 40<O-B<140 and abs(B-A)<20'
            }
          )
          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          const nomsPoints = aleaName(['A', 'B', 'C', 'D', 'E', 'F'], 2)
          anglesA.A.nom = nomsPoints[0]
          anglesB.A.nom = nomsPoints[1]
          const nomsDirections = aleaName(['s', 't', 'u', 'v', 'x', 'y'], 6)
          anglesA.S.nom = nomsDirections[0]
          anglesA.T.nom = nomsDirections[1]
          anglesA.X.nom = nomsDirections[2]
          anglesA.OX.nom = anglesB.A.nom
          anglesB.S.nom = nomsDirections[3]
          anglesB.T.nom = nomsDirections[4]
          anglesB.OX.nom = nomsDirections[5]
          anglesB.X.nom = anglesA.A.nom
          const nameAngles = ['S A X'.split(' '), 'X A T'.split(' '), 'T A OX'.split(' '), 'OX A S'.split(' ')]
          nameAngles.forEach(function (n, i) {
            anglesA[['a', 'b', 'c', 'd'][i]].nom = ''
            anglesB[['a', 'b', 'c', 'd'][i]].nom = ''
            for (let j = 0; j < 3; j++) {
              anglesA[['a', 'b', 'c', 'd'][i]].nom += anglesA[n[j]].nom
              anglesB[['a', 'b', 'c', 'd'][i]].nom += anglesB[n[j]].nom
            }
          })
          if (Math.abs(param.A) > 70) {
            anglesA.S.positionLabel = 'left'
            anglesA.T.positionLabel = 'left'
          }
          if (Math.abs(param.B) > 70) {
            anglesB.S.positionLabel = 'left'
            anglesB.T.positionLabel = 'left'
          }
          if (Math.abs(param.O) > 70) {
            anglesA.X.positionLabel = 'left'
            anglesB.OX.positionLabel = 'left'
          }
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.4
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].opaciteDeRemplissage = 0.4
          }
          const ab = choice([
            choice(['aa', 'bb', 'cc', 'dd']),
            choice(['ca', 'db'])
          ])
          const a = ab[0]
          const b = ab[1]
          objetsEnonce.push(
            anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB.As,
            anglesB.Ax,
            labelPoint('$' + anglesA.S + '$'),
            labelPoint('$' + anglesA.T + '$'),
            labelPoint('$' + anglesA.X + '$'),
            labelPoint('$' + anglesB.S + '$'),
            labelPoint('$' + anglesB.T + '$'),
            labelPoint('$' + anglesB.OX + '$'),
            labelPoint('$' + anglesA.A + '$'),
            labelPoint('$' + anglesB.A + '$')
          )
          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ], { rzoom: 1.5 })
          // On copie tout le contenu de objetsEnonce dans objetsCorrection
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          anglesB[b].couleurDeRemplissage = colorToLatexOrHTML('#f15929')
          objetsCorrection.push(anglesB[b])
          // ici sont créés les texte, tex_corr, objets mathalea2d divers entrant dans le contenu de l'exercice
          let reponse
          if (a === b) {
            reponse = 'correspondant'
          } else if (a + b === 'ca' || a + b === 'db') {
            reponse = 'alterne-interne'
          }
          let texte = String.raw`Quel est l'angle ${reponse} à l'angle marqué bleu ?<br>`
          let texteCorr = mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsCorrection)
          texteCorr += String.raw`L'angle ${reponse} à l'angle marqué $${miseEnEvidence('\\widehat{' + anglesA[a].nom + '}', 'blue')}$ est $${miseEnEvidence('\\widehat{' + anglesB[b].nom + '}')}$.`
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
        case 7: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'randomInt(-90,90)',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: '40<O-A<140 and 40<O-B<140 and abs(B-A)<20'
            }
          )
          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          const nomsPoints = aleaName(['A', 'B', 'C', 'D', 'E', 'F'], 2)
          anglesA.A.nom = nomsPoints[0]
          anglesB.A.nom = nomsPoints[1]
          const nomsDirections = aleaName(['s', 't', 'u', 'v', 'x', 'y'], 6)
          anglesA.S.nom = nomsDirections[0]
          anglesA.T.nom = nomsDirections[1]
          anglesA.X.nom = nomsDirections[2]
          anglesA.OX.nom = anglesB.A.nom
          anglesB.S.nom = nomsDirections[3]
          anglesB.T.nom = nomsDirections[4]
          anglesB.OX.nom = nomsDirections[5]
          anglesB.X.nom = anglesA.A.nom
          const nameAngles = ['S A X'.split(' '), 'X A T'.split(' '), 'T A OX'.split(' '), 'OX A S'.split(' ')]
          nameAngles.forEach(function (n, i) {
            anglesA[['a', 'b', 'c', 'd'][i]].nom = ''
            anglesB[['a', 'b', 'c', 'd'][i]].nom = ''
            for (let j = 0; j < 3; j++) {
              anglesA[['a', 'b', 'c', 'd'][i]].nom += anglesA[n[j]].nom
              anglesB[['a', 'b', 'c', 'd'][i]].nom += anglesB[n[j]].nom
            }
          })
          if (Math.abs(param.A) > 70) {
            anglesA.S.positionLabel = 'left'
            anglesA.T.positionLabel = 'left'
          }
          if (Math.abs(param.B) > 70) {
            anglesB.S.positionLabel = 'left'
            anglesB.T.positionLabel = 'left'
          }
          if (Math.abs(param.O) > 70) {
            anglesA.X.positionLabel = 'left'
            anglesB.OX.positionLabel = 'left'
          }
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.7
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].opaciteDeRemplissage = 0.7
          }
          const ab = choice([
            choice(['aa', 'bb', 'cc', 'dd']),
            choice(['ca', 'db'])
          ])
          const a = ab[0]
          const b = ab[1]
          objetsEnonce.push(
            // anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB.As,
            anglesB.Ax,
            labelPoint(anglesA.S),
            labelPoint(anglesA.T),
            labelPoint(anglesA.X),
            labelPoint(anglesB.S),
            labelPoint(anglesB.T),
            labelPoint(anglesB.OX),
            labelPoint(anglesA.A),
            labelPoint(anglesB.A)
          )
          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ], { rzoom: 1.5 })
          // On copie tout le contenu de objetsEnonce dans objetsCorrection
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })

          anglesB[b].couleurDeRemplissage = colorToLatexOrHTML('#f15929')
          objetsCorrection.push(anglesB[b])
          objetsCorrection.push(anglesA[a])

          // ici sont créés les texte, tex_corr, objets mathalea2d divers entrant dans le contenu de l'exercice
          let reponse
          if (a === b) {
            reponse = 'correspondant'
          } else if (a + b === 'ca' || a + b === 'db') {
            reponse = 'alterne-interne'
          }
          let texte = String.raw`Quel est l'angle ${reponse} à $\widehat{${anglesA[a].nom}}$ ?<br>`
          let texteCorr = mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsCorrection)
          texteCorr += String.raw`L'angle ${reponse} à l'angle $${miseEnEvidence('\\widehat{' + anglesA[a].nom + '}', 'blue')}$ est $${miseEnEvidence('\\widehat{' + anglesB[b].nom + '}')}$.`
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
        case 3: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'A',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: '70>O-A>30 and 70>O-B>30 and abs(A-B)<45'
            }
          )
          const ab = aleaVariables(
            {
              a: 'randomInt(0,3)',
              b: 'randomInt(0,3)',
              test: 'a!=b and (a!=2 or b!=0) and (a!=3 or b!=1)'
            }
          )
          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          const nomsPoints = aleaName(['A', 'B', 'C', 'D', 'E', 'F'], 2)
          anglesA.A.nom = nomsPoints[0]
          anglesB.A.nom = nomsPoints[1]
          const nomsDirections = aleaName(['s', 't', 'u', 'v', 'x', 'y'], 6)
          anglesA.S.nom = nomsDirections[0]
          anglesA.T.nom = nomsDirections[1]
          anglesA.X.nom = nomsDirections[2]
          anglesA.OX.nom = anglesB.A.nom
          anglesB.S.nom = nomsDirections[3]
          anglesB.T.nom = nomsDirections[4]
          anglesB.OX.nom = nomsDirections[5]
          anglesB.X.nom = anglesA.A.nom
          const nameAngles = ['S A X'.split(' '), 'X A T'.split(' '), 'T A OX'.split(' '), 'OX A S'.split(' ')]
          nameAngles.forEach(function (n, i) {
            anglesA[['a', 'b', 'c', 'd'][i]].nom = ''
            anglesB[['a', 'b', 'c', 'd'][i]].nom = ''
            for (let j = 0; j < 3; j++) {
              anglesA[['a', 'b', 'c', 'd'][i]].nom += anglesA[n[j]].nom
              anglesB[['a', 'b', 'c', 'd'][i]].nom += anglesB[n[j]].nom
            }
          })
          if (Math.abs(param.A) > 70) {
            anglesA.S.positionLabel = 'left'
            anglesA.T.positionLabel = 'left'
          }
          if (Math.abs(param.B) > 70) {
            anglesB.S.positionLabel = 'left'
            anglesB.T.positionLabel = 'left'
          }
          if (Math.abs(param.O) > 70) {
            anglesA.X.positionLabel = 'left'
            anglesB.OX.positionLabel = 'left'
          }
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.4
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].opaciteDeRemplissage = 0.4
          }
          const a = ['a', 'b', 'c', 'd'][parseInt(ab.a)]
          const b = ['a', 'b', 'c', 'd'][parseInt(ab.b)]
          const epsilon = choice([pickRandom([-2, -1, 1, 2]), 0])
          anglesA.labela = texteSurArc(((param.O - param.A) % 180 + epsilon) + '°', anglesA.s, anglesA.x, param.O - param.A, 'black', 0.7, true)
          anglesA.labelb = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.x, anglesA.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesA.labelc = texteSurArc((param.O - param.A + epsilon) % 180 + '°', anglesA.t, anglesA.Ox, param.O - param.A, 'black', 0.7, true)
          anglesA.labeld = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.Ox, anglesA.s, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labela = texteSurArc(((param.O - param.A) % 180) + '°', anglesB.s, anglesB.x, param.O - param.A, 'black', 0.7, true)
          anglesB.labelb = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.x, anglesB.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labelc = texteSurArc((param.O - param.A) % 180 + '°', anglesB.t, anglesB.Ox, param.O - param.A, 'black', 0.7, true)
          anglesB.labeld = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.Ox, anglesB.s, 180 - (param.O - param.A), 'black', 0.7, true)
          objetsEnonce.push(
            anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB[b],
            anglesB.As,
            anglesB.Ax,
            anglesA['label' + a],
            anglesB['label' + b],
            labelPoint(anglesA.S),
            labelPoint(anglesA.T),
            labelPoint(anglesA.X),
            labelPoint(anglesB.S),
            labelPoint(anglesB.T),
            labelPoint(anglesB.OX),
            labelPoint(anglesA.A),
            labelPoint(anglesB.A)
          )
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          let angles, calculs
          anglesA[a].couleurDeRemplissage = colorToLatexOrHTML('red')
          anglesA.labela.color = 'red'
          anglesA.labelb.color = 'red'
          anglesA.labelc.color = 'red'
          anglesA.labeld.color = 'red'
          anglesB.labela.color = 'blue'
          anglesB.labelb.color = 'blue'
          anglesB.labelc.color = 'blue'
          anglesB.labeld.color = 'blue'
          switch (a + b) {
            case 'ab':
            case 'ad':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              break
            case 'ac':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              break
            case 'ba':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              break
            case 'bc':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelc.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              break
            case 'bd':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              break
            case 'cb':
            case 'cd':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              break
            case 'da':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              break
            case 'dc':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              calculs = `$180°-${miseEnEvidence(anglesB.labelc.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              angles = 'alternes-internes'
              break
          }

          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ])
          let texte = `Les droites $(${anglesA.S.nom}${anglesA.T.nom})$ et $(${anglesB.S.nom}${anglesB.T.nom})$ sont-elles parallèles ?<br>`
          let sont, coord
          if (epsilon !== 0) {
            coord = 'mais pas'
            sont = 'ne sont pas'
          } else {
            coord = 'et'
            sont = 'sont'
          }
          const nomAngleSolution = angles !== 'alternes-internes' ? anglesB[a].nom : a === 'c' ? anglesB.a.nom : anglesB.b.nom
          const texteCorr = mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsCorrection) + String.raw`
          <br>
          ${calculs !== undefined ? calculs : String.raw`Les angles $\widehat{${anglesB[a].nom}}$ et $\widehat{${anglesB[b].nom}}$ sont opposés par le sommet. <br> Donc ils sont de même mesure.`}
          <br>
          Donc les angles $${miseEnEvidence('\\widehat{' + anglesA[a].nom + '}', 'red')}$ et $${miseEnEvidence('\\widehat{' + nomAngleSolution + '}', 'green')}$ sont ${angles} ${texteGras(coord + ' de même mesure')}.
          <br>
          Donc les droites $(${anglesA.S.nom}${anglesA.T.nom})$ et $(${anglesB.S.nom}${anglesB.T.nom})$ ${texteEnCouleurEtGras(sont + ' parallèles')}.
          `
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
        case 5: {
          const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
          const objetsCorrection = [] // Idem pour la correction
          const param = aleaVariables(
            {
              O: 'randomInt(0,90)',
              A: 'randomInt(-90,90)',
              B: 'A',
              r1: 'pickRandom([1.5,2])',
              r2: 'pickRandom([1.5,2])',
              test: '70>O-A>30 and 70>O-B>30 and abs(A-B)<45'
            }
          )
          const ab = aleaVariables(
            {
              a: 'randomInt(0,3)',
              b: 'randomInt(0,3)',
              test: 'a!=b and (a!=2 or b!=0) and (a!=3 or b!=1)'
            }
          )
          const O = point(0, 0)
          const anglesA = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O), O, param.r1), { O: param.O, A: param.A })
          const anglesB = anglesSecantes(homothetie(rotation(point(1, 0), O, param.O + 180), O, param.r2), { O: param.O, A: param.B })
          const nomsPoints = aleaName(['A', 'B', 'C', 'D', 'E', 'F'], 2)
          anglesA.A.nom = nomsPoints[0]
          anglesB.A.nom = nomsPoints[1]
          const nomsDirections = aleaName(['s', 't', 'u', 'v', 'x', 'y'], 6)
          anglesA.S.nom = nomsDirections[0]
          anglesA.T.nom = nomsDirections[1]
          anglesA.X.nom = nomsDirections[2]
          anglesA.OX.nom = anglesB.A.nom
          anglesB.S.nom = nomsDirections[3]
          anglesB.T.nom = nomsDirections[4]
          anglesB.OX.nom = nomsDirections[5]
          anglesB.X.nom = anglesA.A.nom
          const nameAngles = ['S A X'.split(' '), 'X A T'.split(' '), 'T A OX'.split(' '), 'OX A S'.split(' ')]
          nameAngles.forEach(function (n, i) {
            anglesA[['a', 'b', 'c', 'd'][i]].nom = ''
            anglesB[['a', 'b', 'c', 'd'][i]].nom = ''
            for (let j = 0; j < 3; j++) {
              anglesA[['a', 'b', 'c', 'd'][i]].nom += anglesA[n[j]].nom
              anglesB[['a', 'b', 'c', 'd'][i]].nom += anglesB[n[j]].nom
            }
          })
          if (Math.abs(param.A) > 70) {
            anglesA.S.positionLabel = 'left'
            anglesA.T.positionLabel = 'left'
          }
          if (Math.abs(param.B) > 70) {
            anglesB.S.positionLabel = 'left'
            anglesB.T.positionLabel = 'left'
          }
          if (Math.abs(param.O) > 70) {
            anglesA.X.positionLabel = 'left'
            anglesB.OX.positionLabel = 'left'
          }
          for (const i of ['a', 'b', 'c', 'd']) {
            anglesA[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesA[i].opaciteDeRemplissage = 0.4
            anglesB[i].couleurDeRemplissage = colorToLatexOrHTML('blue')
            anglesB[i].opaciteDeRemplissage = 0.4
          }
          const a = ['a', 'b', 'c', 'd'][parseInt(ab.a)]
          const b = ['a', 'b', 'c', 'd'][parseInt(ab.b)]
          const epsilon = 0
          anglesA.labela = texteSurArc(((param.O - param.A) % 180 + epsilon) + '°', anglesA.s, anglesA.x, param.O - param.A, 'black', 0.7, true)
          anglesA.labelb = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.x, anglesA.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesA.labelc = texteSurArc((param.O - param.A + epsilon) % 180 + '°', anglesA.t, anglesA.Ox, param.O - param.A, 'black', 0.7, true)
          anglesA.labeld = texteSurArc((180 - (param.O - param.A) + epsilon) % 180 + '°', anglesA.Ox, anglesA.s, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labela = texteSurArc(((param.O - param.A) % 180) + '°', anglesB.s, anglesB.x, param.O - param.A, 'black', 0.7, true)
          anglesB.labelb = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.x, anglesB.t, 180 - (param.O - param.A), 'black', 0.7, true)
          anglesB.labelc = texteSurArc((param.O - param.A) % 180 + '°', anglesB.t, anglesB.Ox, param.O - param.A, 'black', 0.7, true)
          anglesB.labeld = texteSurArc((180 - (param.O - param.A)) % 180 + '°', anglesB.Ox, anglesB.s, 180 - (param.O - param.A), 'black', 0.7, true)
          objetsEnonce.push(
            anglesA[a],
            anglesA.As,
            anglesA.Ax,
            anglesB.As,
            anglesB.Ax,
            anglesA['label' + a],
            labelPoint(anglesA.S),
            labelPoint(anglesA.T),
            labelPoint(anglesA.X),
            labelPoint(anglesB.S),
            labelPoint(anglesB.T),
            labelPoint(anglesB.OX),
            labelPoint(anglesA.A),
            labelPoint(anglesB.A)
            // anglesB['label' + b]
          )
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          objetsCorrection.push(anglesB['label' + b])
          objetsCorrection.push(anglesB[b])
          let angles, calculs, mesure
          anglesA[a].couleurDeRemplissage = colorToLatexOrHTML('red')
          anglesA.labela.color = 'red'
          anglesA.labelb.color = 'red'
          anglesA.labelc.color = 'red'
          anglesA.labeld.color = 'red'
          anglesB.labela.color = 'blue'
          anglesB.labelb.color = 'blue'
          anglesB.labelc.color = 'blue'
          anglesB.labeld.color = 'blue'

          switch (a + b) {
            case 'ab':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              mesure = anglesB.labelb.texte
              break
            case 'ac':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              mesure = anglesB.labela.texte
              break
            case 'ad':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              mesure = anglesB.labeld.texte
              break
            case 'ba':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              mesure = anglesB.labela.texte
              break
            case 'bc':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labelc.texte, 'green')}$`
              mesure = anglesB.labelc.texte
              break
            case 'bd':
              anglesB[a].couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'correspondants'
              mesure = anglesB.labelb.texte
              break
            case 'cb':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labelb.texte, 'green')}$`
              mesure = anglesB.labelb.texte
              break
            case 'cd':
              anglesB.a.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'a'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'a'], anglesB.a)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labela.texte, 'blue')} = ${miseEnEvidence(anglesB.labeld.texte, 'green')}$`
              mesure = anglesB.labeld.texte
              break
            case 'da':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              angles = 'alternes-internes'
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labela.texte, 'green')}$`
              mesure = anglesB.labela.texte
              break
            case 'dc':
              anglesB.b.couleurDeRemplissage = colorToLatexOrHTML('green')
              anglesB['label' + 'b'].color = 'green'
              objetsCorrection.push(anglesB['label' + 'b'], anglesB.b)
              calculs = `$180°-${miseEnEvidence(anglesB.labelb.texte, 'blue')} = ${miseEnEvidence(anglesB.labelc.texte, 'green')}$`
              angles = 'alternes-internes'
              mesure = anglesB.labelc.texte
              break
          }
          const paramsEnonce = fixeBordures([
            ...Object.keys(anglesA).map(key => { return anglesA[key] }),
            ...Object.keys(anglesB).map(key => { return anglesB[key] })
          ])
          let texte = String.raw`
          Sachant que les droites $(${anglesA.S.nom}${anglesA.T.nom})$ et $(${anglesB.S.nom}${anglesB.T.nom})$ sont parallèles, en déduire la mesure de l'angle $\widehat{${anglesB[b].nom}}$.<br>
          `
          const nomAngleSolution = angles !== 'alternes-internes' ? anglesB[a].nom : a === 'c' ? anglesB.a.nom : anglesB.b.nom
          const texteCorr = mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsCorrection) + String.raw`
          <br>
          Les angles $${miseEnEvidence('\\widehat{' + anglesA[a].nom + '}', 'red')}$ et $${miseEnEvidence('\\widehat{' + nomAngleSolution + '}', 'green')}$ sont ${texteGras(angles)} et formés par des droites ${texteGras('parallèles')}.
          <br>
          Donc ils sont ${texteGras('de même mesure')}.
          <br>De plus,
          ${calculs !== undefined ? calculs : String.raw` les angles $\widehat{${anglesB[a].nom}}$ et $\widehat{${anglesB[b].nom}}$ et vert sont opposés par le sommet.<br> Donc ils sont de même mesure.`}
          <br>
          Donc l'angle $${miseEnEvidence('\\widehat{' + anglesB[b].nom + '}', 'blue')}$ mesure $${miseEnEvidence(mesure)}$.
          `
          texte += mathalea2d(Object.assign({ scale: 0.7 }, paramsEnonce), objetsEnonce)
          exercice = { texte, texteCorr }
          break
        }
      }
      // Les lignes ci-dessous permettent d'avoir un affichage aux dimensions optimisées
      if (this.questionJamaisPosee(i, exercice.texte)) {
        this.listeQuestions.push(exercice.texte)
        this.listeCorrections.push(exercice.texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
