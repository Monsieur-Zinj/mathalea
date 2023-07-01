/**
 * Utilise pgfplots pour tracer la courbe représentative de f dans le repère avec -10 < x < 10 et -8 < y < 8
 *
 * @param string expression de fonction
 * @author Rémi Angot
 */

export function texGraphique (f, xmin = -5, xmax = 5, ymin = -5, ymax = 5) {
  return `
  \\pgfplotsset{width=10cm,
      compat=1.9,
      every axis/.append style={
                    axis x line=middle,    % put the x axis in the middle
                    axis y line=middle,    % put the y axis in the middle
                    xlabel={$x$},          % default put x on x-axis
                    ylabel={$y$},          % default put y on y-axis
                    label style={font=\\tiny},
                    tick label style={font=\\tiny},
                    xlabel style={above right},
            ylabel style={above right},
            grid = major,
            xtick distance=1,
            ytick distance=1,
                    }}

  \\begin{tikzpicture}
    \\begin{axis}[
        xmin = ${xmin}, xmax = ${xmax}, ymin = ${ymin}, ymax = ${ymax},
    ]
    \\addplot [
        ultra thick,
        blue,
        samples=100,
        domain=${xmin}:${xmax},
        ]{${f}};
    \\end{axis}
  \\end{tikzpicture}`
}
