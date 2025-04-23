import { useRef, useState } from "react";
import { Box } from "@mui/system";
import { lighten } from "@mui/material/styles";
import { Button } from "@mui/material";
import { Input } from "antd";
const { TextArea } = Input;

function ProgrammeDescription() {
  const editorRef = useRef();

  const [editorContent, setEditorContent] = useState(null);

  const handleSave = () => {};

  return (
    <div>
      <div
        className="p-0 w-full rounded-16 mb-24 "
        sx={{
          height: "calc(100vh - 250px)",

          overflow: "auto",
        }}
      >
        <TextArea
          rows={10}
          style={{
            backgroundColor: "#fafafa",
          }}
          // onChange={}
          placeholder="Program Description"
          maxLength={15}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default ProgrammeDescription;
