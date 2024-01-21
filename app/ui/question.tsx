"use client";

import { useEffect, useState } from "react";
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
  const [showExplanation, setShowExplanation] = useState(false);
  useEffect(() => {
    setShowExplanation(false);
    const func = async () => {
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
        const options = Array.from(optionsElement.getElementsByTagName("p"));
        options.forEach((option, index) => {
          option.addEventListener("click", async function (event) {
            if (index != questionContent.correctOption) {
              this.style.backgroundColor = "red";
            }
            console.log('CORR = ', questionContent.correctOption);
            options[questionContent.correctOption].style.backgroundColor =
              "green";
            setShowExplanation(true);
          });
        });
      }
    };
    func();
  }, [questionContent]);

  useEffect(() => {
    const func = async () => {
      const explanationElement = document.getElementById("explanation");
      if (explanationElement) {
        explanationElement.innerHTML = await marked.parse(
          questionContent.explanation
        );
      }
    };
    func();
  }, [showExplanation, questionContent]);

  return (
    questionContent && (
      <>
        <div id="question"></div>
        <div id="code"></div>
        <div id="options"></div>
        {showExplanation && <div id="explanation"></div>}
      </>
    )
  );
}
