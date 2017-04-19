const Ui = (function () {

  // Helper function for creating start and finish view
  function createHtmlElements(idName, classNameEnding, buttonContent) {
    let div = document.createElement('div');
    let header = document.createElement('header');
    let h1 = document.createElement('h1');
    let a = document.createElement('a');
    div.setAttribute('id', idName);
    div.className = 'screen';
    div.className += ' screen-' + classNameEnding + ' ';
    a.className = 'button';
    a.setAttribute('href', '#');
    a.textContent = buttonContent;
    h1.textContent = 'Tic Tac Toe';
    document.body.appendChild(div);
    div.appendChild(header);
    header.appendChild(h1);
    header.appendChild(a);
  }

  // Creates start and finish view
  function populateHtml() {
    createHtmlElements('start', 'start', 'Start game');
    createHtmlElements('finish', 'win', 'New game');
    const finishP = document.createElement('p');
    finishP.className = 'message';
    document.querySelector('#finish header').insertBefore(finishP, document.querySelector('#finish a'));
  }

  function UiElements() {
    $('#finish').hide();
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
      if (!e.target.classList.contains('box-filled-1') && !e.target.classList.contains('box-filled-2')) {
        for (let player of this.playersList) {
          if(player.classList.contains('active')) {
            if (player.id === 'player1') {
              e.target.style.backgroundImage = 'url(img/o.svg)';
            } else {
              e.target.style.backgroundImage = 'url(img/x.svg)';
            }
          }
        }
      }
    });

    document.getElementsByClassName('boxes')[0].addEventListener('mouseout', (e) => {
      for (let player of this.playersList) {
        if(player.classList.contains('active')) {
          e.target.style.backgroundImage = '';
        }
      }
    });
  };

  // Add class to a box after click to fill it with x or o background
  UiElements.prototype.changeBoxBackgroundAfterClick = function() {
    document.getElementsByClassName('boxes')[0].addEventListener('click', (e) => {
      if (!e.target.classList.contains('box-filled-1') && !e.target.classList.contains('box-filled-2')) {
        for (let player of this.playersList) {
          const playerId = document.getElementById(player.id);
          if(player.classList.contains('active')) {
            if (player.id === 'player1') {
              $(e.target).addClass('box-filled-1');
            } else {
              $(e.target).addClass('box-filled-2');
            }
            $(playerId).removeClass('active');
          } else {
            $(playerId).addClass('active');
          }
        }
      }
   });
  };

  // Game logic class init
  function GameLogic() {
   this.boxesList = document.getElementsByClassName('box');
   this.allWinningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
                                  [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
   this.xPositions = [];
   this.oPositions = [];
   this.playersList = document.getElementsByClassName('players');
  };

  // Checks if winning positions match player's
  GameLogic.prototype.checkPositions = function (positionList) {
      if (positionList.length <= 2) {
        return false;
      }
      let atLeastOneWinning = false;
      for (let singleCombination of this.allWinningCombinations) {
        let allNumbersOnPositionList = true;
        for (let numberFromWinning of singleCombination) {
            if (!positionList.includes(numberFromWinning)) {
              allNumbersOnPositionList = false;
            }
        }
        if (allNumbersOnPositionList) {
          atLeastOneWinning = true;
          break;
        }
      }
      return atLeastOneWinning;
  };

  // Helper function -adds class to show appropriate finish board
  GameLogic.prototype.finishElements = function (winnerNumber) {
    document.getElementsByClassName('message')[0].textContent = 'winner';
    document.getElementById('finish').className += ' screen-win-' + winnerNumber;
    $('#board').hide('slow');
    $('#finish').show('slow');
  };

  // Checks which player has the same positions and adds class to finish board
  GameLogic.prototype.checkGameResult = function () {
    if (this.checkPositions(this.oPositions)) {
      this.finishElements('one');
    } else if (this.checkPositions(this.xPositions)) {
      this.finishElements('two');
    } else {
      if (this.oPositions.length + this.xPositions.length === 9) {
        document.getElementsByClassName('message')[0].textContent = "It's a tie";
        document.getElementById('finish').className += ' screen-win-tie ';
        $('#board').hide('slow');
        $('#finish').show('slow');
      }
    }

  };

  // Push positions into x or oPositions list affter click
  GameLogic.prototype.pushPosition = function () {
   for (let i = 0; i < this.boxesList.length; i++) {
     this.boxesList[i].addEventListener('click', (e) => {
       if (!this.boxesList[i].classList.contains('box-filled-1') && !this.boxesList[i].classList.contains('box-filled-2')) {
         for (let player of this.playersList) {
           if(player.classList.contains('active') && player.id === 'player1'){
             this.oPositions.push(i);
             this.oPositions.sort();
           } else if(player.classList.contains('active') && player.id === 'player2'){
             this.xPositions.push(i);
             this.xPositions.sort();
           }
         }
       }
       this.checkGameResult();
     });
   }
  };

  // Start new game after clicking the button
  GameLogic.prototype.finishButtonEvent = function (uiElements) {
    document.querySelector('#finish .button').addEventListener('click', (e) => {
      $('#finish').hide();
      $('#board').show();
      this.xPositions = [];
      this.oPositions = [];
      $('.box').removeClass('box-filled-1').removeClass('box-filled-2');
      if ($('.players').hasClass('active')) {
        $('.players').removeClass('active');
      }
      if ($('#finish').hasClass('screen-win-one') || $('#finish').hasClass('screen-win-two') || $('#finish').hasClass('screen-win-tie') ) {
        $('#finish').removeClass('screen-win-one').removeClass('screen-win-two').removeClass('screen-win-tie');
      }
      uiElements.initPlayersTurn();
    });
  };

  function startGame() {
    const uiElements = new UiElements();
    const gameLogic = new GameLogic();
    uiElements.displayingElement('board', 'none');
    uiElements.showBoardAfterClick();
    uiElements.changeBoxBackground();
    uiElements.changeBoxBackgroundAfterClick();
    gameLogic.finishButtonEvent(uiElements);
    gameLogic.pushPosition();
  }

  return {
    populateHtml: populateHtml,
    startGame: startGame
  }
})();

Ui.populateHtml();
Ui.startGame();
