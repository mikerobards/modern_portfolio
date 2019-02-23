// variables
var simonPlays = []; // simon sequence array
var userPlays = []; // user sequence array
const numLevels = 20;
var level, id, color = 0;
var strict, error = false;

var boardSound = [
    'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
    'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
    'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
    'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
];

// start board sequence
$(document).ready(function () {
    $('.display').text(""); // no level displayed until Start or Strict btn is clicked

    // start button
    $('.start-btn').click(function () {
        // starts game not in strict mode. clicking also resets game
        strict = false;
        startGame();
    });

    // strict button
    $('.strict-btn').click(function () { // clicks strict btn
        // makes strict true. strict button works like start button for reset
        strict = true;
        startGame();
    });

    // restart/start game
    function startGame() {
        // sets error to false
        error = false;
        // sets level to 0
        level = 0;
        // adds one level
        level++;
        //resets simon and user arrays
        simonPlays = [];
        userPlays = [];
        simonSeries();
    }

    // user button click
    $('.simon-button').click(function () { // clicks simon buttons
        // id = the id of the simon button clicked
        id = $(this).attr("id");
        // color = class of the simon button pressed. not sure what .split is for!!
        color = $("#" + id).attr("class").split(" ")[1];
        // calls user series function
        userSeries();
    });

    // user series function
    function userSeries() {
        // adds button click to user array
        userPlays.push(id);
        console.log(id + " " + color);
        // calls light and sound function
        addClassSound(id, color);
        // checks user series
        if (!checkUserPlays()) {
            // if strict then reset
            if (strict) {
                console.log("strict");
                // resets simon array
                simonPlays = [];
                level = 1;
                error = false;
                simonSeries();
            }
            // makes error true
            error = true;
            // calls userError function
            userError();
            // resets user array
            userPlays = [];
            simonSeries();
        }
        //checks end of series
        else if (userPlays.length == simonPlays.length && userPlays.length < numLevels) {
            // if the length of user series and simon series and user series is less than 20 then level plus one
            level++;
            // reset user series and makes error false
            userPlays = [];
            error = false;
            simonSeries();
        }
        // checks for winner
        if (userPlays.length == numLevels) {
            displayWin();
        }
    }

    // check user series
    function checkUserPlays() {
        for (var i = 0; i < userPlays.length; i++) {
            if (userPlays[i] != simonPlays[i]) {
                return false;
            }
        }
        return true;
    }

    // user makes error
    function userError() {
        console.log('error!!');
        var count = 0;
        var myErr = setInterval(function () {
            $('.display').text("XX");
            count++;
            if (count == 3) {
                $('.display').text(level);
                clearInterval(myErr);
                userPlays = [];
                count = 0;
            }
        }, 1000);
        // repeat last simon series
    }

    // displays win
    function displayWin() {
        var count = 0;
        var winInt = setInterval(function () {
            $('.display').text("WIN");
            count++;
            if (count == 5) {
                $('.display').text("00");
                clearInterval(winInt);
                count = 0;
            }
        }, 500);
    }

    // simon series function
    function simonSeries() {
        console.log("level " + level);
        // displays current level
        $('.display').text(level);
        if (!error) {
            getRandomNum();
        }
        console.log(simonPlays);
        // lights and sounds of pad by Simon
        var i = 0;
        var light = setInterval(function () {
            id = simonPlays[i];
            color = $("#" + id).attr("class");
            color = color.split(" ")[1];
            console.log(id + " " + color);
            addClassSound(id, color);
            i++;
            if (i == simonPlays.length) {
                clearInterval(light);
            }
        }, 1000);
    }

    // generate random number
    function getRandomNum() {
        // generates number of 1 thru 4
        var random = Math.floor((Math.random() * 4) + 1);
        // pushes random number to simon array
        simonPlays.push(random);
        console.log(random);
    }

    // light simon button and play sound
    function addClassSound(id, color) {
        $("#" + id).addClass(color + "-active");
        playSound(id);
        setTimeout(function () {
            $("#" + id).removeClass(color + "-active");
        }, 500);
    }

    // play sound
    function playSound(id) {
        var sound = new Audio(boardSound[id - 1]);
        sound.play();
    }
});