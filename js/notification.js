class WebNotification {
	_el
	_timeout
	_updated = false
	_forciblyDismiss = () => this.dismiss()
	_dismissOnTimeout = () => {
		if (this._updated) {
			this._updated = false
			setTimeout(this._dismissOnTimeout, this.timeout)
		} else {
			this.dismiss()
		}
	}

	/**
	 * Creates a new object that handles the emission and dismissal of
	 * in-webpage notifications.
	 *
	 * The notifications will appear on the bottom-right corner of the screen
	 * on desktops, and on bottom on mobile. Clicking on the notification will
	 * dismiss it.
	 *
	 * @param { string | HTMLElement } el emitter element
	 * @param { number } timeoutMilliseconds time, in milliseconds, until auto-dismissal, defaults to 3500 ms
	 */
	constructor(el, timeoutMilliseconds) {
		this.notifier = el
		this.timeout = timeoutMilliseconds
	}

	get notifier() {
		return this._el
	}

	set notifier(el) {
		if (typeof el === 'string') {
			this._el = document.querySelector(el)
		} else if (el instanceof HTMLElement) {
			this._el = el
		}
		this._el.addEventListener('click', this._forciblyDismiss)
		this._el.classList.add('notification-emitter')
	}

	get timeout() {
		return this._timeout
	}

	set timeout(milliseconds) {
		if (milliseconds && milliseconds > 0) {
			this._timeout = milliseconds
		} else {
			this._timeout = 3500
		}
	}

	/**
	 * Emmits a notification.
	 *
	 * If called whilst still active, the body of the notification will be
	 * replaced and its timeout reset.
	 *
	 * @param { string | Element } content body of the notification
	 */
	notify(content) {
		if (content instanceof Element) {
			this.notifier.innerHTML = ''
			this.notifier.appendChild(content)
		} else {
			this.notifier.innerHTML = content.toString()
		}
		if (this.notifier.classList.contains('active')) {
			this._updated = true
		} else {
			this.notifier.classList.add('active')
			setTimeout(this._dismissOnTimeout, this.timeout)
		}
	}

	/**
	 * Dismisses the current notification
	 */
	dismiss() {
		this._updated = false
		this.notifier.classList.remove('active')
	}
}
