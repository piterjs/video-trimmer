import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class Page extends Router {
    componentDidMount() {
        document.title = this.props.title;
    }

    componentDidUpdate() {
        document.title = this.props.title;
    }

    render() {
        const { title, ...rest } = this.props;
        return <Route {...rest} />;
    }
}

export default Page;
