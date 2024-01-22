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
    setShowExplanation(false);
  }, [questionContent]);

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

  return (
    questionContent && (
      <div>
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
              <ul
                key={option.id}
                onClick={function (event) {}}
                className="text-xl"
              >
                <Markdown
                  className="border-[1px] border-black hover:bg-slate-50 my-2.5 p-2.5 cursor-pointer min-h-10 align-middle"
                  components={MarkdownComponents}
                >
                  {option.text}
                </Markdown>
              </ul>
            )
        )}
        {showExplanation && (
          <div id="explanation" className="my-5">
            <p className="text-2xl font-bold mb-3">Explanation</p>
            <Markdown className="text-xl">
              {questionContent.explanation}
            </Markdown>
          </div>
        )}
      </div>
    )
  );
}
