import { Link, useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, signout } from "../api/server";
import { showAlert } from "../static/alert";

function ImageGrid() {
  const authenticatedUser = isAuthenticated();
  const navigate = useNavigate();

  const onSignout = () => {
    signout();
    console.log("Signed out");
    showAlert("", "Ended current session", "success");
    navigate("/login");
  };

  return !authenticatedUser ? (
    <Navigate to="/login" />
  ) : (
    <section className="min-h-screen bg-black text-white">
      <header className="py-3 flex justify-between px-5">
        <button
          className="border p-2 text-white border-white bg-black rounded-md"
          onClick={onSignout}
        >
          Logout
        </button>
        <Link
          to="/"
          className="border p-2 text-white border-white bg-black rounded-md"
        >
          Upload More
        </Link>
      </header>
      <h1 className="flex justify-center text-[40px] pb-5 pt-5">
        Image Gallery
      </h1>
    </section>
  );
}

export default ImageGrid;
