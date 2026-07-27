import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import kmhLogo from "../../assets/KMH.png";

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <img
        src={kmhLogo}
        alt="KMH"
        className="w-14 h-14 object-contain mb-8 opacity-20"
      />
      <p
        className="text-amber-500 text-xs tracking-widest uppercase mb-3"
        style={{ fontWeight: 600 }}
      >
        404
      </p>
      <h1
        className="text-neutral-900 mb-4"
        style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}
      >
        Page Not Found
      </h1>
      <p className="text-neutral-400 text-sm mb-10 max-w-sm leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          fontWeight: 500,
          boxShadow: "0 4px 16px rgba(180,83,9,0.25)",
        }}
      >
        <ArrowLeft size={15} />
        Back to Home
      </Link>
    </div>
  );
}
