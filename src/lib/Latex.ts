import preambule from '../lib/latex/preambule.tex?raw'
import TypeExercice from '../exercices/ExerciceTs.js'
import { mathaleaHandleExerciceSimple } from './mathalea.js'
import seedrandom from 'seedrandom'
// printPrettier pose problème avec begin{aligned}[t] en ajoutant un saut de ligne problématique
// import { printPrettier } from 'prettier-plugin-latex/standalone.js'

export interface Exo {
  content?: string
  serie?: string
  month?: string
  year?: string
  zone?: string
  title?: string
}

export interface picFile {
  name: string
  format: string
}

export interface LatexFileInfos {
  title: string
  reference: string
  subtitle: string
  style: 'Coopmaths' | 'Classique' | 'ProfMaquette' | 'ProfMaquetteQrcode' | 'Can'
  nbVersions: number
}

interface ExoContent {
  content?: string
  serie?: string
  month?: string
  year?: string
  zone?: string
  title?: string
}

class Latex {
  exercices: TypeExercice[]
  constructor () {
    this.exercices = []
  }

  addExercices (exercices: TypeExercice[]) {
    this.exercices.push(...exercices)
  }

  getContentsForAVersion (
    style: 'Coopmaths' | 'Classique' | 'ProfMaquette' | 'ProfMaquetteQrcode' | 'Can',
    indiceVersion: number = 1
  ): { content: string; contentCorr: string } {
    if (style === 'ProfMaquette') return { content: this.getContentForAVersionProfMaquette(1, false), contentCorr: '' }
    if (style === 'ProfMaquetteQrcode') return { content: this.getContentForAVersionProfMaquette(1, true), contentCorr: '' }
    let content = ''
    let contentCorr = ''
    for (const exercice of this.exercices) {
      if (exercice.typeExercice === 'statique') continue
      if (!Object.prototype.hasOwnProperty.call(exercice, 'listeQuestions')) continue
      if (exercice != null) {
        const seed = indiceVersion > 1 ? exercice.seed + indiceVersion.toString() : exercice.seed
        exercice.seed = seed
        if (exercice.typeExercice === 'simple') mathaleaHandleExerciceSimple(exercice, false)
        seedrandom(seed, { global: true })
        if (typeof exercice.nouvelleVersion === 'function') exercice.nouvelleVersion()
      }
    }
    if (style === 'Can') {
      content += '\\begin{TableauCan}\n'
      contentCorr += '\n\\begin{enumerate}'
      for (const exercice of this.exercices) {
        if (exercice != null) {
          for (let i = 0; i < exercice.listeQuestions.length; i++) {
            if (exercice.listeCanEnonces != null && exercice.listeCanEnonces[i] !== undefined && exercice.listeCanReponsesACompleter != null && exercice.listeCanReponsesACompleter[i] !== undefined) {
              content += `\\thenbEx  \\addtocounter{nbEx}{1}& ${format(exercice.listeCanEnonces[i])} &  ${format(
                  exercice.listeCanReponsesACompleter[i]
              )} &\\tabularnewline \\hline\n`
            } else {
              content += `\\thenbEx  \\addtocounter{nbEx}{1}& ${format(exercice.listeQuestions[i])} &&\\tabularnewline \\hline\n`
            }
          }
          for (const correction of exercice.listeCorrections) {
            contentCorr += `\n\\item ${format(correction)}`
          }
        }
      }
      contentCorr += '\n\\end{enumerate}\n'
      content += '\\end{TableauCan}\n\\addtocounter{nbEx}{-1}'
      /** On supprime les lignes vides car elles posent problème dans l'environnement TableauCan */
      content = content.replace(/\n\s*\n/gm, '')
    } else {
      for (const exercice of this.exercices) {
        if (exercice.typeExercice === 'statique') {
          if (exercice.content === '') {
            content += '% Cet exercice n\'est pas disponible au format LaTeX'
          } else {
            if (style === 'Coopmaths') {
              content += `\n\\begin{EXO}{${exercice.examen || ''} ${exercice.mois || ''} ${exercice.annee || ''} ${exercice.lieu || ''}}{}\n`
            } else if (style === 'Classique') {
              content += '\n\\begin{EXO}{}{}\n'
            }
            if (Number(exercice.nbCols) > 1) {
              content += `\\begin{multicols}{${exercice.nbCols}}\n`
            }
            content += exercice.content
            if (Number(exercice.nbCols) > 1) {
              content += '\n\\end{multicols}\n'
            }
            content += '\n\\end{EXO}\n'
            contentCorr += '\n\\begin{EXO}{}{}\n'
            contentCorr += exercice.contentCorr
            contentCorr += '\n\\end{EXO}\n'
          }
        } else {
          contentCorr += '\n\\begin{EXO}{}{}\n'
          if (Number(exercice.nbColsCorr) > 1) {
            contentCorr += `\\begin{multicols}{${exercice.nbColsCorr}}\n`
          }
          if (Number(exercice.spacingCorr) > 0) {
            contentCorr += `\n\\begin{enumerate}[itemsep=${exercice.spacingCorr}em]`
          } else {
            contentCorr += '\n\\begin{enumerate}'
          }

          for (const correction of exercice.listeCorrections) {
            contentCorr += `\n\\item ${format(correction)}`
          }
          contentCorr += '\n\\end{enumerate}\n'
          if (Number(exercice.nbColsCorr) > 1) {
            contentCorr += '\\end{multicols}\n'
          }
          contentCorr += '\n\\end{EXO}\n'
          content += `\n\\begin{EXO}{${format(exercice.consigne)}}{${String(exercice.id).replace('.js', '')}}\n`
          content += writeIntroduction(exercice.introduction)
          content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing, Boolean(exercice.listeAvecNumerotation)), Number(exercice.nbCols))
          content += '\n\\end{EXO}\n'
        }
      }
    }
    return { content, contentCorr }
  }

  getContentForAVersionProfMaquette (indiceVersion: number = 1, withQrcode = false): string {
    let content = ''
    for (const exercice of this.exercices) {
      if (exercice.typeExercice === 'statique') continue
      const seed = indiceVersion > 1 ? exercice.seed + indiceVersion.toString() : exercice.seed
      exercice.seed = seed
      if (exercice.typeExercice === 'simple') mathaleaHandleExerciceSimple(exercice, false)
      seedrandom(seed, { global: true })
      if (typeof exercice.nouvelleVersion === 'function') exercice.nouvelleVersion()
    }
    for (const exercice of this.exercices) {
      content += `\n% @see : ${getUrlFromExercice(exercice)}`
      if (exercice.typeExercice === 'statique') {
        if (exercice.content === '') {
          content += '% Cet exercice n\'est pas disponible au format LaTeX'
        } else {
          content += '\n\\begin{exercice}\n'
          content += exercice.content
          content += '\n\\end{exercice}\n'
          content += '\n\\begin{Solution}\n'
          content += exercice.contentCorr
          content += '\n\\end{Solution}\n'
        }
      } else {
        content += '\n\\begin{exercice}\n'
        if (withQrcode) content += '\n\\begin{minipage}{0.75\\linewidth}'
        content += writeIntroduction(exercice.introduction)
        content += '\n' + format(exercice.consigne)
        content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing, Boolean(exercice.listeAvecNumerotation)), Number(exercice.nbCols))
        if (withQrcode) {
          content += '\n\\end{minipage}'
          content += '\n\\begin{minipage}{0.20\\linewidth}'
          content += `\n\\qrcode{${getUrlFromExercice(exercice)}&v=eleve&es=0211}`
          content += '\n\\end{minipage}'
        }
        content += '\n\\end{exercice}\n'
        content += '\n\\begin{Solution}'
        content += writeInCols(writeQuestions(exercice.listeCorrections, exercice.spacingCorr, Boolean(exercice.listeAvecNumerotation)), Number(exercice.nbColsCorr))
        content += '\n\\end{Solution}\n'
      }
    }
    return content
  }

  async getContents (style: 'Coopmaths' | 'Classique' | 'ProfMaquette' | 'ProfMaquetteQrcode' | 'Can', nbVersions: number = 1, title: string = '', subtitle: string = '', reference: string = ''): Promise<{ content: string; contentCorr: string }> {
    const contents = { content: '', contentCorr: '' }
    if (style === 'ProfMaquette') {
      for (let i = 1; i < nbVersions + 1; i++) {
        const contentVersion = this.getContentForAVersionProfMaquette(i, false)
        contents.content += `\n\\begin{Maquette}[Fiche, CorrigeFin]{Niveau=${subtitle || ' '},Classe=${reference || ' '},Date= ${nbVersions > 1 ? 'v' + i : ' '} ,Theme=${title || 'Exercices'}}\n`
        contents.content += contentVersion
        contents.content += '\n\\end{Maquette}'
        contents.contentCorr = ''
      }
    } else if (style === 'ProfMaquetteQrcode') {
      for (let i = 1; i < nbVersions + 1; i++) {
        const contentVersion = this.getContentForAVersionProfMaquette(i, true)
        contents.content += `\n\\begin{Maquette}[Fiche, CorrigeFin]{Niveau=${subtitle || ' '},Classe=${reference || ' '},Date= ${nbVersions > 1 ? 'v' + i : ' '} ,Theme=${title || 'Exercices'}}\n`
        contents.content += contentVersion
        contents.content += '\n\\end{Maquette}'
        contents.contentCorr = ''
      }
    } else {
      for (let i = 1; i < nbVersions + 1; i++) {
        const contentVersion = this.getContentsForAVersion(style, i)
        if (i > 1) {
          contents.content += '\n\\clearpage'
          contents.content += '\n\\setcounter{ExoMA}{0}'
          contents.contentCorr += '\n\\clearpage'
          contents.contentCorr += '\n\\setcounter{ExoMA}{0}'
        }
        if (nbVersions > 1) {
          contents.content += `\n\\version{${i}}`
          contents.contentCorr += `\n\\version{${i}}`
          if (i > 1 && style === 'Can') {
            contents.content += '\n\\setcounter{nbEx}{1}'
            contents.content += '\n\\pageDeGardeCan{nbEx}\n\\clearpage'
          }
        }
        contents.content += contentVersion.content
        contents.contentCorr += contentVersion.contentCorr
      }
    }
    // contents.content = await printPrettier(contents.content)
    // contents.contentCorr = await printPrettier(contents.contentCorr)
    // contents.content = contents.content.replaceAll('\\begin{aligned}\n[t]', '\\begin{aligned}[t]')
    // contents.contentCorr = contents.contentCorr.replaceAll('\\begin{aligned}\n[t]', '\\begin{aligned}[t]')
    return contents
  }

  async getFile ({
    title,
    reference,
    subtitle,
    style,
    nbVersions
  }: {
    title: string
    reference: string
    subtitle: string
    style: 'Coopmaths' | 'Classique' | 'ProfMaquette' | 'ProfMaquetteQrcode' | 'Can'
    nbVersions: number
  }) {
    const contents = await this.getContents(style, nbVersions, title, subtitle, reference)
    const content = contents.content
    const contentCorr = contents.contentCorr
    let result = ''
    if (style === 'Can') {
      result += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${preambule}\n\n`
      result += '\n\\Theme[CAN]{}{}{}{}'
      result += '\n\\begin{document}'
      result += '\n\\setcounter{nbEx}{1}'
      result += '\n\\pageDeGardeCan{nbEx}'
      result += '\n\\clearpage'
      result += content
    } else if (style === 'ProfMaquette' || style === 'ProfMaquetteQrcode') {
      result = '\\documentclass[a4paper,11pt,fleqn]{article}'
      result += '\n\\usepackage{ProfCollege}'
      result += '\n\\usepackage{ProfMaquette}'
      result += '\n\\usepackage{qrcode}'
      result += '\n\\usepackage[luatex]{hyperref}'
      result += '\n\\usepackage{tkz-tab}'
      result += '\n\\usepackage{tabularx}'
      result += '\n\\usepackage{mathrsfs}'
      result += '\n\\usepackage[margin=1cm]{geometry}'
      result += '\n\\pagestyle{empty}'
      result += '\n\\usepackage{enumitem}'
      if (content.includes('pspicture')) {
        result += '\n\\usepackage{pstricks,pst-plot,pst-tree,pstricks-add}'
        result += '\n\\usepackage{pst-eucl}'
        result += '\n\\usepackage{pst-text}'
        result += '\n\\usepackage{pst-node,pst-all}'
        result += '\n\\usepackage{pst-func,pst-math,pst-bspline,pst-3dplot}'
      }
      if (content.includes('\\euro')) {
        result += '\n\\usepackage[gen]{eurosym}'
      }
      if (content.includes('\\np{')) {
        result += '\n\\usepackage[autolanguage,np]{numprint}'
      }
      if (content.includes(',decorate,decoration=')) {
        result += '\n\\usetikzlibrary{decorations.pathmorphing}'
      }

      const [latexCmds, latexPackages] = this.getContentLatex()
      for (const pack of latexPackages) {
        result += '\n\\usepackage{' + pack + '}'
      }
      for (const cmd of latexCmds) {
        result += '\n' + cmd.replace('cmd', '')
      }
      result += '\n\\begin{document}'
      result += content
    } else {
      result = `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${preambule}\n\n\\Theme[${style}]{nombres}{${title}}{${reference}}{${subtitle}}\n\n\\begin{document}\n${content}`
    }
    if (style === 'ProfMaquette' || style === 'ProfMaquetteQrcode') {
      result += '\n\\end{document}'
    } else {
      result += '\n\n\\clearpage\n\n\\begin{Correction}' + contentCorr + '\n\\clearpage\n\\end{Correction}\n\\end{document}'
      result += '\n\n% Local Variables:\n% TeX-engine: luatex\n% End:'
    }
    return result
  }

  getContentLatex () {
    const packLatex : string[] = []
    for (const exo of this.exercices) {
      if (typeof exo.listePackages === 'string') {
        packLatex.push(exo.listePackages)
      } else if (Array.isArray(exo.listePackages)) {
        packLatex.push(...exo.listePackages)
      }
    }
    const packageFiltered : string[] = packLatex.filter((value, index, array) => array.indexOf(value) === index)

    // let latexCmd = packageFiltered.filter((value, index, array) => value.startsWith('cmd'))
    // let latexPackages = packageFiltered.filter((value, index, array) => value.startsWith('cmd'))

    const [latexCmds, latexPackages] = packageFiltered.reduce((result: [string[], string[]], element : string) => {
      result[element.startsWith('cmd') ? 0 : 1].push(element)
      return result
    },
    [[], []])

    return [latexCmds, latexPackages]
  }
}

function writeIntroduction (introduction = ''): string {
  let content = ''
  if (introduction.length > 0) {
    content += '\n' + format(introduction)
  }
  return content
}

function writeQuestions (questions: string[], spacing = 1, numbersNeeded: boolean): string {
  let content = ''
  if (questions !== undefined && questions.length > 1) {
    content += '\n\\begin{enumerate}'
    const specs:string[] = []
    if (spacing !== 0) {
      specs.push(`itemsep=${spacing}em`)
    }
    if (!numbersNeeded) {
      specs.push('label={}')
    }
    if (specs.length !== 0) {
      content += '[' + specs.join(',') + ']'
    }
    for (const question of questions) {
      content += '\n\t\\item ' + format(question)
    }
    content += '\n\\end{enumerate}'
  } else {
    content += '\n' + format(questions[0])
  }
  return content
}

function writeInCols (text: string, nb: number): string {
  if (nb < 2) return text
  return `\\begin{multicols}{${nb}}${text}\n\\end{multicols}`
}

/**
 * Construire la liste des URLs pour les fichiers des images nécessaires
 * ### Remarques :
 * * Chaque URL est construite à partir de l'adresse du site Coopmaths
 * * Elle a __toujours__ pour forme `https://coopmaths.fr/alea/static/<serie>/<annee>/tex/<format>/<nom_image>.<format>`
 * * Elle présuppose donc que les images sont toutes au format `eps` et qu'elles ne sont pas stockées ailleurs.
 * @author sylvain
 */
export function buildImagesUrlsList (exosContentList: ExoContent[], picsNames: picFile[][]) {
  const imagesFilesUrls = [] as string[]
  exosContentList.forEach((exo, i) => {
    if (picsNames[i].length !== 0) {
      const year = exo.year
      const serie = exo?.serie?.toLowerCase()
      for (const file of picsNames[i]) {
        if (serie === 'crpe') {
          imagesFilesUrls.push(`${window.location.origin}/static/${serie}/${year}/images/${file.name}.${file.format}`)
        } else {
          if (file.format) {
            imagesFilesUrls.push(`https://coopmaths.fr/alea/static/${serie}/${year}/tex/${file.format}/${file.name}.${file.format}`)
          } else {
            imagesFilesUrls.push(`https://coopmaths.fr/alea/static/${serie}/${year}/tex/eps/${file.name}.eps`)
          }
        }
      }
    }
  })
  return imagesFilesUrls
}

/**
 * Constituer la liste des noms des images présentes dans le code de la feuille d'exercices.
 * ### Principe :
 * * Les deux variables globales `exosContentList` et `picsNames` servent à stocker le contenu de chaque
 * exercice et le nom de chaque images.
 * * Découpe le contenu du code LaTeX pour identifier les exercices en détectant
 * le texte entre les deux chaînes `\begin{EXO}` ... `\end{EXO}` (hormi les corrections où `\begin{EXO}`
 * est systématiquement suivi de `{}` vides)
 * * Dans le code de chaque exercice, on repère la commande `\includegraphics` dans les lignes non précédées d'un signe `%`
 * et on récupère le nom du fichier sans l'extension.
 * ### Remarques :
 * * `picsNames` est une tableau de tableaux au cas où des exercices contiendraient plusieurs figures
 * * les figures dans les corrections ne sont pas concernées.
 * @author sylvain
 */

export function getExosContentList (exercices: TypeExercice[]) {
  const exosContentList: ExoContent[] = []
  for (const exo of exercices) {
    let data: ExoContent = {}
    if (exo.typeExercice === undefined) {
      Object.assign(data, {}, { content: exo.contenu ?? '' })
    } else if (exo.typeExercice === 'simple') {
      Object.assign(data, {}, { content: exo.listeQuestions.join(' ') })
    } else {
      data = { content: exo.content, serie: exo.examen, month: exo.mois, year: exo.annee, zone: exo.lieu, title: [exo.examen, exo.mois, exo.annee, exo.lieu].join(' ') }
    }
    exosContentList.push(data)
  }
  return exosContentList
}
export function getPicsNames (exosContentList: ExoContent[]) {
  const picsList = [] as RegExpMatchArray[][]
  const picsNames = [] as picFile[][]
  const regExpImage = /^(?:(?!%))(?:.*?)\\includegraphics(?:\[.*?\])?\{(?<fullName>.*?)\}/gm
  const regExpImageName = /(?<name>.*?)\.(?<format>.*)$/gm
  for (const exo of exosContentList) {
    let pics: RegExpMatchArray[]
    if (exo.content && exo.content.matchAll(regExpImage) !== undefined) {
      pics = [...exo.content.matchAll(regExpImage)]
      picsList.push(pics)
    } else {
      picsList.push([])
    }
  }
  picsList.forEach((list, index) => {
    picsNames.push([])
    if (list.length !== 0) {
      for (const item of list) {
        let imgObj
        if (item[1].match(regExpImageName)) {
          const imgFile = [...item[1].matchAll(regExpImageName)]
          if (imgFile[0].groups != null) { imgObj = { name: imgFile[0].groups.name, format: imgFile[0].groups.format } }
        } else {
          imgObj = { name: item[1], format: '' }
        }
        if (imgObj != null) {
          picsNames[index].push(imgObj)
        }
      }
    }
  })
  return picsNames
}

/**
 * Détecter si le code LaTeX contient des images
 */
export function doesLatexNeedsPics (contents: { content: string, contentCorr: string }) {
  const includegraphicsMatches = contents.content.match('includegraphics')
  return includegraphicsMatches !== null
}

export function makeImageFilesUrls (exercices: TypeExercice[]) {
  const exosContentList = getExosContentList(exercices)
  const picsNames = getPicsNames(exosContentList)
  return buildImagesUrlsList(exosContentList, picsNames)
}

/**
 * Pour les exercices Mathalea on a des conventions pour les sauts de ligne qui fonctionnent en HTML comme en LaTeX
 * * `<br>` est remplacé par un saut de paragraphe
 * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
 */
export function format (text: string): string {
  if (text === undefined) return ''
  return text
    .replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/gim, '\n\n\\medskip\n')
    .replace(/<br>/g, '\\\\')
    .replace(/\\\\\s*\n\n/gm, '\\\\')
}

function getUrlFromExercice (ex: TypeExercice) {
  const url = new URL('https://coopmaths.fr/alea')
  url.searchParams.append('uuid', String(ex.uuid))
  if (ex.id !== undefined) url.searchParams.append('id', ex.id)
  if (ex.nbQuestions !== undefined) url.searchParams.append('n', ex.nbQuestions.toString())
  if (ex.duration !== undefined) url.searchParams.append('d', ex.duration.toString())
  if (ex.sup !== undefined) url.searchParams.append('s', ex.sup)
  if (ex.sup2 !== undefined) url.searchParams.append('s2', ex.sup2)
  if (ex.sup3 !== undefined) url.searchParams.append('s3', ex.sup3)
  if (ex.sup4 !== undefined) url.searchParams.append('s4', ex.sup4)
  if (ex.seed !== undefined) url.searchParams.append('alea', ex.seed)
  if (ex.interactif) url.searchParams.append('i', '1')
  if (ex.correctionDetaillee !== undefined) url.searchParams.append('cd', ex.correctionDetaillee ? '1' : '0')
  if (ex.nbCols !== undefined) url.searchParams.append('cols', ex.nbCols.toString())
  return url
}

export default Latex
