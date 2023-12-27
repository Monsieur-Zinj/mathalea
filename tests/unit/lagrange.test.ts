import { expect, test } from 'vitest'
import { randint } from 'src/modules/outils'
import { rangeMinMax } from 'src/lib/outils/nombres'
import { interpolationDeLagrange } from 'src/lib/mathFonctions/outilsMaths'

test('Interpolation de Lagrange', () => {
  const x: number[] = rangeMinMax(randint(-5, -2), randint(1, 3))
  const y: number[] = []
  for (let i = 0; i < x.length; i++) {
    y.push(randint(-5, 5))
  }
  const points: {x:number, y:number}[] = []
  for (let i = 0; i < x.length; i++) {
    points.push({ x: x[i], y: y[i] })
  }
  const p = interpolationDeLagrange(points)
  expect(p.deg === x.length - 1).toBe(true)
  for (let i = 0; i < x.length; i++) {
    expect(p.image(x[i]).toFixed(8) === y[i].toFixed(8)).toBe(true)
  }
})
