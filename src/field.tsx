import { useState } from "react";

export default function Field({
    type = 'text', 
    value: initialValue = '', 
    onChange = (value: any) => value
  }: any) {
  const [value, setValue] = useState(initialValue);
  const [edit, setEdit] = useState(false);

  function handleSave() {
    setEdit(false);
    onChange(value);
  }

  function handleCancel() {
    setEdit(false);
    setValue(initialValue);
  }

  return (
    <>
      {edit ? (
        <>
          <input type={type} value={value} onChange={e => setValue(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <span onClick={() => setEdit(true)}>{value ? value : 'Empty'}</span>
      )}
    </>
  );
}
