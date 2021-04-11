import React, { useEffect, useState } from 'react';
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';

const Editor = (props) => {

  const [translation, setTranslation] = useState('');

  const buttonsList = ['undo', 'redo', 'fontColor', 'hiliteColor', 'removeFormat', 'codeView'];

  const {
    content
  } = props;

  useEffect(() => {
    setTranslation(content)
  }, [content]);

  return(<div>
    {/* 'codeView', 'save' */}
    <SunEditor 
      setContents={ translation }
      setOptions={{
        height: 400,
        buttonList: [ buttonsList ]
      }}
    />
  </div>)
}

export default Editor;