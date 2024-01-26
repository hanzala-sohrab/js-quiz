"use client";

import { HTMLAttributes, useEffect, useState } from "react";
import { Question } from "../lib/definitions";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Question({
  questionContent,
}: {
  questionContent: Question;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    for (let i = 0; i < 5; ++i) {
      const option = document.getElementById(`option-${i}`);
      if (option) {
        option.style.borderColor = "black";
        option.style.borderWidth = "1px";
      }
    }
    setShowExplanation(false);
  }, [questionContent]);

  useEffect(() => {
    const correctOption = document.getElementById(
      `option-${questionContent.correctOption}`
    );
    if (showExplanation && correctOption) {
      correctOption.style.borderColor = "green";
      correctOption.style.borderWidth = "4px";
    }

    return () => {
      if (correctOption) {
        correctOption.style.borderColor = "black";
        correctOption.style.borderWidth = "1px";
      }
    };
  }, [showExplanation, questionContent]);

  const syntaxTheme = oneLight;

  const MarkdownComponents = {
    code(props: HTMLAttributes<HTMLElement>) {
      const { children, className, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");

      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          language={match[1]}
          style={syntaxTheme}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code {...rest} className={`${className} inline-code`}>
          {children}
        </code>
      );
    },
  };

  const handleOptionClick = function (event: React.MouseEvent<HTMLDivElement>) {
    // If any option has already been clicked, just ignore the click events
    if (showExplanation) {
      return;
    }

    // TODO: Do this the React way
    const el = event.target as HTMLElement;
    if ("parentElement" in el) {
      let parentEl = el.parentElement as HTMLElement;

      if (
        el.tagName === "CODE" &&
        parentEl.tagName === "P" &&
        "parentElement" in parentEl
      ) {
        parentEl = parentEl.parentElement as HTMLElement;
      }

      const userAnswer = "id" in el && el.id != "" ? el.id : parentEl.id;

      const userOption = parseInt(
        String(userAnswer).match(/option-(.*?)$/)?.[1] ?? "",
        10
      );

      if (userOption != questionContent.correctOption) {
        if (el.id == "" && parentEl) {
          parentEl.style.borderColor = "red";
          parentEl.style.borderWidth = "4px";
        } else {
          el.style.borderColor = "red";
          el.style.borderWidth = "4px";
        }
      }
    }

    setShowExplanation(true);
  };

  return (
    questionContent && (
      <>
        <Markdown className="text-2xl md:mt-5" components={MarkdownComponents}>
          {questionContent.text}
        </Markdown>
        <Markdown
          className="text-xl md:py-2.5 md:my-2.5"
          components={MarkdownComponents}
        >
          {questionContent.code}
        </Markdown>
        <p className="text-2xl my-5">Your options are:</p>
        {questionContent.options.map(
          (option) =>
            option.text && (
              <div
                key={option.id}
                onClick={handleOptionClick}
                className={`text-xl border-[1px] border-black ${
                  showExplanation ? "" : "hover:bg-slate-50 cursor-pointer"
                } my-2.5 p-2.5 min-h-10 align-middle`}
                id={`option-${option.id}`}
              >
                <Markdown components={MarkdownComponents}>
                  {option.text}
                </Markdown>
              </div>
            )
        )}
        {showExplanation && (
          <div id="explanation" className="my-5 text-xl">
            <p className="text-2xl font-bold mb-3">Explanation</p>
            <Markdown components={MarkdownComponents}>
              {questionContent.explanation}
            </Markdown>
          </div>
        )}
      </>
    )
  );
}
