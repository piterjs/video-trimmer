import React from 'react';
import renderer from 'react-test-renderer';
import ControlAddons from '../';

describe('ControlAddons', () => {
    it('should be defined', () => {
        expect(ControlAddons).toBeDefined();
    });
    it('should render correctly', () => {
        const tree = renderer
        .create(<ControlAddons />)
        .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
