import { ChangeEventHandler } from "react";

const FormRowSelect = ({
  name,
  labelText,
  list,
  defaultValue = "",
  onChange,
}: {
  name: string;
  labelText: string;
  defaultValue: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  list: string[];
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {list.map((itemValue) => {
          return (
            <option key={itemValue} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormRowSelect;
