// This code is assisted by ChatGPT

import {MESSAGES} from '../lang/messages/en/user.js';

class Button {
  constructor(number, color) {
    this.number = number;
    this.color = color;
    this.width = 10;
    this.height = 5;
    this.element = null;
  }

  createButton() {
    this.element = document.createElement('button');
    this.element.textContent = this.number;
    this.element.style.backgroundColor = this.color;
    this.element.style.width = this.width + 'em';
    this.element.style.height = this.height + 'em';
    this.element.style.margin = '1em';
    this.element.style.transition = 'all 0.5s ease'; 
    return this.element;
  }

  btnAddEventListener(event) {
    this.element.addEventListener('click', event);
  } 

  hideNumber() {
    this.element.textContent = '';
  }

  revealNumber() {
    this.element.textContent = this.number;
  }

}

class Timer {
  constructor(timePause) {
    this.timePause = timePause;
  }

  startTimer() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.timePause);
    });
  }
}

class GameController {
    constructor() {
        this.buttons = null
        this.orderClicked = 1
        this.scrambleInterval = 2
        this.timer = null
    }
    
    getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`; 
    }

    initializeGame() {
      const gameHeader = document.createElement('div');
      gameHeader.id = 'game-header';
      gameHeader.style.display = 'flex';
      gameHeader.style.flexDirection = 'column';
      gameHeader.style.alignItems = 'center';

      const label = document.createElement('label');
      label.setAttribute('for', 'num-buttons');
      label.textContent = MESSAGES.NUMBER_OF_BUTTONS;
      
      const div = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'num-buttons';

      const button = document.createElement('button');
      button.textContent = MESSAGES.GO;
      button.addEventListener('click', () => {
        this.timer = new Timer(input.value * 1000);
        this.startGame(input.value);
      });

      div.appendChild(input);
      div.appendChild(button);

      gameHeader.appendChild(label);
      gameHeader.appendChild(div);

      const gameBody = document.createElement('div');
      gameBody.id = 'game-body';
      gameBody.style.display = 'relative';
      gameBody.style.height = '100vh';

      document.body.appendChild(gameHeader);
      document.body.appendChild(gameBody);
    }

    async startGame(numberOfButtons) {
        const gameBody = document.getElementById('game-body');
        gameBody.innerHTML = '';
        this.initializeButtons(numberOfButtons);
        await this.timer.startTimer();
        await this.scrambleButtons(numberOfButtons);
        this.hideBtns();
        this.initializeClickStage();
    }

    initializeButtons(numberOfButtons) {
      const gameBody = document.getElementById('game-body');
      this.buttons = [];
      for (let i = 0; i < numberOfButtons; i++) {
          const button = new Button(i + 1, this.getRandomColor());
          button.createButton();
          gameBody.appendChild(button.element);
          this.buttons.push(button);
      }
    }


    scrambleButtons(numberOfTimes) {
      return new Promise((resolve) => {
        let scrambleCount = 0;
    
        const header = document.getElementById('game-header');
        const headerRect = header.getBoundingClientRect();
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
    
        const yStartMargin = headerRect.bottom + 10;
    
        const maxX = windowWidth - 200;
        const maxY = windowHeight - yStartMargin - 200;
    
        const intervalId = setInterval(() => {
          if (scrambleCount >= numberOfTimes) {
            clearInterval(intervalId);
            resolve();
            return;
          }
    
          this.buttons.forEach((button) => {
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY + yStartMargin;
            button.element.style.position = 'absolute';
            button.element.style.left = `${randomX}px`;
            button.element.style.top = `${randomY}px`;
          });
    
          scrambleCount++;
        }, this.scrambleInterval * 1000);
      });
    }
    
  
    initializeClickStage() {
      this.buttons.forEach(button => {
        button.btnAddEventListener(() => {
          if (button.number === this.orderClicked) {
            button.element.textContent = button.number; 
            if (this.orderClicked === this.buttons.length) {
              this.makeNotification(MESSAGES.GAME_COMPLETE);
              this.orderClicked = 1;
              return; 
            }
            this.orderClicked++;
          } else {
            this.revealBtns();
            this.makeNotification(MESSAGES.GAME_OVER);
            this.orderClicked = 1;
          }
        });
      });
    }

    revealBtns() {
      this.buttons.forEach(button => {
        button.revealNumber();
      });
    }

    hideBtns() {
      this.buttons.forEach(button => {
        button.hideNumber();
      });
    }

    makeNotification(message) {
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.left = '50%';
      notification.style.top = '50%';
      notification.style.transform = 'translate(-50%, -50%)';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
}

const gameController = new GameController();
gameController.initializeGame();
