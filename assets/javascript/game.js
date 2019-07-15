var objGame = {
    //function to load wordlist needed
    arrWordList : ["bandersnatch", "giggledick"],
    strWordChoice : function () {
        this.arrWordList[Math.floor(Math.random() * arrWordList.length)];
    },
    arrKeysToMatch : {},
    addKeysToMatch : function (choice = this.strWordChoice) {
        for (i = 0; i < choice.length; i++) {
            var strLetter = choice[i];
            if (objGame.arrKeysToMatch[strLetter]) {
                objGame.arrKeysToMatch[strLetter].push(i);
            }
            else {
            objGame.arrKeysToMatch[strLetter] = [i];
            }
        }
    },
    arrKeysPlayed : [],
    strSelectedKey : event.key,
    //boolKeyValidator needs code to examine key against valid keys. Look to regex for assitance
    boolKeyValidator: function () { },
    intMatches : 0,
    intMatchWin : this.strWordChoice ,
    playTheKey : function(key = this.strSelectedKey){

    },
}









//need validator to verify proper key selected (a-z).
//check to see if key played    
if(arrKeysPlayed.indexOf(strSelectedKey)){
        //code for actions if selected key already played.
    }
else {
    arrKeysPlayed.push(strSelectedKey);
    if (objGame[strSelectedKey]) {
        //create intMatches
        intMatches = intMatches++
        //add code to position keys onto playboard

        if (intMatches === intMatchWin) {
            //code to indicate win to player and end game
        }

    }
    else {
        //array holding unmatched keys needed
        arrNegMatches.push(strSelectedKey)
        //code displaying updated unmatched keys needed
        //arrNegMatches needs creation
        if (arrNegMatches.length === intMatchLose) {
            //code to indicate loss and end game.
        }
    }

}



// function makeDashes() {

//     var strDashes = "-"
//     for(i=0;i<strWordChoice.length;i++){
//     strDashes += " -";


//     }
//     console.log(strDashes);
// }





