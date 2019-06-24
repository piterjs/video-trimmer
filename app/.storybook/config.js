import { addParameters, addDecorator, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withTests } from '@storybook/addon-jest';

import requireContext from 'require-context.macro';

import results from './.jest-test-results';

addParameters({
    options: {
        theme: {
            brandTitle: 'Trimmer elements'
        },
    },
    darkMode: {
        // Override the default dark theme
        dark: { ...themes.dark, appBg: '#333' },
        // Override the default light theme
        light: { ...themes.normal, appBg: '#fff' }
    }
});
addDecorator(
    withInfo({
        inline: true,
        header: false,
        propTables: false
    })
);
addDecorator(
    withTests({
        results,
    })
);
addDecorator(
    withKnobs
);

const req = requireContext('../src/components/', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
