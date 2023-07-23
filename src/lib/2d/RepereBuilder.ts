import { Repere } from './reperes.js'

/**
 * exemple : const repere = new RepereBuilder({xMin: -5, xMax:5, yMin: -3, yMax: 3}).setUniteX(1).setUniteY(2).buildStandard()
 */
export default class RepereBuilder {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  private xUnite: number
  private yUnite: number
  constructor ({ xMin, xMax, yMin, yMax }: {xMin:number,xMax:number,yMin:number,yMax:number} = {xMin: -10, xMax:10, yMin:-10,yMax:10}){
  this.xMin = xMin ?? -10
    this.xMax = xMax ?? 10
    this.yMin = yMin ?? -10
    this.yMax = yMax ?? 10
  }
  private build(){
    return new Repere({
      xMin: this.xMin,
      xMax: this.xMax,
      yMin: this.yMin,
      yMax: this.yMax,
      xUnite: this.xUnite,
      yUnite: this.yUnite
      }
    )
  }
  buildStandard(){
    this.xUnite = 1
    this.yUnite = 1
    return this.build()
  }
  buildScale(){
    return this.build()
  }
  setUniteX(u: number){
    this.xUnite=u
    return this
  }
  setUniteY(u: number){
    this.yUnite=u
    return this
  }
}
