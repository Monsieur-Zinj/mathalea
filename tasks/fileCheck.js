import path from 'path'

const EXCLUDE_FILES_BEGIN_WITH = [
  'beta',
  'moule_a_exo'
]

export function checkTitre (titre, url) {
  if (titre === undefined || titre === '') {
    if (!isFileExcluded(url)) console.log(`${url} n'a pas de titre, il faut l'ajouter.`)
  }
}

export function uuidOk (uuid, url, uuidUrls = undefined) {
  if (uuid === undefined || uuid === '') {
    if (!isFileExcluded(url)) console.log(`${url} n'a pas de uuid, il faut l'ajouter. Faites pnpm getNewUuid pour obtenir un UUID disponible`)
    return false
  } else {
    if (uuidUrls && uuid in uuidUrls) {
      console.log(`\nUUID : ${uuid} en doublon !!!!\n`)
    }
    return true
  }
}

export function refOk (ref, url) {
  if (ref === undefined || ref === '') {
    if (!isFileExcluded(url)) console.log(`${url} n'a pas de ref, il faut l'ajouter`)
    return false
  } else {
    return true
  }
}

export function isFileExcluded (url) {
  const fileName = path.basename(url)
  for (const str of EXCLUDE_FILES_BEGIN_WITH) {
    if (fileName.slice(0, str.length) === str) return true
  }
  return false
}
