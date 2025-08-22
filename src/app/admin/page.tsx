"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";

interface User {
  id: string;
  email: string;
  role: string;
}

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [Regno, setRegno] = useState("");
  const [Dept, setDept] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [Exp, setExp] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [fullemail, setFullEmail] = useState("");

  useEffect(() => {
    setFullEmail(email.includes("@") ? email : `${email}@gmail.com`);
  }, [email]);

  const staff = users.filter((user) => user.role === "staff");
  const students = users.filter((user) => user.role === "student");

  const handleAddUser = async () => {
    if (!password || !confirmPassword || !role || !fullemail) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (role == "student") {
      if (!Name || !Regno || !Dept) {
        alert("Please fill all fields for student.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, fullemail, password);
        const uid = userCredential.user.uid;
        await setDoc(doc(db, "users", uid), {
          email: fullemail,
          role,
          name: Name,
          regno: Regno,
          dept: Dept,
          createdAt: new Date().toISOString(),
        });
        const res = await fetch("/api/sendmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: fullemail,
            subject: "Welcome!",
            text: `Hello ${Name}, your account is created.`,
            html: `<div className="font-sans max-w-600 m-auto border border-gray-300 p-4 rounded-lg">
    <h2 className="text-green-500 text-2xl">Welcome to our platform , ${Name}!</h2>
<p>Your account has been created successfully with the following details:</p>
      <ul className="list-disc pl-5">
        <li><strong>Email:</strong> ${fullemail}</li>
        <li><strong>Role:</strong> ${role}</li>
        <li><strong>Reg. No:</strong> ${Regno}</li>
      </ul>
     <p>Your login password is: <strong>${password}</strong></p>
     <h1>Don't share your password with anyone!</h1>
<p>Please log in to start using our services.</p>
<p className="mt-5">If you have any questions or need support, feel free to reach out to the admin team.</p>
<p className="mt-7">Best regards,<br/><strong>Admin Team</strong></p>
<hr className="mt-10" />
    <p className="text-xs text-gray-500">This is an automated message. Please do not reply directly to this email.</p>
  </div>`,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text(); // fallback to text
          throw new Error(`Mail error: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        console.log("Mail success:", data);
        alert(`${role} added successfully.`);
        setEmail("");
        setFullEmail("");
        setName("");
        setRegno("");
        setDept("");
        setPassword("");
        setConfirmPassword("");
        setRole("staff");
        setRefresh(!refresh);
      } catch (err: any) {
        console.error("Error adding user:", err);
        alert(err.message);
      }
    }
    else {
      if (!Name || !Dept || !Exp || !selectedValues) {
        alert("Please fill all fields for staff.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, fullemail, password);
        const uid = userCredential.user.uid;
        await setDoc(doc(db, "users", uid), {
          email: fullemail,
          role,
          name: Name,
          exp: Exp,
          subjects: selectedValues,
          dept: Dept,
          createdAt: new Date().toISOString(),
        });

        const res = await fetch("/api/sendmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: fullemail,
            subject: "Welcome!",
            text: `Hello ${Name}, your account is created.`,
            html: `<div classNName="font-sans max-w-600 m-auto border border-gray-300 p-4 rounded-lg">
    <h2 className="text-green-500 text-2xl">Welcome to the Team, ${Name}!</h2>
<p>We're excited to have you onboard as a <strong>staff member</strong> in the <strong>${Dept}</strong> department.</p>
<p>Here are your details:</p>
    <ul className="list-disc pl-5">
      <li><strong>Email:</strong> ${fullemail}</li>
      <li><strong>Experience:</strong> ${Exp}</li>
      <li><strong>Subjects:</strong> ${selectedValues}</li>
    </ul>
    <p>Your login password is: <strong>${password}</strong></p>
    <h1>Don't share your password with anyone!</h1>
<p>Please log in to start using our services.</p>
<p className="mt-5">If you have any questions or need support, feel free to reach out to the admin team.</p>
<p className="mt-7">Best regards,<br/><strong>Admin Team</strong></p>
<hr className="mt-10" />
    <p className="text-xs text-gray-500">This is an automated message. Please do not reply directly to this email.</p>
  </div>`,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text(); // fallback to text
          throw new Error(`Mail error: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        console.log("Mail success:", data);
        alert(`${role} added successfully.`);
        setEmail("");
        setFullEmail("");
        setName("");
        setExp("");
        setSelectedValues([]);
        setDept("");
        setPassword("");
        setConfirmPassword("");
        setRole("staff");
        setRefresh(!refresh);
      } catch (err: any) {
        console.error("Error adding user:", err);
        alert(err.message);
      }
    };
  }

  const fetchUsers = async () => {
    const q = query(collection(db, "users"), where("role", "in", ["staff", "student"]));
    const querySnapshot = await getDocs(q);
    const fetchedUsers: User[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      fetchedUsers.push({
        id: docSnap.id,
        email: data.email,
        role: data.role,
      });
    });

    setUsers(fetchedUsers);
  };

  const handleRemoveUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      alert("User removed Successfully");
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  return (
    <div >
      <div className="p-8 max-w-5xl mx-auto ">
        <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add New User</h2>
          <select
            className="border p-2 rounded mb-2 w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="staff">Staff</option>
            <option value="student">Student</option>
          </select>
          {role == "student" && (
            <>
              <input
                type="name"
                placeholder="Name of the Student"
                className="border p-2 rounded mb-2 w-full"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Register number"
                className="border p-2 rounded mb-2 w-full"
                value={Regno}
                onChange={(e) => setRegno(e.target.value)}
              />
              <input
                type="text"
                placeholder="Department"
                className="border p-2 rounded mb-2 w-full"
                value={Dept}
                onChange={(e) => setDept(e.target.value)}
              />
            </>)}
          {role == "staff" &&
            (
              <><input
                type="name"
                placeholder="Name of the Staff"
                className="border p-2 rounded mb-2 w-full"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
                <input
                  type="text"
                  placeholder="Department"
                  className="border p-2 rounded mb-2 w-full"
                  value={Dept}
                  onChange={(e) => setDept(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Years of Experience"
                  className="border p-2 rounded mb-2 w-full"
                  value={Exp}
                  onChange={(e) => setExp(e.target.value)}
                />
                <span className="font-medium">Languages Known</span>
                <select multiple
                  aria-placeholder="Select Subjects"
                  className="border p-2 rounded mb-2 w-full"
                  value={selectedValues}
                  onChange={(e) => {
                    setSelectedValues(Array.from(e.target.selectedOptions, option => option.value));
                  }}
                >
                  <option value="c">C</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </>
            )}
          <div className="flex items-center mb-2  border rounded overflow-hidden w-full">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email id"
              className="p-2 w-full outline-none"
            />
            <span className="p-2 bg-gray-200  text-black select-none">@gmail.com</span>
          </div>
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded mb-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 rounded mb-2 w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Add User
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4">All Staff & Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Staff</h3>
            {staff.length > 0 ? (
              <ul>
                {staff.map((user) => (
                  <li key={user.id} className="border p-2 rounded flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No staff found.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Students</h3>
            {students.length > 0 ? (
              <ul>
                {students.map((user) => (
                  <li key={user.id} className="border p-2 rounded flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
