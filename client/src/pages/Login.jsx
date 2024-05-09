import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Login() {
  const { user } = useUser();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      <header className="py-5">
        <SignedOut>
          <div className="flex justify-center items-center flex-col gap-5">
            <h1 className="text-white text-[40px]">
              Pls Sign In to Photo Booth
            </h1>

            <button className="border p-2 rounded-md text-teal-100">
              <SignInButton />
            </button>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex justify-center items-center flex-col gap-5">
            <h1 className="text-white text-[40px]">Welcome to Photo Booth</h1>

            <div className="flex justify-center gap-3 items-center">
              <button className="border p-2 rounded-md text-teal-100">
                <UserButton />
              </button>

              <div className="text-white">{user?.fullName}</div>
            </div>
            <button className="border flex justify-center items-center mt-3 rounded-md">
              <Link to="/dashboard" className="p-2 text-white">
                Go to Dashboard
              </Link>
            </button>
          </div>
        </SignedIn>
      </header>
    </div>
  );
}

export default Login;
