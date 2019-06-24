import React from 'react';
import { storiesOf } from '@storybook/react';
import { optionsKnob as options, boolean, text } from '@storybook/addon-knobs';
import Button from '../';
import readme from '../README.md';

const stories = storiesOf('Form|Button', module)

stories.add('simple usage', () => {
    const props = {}

    const tag = options('Tag', ['button', 'a'], 'button', {display: 'inline-radio'})
    const type = options('Type', ['button', 'submit'], 'button', {display: 'inline-radio'})
    const to = text('href', 'https://')
    const color = options('Color', ['default', 'primary', 'secondary'], 'default', {display: 'inline-radio'})
    const size = options('Size', ['small', 'normal', 'medium', 'large'], 'normal', {display: 'inline-radio'})
    const disabled = boolean('Disabled', false)

    if(tag === 'a') {
        props.tag = tag
        props.to = to
    } else if (type === 'submit') {
        props.type = type
    }

    if(color !== 'default') {
        props.color = color
    }

    if(size !== 'normal') {
        props.size = size
    }

    if(disabled) {
        props.disabled = disabled
    }

    return <Button {...props}>{text('Value', 'Button')}</Button>
}, {
    info: `# ↑` + readme.substr(1),
    jest: ['Button/__tests__/index.test.js']
})
