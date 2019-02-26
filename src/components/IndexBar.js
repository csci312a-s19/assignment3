/*
  IndexBar displays the list of sections (first letter) for the collection of
  articles passed down in its props. Clicking on one of these sections displays
  a list of the available titles in that current section.

  props:
    collection: A Map of articles keyed by section
    select: A callback when article is selected
*/

import React, { Component } from 'react';

/*
  Sections headers sub-component in the IndexBar.
  props:
    sections - the list of the available sections
    setSection - a callback for when a section has been selected
*/
function IndexSections(props) {
  const { sections, setSection } = props;

  // Build the list of sections
  const sectionItems = sections.map(section => (
    <li
      key={section}
      onClick={() => {
        setSection(section);
      }}
    >
      {section}
    </li>
  ));

  return (
    <div id="section-list">
      <ul>{sectionItems}</ul>
    </div>
  );
}

/*
  Title list sub-component in the IndexBar.
  props:
    articles - the list of articles to be displayed
    select - the callback to indicate which title has been selected

  Note that this doesn't know about all articles: just those passed to it.
*/
function IndexTitles(props) {
  // Sort the articles by title
  const { articles, select } = props;
  articles.sort((a1, a2) => a1.title.localeCompare(a2.title));

  // Assemble the list of titles
  const titles = articles.map(article => (
    <li
      key={article.title}
      onClick={() => {
        select(article);
      }}
    >
      {article.title}
    </li>
  ));

  return (
    <div>
      <ul>{titles}</ul>
    </div>
  );
}

class IndexBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: null
    };
  }

  render() {
    // Destructure props into local variables to avoid typing `this.props` everytime
    const { collection, select } = this.props;
    const { section } = this.state;

    // Conditionally create the title list if we have a selected section
    let titles;
    if (section) {
      const articles = collection.get(section);
      titles = <IndexTitles articles={articles} select={select} />;
    } else {
      titles = <p style={{ textAlign: 'center' }}>Select a section</p>;
    }

    return (
      <div>
        <IndexSections
          sections={Array.from(collection.keys()).sort()}
          setSection={newSection => {
            if (newSection !== section) {
              this.setState({ section: newSection });
              select(); // Deselect any current article
            }
          }}
        />
        {titles}
      </div>
    );
  }
}

export default IndexBar;
