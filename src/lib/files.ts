import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
import type Latex from './Latex'
import { buildImagesUrlsList, doesLatexNeedsPics, getExosContentList, getPicsNames, type LatexFileInfos } from './Latex'

export function downloadZip (filesUrls: string[], zipFileName: string) {
  const zip = new JSZip()
  let count = 0
  filesUrls.forEach((url) => {
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        throw err
      }
      const splitUrl = url.split('/')
      const fileName = splitUrl[splitUrl.length - 1]
      zip.file(fileName, data, { binary: true })
      count++
      if (count === filesUrls.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, zipFileName)
        })
      }
    })
  })
}

/**
 * Construit l'archive ZIP contenant le code LaTeX et tous les fichiers images nécessaires pour la compilation du code LaTeX
 * @param {string} zipFileName nom donné pour l'archive
 * @param {Latex} latex objet Latex contenant les données des exercices
 * @param {LatexFileInfos} filesInfo paramètres du fichier LaTeX à générer
 * @author sylvain
 */
export async function downloadTexWithImagesZip (zipFileName: string, latex: Latex, latexFileInfos: LatexFileInfos) {
  const zip = new JSZip()
  const text = await latex.getFile(latexFileInfos)
  const contents = await latex.getContents(latexFileInfos.style, latexFileInfos.nbVersions)
  const withImages = doesLatexNeedsPics(contents)
  const exosContentList = getExosContentList(latex.exercices)
  const picsNames = getPicsNames(exosContentList)
  zip.file('main.tex', text)
  if (withImages) {
    const urls = buildImagesUrlsList(exosContentList, picsNames)
    const imagesFolder = zip.folder('images')
    let count = 0
    urls.forEach((url) => {
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          throw err
        }
        const splitUrl = url.split('/')
        const fileName = splitUrl[splitUrl.length - 1]
        imagesFolder.file(fileName, data, { binary: true })
        count++
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            // saveAs(content, [archiveName.replace(/\.(?:.*)$/g, ""), "zip"].join("."))
            saveAs(content, [zipFileName, 'zip'].join('.'))
          })
        }
      })
    })
  } else {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, [zipFileName, 'zip'].join('.'))
    })
  }
}
