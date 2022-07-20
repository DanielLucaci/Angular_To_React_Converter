import { useState } from "react";
import Box from "../../../components/Layout/Box";
import Question from "./Question";

const Questions = [
    { 
      id: 'q1',
      question: 'Is this application 100% free ?',
      answer: 'Yes, this application is 100% free, so you don\'t have to pay anything',
    },
    {
      id: 'q2',
      question: 'How long does the conversion take ?',
      answer: 'It depends on the size of your project. It usually takes between 3 and 5 minutes.'
    }, 
    {
      id: 'q3',
      question: 'Can I cancel the conversion after uploading?',
      answer: 'Yes, you can cancel the conversion any time you wish.'
    }, 
    
]

export default function FAQ() { 
    const [activeQuestion, setActiveQuestion] = useState('q1');
    const [isOpen, setIsOpen] = useState(true);

    const toggleQuestionHandler = (newQuestionId) => { 
        if(activeQuestion === newQuestionId) {
          setIsOpen((prevState) => !prevState);
        } else { 
          setActiveQuestion(newQuestionId);
          setIsOpen(true);
        }
    }

    return <Box>
        {Questions.map((question) => <Question key={question.id} {...question} isActive={question.id === activeQuestion && isOpen} onToggleQuestion={toggleQuestionHandler} />)}
    </Box>;
}