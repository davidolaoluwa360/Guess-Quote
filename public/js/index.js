'use strict';

//* quotes arrays
let quotes = [
  {
    id: 1,
    quotes: ` <p class="quote-text">
                You can
                <input class="answerA input-control" placeholder="[A](market), [B](product)"
                  />
                your ass off, but if your
                <input class="answerB input-control" placeholder="[A](product), [B](market)"
                  />
                sucks, you're dead.
              </p>`,
    author: 'Johannes Eret',
    answers: {
      a: 'market',
      b: 'product',
    },
  },
  {
    id: 2,
    quotes: `<p class="quote-text">If life were <input class="answerA input-control" placeholder="[A](predictable), [B](life)"/> it would cease to be <input placeholder="[A](predictable), [B](life)"  class="answerB input-control">, and be without flavor.</p>`,
    author: 'Eleanor Roosevelt',
    answers: {
      a: 'predictable',
      b: 'life',
    },
  },
  {
    id: 3,
    quotes: `<p class="quote-text"><input class="answerA input-control" placeholder="[A](plans), [B](life)"/> is what happens when you're busy making other <input class="answerB input-control" placeholder="[A](plans), [B](life)"/>.</p>`,
    author: 'John Lennon',
    answers: {
      a: 'life',
      b: 'plans',
    },
  },
  {
    id: 4,
    quotes: `<p class="quote-text">If you look at what you have in <input class="answerA input-control" placeholder="[A](enough), [B](life)">, you'll always have more. If you look at what you don't have in life, you'll never have <input class="answerB input-control" placeholder="[A](enough), [B](life)"/>.</p>`,
    author: 'Oprah Winfrey',
    answers: {
      a: 'life',
      b: 'enough',
    },
  },
  {
    id: 5,
    quotes: `<p class="quote-text"><input class="answerA input-control" placeholder="[A](spread), [B](happier)"/> love everywhere you go. Let no one ever come to you without leaving <input  class="answerB input-control" placeholder="[A](spread), [B](happier)"/>.</p>`,
    author: 'Mother Teresa',
    answers: {
      a: 'spread',
      b: 'happier',
    },
  },
];

//* user answers array
const userAnswers = [];

//* Selecting Document
const quoteText = document.querySelector('.quote-text');
const leftBtn = document.querySelector('.fa-arrow-left');
const rightBtn = document.querySelector('.fa-arrow-right');
const notificationBar = document.querySelector('.message');
const quote = document.querySelector('.quote');
const quoteContent = document.querySelector('.quote-content');
const footerContent = document.querySelector('.quote-footer');
const quoteCenteredWrapper = document.querySelector('.quote-centered');
const modalCloseBtn = document.querySelector('.modal-close');
const modalPlayAgainBtn = document.querySelector('.modal-play-again');
const modalOverlay = document.querySelector('.overlay');
const closeModal = document.querySelector('.close-modal');

//* counter entery points
let index = 0;
let reviseRandomizeQuote = [];

//* randomize the quotes
const randomizeQuote = function () {
  let copy = quotes.slice(0);
  let randomQuote = Math.trunc(Math.random() * copy.length);
  let isTrue = true;

  while (isTrue) {
    reviseRandomizeQuote.push(
      typeof copy[randomQuote] !== 'undefined' ? copy[randomQuote] : null
    );
    copy.splice(randomQuote, 1);
    if (!copy.length) {
      isTrue = false;
    }
    randomQuote = Math.trunc(Math.random() * copy.length);
  }
};

const addQuoteToDOM = function () {
  for (let i = 0; i < quotes.length; i++) {
    quote.innerHTML += quotes[i]['quotes'];
    footerContent.innerHTML += `<p>By ${quotes[i]['author']}</p>`;
  }
};

//* show quote in the dom
const showQuote = function () {
  const quoteText = quote.querySelectorAll('p');
  const authorText = footerContent.querySelectorAll('p');
  for (let i = 0; i < quoteText.length; i++) {
    quoteText[i].style.display = 'none';
    authorText[i].style.display = 'none';
  }
  quoteText[index].style.display = 'block';
  authorText[index].style.display = 'block';
};

//* function that handles the quote guess, called when the DOM is loaded
const guessQuotes = function () {
  randomizeQuote();
  reviseRandomizeQuote = reviseRandomizeQuote.sort();
  reviseRandomizeQuote = reviseRandomizeQuote.slice(
    0,
    reviseRandomizeQuote.indexOf(null) !== -1
      ? reviseRandomizeQuote.indexOf(null)
      : reviseRandomizeQuote.length
  );
  quotes = reviseRandomizeQuote;
  addQuoteToDOM();
  showQuote();
};

//* check answers state validity
const checkAnswersState = function () {
  //* select answers from the DOM
  const answerA = document.querySelectorAll('.answerA')[index - 1].value.trim();
  const answerB = document.querySelectorAll('.answerB')[index - 1].value.trim();

  //* check if the user answer field is empty
  if (!answerA || !answerB) {
    return false;
  } else {
    return true;
  }
};

//* store user answer into an array
const storeAnswer = function () {
  const answerA = quote.querySelectorAll('p .answerA')[index - 1].value.trim();
  const answerB = quote.querySelectorAll('p .answerB')[index - 1].value.trim();
  userAnswers[index - 1] = {
    id: index - 1,
    a: answerA,
    b: answerB,
  };
};

const incrementQuoteIndex = function () {
  //* increment the index of the quotes
  index++;
  if (index < quotes.length) {
    if (checkAnswersState()) {
      //* reset notification message
      notificationBar.textContent = '';

      //* add new quote to the Dom
      showQuote();
      storeAnswer();
    } else {
      index--;
      //* show error notification to the user
      notificationBar.textContent = 'Answers cannot be empty';
    }
  } else {
    //* call add answer to add the last answer
    if (checkAnswersState()) {
      storeAnswer();
      //* display users answers;
      displayAnswer();
    } else {
      //* show error notification to the user
      notificationBar.textContent = 'Answers cannot be empty';
    }
  }
};

const decrementQuoteIndex = function () {
  //* reset notification message
  notificationBar.textContent = '';

  //* decrement the index of the quotes
  index--;
  if (index > 0) {
    //* add previous quote
    showQuote();
  } else {
    //* reset the counter
    index = 0;

    //* render quote
    showQuote();
  }
};

//* score counter
let score = 0;

//* check user answers against the actual answers
const checkAnswer = function () {
  //* store answers correct state
  let isCorrect = [];
  for (let i = 0; i < userAnswers.length; i++) {
    if (
      userAnswers[i].a.toLowerCase() ===
        quotes[i]['answers']['a'].toLowerCase() &&
      userAnswers[i]['b'].toLowerCase() &&
      quotes[i]['answers']['b'].toLowerCase()
    ) {
      //* increment user score if answer matches
      score++;
      isCorrect.push({ correct: true });
    } else {
      isCorrect.push({ correct: false });
    }
  }
  return isCorrect;
};

//* reset the DOM when user chooses to play again
const playAgain = function () {
  location.reload();
};

//* when called display user score with a button to play again
const displayAnswer = function () {
  quoteContent.remove();
  footerContent.remove();
  leftBtn.classList.add('hidden');
  rightBtn.classList.add('hidden');
  const isCorrect = checkAnswer();
  const answerContent = document.createElement('div');
  answerContent.setAttribute('class', 'answer-content');
  answerContent.innerHTML = `
        <div class="score-wrapper">
        <button class="btn score">Your Score: ${score}/${quotes.length}</button></div>
        <div class="playAgain-wrapper">
            <button class="btn again">Play Again</button>
        </div>
    `;

  quoteCenteredWrapper.appendChild(answerContent);
  answerContent.querySelector('.again').addEventListener('click', playAgain);

  setTimeout(() => {
    modalOverlay.classList.add('open');
    const ul = document.querySelector('.modal-content ul');
    for (let i = 0; i < isCorrect.length; i++) {
      if (isCorrect[i].correct) {
        ul.innerHTML += `<li><i class="fas fa-check"></i></li>`;
      } else {
        ul.innerHTML += `<li><i class="fas fa-times"></i> (a)[${quotes[i].answers['a']}](b)[${quotes[i]['answers']['b']}]</li>`;
      }
    }
  }, 1500);
};

//* Load quote when the dom is loaded
guessQuotes();

//*add event listener
leftBtn.addEventListener('click', decrementQuoteIndex);
rightBtn.addEventListener('click', incrementQuoteIndex);
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') incrementQuoteIndex();
  if (event.key === 'ArrowLeft') decrementQuoteIndex();
});
modalCloseBtn.addEventListener('click', function () {
  modalOverlay.classList.remove('open');
});
closeModal.addEventListener('click', function () {
  modalOverlay.classList.remove('open');
});
modalPlayAgainBtn.addEventListener('click', playAgain);
