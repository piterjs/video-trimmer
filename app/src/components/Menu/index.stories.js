import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { storiesOf } from '@storybook/react';

import { Menu, MenuLink, MenuText } from '../Menu/index.js';
import Icon from '../Icon'
import IconScissors from '../../assets/icons/scissors.svg'

const stories = storiesOf('Layout|Menu', module)

stories.add('simple usage', () => {
    return <Router>
        <Menu>
            <MenuLink modifer="icon" to="/">
                <Icon size="md" src={IconScissors} alt="Trimmer logo"/>
                <MenuText>Home</MenuText>
            </MenuLink>
            <MenuLink to="/lol">Lol</MenuLink>
        </Menu>
        <Switch>
            <Route path="/" exact component={() => 'Home page!'} />
            <Route path="/lol" exact component={() => 'Lol page!'} />
        </Switch>
    </Router>
})
