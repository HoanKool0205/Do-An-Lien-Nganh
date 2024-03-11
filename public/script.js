const endButton = document.getElementById
('end-btn')

const startButton = document.getElementById
('start-btn')
const nextButton = document.getElementById
('next-btn')
const questionContainerElement = document.getElementById
('question-container')
const questionElement = document.getElementById
('question')
const answerButtonsElement = document.getElementById
('answer-buttons')


let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

// Quay lại Cam
endButton.addEventListener('click', () => {
  fetch('/update', {
    method: 'GET',
  })
  .then(response => response.text())
  .then(data => {
    // Kiểm tra nội dung nhận được từ máy chủ
    // Nếu nội dung là trang index, thì cập nhật trang
    // Nếu không, không cập nhật trang
    if (data.includes('<title>Index Page</title>')) {
      document.body.innerHTML = data;
    } else {
      console.error('Error: Unexpected response from server');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});


function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    endButton.innerText = 'Quay lại Cam'
    endButton.classList.remove('hide') // xử lý logic quay về cam học sinh
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

const questions = [
  {
    question: 'Có mấy tính chất OOP ?',
    answers: [
      {text: "1", correct: false},
      {text: "2", correct: false},
      {text: "3", correct: false},
      {text: "4", correct: true}
    ]
  },
  {
    question: 'Node.js sử dụng ngôn ngữ lập trình nào ?',
    answers: [
      {text: "Java", correct: false},
      {text: "C++", correct: false},
      {text: "Python", correct: false},
      {text: "JavaScript", correct: true}
    ]
  },
  
  {
    question: 'What is 4 * 2?',
    answers: [
      { text: '6', correct: false },
      { text: '8', correct: true }
    ]
  }
]