type CardSuit = 'Diamonds' | 'Hearts' | 'Spades' | 'Clubs'

const cardSuits: CardSuit[] = [
	'Diamonds', 'Hearts', 'Spades', 'Clubs'
]

const cardSuitHTMLCodes = new Map<string, string>()
cardSuitHTMLCodes.set('Diamonds', '<span class="cardsuit red">&#9830;</span>')
cardSuitHTMLCodes.set('Hearts', '<span class="cardsuit red">&#9829;</span>')
cardSuitHTMLCodes.set('Spades', '<span class="cardsuit">&#9824;</span>')
cardSuitHTMLCodes.set('Clubs', '<span class="cardsuit">&#9827;</span>')


type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

const cardValues: CardValue[] = [
	'2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
]


class Card {
	suit: CardSuit
	value: CardValue

	constructor(suit: CardSuit, value: CardValue) {
		this.suit = suit
		this.value = value
	}

	matches(card: Card) {
		return (this.suit == card.suit && this.value == card.value)
	}

	toString() {
		return this.suit + ' ' + this.value
	}
}



class CardDeck {
	cards: Card[] = []
	
	constructor() {
		for (let suit of cardSuits) {
			for (let value of cardValues) {
				this.cards.push(new Card(suit, value))
			}
		}
	}

	shuffle() {
		this.cards.sort((a, b) => 0.5 - Math.random())
		for (let i = this.size - 1; i > 0; i--) {
			let randomIndex = Math.floor(Math.random() * i)
			let currentCard = this.cards[i]
			this.cards[i] = this.cards[randomIndex]
			this.cards[randomIndex] = currentCard
		}
	}

	drawFromTop(numOfCards: number) {
		return this.cards.splice(0, numOfCards)
	}

	addCardsToBottom(cards: Card[]) {
		this.cards.concat(cards)
	}

	hasCard(card: Card) {
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].matches(card)) {
				return true
			}
		}
		
		return false
	}

	get size() {
		return this.cards.length
	}
}