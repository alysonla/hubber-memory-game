var matchingGame = {
    elapsedTime: 0
  , github: new GitHub()
};

matchingGame.deck = []

function getHubbers(callback) {
    function done (err, hubbers) {
        hubbers = shuffle(hubbers).slice(0, 8);

        if (err) {
            return callback({ hubbers: hubbers });
        }

        var complete = 0;
        for (var i = 0; i < hubbers.length; ++i) {
            (function (cHubber) {
                matchingGame.github.get("users/" + cHubber.login, function (err, user) {
                    if (err) {
                        console.warn(err);
                        if (++complete === hubbers.length) {
                            done(err, window.Hubbers);
                        }
                    } else {
                        cHubber.name = user.name;
                        if (++complete === hubbers.length) {
                            callback({ hubbers: hubbers });
                        }
                    }
                });
            })(hubbers[i]);
        }
    }

    matchingGame.github.get("orgs/github/members", { all: true }, function (err, data) {
        if (err) {
            console.warn(err);
            data = window.Hubbers;
        }
        done(err, data);
    });
}

// http://stackoverflow.com/a/2450976/1420197
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function selectCard() {
	if ($(".card-flipped").size() > 1) {
		return;
	}
	$(this).addClass("card-flipped");
	if ($(".card-flipped").size() == 2) {
		setTimeout(checkPattern,1400);
	}
}

function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd",removeTookCards);
	} else {
		$(".card-flipped").removeClass("card-flipped");
	}
}

function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

function removeTookCards() {
	$(".card-removed").remove();
	if ($(".card").length == 0) {
		gameover();
	}
}

function gameover() {
	clearInterval(matchingGame.timer);
	$(".score").html($("#elapsed-time").html());

	var lastScore = localStorage.getItem("last-score");
	lastScoreObj = JSON.parse(lastScore);
	if (lastScoreObj == null) {
		lastScoreObj = {"savedTime": "no record", "score": 0};
	}
	var lastElapsedTime = lastScoreObj.score;
	var minute = Math.floor(lastElapsedTime / 60);
	var second = lastElapsedTime % 60;
	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	$(".last-score").html(minute+":"+second);
	var savedTime = lastScoreObj.savedTime;
	$(".saved-time").html(savedTime);

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	var seconds = currentTime.getSeconds();
	if (seconds < 10) seconds = "0" + seconds;
	var now = day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
	var obj = {
		"savedTime": now,
		"score": matchingGame.elapsedTime
	};
	localStorage.setItem("last-score", JSON.stringify(obj));

	if (lastElapsedTime == 0 || matchingGame.elapsedTime < lastElapsedTime) {
		$(".ribbon").removeClass("hide");
	}

	$("#popup").removeClass("hide");
}

function countTimer() {
	matchingGame.elapsedTime++;
	var minute = Math.floor(matchingGame.elapsedTime / 60);
	var second = matchingGame.elapsedTime % 60;

	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	$("#elapsed-time").html(minute+":"+second);
}

$(function(){

    var $cards = $("#cards");
    var $loader = $("#loader");

    $cards.hide();
    getHubbers(function (hubbers) {
        for (var i = 0; i < hubbers.hubbers.length; ++i) {
            matchingGame.deck.push(hubbers.hubbers[i], hubbers.hubbers[i]);
        }
        shuffle(matchingGame.deck);
        for(var i=0;i<15;i++){
            $('.card:first-child').clone().appendTo($cards);
        }
        $cards.children().each(function(index) {
            var $this = $(this);
            $this.css({
                'left': ($this.width() + 15) * (index % 4),
                'top': ($this.height() + 15) * Math.floor(index / 4)
            });

            var Hubber = matchingGame.deck.pop();

            // This is some shit - we are going to dynamically apply css to the card(s).
            $this
                .css("background", "#efefef url(" + Hubber.avatar_url + ")")
                .css("background-size", "128px 128px")

            $this.attr("data-pattern",Hubber.login);

            if ($("[data-pattern="+Hubber.login+"] .name").text() == "" && Hubber.name) {
                $this.find(".name").text(Hubber.name);
            } else {
                $this.find(".login").text(Hubber.login);
            }

            $this.click(selectCard);
        });
        $cards.fadeIn();
        $loader.fadeOut();
        matchingGame.timer = setInterval(countTimer, 1000);
    });
});
