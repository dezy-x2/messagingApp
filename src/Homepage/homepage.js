import React from "react";
import "./homepage.css";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <body className="homepage-head">
                    <h1>Welcome to your homepage</h1>
                    <textarea className="textbox" placeholder="Put your message here" ></textarea>
                    <button className="send" >Send</button>
                </body>
            </div>
        )
    }
}

export default Homepage;