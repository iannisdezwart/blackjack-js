var $ = function (query) { return document.querySelector(query); };
var round = 0;
var money = 1000;
var bet = 100;
$('.money').innerHTML = money.toString();
var deck = new CardDeck();
deck.shuffle();
var dealer = deck.drawFromTop(2);
var us = deck.drawFromTop(2);
var preDealer = true;
var usBusted = false;
var dealerBusted = false;
var restart = function () {
    round++;
    money -= bet;
    writeToConsole("Bet: " + bet + ", Money: " + money);
    $('.money').innerHTML = money.toString();
    deck = new CardDeck();
    deck.shuffle();
    dealer = deck.drawFromTop(2);
    us = deck.drawFromTop(2);
    preDealer = true;
    usBusted = false;
    dealerBusted = false;
    var hitButton = $('button.hit');
    hitButton.classList.remove('disabled');
    $('button.restart').classList.remove('green');
    var usTitle = $('.game-title-us');
    usTitle.classList.remove('red');
    var dealerTitle = $('.game-title-dealer');
    dealerTitle.classList.remove('red');
    $('.dealer').innerHTML = HTMLiseCard(dealer[0]) + "<div class=\"card\"></div>";
    $('.us').innerHTML = HTMLiseCard(us[0]) + HTMLiseCard(us[1]);
    calculateTotals();
};
var consoleEl = $('.console');
var writeToConsole = function (text) {
    var p = document.createElement('p');
    p.innerText = "Round " + round + ": " + text;
    consoleEl.appendChild(p);
    consoleEl.scrollTop = consoleEl.scrollHeight;
};
var HTMLiseCard = function (card) {
    return "<div class=\"card\">" + (cardSuitHTMLCodes.get(card.suit) + card.value) + "</div>";
};
var hit = function () {
    us.push.apply(us, deck.drawFromTop(1));
    $('.us').innerHTML += HTMLiseCard(us[us.length - 1]);
    calculateTotals();
};
var calculateTotals = function () {
    var usTotal = 0;
    for (var _i = 0, us_1 = us; _i < us_1.length; _i++) {
        var card = us_1[_i];
        usTotal += cardValueToNumber(card.value);
    }
    // Convert Aces to 1
    var aces = 0;
    for (var _a = 0, us_2 = us; _a < us_2.length; _a++) {
        var card = us_2[_a];
        if (card.value == 'A') {
            aces++;
        }
    }
    if (aces > 0) {
        while (aces > 0 && usTotal > 21) {
            usTotal -= 10;
            aces--;
        }
    }
    if (usTotal > 21 && !usBusted && preDealer) {
        bustUs();
    }
    $('.us-total').innerHTML = usTotal.toString();
    var dealerTotal = 0;
    if (preDealer) {
        dealerTotal += cardValueToNumber(dealer[0].value);
        $('.dealer-total').innerHTML = dealerTotal.toString();
    }
    else {
        for (var _b = 0, dealer_1 = dealer; _b < dealer_1.length; _b++) {
            var card = dealer_1[_b];
            dealerTotal += cardValueToNumber(card.value);
        }
        // Convert Aces to 1
        var aces_1 = 0;
        for (var _c = 0, dealer_2 = dealer; _c < dealer_2.length; _c++) {
            var card = dealer_2[_c];
            if (card.value == 'A') {
                aces_1++;
            }
        }
        if (aces_1 > 0) {
            while (aces_1 > 0 && dealerTotal > 21) {
                dealerTotal -= 10;
                aces_1--;
            }
        }
        $('.dealer-total').innerHTML = dealerTotal.toString();
        if (dealerTotal > 21 && !dealerBusted && preDealer) {
            bustDealer();
        }
    }
    return { usTotal: usTotal, dealerTotal: dealerTotal };
};
var cardValueToNumber = function (value) {
    if (['J', 'Q', 'K'].includes(value)) {
        return 10;
    }
    if (value == 'A') {
        return 11;
    }
    return parseInt(value);
};
var bustUs = function () {
    usBusted = true;
    var hitButton = $('button.hit');
    hitButton.classList.add('disabled');
    var usTitle = $('.game-title-us');
    usTitle.classList.add('red');
    stand();
};
var bustDealer = function () {
    dealerBusted = true;
    var dealerTitle = $('.game-title-dealer');
    dealerTitle.classList.add('red');
};
var stand = function () {
    preDealer = false;
    var _a = calculateTotals(), dealerTotal = _a.dealerTotal, usTotal = _a.usTotal;
    // Show Dealer's card
    $('.dealer').innerHTML = HTMLiseCard(dealer[0]) + HTMLiseCard(dealer[1]);
    // Let the Dealer draw cards
    while (dealerTotal < 17) {
        dealer.push.apply(dealer, deck.drawFromTop(1));
        $('.dealer').innerHTML += HTMLiseCard(dealer[dealer.length - 1]);
        dealerTotal = calculateTotals().dealerTotal;
    }
    calculateTotals();
    if (usTotal > 21) {
        writeToConsole('Dealer wins!');
        return;
    }
    if (dealerTotal > 21) {
        writeToConsole("We win! Got money: " + bet * 2);
        money += bet * 2;
        $('.money').innerHTML = money.toString();
        return;
    }
    if (usTotal > dealerTotal) {
        writeToConsole("We win! Got money: " + bet * 2);
        money += bet * 2;
        $('.money').innerHTML = money.toString();
    }
    else if (usTotal == dealerTotal) {
        writeToConsole("Tie! Got bet money back: " + bet);
        money += bet;
        $('.money').innerHTML = money.toString();
    }
    else {
        $('.money').innerHTML = money.toString();
        writeToConsole('Dealer wins!');
    }
    $('button.restart').classList.add('green');
};
// Start game
restart();
