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
let gIsMobile = false

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
    gIsMobile = mobileCheck()
    gZoomLevel = gIsMobile ? 99 : 65
    alert(gZoomLevel)
    elRoot = document.documentElement
    gImgIdx = +localStorage.imgIdx || 0
    localStorage.imgIdx ??= gImgIdx
    addEventListeners()
    renderImg()
    setCssVarVal('--container-size', gZoomLevel + 'vw')


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
    if (gIsMobile && gZoomLevel > 99) gZoomLevel = 99
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

function mobileCheck() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function getCssVarVal(cssVar) {
    const rootStyle = getComputedStyle(elRoot)
    const value = rootStyle.getPropertyValue(cssVar)
    return value
}

function setCssVarVal(cssVar, value) {
    elRoot.style.setProperty(cssVar, value)
}

