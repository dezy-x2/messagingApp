import React from "react";
import "./homepage.css";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            recepient: "",
            error: "",
            user: this.props.userId,
        };
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSendPress = this.handleSendPress.bind(this);
        this.handleRecepientChange = this.handleRecepientChange.bind(this);
        this.sendToApi = this.sendToApi.bind(this);
        this.handleApiResp = this.handleApiResp.bind(this);
        this.refreshMessages = this.refreshMessages.bind(this);
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
            body: JSON.stringify({"id": this.props.userId.id, "message": this.state.message, "recepient": this.state.recepient}), 
            headers: {
                "Content-Type": "application/json"
            },
        });
        const status = await response.status;
        const message = await response.text();
        console.log(JSON.parse(message));
        this.setState({user: JSON.parse(message)});
        this.handleApiResp(status);
    }

    handleApiResp = (status) => {
        if (status === 200) {
            this.setState({message: ""});
        } else if (status === 400) {
            this.setState({error: `ERROR: That user does not exist`})
        } else if (status === 500) {
            this.setState({error: `ERROR: User id invalid`})
        }
    }

    handleRecepientChange = (event) => {
        this.setState({recepient: event.target.value});
    };

    refreshMessages = async () => {
        const response = await fetch("http://localhost:9000/messages/send", {
            method: "POST",
            body: JSON.stringify({"id": this.props.userId.id, "refresh": true}), 
            headers: {
                "Content-Type": "application/json"
            },
        });
        const user = await response.text();
        this.setState({user: JSON.parse(user)});
    };

    refresher = setInterval(this.refreshMessages, 3000);

    render() {
        return (
            <div>
                <body className="homepage-head">
                    <h1>Welcome to your homepage {this.state.user.username}</h1>
                    <div className="messageContainer">
                        <ul className="outMessageDisplay">
                            {this.state.user.messages.outMessages.map(item => {
                                return <li> {item} </li>
                            })}
                        </ul>

                        <ul className="inMessageDisplay" >
                            {this.state.user.messages.inMessages.map(item => {
                                return <li> {item} </li>
                            })}
                        </ul>
                    </div>
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