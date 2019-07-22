/*(function () {
    // do your setup
    
})();*/
var objGame = {
    //function to load wordlist needed
    //list of words to play
    arrWordList: ["buster", "jeffery", "barton", "delmar", "llewyn", "mattie", "ulysses", "chad", "edwina", "walter", "anton", "marge", "norville", "harry", "rooster", "penny", "donny", "llewelyn", "cowboy"],
    //use a random function to select a word 
    get strWordChoice() {
        if (!this._wordChoice) {
            this._wordChoice = this.arrWordList[Math.floor(Math.random() * this.arrWordList.length)];
        }
        return this._wordChoice
    },
    _wordChoice: "",
    //object of letters in selected work and their positions
    // supports multiple instances of same letter in a word
    objKeysToMatch: {},
    //function that populates the objKeysToMach object
    addKeysToMatch: function () {
        var choice = this.strWordChoice;
        for (i = 0; i < choice.length; i++) {
            var strLetter = choice[i];
            if (this.objKeysToMatch[strLetter]) {
                this.objKeysToMatch[strLetter].push(i);
            }
            else {
                this.objKeysToMatch[strLetter] = [i];
            }
        }
    },
    //TODO:REMOVE TEST LIST FROM list of keys played
    arrKeysPlayed: [],
    //TODO:boolKeyValidator needs code to examine key against valid keys. Look to regex for assitance
    boolKeyValidator: function () { },
    intMatches: 0,
    // TODO:change this to account for duplicate keys in word using arrKeysToMatch.length
    get intMatchWin() {
        return Object.keys(this.objKeysToMatch).length;
    },
    //list of keys played that do not match the word.
    intNegMatches: 0,
    //number of missed selections before game ends with loss
    //TODO: SET TO HIGHER NUMBER
    intMatchLose: 6,
    intWon: 0,
    intLost: 0,
    //function that plays each selected letter against the chosen word.
    playTheKey: function (event) {
        var k = event.key;
        if(!this.regexChk.test(k)){
            alert("invalid key");
            return;
        }
        if (this.arrKeysPlayed.indexOf(k) != -1) {
            //TODO:code for actions if selected key already played.
            alert("Letter already played. Play another letter.");
            return;
        }
        else {
            this.arrKeysPlayed.push(k);
            this.showPlayedKeys();
            if (this.objKeysToMatch[k]) {
                //position keys onto playboard
                this.placeKeyMatch(k);
                //create intMatches
                this.intMatches++
                if (this.intMatches === this.intMatchWin) {
                    //TODO: code to indicate win to player and end game
                    this.endGame(true);
                }
            }
            else {
                //code displaying updated unmatched keys needed
                this.intNegMatches++;
                this.hangTheMan();
                //add selected key to list of missed matches
                if (this.intNegMatches === this.intMatchLose) {
                    //indicate loss and end game.
                    this.endGame(false);
                }
            }
        }
    },
    setPlaceholders: function () {
        for (i = 0; i < this.strWordChoice.length; i++) {
            var newLi = document.createElement("li");
            var placeholder = document.createTextNode("__");
            newLi.appendChild(placeholder);
            newLi.setAttribute("class", "letterPlacer");
            newLi.setAttribute("id", "li" + i);
            document.getElementById("wordPlacer").appendChild(newLi);
        }
    },
    placeKeyMatch: function (strKeyMatch) {
        let arrPosition = this.objKeysToMatch[strKeyMatch];
        for (i = 0; i < arrPosition.length; i++) {
            let strKeyPos = arrPosition[i];
            let eleLi = document.querySelector("#li" + strKeyPos);
            eleLi.textContent = strKeyMatch;
        }

    },
    hangProg: document.querySelector("#hangProgression"),
    hangTheMan: function () {
        var hangLevel = this.intNegMatches;
        //var hangProg = document.querySelector("#hangProgression");
        this.hangProg.setAttribute("src", "assets/images/Hangman-" + hangLevel + ".png");
    },
    showPlayedKeys: function () {
        var playedKeys = this.arrKeysPlayed.sort();
        var keyList = "";
        for (i = 0; i < playedKeys.length; i++) {
            keyList += playedKeys[i] + ", ";
        }
        keyList = keyList.substr(0, keyList.length - 2);
        document.querySelector("#letterList").textContent = keyList;
    },
    endGame: function (win) {
        if (win) {
            this.intWon++
            // var eleNotHungMan = document.querySelector("#hangProgression");
            this.hangProg.setAttribute("src", "assets/images/BurnAfterReadingChadDance.png");
            // eleNotHungMan.setAttribute("data-image-status","lostGame");
        }
        else {
            this.intLost++
            //document.querySelector("#hangProgression");
            this.hangProg.setAttribute("src", "assets/images/BusterScruggsCowboyFirstTime2.png");
            this.strWordChoice;
            this.hangProg.setAttribute("data-image-status", "endGame");
            let remPlacers = document.getElementById("wordPlacer");
            remPlacers.innerHTML = '';
            let newLi = document.createElement("li");
            let placeholder = document.createTextNode(this.strWordChoice);
            newLi.appendChild(placeholder);
            newLi.setAttribute("class", "letterPlacer");
            newLi.setAttribute("id", "li99");
            document.getElementById("wordPlacer").appendChild(newLi);
        }
        this.scoreboard();
        document.removeEventListener("keyup", this.keyListener);
        this.clickListener = this.resetGame.bind(this);
        this.hangProg.addEventListener("click", this.clickListener);
    },
    scoreboard: function () {
        document.querySelector("#won").textContent = "Won: " + this.intWon;
        document.querySelector("#lost").textContent = "Lost: " + this.intLost;
    },
    resetGame: function () {
        //code to clear out and restart new game.
        this.objKeysToMatch = {};
        this._wordChoice = "";
        this.arrKeysPlayed = []
        this.intNegMatches = 0;
        this.intMatches = 0
        document.querySelector("#letterList").textContent = ""
        let remPlacers = document.getElementById("wordPlacer");
        remPlacers.innerHTML = '';
        this.hangProg.setAttribute("src", "assets/images/Hangman-0.png");
        this.hangProg.removeEventListener("click", this.clickListener);        
        this.initGame();
    },
    initGame: function () {
        document.querySelector("#introduction").setAttribute("class","my-hidden")
        this.addKeysToMatch();
        this.setPlaceholders();
        this.keyListener = this.playTheKey.bind(this);
        document.addEventListener("keyup", this.keyListener);


    },
    regexChk : RegExp("^[a-z]{1}$"),
    keyListener: null,
    clickListener: null,
    introduction : function(){
        this.clickListener = this.initGame.bind(this);
        document.querySelector("#btnStart").addEventListener("click", this.clickListener)
    }
}
objGame.introduction();
