import React from 'react';
import {connect} from 'react-redux';

import Dashboard from '../Dashboard/Dashboard';
import Auth from '../Auth/Auth';

const mapStateToProps = (state) => ({
    isAuth: state.auth,
})

const Main = (props) => {
    return (
        <div className='main'>
            {props.isAuth ? (<Dashboard></Dashboard>) : (<Auth></Auth>)}
        </div>
    )
}

export default connect(mapStateToProps)(Main);