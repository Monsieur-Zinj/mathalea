import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements.ts'
import { numAlpha } from '../../lib/outils/outilString.js'
import { prenomM } from '../../lib/outils/Personne'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Operation from '../../modules/operations.js'
import { texNombre } from '../../lib/outils/texNombre'

export const titre = 'Résoudre des problèmes utilisant la division Euclidienne'

// Gestion de la date de publication initiale
export const dateDePublication = '11/12/2023'

/**
 * Résolution de problèmes utilisant la division Euclidienne
 * @author Mickael Guironnet
 * Référence 6C12-2.
 */

export const uuid = '88021'
export const ref = '6C12-2'
export default function QuestionsDivisionsEuclidiennes () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = 'Résoudre les problèmes suivants.'
  this.nbQuestions = 4
  this.sup = 11

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const questionsDisponibles = gestionnaireFormulaireTexte({
      min: 1,
      max: 10,
      defaut: 1,
      nbQuestions: this.nbQuestions,
      melange: 11,
      saisie: this.sup
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let diviseur, quotient, reste, dividende
      switch (questionsDisponibles[i]) {
        case 1 :
          // problème sur les bouquets
          diviseur = choice([7, 8, 9])
          quotient = randint(25, 36)
          reste = randint(2, 6)
          dividende = diviseur * quotient + reste
          texte = `Un paysagiste dispose de ${dividende} fleurs et souhaite réaliser des bouquets avec ${diviseur}. <br> ${numAlpha(0)} Combien de bouquets peut-il confectioner? <br> ${numAlpha(1)} Combien manque-t-il de fleurs pour en réaliser un de plus?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de ${dividende} par ${diviseur}. <br>`
          texteCorr += Operation({ operande1: dividende, operande2: diviseur, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(dividende)}=${diviseur}\\times${texNombre(quotient)}+ ${texNombre(reste)}`)}$`
          texteCorr += `<br>Il peut faire ${quotient} bouquets et il lui restera ${reste} fleurs.`
          texteCorr += `<br><br>${numAlpha(1)} Il reste ${reste} fleurs et il en faut ${diviseur} pour un bouquet.`
          texteCorr += `<br>$${diviseur} - ${reste} = ${diviseur - reste}$`
          texteCorr += `<br> Il manque donc ${diviseur - reste} fleurs pour faire un bouquet de plus.`
          break
        case 2:
          // problème sur les oeufs
          diviseur = choice([6, 12])
          quotient = randint(25, 36)
          reste = randint(2, diviseur - 1)
          dividende = diviseur * quotient + reste
          texte = `Un fermier ramasse ${dividende} oeufs et souhaite les ranger dans des boîtes de ${diviseur}. <br> ${numAlpha(0)} Combien de boîtes remplies faudra-il? <br> ${numAlpha(1)} Combien manque-t-il d'oeufs pour en remplir une de plus?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de ${dividende} par ${diviseur}. <br>`
          texteCorr += Operation({ operande1: dividende, operande2: diviseur, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(dividende)}=${diviseur}\\times${texNombre(quotient)}+ ${texNombre(reste)}`)}$`
          texteCorr += `<br>Il lui faudra ${quotient} boîtes et il restera ${reste} oeufs.`
          texteCorr += `<br><br>${numAlpha(1)} Il lui manquera ${quotient}-${reste} = ${quotient - reste} oeufs pour en remplir une de plus.`
          break
        case 3:
          // problème sur le partage d'un trésor
          diviseur = choice([7, 12], [10])
          quotient = randint(101, 500)
          reste = randint(2, diviseur - 1)
          dividende = diviseur * quotient + reste
          texte = `${diviseur} pirates veulent se partager équitablement le trésor comprenant ${texNombre(dividende)} pièces d'or.<br> ${numAlpha(0)} Combien chaque pirate aura-t-il? <br> ${numAlpha(1)} Combien restera-t-il de pièces ?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de ${dividende} par ${diviseur}. <br>`
          texteCorr += Operation({ operande1: dividende, operande2: diviseur, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(dividende)}=${diviseur}\\times${texNombre(quotient)}+ ${texNombre(reste)}`)}$`
          texteCorr += `<br>Chaque pirate aura ${quotient} pièces.`
          texteCorr += `<br><br>${numAlpha(1)}  Il restera ${reste} pièces d'or.`
          break
        case 4: {
          // problème sur le jour de semaine
          diviseur = 7
          quotient = randint(11, 19)
          reste = randint(2, diviseur - 1)
          dividende = diviseur * quotient + reste
          const table = { 0: 'lundi', 1: 'mardi', 2: 'mercredi', 3: 'jeudi', 4: 'vendredi', 5: 'samedi', 6: 'dimanche' }
          const jour = randint(0, 6)
          texte = `Aujourd'hui, nous sommes ${table[jour]}. Dans ${dividende} jours, quel jour de la semaine serons-nous?`
          texteCorr = `Posons la division euclidienne de ${dividende} par ${diviseur}. <br>`
          texteCorr += Operation({ operande1: dividende, operande2: diviseur, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(dividende)}=${diviseur}\\times${texNombre(quotient)}+ ${texNombre(reste)}`)}$`
          texteCorr += `<br>Il se sera écoulé ${quotient} semaines complètes et ${reste} jours.`
          texteCorr += `<br>Donc nous serons ${table[(jour + reste) % diviseur]}.`
          break
        }
        case 5: {
          // problème sur le séjour au ski
          const prixForfait = randint(35, 39)
          const prixHotel = randint(25, 30)
          const nbJour = randint(5, 12)
          const nbAmis = randint(3, 5)
          const prixHotelTotal = prixHotel * nbJour * nbAmis
          const prixForfaitTotal = prixForfait * nbJour * nbAmis
          diviseur = nbAmis
          dividende = prixHotelTotal + prixForfaitTotal
          texte = `${nbAmis} amis partent ${nbJour} jours au ski. Ils dépensent $${texNombre(prixHotelTotal)}$ € d'hôtels et $${texNombre(prixForfaitTotal)}$ € pour les remontées mécaniques. <br>${numAlpha(0)} Quel est le prix total depensé? <br> ${numAlpha(1)} Quel est le prix dépensé par personne?`
          texteCorr = `Effectuons l'addition de ${prixForfait} et ${prixHotel}. <br>`
          texteCorr += Operation({ operande1: prixHotelTotal, operande2: prixForfaitTotal, type: 'addition' })
          texteCorr += `<br>Ils ont dépensé au total $${texNombre(prixHotelTotal + prixForfaitTotal)}$ €.`
          texteCorr += `<br>${numAlpha(1)} Posons la division euclidienne de $${texNombre(prixHotelTotal + prixForfaitTotal)}$ par $${nbAmis}$. <br>`
          texteCorr += Operation({ operande1: prixHotelTotal + prixForfaitTotal, operande2: nbAmis, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(prixHotelTotal + prixForfaitTotal)}=${nbAmis}\\times${texNombre((prixHotel + prixForfait) * nbJour)}`)}$`
          texteCorr += `<br>Chaque personne a dépensé  $${texNombre((prixHotel + prixForfait) * nbJour)}$ €.`
          break
        }
        case 6: {
          // problème sur le cinéma
          const nbPlacesPetiteSalles = randint(50, 80)
          const nbPetiteSalles = randint(2, 3)
          const nbGrandeSalles = randint(3, 4)
          const nb = randint(3, 4) // nombre de fois plus grand que la petite salle.
          diviseur = nbGrandeSalles * nb + nbPetiteSalles
          dividende = nbPlacesPetiteSalles * nbPetiteSalles + nbGrandeSalles * nb * nbPlacesPetiteSalles
          texte = `Dans un cinéma, il y a ${nbPetiteSalles + nbGrandeSalles} salles dont ${nbGrandeSalles} grandes salles et ${nbPetiteSalles} petites salles. Il y a ${nb} moins fois de places assises dans les petites salles que les grandes salles. Au total, dans ce cinéma, il y a ${texNombre(nbPlacesPetiteSalles * nbPetiteSalles + nbGrandeSalles * nb * nbPlacesPetiteSalles)} places<br>${numAlpha(0)} Quel est le nombre de places dans une petite salle? <br> ${numAlpha(1)} Quel est le nombre de places dans une grande salle?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de $${texNombre(nbPlacesPetiteSalles * nbPetiteSalles + nbGrandeSalles * nb * nbPlacesPetiteSalles)}$ par $${nbGrandeSalles * nb + nbPetiteSalles}$. <br>`
          texteCorr += Operation({ operande1: nbPlacesPetiteSalles * nbPetiteSalles + nbGrandeSalles * nb * nbPlacesPetiteSalles, operande2: nbGrandeSalles * nb + nbPetiteSalles, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(nbPlacesPetiteSalles * nbPetiteSalles + nbGrandeSalles * nb * nbPlacesPetiteSalles)}=${nbGrandeSalles * nb + nbPetiteSalles}\\times${texNombre(nbPlacesPetiteSalles)}`)}$`
          texteCorr += `<br>Il y a ${nbPlacesPetiteSalles} places dans une petite salle.`
          texteCorr += `<br><br>${numAlpha(1)} $${nbPlacesPetiteSalles} \\times ${nb} = ${nbPlacesPetiteSalles * nb}$ places.`
          texteCorr += `<br>Il y a $${nbPlacesPetiteSalles * nb}$ places dans une grande salle.`
          break
        }
        case 7: {
          // problème sur perle d'un colis
          const nbPerlesJaune = randint(4, 9)
          const nbPerlesRouge = randint(4, 9, [nbPerlesJaune])
          const nbColliers = randint(22, 38)
          const plus = choice([false, true]) ? [0, randint(10, 25)] : [randint(10, 25), 0]
          const nbPerlesJauneTotal = nbPerlesJaune * nbColliers + plus[0]
          const nbPerlesRougeTotal = nbPerlesRouge * nbColliers + plus[1]
          const nbColliersRouge = Math.floor(nbPerlesRougeTotal / nbPerlesRouge)
          const nbColliersJaune = Math.floor(nbPerlesJauneTotal / nbPerlesJaune)
          diviseur = nbColliers
          dividende = nbPerlesJauneTotal
          texte = `Un bijoutier fabrique des colliers avec des perles. Il décide de mettre ${nbPerlesJaune} perles jaunes et ${nbPerlesRouge} perles rouges par collier. Il possède ${nbPerlesRougeTotal} perles rouges et ${nbPerlesJauneTotal} perles jaunes. <br>${numAlpha(0)} Combien pourra-t-il fabriquer de colliers? <br> ${numAlpha(1)} Combien lui restera-t-il de perles de chaque couleur?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de $${texNombre(nbPerlesJauneTotal)}$ par $${nbPerlesJaune}$. <br>`
          texteCorr += Operation({ operande1: nbPerlesJauneTotal, operande2: nbPerlesJaune, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(nbPerlesJauneTotal)}=${nbPerlesJaune}\\times${texNombre(nbColliersJaune)}${nbPerlesJauneTotal - nbPerlesJaune * nbColliersJaune === 0 ? '' : `+ ${nbPerlesJauneTotal - nbPerlesJaune * nbColliersJaune}`}`)}$`
          texteCorr += `<br>Il peut faire ${texNombre(nbColliersJaune)} colliers avec les perles jaunes.`
          texteCorr += `<br>Posons la division euclidienne de $${texNombre(nbPerlesRougeTotal)}$ par $${nbPerlesRouge}$. <br>`
          texteCorr += Operation({ operande1: nbPerlesRougeTotal, operande2: nbPerlesRouge, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(nbPerlesRougeTotal)}=${nbPerlesRouge}\\times${texNombre(nbColliersRouge)}${nbPerlesRougeTotal - nbPerlesRouge * nbColliersRouge === 0 ? '' : `+ ${nbPerlesRougeTotal - nbPerlesRouge * nbColliersRouge}`}`)}$`
          texteCorr += `<br>Il peut faire ${texNombre(nbColliersRouge)} colliers avec les perles rouges.`
          texteCorr += `<br>Finalement, il pourra ${texNombre(Math.min(nbColliersRouge, nbColliersJaune))} colliers en prenant en compte les deux couleurs.`
          texteCorr += `<br><br>${numAlpha(1)} Il resta $${nbPerlesJauneTotal} - ${nbPerlesJaune} \\times ${Math.min(nbColliersRouge, nbColliersJaune)}=${nbPerlesJauneTotal - nbPerlesJaune * Math.min(nbColliersRouge, nbColliersJaune)}$  perles jaunes.`
          texteCorr += `<br>Il resta $${nbPerlesRougeTotal} - ${nbPerlesRouge} \\times ${Math.min(nbColliersRouge, nbColliersJaune)}=${nbPerlesRougeTotal - nbPerlesRouge * Math.min(nbColliersRouge, nbColliersJaune)}$  perles rouges.`
          break
        }
        case 8: {
          // problème sur les timbres
          const nbTimbresParPage = randint(8, 15)
          const nbPages = randint(22, 38)
          reste = randint(2, nbTimbresParPage - 1)
          const nbTimbres = nbTimbresParPage * nbPages + reste
          diviseur = nbTimbresParPage
          dividende = nbTimbres
          texte = `Dans sa collection, ${prenomM()} possède ${nbTimbres} timbres et souhaite les ranger dans un album qui peut contenir ${nbTimbresParPage} timbres par page.<br>${numAlpha(0)}  De combien de pages aura-t-il besoin pour ranger tous ses timbres ? <br> ${numAlpha(1)}  Combien de timbres il y aura sur la dernière page ?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de $${texNombre(nbTimbres)}$ par $${nbTimbresParPage}$. <br>`
          texteCorr += Operation({ operande1: nbTimbres, operande2: nbTimbresParPage, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(nbTimbres)}=${nbTimbresParPage}\\times${texNombre(nbPages)}${nbTimbres - nbTimbresParPage * nbPages === 0 ? '' : `+ ${nbTimbres - nbTimbresParPage * nbPages}`}`)}$`
          texteCorr += `<br>Il y aura ${texNombre(nbPages)} pages remplies et une page avec ${reste} timbres. Donc au total, il faudra ${texNombre(nbPages + 1)} pages.`
          texteCorr += `<br><br>${numAlpha(1)} Il y aura ${reste} sur la dernière page.`
          break
        }
        case 9: {
          // problème sur les pirates et le capitaine
          const nbPirates = randint(12, 18)
          const nbPiecesParPirate = randint(5, nbPirates - 5)
          reste = randint(nbPirates - 4, nbPirates - 1)
          diviseur = nbPirates
          dividende = nbPirates * nbPiecesParPirate + reste
          texte = `Une bande de ${nbPirates} pirates et leur capitaine doivent se partager un trésor de ${dividende} pièces d’or. Le capitaine dit à ses hommes : « Vous avez bien travaillé, partagez-vous le trésor, je me contenterai
          du reste. » <br> Le capitaine est-il vraiment généreux ? <br>${numAlpha(0)}  Combien de pièces aura chaque pirate ? <br> ${numAlpha(1)}  Combien aura le capitaine ?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de $${texNombre(dividende)}$ par $${diviseur}$. <br>`
          texteCorr += Operation({ operande1: dividende, operande2: diviseur, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(dividende)}=${diviseur}\\times${texNombre(nbPiecesParPirate)} +  ${reste}`)}$`
          texteCorr += `<br>Chaque pirate aura ${texNombre(nbPiecesParPirate)} pièces et il resta ${reste} pièces pour le capitaine.`
          texteCorr += `<br><br>${numAlpha(1)} Le capitaine aura ${reste} pièces et il aura le plus de pièces.`
          break
        }
        case 10: {
          // problème sur les places assises
          const nbPlaces1ParRangée = choice([8, 9, 12, 15])
          const nbPlaces2ParRangée = choice([8, 9, 12, 15], nbPlaces1ParRangée)
          const nbPersonnes = randint(100, 200)
          const nbRangée1 = Math.floor(nbPersonnes / nbPlaces1ParRangée)
          const nbRangée2 = Math.floor(nbPersonnes / nbPlaces2ParRangée)
          const reste1 = nbPersonnes - nbRangée1 * nbPlaces1ParRangée
          const reste2 = nbPersonnes - nbRangée2 * nbPlaces2ParRangée
          diviseur = nbRangée1
          dividende = nbPersonnes
          texte = `Pour un spectacle, les organisateurs doivent accueillir ${nbPersonnes} personnes. Ils hésitent sur la disposition de la salle : soit mettre ${nbPlaces1ParRangée} places par rangées soit  ${nbPlaces2ParRangée} places par rangées. Ils décident de choisir la configuration où il y aura le moins de places vides.
          <br>${numAlpha(0)}  Combien de places vont-ils choisir par rangées ? <br> ${numAlpha(1)}  Combien de rangées vont-ils prévoir  ?`
          texteCorr = `${numAlpha(0)} Posons la division euclidienne de $${texNombre(nbPersonnes)}$ par $${nbPlaces1ParRangée}$. <br>`
          texteCorr += Operation({ operande1: nbPersonnes, operande2: nbPlaces1ParRangée, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(nbPersonnes)}=${nbPlaces1ParRangée}\\times${texNombre(nbRangée1)} +  ${reste1}`)}$`
          texteCorr += `<br> Avec ${nbPlaces1ParRangée} places par rangées, il y aura ${nbRangée1} rangées remplies et une dernière avec ${reste1} places occupées et ${nbPlaces1ParRangée - reste1} places libres.`
          texteCorr += `<br> Posons la division euclidienne de $${texNombre(nbPersonnes)}$ par $${nbPlaces2ParRangée}$. <br>`
          texteCorr += Operation({ operande1: nbPersonnes, operande2: nbPlaces2ParRangée, type: 'divisionE' }) + `$${miseEnEvidence(`${texNombre(nbPersonnes)}=${nbPlaces2ParRangée}\\times${texNombre(nbRangée2)} +  ${reste2}`)}$`
          texteCorr += `<br> Avec ${nbPlaces2ParRangée} places par rangées, il y aura ${nbRangée2} rangées remplies et une dernière avec ${reste2} places occupées et ${nbPlaces2ParRangée - reste2} places libres.`
          texteCorr += `<br> Ils vont places ${nbPlaces2ParRangée - reste2 < nbPlaces1ParRangée - reste1 ? nbPlaces2ParRangée : nbPlaces1ParRangée} places par rangées.`
          texteCorr += `<br><br>${numAlpha(1)} Il y aura ${nbPlaces2ParRangée - reste2 < nbPlaces1ParRangée - reste1 ? nbRangée2 : nbRangée1} rangées remplies et une rangée avec ${nbPlaces2ParRangée - reste2 < nbPlaces1ParRangée - reste1 ? reste2 : reste1} places occupées, soit ${nbPlaces2ParRangée - reste2 < nbPlaces1ParRangée - reste1 ? nbRangée2 : nbRangée1} rangées au total.`
          break
        }
      }
      if (this.questionJamaisPosee(i, dividende, diviseur)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    } // fin du for

    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 : Bouquets de fleurs\n2 : Boîtes d\'oeufs\n3 : Trésor de pirates\n4 : Jour de semaine\n5 : Séjour au ski\n6 : Places de cinéma\n7 : Collier de perles\n8 : Timbres dans un album\n9 : Pirates et capitaine\n10 : Places assises\n 11 : Mélange']
}
