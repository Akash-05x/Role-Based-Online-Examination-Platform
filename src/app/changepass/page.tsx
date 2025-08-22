"use client";

import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../lib/firebase";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("User not logged in");
      return;
    }

    try {
      // Step 1: Re-authenticate with old password
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to change password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>

        {message && <div className="mb-4 text-green-600 text-sm">{message}</div>}
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Current Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
