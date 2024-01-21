// import jsbeautifier from 'js-beautify';

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
  let tempMD = markdown;
  const regexp = /###### (\d+\..+?)\n+\`\`\`javascript\n([\s\S]+?)\n\`\`\`\n\n- A:\s*(.+?)\n- B:\s*(.+?)\n- C:\s*(.+?)\n- D:\s*(.+?)\n[\s\S]+Answer:\s*(.+?)\n\n([\s\S]+?)<\/p>.*/g;
  const questions = tempMD.split('---');
  questions.forEach(question => {
    for (const match of Array.from(question.matchAll(regexp))) {
      const [_, questionText, questionCode, optionA, optionB, optionC, optionD, correctOption, explanation] = match;
      console.log('\nQUESTION:\n', questionText, '\n');
      // console.log(jsbeautifier(questionCode, { indent_size: 2, space_in_empty_paren: true }), '\n');
      console.log('CODE:\n', questionCode, '\n');
      console.log('OPTIONS:\nA: ', optionA, '\nB: ', optionB, '\nC: ', optionC, '\nD: ', optionD);
      console.log('\nCORRECT OPTION: ', correctOption);
      console.log('\nEXPLANATION:\n', explanation);
    }
  });
}
