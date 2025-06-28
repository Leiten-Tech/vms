import React from "react";
import Quill from "quill";

const EditorStyle = () => {
  return (
    <div>
      <span className="ql-formats">
        <select className="ql-size"></select>
        <select className="ql-font"></select>
        <select className="ql-color"></select>
        <select className="ql-background"></select>

        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>

        <button
          className="ql-list"
          value="bullet"
          aria-label="Bullet List"
        ></button>

        <button
          className="ql-list"
          value="ordered"
          aria-label="Ordered List"
        ></button>

        <select className="ql-align"></select>
        <button className="ql-link" aria-label="Link"></button>
      </span>
    </div>
  );
};

export default EditorStyle;
