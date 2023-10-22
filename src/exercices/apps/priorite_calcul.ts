import ExternalApp from './_ExternalApp'

export const uuid = 'prioritesOperatoires'
export const titre = 'Priorités opératoires'

class prioritesOperatoires extends ExternalApp {
  constructor () {
    super('https://www.mathix.org/priorite_calcul/?mathalea=1')
  }
}

export default prioritesOperatoires
