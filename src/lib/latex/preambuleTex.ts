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

export function loadProfCollegeIfNeed (contents: contentsType) {
  testIfLoaded(['\\Engrenages[', '\\Propor[', '\\Fraction[', '\\Reperage['], '\\usepackage{ProfCollege}', contents)
}

function testIfLoaded (values : string[], valueToPut : string, contents: contentsType, display? : string) {
  for (const value of values) {
    if (contents.content.includes(value) || contents.contentCorr.includes(value)) {
      if (!contents.preamble.includes(valueToPut)) contents.preamble += `\n${valueToPut}`
      logPDF(`${display === undefined ? valueToPut : display}: ${window.location.href}`)
    }
  }
}

export function loadPackagesFromContent (contents: contentsType) {
  contents.preamble += '\n% loadPackagesFromContent'
  loadProfCollegeIfNeed(contents)
  testIfLoaded(['pspicture', '\\rput', '\\pscurve', '\\psset', '\\psframe'], '\\usepackage{pstricks}', contents)
  testIfLoaded(['\\pstext'], '\\usepackage{pst-text}', contents)
  testIfLoaded(['\\pstGeonode', '\\pstLine'], '\\usepackage{pst-eucl}', contents)
  testIfLoaded(['\\psaxes', '\\psline', '\\pspolygon', '\\psplot'], '\\usepackage{pst-plot}', contents)
  testIfLoaded(['\\multido'], '\\usepackage{multido}', contents)
  testIfLoaded(['\\gradangle{', 'fillstyle=gradient'], '\\usepackage{pst-grad}', contents)
  testIfLoaded(['\\pstree{', '\\pstree['], '\\usepackage{pst-tree}', contents)
  testIfLoaded(['\\pnode', '\\ncline', '\\nccurve', '\\ncarc'], '\\usepackage{pst-node}', contents)
  testIfLoaded(['\\red', '\\blue', '\\white'], '\\usepackage{pst-fun}', contents)
  testIfLoaded(['\\euro'], '\\usepackage[gen]{eurosym}', contents)
  testIfLoaded(['\\tkzTabInit'], '\\usepackage{tkz-tab}', contents)
  testIfLoaded(['{tabularx}', '{tabular}'], '\\usepackage{tabularx}', contents)
  testIfLoaded(['\\ang', '\\num{'], '\\usepackage{siunitx}', contents)
  testIfLoaded(['\\begin{multicols}'], '\\usepackage{multicol}', contents)
  testIfLoaded(['\\opadd', '\\opsub', '\\opmul', '\\opdiv', '\\opidiv'], '\\usepackage{xlop}', contents)
  testIfLoaded(['\\cancel'], '\\usepackage{cancel}', contents)
  testIfLoaded(['\\draw[color={'], '\\usepackage[svgnames,dvipsnames]{xcolor}', contents)
  testIfLoaded(['\\np{', '\\np[', '\\numprint{'], '\\usepackage[autolanguage,np]{numprint}', contents)
  testIfLoaded(['\\mathscr'], '\\usepackage{mathrsfs}', contents)
  testIfLoaded(['\\fcolorbox{nombres}'], '\\definecolor{nombres}{cmyk}{0,.8,.95,0}', contents)
  testIfLoaded(['\\begin{tikzpicture}'], '\\usepackage{tikz}', contents)
  testIfLoaded(['\\vect'], '\\newcommand{\\vect}[1]{\\overrightarrow{\\,\\mathstrut#1\\,}}', contents)
  testIfLoaded(['\\begin{bclogo}'], '\\usepackage[tikz]{bclogo}', contents)
  if (contents.content.includes('\\begin{bclogo}')) {
    logPDF(`definecolor{nombres} : ${window.location.href}`)
    if (!contents.preamble.includes('definecolor{nombres}')) contents.preamble += '\n\\definecolor{nombres}{cmyk}{0,.8,.95,0}'
  }
  testIfLoaded(['\\begin{axis}'], '\\usepackage{pgfplots}', contents)
  testIfLoaded(['decorate,decoration=', 'decorate, decoration='], '\\usetikzlibrary{decorations.pathmorphing}', contents)
  testIfLoaded(['decoration=brace', 'decoration={brace}'], '\\usetikzlibrary {decorations.pathreplacing}', contents)
  testIfLoaded(['\\tkzText'], '\\usepackage{tkz-fct}', contents)
  testIfLoaded(['\\begin{wrapfigure}'], '\\usepackage{wrapfig}', contents)
  testIfLoaded(['needspace'], '\\usepackage{needspace}', contents)
  testIfLoaded(['\\begin{scratch}'], '\\usepackage{scratch3}', contents)
  testIfLoaded(['\\degre', '\\og', '\\up{', '\\ieme{', '\\no'], '\\usepackage[french]{babel}', contents)
  testIfLoaded(['\\multirow{'], '\\usepackage{multirow}', contents)
  testIfLoaded(['\\dotfills'], '\\newcommand\\dotfills[1][4cm]{\\makebox[#1]{\\dotfill}}', contents)

  if (contents.content.includes('\\ovalbox{') || contents.content.includes('\\txtbox{')) {
    // gestion pour les sujets DNB : 2021
    contents.preamble += '\n\\usepackage{fancybox}'
    logPDF(`usepackage{fancybox}: ${window.location.href}`)
    if (contents.content.includes('\\txtbox{')) {
      logPDF(`\\newcommand{\\txtbox}{\\ovalnum}: ${window.location.href}`)
      contents.preamble += '\n\\newcommand{\\txtbox}{\\ovalnum}'
    }
  }
  testIfLoaded(['\\begin{figure}'], `\n% supprime les figures flottantes du DNB
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
\\provideenvironment{figure}{}{}\\renewenvironment{figure}{}{}`, contents, 'begin{figure}')
  if (contents.content.includes('\\selectarrownum')) {
    logPDF(`\\selectarrownum : ${window.location.href}`)
    // gestion des commandes pour les sujets DNB : dnb_2018_06_ameriquenord_4
    contents.preamble += '\n\\newcommand*\\selectarrownum{% le petit triangle vers le bas à côté d\'un _nombre_'
    contents.preamble += '\n  \\unskip\\hskip0.125em \\tikz[baseline=-1.25ex,x=1ex,y=1ex,rounded corners=0pt]\\draw[fill=black!70,draw=none](0,0)--(1,0)--(0.5,-0.6)--cycle;'
    contents.preamble += '\n}'
  }
  testIfLoaded(['\\R ', '\\R{', '\\N ', '\\N{', '\\N$', '\\R$'], '\\usepackage{amsfonts}', contents)
  testIfLoaded(['\\R ', '\\R{', '\\R$'], '\\newcommand\\R{\\mathbb{R}}', contents)
  testIfLoaded(['\\N ', '\\N{', '\\N$'], '\\newcommand\\N{\\mathbb{N}}', contents)
  testIfLoaded(['\\ldots', '\\cdots', '\\dots', '\\makebox', '\\framebox', '\\parbox', '\\mbox', '\\fbox', '\\sbox', '\\pbox'], '\\usepackage{amsmath}', contents)
  testIfLoaded(['\\leadsto', '\\square', '\\blacktriangleright', '\\blacktriangleleft', '\\mathbb', '\\geqslant', '\\leqslant', '\\curvearrowleft', '\\Box'], '\\usepackage{amssymb}', contents)
  testIfLoaded(['\\columncolor{', '\\cellcolor', '\\rowcolor'], '\\usepackage{colortbl}', contents)
  testIfLoaded(['\\ovalnum{\\ovalnum'], '\\definecolor{scrmovedddd}    {HTML}{3373cc}', contents)
  testIfLoaded(['\\ding{', '\\textding', '\\decoone'], '\\usepackage{pifont}', contents)
  testIfLoaded(['\\decoone'], '\\newcommand{\\decoone}{\\ding{87}}', contents)
  testIfLoaded(['\\textding'], '\\newcommand{\\textding}[1]{\\text{\\Large \\ding{#1}}}', contents)
  testIfLoaded(['\\starredbullet'], '\\usepackage{MnSymbol}\n\\newcommand\\starredbullet{\\medstar}', contents)
  testIfLoaded(['\\decosix'], '\\providecommand\\decosix{}\n\\renewcommand\\decosix{$\\bullet$}', contents)
  testIfLoaded(['\\toprule', '\\midrule', '\\bottomrule'], '\\usepackage{booktabs}', contents)
  testIfLoaded(['\\backslashbox', '\\diagbox{'], '\\usepackage{diagbox}', contents)
  testIfLoaded(['\\ds'], '\\newcommand{\\ds}{\\displaystyle}', contents)
  testIfLoaded(['\\EUR{'], '\\usepackage{marvosym}', contents)
  testIfLoaded(['pattern'], '\\usetikzlibrary{patterns}', contents)
  testIfLoaded(['framed'], '\\usetikzlibrary{backgrounds}', contents)
  testIfLoaded(['single arrow'], '\\usetikzlibrary{shapes}', contents)
  testIfLoaded(['>=triangle 45'], '\\usetikzlibrary{arrows}', contents)
  testIfLoaded(['\\getprime{', '\\primedecomp{'], decompDNB(), contents, 'decompNombresPremiersDNB')
  testIfLoaded(['\\widearc{', '\\eurologo'], '\\usepackage{fourier}', contents)
  testIfLoaded(['\\tkzDefPoints', '\\tkzDefPointBy', '\\tkzLabelPoint', '\\tkzDrawSegments'], '\\usepackage{tkz-euclide}', contents)
  testIfLoaded(['\\pstEllipse[linewidth='], '\\providecommand\\pstEllipse{}\n\\renewcommand{\\pstEllipse}[5][]{%\n\\psset{#1}\n\\parametricplot{#4}{#5}{#2\\space t cos mul #3\\space t sin mul}\n}', contents, '\\pstEllipse')
  if (contents.content.includes('\\begin{forest}') || contents.contentCorr.includes('\\begin{forest}')) {
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
\\usepackage{xlop}
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
