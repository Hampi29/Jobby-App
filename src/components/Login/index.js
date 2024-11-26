import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, error_msg: ''}
  onChangingUsername = event => {
    this.setState({username: event.target.value})
  }
  onChangingPassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSucces = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = error_msg => {
    this.setState({showSubmitError: true, error_msg: error_msg})
  }

  submitCreds = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSucces(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, error_msg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      <Redirect to="/" />
    }
    return (
      <div className="login-bg">
        <form className="form-container" onSubmit={this.submitCreds}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="input-container">
            <label htmlFor="username">USERNAME</label>
            <br />
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              className="inputs"
              onChange={this.onChangingUsername}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">PASSWORD</label>
            <br />
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              className="inputs"
              onChange={this.onChangingPassword}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {showSubmitError && <p className="error-msg">*{error_msg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
