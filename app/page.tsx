"use client";

import {
  readDataFromFile,
  parseAndExtractDataFromMarkdown,
} from "@/app/lib/utils";
import { useEffect, useState } from "react";
import QuestionComponent from "@/app/ui/question";
import { Question } from "./lib/definitions";

let questionTemplate: Question;

export default function Home() {
  const [question, setQuestion] = useState(0);
  const [questions, setQuestions] = useState([questionTemplate]);

  useEffect(() => {
    const fileUrl =
      "https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md";

    readDataFromFile(fileUrl).then(async (markdown) => {
      const data = parseAndExtractDataFromMarkdown(markdown);
      setQuestions(data);
    });
  }, []);

  const handleNext = () => {
    setQuestion((prevQuestion) => prevQuestion + 1);
  };

  return (
    questions.length > 2 && (
      <>
        <div
          id="quiz"
          className="md:container md:mx-auto md:px-32 flex flex-col"
        >
          <QuestionComponent questionContent={questions[question]} />
          <button
            onClick={handleNext}
            className="w-fit self-center bg-black text-white px-3 rounded mb-20"
          >
            Next
          </button>
        </div>
        <div className="fixed bottom-0 md:right-1">
          <div>Inspired by</div>
          <a
            href="https://github.com/lydiahallie/javascript-questions"
            className="font-bold"
          >
            lydiahallie/javascript-questions
          </a>
        </div>
      </>
    )
  );
}
