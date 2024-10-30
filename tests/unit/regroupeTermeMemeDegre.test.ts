import { describe, it, expect } from 'vitest'
import { regroupeTermesMemeDegre } from '../../src/lib/mathFonctions/outilsMaths'

describe('regroupeTermesMemeDegre', () => {
  it('devrait regrouper correctement les termes de même degré', () => {
    const exp = '3x^2 + 2x^2 - x + 4 - 5x + 7x^3 - 2x^3 + 6'
    const options = { couleurs: ['rouge', 'bleu', 'vert', 'noir'], isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(7x^3-2x^3)+(3x^2+2x^2)+(-x-5x)+(4+6)')
  })

  it('devrait regrouper les termes de même degré pour un polynôme avec des coefficients nuls', () => {
    const exp = '3x^2+0x+1'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(3x^2)+(0x)+(1)')
  })

  it('devrait regrouper les termes de même degré pour un polynôme avec des coefficients non entiers', () => {
    const exp = '3.5x^2+2.1x+1.2'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(3.5x^2)+(2.1x)+(1.2)')
  })

  it('devrait regrouper les termes de même degré pour un polynôme avec des termes mixtes', () => {
    const exp = '3x^2+2x-1+x^2-x+2'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(3x^2+x^2)+(2x-x)+(-1+2)')
  })

  it('devrait gérer les expressions avec uniquement des constantes', () => {
    const exp = '4 + 5 - 3 + 2'
    const options = { couleurs: ['rouge', 'bleu', 'vert', 'noir'], isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(4+5-3+2)')
  })

  it('devrait gérer les expressions sans termes', () => {
    const exp = ''
    const options = { couleurs: ['rouge', 'bleu', 'vert', 'noir'], isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('')
  })

  it('devrait appliquer des couleurs si isColored est vrai', () => {
    const exp = 'x^2 + x + 1'
    const options = { couleurs: ['rouge', 'bleu', 'vert', 'noir'], isColored: true }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('({\\color{rouge}\\boldsymbol{x^2}})+({\\color{bleu}\\boldsymbol{x}})+({\\color{vert}\\boldsymbol{1}})')
  })

  it('devrait regrouper les termes de même degré pour un polynôme simple', () => {
    const exp = '3x^2 + 2x + 1'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(3x^2)+(2x)+(1)')
  })

  it('devrait regrouper les termes de même degré pour un polynôme avec des coefficients négatifs', () => {
    const exp = '-3x^2-2x-1'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(-3x^2)+(-2x)+(-1)')
  })

  it('devrait regrouper les termes de même degré pour un polynôme avec des termes fractionnaires', () => {
    const exp = '\\dfrac{1}{2}x^2+\\dfrac{1}{3}x+\\dfrac{1}{4}+\\dfrac{1}{2}+\\dfrac{1}{3}x^2+\\dfrac{1}{2}x'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(\\frac{1}{2}x^2+\\frac{1}{3}x^2)+(\\frac{1}{3}x+\\frac{1}{4}+\\frac{1}{2}+\\frac{1}{2}x)')
  })

  it('devrait regrouper les termes de même degré pour un polynôme avec des termes constants négatifs', () => {
    const exp = '3x^2 + 2x - 1 - 4'
    const options = { isColored: false }
    const result = regroupeTermesMemeDegre(exp, options)
    expect(result).toBe('(3x^2)+(2x)+(-1-4)')
  })
})
