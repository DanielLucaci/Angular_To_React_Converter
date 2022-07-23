import { useState } from "react";
import Box from "../../../components/Layout/Box";
import Question from "./Question";

const Questions = [
  {
    id: "q1",
    question: "Is this application free ?",
    answer: "Yes, this application is 100% free.",
  },
  {
    id: "q2",
    question: "How long does the conversion take ?",
    answer:
      "It depends on the size of your project. It usually doesn't take more than 1 minute.",
  },
  {
    id: "q3",
    question: "Can I cancel the conversion after uploading?",
    answer: "Yes, the conversion can be canceled any time you wish.",
  },
  {
    id: "q4",
    question: "Do you plan to add other features in the future?",
    answer:
      "Yes, as stated in the 'General' section this app is still under development so other functionalities will be added. Moreover, we are currently working on a React to Angular conversion app.",
  },
];

export default function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState("q1");
  const [isOpen, setIsOpen] = useState(true);

  const toggleQuestionHandler = (newQuestionId) => {
    if (activeQuestion === newQuestionId) {
      setIsOpen((prevState) => !prevState);
    } else {
      setActiveQuestion(newQuestionId);
      setIsOpen(true);
    }
  };

  return (
    <Box>
      {Questions.map((question) => (
        <Question
          key={question.id}
          {...question}
          isActive={question.id === activeQuestion && isOpen}
          onToggleQuestion={toggleQuestionHandler}
        />
      ))}
    </Box>
  );
}
