import ConstructibiliteDesTriangles from './_Constructibilite_des_triangles.js'

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'AMCHybride'

export const titre = 'Justifier la construction des triangles via les angles'
export const dateDeModifImportante = '10/12/2023'

/**
 * Justifier la construction des triangles via les angles
 * @author Sébastien Lozano
 */
export const uuid = 'bcbe1'
export const ref = '5G31-1'
export const refs = {
  'fr-fr': ['5G31-1'],
  'fr-ch': []
}
export default function ConstructibiliteDesTrianglesAngles () {
  this.exo = '5G31-1'
  ConstructibiliteDesTriangles.call(this)
}
