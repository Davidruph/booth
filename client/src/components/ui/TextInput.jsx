// TextInput.js
import PropTypes from "prop-types";
import { Field } from "react-final-form";

const TextInput = ({ label, name, type, placeholder, form }) => {
  return (
    <div className="mb-2 flex flex-col flex-grow w-full">
      <label htmlFor={name} className="auth-label pb-2">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        component="input"
        className="auth-input focus:outline-none focus:ring-focus"
        placeholder={placeholder}
      />
      {form.getState().submitFailed && form.getState().errors[name] && (
        <small className="text-red-600">{form.getState().errors[name]}</small>
      )}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  form: PropTypes.object.isRequired,
};

export default TextInput;
