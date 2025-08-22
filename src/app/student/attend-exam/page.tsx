"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
type QuestionType = {
  question: string;
  options: string[];
  correctIndex: number;
};
export default function ExamPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState<string | null>(null);
  const fetchExam = async (userDept: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      let found = false;
      querySnapshot.forEach((docSnap) => {
        if (docSnap.id.includes(userDept) && !found) {
          const data = docSnap.data();
          if (Array.isArray(data.questions)) {
            setQuestions(data.questions);
            found = true;
          }
        }
      });
      if (!found) {
        console.error(`No exam found for department: ${userDept}`);
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserDept = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const userDept = userData.dept;
          setDept(userDept);
          fetchExam(userDept);
        } else {
          console.error("User document not found");
          setLoading(false);
        }
      } else {
        console.error("User not logged in");
        setLoading(false);
      }
    });
  };
  const handleSubmit = () => {
    let correctCount = 0;
    const results = questions.map((q, idx) => {
      const selectedOption = document.querySelector(
        `input[name="question-${idx}"]:checked`
      ) as HTMLInputElement;
      const selectedAnswer = selectedOption ? selectedOption.value : null;
      const correctAnswer = q.options[q.correctIndex];
      const isCorrect = selectedAnswer === correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        selectedAnswer,
        correctAnswer,
        isCorrect,
      };
    });
    console.log("Results:", results);
    alert(`✅ You got ${correctCount} out of ${questions.length} correct.`);
  };
  useEffect(() => {
    fetchUserDept();
  }, []);
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Attend the Exam</h1>
      {loading ? (
        <div>Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-gray-600">
          No questions available for your department ({dept})
        </div>
      ) : (
        questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="mb-6 p-4 bg-white rounded shadow max-w-xl mx-auto"
          >
            <h2 className="font-semibold mb-4">
              Q{qIdx + 1}: {q.question}
            </h2>
            <ul className="space-y-2">
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${qIdx}`}
                      value={opt}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      {questions.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleSubmit}
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
}
