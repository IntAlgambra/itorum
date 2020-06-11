import React from 'react'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'

import {Base64} from 'js-base64'

import {auth} from '../../store/actions'

import './Auth.scss'

const mapStateToProps = (state) => ({
    isAuth: state.auth
})

const mapDispatchToProps = (dispatch) => ({
    auth: (login, passowrd) => dispatch(auth(login, passowrd))
})

class Auth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: ''
        }
        this.authUI = this.authUI.bind(this)
        this.onChangeLogin = this.onChangeLogin.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
    };

    async authUI(e) {
        e.preventDefault()
        const authString = `${this.state.login}:${this.state.password}`;
        const authStringBase64 = Base64.encode(authString);
        const responce = await fetch('api/auth_ui', {
            headers: {
                'Authorization': `Basic ${authStringBase64}`
            }
        })
        if (responce.status === 200) {
            this.props.auth(this.state.login, this.state.password)
            sessionStorage.setItem('is_authorized', 'true')
        }
        console.log(responce.status)
    }

    onChangeLogin(e) {
        const login = e.target.value;
        this.setState({
            login
        })
    }

    onChangePassword(e) {
        const password = e.target.value;
        this.setState({
            password
        })
    }

    render() {
        return (
            <div className="auth-container card">
                <form className="auth">
                    <h1 className='auth__header'>Log In</h1>
                    <p>{this.props.isAuth}</p>
                    <input onChange={this.onChangeLogin} value={this.state.login} type="text" id="login-input" placeholder="login"/>
                    <input onChange={this.onChangePassword} value={this.state.password} type="password" id="password-input" placeholder="password"/>
                    <div className="auth__buttons">
                        <button onClick={this.authUI} type="submit">Log in</button>
                        <Link to='/guest' className='btn primary'>Enter guest</Link>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);