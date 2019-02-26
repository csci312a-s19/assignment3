import React from 'react';
import { shallow, mount } from 'enzyme';

import App from './App';
import IndexBar from './components/IndexBar';
import Article from './components/Article';
import Editor from './components/Editor';

// Robustly find button in component hierarchy
const findButton = (comp, labelRegEx) => {
  // Find <input type="button" ... />
  let button = comp
    .find('input[type="button"]')
    .filterWhere(n => labelRegEx.test(n.prop('value')));
  if (button.length === 0) {
    // If that didn't work, look for "<button> ..."
    button = comp.find('button').filterWhere(n => labelRegEx.test(n.text()));
  }
  return button;
};

describe('App shallow rendering tests', () => {
  let app;

  beforeEach(() => {
    app = shallow(<App />);
  });

  describe('App component initial content', () => {
    test('Contains an IndexBar component', () => {
      expect(app).toContainExactlyOneMatchingElement(IndexBar);
    });

    test('Does not display Article at startup', () => {
      expect(app).not.toContainMatchingElement(Article);
    });

    test('Does not display Editor at startup', () => {
      expect(app).not.toContainMatchingElement(Editor);
    });

    test("There should be a 'New Article' button", () => {
      const button = findButton(app, /new[ ]+article/i);
      expect(button.exists()).toBe(true);
    });

    test("There should not be an 'Edit Article' button", () => {
      const button = findButton(app, /edit[ ]+article/i);
      expect(button.exists()).toBe(false);
    });
  });

  describe('IndexBar tests', () => {
    test('IndexBar receives collection and callback as prop', () => {
      expect(app.find(IndexBar)).toHaveProp(
        'collection',
        app.instance().collection
      );
      expect(app.find(IndexBar)).toHaveProp('select'); // Should be a function
    });
  });
});

describe('App full rendering tests', () => {
  let app;

  beforeEach(() => {
    app = mount(<App />);
  });

  // We use full rendering so that we can test Article rendering when a title is clicked
  describe('Article tests', () => {
    let sampleArticle;
    beforeEach(() => {
      sampleArticle = app
        .instance()
        .collection.get('I')
        .find(val => val.title === 'Ikoga');

      // Click on section header and then title of an article (from seed.json)
      const section = app
        .find('li')
        .filterWhere(n => n.text() === sampleArticle.title[0].toUpperCase());
      section.simulate('click');
      const title = app
        .find('li')
        .filterWhere(n => n.text() === sampleArticle.title);
      title.simulate('click');
    });

    test('Article should be visible', () => {
      expect(app).toContainExactlyOneMatchingElement(Article);
    });

    test('Article should have article as its prop', () => {
      expect(app.find(Article)).toHaveProp('article', sampleArticle);
    });

    test("There should be an 'Edit Article' button", () => {
      const button = findButton(app, /edit[ ]+article/i);
      expect(button.exists()).toBe(true);
    });

    describe('Editing article tests', () => {
      beforeEach(() => {
        const button = findButton(app, /edit[ ]+article/i);
        expect(button.exists()).toBe(true);
        button.simulate('click');
      });

      test("Clicking 'Edit Article' opens the editor with the article", () => {
        expect(app).toContainExactlyOneMatchingElement(Editor);
        const editor = app.find(Editor);
        expect(editor).toHaveProp('article', sampleArticle);
      });
    });
  });

  describe('New Article tests', () => {
    beforeEach(() => {
      const button = findButton(app, /new[ ]+article/i);
      expect(button.exists()).toBe(true);
      button.simulate('click');
    });

    test("Clicking 'New Article' opens the editor", () => {
      expect(app).toContainExactlyOneMatchingElement(Editor);
    });
  });
});
