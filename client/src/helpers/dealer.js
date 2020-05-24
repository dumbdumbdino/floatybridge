import Card from './card';


export default class Dealer {
    constructor(scene) {
        this.dealCards = (playerCards) => {
            let opponentSpriteB;
            let opponentSpriteC;
            let opponentSpriteD;
   
            opponentSpriteB = 'cardbackright';
            opponentSpriteC = 'cardbackvert';
            opponentSpriteD = 'cardbackleft';

         


            for (let i = 0; i < 13; i++) {
                let cardSprite = playerCards[i];
                let playerCard = new Card(scene);
                playerCard.render(450+ (i * 35), 775, cardSprite);

                // B vertical
                let opponentCardB = new Card(scene);
                scene.opponentCardsB.push(opponentCardB.render(200, 325 + (i * 20), opponentSpriteB).disableInteractive());
            
                let opponentCardC = new Card(scene);
                scene.opponentCardsC.push(opponentCardC.render(450 + (i * 35), 125 , opponentSpriteC).disableInteractive());
          
                let opponentCardD = new Card(scene);
                scene.opponentCardsD.push(opponentCardD.render(1100, 325 + (i*20), opponentSpriteD).disableInteractive());
          
            }




        }
    }
}