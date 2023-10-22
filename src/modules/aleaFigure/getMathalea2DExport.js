import { arcPointPointAngle, cercle } from '../../lib/2d/cercle.js'
import { texteSurSegment } from '../../lib/2d/codages.js'
import { point } from '../../lib/2d/points.js'
import { polygone } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { GVPolygon, GVAngle, GVPoint, GVLine, GVSegment, GVCircle } from './elements.js'
import { mathalea2d } from '../2dGeneralites.js'
export function getMathalea2DExport (graphic /** GVGraphicView */) {
  if (graphic.allowResize) graphic.resize()
  const scaleppc = 20 / (graphic.ppc ?? 20)
  const clip = { xmin: graphic.xmin - scaleppc, xmax: graphic.xmax + scaleppc, ymin: graphic.ymin - scaleppc, ymax: graphic.ymax + scaleppc }

  // On ajoute tous les éléments
  const objs = []

  if (graphic.clipVisible) {
    const drawClip = polygone(
      point(clip.xmin, clip.ymin, '', 'above'),
      point(clip.xmax, clip.ymin, '', 'above'),
      point(clip.xmax, clip.ymax, '', 'above'),
      point(clip.xmin, clip.ymax, '', 'above')
    )
    if (drawClip != null) objs.push(drawClip)
  }

  for (const obj of graphic.geometricExport.filter(x => x.visible)) {
    if (obj instanceof GVPoint) {
      if (obj.dot != null) objs.push(obj.dot)
      if (obj.label) {
        const label = obj.showName(scaleppc)
        if (label != null) objs.push(label)
      }
    } else if (obj instanceof GVLine && !(obj instanceof GVSegment)) {
      // objs.push(droite(obj.a, obj.b, -obj.c))
      const points = graphic.getExtremPointGraphicLine(obj)
      if (points != null && Array.isArray(points)) objs.push(segment(points[0], points[1], obj.color ?? 'black'))
    } else if (obj instanceof GVSegment) {
      if (obj.A != null && obj.B != null) {
        objs.push(segment(obj.A, obj.B, obj.color ?? 'black'))
      }
      if (obj.label) {
        const label = obj.showLabel(scaleppc)
        if (label != null) objs.push()
      }
      if (obj.text !== '') {
        if (obj.A.M2D != null && obj.B.M2D != null) {
          const points = obj.direct ? [obj.A.M2D, obj.B.M2D] : [obj.B.M2D, obj.A.M2D]
          objs.push(texteSurSegment(obj.text, points[0], points[1], obj.textColor ?? 'black', 0.5 * scaleppc))
        }
      }
    } else if (obj instanceof GVCircle) {
      if (obj.A.M2D != null && obj.r > 0) {
        objs.push(cercle(obj.A.M2D, obj.r))
      }
    } else if (obj instanceof GVAngle) {
      if (Math.abs(obj.angle).toFixed(13) === (Math.PI / 2).toFixed(13) && obj.right) {
        const P1 = obj.A
        const P3 = obj.C
        const S = obj.B
        if (P1 instanceof GVPoint && P3 instanceof GVPoint && S instanceof GVPoint) {
          const v1 = P1.sub(S).getVector().getNormed().multiply(scaleppc * 0.7)
          const v3 = P3.sub(S).getVector().getNormed().multiply(scaleppc * 0.7)
          const P = S.add(v1.add(v3)) // .add(corr)
          P.showDot()
          objs.push(...graphic.addSidesPolygon(S, S.add(v1), P, S.add(v3)).map(x => segment(x.A, x.B, obj.color)))
        }
      } else if (obj instanceof GVPolygon) {
        if (obj.showLabels) {
          obj.vertices.forEach(P => {
            if (P instanceof GVPoint) {
              objs.push(P.showName(scaleppc))
            }
          })
        } /*
        else {
        }
        */
      } else {
        obj.scale(scaleppc)
        if (obj.A.M2D != null && obj.C.M2D != null) {
          const extrems = obj.direct ? [obj.A.M2D, obj.C.M2D] : [obj.C.M2D, obj.A.M2D]
          objs.push(arcPointPointAngle(...extrems, obj.angle / Math.PI * 180, obj.fillColor !== 'none' ? obj.rayon : true, obj.fillColor ?? 'none', obj.color ?? 'black', obj.fillOpacity ?? 0))
        }
      }
    } else {
      if (obj != null) objs.push(obj)
    }
  }
  for (const obj of graphic.grid) {
    const points = graphic.getExtremPointGraphicLine(obj)
    if (points !== undefined) objs.push(segment(...points, obj.color ?? 'black'))
  }
  for (const obj of graphic.axes) {
    const points = graphic.getExtremPointGraphicLine(obj)
    if (Array.isArray(points) && points.length >= 2) {
      const arrow = segment(...points, obj.color ?? 'black')
      arrow.styleExtremites = '->'
      objs.push(arrow)
    }
  }
  return mathalea2d(Object.assign({}, { mainlevee: false, pixelsParCm: graphic.ppc, scale: graphic.scale * 0.7 }, clip), objs)
}
