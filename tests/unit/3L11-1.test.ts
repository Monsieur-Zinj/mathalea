import { describe, it, expect, beforeEach } from 'vitest'
import DoubleDistributivite from '../../src/exercices/3e/3L11-1'
import { context } from '../../src/modules/context'

describe('DoubleDistributivite', () => {
  let exercice: any

  beforeEach(() => {
    exercice = new DoubleDistributivite()
  })

  it('devrait initialiser avec les valeurs par défaut correctes', () => {
    expect(exercice.nbCols).toBe(1)
    expect(exercice.nbColsCorr).toBe(1)
    expect(exercice.spacing).toBe(context.isHtml ? 3 : 2)
    expect(exercice.spacingCorr).toBe(context.isHtml ? 3 : 2)
    expect(exercice.nbQuestions).toBe(5)
    expect(exercice.sup).toBe(1)
    expect(exercice.sup2).toBe(true)
    expect(exercice.sup3).toBe(false)
    expect(exercice.tailleDiaporama).toBe(3)
    expect(exercice.listeAvecNumerotation).toBe(false)
  })

  it('devrait générer le bon nombre de questions et de corrections', () => {
    exercice.nouvelleVersion()
    expect(exercice.listeQuestions.length).toBe(5)
    expect(exercice.listeCorrections.length).toBe(5)
  })

  it('devrait générer des questions avec le bon format', () => {
    exercice.nouvelleVersion()
    exercice.listeQuestions.forEach((question: string, index: number) => {
      expect(question).toContain(`$${String.fromCharCode(65 + index)} =`)
    })
  })

  it('devrait générer des corrections avec le bon format', () => {
    exercice.nouvelleVersion()
    exercice.listeCorrections.forEach((correction: string, index: number) => {
      expect(correction).toContain(`$${String.fromCharCode(65 + index)} =`)
    })
  })
})
