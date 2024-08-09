import genericPreamble from '../lib/latex/preambule.tex?raw'
import { loadFonts, loadPackagesFromContent, loadPreambule, loadProfCollegeIfNeed, logPDF } from '../lib/latex/preambuleTex'
import TypeExercice from '../exercices/Exercice'
import { mathaleaHandleExerciceSimple } from './mathalea.js'
import seedrandom from 'seedrandom'
import { getLang } from './stores/languagesStore'
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

export type LatexFileInfos = {
  title: string
  reference: string
  subtitle: string
  style: 'Coopmaths' | 'Classique' | 'ProfMaquette' | 'ProfMaquetteQrcode' | 'Can'
  nbVersions: number
  fontOption: 'StandardFont'| 'DysFont'
  correctionOption: 'AvecCorrection' | 'SansCorrection'
  qrcodeOption: 'AvecQrcode' | 'SansQrcode'
  signal?: AbortSignal | undefined
}

export type contentsType = {
  preamble: string
  intro: string
  content: string
  contentCorr: string
}

export type latexFileType = {
  contents: contentsType
  latexWithoutPreamble: string
  latexWithPreamble: string
}

interface ExoContent {
  content?: string
  contentCorr?: string
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

  isExerciceStaticInTheList () {
    return this.exercices.some(e => e.typeExercice === 'statique')
  }

  addExercices (exercices: TypeExercice[]) {
    this.exercices.push(...exercices)
  }

  getContentsForAVersion (
    latexFileInfos: LatexFileInfos,
    indiceVersion: number = 1
  ): { content: string; contentCorr: string } {
    if (latexFileInfos.style === 'ProfMaquette') return { content: this.getContentForAVersionProfMaquette(1, latexFileInfos.qrcodeOption === 'AvecQrcode'), contentCorr: '' }
    if (latexFileInfos.style === 'ProfMaquetteQrcode') return { content: this.getContentForAVersionProfMaquette(1, true), contentCorr: '' }
    let content = ''
    let contentCorr = ''
    this.loadExercicesWithVersion(indiceVersion)
    if (latexFileInfos.style === 'Can') {
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
            content += `\n% @see : ${getUrlFromExercice(exercice)}`
            content += `\n\\begin{EXO}{${exercice.examen || ''} ${exercice.mois || ''} ${exercice.annee || ''} ${exercice.lieu || ''}}{}\n`
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
          if (Number(exercice.nbQuestions) > 1) {
            if (Number(exercice.spacingCorr) > 0) {
              contentCorr += `\n\\begin{enumerate}[itemsep=${exercice.spacingCorr}em]`
            } else {
              contentCorr += '\n\\begin{enumerate}'
            }
          }
          for (const correction of exercice.listeCorrections) {
            contentCorr += `\n\\item \\begin{minipage}[t]{\\linewidth}${format(correction)}\\end{minipage}`
          }
          if (Number(exercice.nbQuestions) > 1) contentCorr += '\n\\end{enumerate}\n'
          if (Number(exercice.nbColsCorr) > 1) {
            contentCorr += '\\end{multicols}\n'
          }
          contentCorr += '\n\\end{EXO}\n'
          content += `\n% @see : ${getUrlFromExercice(exercice)}`
          content += `\n\\begin{EXO}{${format(exercice.consigne)}}{${String(exercice.id).replace('.js', '')}}\n`
          content += writeIntroduction(exercice.introduction)
          content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing, Boolean(exercice.listeAvecNumerotation), Number(exercice.nbCols)), Number(exercice.nbCols))
          content += '\n\\end{EXO}\n'
        }
      }
    }
    return { content, contentCorr }
  }

  loadExercicesWithVersion (indiceVersion: number = 1) {
    for (const exercice of this.exercices) {
      if (exercice.typeExercice === 'statique') {
        const serie = exercice?.examen?.toLowerCase()
        if (serie === 'crpe' && indiceVersion === 1) {
          exercice.content = exercice.content?.replaceAll('{Images/', '{')
          exercice.contentCorr = exercice.contentCorr?.replaceAll('{Images/', '{')
        }
        continue
      }
      if (!Object.prototype.hasOwnProperty.call(exercice, 'listeQuestions')) continue
      const seed = indiceVersion > 1 ? exercice.seed + indiceVersion.toString() : exercice.seed
      exercice.seed = seed
      if (exercice.typeExercice === 'simple') {
        mathaleaHandleExerciceSimple(exercice, false)
      } else {
        seedrandom(seed, { global: true })
        if (typeof exercice.nouvelleVersionWrapper === 'function') exercice.nouvelleVersionWrapper()
      }
    }
  }

  getContentForAVersionProfMaquette (indiceVersion: number = 1, withQrcode = false): string {
    this.loadExercicesWithVersion(indiceVersion)
    let content = ''
    for (const exercice of this.exercices) {
      content += `\n% @see : ${getUrlFromExercice(exercice)}`
      if (exercice.typeExercice === 'statique') {
        if (exercice.content === '') {
          content += '% Cet exercice n\'est pas disponible au format LaTeX'
        } else {
          content += '\n\\needspace{10\\baselineskip}'
          content += '\n\\begin{exercice}\n'
          if (withQrcode) {
            content += `\\begin{wrapfigure}{r}{2cm}
\\centering
{\\hypersetup{urlcolor=black}
\\qrcode{${getUrlFromExercice(exercice)}&v=eleve&es=0211}
}
Correction
\\end{wrapfigure}\\ `
          }
          content += exercice.content
          content += '\n\\end{exercice}\n'
          content += '\n\\begin{Solution}\n'
          content += exercice.contentCorr
          content += '\n\\end{Solution}\n'
        }
      } else {
        content += '\n\\needspace{10\\baselineskip}'
        content += '\n\\begin{exercice}\n'
        if (withQrcode) {
          content += `\\begin{wrapfigure}{r}{2cm}
\\centering
{\\hypersetup{urlcolor=black}
\\qrcode{${getUrlFromExercice(exercice)}&v=eleve&es=0211}
}
Correction
\\end{wrapfigure}\\ `
        }
        content += writeIntroduction(exercice.introduction)
        content += '\n' + format(exercice.consigne)
        content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing, Boolean(exercice.listeAvecNumerotation), Number(exercice.nbCols)), Number(exercice.nbCols))
        content += '\n\\end{exercice}\n'
        content += '\n\\begin{Solution}'
        content += writeInCols(writeQuestions(exercice.listeCorrections, exercice.spacingCorr, Boolean(exercice.listeAvecNumerotation), Number(exercice.nbCols)), Number(exercice.nbColsCorr))
        content += '\n\\end{Solution}\n'
      }
    }
    return content
  }

  async getContents (latexFileInfos : LatexFileInfos): Promise<contentsType> {
    const contents: contentsType = { preamble: '', intro: '', content: '', contentCorr: '' }
    if (latexFileInfos.style === 'ProfMaquette' || latexFileInfos.style === 'ProfMaquetteQrcode') {
      if (latexFileInfos.style === 'ProfMaquette') {
        for (let i = 1; i < latexFileInfos.nbVersions + 1; i++) {
          if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted in getContents of Latex.ts', 'AbortError') }
          const contentVersion = this.getContentForAVersionProfMaquette(i, latexFileInfos.qrcodeOption === 'AvecQrcode')
          contents.content += `\n\\begin{Maquette}[Fiche]{Niveau=${latexFileInfos.subtitle || ' '},Classe=${latexFileInfos.reference || ' '},Date= ${latexFileInfos.nbVersions > 1 ? 'v' + i : ' '} ,Theme=${latexFileInfos.title || 'Exercices'}}\n`
          contents.content += contentVersion
          contents.content += '\n\\end{Maquette}'
          contents.content += '\n\\clearpage'
          contents.contentCorr = ''
        }
      } else if (latexFileInfos.style === 'ProfMaquetteQrcode') {
        for (let i = 1; i < latexFileInfos.nbVersions + 1; i++) {
          if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted2 in getContents of Latex.ts', 'AbortError') }
          const contentVersion = this.getContentForAVersionProfMaquette(i, true)
          contents.content += `\n\\begin{Maquette}[Fiche, CorrigeApres=false, CorrigeFin=true]{Niveau=${latexFileInfos.subtitle || ' '},Classe=${latexFileInfos.reference || ' '},Date= ${latexFileInfos.nbVersions > 1 ? 'v' + i : ' '} ,Theme=${latexFileInfos.title || 'Exercices'}}\n`
          contents.content += contentVersion
          contents.content += '\n\\end{Maquette}'
          contents.content += '\n\\clearpage'
          contents.contentCorr = ''
        }
      }
      if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted3 in getContents of Latex.ts', 'AbortError') }
      this.loadPreambuleFromContents(contents, latexFileInfos)
      contents.intro += '\n\\begin{document}'
    } else {
      for (let i = 1; i < latexFileInfos.nbVersions + 1; i++) {
        if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted in getContents of Latex.ts', 'AbortError') }
        const contentVersion = this.getContentsForAVersion(latexFileInfos, i)
        if (i > 1) {
          contents.content += '\n\\clearpage'
          contents.content += '\n\\setcounter{ExoMA}{0}'
          contents.contentCorr += '\n\\clearpage'
          contents.contentCorr += '\n\\setcounter{ExoMA}{0}'
        }
        if (latexFileInfos.nbVersions > 1) {
          contents.content += `\n\\version{${i}}`
          contents.contentCorr += `\n\\version{${i}}`
          if (i > 1 && latexFileInfos.style === 'Can') {
            contents.content += '\n\\setcounter{nbEx}{1}'
            contents.content += '\n\\pageDeGardeCan{nbEx}\n\\clearpage'
          }
        }
        contents.content += contentVersion.content
        contents.contentCorr += contentVersion.contentCorr
      }
      if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted in getContents of Latex.ts', 'AbortError') }
      if (latexFileInfos.style === 'Can') {
        contents.preamble += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${addPackages(latexFileInfos, contents)}\n\n`
        contents.preamble += '\n\\Theme[CAN]{}{}{}{}'
        contents.intro += '\n\\begin{document}'
        contents.intro += '\n\\setcounter{nbEx}{1}'
        contents.intro += '\n\\pageDeGardeCan{nbEx}'
        contents.intro += '\n\\clearpage'
      } else {
        contents.preamble += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${addPackages(latexFileInfos, contents)}\n\n`
        contents.preamble += `\\Theme[${latexFileInfos.style}]{nombres}{${latexFileInfos.title}}{${latexFileInfos.reference}}{${latexFileInfos.subtitle}}`
        contents.intro += '\n\\begin{document}\n'
      }
    }
    return contents
  }

  private loadPreambuleFromContents (contents: contentsType, latexFileInfos: LatexFileInfos) {
    contents.preamble = `% @see : ${window.location.href}`
    contents.preamble += '\n\\documentclass[a4paper,11pt,fleqn]{article}'
    loadProfCollegeIfNeed(contents) // avant profmaquette sinon ça plante
    contents.preamble += '\n\\usepackage{ProfMaquette}'
    contents.preamble += `\n\\setKVdefault[Boulot]{CorrigeFin=${latexFileInfos.correctionOption === 'AvecCorrection' ? 'true' : 'false'}}`
    contents.preamble += loadFonts(latexFileInfos)
    contents.preamble += '\n\\usepackage[left=1.5cm,right=1.5cm,top=2cm,bottom=2cm]{geometry}'
    contents.preamble += '\n\\usepackage[luatex]{hyperref}'
    contents.preamble += '\n\\usepackage{tikz}'
    contents.preamble += '\n\\usetikzlibrary{calc}'
    contents.preamble += '\n\\usepackage{fancyhdr}'
    contents.preamble += '\n\\pagestyle{fancy}'
    contents.preamble += '\n\\renewcommand\\headrulewidth{0pt}'
    contents.preamble += '\n\\setlength{\\headheight}{18pt}'
    contents.preamble += '\n\\fancyhead[R]{\\href{https://coopmaths.fr/alea}{Mathaléa}}'
    contents.preamble += '\n\\fancyfoot[C]{\\thepage}'
    contents.preamble += `\n\\fancyfoot[R]{%
\\begin{tikzpicture}[remember picture,overlay]
  \\node[anchor=south east] at ($(current page.south east)+(-2,0.25cm)$) {\\scriptsize {\\bfseries \\href{https://coopmaths.fr/}{Coopmaths.fr} -- \\href{http://creativecommons.fr/licences/}{CC-BY-SA}}};
\\end{tikzpicture}
}`
    contents.preamble += `\n\\fancyhead[L]{
\\begin{tikzpicture}[y=0.8, x=0.8, yscale=-0.04, xscale=0.04,remember picture, overlay,fill=orange!50,transform canvas={xshift=-1cm,yshift=1cm}]
%%%% Arc supérieur gauche%%%%
\\path[fill](523,1424)..controls(474,1413)and(404,1372)..(362,1333)..controls(322,1295)and(313,1272)..(331,1254)..controls(348,1236)and(369,1245)..(410,1283)..controls(458,1328)and(517,1356)..(575,1362)..controls(635,1368)and(646,1375)..(643,1404)..controls(641,1428)and(641,1428)..(596,1430)..controls(571,1431)and(538,1428)..(523,1424)--cycle;
%%%% Dé face supérieur%%%%
\\path[fill](512,1272)..controls(490,1260)and(195,878)..(195,861)..controls(195,854)and(198,846)..(202,843)..controls(210,838)and(677,772)..(707,772)..controls(720,772)and(737,781)..(753,796)..controls(792,833)and(1057,1179)..(1057,1193)..controls(1057,1200)and(1053,1209)..(1048,1212)..controls(1038,1220)and(590,1283)..(551,1282)..controls(539,1282)and(521,1278)..(512,1272)--cycle;
%%%% Dé faces gauche et droite%%%%
\\path[fill](1061,1167)..controls(1050,1158)and(978,1068)..(900,967)..controls(792,829)and(756,777)..(753,756)--(748,729)--(724,745)..controls(704,759)and(660,767)..(456,794)..controls(322,813)and(207,825)..(200,822)..controls(193,820)and(187,812)..(187,804)..controls(188,797)and(229,688)..(279,563)..controls(349,390)and(376,331)..(391,320)..controls(406,309)and(462,299)..(649,273)..controls(780,254)and(897,240)..(907,241)..controls(918,243)and(927,249)..(928,256)..controls(930,264)and(912,315)..(889,372)..controls(866,429)and(848,476)..(849,477)..controls(851,479)and(872,432)..(897,373)..controls(936,276)and(942,266)..(960,266)..controls(975,266)and(999,292)..(1089,408)..controls(1281,654)and(1290,666)..(1290,691)..controls(1290,720)and(1104,1175)..(1090,1180)..controls(1085,1182)and (1071,1176)..(1061,1167)--cycle;
%%%% Arc inférieur bas%%%%
\\path[fill](1329,861)..controls(1316,848)and(1317,844)..(1339,788)..controls(1364,726)and(1367,654)..(1347,591)..controls(1330,539)and(1338,522)..(1375,526)..controls(1395,528)and(1400,533)..(1412,566)..controls(1432,624)and(1426,760)..(1401,821)..controls(1386,861)and(1380,866)..(1361,868)..controls(1348,870)and(1334,866)..(1329,861)--cycle;
%%%% Arc inférieur gauche%%%%
\\path[fill](196,373)..controls(181,358)and(186,335)..(213,294)..controls(252,237)and(304,190)..(363,161)..controls(435,124)and(472,127)..(472,170)..controls(472,183)and(462,192)..(414,213)..controls(350,243)and(303,283)..(264,343)..controls(239,383)and(216,393)..(196,373)--cycle;
\\end{tikzpicture}
}
%%%%%% Style Fiche
\\tcbset{%
  userfiche/.style={%
    %move upwards=-1cm,colback=red!75%
    top=5pt, left=5pt, right=5pt, colback=red!5!white%
  }%
}%
\\tcbset{%
  userfichecor/.style={%
    %spread upwards=-1cm,colback=gray!5%
    top=5pt, left=5pt, right=5pt, colback=red!5!white%
  }%
}%
${latexFileInfos.qrcodeOption === 'AvecQrcode' ? '\n\\tcbset{\n  tikzfiche/.append style={height=4cm, height plus=25cm}\n}\n' : ''}
% Parametrages
\\hypersetup{
    colorlinks=true,% On active la couleur pour les liens. Couleur par défaut rouge
    linkcolor=blue,% On définit la couleur pour les liens internes
    % filecolor=magenta,% On définit la couleur pour les liens vers les fichiers locaux      
    urlcolor=blue,% On définit la couleur pour les liens vers des sites web
    % pdftitle={Puissance Quatre},% On définit un titre pour le document pdf
    % pdfpagemode=FullScreen,% On fixe l'affichage par défaut à plein écran
}`
    contents.preamble += '\n\\usepackage{qrcode}'
    contents.preamble += '\n\\usepackage{mathrsfs}'
    contents.preamble += '\n\\usepackage{enumitem}'
    contents.preamble += '\n\\usepackage[french]{babel}'
    contents.preamble += '\n\\setlength{\\parindent}{0cm}'
    loadPackagesFromContent(contents)
    const [latexCmds, latexPackages] = this.getContentLatex()
    for (const pack of latexPackages) {
      logPDF(`pack: ${pack} : ${window.location.href}`)
      if (pack === 'bclogo') {
        if (!contents.preamble.includes('bclogo')) contents.preamble += '\n\\usepackage[tikz]{' + pack + '}'
      } else {
        contents.preamble += '\n\\usepackage{' + pack + '}'
      }
    }
    for (const cmd of latexCmds) {
      contents.preamble += '\n' + cmd.replace('cmd', '')
    }
  }

  async getFile (latexFileInfos : LatexFileInfos): Promise<latexFileType> {
    const contents = await this.getContents(latexFileInfos)
    const preamble = contents?.preamble
    const intro = contents?.intro
    const content = contents?.content
    const contentCorr = contents?.contentCorr
    let latexWithoutPreamble = ''
    latexWithoutPreamble += intro
    latexWithoutPreamble += content
    if (latexFileInfos.style === 'ProfMaquette' || latexFileInfos.style === 'ProfMaquetteQrcode') {
      latexWithoutPreamble += '\n\\end{document}'
    } else {
      latexWithoutPreamble += '\n\n\\clearpage\n\n\\begin{Correction}' + contentCorr + '\n\\clearpage\n\\end{Correction}\n\\end{document}'
      latexWithoutPreamble += '\n\n% Local Variables:\n% TeX-engine: luatex\n% End:'
    }
    const latexWithPreamble = preamble + latexWithoutPreamble
    return { contents, latexWithoutPreamble, latexWithPreamble }
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

function writeQuestions (questions: string[], spacing = 1, numbersNeeded: boolean, nbCols: number = 1): string {
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
      content += '\n\t\\item ' + (nbCols > 1 ? '\\begin{minipage}[t]{\\linewidth}' : '\\begin{minipage}[t]{\\linewidth}') + format(question) + (nbCols > 1 ? '\\end{minipage}' : '\\end{minipage}')
    }
    content += '\n\\end{enumerate}'
  } else {
    content += '\n \\begin{minipage}[t]{\\linewidth}' + format(questions[0] + '\\end{minipage}')
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
          if (file.format) {
            imagesFilesUrls.push(`${window.location.origin}/alea/static/${serie}/${year}/images/${file.name}.${file.format}`)
          } else {
            imagesFilesUrls.push(`${window.location.origin}/alea/static/${serie}/${year}/images/${file.name}.png`)
          }
        } else {
          if (file.format) {
            imagesFilesUrls.push(`${window.location.origin}/alea/static/${serie}/${year}/tex/${file.format}/${file.name}.${file.format}`)
          } else {
            imagesFilesUrls.push(`${window.location.origin}/alea/static/${serie}/${year}/tex/eps/${file.name}.eps`)
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
      data = { content: exo.content, contentCorr: exo.contentCorr, serie: exo.examen, month: exo.mois, year: exo.annee, zone: exo.lieu, title: [exo.examen, exo.mois, exo.annee, exo.lieu].join(' ') }
    }
    exosContentList.push(data)
  }
  return exosContentList
}
export function getPicsNames (exosContentList: ExoContent[]) {
  const picsList = [] as RegExpMatchArray[][]
  const picsNames = [] as picFile[][]
  const regDeleteCommentaires = /^(?:(?!%))(.*?)$/gm
  const regExpImage = /(?:.*?)\\includegraphics(?:\[.*?\])?\{(?<fullName>.*?)\}/gm
  const regExpImageName = /(?<name>.*?)\.(?<format>.*)$/gm
  for (const exo of exosContentList) {
    if (exo.content) {
      const pics : RegExpMatchArray [] = []
      // on supprime les phrases avec des commentaires
      const content = [...exo.content.matchAll(regDeleteCommentaires)]
      if (exo.contentCorr) content.push(...exo.contentCorr.matchAll(regDeleteCommentaires))
      content.forEach((list) => {
        // on recherche sur les lignes restantes si une image ou plusieurs images sont présentes
        const matchIm = Array.from(list[0].matchAll(regExpImage))
        if (matchIm !== null && matchIm.length > 0) {
          pics.push(...matchIm)
        }
      })
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
  const exos: ExoContent = {
    content: contents.content,
    contentCorr: contents.content
  }
  const imas = getPicsNames([exos])
  return imas.some(e => e.length > 0)
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
 *  Le \\euro mange l'espace qui vient après lui, d'où la nécessité d'insérer un espace insécable s'il y en avait un avant le replacement.
 */
export function format (text: string): string {
  if (text === undefined) return ''
  const lang = getLang()
  let formattedText = text
    .replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/gim, '\n\n\\medskip\n')
    .replace(/(\d+)\s*°/g, '\\ang{$1}')
    .replace(/<br>/g, '\\\\')
    .replace(/( )?€( )/g, '\\,\\euro{}~')
    .replace(/( )?€/g, '\\,\\euro{}')
    .replace(/\\\\\s*\n\n/gm, '\\\\')
    .replace('«', '\\og{}')
    .replace('»', '\\fg{}')

  // Check if the language is 'fr-CH' and replace \times with \cdot if true
  if (lang === 'fr-CH') {
    formattedText = formattedText.replace(/\\times/g, '\\cdot')
  }

  return formattedText
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
  return url.href.replaceAll('%', '\\%')
}

function addPackages (latexFileInfos : LatexFileInfos, contents: contentsType) {
  contents.preamble += genericPreamble
  contents.preamble += loadFonts(latexFileInfos)
  loadPreambule(latexFileInfos, contents)
  return contents.preamble
}

export default Latex
