import { getDefaultPage } from 'helpers/browser'
import { runTest, waitForKatex } from '../../helpers/run'

async function testCan2nde2024VueEleve () {
  const page = await getDefaultPage()
  const urlExercice = 'http://localhost:5173/alea/?uuid=8d837&alea=Xerg&uuid=ba553&alea=glZr&uuid=e5de9&alea=Hs1M&uuid=bb035&alea=gTVU&uuid=f66e7&alea=534A&uuid=9379b&alea=nLwy&uuid=80386&alea=urTl&uuid=8a4eb&alea=8cl4&uuid=71105&alea=iOwx&uuid=eb3e8&alea=MBFq&uuid=9fa79&alea=G9L4&uuid=d734a&alea=0PKS&uuid=1e8ea&alea=0Xyz&uuid=d51f8&alea=RAvP&uuid=847a9&alea=0gyK&uuid=0e09a&alea=BhBY&uuid=2c801&alea=Ch2H&uuid=70846&alea=QyEU&uuid=60d7b&alea=aeFr&uuid=ca76e&alea=Wm4o&uuid=d0a64&alea=1OuI&uuid=fc596&alea=zHKb&uuid=32d90&alea=Zddo&uuid=24396&alea=oN6f&uuid=7e2a2&alea=YbFt&uuid=2f071&alea=2La8&uuid=c5768&alea=USfH&uuid=27a60&uuid=325b5&uuid=eb73a&v=eleve&es=011100&beta=1'
  await page.goto(urlExercice)
  await waitForKatex(page)
  const answers = ['10',
    '0',
    'x^2 + 11x + 28',
    '22/7',
    '6',
    '0,06',
    '12',
    '10',
    '6',
    '36',
    '17/3',
    '2,6',
    '6',
    '99',
    '100,1',
    '4',
    '3/4',
    '5,4 * 10^4',
    '12', // Non testé
    '-16',
    '2,5',
    '1/2',
    '-2',
    '5;15',
    'x^2 -8x + 16',
    '(x + 5)(x - 5)',
    '19/31',
    '2',
    '3',
    '[-5;2]'
  ]
  for (let i = 0; i < answers.length; i++) {
    if (i === 18) continue
    const champTexteSelector = `#champTexteEx${i}Q0`
    await page.waitForSelector(champTexteSelector)
    const champTexteMathlive = page.locator(champTexteSelector)
    await champTexteMathlive.pressSequentially(answers[i])
    champTexteMathlive.blur()
    // const buttonCheckQuestion = page.locator(`#verif${i}`) // Vue Prof
    const buttonCheckQuestion = page.locator(`#buttonScoreEx${i}`)
    await buttonCheckQuestion.click()
    const feedbackSelector = `#resultatCheckEx${i}Q0`
    await page.waitForSelector(feedbackSelector)
    const spanFeedback = page.locator(feedbackSelector)
    const feedback = await spanFeedback.innerText()
    if (!feedback?.includes('😎')) {
      throw Error(`Problème à la question ${i}, 😎 n'a pas été trouvé`)
    }
    console.log(i + ' ok')
  }
  return true
}

runTest(testCan2nde2024VueEleve, import.meta.url)
