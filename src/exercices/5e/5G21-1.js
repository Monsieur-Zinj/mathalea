import ConstructibiliteDesTriangles from './_Constructibilite_des_triangles.js'

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'AMCHybride'

export const titre = 'Justifier la construction des triangles via les longueurs'
export const dateDeModifImportante = '10/12/2023'

/**
 * Justifier la construction des triangles via les longueurs'
 * Mise à jour le 2021-01-25
 * @author Sébastien Lozano
 */
export const uuid = 'f789c'
export const ref = '5G21-1'
export const refs = {
  'fr-fr': ['5G21-1'],
  'fr-ch': []
}
export default function ConstructibiliteDesTrianglesLongueurs () {
  this.exo = '5G21-1'
  ConstructibiliteDesTriangles.call(this)
}
