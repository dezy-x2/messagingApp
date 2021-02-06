import './App.css';
import React from "react";
import LogIn from "./LogIn/logIn.js";
import SignUp from "./SignUp/signUp.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logIn: false,
      signUp: false,
      completed: false,
      message: "You're in!"
    }
    this.logInHandler = this.logInHandler.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this);
    this.completedFormHandler = this.completedFormHandler.bind(this);
  }

  logInHandler = () => {
    this.state.logIn ? this.setState({logIn: false}) : this.setState({logIn: true});
  }

  signUpHandler = () => {
    this.state.signUp ? this.setState({signUp: false}) : this.setState({signUp: true});
  }

  completedFormHandler = (bool) => {
    if (bool) {
      this.setState({completed: true, signUp: false, logIn: false})
    } else {
      this.setState({completed: true, message: "Something went wrong"})
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-title">Secure Messaging</h1>
          { !this.state.completed && <button className="log-in" onClick={this.logInHandler}>Log In</button>}
          { !this.state.completed && <button className="log-in" id="sign-up" onClick={this.signUpHandler}>Sign Up</button> }
          {this.state.logIn && <LogIn completedFormHandler={this.completedFormHandler} />}
          {this.state.signUp && <SignUp completedFormHandler={this.completedFormHandler} />}
          {this.state.completed && <p className="message" >{this.state.message}</p>}
        </header>
      </div>
    );
  }
}

export default App;
