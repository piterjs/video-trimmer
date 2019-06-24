import React from 'react';
import renderer from 'react-test-renderer';
import Select from '../';

describe('Select', () => {
    it('should be defined', () => {
        expect(Select).toBeDefined();
    });
    it('should render correctly', () => {
        const tree = renderer
        .create(<Select><option value="test">Test</option></Select>)
        .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
