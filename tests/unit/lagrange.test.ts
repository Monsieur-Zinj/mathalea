import { expect, test } from 'vitest'
import { rangeMinMax } from '../../src/lib/outils/nombres'
import { interpolationDeLagrange } from '../../src/lib/mathFonctions/outilsMaths'
import { randint } from '../../src/modules/outils'

test('Interpolation de Lagrange', () => {
  const x: number[] = rangeMinMax(randint(-4, -2), randint(1, 3))
  const y: number[] = []
  for (let i = 0; i < x.length; i++) {
    y.push(randint(-5, 5, y))
  }
  const points: {x:number, y:number}[] = []
  for (let i = 0; i < x.length; i++) {
    points.push({ x: x[i], y: y[i] })
  }
  const p = interpolationDeLagrange(points)
  expect(p.deg === x.length - 1).toBe(true)
  for (let i = 0; i < x.length; i++) {
    console.log(p.image(x[i]).toFixed(15), y[i].toFixed(15))
    expect(Math.abs(p.image(x[i]).toFixed(7) - y[i]) < 1e-8).toBe(true)
  }
})
