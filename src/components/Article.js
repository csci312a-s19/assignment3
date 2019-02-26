/*
  Article displays the title, contents, and edit date of an article passed
  down in its props.

  props:
    article: Article to display
*/

import React from 'react';

const Article = props => {
  // Example of "nested destructuring"
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  const {
    article: { title, extract, edited }
  } = props;

  return (
    <div id="article">
      <h3 id="article-title">{title}</h3>
      <div id="article-text">{extract}</div>
      <p id="article-timestamp">{new Date(edited).toLocaleString()}</p>
    </div>
  );
};

export default Article;
