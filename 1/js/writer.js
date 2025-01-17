// This code is assisted by Chatgbt

import { Note, Button } from './components.js';
import { message } from '../lang/messages/en/user.js';

class WriterPage {
    constructor(){
        this.time = new Date();
        this.notes = JSON.parse(localStorage.getItem('notes')).map(note => new Note(note.msg));
        this.timeDisplay = null
    }

    initWriterPage = () => {
        this.timeDisplay = document.createElement('h3');
        document.body.appendChild(this.timeDisplay);
        this.updateTimeDisplay();
        const notesDiv = document.createElement('div');
        notesDiv.id = 'notesDiv';
        document.body.appendChild(notesDiv);
        this.populateAllNotes();

        const div = document.createElement('div');
        const btn = document.createElement('button');
        btn.onclick = () => this.addNewNote();
        btn.innerHTML = 'Add';
        div.appendChild(btn);

        const div2 = document.createElement('div');
        const homeBtn = document.createElement('button');
        homeBtn.onclick = () => window.location.href = 'index.html';
        homeBtn.innerHTML = 'Home';
        div2.appendChild(homeBtn);

        document.body.appendChild(div);
        document.body.appendChild(div2);
        this.periodicSave();
    }

    updateTimeDisplay = () => {
        this.timeDisplay.innerHTML = message.STORED_MSG + this.time.toLocaleString();
    }

    populateAllNotes = () => {
        document.getElementById('notesDiv').innerHTML = '';
        this.notes.forEach(note => {
            document.getElementById('notesDiv').appendChild(this.makeDeletableNote(note));
        })
    }

    makeDeletableNote = (note) => {
        const div = document.createElement('div');
        div.className = 'deleteableNote';
        div.style.display = 'flex';
        div.appendChild(note.createNote());
        const removeBtn = new Button('Remove', () => this.deleteNote(note));
        div.appendChild(removeBtn.render());
        return div
    }

    addNewNote = () => {
        const note = new Note("");
        this.notes.push(note);
        document.getElementById('notesDiv').appendChild(this.makeDeletableNote(note))
    };

    deleteNote = (note) => {
        this.notes = this.notes.filter(n => n !== note);
        this.saveNotes();
        this.populateAllNotes();
    }

    saveNotes = () => {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    periodicSave = () => {
        setInterval(() => {
            this.time = new Date();
            this.updateTimeDisplay();
            this.saveNotes();
            console.log('saved');
        }, 2000);
    }
}

const writer = new WriterPage();
writer.initWriterPage();
