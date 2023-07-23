import {Repere} from './reperes.js'

/**
 * exemple : const repere = new RepereBuilder({xMin: -5, xMax:5, yMin: -3, yMax: 3}).setUniteX(1).setUniteY(2).buildCustom()
 */
export default class RepereBuilder {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
    private yThickDistance: number
    private xThickDistance: number
    private xThickMax: number
    private xThickMin: number
    private yThickMax: number
    private yThickMin: number
    private xUnite: number
    private yUnite: number
    private grilleX: boolean
    private grilleXDistance: number
    private grilleXMin: number
    private grilleXMax: number
    private grilleY: boolean
    private grilleYDistance: number
    private grilleYMin: number
    private grilleYMax: number
    private grilleSecondaireX: boolean
    private grilleSecondaireXDistance: number
    private grilleSecondaireXMin: number
    private grilleSecondaireXMax: number
    private grilleSecondaireY: boolean
    private grilleSecondaireYDistance: number
    private grilleSecondaireYMin: number
    private grilleSecondaireYMax: number
    private axesEpaisseur: number
    private thickEpaisseur: number
    private xLabelMax: number
    private xLabelMin: number
    private xLabelDistance: number
    private yLabelMax: number
    private yLabelMin: number
    private yLabelDistance: number

    /**
     * Le constructeur de l'objet RepereBuilder. Les paramètres à fournir sont minimales. Le reste est à configurer via les setters et l'instanciation du repère se fait à travers les builders exposés.
     * @param {number} xMin
     * @param {number} xMax
     * @param {number} yMin
     * @param {number} yMax
     */
    constructor({xMin, xMax, yMin, yMax}: { xMin: number, xMax: number, yMin: number, yMax: number } = {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10
    }) {
        this.xMin = xMin ?? -10
        this.xMax = xMax ?? 10
        this.yMin = yMin ?? -10
        this.yMax = yMax ?? 10
        this.grilleX = false
        this.grilleY = false
        this.grilleSecondaireX = false
        this.grilleSecondaireY = false
        this.axesEpaisseur = 1
        this.thickEpaisseur = 1.2
    }

    /**
     * méthode qui retourne l'objet Repere construit est invoquée par les méthodes buildCustom() et buildStandard() qui elles sont exposées.
     * @private
     */
    private build() {
        return new Repere({
                xMin: this.xMin,
                xMax: this.xMax,
                yMin: this.yMin,
                yMax: this.yMax,
                xUnite: this.xUnite,
                yUnite: this.yUnite,
                xThickDistance: this.xThickDistance,
                yThickDistance: this.yThickDistance,
                grilleX: this.grilleX,
                grilleXMin: this.grilleXMin,
                grilleXMax: this.grilleXMax,
                grilleXDistance: this.grilleXDistance,
                grilleY: this.grilleY,
                grilleYMin: this.grilleYMin,
                grilleYMax: this.grilleYMax,
                grilleYDistance: this.grilleYDistance,
                grilleSecondaireX: this.grilleSecondaireX,
                grilleSecondaireXMin: this.grilleSecondaireXMin,
                grilleSecondaireXMax: this.grilleSecondaireXMax,
                grilleSecondaireXDistance: this.grilleSecondaireXDistance,
                grilleSecondaireY: this.grilleSecondaireY,
                grilleSecondaireYMin: this.grilleSecondaireYMin,
                grilleSecondaireYMax: this.grilleSecondaireYMax,
                grilleSecondaireYDistance: this.grilleSecondaireYDistance,
                axesEpaisseur: this.axesEpaisseur,
                thickEpaisseur: this.thickEpaisseur,
                xLabelMin: this.xLabelMin,
                xLabelMax: this.xLabelMax,
                xLabelDistance: this.xLabelDistance,
                yLabelMin: this.yLabelMin,
                yLabelMax: this.yLabelMax,
                yLabelDistance: this.yLabelDistance
            }
        )
    }

    /**
     * Un build avec des axes à coordonnées entières
     */
    buildStandard() {
        this.xUnite = 1
        this.yUnite = 1
        this.xThickDistance = 1
        this.yThickDistance = 1
        return this.build()
    }

    /**
     * Un build libre pour faire ce qu'on veut
     */
    buildCustom() {
        return this.build()
    }

    /**
     * méthode pour fixer l'échelle en x
     * @param {number} u l'échelle (1 par défaut)
     */
    setUniteX(u: number) {
        this.xUnite = u
        return this
    }

    /**
     * méthode pour fixer l'échelle en y
     * @param {number} u l'échelle (1 par défaut)
     */
    setUniteY(u: number) {
        this.yUnite = u
        return this
    }

    /**
     * méthode pour paramétrer les graduations sur l'axe des abscisses
     * @param {number} xMax la première
     * @param {number} xMin la dernière
     * @param {number} dx la distance entre deux graduations
     */
    setThickX({xMax, xMin, dx}) {
        this.xThickDistance = dx
        this.xThickMin = xMin
        this.xThickMax = xMax
        return this
    }

    /**
     * méthode pour paramétrer les graduations sur l'axe des ordonnées
     * @param {number} yMax la première
     * @param {number} yMin la dernière
     * @param {number} dy la distance entre deux graduations
     */
    setThickY({yMax, yMin, dy}) {
        this.yThickDistance = dy
        this.yThickMin = yMin
        this.yThickMax = yMax
        return this
    }

    /**
     * méthode pour paramétrer la grille principale
     * @param {{dx: number, xMin: number, xMax: number}} grilleX
     * @param {{dy: number, yMin: number, yMax: number}} grilleY
     */
    setGrille({grilleX, grilleY}: { grilleX: { dx, xMin, xMax }, grilleY: { dy, yMin, yMax } }) {
        if (grilleX) {
            this.grilleX = true
            this.grilleXDistance = grilleX.dx ?? 1
            this.grilleXMin = grilleX.xMin ?? this.xMin
            this.grilleXMax = grilleX.xMax ?? this.xMax
        } else this.grilleX = false
        if (grilleY) {
            this.grilleY = true
            this.grilleYDistance = grilleY.dy ?? 1
            this.grilleYMin = grilleY.yMin ?? this.yMin
            this.grilleYMax = grilleY.yMax ?? this.yMax
        } else this.grilleY = false
        return this
    }

    /**
     * méthode pour paramétrer la grille secondaire
     * @param {{dx: number, xMin: number, xMax: number}} grilleX
     * @param {{dy: number, yMin: number, yMax: number}} grilleY
     */
    setGrilleSecondaire({grilleX, grilleY}: { grilleX: { dx, xMin, xMax }, grilleY: { dy, yMin, yMax } }) {
        if (grilleX) {
            this.grilleSecondaireX = true
            this.grilleSecondaireXDistance = grilleX.dx ?? 1
            this.grilleSecondaireXMin = grilleX.xMin ?? this.xMin
            this.grilleSecondaireXMax = grilleX.xMax ?? this.xMax
        } else this.grilleSecondaireX = false
        if (grilleY) {
            this.grilleSecondaireY = true
            this.grilleSecondaireYDistance = grilleY.dy ?? 1
            this.grilleSecondaireYMin = grilleY.yMin ?? this.yMin
            this.grilleSecondaireYMax = grilleY.yMax ?? this.yMax
        } else this.grilleSecondaireY = false
        return this
    }

    /**
     * méthode pour paramétrer les labels sur l'axe des abscisses
     * @param {number} dx distance entre deux labels
     * @param {number} xMin le premier
     * @param {number} xMax le dernier
     */
    setLabelX({dx, xMin, xMax}) {
        this.xLabelMin = xMin
        this.xLabelMax = xMax
        this.xLabelDistance = dx
        return this
    }

    /**
     * méthode pour paramétrer les labels sur l'axe des ordonnées
     * @param {number} dy distance entre deux labels
     * @param {number} yMin le premier
     * @param {number} yMax le dernier
     */
    setLabelY({dy, yMin, yMax}) {
        this.yLabelMin = yMin
        this.yLabelMax = yMax
        this.yLabelDistance = dy
        return this
    }
}
