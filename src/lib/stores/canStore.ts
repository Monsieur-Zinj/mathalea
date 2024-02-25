import { writable } from 'svelte/store'
import type { CanOptions } from '../types/can'
export const canOptions = writable<CanOptions>(
  {
    durationInMinutes: 4,
    subTitle: '2024',
    isChoosen: false,
    solutionsAccess: false,
    solutionsMode: 'gathered',
    isInteractive: false,
    remainingTimeInSeconds: 0,
    questionGetAnswer: []
  }
)
