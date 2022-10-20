'use strict'

let gElImgContainer
let gElDragImg
let gElDivider
let gElArrows
let elRoot
let gIsMouseDown = false

function onInit() {
    gElDragImg = document.querySelector('.hubble-img')
    gElDivider = document.querySelector('.divider')
    gElImgContainer = document.querySelector('.img-container')
    gElArrows = document.querySelector('.arrows')
    elRoot = document.documentElement

    gElImgContainer.onclick = setImgSideWidth
    gElImgContainer.onmousedown = setOnMouseDown
    gElImgContainer.onmouseup = setOnMouseUp
    gElDivider.onmousedown = setOnMouseDown
    gElArrows.onmousedown = setOnMouseDown
    gElDivider.onmouseup = setOnMouseUp
    gElArrows.onmouseup = setOnMouseUp

    document.onmousemove = (ev) => {
        if (!gIsMouseDown) return
        setImgSideWidth(ev)
    }
}

function setOnMouseDown() {
    gIsMouseDown = true
    setCssVarVal('--drag-cursor', 'grabbing')
}

function setOnMouseUp() {
    gIsMouseDown = false
    setCssVarVal('--drag-cursor', 'grab')
}

function setImgSideWidth(ev) {
    const imgContainerRect = gElImgContainer.getBoundingClientRect()
    const containerLeft = ev.x - imgContainerRect.left
    setCssVarVal('--left-img-width', containerLeft + 'px')
}


function getCssVarVal(cssVar) {
    const rootStyle = getComputedStyle(elRoot)
    const value = rootStyle.getPropertyValue(cssVar)
    return value
}

function setCssVarVal(cssVar, value) {
    elRoot.style.setProperty(cssVar, value)
}

