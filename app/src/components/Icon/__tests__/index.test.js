import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../';

describe('Icon', () => {
    it('should be defined', () => {
        expect(Icon).toBeDefined();
    });
    it('should render correctly', () => {
        const tree = renderer
        .create(<Icon />)
        .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
