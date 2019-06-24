import React from 'react';
import { storiesOf } from '@storybook/react';
import { optionsKnob as options, boolean, text } from '@storybook/addon-knobs';
import Input from '../';
import readme from '../README.md';

const stories = storiesOf('Form|Input', module)

stories
.add('simple usage', () => {
    const props = {}

    const tag = options('Tag', ['input', 'textarea'], 'input', {display: 'inline-radio'})
    const type = options('Type', ['text', 'email', 'number', 'url'], 'text', {display: 'inline-radio'})
    const color = options('Color', ['default', 'info', 'success', 'warning', 'danger'], 'default', {display: 'inline-radio'})
    const size = options('Size', ['small', 'normal', 'medium', 'large'], 'normal', {display: 'inline-radio'})
    const disabled = boolean('Disabled', false)
    const readonly = boolean('Read only', false)

    if(tag === 'textarea') {
        props.tag = tag
    }

    if(tag !== 'textarea' && type !== 'text') {
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

    if(readonly) {
        props.readOnly = readonly
    }

    return <Input
        {...props}
        placeholder={text('Placeholder', 'Example')}
        value={text('Value', 'Input')}
    />
}, {
    info: `# ↑` + readme.substr(1),
    jest: ['Input/__tests__/index.test.js']
})
