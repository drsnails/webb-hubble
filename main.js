'use strict'

let gElImgContainer
let gElDragImg
let gElDivider
let gElArrows
let elRoot
let gIsMouseDown = false
let gIsTransition = false
let gImgIdx = 0

const stellarImgs = [
    { name: 'pillars', ratio: '256/267', displayName: 'Pillars of Creation' },
    { name: 'southern', ratio: '175/163', displayName: 'Southern Ring Nebula' },
    { name: 'tarantula', ratio: '140/81', displayName: 'Tarantula Nebula' },
    { name: 'carina', ratio: '1400/811', displayName: 'Carina Nebula' },
    { name: 'cartwheel', ratio: '2800/2577', displayName: 'Cartwheel Galaxy' },
    { name: 'deep_field', ratio: '1399/1428', displayName: 'Deep Field' },
    { name: 'quintet', ratio: '700/671', displayName: "Stephan's Quintet" },
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

    gElImgContainer.onmousedown = (ev) => {
        ev.stopPropagation()
        setOnMouseDown()
        setCssVarVal('--transition-time', '0.2s')
        gIsTransition = true
        setImgWidth(ev)
    }


    document.onmousemove = (ev) => {
        let dividerPosX = gElDivider.getBoundingClientRect().x
        if (ev.x < dividerPosX + 50 && ev.x > dividerPosX - 50) {
            setCssVarVal('--transition-time', '0s')
            gIsTransition = false
        }
        if (gIsMouseDown && !gIsTransition) {
            setImgWidth(ev)
        }

    }

    document.onmouseup = setOnMouseUp

}

function renderImg() {
    const stellarImg = stellarImgs[gImgIdx]
    console.log('gImgIdx:', gImgIdx)
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


function setImgWidth(ev) {
    const imgContainerRect = gElImgContainer.getBoundingClientRect()
    let leftImgWidth = ev.x - imgContainerRect.left
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

function getCssVarVal(cssVar) {
    const rootStyle = getComputedStyle(elRoot)
    const value = rootStyle.getPropertyValue(cssVar)
    return value
}

function setCssVarVal(cssVar, value) {
    elRoot.style.setProperty(cssVar, value)
}

