import { Question } from "./definitions";

export const readDataFromFile = async (fileUrl = '') => {
  try {
    // Fetch data from the remote Markdown file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const markdownData = await response.text();
    // Process the Markdown data
    markdownData.replaceAll('\\', '\\\\');
    markdownData.replaceAll('`', '\`');
    markdownData.replaceAll('$', '\$');
    // You can use a Markdown parser here if you want to convert it to HTML or process it further
    return markdownData;
  } catch (err) {
    console.error('Error fetching remote Markdown file:', err);
  }
  return '';
}

/**
 * Shuffle a Question[] using the Fisher-Yates (aka Knuth) Shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 * @param array Question[]
 * @returns The shuffled array
 */
const shuffle = (array: Question[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const parseAndExtractDataFromMarkdown = (markdown = '') => {
  const questionsData: Question[] = [];
  let tempMD = markdown;
  const regexp = /###### (\d+)\.(.+?)\n+(```javascript\n[\s\S]+?\n```)\n\n- [ABCDE]:\s*.+?\n[\s\S]+Answer:\s*(.+?)\n\n([\s\S]+?)<\/p>.*/g;
  const optionARegex = /[\s\S]+- A:\s*(.+?)\n.*/;
  const optionBRegex = /[\s\S]+- B:\s*(.+?)\n.*/;
  const optionCRegex = /[\s\S]+- C:\s*(.+?)\n.*/;
  const optionDRegex = /[\s\S]+- D:\s*(.+?)\n.*/;
  const optionERegex = /[\s\S]+- E:\s*(.+?)\n.*/;
  const questions = tempMD.split('---');
  questions.forEach(question => {
    const questionData: Question = {
      id: 0,
      text: '',
      code: '',
      options: [
        { id: 0, text: '' },
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
        { id: 4, text: '' }
      ],
      correctOption: 0,
      explanation: ''
    };
    const optionA = question.match(optionARegex)?.[1];
    const optionB = question.match(optionBRegex)?.[1];
    const optionC = question.match(optionCRegex)?.[1];
    const optionD = question.match(optionDRegex)?.[1];
    const optionE = question.match(optionERegex)?.[1];

    for (const match of Array.from(question.matchAll(regexp))) {
      const [_, questionNumber, questionText, questionCode, correctOption, explanation] = match;
      questionData.id = parseInt(questionNumber.trim(), 10);
      questionData.text = questionText.trim();
      questionData.options[0].text = optionA?.trim() ?? '';
      questionData.options[1].text = optionB?.trim() ?? '';
      questionData.options[2].text = optionC?.trim() ?? '';
      questionData.options[3].text = optionD?.trim() ?? '';
      questionData.options[4].text = optionE?.trim() ?? '';
      questionData.code = questionCode.trim();
      const temp = correctOption.trim();
      questionData.correctOption = 0;
      if (temp == 'B') {
        questionData.correctOption = 1;
      } else if (temp == 'C') {
        questionData.correctOption = 2;
      } else if (temp == 'D') {
        questionData.correctOption = 3;
      } else if (temp == 'E') {
        questionData.correctOption = 4;
      }
      questionData.explanation = explanation.trim();
      questionsData.push(questionData);
    }
  });
  return shuffle(questionsData);
}
