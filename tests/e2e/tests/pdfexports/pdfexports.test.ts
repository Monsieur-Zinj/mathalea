import { runTest } from '../../helpers/run'
import type { Page } from 'playwright'
import JSZip from 'jszip'
import fs from 'fs/promises'
import uuidToUrl from '../../../../src/json/uuidsToUrl.json'
import { logError as lgE, log as lg, getFileLogger } from '../../helpers/log'

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
    files.set(_filename, await unzippedFiles.files[_filename].async('string'))
  }
  return files
}

async function getLatexFile (page: Page, urlExercice: string) {
  log(urlExercice)
  await page.goto(urlExercice)
  await page.click('input#Style2') // style maquette

  const downloadPromise = page.waitForEvent('download')
  await page.click('button#downloadFullArchive')
  // page.on('download', download => download.path().then(console.log));

  const download = await downloadPromise
  // console.log(download.suggestedFilename())

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
  })
    .then(buffer => {
      fs.writeFile(UPLOAD_FOLDER + '/' + id + '_' + uuid + (resultReq === 'OK' ? '.pdf' : '.log'), new Uint8Array(buffer))
    })
    .catch((err) => {
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

async function testAll (page: Page, filter: string) {
  // const urlExercice = 'http://localhost:5173/alea/?uuid=322a0&id=6C10-0&alea=QrHL&v=latex'

  // Listen for all console logs
  page.on('console', msg => {
    logPDF(msg.text())
  })

  const uuids = await findUuid(filter)
  const resultReqs = []
  for (let i = 70; i < uuids.length && i < 300; i++) {
    log(`uuid=${uuids[i][0]} exo=${uuids[i][1]} i=${i} / ${uuids.length}`)
    const resultReq = await getLatexFile(page, `http://localhost:5173/alea/?uuid=${uuids[i][0]}&id=${uuids[i][1].substring(0, uuids[i][1].lastIndexOf('.')) || uuids[i][1]}&alea=QrHL&v=latex`)
    log(`Resu: ${resultReq} uuid=${uuids[i][0]} exo=${uuids[i][1]}`)
    resultReqs.push(resultReq)
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

/**
 * Attention, il faut un service REST en localhost qui récupère les fichiers
 * pour ensuite les compiler avec lualatex...
 */
runTest(testOneExo, import.meta.url, { pauseOnError: false })
/*runTest(test3e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
runTest(test4e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
runTest(test5e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
runTest(test6e, import.meta.url, { pauseOnError: false, silent: false, debug: false })
*/