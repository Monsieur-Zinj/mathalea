import Figure from 'apigeom'
import GraduatedLine from 'apigeom/src/elements/grid/GraduatedLine'
import { arrondi } from '../outils/nombres'

export function apigeomGraduatedLine ({ xMin, xMax, scale = 1, points }: {
    xMin: number,
    xMax: number,
    scale?: number,
    points?: Array<{ x: number, label: string }>
  }): { figure: Figure, latex: string} {
  //  const width = 900
  const width = 650
  const height = 80
  const figure = new Figure({ xMin: xMin - 0.2 / scale, yMin: -1.5, width, height, dy: 10, dx: arrondi(1 / (10 * scale), 6), xScale: 3 * scale, snapGrid: true })
  figure.setToolbar({ tools: ['POINT', 'DRAG', 'REMOVE'], position: 'top' })

  const d = new GraduatedLine(figure, { min: xMin, max: xMax, step: arrondi(1 / scale, 6), stepBis: arrondi(1 / (10 * scale), 6) })
  d.draw()
  let latex = `\n\\bigskip
    \\begin{tikzpicture}[x=2.2mm]
    \\draw[-{Latex[round]},thick] (0,0) -- (72,0);
    \\foreach \\x in {0,1,...,70} \\draw[thick] ([yshift=-0.8mm]\\x,0) -- ([yshift=0.8mm]\\x,0);
    \\foreach \\x [count=\\i from 0] in {0,10,...,70} \\draw[ultra thick] ([yshift=-1.5mm]\\x,0) coordinate (a\\i) -- ([yshift=1.5mm]\\x,0);
    \\foreach \\x [count=\\i from 0] in {${xMin},${arrondi(xMin + 1 / scale)},${arrondi(xMin + 2 / scale)},${arrondi(xMin + 3 / scale)},${arrondi(xMin + 4 / scale)},${arrondi(xMin + 5 / scale)},${arrondi(xMin + 6 / scale)},${arrondi(xMin + 7 / scale)}} {
      \\node[below=2mm of a\\i,inner sep=0pt,font=\\small] {$\\num{\\x}$};
    }`
  if (points !== undefined) {
    const xA = arrondi((points[0].x - xMin) * scale * 10)
    const xB = arrondi((points[1].x - xMin) * scale * 10)
    const xC = arrondi((points[2].x - xMin) * scale * 10)
    const labelA = points[0].label
    const labelB = points[1].label
    const labelC = points[2].label
    latex += `\n\\tkzText[above=2mm](${xA},0){${labelA}}
      \n\\tkzText[above=2mm](${xB},0){${labelB}}
      \n\\tkzText[above=2mm](${xC},0){${labelC}}
      \n\\tkzDrawPoint[shape=cross out, size=5pt, thick](${xA},0)
      \n\\tkzDrawPoint[shape=cross out, size=5pt, thick](${xB},0)
      \n\\tkzDrawPoint[shape=cross out, size=5pt, thick](${xC},0)`
  }
  latex += '\n\\end{tikzpicture}'

  return { figure, latex }
}
