import type Trinome from '../../modules/Trinome'

export class Operande {
  value: string | number
  constructor (value: string | number) {
    this.value = value
  }

  get string (): string {
    return this.value.toString()
  }

  toString ({ parentheses }: {parentheses?: boolean} = {}): string {
    if (parentheses) {
      return `(${this.string})`
    }
    return this.string
  }
}

export class ExponentialOperande extends Operande {
  type: 'exponential'
  polynome: Trinome
  k: number
  constructor ({ polynome, k = 1 }: { polynome: Trinome, k?: number }) {
    super(polynome.toString())
    this.type = 'exponential'
    this.polynome = polynome
    this.k = k
  }

  get string (): string {
    if (this.polynome.toString() === '0') {
      return String(this.k)
    } else if (this.k === 0) {
      return '0'
    }
    const kString = handle1(this.k)
    return `${kString}e^{${this.polynome.toString()}}`
  }
}

abstract class Calcul {
  abstract string: string

  toString ({ parentheses }: { parentheses?: boolean} = {}): string {
    if (parentheses) {
      return `(${this.string})`
    }
    return this.string
  }
}

export class Add extends Calcul {
  type: 'add'
  operande1: Operande | Calcul | string
  operande2: Operande | Calcul | string
  constructor (operande1: Operande | Calcul | string, operande2: Operande | Calcul | string) {
    super()
    this.type = 'add'
    this.operande1 = operande1
    this.operande2 = operande2
  }

  get result () {
    if (this.operande1 instanceof ExponentialOperande && this.operande2 instanceof ExponentialOperande) {
      if (this.operande1.polynome.isEqual(this.operande2.polynome)) {
        return new ExponentialOperande({ polynome: this.operande1.polynome, k: this.operande1.k + this.operande2.k })
      }
    }
    return this
  }

  get string (): string {
    return `${this.operande1.toString()} + ${this.operande2.toString()}`
  }
}

export class Sub extends Calcul {
  type: 'sub'
  operande1: Operande | Calcul | string
  operande2: Operande | Calcul | string
  constructor (operande1: Operande | Calcul, operande2: Operande | Calcul) {
    super()
    this.type = 'sub'
    this.operande1 = operande1
    this.operande2 = operande2
  }

  get string (): string {
    return `${this.operande1.toString()} - ${this.operande2.toString()}`
  }

  get result () {
    if (this.operande1 instanceof ExponentialOperande && this.operande2 instanceof ExponentialOperande) {
      if (this.operande1.polynome.isEqual(this.operande2.polynome)) {
        return new ExponentialOperande({ polynome: this.operande1.polynome, k: this.operande1.k - this.operande2.k })
      }
    }
    return this
  }
}

export class Mul extends Calcul {
  type: 'mul'
  operande1: Operande | Calcul | string
  operande2: Operande | Calcul | string
  constructor (operande1: Operande | Calcul, operande2: Operande | Calcul) {
    super()
    this.type = 'mul'
    this.operande1 = operande1
    this.operande2 = operande2
  }

  get step (): string {
    if (this.operande1 instanceof ExponentialOperande && this.operande2 instanceof ExponentialOperande) {
      if (this.operande1.k === 0 || this.operande2.k === 0) {
        return ''
      }
      const kString = handle1(this.operande1.k * this.operande2.k)
      return `${kString}e^{${this.operande1.polynome.toString()} + ${this.operande2.polynome.toString()}}`
    }
    return ''
  }

  get result () {
    if (this.operande1 instanceof ExponentialOperande && this.operande2 instanceof ExponentialOperande) {
      return new ExponentialOperande({ polynome: this.operande1.polynome.add(this.operande2.polynome), k: this.operande1.k * this.operande2.k })
    }
    return this
  }

  get string (): string {
    const operande1HasParentheses = this.operande1 instanceof Add || this.operande1 instanceof Sub
    const operande2HasParentheses = this.operande2 instanceof Add || this.operande2 instanceof Sub || this.operande2.toString()[0] === '-'
    return `${this.operande1.toString({ parentheses: operande1HasParentheses })} \\times ${this.operande2.toString({ parentheses: operande2HasParentheses })}`
  }
}

export class Frac extends Calcul {
  type: 'frac'
  num: Operande | Calcul | string
  den: Operande | Calcul | string
  constructor (num: Operande | Calcul | string, den: Operande | Calcul | string) {
    super()
    this.type = 'frac'
    this.num = num
    this.den = den
  }

  get step (): string {
    if (this.num instanceof ExponentialOperande && this.den instanceof ExponentialOperande) {
      return `${handle1(this.num.k / this.den.k)}e^{${this.num.polynome.toString()} - ${this.den.polynome.toString({ parentheses: true })}}`
    }
    return ''
  }

  get result () {
    if (this.num instanceof ExponentialOperande && this.den instanceof ExponentialOperande) {
      return new ExponentialOperande({ polynome: this.num.polynome.sub(this.den.polynome), k: this.num.k / this.den.k })
    }
    return this
  }

  get string (): string {
    return `\\dfrac{${this.num.toString()}}{${this.den.toString()}}`
  }
}

export class Pow extends Calcul {
  type: 'pow'
  operande: Operande | Calcul | string
  exp: number
  constructor (operande: Operande | Calcul, exp: number) {
    super()
    this.type = 'pow'
    this.operande = operande
    this.exp = exp
  }

  get string (): string {
    return `${this.operande.toString({ parentheses: true })}^{${this.exp.toString()}}`
  }

  get step (): string {
    if (this.operande instanceof ExponentialOperande) {
      if (this.exp === 0 || this.operande.k === 0) {
        return ''
      }
      const kString = handle1(this.operande.k ** this.exp)
      return `${kString}e^{${this.operande.polynome.toString({ parentheses: true })} \\times ${this.exp}}`
    }
    return ''
  }

  get result () {
    if (this.operande instanceof ExponentialOperande) {
      return new ExponentialOperande({ polynome: this.operande.polynome.mul(this.exp), k: this.operande.k ** this.exp })
    }
    return this
  }
}

/*
* Quand mettre des parenthèses ?
*
* Pour une addition ou une soustraction :
*   - Jamais pour l'opérande 1
*   - Pour l'opérande 2 si c'est une addition, une soustraction ou un nombre négatif ou un positif avec le signe devant
*
* Pour une multiplication :
*  - Pour l'opérande 1 si c'est une addition ou une soustraction
*  - Pour l'opérande 2 si c'est une addition, une soustraction ou un nombre négatif ou un positif avec le signe devant
*
* */

function handle1 (k: number) {
  if (k === 1) {
    return ''
  } else if (k === -1) {
    return '-'
  }
  return String(k)
}
