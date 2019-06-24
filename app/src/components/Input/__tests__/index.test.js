import React from 'react';
import renderer from 'react-test-renderer';
import Input from '../';

describe('Input', () => {
    it('should be defined', () => {
        expect(Input).toBeDefined();
    });
    it('should render correctly', () => {
        const tree = renderer
        .create(<Input />)
        .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
