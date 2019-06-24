import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../';

describe('Button', () => {
    it('should be defined', () => {
        expect(Button).toBeDefined();
    });
    it('should render correctly', () => {
        const tree = renderer
        .create(<Button />)
        .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
