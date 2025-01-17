// This code is assisted by Chatgbt

import { Note } from './components.js';
import { message } from '../lang/messages/en/user.js';

class ReaderPage {
    constructor(){
        this.time = new Date();
        this.notes = JSON.parse(localStorage.getItem('notes')).map(note => new Note(note.msg));
        this.timeDisplay = null
    }

    initReaderPage = () => {
        this.timeDisplay = document.createElement('h3');
        document.body.appendChild(this.timeDisplay);
        this.updateTimeDisplay();
        const notesDiv = document.createElement('div');
        notesDiv.id = 'notesDiv';
        document.body.appendChild(notesDiv);

        this.populateAllNotes();

        const div2 = document.createElement('div');
        const homeBtn = document.createElement('button');
        homeBtn.onclick = () => window.location.href = 'index.html';
        homeBtn.innerHTML = 'Home';
        div2.appendChild(homeBtn);

        document.body.appendChild(div2);
        this.periodicLoad();
    }

    updateTimeDisplay = () => {
        this.timeDisplay.innerHTML = message.UPDATE_MSG + this.time.toLocaleString();
    }

    populateAllNotes = () => {
        document.getElementById('notesDiv').innerHTML = '';
        this.notes.forEach(note => {
            document.getElementById('notesDiv').appendChild(note.createNote());
        })
    }

    periodicLoad = () => {
        setInterval(() => {
            this.time = new Date();
            this.notes = JSON.parse(localStorage.getItem('notes')).map(note => new Note(note.msg));
            this.updateTimeDisplay();
            this.populateAllNotes();
        }, 2000);
    }
}

const reader = new ReaderPage();
reader.initReaderPage();
