"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fullEmail, setFullEmail] = useState("");
  useEffect(() => {
    setFullEmail(email.includes("@") ? email : `${email}@gmail.com`);
  }, [email]);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, fullEmail, password);
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "staff") {
          router.push("/staff");
        } else {
          router.push("/student");
        }
      }
    } catch (err: any) {
      console.error("Firebase login error:", err);
      setError(err.message);
    }
  };
  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/a123.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5,
        }}
      />
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white p-8 rounded-xl shadow-lg w-full max-w-md opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-black mb-1">Email</label>
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
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <div className="mt-4 text-sm text-center">
          <Link href="/forgotpass" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
