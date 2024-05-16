// SelectInput.js
import PropTypes from "prop-types";
import { Field } from "react-final-form";

const SelectInput = ({ label, name, options, form }) => {
  return (
    <div className="mb-2 flex flex-col flex-grow">
      <label htmlFor={name} className="auth-label pb-2">
        {label}
      </label>
      <Field
        name={name}
        className="auth-input focus:outline-none focus:ring-focus"
        component="select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      {form.getState().submitFailed && form.getState().errors[name] && (
        <small className="text-red-600">{form.getState().errors[name]}</small>
      )}
    </div>
  );
};

// sample usage
{
  /* <SelectInput
label="Role"
name="role"
options={[
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
]}
form={form}
/> */
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  form: PropTypes.object.isRequired,
};

export default SelectInput;
