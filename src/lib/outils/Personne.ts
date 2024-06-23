import { choice, shuffle } from './arrayOutils'

/**
 * Renvoie un prénom féminin au hasard ou une liste de prénoms féminins au hasard
 * @author Rémi Angot
 */
export function prenomF (n = 1) {
  if (n === 1) {
    return choice(['Aude', 'Béatrice', 'Carine', 'Corinne', 'Dalila', 'Elsa', 'Farida', 'Julie', 'Karole', 'Léa', 'Lisa', 'Manon', 'Marina', 'Magalie', 'Nadia', 'Nawel', 'Teresa', 'Vanessa', 'Yasmine'])
  } else {
    return shuffle(['Aude', 'Béatrice', 'Carine', 'Corinne', 'Dalila', 'Elsa', 'Farida', 'Julie', 'Karole', 'Léa', 'Lisa', 'Manon', 'Marina', 'Magalie', 'Nadia', 'Nawel', 'Teresa', 'Vanessa', 'Yasmine']).slice(0, n)
  }
}

/**
 * Renvoie un prénom masculin au hasard ou une liste de prénoms masculins au hasard
 * @author Rémi Angot
 */
export function prenomM (n: number = 1): string | string[] {
  if (n === 1) {
    return choice(['Arthur', 'Benjamin', 'Bernard', 'Christophe', 'Cyril', 'David', 'Fernando', 'Guillaume', 'Jean-Claude', 'Joachim', 'José', 'Kamel', 'Karim', 'Laurent', 'Mehdi', 'Nacim', 'Pablo', 'Rémi', 'Victor', 'Yazid'])
  } else {
    return shuffle(['Arthur', 'Benjamin', 'Bernard', 'Christophe', 'Cyril', 'David', 'Fernando', 'Guillaume', 'Jean-Claude', 'Joachim', 'José', 'Kamel', 'Karim', 'Laurent', 'Mehdi', 'Nacim', 'Pablo', 'Rémi', 'Victor', 'Yazid']).slice(0, n)
  }
}

/**
 * Renvoie un prénom au hasard ou une liste de prénoms
 * @author Rémi Angot
 */
export function prenom (n = 1) {
  if (n === 1) {
    return choice([prenomF(), prenomM()])
  } else {
    return shuffle(['Aude', 'Béatrice', 'Carine', 'Corinne', 'Dalila', 'Elsa', 'Farida', 'Julie', 'Karole', 'Léa', 'Lisa', 'Manon', 'Marina', 'Magalie', 'Nadia', 'Nawel', 'Teresa', 'Vanessa', 'Yasmine', 'Arthur', 'Benjamin', 'Bernard', 'Christophe', 'Cyril', 'David', 'Fernando', 'Guillaume', 'Jean-Claude', 'Joachim', 'José', 'Kamel', 'Karim', 'Laurent', 'Mehdi', 'Nacim', 'Pablo', 'Rémi', 'Victor', 'Yazid']).slice(0, n)
  }
}

/**
 * Définit l'objet personne
 * @author Jean-Claude Lhote
 * le 14/03/2021
 */
export class Personne {
  prenom: string
  genre: string
  pronom: string
  Pronom: string
  constructor ({ prenom = '', genre = '', pronom = '' } = {}) {
    let choix
    this.prenom = ''
    this.genre = ''
    this.pronom = ''
    this.Pronom = ''
    if (prenom === '' || ((typeof prenom) === 'undefined')) { // On le/la baptise
      choix = prenomPronom()
      this.prenom = choix[0]
      this.pronom = choix[1]
    } else if (pronom === '') { // le pronom n'est pas précisé
      this.pronom = 'on'
      this.Pronom = 'On'
    }
    if (genre === '') {
      if (this.pronom === 'il') {
        this.Pronom = 'Il'
        this.genre = 'masculin'
      } else if (this.pronom === 'elle') {
        this.Pronom = 'Elle'
        this.genre = 'féminin'
      } else this.genre = 'neutre'
    }
  }
}

/**
 * crée une instance de la classe Personne
 * @author Jean-Claude Lhote
 * le 14/03/2021
 */
export function personne ({ prenom = '', genre = '', pronom = '' } = {}) {
  return new Personne({ prenom, genre, pronom })
}

/**
 * Crée un tableau de n objet de la classe Personne
 * @author Jean-Claude Lhote
 * le 14/03/2021
 */
export function personnes (n: number) {
  const liste = []
  let essai
  let trouve
  for (let i = 0; i < n;) {
    essai = personne()
    trouve = false
    for (let j = 0; j < liste.length; j++) {
      if (liste[j].prenom === essai.prenom) {
        trouve = true
        break
      }
    }
    if (trouve === false) {
      liste.push(essai)
      i++
    }
  }
  return liste
}

/**
 * Renvoie un couple [prénom,pronom] où pronom='il' ou 'elle'
 *  @author Jean-Claue Lhote
 */
export function prenomPronom (): [string, string] {
  if (choice([true, false])) {
    const prenom = prenomM(1) as string
    return [prenom, 'il']
  } else {
    const prenom = prenomF(1) as string
    return [prenom, 'elle']
  }
}
