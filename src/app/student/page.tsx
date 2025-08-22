import Link from "next/link";
export default function StaffPage() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/class.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
        }}
      />
      <div className="text-3xl font-bold z-10">Welcome Student</div>
      <div className="mt-8 text-sm text-center px-10 py-10 z-10 flex gap-4">
        <Link
          href="/changepass"
          className="bg-black text-white rounded px-4 py-2 shadow-lg hover:underline"
        >
          Change Password
        </Link>
        <Link
          href="/student/attend-exam"
          className="bg-black text-white rounded px-4 py-2 shadow-lg hover:underline"
        >
          Attend Exam
        </Link>
      </div>
    </div>
  );
}
