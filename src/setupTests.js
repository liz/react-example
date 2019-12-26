// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('./theme', () => {
  return {
    white: 'white',
    black: 'black',
    primaryRed: '#d62027',
    gray: '#8d8d8d',
    darkGray: '#333',
    alto: '#d8d8d8',
    btnBackgroundColor: '#369bab',
    athensGray: '#e9e9ef',
    baseAccentColorAlt: '#369bab',
    navWrapperHeight: '164px',
    navCollapsedHeight: '49px'
  };
});