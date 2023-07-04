import { context } from '../../modules/context.js'
import { stringNombre, texNombre } from '../../modules/outils.js'

/**
 * Renvoie le html ou le latex qui met les 2 chaines de caractères fournies sur 2 colonnes différentes
 * @author Rémi Angot
 * @param {string} cont1 - Contenu de la première colonne
 * @param {string} cont2 - Contenu de la deuxième colonne
 * @param {number} [largeur1=50] Largeur de la première colonne
 * @return {string}
 */
export function deuxColonnes (cont1, cont2, largeur1 = 50) {
  if (context.isHtml) {
    return `
    <div>
    <div class="question" style="float:left;max-width: ${largeur1}%;margin-right: 30px">
    ${cont1}
   </div>
   <div style="float:left; max-width: ${90 - largeur1}%">
    ${cont2}
   </div>
   <div style="clear:both"></div>
   <div class="ui hidden divider"></div>
   </div>
`
  } else {
    return `\\begin{minipage}{${largeur1 / 100}\\linewidth}
    ${cont1.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    \\begin{minipage}{${(100 - largeur1) / 100}\\linewidth}
    ${cont2.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    `
  }
}

/**
 * Renvoie le html ou le latex qui met les 2 chaines de caractères fournies sur 2 colonnes différentes
 * Si en sortie html, il n'y a pas assez de places alors on passe en momocolonne !
 * @author Mickael Guironnet
 * @param {string} cont1 - Contenu de la première colonne
 * @param {string} cont2 - Contenu de la deuxième colonne
 * @param {{eleId: string, largeur1: number, widthmincol1: number, widthmincol2: number}} options
 *          eleId : identifiant ID pour retrouver la colonne
 *          largeur1 : largeur de la première colonne en latex en pourcentage
 *          widthmincol1 : largeur de la première minimum en html en px
 *          widthmincol2 : largeur de la deuxième minimum en html en px
 *  ex : deuxColonnesResp (enonce, correction, {eleId : '1_1', largeur1:50, widthmincol1: 400px, widthmincol2: 200px})
 * @return {string}
 */
export function deuxColonnesResp (cont1, cont2, options) {
  if (options === undefined) {
    options = { largeur1: 50 }
  } else if (typeof options === 'number') {
    options = { largeur1: options }
  }
  if (options.largeur1 === undefined) {
    options.largeur1 = 50
  }
  if (options.stylecol1 === undefined) {
    options.stylecol1 = ''
  }
  if (options.stylecol2 === undefined) {
    options.stylecol2 = ''
  }
  if (options.widthmincol1 === undefined) {
    options.widthmincol1 = '0px'
  }
  if (options.widthmincol2 === undefined) {
    options.widthmincol2 = '0px'
  }

  if (context.isHtml) {
    return `
    <style>
    .cols-responsive {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-gap: 1rem;
    }
    /* Screen larger than 900px? 2 column */
    @media (min-width: 900px) {
      .cols-responsive { grid-template-columns: repeat(2, 1fr); }
    }
    </style>
    <div class='cols-responsive'>
      <div id='cols-responsive1-${options.eleId}'style='min-width:${options.widthmincol1};${options.stylecol1}' >
      ${cont1}
      </div>
      <div id='cols-responsive2-${options.eleId}' style='min-width:${options.widthmincol2};${options.stylecol2}' >
      ${cont2}
      </div>
    </div>
`
  } else {
    return `\\begin{minipage}{${options.largeur1 / 100}\\linewidth}
    ${cont1.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    \\begin{minipage}{${(100 - options.largeur1) / 100}\\linewidth}
    ${cont2.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    `
  }
}

/**
 *
 * @param {string} texte
 * @returns le texte centré dans la page selon le contexte.
 * @author Jean-Claude Lhote
 */
export function centrage (texte) {
  return context.isHtml ? `<center>${texte}</center>` : `\\begin{center}\n\t${texte}\n\\end{center}\n`
}

/**
 * Renvoie un environnent LaTeX multicolonnes
 * @author Rémi Angot
 */
export function texMulticols (texte, nbCols = 2) {
  let result
  if (nbCols > 1) {
    result = '\\begin{multicols}{' + nbCols + '}\n' +
      texte + '\n\\end{multicols}'
  } else {
    result = texte
  }
  return result
}

/**
 * Centre un texte
 *
 * @author Rémi Angot
 */
export function texteCentre (texte) {
  if (context.isHtml) {
    return `<p style="text-align: center">${texte}</p>`
  } else {
    return `\\begin{center}
${texte}
\\end{center}`
  }
}

/**
 * Crée un tableau avec un nombre de lignes et de colonnes déterminées
 * par la longueur des tableaux des entetes passés en paramètre
 * Les contenus sont en mode maths par défaut, il faut donc penser à remplir les tableaux
 * en utilisant éventuellement la commande \\text{}
 *
 * @example
 * tableauColonneLigne(['coin','A','B'],['1','2'],['A1','B1','A2','B2']) affiche le tableau ci-dessous
 * ------------------
 * | coin | A  | B  |
 * ------------------
 * |  1   | A1 | B1 |
 * ------------------
 * |  2   | A2 | B2 |
 * ------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B','C'],['1','2'],['A1','B1','C1','A2','B2','C2']) affiche le tableau ci-dessous
 * -----------------------
 * | coin | A  | B  | C  |
 * -----------------------
 * |  1   | A1 | B1 | C1 |
 * -----------------------
 * |  2   | A2 | B2 | C2 |
 * -----------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B'],['1','2','3'],['A1','B1','A2','B2','A3','B3']) affiche le tableau ci-dessous
 * ------------------
 * | coin | A  | B  |
 * ------------------
 * |  1   | A1 | B1 |
 * ------------------
 * |  2   | A2 | B2 |
 * ------------------
 * |  3   | A3 | B3 |
 * ------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B','C'],['1','2','3'],['A1','B1','C1','A2','B2','C2','A3','B3','C3']) affiche le tableau ci-dessous
 * -----------------------
 * | coin | A  | B  | C  |
 * -----------------------
 * |  1   | A1 | B1 | C1 |
 * -----------------------
 * |  2   | A2 | B2 | C2 |
 * -----------------------
 * |  3   | A3 | B3 | C3 |
 * -----------------------
 *
 * @param {array} tabEntetesColonnes contient les entetes des colonnes
 * @param {array} tabEntetesLignes contient les entetes des lignes
 * @param {array} tabLignes contient les elements de chaque ligne
 * @author Sébastien Lozano
 *
 */
export function tableauColonneLigne (tabEntetesColonnes, tabEntetesLignes, tabLignes, arraystretch, math = true) {
  // on définit le nombre de colonnes
  const C = tabEntetesColonnes.length
  // on définit le nombre de lignes
  const L = tabEntetesLignes.length
  // On construit le string pour obtenir le tableau pour compatibilité HTML et LaTeX
  let tableauCL = ''
  if (!arraystretch) {
    if (context.isHtml) {
      arraystretch = 2.5
    } else {
      arraystretch = 1
    }
  }
  if (context.isHtml) {
    tableauCL += `$\\def\\arraystretch{${arraystretch}}\\begin{array}{|`
  } else {
    tableauCL += `$\\renewcommand{\\arraystretch}{${arraystretch}}\n`
    tableauCL += '\\begin{array}{|'
  }
  // on construit la 1ere ligne avec toutes les colonnes
  for (let k = 0; k < C; k++) {
    tableauCL += 'c|'
  }
  tableauCL += '}\n'

  tableauCL += '\\hline\n'
  if (typeof tabEntetesColonnes[0] === 'number') {
    tableauCL += math ? texNombre(tabEntetesColonnes[0]) + '' : `\\text{${stringNombre(tabEntetesColonnes[0])}} `
  } else {
    tableauCL += math ? tabEntetesColonnes[0] : `\\text{${tabEntetesColonnes[0]}}`
  }
  for (let k = 1; k < C; k++) {
    if (typeof tabEntetesColonnes[k] === 'number') {
      tableauCL += ` & ${math ? texNombre(tabEntetesColonnes[k]) : '\\text{' + stringNombre(tabEntetesColonnes[k]) + '}'}`
    } else {
      tableauCL += ` & ${math ? tabEntetesColonnes[k] : '\\text{' + tabEntetesColonnes[k] + '}'}`
    }
  }
  tableauCL += '\\\\\n'
  tableauCL += '\\hline\n'
  // on construit toutes les lignes
  for (let k = 0; k < L; k++) {
    if (typeof tabEntetesLignes[k] === 'number') {
      tableauCL += math ? texNombre(tabEntetesLignes[k]) : `\\text{${stringNombre(tabEntetesLignes[k]) + ''}}`
    } else {
      tableauCL += math ? tabEntetesLignes[k] : `\\text{${tabEntetesLignes[k] + ''}}`
    }
    for (let m = 1; m < C; m++) {
      if (typeof tabLignes[(C - 1) * k + m - 1] === 'number') {
        tableauCL += ` & ${math ? texNombre(tabLignes[(C - 1) * k + m - 1]) : '\\text{' + stringNombre(tabLignes[(C - 1) * k + m - 1]) + '}'}`
      } else {
        tableauCL += ` & ${math ? tabLignes[(C - 1) * k + m - 1] : '\\text{' + tabLignes[(C - 1) * k + m - 1] + '}'}`
      }
    }
    tableauCL += '\\\\\n'
    tableauCL += '\\hline\n'
  }
  tableauCL += '\\end{array}\n'
  if (context.isHtml) {
    tableauCL += '$'
  } else {
    tableauCL += '\\renewcommand{\\arraystretch}{1}$\n'
  }

  return tableauCL
}
