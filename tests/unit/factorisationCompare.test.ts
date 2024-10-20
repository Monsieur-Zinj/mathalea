import { describe, it, expect } from 'vitest'
import { factorisationCompare } from '../../src/lib/interactif/comparisonFunctions'

describe('factorisationCompare', () => {
  it('devrait retourner vrai pour des expressions correctement factorisées', () => {
    const result = factorisationCompare('(x - 2)(x + 2)', '(x+2)(x-2)')
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })
  it('devrait retourner faux pour des expressions non factorisées', () => {
    const result = factorisationCompare('x^2-4', '(x+2)(x-2)')
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('L\'expression n\'est pas factorisée')
  })
  it('devrait retourner faux pour des expressions incorrectement factorisées', () => {
    const result = factorisationCompare('(x-9)(x+9)', '(x - 3)(x + 3)')
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('On pouvait mettre $x-3$ en facteur')
  })

  it('devrait gérer les expressions avec des signes négatifs', () => {
    const result = factorisationCompare('-(2-x)(x+2)', '(x-2)(x+2)')
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })

  it('devrait retourner faux pour des expressions non factorisées', () => {
    const result = factorisationCompare('(x^2-2x)(x-3)', 'x(x-2)(x-3)')
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('L\'expression est insuffisamment factorisée')
  })

  it('devrait gérer les expressions avec des formats différents', () => {
    const result = factorisationCompare('3(x+2)(x+2)', '3(x+2)^2')
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })

  it('devrait retourner faux pour des expressions avec des signes incorrects', () => {
    const result = factorisationCompare('(x-2)(x+2)', '-(x - 2)(x + 2)')
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('Il y a un problème de signe')
  })

  it('devrait gérer les expressions avec des puissances', () => {
    const result = factorisationCompare('(x^2+4)(x+2)(x+2)', '(x^2+4)(x+2)^2')
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })

  it('devrait retourner vrai pour des expressions avec des carrés sous forme de produits', () => {
    const result = factorisationCompare('(x^2 - 4)(x + 2)(x^2 - 4)', '(x^2 - 4)^2(x+2)')
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })

  it('devrait gérer les expressions avec des formats différents dans le désordre', () => {
    const result = factorisationCompare('(x^2 + 2)(x^2 - 4)(x^2 + 2)(x^2 + 4)', '(x^2 + 4)(x^2 - 4)(x^2 + 2)^2')
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })

  it('devrait retourner faux pour des expressions avec des facteurs imbriqués non factorisés', () => {
    const result = factorisationCompare('(x^4-4)(x^4-9)', '(x^2 - 2)(x^2 + 2)(x^2 - 3)(x^2 + 3)')
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('L\'expression est insuffisamment factorisée')
  })

  it('devrait retourner faux pour des expressions avec des facteurs qui ne sont pas deux fois quand c\'est des carrés', () => {
    const result = factorisationCompare('3(c+4)', '3(c+4)^2')
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('Il manque des facteurs')
  })
})
