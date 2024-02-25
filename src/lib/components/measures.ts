let canvas: HTMLCanvasElement

export function remToPixels (rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   *
   * @param {String} text The text to be rendered.
   * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   *
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
export function getTextWidth (text: string, font: string, factor: number = 1): number {
  // re-use canvas object for better performance
  if (canvas == null) {
    canvas = document.createElement('canvas')
  }
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas context is null')
  }
  context.font = font
  const metrics: TextMetrics = context.measureText(text)
  return metrics.width * factor
}
export function getCssStyle (element: HTMLElement, prop: string) {
  return window.getComputedStyle(element, null).getPropertyValue(prop)
}
export function getCanvasFontDetails (el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
  const fontSize = getCssStyle(el, 'font-size') || '16px'
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman'

  return {
    weigth: `${fontWeight}`,
    size: `${fontSize}`,
    family: `${fontFamily}`
  }
}
export function getCanvasFont (el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
  const fontSize = getCssStyle(el, 'font-size') || '16px'
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman'

  return `${fontWeight} ${fontSize} ${fontFamily}`
}
/**
   * Détecter le type de machine sur lequel le site est utilisé
   * ([Source](https://attacomsian.com/blog/javascript-detect-mobile-device))
   * @return {('mobile'|'tablet'|'desktop')} nom du type de machine
   * @author sylvain
   */
export const deviceType = () => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}
/**
 * Change la taille de tous les divs passés en paramètres.
 *
 * On teste l'existence des attributs directs `width` et`height`.
 *
 * - S'ils existent, on sauvegarde leurs valeurs initiales dans le data-set (si besoin)
 *  et on applique le facteur d'échelle
 * - S'ils n'existent pas, on travaillent avec le style directement
 * (`width` et `height` peuvent avoir des unités différentes).
 * @param {HTMLOrSVGElement[]} tags Liste des divs à inspecter et changer
 * @param {number} factor facteur d'agrandissement par rapport à la taille initiale
 */
export const resizeTags = (tags: HTMLElement[], factor:number = 1) => {
  let widthUnit, heightUnit: string
  for (const tag of tags) {
    const widthAttributeExists: boolean = tag.hasAttribute('width')
    const heightAttributeExists: boolean = tag.hasAttribute('height')
    if (tag.hasAttribute('data-width') === false) {
      let originalWidth: string|null
      if (widthAttributeExists) {
        originalWidth = tag.getAttribute('width')
      } else {
        const width = tag.style.width
        const units = width.match(/\D/g) ?? []
        widthUnit = units.join('')
        originalWidth = String(parseFloat(tag.style.width.replace(widthUnit, '')))
      }
      tag.dataset.width = originalWidth ?? '50'
    }
    if (!widthAttributeExists && tag.hasAttribute('data-width-unit') === false) {
      tag.dataset.widthUnit = widthUnit
    }
    if (tag.hasAttribute('data-height') === false) {
      let originalHeight:string|null
      if (heightAttributeExists) {
        originalHeight = tag.getAttribute('height')
        heightUnit = 'px'
      } else {
        const height = tag.style.height
        const units = height.match(/\D/g) ?? []
        heightUnit = units.join('')
        originalHeight = String(parseFloat(tag.style.height.replace(heightUnit, '')))
      }
      tag.dataset.height = originalHeight ?? '30'
    } else {
      heightUnit = 'px'
    }

    if (!heightAttributeExists && tag.hasAttribute('data-height-unit') === false) {
      tag.dataset.heightUnit = heightUnit
    }
    const w = Number(tag.getAttribute('data-width')) * factor
    const h = Number(tag.getAttribute('data-height')) * factor
    if (widthAttributeExists && heightAttributeExists) {
      tag.setAttribute('width', String(w))
      tag.setAttribute('height', String(h))
    } else { tag.setAttribute('style', 'width:' + String(w) + tag.dataset.widthUnit + '; height:' + String(h) + tag.dataset.heightUnit + ';') }
  }
}
