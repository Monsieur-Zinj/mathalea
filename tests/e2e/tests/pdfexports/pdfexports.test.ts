import { runSeveralTests } from '../../helpers/run'
import type { Page } from 'playwright'
import JSZip from 'jszip'
import fs from 'fs/promises'
import { logError as lgE, log as lg, getFileLogger } from '../../helpers/log'
import prefs from '../../helpers/prefs.js'
import { spawn } from 'node:child_process'
import { findStatic, findUuid } from '../../helpers/filter'
import { createIssue } from '../../helpers/issue'

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
const UPLOAD_SUBFOLDER = 'output'

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

function getFilenameWithoutExtension (filename : string) {
  return filename.replace(/\.[^/.]+$/, '')
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
    logError('Error happened on download:', downloadError)
    throw new Error(downloadError)
  }

  log(download.suggestedFilename())

  const uuid = (new URL(urlExercice)).searchParams.get('uuid')

  let idPath = (new URL(urlExercice)).searchParams.get('id')
  idPath = idPath?.substring(0, idPath?.lastIndexOf('.')) || idPath
  const id = idPath?.split('/').reverse()[0]
  // console.log(uuid)

  try {
    await fs.access(UPLOAD_FOLDER)
  } catch (err) {
    await fs.mkdir(UPLOAD_FOLDER)
  }

  try {
    await fs.access(UPLOAD_SUBFOLDER)
  } catch (err) {
    await fs.mkdir(UPLOAD_SUBFOLDER)
  }

  await download.saveAs(UPLOAD_FOLDER + '/' + UPLOAD_SUBFOLDER + '/' + id + (id === uuid ? '_' : '_' + uuid + '_') + download.suggestedFilename())

  const zip = await fs.open(UPLOAD_FOLDER + '/' + UPLOAD_SUBFOLDER + '/' + id + (id === uuid ? '_' : '_' + uuid + '_') + download.suggestedFilename())

  const unzipfiles : Map<string, string> = await readZip(zip)

  zip.close()

  const folder = UPLOAD_FOLDER + '/' + id + (id === uuid ? '_' : '_' + uuid + '_') + Date.now() + '-' + Math.round(Math.random() * 1E9)
  await fs.mkdir(folder)

  const filesPromise : Promise<unknown>[] = []
  unzipfiles.forEach((value, key) => {
    // console.log(`m[${key}] = ${value}`);
    filesPromise.push(fs.writeFile(folder + '/' + key, value))
  })
  await Promise.all(filesPromise)

  const file = Array.from(unzipfiles.keys()).find(ele => ele === 'main.tex' || ele === 'test.tex')

  const controller = new AbortController()
  const { signal } = controller

  const trace : string[] = []
  const launch = new Promise((resolve, reject) => {
    log(folder + '/' + file)
    const xelatex = spawn('lualatex', ['--halt-on-error', '' + file], { cwd: folder + '/', signal })

    const timer = setTimeout(() => { controller.abort() }, 5 * 60 * 1000)
    xelatex.stdout.on('data', function (result) {
      const out = Buffer.from(result, 'utf-8').toString()
      trace.push(out.replaceAll('\r\n', ''))
      if (trace.length > 30) {
        trace.shift() // supprime le premier élément
        // console.log(trace.join(' '))
      }
    })
    xelatex.stderr.on('data', function (result) {
      const out = Buffer.from(result, 'utf-8').toString()
      log(out)
    })
    xelatex.on('error', function (err) { reject(err) })
    xelatex.on('close', (code : number) => {
      clearTimeout(timer)
      if (code !== 0) {
        log(code)
        reject(code)
      } else {
        resolve(code)
      }
    })
  })

  const code = await launch.catch(err => {
    log(err)
    return -1
  })
  log('code:' + code)
  if (code === 0) {
    await fs.copyFile(folder + '/' + getFilenameWithoutExtension('' + file) + '.pdf', UPLOAD_FOLDER + '/' + UPLOAD_SUBFOLDER + '/' + id + (id === uuid ? '_' : '_' + uuid + '_') + getFilenameWithoutExtension(download.suggestedFilename()) + '.pdf')
    await fs.rm(folder + '/', { recursive: true, force: true })
    return 'OK'
  } else {
    log(trace.join('\n'))
    await createIssue(urlExercice, trace, ['pdfexport'], log)
    return 'KO'
  }
  // const formData = new FormData()
  // unzipfiles.forEach((value, key) => {
  //   // console.log(`m[${key}] = ${value}`);
  //   formData.append('name', key)
  //   formData.append('originalname', key)
  //   formData.append('file', new Blob(new Array(value)), key)
  // })

  // let resultReq = ''

  // await fetch('http://192.168.1.11:3000/generate', {
  //   method: 'POST',
  //   body: formData,
  //   signal: AbortSignal.timeout(60 * 1000)
  // }).then((res : Response) => {
  //   log('response.status =' + res.status)
  //   if (res.status === 200) {
  //     resultReq = 'OK'
  //   } else {
  //     resultReq = 'KO'
  //   }
  //   return res.blob()
  // }).then(blob => {
  //   log(resultReq)
  //   return blob.arrayBuffer()
  // }).then(buffer => {
  //   fs.writeFile(UPLOAD_FOLDER + '/' + id + '_' + uuid + (resultReq === 'OK' ? '.pdf' : '.log'), new Uint8Array(buffer))
  // }).catch((err) => {
  //   logError('Error occured' + err)
  //   logError(err.name)
  //   resultReq = 'KO'
  //   logError(resultReq)
  // })
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
        const hostname = local ? `http://localhost:${process.env.CI ? '80' : '5173'}/alea/` : 'https://coopmaths.fr/alea/'
        log(`uuid=${uuids[k][0]} exo=${uuids[k][1]} i=${k} / ${uuids.length}`)
        const resultReq = await getLatexFile(page, `${hostname}?uuid=${uuids[k][0]}&id=${uuids[k][1].substring(0, uuids[k][1].lastIndexOf('.')) || uuids[k][1]}&alea=${alea}&v=latex&testCI`)
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
 * Attention, il faut le compilateur lualatex installé sur l'ordinateur
 * pour ensuite les compiler avec lualatex...
 */

const alea = 'e906e'
const local = true

if (process.env.CI && process.env.NIV !== null && process.env.NIV !== undefined) {
  // utiliser pour les tests d'intégration
  const filter = (process.env.NIV as string).replaceAll(' ', '')
  prefs.headless = true
  log(filter)
  testRunAllLots(filter)
} else {
  // testRunAllLots('can')
  // testRunAllLots('3e')
  // testRunAllLots('4e')
  // testRunAllLots('5e')
  // testRunAllLots('6e')
  // testRunAllLots('2e')
  // testRunAllLots('1e')
  testRunAllLots('dnb_2018')
  testRunAllLots('dnb_2019')
  testRunAllLots('dnb_2020')
  testRunAllLots('dnb_2021')
  testRunAllLots('dnb_2022')
  testRunAllLots('dnb_2023')
  // testRunAllLots('c3')
}
