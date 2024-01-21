// import jsbeautifier from 'js-beautify';

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

export const parseAndExtractDataFromMarkdown = (markdown = '') => {
  const questionsData: Question[] = [];
  let tempMD = markdown;
  const regexp = /###### (\d+)\.(.+?)\n+(```javascript\n[\s\S]+?\n```)\n\n- A:\s*(.+?)\n- B:\s*(.+?)\n- C:\s*(.+?)\n- D:\s*(.+?)\n[\s\S]+Answer:\s*(.+?)\n\n([\s\S]+?)<\/p>.*/g;
  const questions = tempMD.split('---');
  questions.forEach(question => {
    const questionData: Question = {
      id: 0,
      text: '',
      code: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ],
      correctOption: '',
      explanation: ''
    };
    for (const match of Array.from(question.matchAll(regexp))) {
      const [_, questionNumber, questionText, questionCode, optionA, optionB, optionC, optionD, correctOption, explanation] = match;
      questionData.id = parseInt(questionNumber.trim(), 10);
      questionData.text = questionText.trim();
      questionData.code = questionCode.trim();
      questionData.options[0].text = optionA.trim();
      questionData.options[1].text = optionB.trim();
      questionData.options[2].text = optionC.trim();
      questionData.options[3].text = optionD.trim();
      questionData.correctOption = correctOption.trim();
      questionData.explanation = explanation.trim();
      // console.log(jsbeautifier(questionCode, { indent_size: 2, space_in_empty_paren: true }), '\n');
      questionsData.push(questionData);
    }
  });
  return questionsData;
}
