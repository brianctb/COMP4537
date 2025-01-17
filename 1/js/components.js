// This code is assisted by Chatgbt

export class Note {
    constructor(msg){
        this.msg = msg;
    }

    createNote = () => {
        const div = document.createElement('div');
        div.className = 'note';
        const textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.value = this.msg;
        textBox.addEventListener('input', (event) => {
            this.msg = event.target.value;
        });
        div.appendChild(textBox);
        return div;
    }

}

export class Button{
    constructor(msg, callBack){
        this.msg = msg;
        this.callBack = callBack;
        this.button = this.createButton();
    }

    createButton = () => {
        const btn = document.createElement('button');
        btn.innerHTML = this.msg;
        btn.onclick = this.callBack;
        return btn;
    }

    render = () => {
        return this.button;
    }
}
