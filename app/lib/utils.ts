// import jsbeautifier from 'js-beautify';

export const readDataFromFile = (fileUrl = '') => {
  // Fetch data from the remote Markdown file
  fetch(fileUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.text();
    })
    .then(markdownData => {
      // Process the Markdown data
      markdownData.replaceAll('\\', '\\\\');
      markdownData.replaceAll('`', '\`');
      markdownData.replaceAll('$', '\$');
      // You can use a Markdown parser here if you want to convert it to HTML or process it further
      return markdownData;
    })
    .catch(error => {
      console.error('Error fetching remote Markdown file:', error);
    });

  return '';
}

export const parseAndExtractDataFromMarkdown = (markdown = '') => {
  let tempMD = markdown;
  tempMD = tempMD.split('\n').join('');
  const regexp = /###### (\d+\.\s+.+\?)\s*```javascript(.+)```.*/gm;
  const questions = tempMD.split('---');
  questions.forEach(question => {
    for (const match of Array.from(question.matchAll(regexp))) {
      const [_, questionText, questionCode] = match;
      console.log('\n', questionText, '\n');
      // console.log(jsbeautifier(questionCode, { indent_size: 2, space_in_empty_paren: true }), '\n');
      console.log(questionCode, '\n');
    }
  });
}
