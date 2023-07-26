import ConstructibiliteDesTriangles from './_Constructibilite_des_triangles.js'

export const titre = 'Justifier la construction des triangles via les longueurs'

/**
 * Vocabulaire des triangles
 * 5G21-1
 * Mise à jour le 2021-01-25
 * @author Sébastien Lozano
 */
export const uuid = 'f789c'
export const ref = '5G21-1'
export default function ConstructibiliteDesTrianglesLongueurs () {
  this.exo = '5G21-1'
  this.titre = titre
  ConstructibiliteDesTriangles.call(this)
}
