const notification = new WebNotification('#notification', 3500)
const phone = new Mask('#phone', '+00 (000) 0000-0000')
document.getElementById('notify-number').addEventListener('click', () => {
	notification.notify(document.getElementById('phone').value)
})
