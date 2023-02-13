import { Cancel, Edit, Save } from "@mui/icons-material";
import { IconButton, Input, Tooltip } from "@mui/material";
import { useState } from "react";

export default function Field({value: initialValue, onChange, validator = (value: any) => true, prefix}: any) {
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

  const valid = validator(value);

  return (
    <>
      {edit ? (
        <>
          <Input value={value} onChange={e => setValue(e.target.value)} error={!valid} 
            startAdornment={<>{prefix ? prefix : null}</>}
            endAdornment={(
              <>
                <Tooltip title="Save">
                  <span>
                    <IconButton disabled={!valid} onClick={handleSave}>
                      <Save />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton onClick={handleCancel}>
                    <Cancel />
                  </IconButton>
                </Tooltip>
              </>
            )} />
        </>
      ) : (
        <Tooltip title="Edit">
          <span onClick={() => setEdit(true)}>
            {value ? (
              <>{prefix ? prefix : null}{value}</>
            ) : (
              <IconButton>
                <Edit />
              </IconButton>
            )}
          </span>
        </Tooltip>
      )}
    </>
  );
}
