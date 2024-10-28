import { describe, it, expect } from 'vitest'
import { fonctionComparaison } from '../../src/lib/interactif/comparisonFunctions'

describe('fonctionComparaison', () => {
  it('Doit retourner true for si saisie et answer sont identiques', () => {
    const result = fonctionComparaison('test', 'test', { texteAvecCasse: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('3\\times2', '6', {})
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('\\sqrt{36}', '6', {})
    expect(result3.isOk).toBe(true)
    const result4 = fonctionComparaison('2\\times (3^2-\\dfrac{24}{4})', '6', {})
    expect(result4.isOk).toBe(true)
    const result5 = fonctionComparaison('5+\\cos(2\\pi)', '6', {})
    expect(result5.isOk).toBe(true)
    // @fixme: ça ne devrait pas être false (JCL)
    // const result6 = fonctionComparaison('[-2-(6-2)]', '-6', {})
    // expect(result6.isOk).toBe(true)
  })

  it('doit retourner false si saisie et answer sont différents', () => {
    const result = fonctionComparaison('2^{-30}-2^{-31}', '0', {}) // On teste les calculs très petits différents de 0
    expect(result.isOk).toBe(false)
    const result2 = fonctionComparaison('0', '\\cos((2^30+0.49999999999)\\pi)', {})
    expect(result2.isOk).toBe(false)
    const result3 = fonctionComparaison('0.33333333333333', '\\frac{1}{3}', {}) // un seul 3 de plus et c'est true !
    expect(result3.isOk).toBe(false)
  })

  it('Vérifie le fonctionnement de l\'option expressionsForcementReduites', () => {
    const result = fonctionComparaison('x + x', '2x', { expressionsForcementReduites: true })
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('L\'expression littérale attendue devrait être développée et réduite or ce n\'est pas le cas.')
    const result2 = fonctionComparaison('2x+2x^2+4', '2x^2+2x+4', { expressionsForcementReduites: true })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('x+2x^2+2+x+2', '2x^2+2x+4', { expressionsForcementReduites: true })
    expect(result3.isOk).toBe(false)
    expect(result3.feedback).toBe('L\'expression littérale attendue devrait être développée et réduite or ce n\'est pas le cas.')
  })

  it('Vérifie le fonctionnement de l\'option avecSigneMultiplier', () => {
    const result = fonctionComparaison('-2 * 3', '-6', { avecSigneMultiplier: true })
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
  })

  it('Vérifie le fonctionnement de l\'option avecFractions', () => {
    const result = fonctionComparaison('\\dfrac{1}{2}', '0.5', { avecFractions: true })
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
    const result2 = fonctionComparaison('\\frac{5}{10}', '0.5', { avecFractions: true })
    expect(result2.isOk).toBe(true)
    expect(result2.feedback).toBe('')
    const result3 = fonctionComparaison('\\frac{5}{10}', '0.5', { avecFractions: true })
    expect(result3.isOk).toBe(true)
    expect(result3.feedback).toBe('')
    const result4 = fonctionComparaison('2^{-1}', '0.5', { avecFractions: true })
    expect(result4.isOk).toBe(true)
    expect(result4.feedback).toBe('')
    const result5 = fonctionComparaison('0.5', '0.5', { avecFractions: true })
    expect(result5.isOk).toBe(true)
    expect(result5.feedback).toBe('')
  })

  it('Vérifie le fonctionnement de l\'option fractionIrreductible', () => {
    const result = fonctionComparaison('\\dfrac{4}{8}', '\\dfrac{1}{2}', { fractionIrreductible: true })
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('Résultat incorrect car une fraction irréductible est attendue.')
    // est-il normal de passer une fraction non irreductible comme bonne réponse quand une saisie irreductible est attendue ?
    // en tout cas ça fonctionne !
    const result2 = fonctionComparaison('\\dfrac{2}{4}', '\\dfrac{2}{4}', { fractionIrreductible: true })
    expect(result2.isOk).toBe(false)
    expect(result2.feedback).toBe('Résultat incorrect car une fraction irréductible est attendue.')
    const result3 = fonctionComparaison('\\dfrac{1}{2}', '\\dfrac{2}{4}', { fractionIrreductible: true })
    expect(result3.isOk).toBe(true)
    expect(result3.feedback).toBe(undefined) // Les feedback undefined ne devraient pas exister, ils devraient être '' compatible avec le type de feedback
  })

  it('Vérifie le fonctionnement de l\'option fractionSimplifiee', () => {
    const result = fonctionComparaison('\\dfrac{4}{8}', '\\dfrac{8}{16}', { fractionSimplifiee: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('\\dfrac{3}{6}', '\\dfrac{8}{16}', { fractionSimplifiee: true })
    expect(result2.isOk).toBe(false)
    expect(result2.feedback).toBe('Résultat incorrect car une fraction réduite est attendue.') // Ce feedback n'est pas le bon ! On pourrait dire que 3/6 est réduite par rapport à 8/16 (d'ailleurs, c'est le test suivant)
  })

  it('Vérifie le fonctionnement de l\'option fractionReduite', () => {
    const result = fonctionComparaison('\\dfrac{4}{8}', '\\dfrac{8}{16}', { fractionReduite: true })
    expect(result.isOk).toBe(true) // Je ne sais pas pourquoi ce test ne passe pas alors qu'en pas à pas, il passe !
    const result2 = fonctionComparaison('\\dfrac{3}{6}', '\\dfrac{8}{16}', { fractionReduite: true })
    expect(result2.isOk).toBe(true) // Je ne sais pas pourquoi ce test ne passe pas alors qu'en pas à pas, il passe !
  })

  it('Vérifie le fonctionnement de l\'option fractionDecimale', () => {
    const result = fonctionComparaison('\\dfrac{5}{10}', '0.5', { fractionDecimale: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('\\dfrac{6}{12}', '0.5', { fractionDecimale: true })
    expect(result2.isOk).toBe(false)
    expect(result2.feedback).toBe('Résultat incorrect car une fraction décimale est attendue.')
    const result3 = fonctionComparaison('0.5', '0.5', { fractionDecimale: true })
    expect(result3.isOk).toBe(false)
    expect(result3.feedback).toBe('Résultat incorrect car une fraction décimale est attendue.')
  })

  it('Vérifie le fonctionnement de l\'option fractionEgale', () => {
    const result = fonctionComparaison('\\dfrac{32}{64}', '\\dfrac{8}{16}', { fractionEgale: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('\\dfrac{1}{2}', '\\dfrac{4}{8}', { fractionEgale: true })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('\\dfrac{7}{14}', '\\dfrac{4}{8}', { fractionEgale: true })
    expect(result3.isOk).toBe(true)
    const result4 = fonctionComparaison('0.5', '\\dfrac{4}{8}', { fractionEgale: true })
    expect(result4.isOk).toBe(false)
    expect(result4.feedback).toBe('Résultat incorrect car une fraction est attendue')
  })

  it('Vérifie le fonctionnement de l\'option nombreDecimalSeulement', () => {
    const result = fonctionComparaison('0.5', '0.5', { nombreDecimalSeulement: true })
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
    const result2 = fonctionComparaison('\\frac{1}{2}', '0.5', { nombreDecimalSeulement: true })
    expect(result2.isOk).toBe(false)
    expect(result2.feedback).toBe('Résultat incorrect car une valeur décimale (ou entière) est attendue.')
    const result3 = fonctionComparaison('1/2', '0.5', { nombreDecimalSeulement: true })
    expect(result3.isOk).toBe(false)
    expect(result3.feedback).toBe('Résultat incorrect car une valeur décimale (ou entière) est attendue.')
  })

  it('Vérifie le fonctionnement de l\'option operationSeulementEtNonCalcul', () => {
    const result = fonctionComparaison('4', '2+2', { operationSeulementEtNonCalcul: true })
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('Résultat incorrect car un calcul est attendu.')
    const result2 = fonctionComparaison('2\\times3+1', '1+3\\times2', { operationSeulementEtNonCalcul: true })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('3\\times2+1', '1+3\\times2', { operationSeulementEtNonCalcul: true })
    expect(result3.isOk).toBe(true)
    const result4 = fonctionComparaison('(3\\times2)+1', '1+3\\times2', { operationSeulementEtNonCalcul: true })
    expect(result4.isOk).toBe(true)
    const result5 = fonctionComparaison('3\\times(2+1)', '1+3\\times2', { operationSeulementEtNonCalcul: true })
    expect(result5.isOk).toBe(false)
    expect(result5.feedback).toBe('Résultat incorrect car ce n\'est pas ce calcul qui est attendu.')
  })

  it('Vérifie le fonctionnement de l\'option calculSeulementEtNonOperation', () => {
    const result = fonctionComparaison('2+2', '4', { calculSeulementEtNonOperation: true })
    expect(result.isOk).toBe(false)
    expect(result.feedback).toBe('Résultat incorrect car une valeur numérique est attendue.')
  })

  it('Vérifie le fonctionnement de l\'option HMS', () => {
    const result = fonctionComparaison('1h30m', '1h30m', { HMS: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('1h30m27s', '1h30m27s', { HMS: true })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('1h30m', '90m', { HMS: true })
    expect(result3.isOk).toBe(false)
  })

  it('Vérifie le fonctionnement de l\'option intervalle', () => {
    const result = fonctionComparaison('[1;2]', '[1;2]', { intervalle: true })
    expect(result.isOk).toBe(true)
    expect(result.feedback).toBe('')
    const result2 = fonctionComparaison(']1;2]', '[1;2]', { intervalle: true })
    expect(result2.isOk).toBe(false)
    expect(result2.feedback).toBe('Le crochet placé en position 1 est mal orienté.<br>')
  })

  it('Vérifie le fonctionnement de l\'option estDansIntervalle', () => {
    const result = fonctionComparaison('1.5', '[1;2]', { estDansIntervalle: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('\\dfrac{3}{2}', '[1;2]', { estDansIntervalle: true })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('\\sqrt{3}', '[1;2]', { estDansIntervalle: true })
    expect(result3.isOk).toBe(true)
    const result4 = fonctionComparaison('\\sqrt{3}', '[\\sqrt{3};2]', { estDansIntervalle: true })
    expect(result4.isOk).toBe(true)
    // voir le todo dans la fonction pour que la réponse soit fausse
    const result5 = fonctionComparaison('2x', '[-1;2]', { estDansIntervalle: true })
    expect(result5.isOk).toBe(true)

    // expect(result.feedback).toBe('Comparaison réussie')
  })

  it('Vérifie le fonctionnement de l\'option ecritureScientifique', () => {
    const result = fonctionComparaison('1{,}357\\times 10^3', '1357', { ecritureScientifique: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('1{,}357\\times 1000', '1357', { ecritureScientifique: true })
    expect(result2.isOk).toBe(false)
    const result3 = fonctionComparaison('1{,}357\\times 10^0', '1.357', { ecritureScientifique: true })
    expect(result3.isOk).toBe(true)
    const result4 = fonctionComparaison('1{,}357', '1.357', { ecritureScientifique: true })
    expect(result4.isOk).toBe(true)
  })

  it('Vérifie le fonctionnement de l\'option unite', () => {
    const result = fonctionComparaison('3{,}5\\operatorname{\\mathrm{cm}}', '3{,}5cm', { unite: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('0{,}035\\operatorname{\\mathrm{m}}', '3{,}5cm', { unite: true })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('0{,}035\\operatorname{\\mathrm{g}}', '3{,}5cm', { unite: true })
    expect(result3.isOk).toBe(false)
  })

  it('Vérifie le fonctionnement de l\'option precisionUnite', () => {
    const result = fonctionComparaison('3{,}47\\operatorname{\\mathrm{m}}', '347cm', { unite: true, precisionUnite: 0 })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('3{,}5\\operatorname{\\mathrm{m}}', '3.47m', { unite: true, precisionUnite: 0.1 })
    expect(result2.isOk).toBe(true)
    const result3 = fonctionComparaison('3{,}4\\operatorname{\\mathrm{m}}', '3.47m', { unite: true, precisionUnite: 0.05 })
    expect(result3.isOk).toBe(false)

    // expect(result.feedback).toBe('Comparaison réussie')
  })

  it('Vérifie le fonctionnement de l\'option puissance, sansExposantUn et seulementCertainesPuissances', () => {
    const result = fonctionComparaison('2^35', '2^35', { puissance: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('2^12', '4096', { puissance: true })
    expect(result2.isOk).toBe(false)
    const result2bis = fonctionComparaison('2^{12}', '4096', { puissance: true })
    expect(result2bis.isOk).toBe(true)
    const result3 = fonctionComparaison('4^6', '2^12', { puissance: true })
    expect(result3.isOk).toBe(false)
    const result3bis = fonctionComparaison('4^6', '2^{12}', { puissance: true })
    expect(result3bis.isOk).toBe(true)
    const result4 = fonctionComparaison('2^4', '16', { puissance: true })
    expect(result4.isOk).toBe(true)
    const result4bis = fonctionComparaison('4^2', '2^4', { puissance: true })
    expect(result4bis.isOk).toBe(true)
    const result5 = fonctionComparaison('16', '2^4', { puissance: true })
    expect(result5.isOk).toBe(false)
    const result6 = fonctionComparaison('16^1', '16', { puissance: true })
    expect(result6.isOk).toBe(true)
    const result7 = fonctionComparaison('16^1', '16', { sansExposantUn: true })
    expect(result7.isOk).toBe(false)
    const result8 = fonctionComparaison('4^2', '2^4', { seulementCertainesPuissances: true })
    expect(result8.isOk).toBe(false)
  })

  it('Vérifie le fonctionnement de l\'option texteAvecCasse', () => {
    const result = fonctionComparaison('Test', 'test', { texteAvecCasse: true })
    expect(result.isOk).toBe(false)
    const result2 = fonctionComparaison('Test2.#?/%', 'Test2.#?/%', { texteAvecCasse: true })
    expect(result2.isOk).toBe(true)
  })

  it('Vérifie le fonctionnement de l\'option texteSansCasse', () => {
    const result = fonctionComparaison('Test', 'test', { texteSansCasse: true })
    expect(result.isOk).toBe(true)
    const result2 = fonctionComparaison('oui', 'Oui', { texteSansCasse: true })
    expect(result2.isOk).toBe(true)
  })

  it('Vérifie le fonctionnement de l\'option nombreAvecEspace', () => {
    const result = fonctionComparaison('1000', '1 000', { nombreAvecEspace: true })
    expect(result.isOk).toBe(false)
    const result2 = fonctionComparaison('1 000', '1000', { nombreAvecEspace: true }) // @fixme: ça ne devrait pas être false (JCL)
    expect(result2.isOk).toBe(false) // ça c'est gênant ! l'élève a bien écrit la réponse, lui, c'est la bonne réponse qui est mal écrite
    expect(result.feedback).toBe('Le nombre est mal écrit, il faut faire attention aux espaces.')
  })

  it('Vérifie le fonctionnement de l\'option egaliteExpression', () => {
    const result = fonctionComparaison('2x+x=y', 'y=x+2x', { egaliteExpression: true })
    expect(result.isOk).toBe(true)
    // const result2 = fonctionComparaison('y=x+x+x', 'y=x+2x', { egaliteExpression: true })
    // expect(result2.isOk).toBe(true) // @fixme ne devrait pas être false, ou alors on devrait pouvoir tolérer des écritures différentes, la preuve ci-dessous
    //  const result3 = fonctionComparaison('y=\\frac{-3}{2}x', 'y=-\\frac{3}{2}x', { egaliteExpression: true })
    //  expect(result3.isOk).toBe(true) // @fixme ne devrait pas être false
    // expect(result.feedback).toBe('Comparaison réussie')
  })

  it('Vérifie le fonctionnement de l\'option nonReponseAcceptee', () => {
    const result = fonctionComparaison('', '', { nonReponseAcceptee: true })
    expect(result.isOk).toBe(true)
    // expect(result.feedback).toBe('Comparaison réussie')
  })
})
