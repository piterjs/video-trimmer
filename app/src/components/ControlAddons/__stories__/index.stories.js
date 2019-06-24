import React from 'react';
import { storiesOf } from '@storybook/react';
import { optionsKnob as options, text } from '@storybook/addon-knobs';
import Button from '../../Button';
import Input from '../../Input';
import ControlAddons from '../';

const stories = storiesOf('Form|Addons', module)
.addParameters({ jest: ['ControlAddons/__tests__/index.test.js'] })

stories.add('Buttons group', () => {
    const props = {}
    const size = options('Size', ['small', 'normal', 'medium', 'large'], 'normal', {display: 'inline-radio'})

    if(size !== 'normal') {
        props.size = size
    }

    return <ControlAddons
        {...props}
        aria-label={text('Label', 'Buttons')}
    >
        <Button>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
    </ControlAddons>
}, {info: `# Buttons group`})

stories.add('Inputs group', () => {
    const props = {}
    const size = options('Size', ['small', 'normal', 'medium', 'large'], 'normal', {display: 'inline-radio'})

    if(size !== 'normal') {
        props.size = size
    }

    return <ControlAddons
        {...props}
        aria-label={text('Label', 'Buttons')}
    >
        <Input />
        <Input />
    </ControlAddons>
}, {info: `# Inputs group`});

stories.add('Inline form', () => {
    const props = {}
    const size = options('Size', ['small', 'normal', 'medium', 'large'], 'normal', {display: 'inline-radio'})

    if(size !== 'normal') {
        props.size = size
    }

    return <ControlAddons
        {...props}
        aria-label={text('Label', 'Buttons')}
    >
        <Input placeholder="Login"/>
        <Button color="primary">Submit</Button>
    </ControlAddons>
}, {info: `# Inline form`});
