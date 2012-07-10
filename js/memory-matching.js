var matchingGame = {
	attempts: 0
};

matchingGame.deck = [
	'cardAK', 'cardAK',
	'cardAQ', 'cardAQ',
	'cardBK', 'cardBK',
	'cardBQ', 'cardBQ',
	'cardCK', 'cardCK',
	'cardCQ', 'cardCQ',
	'cardDK', 'cardDK',
	'cardDQ', 'cardDQ',
];

function shuffle() {
	return 0.5 - Math.random();
}

function selectCard() {
	if ($(".card-flipped").size() > 1) {
		return;
	}
	$(this).addClass("card-flipped");
	if ($(".card-flipped").size() == 2) {
		setTimeout(checkPattern,700);
	}
}

function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd",removeTookCards);
	} else {
		$(".card-flipped").removeClass("card-flipped");
	}
	matchingGame.attempts++;
	$('#attempts').html(matchingGame.attempts);
}

function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

function removeTookCards() {
	$(".card-removed").remove();
}

$(function(){
	matchingGame.deck.sort(shuffle);
	for(var i=0;i<15;i++){
		$('.card:first-child').clone().appendTo('#cards');
	}
	$('#cards').children().each(function(index) {
		$(this).css({
			'left': ($(this).width() + 20) * (index % 4),
			'top': ($(this).height() + 20) * Math.floor(index / 4)
		});
		var pattern = matchingGame.deck.pop();
		$(this).find(".back").addClass(pattern);
		$(this).attr("data-pattern",pattern);
		$(this).click(selectCard);
	});	
});
