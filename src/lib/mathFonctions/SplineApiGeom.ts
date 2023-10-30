import Point from 'apigeom/src/elements/points/Point'
import type Figure from 'apigeom/src/Figure'
import type { Spline } from './Spline'

class PointOnSpline extends Point {
  spline: Spline
  size?: number
  constructor (figure: Figure, { spline, x = 1, abscissa = false, ordinate = false, ...options }:
  { spline: Spline
    x?: number
    abscissa?: boolean
    ordinate?: boolean
    shape?: 'x' | 'o' | '' | '|'
    size?: number
    label?: string
    labelDx?: number
    labelDy?: number
    color?: string
    thickness?: number
    isChild?: boolean
    isFree?: boolean
    isVisible?: boolean
    id?: string }) {
    super(figure, { x, y: Number(spline.fonction(x)), ...options })
    this.type = 'PointOnGraph'
    this.spline = spline
  }

  get x (): number {
    return this._x
  }

  set x (x) {
    this._x = x
    this._y = Number(this.spline.fonction(x))
    this.update()
  }

  get y (): number {
    return Number(this.spline.fonction(this.x))
  }

  moveTo (x: number): void {
    if (Array.isArray(this.spline.x) && this.spline.n != null) {
      if (x > this.spline.x[0] && x < this.spline.x[this.spline.n - 1]) {
        this.x = x
      }
    }
    // y est en lecture seule
  }

  toJSON (): object {
    return {
      type: this.type,
      x: this.x,
      id: this.id,
      isChild: this.isChild,
      label: this.label,
      shape: this.shape,
      size: this.size,
      color: this.color,
      isDashed: this.isDashed
    }
  }
}

export default PointOnSpline
