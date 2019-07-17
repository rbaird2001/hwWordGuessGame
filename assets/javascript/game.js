/*(function () {
    // do your setup

})();*/

var objGame = {
    //function to load wordlist needed
    //list of words to play
    arrWordList : ["bandersnatch", "giggledick"],
    //use a random function to select a word 
    get strWordChoice(){
        return this.arrWordList[Math.floor(Math.random() * this.arrWordList.length)];
    },
    //object of letters in selected work and their positions
    // supports multiple instances of same letter in a word
    objKeysToMatch : {},
    //function that populates the objKeysToMach object
    addKeysToMatch : function () {
        choice = this.strWordChoice;
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
    //list of keys played
    arrKeysPlayed : [],
    //This will need to pickup the value of the event.key
    strSelectedKey : "",
    //boolKeyValidator needs code to examine key against valid keys. Look to regex for assitance
    boolKeyValidator: function () { },
    intMatches : 0,
    // TODO:change this to account for duplicate keys in word using arrKeysToMatch.length
    get intMatchWin() {
        return Object.keys(this.arrKeysToMatch).length;
    },
    //list of keys played that do not match the word.
    arrNegMatches : [],
    //number of missed selections before game ends with loss
    intMatchLose : 6,
    //function that plays each selected letter against the chosen word.
    playTheKey : function(){
        if(this.arrKeysPlayed.indexOf(this.strSelectedKey)){
                //TODO:code for actions if selected key already played.
                alert("Letter already played. Play another letter.");
                return;
            }
        else {
            this.arrKeysPlayed.push(this.strSelectedKey);
            if (this.arrKeysToMatch[this.strSelectedKey]) {
                //create intMatches
                this.intMatches++
                //TODO: add code to position keys onto playboard
        
                if (this.intMatches === this.intMatchWin) {
                    //TODO: code to indicate win to player and end game
                }
            }
            else {
                //add selected key to list of missed matches
                this.arrNegMatches.push(this.strSelectedKey)
                //code displaying updated unmatched keys needed
                if (this.arrNegMatches.length === this.intMatchLose) {
                    //code to indicate loss and end game.
                }
            }        
        }
    },
    setPlaceholders :  function(){
        for (i=0; i<Object.keys(this.objKeysToMatch).length;i++){
            var newLi = document.createElement("li");
            var placeholder = document.createTextNode("__");
            newLi.appendChild(placeholder);
            newLi.setAttribute("class", "letterPlacer");
            newLi.setAttribute("id","li" + i);
            document.getElementById("wordPlacer").appendChild(newLi);
        }
    },
}