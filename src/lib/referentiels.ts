export interface Feature {
  name: string
  isActive: boolean
  type: string
}

export interface AppTierce {
  uuid: string
  title: string
  presentation: string
  imgPath: string
}

export interface AppTierceGroup {
  rubrique: string
  liste: AppTierce[]
}

export interface ReferentielBase {
  uuid: string
  url: string
  tags: string[]
}

export interface ReferentielExercice extends ReferentielBase {
  id: string
  titre: string
  features: Feature[]
}

export interface ReferentielStatic extends ReferentielBase {
  png: string[]
  pngCor: string[]
}

export interface ReferentielExamen extends ReferentielStatic {
  mois: string
  annee: string
  lieu: string
  typeExercice: string
  numeroInitial: string
  urlcor: string
}

export interface ReferentielRessource extends ReferentielBase {
  id: string
  titre: string
}
