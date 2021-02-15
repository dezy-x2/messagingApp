import React from "react";
import "./homepage.css";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            recepient: "",
            error: "",
        };
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSendPress = this.handleSendPress.bind(this);
        this.handleRecepientChange = this.handleRecepientChange.bind(this);
        this.sendToApi = this.sendToApi.bind(this);
        this.handleApiResp = this.handleApiResp.bind(this);
    }

    handleMessageChange = (event) => {
        this.setState({message: event.target.value});
    }

    handleSendPress = () => {
        console.log("Hello")
        if (this.state.message !== "" && this.state.recepient !== "") {
            this.sendToApi();
        } else {
            this.setState({error: "ERROR: Message and recepient must have contents"});
        }
    }

    sendToApi = async () => {
        const response = await fetch("http://localhost:9000/messages/send", {
            method: "POST",
            body: JSON.stringify({"id": this.props.userId, "message": this.state.message, "recepient": this.state.recepient}), 
            headers: {
                "Content-Type": "application/json"
            },
        });
        const status = await response.status;
        const message = await response.text();
        this.handleApiResp(status, message);
    }

    handleApiResp = (status, message) => {
        if (status === 200) {
            this.setState({message: ""});
        } else if (status === 400) {
            this.setState({error: `ERROR: ${message}`})
        } else if (status === 500) {
            this.setState({error: `ERROR: ${message}`})
        }
    }

    handleRecepientChange = (event) => {
        this.setState({recepient: event.target.value});
    };

    render() {
        return (
            <div>
                <body className="homepage-head">
                    <h1>Welcome to your homepage {this.props.userId.id}</h1>
                    <input type="text" className="recepient" value={this.state.recepient} onChange={this.handleRecepientChange} placeholder="Recepient name" />
                    <textarea className="textbox" placeholder="Put your message here" onChange={this.handleMessageChange} value={this.state.message} ></textarea>
                    <button className="send" onClick={this.handleSendPress} >Send</button>
                    {<p className="error"> {this.state.error} </p>}
                </body>
            </div>
        )
    }
}

export default Homepage;