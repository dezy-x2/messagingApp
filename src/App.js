import './App.css';
import React from "react";
import LogIn from "./LogIn/logIn.js";
import SignUp from "./SignUp/signUp.js";
import HomePage from "./Homepage/homepage.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logIn: false,
      signUp: false,
      completed: null,
      message: "You're in!",
      userId: null,
    }
    this.logInHandler = this.logInHandler.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this);
    this.completedFormHandler = this.completedFormHandler.bind(this);
    this.getUserId = this.getUserId.bind(this);
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
    }
  }

  getUserId = (id) => {
    this.setState({userId: id});
  };

  render() {
    return (
      <div className="App">
        {!this.state.completed && <div className="front-page" > 
          <header className="App-header"> <h1 className="app-title">Secure Messaging</h1> </header>
          <div id="acc-buttons" >
            <button className="log-in" onClick={this.logInHandler}>Log In</button>
            <button className="log-in" id="sign-up" onClick={this.signUpHandler}>Sign Up</button>
          </div> 
          <div className="forms">
            {this.state.logIn && <LogIn completedFormHandler={this.completedFormHandler} getUserId={this.getUserId} />}
            {this.state.signUp && <SignUp completedFormHandler={this.completedFormHandler} getUserId={this.getUserId} />}
          </div>
          </div>}
        {this.state.completed && <HomePage userId={this.state.userId} completedFormHandler={this.completedFormHandler} />}
      </div>
    );
  }
}
//<p className="message" >{this.state.message}</p>
export default App;
