import React from 'react';
import { storiesOf } from '@storybook/react';
import { optionsKnob as options, boolean } from '@storybook/addon-knobs';
import Select from '../';

const stories = storiesOf('Form|Select', module)

stories.add('Select', () => {
    return <Select
        type={options('Type', ['text', 'email', 'number', 'url'], 'text', {
            display: 'inline-radio'
        })}
        disabled={boolean('Disabled', false)}
        readonly={boolean('Read only', false)}
        size={options('Size', ['small', 'normal', 'medium', 'large'], 'normal', {
            display: 'inline-radio'
        })}
        color={options('Color', ['default', 'info', 'success', 'warning', 'danger'], 'default', {
            display: 'inline-radio'
        })}
    >
        <option value="any-value">Any value</option>
        <option value="any-disabled" disabled>Any value</option>
    </Select>
})
