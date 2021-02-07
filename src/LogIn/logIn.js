import React from "react";
import "./logIn.css";

class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleApiResponse = this.handleApiResponse.bind(this);
        this.sendToApi = this.sendToApi.bind(this);
    }

    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleLogIn = () => {
        if (this.state.username !== "" && this.state.password !== "") {
            this.sendToApi();
        } else {
            this.props.completedFormHandler(false);
        }
    }

    async sendToApi() {
        const username = this.state.username;
        const password = this.state.password;
        const response = await fetch(`http://localhost:9000/acc/fetch/${username}/${password}`);
        const status = await response.status;
        this.handleApiResponse(status);
    }

    handleApiResponse(status) {
        if (199 < status && status < 300) {
            console.log(status);
            this.setState({username: "", password: ""});
            this.props.completedFormHandler(true);
        } else {
            this.props.completedFormHandler(false)
        }
    }

    render() {
        return (
            <div>
                <form className="form" >
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} placeholder="Username" className="username" />
                    <input type="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Password" className="password" />
                </form>
                <button onClick={this.handleLogIn} className="submit" >Log In</button>
            </div>
        )
    }
}

export default LogIn;