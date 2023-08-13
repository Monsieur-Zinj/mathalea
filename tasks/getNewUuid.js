import fs from 'fs/promises'
import path from 'path'

async function readUuids (dirPath, uuidSet) {
  const files = await fs.readdir(dirPath)

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dirPath, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        await readUuids(filePath, uuidSet)
      } else if (stat.isFile()) {
        // Si ce n'est pas un fichier .js ou .ts, on ne fait rien
        if (file.match(/\.jsx?|\.ts$/) &&
          !file.startsWith('_') &&
          !filePath.includes('/beta/') &&
          file !== 'Exercice.js' &&
          file !== 'ExerciceTs.ts') {
          const data = await fs.readFile(filePath, 'utf8')
          const match = data.match(/export const uuid = '(.*)'/)
          if (match) {
            if (uuidMap.has(match[1])) {
              console.error('\x1b[31m%s\x1b[0m', `uuid ${match[1]} en doublon  dans ${filePath} et ${uuidMap.get(match[1])}`)
            }
            uuidMap.set(match[1], filePath.replace('src/exercices/', ''))
          } else {
            console.error('\x1b[31m%s\x1b[0m', `uuid non trouvé dans ${filePath}`)
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

const exercicesDir = './src/exercices'
const uuidMap = new Map()

readUuids(exercicesDir, uuidMap)
  .then(() => {
    const uuidToUrl = Array.from(uuidMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .reduce((obj, [uuid, filePath]) => {
        obj[uuid] = filePath
        return obj
      }, {})
    const json = JSON.stringify(uuidToUrl, null, 2)
    return fs.writeFile('src/json/uuidsToUrl.json', json)
  })
  .then(() => {
    console.log('uuidsToUrl a été mis à jour')
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
