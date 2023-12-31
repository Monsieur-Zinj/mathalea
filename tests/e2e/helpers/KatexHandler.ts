/**
 * Pilotage d'un span Katex dans le DOM
 * @class
 */
import type { Locator, Page } from 'playwright'
import type { Question } from './types'
import { clean } from './text'

export class KatexHandler {
  page: Page
  question: Question
  index: number
  locator: Locator | null
  /**
     *
     * @param {question} Question
     * @param {string} selector
     * @param {number} index
     * @param {Locator} has
     * @param {string} hasText
     */
  constructor (page: Page, question: Question, { selector, index, has, hasText }: { has?: Locator | undefined, hasText?: string, index?: number, selector?: string } = { selector: '' }) {
    this.question = question
    this.index = index ?? 0
    this.locator = null
    this.page = page
    if (selector == null) {
      selector = ''
    }
    // on cherche notre input dans le dom
    if (selector) selector += ' '
    selector += 'span.katex-mathml'
    if (has || hasText) {
      /**
             * Le conteneur de l'input
             * @type {Locator}
             */
      this.locator = this.question.locator.locator(selector, { has, hasText }).first()
    } else {
      this.locator = this.question.locator.locator(selector).nth(this.index)
    }
  }

  /**
     * Récupère les fractions du span katex
     * @return Promise<{ num: string, den: string }[]>
     */
  async getFraction () {
    if (this.locator != null) {
      const num = await this.locator.locator('mn').first().textContent()
      const den = await this.locator.locator('mn').nth(1).textContent()
      return { num, den }
    }
  }

  /**
   * Récupère les fractions du span katex
   * @return Promise<{ num: string, den: string }[]>
   */
  async getExpression () {
    if (this.locator != null) {
      return clean(await this.locator.innerText(), [])
    }
  }
}
