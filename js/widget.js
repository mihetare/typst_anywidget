import "./widget.css";
import { basicEditor } from "prism-code-editor/setups";

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
  editor.textarea.placeholder = "Enter your code";
  editor.textarea.name = "typst-editor";
  editor.textarea.id = "taws";
  function onUpdate() {
    model.set("value", editor.value);
    model.save_changes();
    // console.log(editor.lines);
    // for (var item of editor.lines) {
    //   // console.log(item);
    //   // item.attachShadow({ mode: "open" });
    //   item.style.pointerEvents = "stroke";
    // }
    // editor.update();
  }

  //Set some additional options.
  editor.setOptions({
    readOnly: false,
    lineNumbers: true,
    lineWrapping: true,
    wordWrap: true,
    onSelectionChange: console.log("Selection changed"),
    onUpdate: debounce(onUpdate, model.get("debounce")),
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
  // function on_change() {
  //   let new_value = model.get("value");
  //   if (editor.value == new_value) {
  //     console.log("no change");
  //   } else {
  //     editor.value = new_value;
  //     editor.update();
  //   }
  // }
  // model.on("change:value", on_change);
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
      // Handle the changeW
      colunmContainer.style.height = new_height;
    }
  }
  model.on("change:widgetHeight", on_height_change);
  /////////////////
  // Drag and drop
  /////////////////
  const triggerEvent = (el, eventType, detail) =>
    el.dispatchEvent(
      new CustomEvent(eventType, {
        detail: null,
        composed: true,
        bubbles: true,
      }),
    );
  // var shadowRoot = editorContainer.shadowRoot;
  // console.log(shadowRoot.querySelector(".prism-code-editor"));
  // shadowRoot
  //   .querySelector(".prism-code-editor")
  //   .addEventListener("SelectionChange", () => {
  //     console.log("aaaa");
  //     // onSelectionChange();
  //     console.log(editor.textarea.selectionStart);
  //   });
  editor.textarea.addEventListener("selectionchange", () => {
    console.log("aaaa");
    // onSelectionChange();
    console.log(editor.textarea.selectionStart);
  });

  el.addEventListener(
    "dragover",
    (e) => {
      let shadowRoot = editorContainer.shadowRoot;
      e.dataTransfer.clearData();
      // console.log(shadowRoot.querySelector(".prism-code-editor"));
      // shadowRoot
      //   .querySelector(".prism-code-editor")
      //   .addEventListener("selectionChange", (eee) => {
      //     console.log("aaaa");
      //     // onSelectionChange();
      //     console.log(editor.textarea.selectionStart);
      //   });
      // e.target.shadowRoot.getElementById("taws").focus();
      // shadowRoot.textarea.focus();
      // console.log(editorShadowRoot.getElementById("taws").selectionStart);
      // console.log(editor.textarea.selectionStart);
      //console.log(e.target.shadowRoot.getElementById("taws").selectionStart);
      // console.log(e.target.shadowRoot.getElementById("taws").selectionStart);
      // console.log(shadowRoot.getElementById("taws").selectionStart);
      // editor.textarea.selectionChange();
      // triggerEvent(editor.textarea, "selectionChange");
      // console.log(document.getSelection().getComposedRanges());
      // console.log(colunmContainer.shadowRoot);
      // const shadowRootElement = document.querySelector("marimo-anywidget");
      // let shadowRoot = editorContainer.shadowRoot; // shadowRootElement.shadowRoot;
      // // console.log(editorContainer.shadowRoot);
      // // console.log(shadowRoot);
      // e.dataTransfer.dropEffect = "copy";
      // // console.log(e.clientX, e.clientY);
      let x = Math.max(0, Math.min(window.innerWidth, e.clientX));
      let y = Math.max(0, Math.min(window.innerHeight, e.clientY));
      var caretPosition = document.caretPositionFromPoint(x, y, {
        shadowRoots: [shadowRoot],
      });
      editor.update();
      console.log(caretPosition);
      console.log(shadowRoot.elementFromPoint(x, y).selectionStart);
      console.log(e.composedPath()[0].selectionStart);
      // console.log(editor.lines);
      // const ingredientsListDeepCopy = JSON.parse(
      //   JSON.stringify(caretPosition.offsetNode, [
      //     "id",
      //     "className",
      //     "selectionStart",
      //   ]),
      // );
      // console.log(caretPosition);
      // shadowRoot.querySelector("textarea").focus();
      // console.log(ingredientsListDeepCopy);
      // console.log(caretPosition.offsetNode["selectionStart"]);
      // console.log(shadowRoot.querySelector("textarea").selectionStart);
    },
    false,
  );
  // let droplocation = null;
  el.addEventListener(
    "drop",
    (e) => {
      let shadowRoot = e.target.shadowRoot; // shadowRootElement.shadowRoot;
      e.dataTransfer.clearData();
      // // shadowRoot.getElementById("taws").focus();
      // // console.log(shadowRoot.getSelection().focusNode.last);

      // // console.log(shadowRoot);
      // e.dataTransfer.dropEffect = "copy";
      // // insertText(editor, "tsts", editor.textarea.selectionStart);
      // console.log(
      //   "droplocation_init",
      //   e.target.shadowRoot.getElementById("taws").selectionStart,
      // );
      // droplocation = e.target.shadowRoot.getElementById("taws").selectionStart;
      // let x = Math.max(0, Math.min(window.innerWidth, e.clientX));
      // let y = Math.max(0, Math.min(window.innerHeight, e.clientY));
      // var caretPosition = document.caretPositionFromPoint(x, y, {
      //   shadowRoots: [shadowRoot],
      // });
      // // console.log(caretPosition.getClientRect);
      // const ingredientsListDeepCopy = JSON.parse(
      //   JSON.stringify(caretPosition.offsetNode, [
      //     "id",
      //     "className",
      //     "selectionStart",
      //     "onselect",
      //   ]),
      // );
      // shadowRoot.querySelector(".pce-textarea").focus();
      // console.log(caretPosition);
      // // console.log(ingredientsListDeepCopy);
      // // console.log(caretPosition.offsetNode["selectionStart"]);
      // // console.log(shadowRoot);
      // // console.log(shadowRoot.querySelector(".pce-textarea").selectionStart);
      // console.log(editor);
      // console.log(shadowRoot.getElementById("taws").selectionStart);

      //
      [...e.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        // console.log(item);
        if (item.kind === "file") {
          console.log(
            "droplocation_file",
            e.target.shadowRoot.getElementById("taws").selectionStart,
          );
          e.preventDefault();
          e.dataTransfer.dropEffect = "none";
          const file = item.getAsFile();
          let result = `file[${i}].name = ${file.name}\n`;
          insertText(
            editor,
            result,
            e.target.shadowRoot.getElementById("taws").selectionStart,
          );
          // console.log(
          //   "droplocation_file",
          //   e.target.shadowRoot.getElementById("taws").selectionStart,
          // );
          // e.dataTransfer.setData("text/html", "<" + "selectedValue" + ">");
          // e.dataTransfer.setData("text/plain", "<" + "selectedValue" + ">");
        }
      });
    },
    false,
  );
  window.addEventListener(
    "dragstart",
    (e) => {
      // e.dataTransfer.setData("text/plain", "This is text to drag");
      // e.dataTransfer.setData("image/jpeg", "This is image to drag");
      // console.log(e);
      // let result = "";
      // // Use DataTransferItemList interface to access the file(s)
      // [...e.dataTransfer.items].forEach((item, i) => {
      //   // If dropped items aren't files, reject them
      //   console.log(item);
      //   if (item.kind === "file") {
      //     const file = item.getAsFile();
      //     result += `• file[${i}].name = ${file.name}\n`;
      //   }
      // });
      // for (var i = 0; i < e.dataTransfer.types.length; i++) {
      //   console.log("... types[" + i + "] = " + e.dataTransfer.types[i]);
      // }

      // const selectedValue = e.dataTransfer.getData("text/html");
      // console.log(e.dataTransfer.types);
      // e.dataTransfer.setData("text/html", "<" + selectedValue + ">");
      // const selectedValue2 = e.dataTransfer.getData("text/plain");
      // e.dataTransfer.setData("text/plain", "<" + selectedValue2 + ">");
      // // e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      // e.dataTransfer.setData("text/plain", "This is text to drag");
      // e.originalEvent.dataTransfer.setData("text/plain", "anything");
      // e.preventDefault();
    },
    true,
  );

  // function dropHandler(ev) {
  //   // Prevent default behavior (Prevent file from being opened)
  //   ev.preventDefault();
  //   var data = ev.dataTransfer.getData("data");

  //   editor.textarea.value = data;
  //   console.log(editor.textarea.selectionStart);
  //     let result = "";
  //     // Use DataTransferItemList interface to access the file(s)
  //     [...ev.dataTransfer.items].forEach((item, i) => {
  //       // If dropped items aren't files, reject them
  //       if (item.kind === "file") {
  //         const file = item.getAsFile();
  //         result += `• file[${i}].name = ${file.name}\n`;
  //       }
  //     });
  //     console.log(result);
  // }

  // el.addEventListener("drop", dropHandler);

  el.appendChild(errorContainer);
  el.appendChild(colunmContainer);
}
export default { render };
