import { ChangeEventHandler } from "react";

const FormRow = ({
  type,
  name,
  labelText,
  defaultValue,
  onChange,
}: {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        defaultValue={defaultValue || ""}
        onChange={onChange}
        required
      />
    </div>
  );
};
export default FormRow;
