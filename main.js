'use strict'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
let gElImgContainer
let gElDragImg
let gElDivider
let gElArrows
let elRoot
let gIsMouseDown = false
let gIsTransition = false
let gImgIdx = 0
let gZoomLevel = 65
let gIsFirst = true

const stellarImgs = [
    { name: 'carina', ratio: '1400/811', displayName: 'Carina Nebula' },
    { name: 'deep_field', ratio: '1399/1428', displayName: 'Deep Field' },
    { name: 'southern', ratio: '175/163', displayName: 'Southern Ring Nebula' },
    { name: 'cartwheel', ratio: '2800/2577', displayName: 'Cartwheel Galaxy' },
    { name: 'quintet', ratio: '700/671', displayName: "Stephan's Quintet" },
    { name: 'tarantula', ratio: '140/81', displayName: 'Tarantula Nebula' },
    { name: 'pillars', ratio: '256/267', displayName: 'Pillars of Creation' },
]

function onInit() {
    gElDragImg = document.querySelector('.hubble-img')
    gElDivider = document.querySelector('.divider')
    gElImgContainer = document.querySelector('.img-container')
    gElArrows = document.querySelector('.arrows')

    elRoot = document.documentElement
    gImgIdx = +localStorage.imgIdx || 0
    localStorage.imgIdx ??= gImgIdx
    addEventListeners()
    renderImg()


}

function addEventListeners() {

    gElImgContainer.onmousedown = onDown
    gElImgContainer.ontouchstart = onDown
    
    document.onmousemove = onMove
    document.ontouchmove = onMove

    document.onmouseup = setOnMouseUp
    document.ontouchend = setOnMouseUp

}

function renderImg() {
    const stellarImg = stellarImgs[gImgIdx]
    gElImgContainer.style.aspectRatio = stellarImg.ratio
    document.querySelector('.hubble-img').style.backgroundImage = `url("img/${stellarImg.name}/hubble.jpeg")`
    document.querySelector('.webb-img').style.backgroundImage = `url("img/${stellarImg.name}/webb.jpeg")`
    document.querySelector('.page-num').innerText = +gImgIdx + 1
    document.querySelector('h2:first-of-type').innerText = stellarImg.displayName
}


function setOnMouseDown(ev) {
    gIsMouseDown = true
    setCssVarVal('--drag-cursor', 'grabbing')

}

function setOnMouseUp(ev) {
    gIsMouseDown = false
    setCssVarVal('--drag-cursor', 'grab')
}

function onDown(ev) {
    ev.stopPropagation()
    setOnMouseDown()
    setCssVarVal('--transition-time', '0.2s')
    gIsTransition = true
    setImgWidth(ev)
}


function onMove(ev) {
    let dividerPosX = gElDivider.getBoundingClientRect().x
    const evPos = getEvPos(ev)
    if (evPos.x < dividerPosX + 50 && evPos.x > dividerPosX - 50) {
        setCssVarVal('--transition-time', '0s')
        gIsTransition = false
    }
    if (gIsMouseDown && !gIsTransition) {
        setImgWidth(ev)
    }
}

function setImgWidth(ev) {
    const imgContainerRect = gElImgContainer.getBoundingClientRect()
    const evPos = getEvPos(ev)
    let leftImgWidth = evPos.x - imgContainerRect.left
    leftImgWidth = Math.min(leftImgWidth, imgContainerRect.width)
    leftImgWidth = Math.max(leftImgWidth, 0)
    setCssVarVal('--left-img-width', leftImgWidth + 'px')
}

function onNextPrevImg(diff) {
    gImgIdx += diff
    if (gImgIdx === stellarImgs.length) gImgIdx = 0
    if (gImgIdx === -1) gImgIdx = stellarImgs.length - 1
    localStorage.imgIdx = gImgIdx
    renderImg()
}


function onZoomInOut(diff) {
    gZoomLevel += diff
    setCssVarVal('--container-size', gZoomLevel + 'vw')
}



function getEvPos(ev) {
    var pos = {
        x: ev.x,
        y: ev.y
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function getCssVarVal(cssVar) {
    const rootStyle = getComputedStyle(elRoot)
    const value = rootStyle.getPropertyValue(cssVar)
    return value
}

function setCssVarVal(cssVar, value) {
    elRoot.style.setProperty(cssVar, value)
}

