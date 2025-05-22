import Image from "next/image";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center p-10 backdrop-blur-md">
        <Image
          src="/syntaxbuddy.png"
          alt="Syntax Buddy Logo"
          width={90}
          height={90}
          className="mb-6"
          style={{
            borderRadius: "18px",
            border: "2px solid #e3e7ee",
            background: "#fff",
          }}
          priority
        />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight text-center">
          Welcome to Syntax Buddy
        </h1>
        <p className="text-gray-500 text-lg font-medium mb-8 text-center">
          Web application that contains DSA problems and video solutions.
        </p>
        <a
          href="/login"
          className="px-10 py-3 bg-blue-600 text-white rounded-full font-bold tracking-wide shadow-lg hover:bg-blue-700 transition text-lg"
        >
          Login / Register
        </a>
      </div>
    </div>
  );
}
