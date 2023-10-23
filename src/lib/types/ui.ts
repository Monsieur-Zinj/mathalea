export interface BasicHeaderProps {
  title: string | undefined
  id: string
  indiceExercice: number
  indiceLastExercice: number
  interactifReady: boolean
}

export type HeaderProps = BasicHeaderProps &
{
  [key: string] : string | boolean | number
}
