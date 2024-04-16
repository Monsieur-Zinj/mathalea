import referentielStatic from '../../../src/json/referentielStatic.json'
import { type JSONReferentielObject } from '../../../src/lib/types/referentiels'
import uuidToUrl from '../../../src/json/uuidsToUrlFR.json'

const allStaticReferentiels: JSONReferentielObject = {
  ...referentielStatic
}

// on supprime les entrées par thèmes qui entraîne des doublons
delete allStaticReferentiels['Brevet des collèges par thèmes - APMEP']
delete allStaticReferentiels['BAC par thèmes - APMEP']
delete allStaticReferentiels['CRPE (2015-2019) par thèmes - COPIRELEM']
delete allStaticReferentiels['CRPE (2022-2023) par thèmes']
delete allStaticReferentiels['E3C par thèmes - APMEP']

export async function findUuid (filter : string) {
  const uuids = Object.entries(uuidToUrl)
  const filters = filter.split('^')
  const uuidsFilter : [string, string][] = []
  filters.forEach(e => {
    uuidsFilter.push(...uuids.filter(function (uuid) {
      return uuid[1].startsWith(e)
    }))
  })
  return uuidsFilter
}

export async function findStatic (filter : string) {
  const uuids = Object.entries(allStaticReferentiels)
  // les clés de allStaticReferentiels sont les thèmes (types)
  // [
  //   "Brevet des collèges par année - APMEP",
  //   "BAC par année - APMEP",
  //   "CRPE (2015-2019) par année - COPIRELEM",
  //   "CRPE (2022-2023) par année",
  //   "E3C par specimen - APMEP",
  // ]
  const uuidsDNB = uuids[0][1] // on conserve uniquement les exercices DNB
  const uuidsFound : [string, string][] = []
  const filters = filter.split('^')
  filters.forEach(e => {
    Object.entries(uuidsDNB).forEach(([, value]) => {
    // les keys sont les années, elles ne nous intéressent pas ici!
      const values = Object.values(value)
      values.forEach((val) => {
        if (val !== null && typeof val === 'object' && 'uuid' in val && typeof val.uuid === 'string' && val.uuid.startsWith(e)) {
          uuidsFound.push([val.uuid, val.uuid])
        }
      })
    })
  })
  return uuidsFound
}
