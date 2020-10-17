class Mask {
	_mask
	_cards = {
		['0']: /\d/,
		['_']: /[A-Za-z]/,
		['?']: /[A-Za-z0-9]/,
		['*']: /./,
	}

	constructor(target, mask) {
		if (typeof mask === 'string') {
			this._mask = mask
		}
		if (target) {
			this.applyTo(target)
		}
	}

	applyTo(el) {
		if (typeof el === 'string') {
			el = document.querySelector(el)
		}
		this._applyToElement(el)
	}

	applyToAll(elements) {
		if (typeof elements === 'string') {
			elements = document.querySelectorAll(elements)
		}
		for (let el of elements) {
			this._applyToElement(el)
		}
	}

	match(card, regex) {
		this._cards[card] = regex
	}

	unmatch(card) {
		delete this._cards[card]
	}

	_applyToElement(el) {
		if (!(el instanceof HTMLElement)) {
			return
		}
		el.addEventListener('input', (ev) => {
			const value = ev.target.value.trim()
			if (value === '') {
				return
			}
			let cursor = 0
			let maskedValue = ''
			let valPos = 0
			for (
				let maskMatchPos = 0;
				maskMatchPos < this._mask.length;
				++maskMatchPos
			) {
				const maskCh = this._mask.charAt(maskMatchPos)
				const ch = value.charAt(valPos)
				if (this._cards[maskCh]) {
					if (ch.match(this._cards[maskCh])) {
						maskedValue += ch
						cursor = maskMatchPos + 1
						valPos++
					} else {
						break
					}
				} else {
					if (maskCh === ch) {
						valPos++
					}
					if (valPos < value.length) {
						maskedValue += maskCh
						cursor = maskMatchPos
					}
					continue
				}
			}
			maskedValue = maskedValue.slice(0, cursor)
			ev.target.value = maskedValue
		})
	}
}
