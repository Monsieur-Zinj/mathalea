import genericPreamble from '../lib/latex/preambule.tex?raw'
import TypeExercice from '../exercices/Exercice'
import { mathaleaHandleExerciceSimple } from './mathalea.js'
import seedrandom from 'seedrandom'
// printPrettier pose problème avec begin{aligned}[t] en ajoutant un saut de ligne problématique
// import { printPrettier } from 'prettier-plugin-latex/standalone.js'

const logPDF = (str: string) => {
  console.log('PACKAGETEST:' + str)
}

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
    for (const exercice of this.exercices) {
      if (exercice.typeExercice === 'statique') continue
      if (!Object.prototype.hasOwnProperty.call(exercice, 'listeQuestions')) continue
      if (exercice != null) {
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
            if (latexFileInfos.style === 'Coopmaths') {
              content += `\n\\begin{EXO}{${exercice.examen || ''} ${exercice.mois || ''} ${exercice.annee || ''} ${exercice.lieu || ''}}{}\n`
            } else if (latexFileInfos.style === 'Classique') {
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
          content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing, Boolean(exercice.listeAvecNumerotation), Number(exercice.nbCols)), Number(exercice.nbCols))
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
      if (exercice.typeExercice === 'simple') {
        mathaleaHandleExerciceSimple(exercice, false)
      }
      seedrandom(seed, { global: true })
      if (exercice.typeExercice !== 'simple') {
        if (typeof exercice.nouvelleVersionWrapper === 'function') exercice.nouvelleVersionWrapper()
      }
    }
    for (const exercice of this.exercices) {
      content += `\n% @see : ${getUrlFromExercice(exercice)}`
      if (exercice.typeExercice === 'statique') {
        if (exercice.content === '') {
          content += '% Cet exercice n\'est pas disponible au format LaTeX'
        } else {
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
        // if (withQrcode) content += '\n\\begin{minipage}{0.75\\linewidth}'
        content += writeIntroduction(exercice.introduction)
        content += '\n' + format(exercice.consigne)
        content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing, Boolean(exercice.listeAvecNumerotation), Number(exercice.nbCols)), Number(exercice.nbCols))
        // if (withQrcode) {
        //   content += '\n\\end{minipage}'
        //   content += '\n\\begin{minipage}{0.20\\linewidth}'
        //   content += `\n\\qrcode{${getUrlFromExercice(exercice)}&v=eleve&es=0211}`
        //   content += '\n\\end{minipage}'
        // }
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
          contents.contentCorr = ''
        }
      } else if (latexFileInfos.style === 'ProfMaquetteQrcode') {
        for (let i = 1; i < latexFileInfos.nbVersions + 1; i++) {
          if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted2 in getContents of Latex.ts', 'AbortError') }
          const contentVersion = this.getContentForAVersionProfMaquette(i, true)
          contents.content += `\n\\begin{Maquette}[Fiche, CorrigeApres=false, CorrigeFin=true]{Niveau=${latexFileInfos.subtitle || ' '},Classe=${latexFileInfos.reference || ' '},Date= ${latexFileInfos.nbVersions > 1 ? 'v' + i : ' '} ,Theme=${latexFileInfos.title || 'Exercices'}}\n`
          contents.content += contentVersion
          contents.content += '\n\\end{Maquette}'
          contents.contentCorr = ''
        }
      }
      if (latexFileInfos.signal?.aborted) { throw new DOMException('Aborted3 in getContents of Latex.ts', 'AbortError') }
      contents.preamble = `% @see : ${window.location.href}`
      contents.preamble += '\n\\documentclass[a4paper,11pt,fleqn]{article}'
      if (contents.content.includes('\\Engrenages[') || // exo : 3A12
          contents.content.includes('\\Propor[') || // exo : 6P15
          contents.content.includes('\\Fraction[') || // exo : can4-2024-Q15
          contents.content.includes('\\Reperage[')) { // exo 5R12-1
        // à mettre avant ProfMaquette
        logPDF(`usepackage{ProfCollege} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage{ProfCollege}'
      }
      contents.preamble += '\n\\usepackage{ProfMaquette}'
      contents.preamble += `\n\\usepackage{etoolbox}
\\setKVdefault[Boulot]{CorrigeFin=${latexFileInfos.correctionOption === 'AvecCorrection' ? 'true' : 'false'}}
\\newbool{dys}
\\setbool{dys}{${latexFileInfos.fontOption === 'DysFont' ? 'true' : 'false'}}          
\\ifbool{dys}{
% POLICE DYS
\\usepackage{unicode-math}
\\usepackage{fontspec}
\\setmainfont{TeX Gyre Schola}
\\setmathfont{TeX Gyre Schola Math}
\\usepackage[fontsize=14]{scrextend}
\\usepackage{setspace}
\\setstretch{1.7}
}{
% POLICE STANDARD
\\usepackage{fontenc}
\\usepackage[scaled=1]{helvet}
\\usepackage[fontsize=12]{scrextend}
}`
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
      if (contents.content.includes('pspicture') || contents.content.includes('\\rput') || contents.content.includes('\\pscurve') || contents.content.includes('\\psset') || contents.content.includes('\\psframe')) {
        contents.preamble += '\n\\usepackage{pstricks}'
        logPDF(`usepackage{pspicture} : ${window.location.href}`)
      }
      if (contents.content.includes('\\pstext')) {
        if (!contents.preamble.includes('pst-text')) contents.preamble += '\n\\usepackage{pst-text}'
        logPDF(`usepackage{pst-text} : ${window.location.href}`)
      }
      if (contents.content.includes('\\pstGeonode') || contents.content.includes('\\pstLine')) {
        if (!contents.preamble.includes('pst-eucl')) contents.preamble += '\n\\usepackage{pst-eucl}'
        logPDF(`usepackage{pst-eucl} : ${window.location.href}`)
      }
      if (contents.content.includes('\\psaxes') || contents.content.includes('\\psline') || contents.content.includes('\\pspolygon') || contents.content.includes('\\psplot')) {
        if (!contents.preamble.includes('pst-plot')) contents.preamble += '\n\\usepackage{pst-plot}'
        logPDF(`usepackage{pst-plot} : ${window.location.href}`)
      }
      if (contents.content.includes('\\multido')) {
        if (!contents.preamble.includes('multido')) contents.preamble += '\n\\usepackage{multido}'
        logPDF(`usepackage{multido} : ${window.location.href}`)
      }
      if (contents.content.includes('\\gradangle{') || contents.content.includes('fillstyle=gradient')) {
        logPDF(`usepackage{pst-grad} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('pst-grad'))contents.preamble += '\n\\usepackage{pst-grad}'
      }
      if (contents.content.includes('\\pstree{') || contents.content.includes('\\pstree[')) {
        logPDF(`usepackage{pst-tree} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('pst-tree'))contents.preamble += '\n\\usepackage{pst-tree}'
      }
      if (contents.content.includes('\\pnode') || contents.content.includes('\\ncline') || contents.content.includes('\\nccurve') || contents.content.includes('\\ncarc')) {
        if (!contents.preamble.includes('pnode ncline nccurve ncarc')) contents.preamble += '\n\\usepackage{pst-node}'
        logPDF(`usepackage{pst-node} : ${window.location.href}`)
      }
      if (contents.content.includes('\\red') || contents.content.includes('\\blue') || contents.content.includes('\\white')) {
        // gestion des couleurs pour les sujets DNB : 2023
        logPDF(`usepackage{pst-fun}: ${window.location.href}`)
        contents.preamble += '\n\\usepackage{pst-fun}'
      }
      if (contents.content.includes('\\euro')) {
        contents.preamble += '\n\\usepackage[gen]{eurosym}'
        logPDF(`usepackage{eurosym} : ${window.location.href}`)
      }
      if (contents.content.includes('\\tkzTabInit')) {
        contents.preamble += '\n\\usepackage{tkz-tab}'
        logPDF(`usepackage{tkz-tab} : ${window.location.href}`)
      }
      if (contents.content.includes('\\begin{tabularx}') || contents.content.includes('\\begin{tabular}') || contents.content.includes('{tabularx}')) {
        contents.preamble += '\n\\usepackage{tabularx}'
        logPDF(`usepackage{tabularx} : ${window.location.href}`)
      }
      if (contents.content.includes('\\ang') || contents.content.includes('\\num{')) {
        logPDF(`usepackage{siunitx} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage{siunitx}'
      }
      if (contents.content.includes('\\begin{multicols}')) {
        logPDF(`usepackage{multicols} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage{multicol}'
      }
      if (contents.content.includes('\\cancel{')) {
        logPDF(`usepackage{multicols} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage{cancel}'
      }
      if (contents.content.includes('\\draw[color={')) {
        logPDF(`usepackage{xcolor} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage[svgnames,dvipsnames]{xcolor}'
      }
      if (contents.content.includes('\\np{') || contents.content.includes('\\np[') || contents.content.includes('\\numprint{')) {
        logPDF(`usepackage{numprint} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage[autolanguage,np]{numprint}'
      }
      if (contents.content.includes('\\fcolorbox{nombres}')) {
        logPDF(`definecolor{nombres} : ${window.location.href}`)
        contents.preamble += '\n\\definecolor{nombres}{cmyk}{0,.8,.95,0}'
      }
      if (contents.content.includes('\\begin{bclogo}')) {
        logPDF(`definecolor{nombres} : ${window.location.href}`)
        if (!contents.preamble.includes('bclogo')) contents.preamble += '\n\\usepackage[tikz]{bclogo}'
        if (!contents.preamble.includes('definecolor{nombres}')) contents.preamble += '\n\\definecolor{nombres}{cmyk}{0,.8,.95,0}'
      }
      if (contents.content.includes('\\begin{tikzpicture}')) {
        logPDF(`usepackage{tikz} : ${window.location.href}`)
        if (!contents.preamble.includes('tikz')) contents.preamble += '\n\\usepackage{tikz}'
      }
      if (contents.content.includes('\\vect')) {
        // DBN 2019 juillet polynésie
        logPDF(`\\vect: ${window.location.href}`)
        contents.preamble += '\n\\newcommand{\\vect}[1]{\\overrightarrow{\\,\\mathstrut#1\\,}}'
      }
      if (contents.content.includes('\\begin{axis}')) {
        logPDF(`usepackage{pgfplots} : ${window.location.href}`)
        contents.preamble += '\n\\usepackage{pgfplots}'
      }
      if (contents.content.includes('decorate,decoration=') || (contents.content.includes('decorate, decoration='))) {
        logPDF(`usetikzlibrary{decorations.pathmorphing: ${window.location.href}`)
        contents.preamble += '\n\\usetikzlibrary{decorations.pathmorphing}'
      }
      if (contents.content.includes('\\tkzText')) {
        logPDF(`usepackage{tkz-fct}: ${window.location.href}`)
        contents.preamble += '\n\\usepackage{tkz-fct}'
      }
      if (contents.content.includes('\\begin{wrapfigure}')) {
        logPDF(`usepackage{wrapfig}: ${window.location.href}`)
        contents.preamble += '\n\\usepackage{wrapfig}'
      }
      if (contents.content.includes('\\begin{scratch}')) {
        logPDF(`usepackage{scratch3}: ${window.location.href}`)
        contents.preamble += '\n\\usepackage{scratch3}'
      }
      if (contents.content.includes('\\degre') ||
          contents.content.includes('\\og') ||
          contents.content.includes('\\up{') ||
          contents.content.includes('\\ieme{') ||
          contents.content.includes('\\no')) {
        // gestion des commandes pour les sujets DNB : 2023-2022
        logPDF(`[french]{babel}: ${window.location.href}`)
        if (!contents.preamble.includes('[french]{babel}')) contents.preamble += '\n\\usepackage[french]{babel}'
      }
      if (contents.content.includes('\\multirow{')) {
        // gestion pour les sujets DNB : 2021
        logPDF(`usepackage{multirow}: ${window.location.href}`)
        contents.preamble += '\n\\usepackage{multirow}'
      }
      if (contents.content.includes('\\ovalbox{') || contents.content.includes('\\txtbox{')) {
        // gestion pour les sujets DNB : 2021
        contents.preamble += '\n\\usepackage{fancybox}'
        logPDF(`usepackage{fancybox}: ${window.location.href}`)
        if (contents.content.includes('\\txtbox{')) {
          logPDF(`\\newcommand{\\txtbox}{\\ovalnum}: ${window.location.href}`)
          contents.preamble += '\n\\newcommand{\\txtbox}{\\ovalnum}'
        }
      }
      if (contents.content.includes('\\begin{figure}')) {
        logPDF(`begin{figure}': ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : dnb_2019_09_polynesie_6; dnb_2022_06_etrangers_5
        contents.preamble += `\n% supprime les figures flottantes du DNB
\\makeatletter
\\def\\provideenvironment{\\@star@or@long\\provide@environment}
\\def\\provide@environment#1{%
  \\@ifundefined{#1}%
    {\\def\\reserved@a{\\newenvironment{#1}}}%
    {\\def\\reserved@a{\\renewenvironment{dummy@environ}}}%
  \\reserved@a
}
\\def\\dummy@environ{}
\\makeatother
\\provideenvironment{figure}{}{}\\renewenvironment{figure}{}{}`
      }
      if (contents.content.includes('\\selectarrownum')) {
        logPDF(`\\selectarrownum : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : dnb_2018_06_ameriquenord_4
        contents.preamble += '\n\\newcommand*\\selectarrownum{% le petit triangle vers le bas à côté d\'un _nombre_'
        contents.preamble += '\n  \\unskip\\hskip0.125em \\tikz[baseline=-1.25ex,x=1ex,y=1ex,rounded corners=0pt]\\draw[fill=black!70,draw=none](0,0)--(1,0)--(0.5,-0.6)--cycle;'
        contents.preamble += '\n}'
      }
      if (contents.content.includes('\\R') || contents.content.includes('\\N')) {
        logPDF(`\\mathbb{R} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('amsfonts')) contents.preamble += '\n\\usepackage{amsfonts}'
        contents.preamble += '\n\\newcommand\\R{\\mathbb{R}}'
        contents.preamble += '\n\\newcommand\\N{\\mathbb{N}}'
      }
      if (contents.content.includes('\\ldots') || contents.content.includes('\\cdots') || contents.content.includes('\\dots')) {
        // gestion des commandes pour les sujets DNB : 2023
        logPDF(`usepackage{amsmath} : ${window.location.href}`)
        if (!contents.preamble.includes('amsmath')) contents.preamble += '\n\\usepackage{amsmath}'
      }
      if (contents.content.includes('\\makebox') || contents.content.includes('\\framebox') || contents.content.includes('\\framebox') || contents.content.includes('\\parbox')) {
        // gestion des commandes pour les sujets DNB : 2023
        logPDF(`usepackage{amsfonts} : ${window.location.href}`)
        if (!contents.preamble.includes('amsfonts')) contents.preamble += '\n\\usepackage{amsfonts}'
      }
      if (contents.content.includes('\\mbox') || contents.content.includes('\\fbox') || contents.content.includes('\\sbox') || contents.content.includes('\\pbox')) {
        logPDF(`usepackage{amsfonts} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('amsfonts')) contents.preamble += '\n\\usepackage{amsfonts}'
      }
      if (contents.content.includes('\\leadsto') || contents.content.includes('\\square') || contents.content.includes('\\blacktriangleright') || contents.content.includes('\\mathbb') || contents.content.includes('\\geqslant') || contents.content.includes('\\blacktriangleleft') || contents.content.includes('\\leqslant') || contents.content.includes('\\curvearrowleft')) {
        logPDF(`usepackage{amssymb} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('amssymb')) contents.preamble += '\n\\usepackage{amssymb}'
      }
      if (contents.content.includes('\\columncolor{') || contents.content.includes('\\cellcolor') || contents.content.includes('\\rowcolor')) {
        logPDF(`usepackage{colortbl} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('colortbl')) contents.preamble += '\n\\usepackage{colortbl}'
      }
      if (contents.content.includes('\\ovalnum{\\ovalnum')) {
        logPDF(`definecolor{scrmovedddd} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += '\n\\definecolor{scrmovedddd}    {HTML}{3373cc}'
      }
      if (contents.content.includes('\\ding{') || contents.content.includes('\\textding') || contents.content.includes('\\decoone')) {
        // pour les sujets DNB : 2023 / 2021
        logPDF(`usepackage{pifont} : ${window.location.href}`)
        if (!contents.preamble.includes('pifont'))contents.preamble += '\n\\usepackage{pifont}'
        if (contents.content.includes('\\decoone')) contents.preamble += '\n\\newcommand{\\decoone}{\\ding{87}}'
        if (contents.content.includes('\\textding')) contents.preamble += '\n\\newcommand{\\textding}[1]{\\text{\\Large \\ding{#1}}}'
      }
      if (contents.content.includes('\\starredbullet')) {
        logPDF(`uusepackage{MnSymbol} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += '\n\\usepackage{MnSymbol}'
        contents.preamble += '\n\\newcommand\\starredbullet{\\medstar}'
      }
      if (contents.content.includes('\\decosix')) {
        logPDF(`\\providecommand\\decosix{} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2021
        contents.preamble += '\n\\providecommand\\decosix{}'
        contents.preamble += '\n\\renewcommand\\decosix{$\\bullet$}'
      }
      if (contents.content.includes('\\toprule') || contents.content.includes('\\midrule') || contents.content.includes('\\bottomrule')) {
        logPDF(`\\usepackage{booktabs} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('booktabs')) contents.preamble += '\n\\usepackage{booktabs}'
      }
      if (contents.content.includes('\\backslashbox')) {
        logPDF(`\\usepackage{slashbox} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += '\n\\usepackage{slashbox}'
      }
      if (contents.content.includes('\\ds')) {
        logPDF(`\\newcommand{\\ds}{\\displaystyle} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += '\\newcommand{\\ds}{\\displaystyle}'
      }
      if (contents.content.includes('\\diagbox{')) {
        logPDF(`usepackage{diagbox} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += '\n\\usepackage{diagbox}'
      }
      if (contents.content.includes('\\EUR{')) {
        logPDF(`usepackage{marvosym} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('marvosym'))contents.preamble += '\n\\usepackage{marvosym}'
      }
      if (contents.content.includes('pattern')) {
        logPDF(`usetikzlibrary{patterns} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('usetikzlibrary{patterns}'))contents.preamble += '\n\\usetikzlibrary{patterns}'
      }
      if (contents.content.includes('framed')) {
        logPDF(`usetikzlibrary{backgrounds} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('usetikzlibrary{backgrounds}'))contents.preamble += '\n\\usetikzlibrary{backgrounds}'
      }
      if (contents.content.includes('single arrow')) {
        logPDF(`usetikzlibrary{shapes} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('usetikzlibrary{shapes}'))contents.preamble += '\n\\usetikzlibrary{shapes}'
      }
      if (contents.content.includes('>=triangle 45')) {
        logPDF(`usetikzlibrary{arrows} : ${window.location.href}`)
        if (!contents.preamble.includes('usetikzlibrary{arrows}'))contents.preamble += '\n\\usetikzlibrary{arrows}'
      }
      if (contents.content.includes('\\getprime{') || contents.content.includes('\\primedecomp{')) {
        logPDF(`decompNombresPremiersDNB : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += `\n${decompDNB()}`
      }
      if (contents.content.includes('\\widearc{') || contents.content.includes('\\eurologo')) {
        logPDF(`usepackage{fourier} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('fourier')) contents.preamble += '\n\\usepackage{fourier}'
      }
      if (contents.content.includes('\\tkzDefPoints') || contents.content.includes('\\tkzDefPointBy') || contents.content.includes('\\tkzLabelPoint') || contents.content.includes('\\tkzDrawSegments')) {
        logPDF(`usepackage{tkz-euclide} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        if (!contents.preamble.includes('tkz-euclide')) contents.preamble += '\n\\usepackage{tkz-euclide}'
      }
      if (contents.content.includes('\\pstEllipse[linewidth=')) {
        logPDF(`\\pstEllipse : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += '\n\\providecommand\\pstEllipse{}'
        contents.preamble += `\n\\renewcommand{\\pstEllipse}[5][]{%
\\psset{#1}
\\parametricplot{#4}{#5}{#2\\space t cos mul #3\\space t sin mul}
}`
      }
      if (contents.content.includes('\\begin{forest}')) {
        logPDF(`usepackage{forest} : ${window.location.href}`)
        // gestion des commandes pour les sujets DNB : 2023
        contents.preamble += `\n\\usetikzlibrary{trees} % arbre en proba
\\usepackage{forest} % arbre en proba
\\usetikzlibrary{positioning}
  % Structure servant à avoir l'événement et la probabilité.
\\def\\getEvene#1/#2\\endget{$#1$}
\\def\\getProba#1/#2\\endget{$#2$}`
      }
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
        contents.preamble += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${addPackages(contents.content)}\n\n`
        contents.preamble += '\n\\Theme[CAN]{}{}{}{}'
        contents.intro += '\n\\begin{document}'
        contents.intro += '\n\\setcounter{nbEx}{1}'
        contents.intro += '\n\\pageDeGardeCan{nbEx}'
        contents.intro += '\n\\clearpage'
      } else {
        contents.preamble += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${addPackages(contents.content)}\n\n`
        contents.preamble += `\\Theme[${latexFileInfos.style}]{nombres}{${latexFileInfos.title}}{${latexFileInfos.reference}}{${latexFileInfos.subtitle}}`
        contents.intro += '\n\\begin{document}\n'
      }
    }
    return contents
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
      content += '\n\t\\item ' + (nbCols > 1 ? '\\begin{minipage}[t]{\\linewidth}' : '') + format(question) + (nbCols > 1 ? '\\end{minipage}' : '')
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
          imagesFilesUrls.push(`${window.location.origin}/alea/static/${serie}/${year}/images/${file.name}.${file.format}`)
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
        const matchIm = list[0].matchAll(regExpImage)
        if (matchIm !== undefined) pics.push(...matchIm)
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
 *  Le \\euro mange l'espace qui vient après lui, d'où la nécessité d'insérer un espace insécable s'il y en avait un avant le replacement.
 */
export function format (text: string): string {
  if (text === undefined) return ''
  return text
    .replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/gim, '\n\n\\medskip\n')
    .replace(/(\d+)\s*°/g, '\\ang{$1}')
    .replace(/<br>/g, '\\\\')
    .replace(/( )?€( )/g, '\\,\\euro{}~')
    .replace(/( )?€/g, '\\,\\euro{}')
    .replace(/\\\\\s*\n\n/gm, '\\\\')
    .replace('«', '\\og{}')
    .replace('»', '\\fg{}')
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

function addPackages (content: string, isFullPackages = false) {
  let packages = genericPreamble
  if (isFullPackages || content.includes('\\euro')) {
    packages += '\n\\usepackage[gen]{eurosym}'
  }
  if (isFullPackages || content.includes('\\ang')) {
    packages += '\n\\usepackage{siunitx}'
  }
  return packages
}

function decompDNB() {
  return `%%% Table des nombres premiers  %%%%
\\newcount\\primeindex
\\newcount\\tryindex
\\newif\\ifprime
\\newif\\ifagain
\\newcommand\\getprime[1]{%
\\opcopy{2}{P0}%
\\opcopy{3}{P1}%
\\opcopy{5}{try}
\\primeindex=2
\\loop
\\ifnum\\primeindex<#1\\relax
\\testprimality
\\ifprime
\\opcopy{try}{P\\the\\primeindex}%
\\advance\\primeindex by1
\\fi
\\opadd*{try}{2}{try}%
\\ifnum\\primeindex<#1\\relax
\\testprimality
\\ifprime
\\opcopy{try}{P\\the\\primeindex}%
\\advance\\primeindex by1
\\fi
\\opadd*{try}{4}{try}%
\\fi
\\repeat
}

\\newcommand\\testprimality{%
\\begingroup
\\againtrue
\\global\\primetrue
\\tryindex=0
\\loop
\\opidiv*{try}{P\\the\\tryindex}{q}{r}%
\\opcmp{r}{0}%
\\ifopeq \\global\\primefalse \\againfalse \\fi
\\opcmp{q}{P\\the\\tryindex}%
\\ifoplt \\againfalse \\fi
\\advance\\tryindex by1
\\ifagain
\\repeat
\\endgroup
}

%%% Décomposition en nombres premiers %%%

\\newcommand\\primedecomp[2][nil]{%
\\begingroup
\\opset{#1}%
\\opcopy{#2}{NbtoDecompose}%
\\opabs{NbtoDecompose}{NbtoDecompose}%
\\opinteger{NbtoDecompose}{NbtoDecompose}%
\\opcmp{NbtoDecompose}{0}%
\\ifopeq
Je refuse de décomposer zéro.
\\else
\\setbox1=\\hbox{\\opdisplay{operandstyle.1}%
{NbtoDecompose}}%
{\\setbox2=\\box2{}}%
\\count255=1
\\primeindex=0
\\loop
\\opcmp{NbtoDecompose}{1}\\ifopneq
\\opidiv*{NbtoDecompose}{P\\the\\primeindex}{q}{r}%
\\opcmp{0}{r}\\ifopeq
\\ifvoid2
\\setbox2=\\hbox{%
\\opdisplay{intermediarystyle.\\the\\count255}%
{P\\the\\primeindex}}%
\\else
\\setbox2=\\vtop{%
\\hbox{\\box2}
\\hbox{%
\\opdisplay{intermediarystyle.\\the\\count255}%
{P\\the\\primeindex}}}
\\fi
\\opcopy{q}{NbtoDecompose}%
\\advance\\count255 by1
\\setbox1=\\vtop{%
\\hbox{\\box1}
\\hbox{%
\\opdisplay{operandstyle.\\the\\count255}%
{NbtoDecompose}}
}%
\\else
\\advance\\primeindex by1
\\fi
\\repeat
\\hbox{\\box1
\\kern0.5\\opcolumnwidth
\\opvline(0,0.75){\\the\\count255.25}
\\kern0.5\\opcolumnwidth
\\box2}%
\\fi
\\endgroup
}`
}

export default Latex
