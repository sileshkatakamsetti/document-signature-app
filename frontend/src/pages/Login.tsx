import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 border border-gray-200">

        <div className="text-center mb-6">

          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Sign in to your Document Signature account
          </p>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>

            <label className="text-sm text-gray-600 mb-1 block">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div>

            <label className="text-sm text-gray-600 mb-1 block">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          New here?{" "}
          <Link
            to="/register"
            className="text-black font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;