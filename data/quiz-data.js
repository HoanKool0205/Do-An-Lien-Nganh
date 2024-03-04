const { text } = require("express");

const quizData= {
    title: "Choose the best answer"
};

const question = [
    {
        text: "Có mấy tính chất OOP ?",
        type: "mc",
        answers: [
            {text: "1", correct: false},
            {text: "2", correct: false},
            {text: "3", correct: false},
            {text: "4", correct: true}
        ]
    },

    {
        text: "Node.js sử dụng ngôn ngữ lập trình nào ?",
        type: "mc",
        answers: [
            {text: "Java", correct: false},
            {text: "C++", correct: false},
            {text: "Python", correct: false},
            {text: "JavaScript", correct: true}
        ]
    },

    {
        text: "Điền từ khóa để thực hiện việc kế thừa trong Java",
        type: "txt",
        answers: ["extends"]
    }
];

module.exports = {quizData, question};