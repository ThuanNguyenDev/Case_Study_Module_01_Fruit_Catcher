window.onload = function () {

    let myBackgroundMusic = new Audio();
    myBackgroundMusic.src = "musicbackground.mp3";

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let canvasBack = document.getElementById("backgroundCanvas");
    let contextBack = canvasBack.getContext("2d");
    let timer;
    let hiscore = 0;
    let background = new Image();
    background.src = 'images/back2.jpg';
    let player;
    let fruits = [];
    let numberOfFruits = 15;

    function Player() {
        this.gameOver = false;
        this.score = 0;
        this.fruitsCollected = 0;
        this.fruitsMissed = 0;
        this.playerWidth = 250;
        this.playerHeight = 100;
        this.playerSpeed = 30;
        this.x = canvas.width / 2;
        this.y = canvas.height - this.playerHeight;
        this.playerImage = new Image();
        this.playerImage.src = 'images/basket2.png';

        this.render = function () {
            context.drawImage(this.playerImage, this.x, this.y);
        }


        this.moveLeft = function () {
            if (this.x > 0) {
                this.x -= this.playerSpeed;
            }
        }

        this.moveRight = function () {
            if (this.x < canvas.width - this.playerWidth + 100) {
                this.x += this.playerSpeed;
            }
        }
    }


    function Fruit() {
        this.fruitNumber = Math.floor(Math.random() * 5);
        this.fruitType = "";
        this.fruitScore = 0;
        this.fruitWidth = 50;
        this.fruitHeight = 50;
        this.fruitImage = new Image();
        this.fruitSpeed = Math.floor(Math.random() * 2.5 + 1);
        this.x = Math.random() * (canvas.width - this.fruitWidth);
        this.y = Math.random() * -canvas.height - this.fruitHeight;


        this.chooseFruit = function () {
            if (this.fruitNumber == 0) {
                this.fruitType = "banana";
                this.fruitScore = 10 * this.fruitSpeed;
                this.fruitImage.src = 'images/banana2.png';
            }
            else if (this.fruitNumber == 1) {
                this.fruitType = "apple";
                this.fruitScore = 10 * this.fruitSpeed;
                this.fruitImage.src = 'images/apple2.png';
            }
            else if (this.fruitNumber == 2) {
                this.fruitType = "orange";
                this.fruitScore = 10 * this.fruitSpeed;
                this.fruitImage.src = 'images/orange2.png';
            }
            else if (this.fruitNumber == 3) {
                this.fruitType = "pineapple";
                this.fruitScore = 20 * this.fruitSpeed;
                this.fruitImage.src = 'images/pineapple2.png';
            }
            else if (this.fruitNumber == 4) {
                this.fruitType = "melon";
                this.fruitScore = 20 * this.fruitSpeed;
                this.fruitImage.src = 'images/melon2.png';
            }
        }


        this.fall = function () {
            if (this.y < canvas.height - this.fruitHeight) {
                this.y += this.fruitSpeed;
            }
            else {
                player.fruitsMissed += 1;
                this.changeState();
                this.chooseFruit();
            }
            this.checkIfCaught();
        }


        this.checkIfCaught = function () {
            if (this.y >= player.y) {
                if ((this.x > player.x && this.x < (player.x + player.playerWidth)) ||
                    (this.x + this.fruitWidth > player.x && this.x + this.fruitWidth < (player.x + player.playerWidth))) {

                    let audio = new Audio();
                    audio.src = "hitfruit.wav";
                    audio.play();

                    player.score += this.fruitScore;
                    player.fruitsCollected += 1;

                    this.changeState();
                    this.chooseFruit();
                }
            }
        }


        this.changeState = function () {
            this.fruitNumber = Math.floor(Math.random() * 5);
            this.fruitSpeed = Math.floor(Math.random() * 3 + 1);
            this.x = Math.random() * (canvas.width - this.fruitWidth);
            this.y = Math.random() * -canvas.height - this.fruitHeight;
        }

        this.render = function () {
            context.drawImage(this.fruitImage, this.x, this.y);
        }
    }

    let left = 37;
    let right = 39;
    let enter = 13;
    window.addEventListener("keydown", function (e) {
        e.preventDefault();
        if (e.keyCode == left) {
            player.moveLeft();
        }
        else if (e.keyCode == right) {
            player.moveRight();
        }
        else if (e.keyCode == enter && player.gameOver == true) {
            main();
            window.clearTimeout(timer);
        }
    });

    main();

    function main() {


        contextBack.font = "bold 35px Velvetica";
        contextBack.fillStyle = "black";
        player = new Player();
        fruits = [];

        for (let i = 0; i < numberOfFruits; i++) {
            let fruit = new Fruit();
            fruit.chooseFruit();
            fruits.push(fruit);
        }

        startGame();
    }

    function startGame() {

        updateGame();
        window.requestAnimationFrame(drawGame);
    }

    function updateGame() {

        if (player.fruitsMissed >= 5) {
            player.gameOver = true;
        }

        for (var j = 0; j < fruits.length; j++) {
            fruits[j].fall();
        }
        timer = window.setTimeout(updateGame, 25);
    }


    function drawGame() {
        if (player.gameOver == false) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
            contextBack.drawImage(background, 0, 0);
            player.render();

            for (var j = 0; j < fruits.length; j++) {
                fruits[j].render();
            }
            contextBack.fillText("ĐIỂM: " + player.score, 80, 38);
            contextBack.fillText("KỶ LỤC: " + hiscore, 450, 38);
            contextBack.fillText("THU ĐƯỢC: " + player.fruitsCollected, 900, 38);
            contextBack.fillText("BỎ LỠ: " + player.fruitsMissed, 1380, 38);
        }
        else {
            for (var i = 0; i < numberOfFruits; i++) {
                fruits.pop();
            }

            if (hiscore < player.score) {
                hiscore = player.score;
                contextBack.fillText("SỐ ĐIỂM ĐẠT ĐƯỢC: " + hiscore, (canvas.width / 2) - 200, canvas.height / 2.1);
            }
            contextBack.fillText("NHẤN PHÍM ENTER ĐỂ BẮT ĐẦU LẠI TRÒ CHƠI", (canvas.width / 2) - 390, canvas.height / 1.9);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        myBackgroundMusic.play();
        window.requestAnimationFrame(drawGame);
    }
}