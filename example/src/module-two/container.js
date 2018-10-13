import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as selectors from './selectors';

class Index extends PureComponent {
    render() {
        return <div> module-two </div>;
    }
}

const mapState = (state, props) => {
    const current = selectors.getRoot(state);

    return {
        ...current,
        ...props
    };
};

export default connect(mapState, actions)(Index);
