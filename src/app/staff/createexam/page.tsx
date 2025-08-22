'use client';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
type QuestionType = {
  question: string;
  options: string[];
  correctIndex: number;
};
export default function CreateExamPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([
    { question: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);
  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };
  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };
  const handleCorrectAnswerChange = (qIndex: number, index: number) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = index;
    setQuestions(updated);
  };
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }]);
  };
  const handleSubmit = async () => {
    const examId = localStorage.getItem("currentExamId") || `exam-unknown-${Date.now()}`;
    await setDoc(doc(db, "exams", examId), {
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex
      }))
    });
    console.log("Submitted Exam:", questions);
    alert("Exam created successfully!");
    setQuestions([{ question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    localStorage.removeItem("currentExamId");
    localStorage.removeItem("currentExamDept");
  };
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Create Exam</h1>
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="mb-6 p-4 bg-white rounded shadow">
          <label className="block font-semibold mb-2">Question {qIdx + 1}</label>
          <input
            type="text"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
            placeholder="Enter question"
            className="w-full border p-2 mb-4"
          />
          {q.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center mb-2">
              <input
                type="radio"
                name={`correct-${qIdx}`}
                checked={q.correctIndex === optIdx}
                onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                className="mr-2"
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                placeholder={`Option ${optIdx + 1}`}
                className="w-full border p-2"
              />
            </div>
          ))}
        </div>
      ))}
      <div className="flex gap-4">
        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Question
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
}
