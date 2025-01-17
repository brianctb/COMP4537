// This code is assisted by Chatgbt

import { message } from "../lang/messages/en/user.js";
import { Button } from "./components.js";

class HomePage{
    constructor(){
        if (!localStorage.getItem('notes')) {
            localStorage.setItem('notes', JSON.stringify([]));
        }
    }

    initHomePage = () => {
        const div = document.createElement('div');
        div.id = 'home';
        document.body.appendChild(div);
        div.appendChild(this.addBtn(
            new Button(
                message.WRITER,
                () => window.location.href = 'writer.html'
            )
        ));
        div.appendChild(this.addBtn(
            new Button(
                message.READER, 
                () => window.location.href = 'reader.html'
            )
        ));
    }
    addBtn = (Button) => {
        return Button.button;
    }
}

const home = new HomePage();
home.initHomePage();

