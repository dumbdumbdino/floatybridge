import io from 'socket.io-client';
import Card from '../helpers/card';
import Dealer from "../helpers/dealer";
import Zone from '../helpers/zone';

import { GameObjects } from 'phaser';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cardbackvert', 'assets/cardback_vert.png');
        this.load.image('cardbackleft', 'assets/cardback_horleft.png');
        this.load.image('cardbackright', 'assets/cardback_horright.png');

        for (let i=2; i <= 14; i++)
        {
            this.load.image('a'+i, 'assets/' + 'a' + i +'.png');
            this.load.image('b'+i, 'assets/' + 'b' + i +'.png');
            this.load.image('c'+i, 'assets/' + 'c' + i +'.png');
            this.load.image('d'+i, 'assets/' + 'd' + i +'.png');
        }
    }

    create() {

        this.playerNo = 0;
        this.playerCards = [];
        
        this.turn = true;
        this.lastPlayed = [];


        this.playedCards = [];

        this.opponentCardsB = [];
        this.opponentCardsC = [];
        this.opponentCardsD = [];

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        this.playerTricks = 0;
       
        let self = this;

        //this.socket = io('http://localhost:3000');

        this.socket = io('https://floatybridge-server.herokuapp.com/');

        this.socket.on('connect', function () {
            console.log('Connected!');
             
        });

        this.socket.on('PlayerNo', function (playerNo) {
            self.playerNo = playerNo;
        })
        

        this.playerTrickText = self.add.text(1000, 820,
            ['Tricks: ' + self.playerTricks])
            .setFontSize(18).setFontFamily('Courier New')
        .setColor('#ffffff')

        this.trickText = self.add.text(1000,750, ['CLAIM TRICK'])
        .setFontSize(18).setFontFamily('Courier New')
        .setColor('#ffffff');
       

        this.startText = self.add.text(575, 425, 
            ['START GAME \r\nPlayers: ' + self.playerCount])
            .setFontSize(24)
            .setFontFamily('Courier New')
            .setColor('#ffffff');


        this.socket.on('playerJoined', function(numPlayers){
        self.startText.setText('START GAME \r\nPlayers: ' + numPlayers);

        if (numPlayers>=4)
        {
        self.startText.setInteractive();
        }

        });


        this.socket.on('showCards', function (playerCards) {
           
            self.playerCards = playerCards;
            self.dealer.dealCards();

            for (let i = 0; i < self.playerCards.length; i++)
            {
                let cardSprite = self.playerCards[i];
                let playerCard = new Card(this);
                playerCard.render(450+ (i * 35), 775, cardSprite);
            }


            self.startText.destroy();

            self.add.text(1000,800, 
                ["Player " + self.playerNo])
                .setFontSize(18).setFontFamily('Courier New')
                .setColor('#ffffff');

            
                self.leftPlayer = self.playerNo +=1;
                if (self.leftPlayer >4) {self.leftPlayer -= 4;}
                self.add.text(100,700, 
                    ["Player " + self.leftPlayer])
                    .setFontSize(18).setFontFamily('Courier New')
                    .setColor('#ffffff');

                self.oppPlayer = self.leftPlayer +=1;
                if (self.oppPlayer >4) {self.oppPlayer -= 4;}
                self.add.text(100,50, 
                    ["Player " + self.oppPlayer])
                    .setFontSize(18).setFontFamily('Courier New')
                    .setColor('#ffffff');


                self.rightPlayer = self.oppPlayer  +=1;
                if (self.rightPlayer >4) {self.rightPlayer -= 4;}
                self.add.text(1000,200, 
                    ["Player " + self.rightPlayer])
                    .setFontSize(18).setFontFamily('Courier New')
                    .setColor('#ffffff');

        });

        this.socket.on('cardPlayed', function (gameObject, playerNo) {

            self.dropZone.data.values.cards++;
            if (self.dropZone.data.values.cards > 3)
            {
                self.dropZone.data.values.cards = 0;
            }

            if (self.playerNo != playerNo)
            {
            

            var img = self.add.image(gameObject.x, gameObject.y, gameObject.textureKey).setScale(0.3, 0.3);
            self.lastPlayed.push(img);

   

            }

        

            if (self.playerNo == 1) {
                if (playerNo ==2) {self.opponentCardsB.shift().destroy();}
                
                if (playerNo ==3) {self.opponentCardsC.shift().destroy();}
                if (playerNo ==4) {self.opponentCardsD.shift().destroy();}
                 }


            if (self.playerNo == 2) {
            if (playerNo ==3) {self.opponentCardsB.shift().destroy();}
            
            if (playerNo ==4) {self.opponentCardsC.shift().destroy();}
            if (playerNo ==1) {self.opponentCardsD.shift().destroy();}
                }

                if (self.playerNo == 3) {
                if (playerNo ==4) {self.opponentCardsB.shift().destroy();}
                
                if (playerNo ==1) {self.opponentCardsC.shift().destroy();}
                if (playerNo ==2) {self.opponentCardsD.shift().destroy();}
                    }

                if (self.playerNo == 4) {
                if (playerNo ==1) {self.opponentCardsB.shift().destroy();}
                
                if (playerNo ==2) {self.opponentCardsC.shift().destroy();}
                if (playerNo ==3) {self.opponentCardsD.shift().destroy();}
                    }
                
        })


      

        // Start Game Graphics 
        this.startText.on('pointerdown', function () {
            self.socket.emit("dealCards");
         
        });

        this.startText.on('pointerover', function () {
            self.startText.setColor('#ff69b4');
        });

        this.startText.on('pointerout', function () {
            self.startText.setColor('#ffffff');
        });



        // Claim Trick Graphics 

        this.socket.on('openClaim', function(){
            self.trickText.setInteractive();
        });

        this.trickText.on('pointerdown', function () {
            self.socket.emit("claimTrick", self.playerNo);
            self.playerTricks ++;
            self.playerTrickText.setText( 'Tricks: ' + self.playerTricks);
 
            self.trickText.disableInteractive();
        });

        this.trickText.on('pointerover', function () {
            self.trickText.setColor('#ff69b4');
        });

        this.trickText.on('pointerout', function () {
            self.trickText.setColor('#ffffff');
        });


        this.socket.on('clearZone', function(){
            self.dropZone.data.values.cards = 0;

            while(self.lastPlayed.length > 0)
            {
                self.lastPlayed.pop().destroy();
            }
        

            self.trickText.disableInteractive();
            self.turn = true;

        });

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {

            if (self.turn)
            {
            gameObject.x = (dropZone.x - 200) + (dropZone.data.values.cards * 125);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();

            self.socket.emit('cardPlayed', gameObject, self.playerNo);
            self.lastPlayed.push(gameObject);
            self.turn = false;
            }

            else{
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }

    update() {

    }
}