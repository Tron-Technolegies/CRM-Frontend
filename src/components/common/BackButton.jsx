import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackButton;