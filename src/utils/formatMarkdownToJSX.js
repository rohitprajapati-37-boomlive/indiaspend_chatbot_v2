import React from 'react';

function formatMarkdownToJSX(markdown) {
  // Regular expressions for matching different markdown elements
  const headingRegex = /^(#{1,6})\s(.*)$/gm; // Match headers (h1-h6)
  const listRegex = /^\s*[-+*]\s+(.*)$/gm; // Match unordered lists
  const numberedListRegex = /^\s*\d+\.\s+(.*)$/gm; // Match ordered lists
  const boldRegex = /\*\*(.*?)\*\*/g; // Match bold text
  const italicRegex = /\*(.*?)\*/g; // Match italic text
  const newlineRegex = /\n/g; // Match newlines

  // Convert the markdown text into JSX
  let formattedText = markdown;

  // Convert headers (h1-h6)
  formattedText = formattedText.replace(headingRegex, (match, hashes, text) => {
    const level = hashes.length;
    return React.createElement(`h${level}`, {}, text);
  });

  // Convert unordered list
  formattedText = formattedText.replace(listRegex, (match, item) => {
    return `<ul><li>${item}</li></ul>`;
  });

  // Convert ordered list
  formattedText = formattedText.replace(numberedListRegex, (match, item) => {
    return `<ol><li>${item}</li></ol>`;
  });

  // Convert bold text
  formattedText = formattedText.replace(boldRegex, (match, content) => {
    return `<strong>${content}</strong>`;
  });

  // Convert italic text
  formattedText = formattedText.replace(italicRegex, (match, content) => {
    return `<em>${content}</em>`;
  });

  // Ensure proper line breaks (newlines are preserved)
  formattedText = formattedText.replace(newlineRegex, '<br />');

  // Return the formatted JSX component
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
}

export default formatMarkdownToJSX;
