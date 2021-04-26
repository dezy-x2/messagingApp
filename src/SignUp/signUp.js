import React from "react";
import "./signUp.css";

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.sendToApi = this.sendToApi.bind(this);
        this.handleApiResponse = this.handleApiResponse.bind(this);
    }

    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleSignUp = () => {
        if (this.state.username !== "" && this.state.password !== "") {
            this.sendToApi();
        } else {
            this.props.completedFormHandler(false);
        }
        
    }

    async sendToApi() {
        try {
            const response = await fetch("http://localhost:9000/acc/crt", {
            method: "POST",
            body: JSON.stringify({"username": this.state.username.trim(), "password": this.state.password.trim()}), 
            headers: {
                "Content-Type": "application/json"
            },
            });
            if(!response.ok) {
                throw new Error(response);
            }
            const status = await response.status;
            const userId = await response.text();
            this.props.getUserId(JSON.parse(userId));
            this.handleApiResponse(status);
        } catch (e) {
            console.log("Failed");
            this.props.completedFormHandler(false, "Username all ready in use");
        }
        

    }

    handleApiResponse(status){
        if (199 < status && status < 300) {
            this.setState({username: "", password: ""});
            this.props.completedFormHandler(true);
        } else {
            this.props.completedFormHandler(false);
        }
    }

    render() {
        return (
            <div className="signup-page" >
                <form className="form" >
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} placeholder="Username" className="username" />
                    <input type="text" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Password" className="password" />
                </form>
                <button onClick={this.handleSignUp} className="submit" >Sign Up</button>
            </div>
        )
    }
}

export default SignUp;