import { runSeveralTests, runTest } from '../../helpers/run'
import type { Page } from 'playwright'
import JSZip from 'jszip'
import fs from 'fs/promises'
import referentielStatic from '../../../../src/json/referentielStatic.json'
import { type JSONReferentielObject } from '../../../../src/lib/types/referentiels'
import uuidToUrl from '../../../../src/json/uuidsToUrl.json'
import { logError as lgE, log as lg, getFileLogger } from '../../helpers/log'

const allStaticReferentiels: JSONReferentielObject = {
  ...referentielStatic
}

// on supprime les entrées par thèmes qui entraîne des doublons
delete allStaticReferentiels['Brevet des collèges par thèmes - APMEP']
delete allStaticReferentiels['BAC par thèmes - APMEP']
delete allStaticReferentiels['CRPE (2015-2019) par thèmes - COPIRELEM']
delete allStaticReferentiels['CRPE (2022-2023) par thèmes']
delete allStaticReferentiels['E3C par thèmes - APMEP']

const logPDF = getFileLogger('exportPDF', { append: true })

function log (...args: unknown[]) {
  lg(args)
  logPDF(args)
}

function logError (...args: unknown[]) {
  lgE(args)
  logPDF(args)
}

const UPLOAD_FOLDER = 'updatefile'

// file parameter retrieved from an input type=file
async function readZip (file: fs.FileHandle): Promise<Map<string, string>> {
  const buffer = await fs.readFile(file)
  const files : Map<string, string> = new Map<string, string>()
  const zipper = new JSZip()
  const unzippedFiles = await zipper.loadAsync(buffer)
  const entries = Object.keys(unzippedFiles.files)
  for (const _filename of entries) {
    if (_filename !== 'images/') {
      files.set(_filename.replace('images/', ''), await unzippedFiles.files[_filename].async('string'))
    }
  }
  return files
}

async function getLatexFile (page: Page, urlExercice: string) {
  log(urlExercice)
  page.setDefaultTimeout(100000)

  await page.goto(urlExercice)
  // await page.reload()
  await page.click('input#Style2') // style maquette

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const downloadPromise = page.waitForEvent('download')
  await page.click('button#downloadFullArchive')
  //
  const download = await downloadPromise

  const downloadError = await download.failure()
  if (downloadError !== null) {
    console.log('Error happened on download:', downloadError)
    throw new Error(downloadError)
  }

  console.log(download.suggestedFilename())

  const uuid = (new URL(urlExercice)).searchParams.get('uuid')

  let idPath = (new URL(urlExercice)).searchParams.get('id')
  idPath = idPath?.substring(0, idPath?.lastIndexOf('.')) || idPath
  const id = idPath?.split('/').reverse()[0]
  // console.log(uuid)

  await fs.access(UPLOAD_FOLDER)
    .catch(err => {
      log('Le répertoire n\'existe pas, on le crée', err)
      fs.mkdir(UPLOAD_FOLDER)
    })

  await download.saveAs(UPLOAD_FOLDER + '/' + id + '_' + uuid + '_' + download.suggestedFilename())

  const zip = await fs.open(UPLOAD_FOLDER + '/' + id + '_' + uuid + '_' + download.suggestedFilename())

  const unzipfiles : Map<string, string> = await readZip(zip)

  zip.close()

  const formData = new FormData()
  unzipfiles.forEach((value, key) => {
    // console.log(`m[${key}] = ${value}`);
    formData.append('name', key)
    formData.append('originalname', key)
    formData.append('file', new Blob(new Array(value)), key)
  })

  let resultReq = ''

  await fetch('http://192.168.1.11:3000/generate', {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(60 * 1000)
  }).then((res : Response) => {
    log('response.status =' + res.status)
    if (res.status === 200) {
      resultReq = 'OK'
    } else {
      resultReq = 'KO'
    }
    return res.blob()
  }).then(blob => {
    log(resultReq)
    return blob.arrayBuffer()
  }).then(buffer => {
    fs.writeFile(UPLOAD_FOLDER + '/' + id + '_' + uuid + (resultReq === 'OK' ? '.pdf' : '.log'), new Uint8Array(buffer))
  }).catch((err) => {
    logError('Error occured' + err)
    logError(err.name)
    resultReq = 'KO'
    logError(resultReq)
  })
  return resultReq
}

async function findUuid (filter : string) {
  const uuids = Object.entries(uuidToUrl)
  return uuids.filter(function (uuid) {
    return uuid[1].startsWith(filter)
  })
}

async function findStatic (filter : string) {
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
  Object.entries(uuidsDNB).forEach(([, value]) => {
    // les keys sont les années, elles ne nous intéressent pas ici!
    const values = Object.values(value)
    values.forEach((val) => {
      if (val !== null && typeof val === 'object' && 'uuid' in val && typeof val.uuid === 'string' && val.uuid.startsWith(filter)) {
        uuidsFound.push([val.uuid, val.uuid])
      }
    })
  })
  return uuidsFound
}

async function testAll (page: Page, filter: string) {
  // const urlExercice = 'http://localhost:5173/alea/?uuid=322a0&id=6C10-0&alea=QrHL&v=latex'

  // Listen for all console logs
  page.on('console', msg => {
    logPDF(msg.text())
  })

  const uuids = await findUuid(filter)
  const resultReqs = []
  for (let i = 0; i < uuids.length && i < 300; i++) {
    try {
      log(`uuid=${uuids[i][0]} exo=${uuids[i][1]} i=${i} / ${uuids.length}`)
      const resultReq = await getLatexFile(page, `http://localhost:5173/alea/?uuid=${uuids[i][0]}&id=${uuids[i][1].substring(0, uuids[i][1].lastIndexOf('.')) || uuids[i][1]}&alea=QrHL&v=latex`)
      log(`Resu: ${resultReq} uuid=${uuids[i][0]} exo=${uuids[i][1]}`)
      resultReqs.push(resultReq)
    } catch (err) {
      log(`Resu: KO uuid=${uuids[i][0]} exo=${uuids[i][1]}`)
      log(err)
      resultReqs.push('KO')
    }
  }
  return resultReqs.every(e => e === 'OK')
}

async function test3e (page: Page) {
  return testAll(page, '3e')
}

async function test4e (page: Page) {
  return testAll(page, '4e')
}

async function test5e (page: Page) {
  return testAll(page, '5e')
}

async function test6e (page: Page) {
  return testAll(page, '6e')
}

async function testOneExo (page: Page) {
  // return testAll(page, '6e/6G23')
  return testAll(page, '3e')
}

// const alea = QrHL (1ere passe de test)
const alea = 'e906e'

async function testRunAll (filter: string) {
  // return testAll(page, '6e/6G23')
  const uuids = await findUuid(filter)
  for (let i = 0; i < uuids.length && i < 300; i++) {
    const myName = 'test' + uuids[i][1]
    const f = async function (page: Page) {
      // Listen for all console logs
      page.on('console', msg => {
        logPDF(msg.text())
      })
      log(`uuid=${uuids[i][0]} exo=${uuids[i][1]} i=${i} / ${uuids.length}`)
      const resultReq = await getLatexFile(page, `http://localhost:5173/alea/?uuid=${uuids[i][0]}&id=${uuids[i][1].substring(0, uuids[i][1].lastIndexOf('.')) || uuids[i][1]}&alea=${alea}&v=latex`)
      log(`Resu: ${resultReq} uuid=${uuids[i][0]} exo=${uuids[i][1]}`)
      return resultReq === 'OK'
    }
    Object.defineProperty(f, 'name', { value: myName, writable: false })
    runTest(f, import.meta.url, { pauseOnError: false, silent: false, debug: false })
  }
}

async function testRunAllLots (filter: string) {
  // return testAll(page, '6e/6G23')
  const uuids = filter.includes('dnb') ? await findStatic(filter) : await findUuid(filter)
  for (let i = 0; i < uuids.length && i < 300; i += 10) {
    const ff : ((page: Page) => Promise<boolean>)[] = []
    for (let k = i; k < i + 10 && k < uuids.length; k++) {
      const myName = 'test' + uuids[k][1]
      const f = async function (page: Page) {
        // Listen for all console logs
        page.on('console', msg => {
          logPDF(msg.text())
        })
        const local = true
        const hostname = local ? 'http://localhost:5173/alea/' : 'https://coopmaths.fr/alea/'
        log(`uuid=${uuids[k][0]} exo=${uuids[k][1]} i=${k} / ${uuids.length}`)
        const resultReq = await getLatexFile(page, `${hostname}?uuid=${uuids[k][0]}&id=${uuids[k][1].substring(0, uuids[k][1].lastIndexOf('.')) || uuids[k][1]}&alea=${alea}&v=latex`)
        log(`Resu: ${resultReq} uuid=${uuids[i][0]} exo=${uuids[k][1]}`)
        return resultReq === 'OK'
      }
      Object.defineProperty(f, 'name', { value: myName, writable: false })
      ff.push(f)
    }
    runSeveralTests(ff, import.meta.url, { pauseOnError: false, silent: false, debug: false })
  }
}
/**
 * Attention, il faut un service REST en localhost qui récupère les fichiers
 * pour ensuite les compiler avec lualatex...
 */
// runTest(testOneExo, import.meta.url, { pauseOnError: false })
// runTest(test6e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
// runTest(test5e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
// runTest(test4e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
// runTest(test3e, import.meta.url, { pauseOnError: false, silent: false, debug: false })

// testRunAllLots('can')
// testRunAllLots('3e')
// testRunAllLots('4e')
// testRunAllLots('5e')
// testRunAllLots('6e')
// testRunAllLots('dnb_2021')
// testRunAllLots('dnb_2022')
// testRunAllLots('dnb_2023')
// testRunAllLots('2e')
// testRunAllLots('dnb_2023_06_asie_5') // une image
// testRunAllLots('dnb_2023_06_etrangers_4')
// testRunAllLots('dnb_2023_06_metropole_2')
// testRunAllLots('dnb_2023_06_polynesie_3')
// testRunAllLots('dnb_2023_09_metropole_5')
// testRunAllLots('dnb_2023_09_polynesie_1')
// testRunAllLots('dnb_2023_12_caledonie_2')

// testRunAllLots('dnb_2021_06_etrangers_2')
// testRunAllLots('dnb_2021_06_polynesie_5')
testRunAllLots('dnb_2021_06_metropole_4')
// testRunAllLots('dnb_2021_06_asie_1')
// testRunAllLots('dnb_2021_06_asie_3')
// testRunAllLots('dnb_2021_06_asie_5')
// testRunAllLots('dnb_2021_06_polynesie_1')
// testRunAllLots('dnb_2021_06_polynesie_4')
