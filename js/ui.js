const Ui = (function () {

  function UiElements() {
    const self = this;
    this.startDiv = document.createElement('div');
    this.startHeader = document.createElement('header');
    this.startH1 = document.createElement('h1');
    this.startA = document.createElement('a');
    this.startDiv.setAttribute('id', 'start');
    this.startDiv.className = 'screen';
    this.startDiv.className += ' screen-start';
    this.startA.className = 'button';
    this.startA.setAttribute('href', '#');
    this.startA.textContent = 'Start game';
    this.startH1.textContent = 'Tic Tac Toe';
    document.body.appendChild(this.startDiv);
    this.startDiv.appendChild(this.startHeader);
    this.startHeader.appendChild(this.startH1);
    this.startHeader.appendChild(this.startA);
    this.playersList = document.getElementsByClassName('players');
  }

  UiElements.prototype.displayingElement = function (id, displayValue) {
    const element = document.getElementById(id);
    element.style.display = displayValue;
  };

  // Random player's turn before starting the game
  UiElements.prototype.initPlayersTurn = function() {
    let player = this.playersList[Math.floor(Math.random() * this.playersList.length)];
    player.className += ' active';
  };

  UiElements.prototype.showBoardAfterClick = function() {
    $('#start>header>.button').click(() => {
      this.displayingElement('start', 'none');
      this.displayingElement('board', 'block');
      this.initPlayersTurn();
    });
  };

// Show 'x' or 'o' in box depends on who's turn it is
  UiElements.prototype.changeBoxBackground = function() {
    document.getElementsByClassName('boxes')[0].addEventListener('mouseover', (e) => {
      for (let i = 0; i < this.playersList.length; i++) {
        if(this.playersList[i].classList.contains('active')) {
          if (this.playersList[i].id === 'player1') {
            e.target.style.backgroundImage = 'url(img/o.svg)';
          } else {
            e.target.style.backgroundImage = 'url(img/x.svg)';
          }
        }
      }
    });

    document.getElementsByClassName('boxes')[0].addEventListener('mouseout', (e) => {
      for (let i = 0; i < this.playersList.length; i++) {
        if(this.playersList[i].classList.contains('active')) {
          e.target.style.backgroundImage = '';
          e.target.property = 'disabled';
        }
      }
    });
  };

  UiElements.prototype.preventEventsOnSelectedBox = function(selector) {
    $(selector).click(() => {return false});
    $(selector).mouseover(() => {return false});
    $(selector).mouseout(() => {return false});
  };

  UiElements.prototype.changeBoxBackgroundAfterClick = function() {
    document.getElementsByClassName('boxes')[0].addEventListener('click', (e) => {
      for (let i = 0; i < this.playersList.length; i++) {
        const playerId = document.getElementById(this.playersList[i].id);
        if(this.playersList[i].classList.contains('active')) {
          if (this.playersList[i].id === 'player1') {
            e.target.className += ' box-filled-1';
          } else {
            e.target.className += ' box-filled-2';
          }
          $(playerId).removeClass('active');
        } else {
          $(playerId).addClass('active');
        }
      }
      this.preventEventsOnSelectedBox(e.target);
    });
  };

  function callMethods() {
    const uiElements = new UiElements();
    uiElements.displayingElement('board', 'none');
    uiElements.showBoardAfterClick();
    uiElements.changeBoxBackground();
    uiElements.changeBoxBackgroundAfterClick();
  }

  return {
    callMethods: callMethods
  }
})();
