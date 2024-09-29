import { describe, test, expect, beforeEach } from 'vitest'
import ConstrctionsSymetrieCentralePoints from '../../src/exercices/5e/5G11-10'
import { Point } from '../../src/lib/2d/points'

describe('ConstrctionsSymetrieCentralePoints', () => {
  let exercice: ConstrctionsSymetrieCentralePoints

  beforeEach(() => {
    exercice = new ConstrctionsSymetrieCentralePoints()
  })

  test('should initialize with default values', () => {
    expect(exercice.nbQuestions).toBe(2)
    expect(exercice.spacingCorr).toBe(1)
    expect(exercice.besoinFormulaireNumerique).toEqual([
      "Type d'aide",
      4,
      'Quadrillages\nDemi-droites en pointillés\nMarques de compas\nAucune'
    ])
    expect(exercice.besoinFormulaire2Numerique).toEqual(['Nombre de points à construire (5 maxi)', 5])
    expect(exercice.sup).toBe(1)
    expect(exercice.sup2).toBe(3)
  })

  test('nouvelleVersion should generate correct questions and corrections', () => {
    exercice.nouvelleVersion(1)

    expect(exercice.listeQuestions.length).toBe(2)
    expect(exercice.listeCorrections.length).toBe(2)

    exercice.listeQuestions.forEach((question, index) => {
      expect(question).toContain('Placer')
      expect(question).toContain('symétrique')
    })
  })

  test('nouvelleVersion should generate different questions for different exercises', () => {
    exercice.nouvelleVersion(1)
    const questions1 = [...exercice.listeQuestions]
    const corrections1 = [...exercice.listeCorrections]

    exercice.nouvelleVersion(2)
    const questions2 = [...exercice.listeQuestions]
    const corrections2 = [...exercice.listeCorrections]

    expect(questions1).not.toEqual(questions2)
    expect(corrections1).not.toEqual(corrections2)
  })

  test('nouvelleVersion should generate valid points and labels', () => {
    exercice.nouvelleVersion(1)

    exercice.listeQuestions.forEach((question) => {
      const regex = /\$[A-Z]'\$/g
      const matches = question.match(regex)
      expect(matches).not.toBeNull()
      expect(matches!.length).toBeGreaterThan(0)
    })
  })

  test('nouvelleVersion should generate valid centers', () => {
    exercice.nouvelleVersion(1)

    exercice.centres.forEach(center => {
      expect(center).toBeInstanceOf(Point)
      expect(center.x).toBe(0)
      expect(center.y).toBe(0)
    })
  })
})
