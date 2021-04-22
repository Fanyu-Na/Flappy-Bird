var dgame = document.querySelector('.game')
var dbird = document.querySelector('.bird')
var bstart = document.querySelector('.start')
var bscore = document.querySelector('.score')
var backgroundPositionX = 0
var backgroundPositionX_bird = 0

function moveSky() {
    backgroundPositionX -= 4;
    dgame.style.backgroundPositionX = backgroundPositionX + "px";
}

var moveSkyInt = setInterval(moveSky, 30)

function moveBird() {
    backgroundPositionX_bird -= 52
    dbird.style.backgroundPositionX = backgroundPositionX_bird + "px";
}

//小鸟移动计时器
var moveBirdInt = setInterval(moveBird, 100)


// 开始游戏的初始设置： 小鸟的位置 80px 235px ; 开始游戏按钮隐藏, 显示分数 取消小鸟跳动
var birdDownInt = null
document.querySelector('.start').addEventListener('click', function () {
    beginInit()
    birdDownInt = setInterval(birdDown, 30)
    createPipe()
})


var isBeginGame = false
var birdTop = 235

//游戏初始加载
function beginInit() {
    dbird.style.left = "80px"
    dbird.style.top = "235px"
    dbird.classList.remove('bird_fly')
    bstart.style.display = "none"
    bscore.style.display = "block"
    isBeginGame = true
    birdTop = 235
}

function birdDown() {
    if (birdTop >= 580) {
        return
    }
    birdTop += 3
    dbird.style.top = birdTop + "px"
}

document.querySelector('.game').addEventListener('click', function () {
    birdUp()
})

document.addEventListener('keydown', function (Key) {
    if (Key.keyCode == 32) {
        birdUp()
    }
})

function birdUp() {
    if (!isBeginGame) {
        return
    }
    if(isGameOver){
        return
    }
    birdTop -= 30
    if (birdTop <= 22) {
        birdTop = 22
    }
    dbird.style.top = birdTop + "px"
}

var pipeArr = []

function createPipe() {
    for (let index = 0; index <= 6; index++) {
        var upPipe = document.createElement('div')
        var upHeight = getRandomHeight()
        // var upHeight = 235
        upPipe.style.height = upHeight + 'px'
        upPipe.style.width = '52px'
        upPipe.style.background = 'url(img/pipe2.png)'
        upPipe.style.position = 'absolute'
        upPipe.style.left = 300 * (index + 1) + 'px'
        upPipe.style.backgroundPositionY = "bottom"
        dgame.appendChild(upPipe)

        var downPipe = document.createElement('div')
        downPipe.style.height = 600 - upHeight - 150 + 'px'
        downPipe.style.width = '52px'
        downPipe.style.background = 'url(img/pipe1.png)'
        downPipe.style.position = 'absolute'
        downPipe.style.left = 300 * (index + 1) + 'px'
        downPipe.style.top = upHeight + 150 + 'px'
        dgame.appendChild(downPipe)

        pipeArr.push({
            up: upPipe,
            down: downPipe
        })
    }
}

function getRandomHeight() {
    return parseInt(Math.random() * 250) + 100
}

var firstIndex = 0
var lastIndex = 6

function movePipes() {
    for (let index = 0; index < pipeArr.length; index++) {
        var currentLeft = pipeArr[index].up.offsetLeft
        // console.log(currentLeft)
        if (currentLeft > 2 && currentLeft < 106) {
            pipeCheck()
            // console.log("check")
        } else if (currentLeft >= 1 && currentLeft < 2) {
            bscore.innerText = parseInt(bscore.innerText) + 1
            // document.querySelector('.score').innerText(parseInt(document.querySelector('.score').innerText()) + 1)
            // $('.score').text(parseInt($('.score').text()) + 1)
        }

        if (currentLeft < -52) {
            // 第一根柱子移出屏幕外,要把第一根柱子移动到最后一跟柱子后面300px位置,更新firstIndex,lastIndex的值
            pipeArr[index].up.style.left = pipeArr[lastIndex].up.offsetLeft + 300 + 'px'
            pipeArr[index].down.style.left = pipeArr[lastIndex].up.offsetLeft + 300 + 'px'
            lastIndex = firstIndex
            firstIndex = firstIndex == 6 ? 0 : firstIndex + 1
        } else {
            currentLeft -= 1
            pipeArr[index].up.style.left = currentLeft + 'px'
            pipeArr[index].down.style.left = currentLeft + 'px'
        }
    }
}
//柱子移动计时器
var MovePipesInt = setInterval(movePipes, 7.5)

//游戏结束 停止小鸟降落 上升 扇翅膀 背景移动 柱子移动
isGameOver = false
function gameOver(message) {
    isGameOver = true
    clearInterval(MovePipesInt)//移除柱子移动
    clearInterval(birdDownInt)//小鸟降落
    clearInterval(moveSkyInt)//背景移动
    clearInterval(moveBirdInt)//扇翅膀
    document.querySelector('.currentScore').innerText = bscore.innerText
    document.querySelector('.end').style.display = "block"
}

//重新开始游戏
//重置所有柱子左边距 分数 小鸟位置 标志:恢复初始值 隐藏蒙层

document.querySelector('.restart').addEventListener('click', function () {
    for (let index = 0; index < pipeArr.length; index++) {
        pipeArr[index].up.style.left = 300*(index+1) + 'px'
        pipeArr[index].down.style.left = 300*(index+1) + 'px'
    }
    firstIndex = 0
    lastIndex = 6
    document.querySelector('.end').style.display = "none"
    dbird.style.top = "235px"
    birdTop = 235
    moveSkyInt = setInterval(moveSky, 30)
    moveBirdInt = setInterval(moveBird, 100)
    MovePipesInt = setInterval(movePipes, 7.5)
    birdDownInt = setInterval(birdDown, 30)
    bscore.innerText = 0
    isGameOver = false
    // createPipe()
})

function pipeCheck() {
    //获取第一根上柱子的高度
    var firstUpHeight = pipeArr[firstIndex].up.offsetHeight
    //获取第一根下柱子的top值
    var firstDownTop = pipeArr[firstIndex].down.offsetTop
    //小鸟的top值,小鸟的top值,birdTop,小鸟的高度固定45
    if (birdTop - 23 < firstUpHeight) {//跟上柱子发送碰撞
        gameOver('跟上柱子发送碰撞')
    } else if (birdTop + 23 > firstDownTop) {//跟下柱子发生碰撞
        gameOver('跟下柱子发生碰撞')
    }
}

