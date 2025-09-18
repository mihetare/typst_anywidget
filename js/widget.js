import "./widget.css";
import { minimalEditor, basicEditor } from "prism-code-editor/setups";
import { insertText } from "prism-code-editor/utils";

// Importing Prism grammars
import "prism-code-editor/prism/languages/markup";
import { languages } from "prism-code-editor/prism";

import {
  searchWidget,
  highlightSelectionMatches,
} from "prism-code-editor/search";
import { editHistory } from "prism-code-editor/commands";
import { cursorPosition } from "prism-code-editor/cursor";
import { matchTags } from "prism-code-editor/match-tags";
import { highlightBracketPairs } from "prism-code-editor/highlight-brackets";
import { indentGuides } from "prism-code-editor/guides";

//prism-typst
import { Prismlanguagestyp } from "./prism-typst";

// Typst highlighting adapted from https://github.com/Mc-Zen/prism-typst/tree/master
languages["typst"] = Prismlanguagestyp;

function debounce(callback, wait) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

function render({ model, el }) {
  let editorContainer = document.createElement("div");
  let svgContainer = document.createElement("div");
  let errorContainer = document.createElement("div");

  editorContainer.setAttribute("id", "editorContainer");
  svgContainer.setAttribute("id", "svgContainer");
  errorContainer.setAttribute("id", "errorContainer");

  let colunmContainer = document.createElement("div");
  colunmContainer.classList.add("container");
  colunmContainer.setAttribute("id", "colunmContainer");
  colunmContainer.classList.add("row");
  colunmContainer.style.height = "484px";

  let leftColumn = document.createElement("div");
  leftColumn.classList.add("column");
  leftColumn.setAttribute("id", "leftColumn");
  leftColumn.appendChild(editorContainer);

  let rightColumn = document.createElement("div");
  rightColumn.classList.add("column");
  rightColumn.setAttribute("id", "rightColumn");
  rightColumn.appendChild(svgContainer);

  colunmContainer.appendChild(leftColumn);
  colunmContainer.appendChild(rightColumn);

  const editor = basicEditor(
    editorContainer,
    {
      language: "typst",
      theme: "github-light",
    },
    () => console.log("ready"),
  );

  function onUpdate() {
    model.set("value", editor.value);
    model.save_changes();
  }
  function onSelectionChange() {
    // console.log(editor.getSelection());
    //console.log(editor.textarea.selectionStart);
  }
  //Set some additional options.
  editor.setOptions({
    readOnly: false,
    lineNumbers: true,
    lineWrapping: true,
    wordWrap: true,
    onUpdate: debounce(onUpdate, model.get("debounce")),
    // onSelectionChange: onSelectionChange,
  });
  editor.addExtensions(
    highlightSelectionMatches(),
    searchWidget(),
    matchTags(),
    highlightBracketPairs(),
    cursorPosition(),
    editHistory(),
    indentGuides(),
  );
  // Set the svg if svgInput parameter changes
  function on_svg_change() {
    svgContainer.innerHTML = model.get("svgInput");
  }
  model.on("change:svgInput", on_svg_change);
  // Add on change function to listen to changes from python
  function on_change() {
    let new_value = model.get("value");
    if (editor.value == new_value) {
      // Do nothing
    } else {
      editor.textarea.value = new_value;
      editor.update();
    }
  }
  model.on("change:value", on_change);
  //Error message handler
  function on_error_change() {
    errorContainer.innerHTML = model.get("compilerError");
  }
  model.on("change:compilerError", on_error_change);

  function on_width_change() {
    let new_width = model.get("widgetWidth");
    if (
      colunmContainer.style.width == new_width &&
      colunmContainer.style.width != ""
    ) {
      // Do nothing
    } else {
      // Handle the change
      colunmContainer.style.width = new_width;
    }
  }
  model.on("change:widgetWidth", on_width_change);

  function on_height_change() {
    let new_height = model.get("widgetHeight");
    if (
      colunmContainer.style.height == new_height &&
      colunmContainer.style.height != ""
    ) {
      // Do nothing
    } else {
      // Handle the change
      colunmContainer.style.height = new_height;
    }
  }
  model.on("change:widgetHeight", on_height_change);
  /////////////////
  // Drag and drop
  /////////////////
  el.addEventListener("dragover", (e) => {
    // if (e.preventDefault) {
    //   e.preventDefault();
    // }
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    e.dataTransfer.dropEffect = "copy";
    // console.log(editor.extensions.cursor.getPosition());
    console.log(editor.textarea.selectionStart);
    console.log(editor.getSelection());
    // e.preventDefault();
  });
  el.addEventListener("drop", (e) => {
    console.log("Drop");
    console.log(e.dataTransfer.getData("Text"));
    console.log(editor.textarea.selectionStart);
    // insertText(
    //   editor,
    //   "Hello World!",
    //   editor.textarea.selectionStart,
    //   editor.textarea.selectionEnd,
    // );

    // e.preventDefault();
  });

  el.addEventListener("dragstart", (e) => {
    e.originalEvent.dataTransfer.setData("text", "anything");
    // e.preventDefault();
  });

  // function dropHandler(ev) {
  //   // Prevent default behavior (Prevent file from being opened)
  //   ev.preventDefault();
  //   let result = "";
  //   // Use DataTransferItemList interface to access the file(s)
  //   [...ev.dataTransfer.items].forEach((item, i) => {
  //     // If dropped items aren't files, reject them
  //     if (item.kind === "file") {
  //       const file = item.getAsFile();
  //       result += `• file[${i}].name = ${file.name}\n`;
  //     }
  //   });
  //   console.log(result);
  // }

  // editorContainer.addEventListener("drop", dropHandler);

  el.appendChild(errorContainer);
  el.appendChild(colunmContainer);
}
export default { render };
