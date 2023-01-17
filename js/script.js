var myGamePiece
var myBackground
var myObstacles = []
var lineScore =[]
var myCoins = []
var myScore
var score = 0  


function startGame() {
    myGamePiece = new component(130, 90, "images/balondown.png", 100 , 120, "image")
    myBackground = new component(window.innerWidth, window.innerHeight, "images/siang.png", 0, 0, "background")
    myScore = new component ("20px", "sans-serif", "black", 0, 20, "text");
    myGameArea.start()
}


var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.frameNo = 0
        this.interval = setInterval(updateGameArea, 20)
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    stop: function() {
        clearInterval(this.interval)
    }
}

function component(width, height, color, x, y, type) {
    this.type = type
    if (this.type == "image" || type == "background") {
        this.image = new Image()
        this.image.src = color
    }
    this.width = width
    this.height = height
    this.speedX = 0
    this.speedY = 0
    this.gravity = 0.1
    this.gravitySpeed = 0
    this.x = x
    this.y = y
    this.update = function() {
        ctx = myGameArea.context
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height
            ctx.fillStyle = color
            ctx.fillText(this.text, this.x, this.y,)
        }
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)           
            }
        } else {
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity
        this.x += this.speedX
        this.y += this.speedY + this.gravitySpeed
        this.hit()
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0
            }
        }
    }
    this.hit = function() {
        var rockbottom = myGameArea.canvas.height - this.height
        if (this.y > rockbottom) {
            this.y = rockbottom
        } else if (myGamePiece.y >= myGameArea.canvas.height -32) {
            setTimeout(function(){
                window.location.reload()
            },500)
            return;
        } else if (myGamePiece.y <= 0) {
            setTimeout(function(){
                window.location.reload()
            },500)
            return;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y 
        var mybottom = this.y + (this.height)
        var otherleft = otherobj.x
        var otherright = otherobj.x + (otherobj.width)
        var othertop = otherobj.y
        var otherbottom = otherobj.y + (otherobj.height)
        var crash = true 
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false 
        }
        return crash
    } 
    this.point = function (otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y 
        var mybottom = this.y + (this.height)
        var otherleft = otherobj.x 
        var otherright = otherobj.x + (otherobj.width)
        var othertop = otherobj.y 
        var otherbottom = otherobj.y + (otherobj.height)
        var point = true
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)){
            point = false 
        }
        return point
    }
    this.coin = function (otherobj) {
        var myleft = this.x
        var myright = this.x + (this.width)
        var mytop = this.y 
        var mybottom = this.y + (this.height)
        var otherleft = otherobj.x 
        var otherright = otherobj.x + (otherobj.width)
        var othertop = otherobj.y 
        var otherbottom = otherobj.y + (otherobj.height)
        var point = true
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)){
            point = false 
        }
        return point
    }
   
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap
    for (i = 0; i < myObstacles.length; i += 1 ){
        if (myGamePiece.crashWith(myObstacles[i])){
            setTimeout(function(){
                window.location.reload()
            },500)
            return;
        }
    }
    for (i = 0; i < lineScore.length; i += 1){
        if (myGamePiece.point(lineScore[i])){
            score = score + 1
        }
    }
    for (i = 0; i < lineScore.length; i += 1){
        if (myGamePiece.coin(myCoins[i])){
            myCoins.shift()
        }
    }
    myGameArea.clear()
    myBackground.speedX = -8
    myBackground.newPos()
    myBackground.update()
    myGameArea.frameNo += 1
    if (myGameArea.frameNo == 1 || everyInterval(80)){
        x = myGameArea.canvas.width
        minHeight = 150
        maxHeight = 300
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)
        minGap = 250
        maxGap = 400
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minHeight)
        myObstacles.push(new component(90, height, "images/kaktustop.png", x, 0, "image"))
        myObstacles.push(new component(90, x - height - gap, "images/kaktusdown.png", x, height + gap, "image"))
        myCoins.push (new component(50, 50, "images/cone.png", x, height - gap - 150, "image"))
        lineScore.push(new component(15, 300, "transparent", x + 25, height + gap -125))
    }
    for (i = 0; i < myObstacles.length; i += 1){
        myObstacles[i].x += -8
        myObstacles[i].update()
    }

    for (i = 0; i < lineScore.length; i += 1){
        lineScore[i].x += -8
        lineScore[i].update()
    }
    for (i = 0; i < myCoins.length; i += 1){
        myCoins[i].x += -8
        myCoins[i].update()
    }

    myScore.text = "SCORE : " + (Math.round(score / 10))
    myScore.update()
    myGamePiece.newPos()
    myGamePiece.update()
}

function everyInterval(n) {
    if((myGameArea.frameNo / n) % 1 == 0) {
        return true
    }
    return false
}

function accelerate(n) {
    myGamePiece.gravity = n
}

document.body.addEventListener("keydown", (event) => {
    if(event.code === "Space"){
        myGamePiece.speedY = -2
        accelerate(-0.1)
        myGamePiece.image.src = "images/balonup.png"
    }
})
document.body.addEventListener("keyup", (event) => {
    if(event.code === "Space"){
        myGamePiece.speedY = +2
        accelerate(0.1)
        myGamePiece.image.src = "images/balondown.png"
    }
})