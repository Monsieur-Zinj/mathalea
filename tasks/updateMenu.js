/**
 * Ce script permet de mettre à jour les fichiers :
 * - src/json/exercices.json
 * - src/json/exercicesNonInteractifs.json
 * - src/json/uuidsToUrl.json
 * - src/json/referentiel2022.json
 *
 * Il permet aussi de générer un uuid pour un nouvel exercice
 * Il faut lancer ce script après avoir créé un nouvel exercice
 * Ce script s'appuie sur emptyRef2022.json qui contient les niveaux et les catégories
 * Les titres des niveaux, thèmes et sous-thèmes sont gérés dans src/levelsThemesList.json
 *
 * ToDo : arrêter l'utilisation de referentielRessources.json
 *
 * Remarque : nouveau fonctionnement au 13 aout 2023 en remplacement de makJson.js
 */

import { readFileSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

async function readInfos (dirPath) {
  const files = await fs.readdir(dirPath)

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.posix.join(dirPath, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        await readInfos(filePath)
      } else if (stat.isFile()) {
        // Si ce n'est pas un fichier .js ou .ts, on ne fait rien
        if (file.match(/\.jsx?|\.ts$/) &&
          !file.startsWith('_') &&
          !filePath.includes('/beta/') &&
          file !== 'Exercice.js' &&
          file !== 'ExerciceTs.ts') {
          const infos = {}
          const data = await fs.readFile(filePath, 'utf8')
          const matchUuid = data.match(/export const uuid = '(.*)'/)
          infos.url = filePath.replace('src/exercices/', '')
          if (matchUuid) {
            if (uuidMap.has(matchUuid[1])) {
              console.error('\x1b[31m%s\x1b[0m', `uuid ${matchUuid[1]} en doublon  dans ${filePath} et ${uuidMap.get(matchUuid[1])}`)
            }
            uuidMap.set(matchUuid[1], filePath.replace('src/exercices/', ''))
            infos.uuid = matchUuid[1]
          } else {
            console.error('\x1b[31m%s\x1b[0m', `uuid non trouvé dans ${filePath}`)
          }
          const matchRef = data.match(/export const ref = '(.*)'/)
          if (matchRef) {
            infos.id = matchRef[1]
          } else {
            if (!filePath.includes('beta') &&
              !filePath.includes('/apps/') &&
              !filePath.includes('/ressources/')
            ) {
              console.error('\x1b[31m%s\x1b[0m', `ref non trouvé dans ${filePath}`)
            }
          }
          const matchTitre = data.match(/export const titre = '(.*)'/) ||
            data.match(/export const titre = "(.*)"/) ||
            data.match(/export let titre = '(.*)'/)
          if (matchTitre) {
            // ToDo : Est-ce qu'il y a d'autres caractères spéciaux à gérer que l'apostrophe ?
            infos.titre = matchTitre[1].replaceAll('\\\'', '\'')
          } else {
            console.error('\x1b[31m%s\x1b[0m', `titre non trouvé dans ${filePath}`)
          }
          infos.tags = {}
          const matchInteractif = data.match(/export const interactifReady = (.*)/)
          if (matchInteractif && matchInteractif[1] === 'true') {
            infos.tags.interactif = true
          } else {
            infos.tags.interactif = false
            exercicesNonInteractifs.push(filePath)
          }
          const matchInteractifType = data.match(/export const interactifType = '(.*)'/)
          if (matchInteractifType) {
            infos.tags.interactifType = matchInteractifType[1]
          }
          const matchAmcType = data.match(/export const amcType = '(.*)'/)
          if (matchAmcType) {
            infos.tags.amcType = matchAmcType[1]
          }
          const matchAmc = data.match(/export const amcReady = (.*)/)
          if (matchAmc && matchAmc[1] === 'true') {
            infos.tags.amc = true
          } else {
            infos.tags.amc = false
          }
          if (infos.id !== undefined) {
            exercicesShuffled[infos.id] = infos
          }
        }
      }
    })
  )
}

/**
 * Crée une Uuid de 5 caractères hexadécimaux (1M de possibilités)
 * @returns {string}
 */
function createUuid () {
  let dt = new Date().getTime()
  const uuid = 'xxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
/**
 * Début du programme principal
 */

const exercicesDir = './src/exercices'
const uuidMap = new Map()
const exercicesNonInteractifs = []
const exercicesShuffled = {}
/**
 * On utilise emptyRef2022 pour initialiser referentiel2022 avec les niveaux et les catégories
 * En cas de création de niveau ou de chapitre, il faudra mettre à jour ce fichier
 */
const emptyRef2022 = readFileSync('tasks/emptyRef2022.json')
const referentiel2022 = JSON.parse(emptyRef2022)

const themesPath = []

function findThemes (obj, path) {
  for (const key in obj) {
    const subObj = obj[key]
    const subPath = path.concat(key)
    if (Object.keys(subObj).length === 0) {
      themesPath.push(subPath.join('.'))
    } else {
      findThemes(subObj, subPath)
    }
  }
}

findThemes(referentiel2022, [])

readInfos(exercicesDir, uuidMap)
  .then(() => {
    const uuidToUrl = Array.from(uuidMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .reduce((obj, [uuid, filePath]) => {
        obj[uuid] = filePath
        return obj
      }, {})
    // Sort exercices by keys
    const exercices = Object.keys(exercicesShuffled).sort().reduce((obj, key) => {
      obj[key] = exercicesShuffled[key]
      return obj
    }, {})
    fs.writeFile('src/json/exercices.json', JSON.stringify(exercices, null, 2))
    fs.writeFile('src/json/exercicesNonInteractifs.json', JSON.stringify(exercicesNonInteractifs, null, 2))
    fs.writeFile('src/json/uuidsToUrl.json', JSON.stringify(uuidToUrl, null, 2))
    for (const themePath of themesPath) {
      const theme = themePath.split('.').pop()
      for (const key in exercices) {
        if (key.startsWith(theme)) {
          const keys = themePath.split('.')
          let currentObj = referentiel2022
          for (let i = 0; i < keys.length; i++) {
            if (i < keys.length - 1) {
              if (currentObj[keys[i]] === undefined) {
                currentObj[keys[i]] = {}
              }
              currentObj = currentObj[keys[i]]
            } else {
              currentObj[keys[i]][key] = exercices[key]
            }
          }
        }
      }
    }
    fs.writeFile('src/json/referentiel2022.json', JSON.stringify(referentiel2022, null, 2).replaceAll('"c3"', '"CM1/CM2"'))
  })
  .then(() => {
    console.log('uuidsToUrl et referentiel2022 ont été mis à jour')
  })
  .catch((err) => {
    console.error(err)
  })

let uuid = createUuid()
while (uuidMap.has(uuid)) {
  uuid = createUuid()
}
console.log('Le nouvel uuid généré est :', uuid)
console.log('Vous pouvez maintenant ajouter la ligne suivante au nouvel exercice :')
console.log(`export const uuid = '${uuid}'`)
