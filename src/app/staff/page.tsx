"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
interface User {
  id: string;
  name?: string;
  email: string;
  role: "student";
  regno: string;
  dept: string;
}
export default function StaffPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);
  const router = useRouter();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const examid = `${selectedDept}-${Date.now()}`;
  const handleConfirm = async () => {
    const selectedData = students.filter((user) =>
      selectedStudents.includes(user.id)
    );
    const examId = `exam-${selectedDept}-${Date.now()}`;
    await setDoc(doc(db, "exams", examId), {
      students: selectedData.map((user) => ({
        id: user.id,
        name: user.name,
        dept: user.dept,
      })),
    });
    localStorage.setItem("currentExamId", examId);
    localStorage.setItem("currentExamDept", selectedDept);
    console.log("Selected Students:", selectedData);
    setSelectionConfirmed(true);
  };
  const handleSelectAll = () => {
    const visibleStudentIds = students
      .filter((user) => !selectedDept || user.dept === selectedDept)
      .map((user) => user.id);

    setSelectedStudents(visibleStudentIds);
  };
  const handleClear = () => {
    setSelectedStudents([]);
  };
  const fetchUsers = async () => {
    const q = query(collection(db, "users"), where("role", "in", ["student"]));
    const querySnapshot = await getDocs(q);
    const fetchedUsers: User[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      fetchedUsers.push({
        id: docSnap.id,
        name: data.name,
        email: data.email,
        role: data.role,
        dept: data.dept,
        regno: data.regno,
      });
    });
    setStudents(fetchedUsers);
    setRefresh(true);
  };
  useEffect(() => {
    fetchUsers();
  }, [refresh]);
  return (
    <div className="min-h-screen flex items-center justify-center flex-row"
      style={{ backgroundImage: "url('/staffbg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex flex-col items-center justify-center w-full">
        <div className=" text-3xl font-bold text-white">
          Welcome staff
        </div>
        <div className="mt-8 text-sm text-center px-10 py-10">
          <button className="bg-black rounded px-3 py-2 shadow-lg">
            <Link href="/changepass" className=" text-white hover:underline">
              change Password!
            </Link>
          </button>
        </div>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 m-10 rounded hover:bg-blue-600"
          >
            Students
          </button>
        )}
      </div>
      {isOpen && (
        <div className=" top-0 right-0 h-auto w-200 z-50 shadow-lg backdrop-blur-md  transform transition-transform duration-300 translate-y-0 ease-in-out p-4">
          <h3 className="text-lg text-white font-semibold mb-4">Students</h3>
          {selectionConfirmed ? (
            <div className="text-center mt-10">
              <p className="mb-4 font-medium text-green-600">Students selected successfully!</p>
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
                onClick={() => router.push('/staff/createexam')}
              >
                Create Exam
              </button>
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="mb-4 text-white">
                <label className="block text-sm font-medium mb-1">Filter by Department:</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full border bg-black rounded px-3 py-2"
                >
                  <option value="">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </select>
              </div>
              <ul>
                {students
                  .filter((user) => !selectedDept || user.dept === selectedDept)
                  .map((user) => (
                    <li
                      key={user.id}
                      className="border p-2 rounded text-white flex justify-between items-start mb-2"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(user.id)}
                          onChange={() => toggleStudent(user.id)}
                          className="mt-2"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm ">{user.role}</p>
                          <p className="text-sm ">
                            Reg No: {user.regno || "N/A"}
                          </p>
                          <p className="text-sm ">
                            Department: {user.dept || "N/A"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <button
                  onClick={handleSelectAll}
                  className="text-xl bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Select All
                </button>
                <button
                  onClick={handleClear}
                  className="text-xl bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Clear
                </button>
                <button
                  onClick={handleConfirm}
                  className="text-xl bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  OK
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xl bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <p>No students found.</p>
          )}
        </div>
      )}
    </div>
  );
}
