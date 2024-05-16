import "./style.css";
import { Form } from "react-final-form";
import validate from "validate.js";
import { showAlert } from "../static/alert";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Loader } from "../components";
import { signin, authenticate } from "../api/server";

const constraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
    },
  },
};

function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    signin(values)
      .then((data) => {
        if (data.error) {
          showAlert("", `${data.error}`, "error");
        } else {
          authenticate(data, () => {
            showAlert("", "Login successfully", "success");
            navigate("/");
          });
        }
      })
      .catch();
  };

  const validateForm = (values) => {
    return validate(values, constraints) || {};
  };
  return (
    <section className="h-screen flex justify-center items-center">
      <div className="login-box w-[526px] flex flex-col justify-center p-5 md:p-[20px] lg:p-[80px]">
        <div className="auth-content border p-5 rounded-md">
          <p className="login-title">Log in</p>
          <p className="login-subtitle pb-5">
            Enter your account details below.
          </p>
          <Form
            onSubmit={onSubmit}
            validate={validateForm}
            render={({ handleSubmit, form, submitting }) => (
              <form onSubmit={handleSubmit}>
                <TextInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="example@domain.com"
                  form={form}
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  form={form}
                />

                <button className="auth-btn w-full mt-3" type="submit">
                  {submitting ? (
                    <span className="loading-dots">
                      <span className="loading-dots-dot"></span>
                      <span className="loading-dots-dot"></span>
                      <span className="loading-dots-dot"></span>
                    </span>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>
            )}
          />
        </div>
        <p className="signup-text pt-3 text-center">
          Don’t have an account?{" "}
          <Link to={"/signup"} className="spot text-black">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
