const $ = (query: string) => document.querySelector(query)

let round = 0

let money = 1000
let bet = 100

$('.money').innerHTML = money.toString()

let deck = new CardDeck()
deck.shuffle()

let dealer: Card[] = deck.drawFromTop(2)
let us: Card[] = deck.drawFromTop(2)

let preDealer = true

let usBusted = false
let dealerBusted = false

const restart = () => {
	round++

	money -= bet

	writeToConsole(`Bet: ${ bet }, Money: ${ money }`)

	$('.money').innerHTML = money.toString()

	deck = new CardDeck()
	deck.shuffle()

	dealer = deck.drawFromTop(2)
	us = deck.drawFromTop(2)

	preDealer = true

	usBusted = false
	dealerBusted = false

	const hitButton = $('button.hit') as HTMLButtonElement
	hitButton.classList.remove('disabled')

	$('button.restart').classList.remove('green')

	const usTitle = $('.game-title-us')
	usTitle.classList.remove('red')

	const dealerTitle = $('.game-title-dealer')
	dealerTitle.classList.remove('red')

	$('.dealer').innerHTML = HTMLiseCard(dealer[0]) + `<div class="card"></div>`

	$('.us').innerHTML = HTMLiseCard(us[0]) + HTMLiseCard(us[1])

	calculateTotals()
}

const consoleEl = $('.console') as HTMLDivElement
	
const writeToConsole = (text: string) => {
	let p = document.createElement('p')
	p.innerText = `Round ${ round }: ${ text }`
	consoleEl.appendChild(p)
	consoleEl.scrollTop = consoleEl.scrollHeight
}

const HTMLiseCard = (card: Card) => {
	return `<div class="card">${ cardSuitHTMLCodes.get(card.suit) + card.value }</div>`
}

const hit = () => {
	us.push(...deck.drawFromTop(1))

	$('.us').innerHTML += HTMLiseCard(us[us.length - 1])

	calculateTotals()
}

const calculateTotals = () => {
	let usTotal = 0

	for (let card of us) {
		usTotal += cardValueToNumber(card.value)
	}

	// Convert Aces to 1
	
	let aces = 0

	for (let card of us) {
		if (card.value == 'A') {
			aces++
		}
	}

	if (aces > 0) {
		while (aces > 0 && usTotal > 21) {
			usTotal -= 10
			aces--
		}
	}

	if (usTotal > 21 && !usBusted && preDealer) {
		bustUs()
	}

	$('.us-total').innerHTML = usTotal.toString()

	let dealerTotal = 0

	if (preDealer) {
		dealerTotal += cardValueToNumber(dealer[0].value)
		$('.dealer-total').innerHTML = dealerTotal.toString()
	} else {
		for (let card of dealer) {
			dealerTotal += cardValueToNumber(card.value)
		}
	
		// Convert Aces to 1
	
		let aces = 0

		for (let card of dealer) {
			if (card.value == 'A') {
				aces++
			}
		}

		if (aces > 0) {
			while (aces > 0 && dealerTotal > 21) {
				dealerTotal -= 10
				aces--
			}
		}

		$('.dealer-total').innerHTML = dealerTotal.toString()

		if (dealerTotal > 21 && !dealerBusted && preDealer) {
			bustDealer()
		}
	}

	return { usTotal, dealerTotal }
}

const cardValueToNumber = (value: CardValue) => {
	if ([ 'J', 'Q', 'K' ].includes(value)) {
		return 10
	}

	if (value == 'A') {
		return 11
	}

	return parseInt(value)
}

const bustUs = () => {
	usBusted = true

	const hitButton = $('button.hit') as HTMLButtonElement
	hitButton.classList.add('disabled')

	const usTitle = $('.game-title-us')
	usTitle.classList.add('red')

	stand()
}

const bustDealer = () => {
	dealerBusted = true

	const dealerTitle = $('.game-title-dealer')
	dealerTitle.classList.add('red')
}

const stand = () => {
	preDealer = false

	let { dealerTotal, usTotal } = calculateTotals()

	// Show Dealer's card
	$('.dealer').innerHTML = HTMLiseCard(dealer[0]) + HTMLiseCard(dealer[1])

	// Let the Dealer draw cards
	while (dealerTotal < 17) {
		dealer.push(...deck.drawFromTop(1))

		$('.dealer').innerHTML += HTMLiseCard(dealer[dealer.length - 1])

		dealerTotal = calculateTotals().dealerTotal
	}

	calculateTotals()

	if (usTotal > 21) {
		writeToConsole('Dealer wins!')
		return
	}

	if (dealerTotal > 21) {
		writeToConsole(`We win! Got money: ${ bet * 2 }`)

		money += bet * 2
		$('.money').innerHTML = money.toString()

		return
	}

	if (usTotal > dealerTotal) {
		writeToConsole(`We win! Got money: ${ bet * 2 }`)

		money += bet * 2
		$('.money').innerHTML = money.toString()
	} else if (usTotal == dealerTotal) {
		writeToConsole(`Tie! Got bet money back: ${ bet }`)

		money += bet
		$('.money').innerHTML = money.toString()
	} else {
		$('.money').innerHTML = money.toString()
		writeToConsole('Dealer wins!')
	}

	$('button.restart').classList.add('green')
}

// Start game

restart()