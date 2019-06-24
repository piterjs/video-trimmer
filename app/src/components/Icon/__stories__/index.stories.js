import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import Icon from '../';

const stories = storiesOf('Icon', module)

stories.add('simple usage', () => {
    return <Icon
        src="https://placekitten.com/48/48"
        alt="avatar"
        size={select('Size', ['sm', 'md', 'lg'], 'md')}
    />
})
