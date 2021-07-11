BlackJackGame = {
    'you': { 'spantag': '#YourScore', 'div': '#your-ct', 'score': 0 },
    'dealer': { 'spantag': '#DealerScore', 'div': '#dealer-ct', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'K': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'draws': 0,
    'losses': 0,
    'isStand': false,
    'turnover': false,
    'isHit': true,
}


const yourDetails = BlackJackGame['you'];
const dealerDetails = BlackJackGame['dealer'];
const cardsDetails = BlackJackGame['cards'];
// console.log(cardsDetails);



document.querySelector('#hit-btn').addEventListener('click', hit_fnc);
document.querySelector('#deal-btn').addEventListener('click', deal_fnc);
document.querySelector('#stand-btn').addEventListener('click', stand_fnc);


function scoreUpdate(card, actPlayer) {
    if (card == 'A') {
        if (actPlayer['score'] + BlackJackGame['cardsMap'][card][1] <= 21) {
            actPlayer['score'] += BlackJackGame['cardsMap'][card][1];

        } else {
            actPlayer['score'] += BlackJackGame['cardsMap'][card][0];
        }
    }
    else {
        actPlayer['score'] += BlackJackGame['cardsMap'][card];
        console.log(actPlayer['score']);
    }

}


function hit_fnc() {
    if (BlackJackGame['isHit'] == true) {
        // console.log('hit');
        let card = randomCard();
        showCard(card, yourDetails);
        scoreUpdate(card, yourDetails)
        scoreShow(yourDetails);
        console.log(yourDetails['score']);
        BlackJackGame['isStand'] = true;
    }
    else {
        console.log('not working hit');
    }
}


function randomCard() {
    let ranCard = Math.floor(Math.random() * 13);
    // console.log(ranCard);
    return BlackJackGame['cards'][ranCard];
    console.log(BlackJackGame['cards'][ranCard]);
}


function showCard(card, actPlayer) {
    if (actPlayer['score'] < 21) {
        let cardPic = document.createElement('img');
        cardPic.src = `/static/blackjack_assets/images/${card}.png`;
        document.querySelector(actPlayer['div']).appendChild(cardPic);
        let soundCard = new Audio('/static/blackjack_assets/sounds/swish.m4a');
        soundCard.play();
        // randomCard();
    }
}

function scoreShow(actPlayer) {
    if (actPlayer['score'] > 21) {
        document.querySelector(actPlayer['spantag']).textContent = 'BUST';
        document.querySelector(actPlayer['spantag']).style.color = 'red';
    }
    else {
        document.querySelector(actPlayer['spantag']).textContent = actPlayer['score'];
    }
}






function deal_fnc() {
    if (BlackJackGame['turnover'] == true) {

        console.log('deal');
        let imagesYour = document.querySelector('#your-ct').querySelectorAll('img');
        let imagesDeal = document.querySelector('#dealer-ct').querySelectorAll('img');
        // console.log(imagesYour);
        for (let i = 0; i < imagesYour.length; i++) {
            imagesYour[i].remove();
        }
        for (let i = 0; i < imagesDeal.length; i++) {
            imagesDeal[i].remove();
        }
        yourDetails['score'] = 0;
        dealerDetails['score'] = 0;
        document.querySelector('#YourScore').textContent = 0;
        document.querySelector('#DealerScore').textContent = 0;
        document.querySelector('#result').textContent = 'Play Again';
        document.querySelector('#YourScore').style.color = 'black';
        document.querySelector('#DealerScore').style.color = 'black';
        document.querySelector('#result').style.color = 'black';

        BlackJackGame['turnover'] = false;
        BlackJackGame['isStand'] = false;
        BlackJackGame['isHit'] = true;

    }


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function stand_fnc() {
    if (BlackJackGame['isStand'] === true) {
        while (dealerDetails['score'] < 16 && BlackJackGame['isStand'] === true) {
            BlackJackGame['isHit'] = false;
            let card = randomCard();
            console.log('hit on stand');
            showCard(card, dealerDetails);
            scoreUpdate(card, dealerDetails);
            scoreShow(dealerDetails);
            console.log(yourDetails['score']);
            await sleep(1000);

        }
        winner();
        BlackJackGame['turnover'] = true;
    }
}

let winSound = new Audio('/static/blackjack_assets/sounds/cash.mp3')
let lostSound = new Audio('/static/blackjack_assets/sounds/aww.mp3')

function winner() {
    if (yourDetails['score'] <= 21) {
        if (yourDetails['score'] > dealerDetails['score'] || dealerDetails['score'] > 21) {
            console.log('you wonnnnnnnnnnnnnnnnnnn');
            document.querySelector('#result').textContent = 'You Won!!!';
            document.querySelector('#result').style.color = 'green';
            winSound.play();
            BlackJackGame['wins']++;
            document.querySelector('#wins').textContent = BlackJackGame['wins'];


        }
        else if (yourDetails['score'] < dealerDetails['score']) {
            console.log('you lost');
            document.querySelector('#result').textContent = 'You Lost';
            document.querySelector('#result').style.color = 'red';
            lostSound.play();
            BlackJackGame['losses']++;
            document.querySelector('#losses').textContent = BlackJackGame['losses'];
        }
        else if (yourDetails['score'] === dealerDetails['score']) {
            console.log('you drew');
            document.querySelector('#result').textContent = 'Draw';
            document.querySelector('#result').style.color = 'blue';
            BlackJackGame['draws']++;
            document.querySelector('#draw').textContent = BlackJackGame['draws'];
        }
    }
    else if (yourDetails['score'] > 21 && dealerDetails['score'] <= 21) {
        console.log('you lost');
        document.querySelector('#result').textContent = 'You Lost';
        document.querySelector('#result').style.color = 'red';
        lostSound.play()
        BlackJackGame['losses']++;
        document.querySelector('#losses').textContent = BlackJackGame['losses'];
    }

    else if (yourDetails['score'] > 21 && dealerDetails['score'] > 21) {
        console.log('drew');
        document.querySelector('#result').textContent = 'Draw';
        document.querySelector('#result').style.color = 'blue';
        BlackJackGame['draws']++;
        document.querySelector('#draw').textContent = BlackJackGame['draws'];
    }
    console.log(BlackJackGame);
    return winner;
}
