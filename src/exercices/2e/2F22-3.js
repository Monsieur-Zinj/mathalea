// import { ajouteChampTexte, setReponse } from '../../modules/gestionInteractif.js'
import { repere } from '../../lib/2d/reperes.js'
import { texteParPosition } from '../../lib/2d/textes.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { tableauSignesFonction } from '../../modules/mathFonctions/outilsMaths.js'
// import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { spline } from '../../modules/mathFonctions/Spline.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Déterminer le tableau de signes d\'une fonction graphiquement.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '06/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'a7860' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
export const ref = '2F22-3'// @todo à modifier aussi
// une liste de nœuds pour définir une fonction Spline
const noeuds1 = [{ x: -4, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: -3, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: -2, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: -1, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
    { x: 0, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
    { x: 2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
    { x: 3, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 4, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: 5, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
]
// une autre liste de nœuds...
const noeuds2 = [{ x: -6, y: -2, deriveeGauche: 2, deriveeDroit: 2, isVisible: true },
    { x: -5, y: 0, deriveeGauche: 2, deriveeDroit: 3, isVisible: true },
    { x: -4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: -3, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
    { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
    { x: -1, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 0, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: 1, y: 3, deriveeGauche: 3, deriveeDroit: 3, isVisible: true },
    { x: 2, y: 5, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 3, y: 4, deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
    { x: 4, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 5, y: 4, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: 6, y: 5, deriveeGauche: 0.2, deriveeDroit: 0.2, isVisible: true }
]

const noeuds3 = [{ x: -6, y: -4, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: -2, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: 2, y: 2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 4, y: 0, deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
    { x: 6, y: -3, deriveeGauche: -1, deriveeDroit: -1, isVisible: true }
]

const noeuds4 = [{ x: -6, y: 3, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
    { x: -5, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: -4, y: 2, deriveeGauche: -1.5, deriveeDroit: -1.5, isVisible: true },
    { x: -2, y: 0, deriveeGauche: -1, deriveeDroit: -1.5, isVisible: true },
    { x: 0, y: -3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 1, y: -1, deriveeGauche: 1.5, deriveeDroit: 1.5, isVisible: true },
    { x: 2, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
    { x: 3, y: -3, deriveeGauche: -2, deriveeDroit: -2, isVisible: true }
]

// une liste des listes
const mesFonctions = [noeuds1, noeuds2, noeuds3, noeuds4]//, , noeuds2noeuds1, noeuds2,

let coeffX
let coeffY
let deltaX
let deltaY

/**
 * choisit les caractèristique de la transformation de la courbe
 * @returns {{coeffX: -1|1, deltaX: int, deltaY: int, coeffY: -1|1}}
 */
// function aleatoiriseCourbe () {
//  const coeffX = choice([-1, 1]) // symétries ou pas
// const coeffY = choice([-1, 1])
// const deltaX = randint(-2, +2) // translations
// const deltaY = 0//randint(-2, +2)
// return { coeffX, coeffY, deltaX, deltaY }
// }

function aleatoiriseCourbe(choix) {
    switch (choix) {
        case 1:
            coeffX = choice([-1, 1]) // symétries ou pas
            coeffY = choice([-1, 1])
            deltaX = randint(-2, +2) // translations
            deltaY = 0// randint(-2, +2)
            return { coeffX, coeffY, deltaX, deltaY }
        case 2:
            coeffX = choice([-1, 1]) // symétries ou pas
            coeffY = choice([-1, 1])
            deltaX = randint(-2, +2) // translations
            deltaY = randint(-2, +2)
            return { coeffX, coeffY, deltaX, deltaY }
        case 3:
            coeffX = choice([-1, 1]) // symétries ou pas
            coeffY = choice([-1, 1])
            deltaX = randint(-2, +2) // translations
            deltaY = choice([randint(-2, +2), 0])
            return { coeffX, coeffY, deltaX, deltaY }
    }
}

/**
 * Aléatoirise une courbe et demande les antécédents d'une valeur entière (eux aussi entiers)
 * @author Gilles Mora (Jean-Claude Lhote pour la programmation)
 * Référence (2F22-3)
 */
export default class BetaModeleSpline extends Exercice {
    constructor() {
        super()
        this.titre = titre
        this.sup = 1
        this.nbQuestions = 1 // Nombre de questions par défaut
        this.besoinFormulaireTexte = ['Choix des questions', '1 : Antécédents de zéros entiers\n2 : Antécédents de zéros non entiers possible\n3 : Mélange']
        this.correctionDetailleeDisponible = true // booléen qui indique si une correction détaillée est disponible.
        this.correctionDetaillee = false
    }

    nouvelleVersion() {
        this.listeQuestions = [] // Liste de questions
        this.listeCorrections = [] // Liste de questions corrigées
        this.autoCorrection = []
        const typeDeQuestions = gestionnaireFormulaireTexte({
            saisie: this.sup,
            min: 1,
            max: 3,
            melange: 3,
            defaut: 1,
            nbQuestions: this.nbQuestions
        })
        // const typeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 5, melange: 6, defaut: 4, nbQuestions: this.nbQuestions })
        // boucle de création des différentes questions
        for (let i = 0; i < this.nbQuestions; i++) {
            const { coeffX, coeffY, deltaX, deltaY } = aleatoiriseCourbe(Number(typeDeQuestions[i]))
            // la liste des noeuds de notre fonction
            const nuage = choice(mesFonctions).map((noeud) => Object({
                x: (noeud.x + deltaX) * coeffX,
                y: (noeud.y + deltaY) * coeffY,
                deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
                deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
                isVisible: noeud.isVisible
            }))
            const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
            const maSpline = spline(nuage)
            const { xMin, xMax, yMin, yMax } = maSpline.trouveMaxes()
            const repere1 = repere({
                xMin: xMin - 1,
                xMax: xMax + 1,
                yMin: yMin - 1,
                yMax: yMax + 1,
                grilleX: false,
                grilleY: false,
                grilleSecondaire: true,
                grilleSecondaireYDistance: 1,
                grilleSecondaireXDistance: 1,
                grilleSecondaireYMin: yMin - 1,
                grilleSecondaireYMax: yMax + 1,
                grilleSecondaireXMin: xMin - 1,
                grilleSecondaireXMax: xMax + 1
            })
            const courbe1 = maSpline.courbe({
                repere: repere1,
                epaisseur: 1.5,
                ajouteNoeuds: true,
                optionsNoeuds: { color: 'blue', taille: 2, style: '.', epaisseur: 2 },
                color: 'blue'
            })
            const objetsEnonce = [repere1, courbe1]
            let texteEnonce = 'Voici la courbe représentative d\'une fonction $f$, sur son ensemble de définition.<br>'
            texteEnonce += mathalea2d(Object.assign({ scale: 0.7 }, fixeBordures(objetsEnonce)), objetsEnonce, o)
            texteEnonce += '<br>Dresser le tableau de signes de $f(x)$ sur son ensemble de définition.'
            // const objetsCorrection = [repere1]
            // on ajoute les tracés pour repérer les antécédents et on en profite pour rendre les autres noeuds invisibles

            let texteCorrection
            texteCorrection = `<br>L'ensemble de définition de $f$ est $[${maSpline.x[0]}\\,;\\,${maSpline.x[maSpline.n - 1]}]$.<br>`
            if (this.correctionDetaillee) {
                texteCorrection += `Les images $f(x)$ sont positives lorsque la courbe est au-dessus de l'axe des abscisses et elles sont négatives lorque la courbe est en dessous de l'axe des abscisses.<br><br>
          `
            }
            texteCorrection += `Tableau de signes de $f(x)$ sur $[${maSpline.x[0]}\\,;\\,${maSpline.x[maSpline.n - 1]}]$ :<br>
          `
            // on stocke le tableau de signes dans une variable
            const tableau = tableauSignesFonction(maSpline.fonction, xMin, xMax, { step: 1, tolerance: 0.1 })

            texteCorrection += tableau

            this.listeQuestions.push(texteEnonce)
            this.listeCorrections.push(texteCorrection)
        }
        listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
    }
}
