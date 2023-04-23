export function findPropPaths (obj, predicate) { // The function
  const discoveredObjects = [] // For checking for cyclic object
  const path = [] // The current path being searched
  const results = [] // The array of paths that satify the predicate === true
  if (!obj && (typeof obj !== 'object' || Array.isArray(obj))) {
    throw new TypeError('First argument of finPropPath is not the correct type Object')
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('Predicate is not a function')
  }
  (function find (obj) {
    for (const key of Object.keys(obj)) { // use only enumrable own properties.
      if (predicate(key, path, obj) === true) { // Found a path
        path.push(key) // push the key
        results.push(path.join('.')) // Add the found path to results
        path.pop() // remove the key.
      }
      const o = obj[key] // The next object to be searched
      if (o && typeof o === 'object' && !Array.isArray(o)) { // check for null then type object
        if (!discoveredObjects.find(obj => obj === o)) { // check for cyclic link
          path.push(key)
          discoveredObjects.push(o)
          find(o)
          path.pop()
        }
      }
    }
  }(obj))
  return results
}

/**
 * Trouver les exercices en double dans un tableau contenant
 * des tableaux des chemins vers des exercices.
 * ### Exemple d'élément
 *  `['CAN', 'CM1/CM2', 'c3C', 'canc3C05']`
 * ### Principe
 *  le dernier élément étant l'ID de l'exercice
 * on repère les doublons grâce à ce dernier élément
 * @param {Array} array Tableau d'entrées de chemins d'exercices
 * @returns {Array}
 */
export const findDuplicates = (array) => {
  const duplicates = []
  const map = new Map()
  array.forEach((item) => {
    if (map.has(item[item.length - 1])) {
      duplicates.push(item)
    } else {
      map.set(item[item.length - 1], item)
    }
  })
  return duplicates
}
