function print(...values) {
const sep = ' '
let textToShow = values.reduce((str, value, idx) => {
if (typeof value === 'object') value = JSON.stringify(value)
str += (idx) ? sep + value : value
return str
}, '')
textToShow = (textToShow + '').replace(/ /g, '&nbsp')
document.querySelector('.print-board').innerHTML += ('<li>'+textToShow+'</li>')
}
function clear() {
document.querySelector('.print-board').innerHTML = ''
}
function fontSize(size, unit = 'px') {
document.querySelector('.print-board').style.fontSize = size + unit
}
function setColor(color = '#000') {
document.querySelector('.print-board').style.color = color
}
