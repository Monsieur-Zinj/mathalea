import type { LatexFileInfos, contentsType } from '../Latex'

export function loadFonts (latexFileInfos: LatexFileInfos) {
  return `\n\\usepackage{etoolbox}
\\newbool{dys}
\\setbool{dys}{${latexFileInfos.fontOption === 'DysFont' ? 'true' : 'false'}}          
\\ifbool{dys}{
% POLICE DYS
\\usepackage{unicode-math}
\\usepackage{fontspec}
\\setmainfont{TeX Gyre Schola}
%\\setmainfont{OpenDyslexic}[Scale=1.0]
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
}

export function loadPreambule (latexFileInfos : LatexFileInfos, contents : contentsType) {
  if (latexFileInfos.style === 'Can') {
    return loadPreambuleCan()
  }
  return loadPackagesFromContent(contents)
}

function loadPreambuleCan () {
  return `
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% SPÉCIFIQUE SUJETS CAN                  %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\usepackage{longtable}

\\tikzset{
  mybox/.style={
    rectangle,
    drop shadow, 
    inner sep=17pt,
    draw=gray,
    shade,
    top color=gray,
    every shadow/.append style={fill=gray!40}, 
    bottom color=gray!20
    }
  }
  
  \\newcommand\\MyBox[2][]{%
    \\tikz\\node[mybox,#1] {#2}; 
  }
  % Un compteur pour les questions CAN
  \\newcounter{nbEx}
  % Pour travailler avec les compteurs
  \\usepackage{totcount}
  \\regtotcounter{nbEx}  

  % Une checkmark !
  \\def\\myCheckmark{\\tikz\\fill[scale=0.4](0,.35) -- (.25,0) -- (1,.7) -- (.25,.15) -- cycle;}  
  % Repiqué sans vergogne dans lemanuel TikZ pour l'impatient
  \\def\\arete{3}   \\def\\epaisseur{5}   \\def\\rayon{2}

  \\newcommand{\\ruban}{(0,0)
    ++(0:0.57735*\\arete-0.57735*\\epaisseur+2*\\rayon)
    ++(-30:\\epaisseur-1.73205*\\rayon)
    arc (60:0:\\rayon)   -- ++(90:\\epaisseur)
    arc (0:60:\\rayon)   -- ++(150:\\arete)
    arc (60:120:\\rayon) -- ++(210:\\epaisseur)
    arc (120:60:\\rayon) -- cycle}

  \\newcommand{\\mobiusCan}{
    % Repiqué sans vergogne dans lemanuel TikZ pour l'impatient
    \\begin{tikzpicture}[very thick,top color=white,bottom color=gray,scale=1.2]
      \\shadedraw \\ruban;
      \\shadedraw [rotate=120] \\ruban;
      \\shadedraw [rotate=-120] \\ruban;
      \\draw (-60:4) node[scale=5,rotate=30]{CAN};
      \\draw (180:4) node[scale=3,rotate=-90]{MathALEA};
      \\clip (0,-6) rectangle (6,6); % pour croiser
      \\shadedraw  \\ruban;
      \\draw (60:4) node [gray,xscale=2.5,yscale=2.5,rotate=-30]{CoopMaths};
    \\end{tikzpicture} 
  }
  
  \\newcommand{\\pageDeGardeCan}[1]{
    % #1 --> nom du compteur pour le nombre de questions

    %\\vspace*{10mm}
    \\textsc{Nom} : \\makebox[.35\\linewidth]{\\dotfill} \\hfill \\textsc{Prénom} : \\makebox[.35\\linewidth]{\\dotfill}

    \\vspace{10mm}
    \\textsc{Classe} : \\makebox[.33\\linewidth]{\\dotfill} \\hfill
    \\MyBox{\\Large\\textsc{Score} : \\makebox[.15\\linewidth]{\\dotfill} / \\total{#1}}      
    \\par\\medskip \\hrulefill \\par
    \\myCheckmark \\textit{\\textbf{Durée :  \\dureeCan}}

    \\smallskip
    \\myCheckmark \\textit{L'épreuve comporte \\total{#1} questions.}

    \\smallskip  
    \\myCheckmark \\textit{L'usage de la calculatrice et du brouillon est interdit.}

    \\smallskip
    \\myCheckmark \\textit{Il n'est pas permis d'écrire des calculs intermédiaires.}
    \\par \\hrulefill \\par\\vspace{5mm}
    \\begin{center}
      \\textsc{\\titreSujetCan}
      \\par\\vspace{5mm}
      \\mobiusCan
    \\end{center}
  }

  \\newlength{\\Largeurcp}
  
  % Structure globale pour les tableaux des livrets CAN
  \\NewDocumentEnvironment{TableauCan}{b}{%
    % #1 --> corps de tableau
    \\setlength{\\Largeurcp}{0.35\\textwidth-8\\tabcolsep}
    \\renewcommand*{\\arraystretch}{2.5}
    \\begin{spacing}{1.1}
      \\begin{longtable}{|>{\\columncolor{gray!20}\\centering}m{0.05\\textwidth}|>{\\centering}m{0.45\\textwidth}|>{\\centering}m{\\Largeurcp}|>{\\centering}p{0.1\\textwidth}|}%
        \\hline
        \\rowcolor{gray!20}\\#&Énoncé&Réponse&Jury\\tabularnewline \\hline
        % \\endfirsthead
        % \\hline
        % \\rowcolor{gray!20}\\#&Énoncé&Réponse&Jury\\tabularnewline \\hline
        % \\endhead
        #1
      \\end{longtable}
    \\end{spacing}
    \\renewcommand*{\\arraystretch}{1}
  }{}
  `
}

let debug = false
export const logPDF = (str: string) => {
  if (debug) console.log('PACKAGETEST:' + str)
}

export function loadPackagesFromContent (contents: contentsType) {
  contents.preamble += '% loadPackagesFromContent'
  if (contents.content.includes('pspicture') || contents.content.includes('\\rput') || contents.content.includes('\\pscurve') || contents.content.includes('\\psset') || contents.content.includes('\\psframe') ||
      contents.contentCorr.includes('pspicture') || contents.contentCorr.includes('\\rput') || contents.contentCorr.includes('\\pscurve') || contents.contentCorr.includes('\\psset') || contents.contentCorr.includes('\\psframe')
  ) {
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
    if (!contents.preamble.includes('pst-grad')) contents.preamble += '\n\\usepackage{pst-grad}'
  }
  if (contents.content.includes('\\pstree{') || contents.content.includes('\\pstree[')) {
    logPDF(`usepackage{pst-tree} : ${window.location.href}`)
    // gestion des commandes pour les sujets DNB : 2023
    if (!contents.preamble.includes('pst-tree')) contents.preamble += '\n\\usepackage{pst-tree}'
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
  if (contents.content.includes('\\euro') || contents.contentCorr.includes('\\euro')) {
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
  if (contents.content.includes('\\dotfills')) {
    logPDF(`dotfills: ${window.location.href}`)
    contents.preamble += '\n\\newcommand\\dotfills[1][4cm]{\\makebox[#1]{\\dotfill}}'
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
    if (!contents.preamble.includes('pifont')) contents.preamble += '\n\\usepackage{pifont}'
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
    if (!contents.preamble.includes('marvosym')) contents.preamble += '\n\\usepackage{marvosym}'
  }
  if (contents.content.includes('pattern')) {
    logPDF(`usetikzlibrary{patterns} : ${window.location.href}`)
    // gestion des commandes pour les sujets DNB : 2023
    if (!contents.preamble.includes('usetikzlibrary{patterns}')) contents.preamble += '\n\\usetikzlibrary{patterns}'
  }
  if (contents.content.includes('framed')) {
    logPDF(`usetikzlibrary{backgrounds} : ${window.location.href}`)
    // gestion des commandes pour les sujets DNB : 2023
    if (!contents.preamble.includes('usetikzlibrary{backgrounds}')) contents.preamble += '\n\\usetikzlibrary{backgrounds}'
  }
  if (contents.content.includes('single arrow')) {
    logPDF(`usetikzlibrary{shapes} : ${window.location.href}`)
    // gestion des commandes pour les sujets DNB : 2023
    if (!contents.preamble.includes('usetikzlibrary{shapes}')) contents.preamble += '\n\\usetikzlibrary{shapes}'
  }
  if (contents.content.includes('>=triangle 45')) {
    logPDF(`usetikzlibrary{arrows} : ${window.location.href}`)
    if (!contents.preamble.includes('usetikzlibrary{arrows}')) contents.preamble += '\n\\usetikzlibrary{arrows}'
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
}

function decompDNB () {
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