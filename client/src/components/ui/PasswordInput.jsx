// PasswordInput.js
import PropTypes from "prop-types";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { Field } from "react-final-form";

const PasswordInput = ({ label, name, placeholder, form }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-2 flex flex-col relative">
      <label htmlFor={name} className="auth-label pb-2">
        {label}
      </label>{" "}
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        className="auth-input focus:outline-none focus:ring-focus pl-10"
        placeholder={placeholder}
        component="input"
      />
      <button
        type="button"
        className="absolute inset-y-0 top-4 right-3 flex items-center"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <FiEyeOff color="grey" /> : <FiEye color="grey" />}
      </button>
      {form.getState().submitFailed && form.getState().errors[name] && (
        <small className="text-red-600">{form.getState().errors[name]}</small>
      )}
    </div>
  );
};

PasswordInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
};

export default PasswordInput;
