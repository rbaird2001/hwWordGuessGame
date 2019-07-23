(function () {

    var objGame = {
        //select random word from object, not array.
        //The result stored in object property and referenced here.
        //This protects the integrity of the word selection during 
        //  game play. Otherwise, calls to strword choice
        //  would trigger the function to choose another random word.
        strwordchoice: function (obj) {
            if (!this._wordChoice) {
                let keys = Object.keys(obj)
                let strPreChoice = obj[keys[keys.length * Math.random() << 0]];
                strPreChoice = strPreChoice.substr(0,strPreChoice.length - 4);
                this._wordChoice = strPreChoice;
            }
            return this._wordChoice;
        },
        _wordChoice: "",
        //object will hold selected word buy storing each letter 
        //   and its position(s) in the word. This will prevent
        //   multiple loops through the word for each selected letter.
        //This supports multiple instances of same letter in a word
        objKeysToMatch: {},
        addKeysToMatch: function () {
            let choice = this.strwordchoice(this.objNameImage);
            for (i = 0; i < choice.length; i++) {
                let strLetter = choice[i];
                if (this.objKeysToMatch[strLetter]) {
                    this.objKeysToMatch[strLetter].push(i);
                }
                else {
                    this.objKeysToMatch[strLetter] = [i];
                }
            }
        },
        //Array stores list of keys played
        arrKeysPlayed: [],
        //game win determined not by word comparison, but by counting 
        //  number of letter matches to number of matches needed to win.
        //  this reduces looping functions
        intMatches: 0,
        get intMatchWin() {
            return Object.keys(this.objKeysToMatch).length;
        },
        //list of keys played that do not match the word.
        //  When negative matches equals max number, player has lost.
        intNegMatches: 0,
        //number of missed selections before game ends with loss
        intMatchLose: 6,
        // score for wins and losses.
        intWon: 0,
        intLost: 0,
        //Begin play. Key stroke event triggers this function
        playTheKey: function (event) {
            var k = event.key;
            //calls function to validate key as a playable key.
            if (!this.regexChk.test(k)) {
                alert("invalid key");
                return;
            }
            //checks to see if key has been played already.
            if (this.arrKeysPlayed.indexOf(k) != -1) {
                alert("Letter already played. Play another letter.");
                return;
            }
            else {
                //stored played key in an array 
                this.arrKeysPlayed.push(k);
                //function call to sort played keys and to display
                //   them alphabetically.
                this.showPlayedKeys();
                if (this.objKeysToMatch[k]) {
                    //position keys onto playboard replacing 
                    //   the placeholder for that key.
                    this.placeKeyMatch(k);
                    //increase match count by 1
                    this.intMatches++
                    //when match count equals number of possible matches
                    //  in the game, player wins. Init game ending function.
                    if (this.intMatches === this.intMatchWin) {
                        this.endGame(true);
                    }
                }
                else {
                    //code displaying updated unmatched keys
                    //add one to the count of missed matches
                    this.intNegMatches++;
                    //add to the hangman image
                    this.hangTheMan();
                    if (this.intNegMatches === this.intMatchLose) {
                        //indicate loss and end game.
                        this.endGame(false);
                    }
                }
            }
        },
        //creates placeholder elements on html
        buildPlacer : function(liNum,text){
            let newLi = document.createElement("li");
            let placeholder = document.createTextNode(text);
            newLi.appendChild(placeholder);
            newLi.setAttribute("class", "letterPlacer");
            newLi.setAttribute("id", "li" + liNum);
            document.getElementById("wordPlacer").appendChild(newLi);
        },
        //requests placeholder elements for each letter in the word.
        setPlaceholders: function () {
            for (i = 0; i < this.strwordchoice().length; i++) {
                this.buildPlacer(i,"__");
            }
        },
        //place matched letter into the correct position(s)
        //  as determined by the placeholder.
        placeKeyMatch: function (strKeyMatch) {
            let arrPosition = this.objKeysToMatch[strKeyMatch];
            for (i = 0; i < arrPosition.length; i++) {
                let strKeyPos = arrPosition[i];
                let eleLi = document.querySelector("#li" + strKeyPos);
                eleLi.textContent = strKeyMatch;
            }
    
        },
        //alias to frequent called hang progression element.
        hangProg: document.querySelector("#hangProgression"),
        //alias to frequnly called winLose element
        winLose : document.querySelector("#winLose"),
        //function that progressively builds the hangman image
        hangTheMan: function () {
            var hangLevel = this.intNegMatches;
            //var hangProg = document.querySelector("#hangProgression");
            this.hangProg.setAttribute("src", "assets/images/Hangman-" + hangLevel + ".png");
        },
        //function to display played keys.
        showPlayedKeys: function () {
            var playedKeys = this.arrKeysPlayed.sort();
            var keyList = "";
            for (i = 0; i < playedKeys.length; i++) {
                keyList += playedKeys[i] + ", ";
            }
            keyList = keyList.substr(0, keyList.length - 2);
            document.querySelector("#letterList").textContent = keyList;
        },
        //game ending procedure. 
        endGame: function (win) {
            let hp = this.hangProg;
            let wl = this.winLose;
            //add image to match the word played.
            //image name matches word name. 
            let imgPath = "assets/images/nameimages/";
            let endImg = imgPath + this.objNameImage[this.strwordchoice()];
            hp.setAttribute("src", endImg);
            //attribute not in use at the moment, but may be later.
            hp.setAttribute("data-image-status", "endGame");
            if (win) {
                this.intWon++
                wl.className = "bg-success visible text-center w-50";
                wl.textContent = "You won!  --  Click image to play again.";
            }
            else {
                this.intLost++
                //next two lines clear the placers and revels the word instead.
                this.clearPlacers();
                this.buildPlacer("99",this.strwordchoice());
                wl.className = "bg-danger visible text-center w-50";
                wl.textContent = "You lost  --  Click image to play again.";
            }
            this.scoreboard();
            //remove key event listener to prevent continued play after
            //   game has ended.
            document.removeEventListener("keyup", this.keyListener);
            //bind(this) enables items in the object to be called 
            //  when player's context/scope is on the document.
            this.clickListener = this.resetGame.bind(this);
            hp.addEventListener("click", this.clickListener);
        },
        //function to update scoreboard
        scoreboard: function () {
            document.querySelector("#won").textContent = "Won: " + this.intWon;
            document.querySelector("#lost").textContent = "Lost: " + this.intLost;
        },
        resetGame: function () {
            //code to clear out and restart new game.
            let hp = this.hangProg;
            let wl = this.winLose
            this.objKeysToMatch = {};
            this._wordChoice = "";
            this.arrKeysPlayed = []
            this.intNegMatches = 0;
            this.intMatches = 0
            document.querySelector("#letterList").textContent = "";
            this.clearPlacers();
            hp.setAttribute("src", "assets/images/Hangman-0.png");
            //removing event listener is critical
            //it is a big deal in this function as there is no dedicated
            //   button to reset game. image click resets the game, but image
            //   always exists it only gets a src attribute change.
            //So, the event listener would exist and affect the game when it
            //   shouldn't.
            //This command removes the listener from operation.
            hp.removeEventListener("click", this.clickListener);
            //hides the win/lose display. but keeps the structure of it
            //   intact. the .invisible class is a bootstrap class.
            //   I don't know how to do this manually.
            wl.className = "w-50 invisible";
            wl.textContent = "";
            this.initGame();
        },
        //start a new game.
        initGame: function () {
            document.querySelector("#introduction").setAttribute("class", "my-hidden")
            this.addKeysToMatch();
            this.setPlaceholders();
            this.keyListener = this.playTheKey.bind(this);
            document.addEventListener("keyup", this.keyListener);
    
    
        },
        //check key press for 1 letter only
        regexChk: RegExp("^[a-z]{1}$"),
        //put the event listener here with a bind element to keep object in scope
        //   
        keyListener: null,
        clickListener: null,
        introduction: function () {
            this.clickListener = this.initGame.bind(this);
            document.querySelector("#btnStart").addEventListener("click", this.clickListener)
        },
        clearPlacers (){
            let remPlacers = document.getElementById("wordPlacer");
            remPlacers.innerHTML = '';
        },
        //Objects are better than arrays. Prove me wrong.
        objNameImage: {
            buster: "buster.png",
            jeffery: "jeffery.png",
            barton: "barton.png",
            delmar: "delmar.png",
            llewyn: "llewyn.png",
            mattie: "mattie.png",
            ulysses: "ulysses.png",
            chad: "chad.png",
            edwina: "edwina.png",
            walter: "walter.png",
            anton: "anton.png",
            marge: "marge.png",
            norville: "norville.png",
            rooster: "rooster.png",
            penny: "penny.png",
            donny: "donny.png",
            llewelyn: "llewelyn.png",
            cowboy: "cowboy.png",
            jerry: "jerry.png",
            verna: "verna.png"
        },
    }
    objGame.introduction();
    
})()
