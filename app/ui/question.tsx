"use client";

import { useEffect } from "react";
import { markedHighlight } from "marked-highlight";
import { Marked } from "marked";
import hljs from "highlight.js";
import { Question } from "../lib/definitions";
const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code) {
      return hljs.highlightAuto(code, [
        "javascript",
        "html",
        "plaintext",
        "css",
      ]).value;
    },
  })
);

export default function Question({
  questionContent,
}: {
  questionContent: Question;
}) {
  useEffect(() => {
    const fun = async () => {
      const questionElement = document.getElementById("question");
      const codeElement = document.getElementById("code");
      const optionsElement = document.getElementById("options");

      if (questionElement && codeElement && optionsElement) {
        questionElement.innerHTML = await marked.parse(questionContent.text);
        codeElement.innerHTML = await marked.parse(questionContent.code);
        optionsElement.innerHTML = questionContent.options.reduce(
          (res, cur) => res + marked.parse(cur.text),
          ""
        );
      }
    };
    fun();
  }, [questionContent]);
  return (
    questionContent && (
      <>
        <div id="question"></div>
        <div id="code"></div>
        <div id="options"></div>
      </>
    )
  );
}
