import ExternalApp from './_ExternalApp'

export const uuid = 'permisLitteralReduire'
export const titre = 'Permis Littéral - Réduire une expression'

class permisLitteralRed extends ExternalApp {
  constructor () {
    super('https://mathix.org/permis_litteral_red/index.html?mathalea=1')
  }
}

export default permisLitteralRed
