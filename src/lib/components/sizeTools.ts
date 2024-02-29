/**
 * Calcule et attribue la taille (largeur et hauteur) des SVGs et adapte la position des `divLatex` à l'intérieur
 * du SVG. Le principe est le suivant : on récupère la largeur du container parent (passée en paramètre)
 * et on calcule la largeur du SVG en multipliant la largeur du parent par le coefficient passé en paramètre.
 * Les ratioi sont calculés en fonction de ces deux largeurs pour la hauteur et les positions des divLatex.
 * @param parent container contenant la question CAN et des figures SVG éventuelles
 * @param coef coefficient de réduction par rapport à la larguer du parent (sert dans le calcul de la largeur)
 */
export const setSizeWithinSvgContainer = (parent: HTMLDivElement) => {
  if (parent.classList.contains('hidden')) {
    // si la question est cachée, on ne fait rien
    return
  }
  const svgContainers = parent.getElementsByClassName('svgContainer')
  if (svgContainers.length > 0) {
    // la question contient des figures SVG
    // console.log('parent.clientWidth:' + parent.clientWidth + ';parent.clientHeight:' + parent.clientHeight)
    // const originalClientWidth = parent.clientWidth
    const originalClientHeight = parent.clientHeight
    // const fontSize = window.getComputedStyle(parent, null).getPropertyValue('font-size')
    let zoom = 3 // parseFloat(fontSize) / 16
    do {
      for (const svgContainer of svgContainers) {
        svgContainer.classList.add('flex')
        svgContainer.classList.add('justify-center')
        updateFigures(svgContainer as HTMLDivElement, zoom)
        // console.log('parent.clientWidth:' + parent.clientWidth + ';parent.clientHeight:' + parent.clientHeight)
      }
      if (parent.scrollHeight > originalClientHeight) {
        // console.log('attention: scrollHeight > originalClientHeight')
        // console.log('originalClientWidth:' + originalClientWidth + ';originalClientHeight:' + originalClientHeight)
        // console.log('parent.scrollWidth:' + parent.scrollWidth + ';parent.scrollHeight:' + parent.scrollHeight)
        // console.log('parent.offsetWidth:' + parent.offsetWidth + ';parent.offsetHeight:' + parent.offsetHeight)
        zoom -= 0.2
        parent.style.fontSize = `${zoom}rem`
      }
    } while (zoom > 1 && parent.scrollHeight > originalClientHeight)
  }
}

function updateFigures (svgContainer: HTMLDivElement, zoom: number) {
  const svgDivs = svgContainer.querySelectorAll<SVGElement>('.mathalea2d')
  for (const svgDiv of svgDivs) {
    if (svgDiv.clientWidth > 0 && svgDiv instanceof SVGElement) {
      const figure = svgDiv
      const width = figure.getAttribute('width')
      const height = figure.getAttribute('height')
      if (!figure.dataset.widthInitiale && width != null) figure.dataset.widthInitiale = width
      if (!figure.dataset.heightInitiale && height != null) figure.dataset.heightInitiale = height
      figure.setAttribute('height', (Number(figure.dataset.heightInitiale) * zoom).toString())
      figure.setAttribute('width', (Number(figure.dataset.widthInitiale) * zoom).toString())

      // accorder la position des éléments dans la figure SVG
      const eltsInVariationTables = svgContainer.getElementsByClassName('divLatex') ?? []
      for (const elt of eltsInVariationTables) {
        const e = elt as HTMLDivElement
        const initialTop = Number(e.dataset.top) ?? 0
        const initialLeft = Number(e.dataset.left) ?? 0
        e.style.setProperty('top', (initialTop * zoom).toString() + 'px')
        e.style.setProperty('left', (initialLeft * zoom).toString() + 'px')
      }
    }
  }
}
