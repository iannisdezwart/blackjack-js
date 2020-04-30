var cardSuits = [
    'Diamonds', 'Hearts', 'Spades', 'Clubs'
];
var cardSuitHTMLCodes = new Map();
cardSuitHTMLCodes.set('Diamonds', '<span class="cardsuit red">&#9830;</span>');
cardSuitHTMLCodes.set('Hearts', '<span class="cardsuit red">&#9829;</span>');
cardSuitHTMLCodes.set('Spades', '<span class="cardsuit">&#9824;</span>');
cardSuitHTMLCodes.set('Clubs', '<span class="cardsuit">&#9827;</span>');
var cardValues = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
];
var Card = /** @class */ (function () {
    function Card(suit, value) {
        this.suit = suit;
        this.value = value;
    }
    Card.prototype.matches = function (card) {
        return (this.suit == card.suit && this.value == card.value);
    };
    Card.prototype.toString = function () {
        return this.suit + ' ' + this.value;
    };
    return Card;
}());
var CardDeck = /** @class */ (function () {
    function CardDeck() {
        this.cards = [];
        for (var _i = 0, cardSuits_1 = cardSuits; _i < cardSuits_1.length; _i++) {
            var suit = cardSuits_1[_i];
            for (var _a = 0, cardValues_1 = cardValues; _a < cardValues_1.length; _a++) {
                var value = cardValues_1[_a];
                this.cards.push(new Card(suit, value));
            }
        }
    }
    CardDeck.prototype.shuffle = function () {
        this.cards.sort(function (a, b) { return 0.5 - Math.random(); });
        for (var i = this.size - 1; i > 0; i--) {
            var randomIndex = Math.floor(Math.random() * i);
            var currentCard = this.cards[i];
            this.cards[i] = this.cards[randomIndex];
            this.cards[randomIndex] = currentCard;
        }
    };
    CardDeck.prototype.drawFromTop = function (numOfCards) {
        return this.cards.splice(0, numOfCards);
    };
    CardDeck.prototype.addCardsToBottom = function (cards) {
        this.cards.concat(cards);
    };
    CardDeck.prototype.hasCard = function (card) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].matches(card)) {
                return true;
            }
        }
        return false;
    };
    Object.defineProperty(CardDeck.prototype, "size", {
        get: function () {
            return this.cards.length;
        },
        enumerable: true,
        configurable: true
    });
    return CardDeck;
}());
