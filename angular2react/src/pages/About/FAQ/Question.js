import "./Question.css";
import Box from "../../../components/Layout/Box";
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';


export default function Question(props) {
  return (
    <Box className="question-box">
      <div className="question" onClick={() => props.onToggleQuestion(props.id)}>
        <p>{`${props.id.substr(1, 1)}: ${props.question}`}</p>
        {props.isActive ? <AiOutlineMinus className="toggle-question" /> : <AiOutlinePlus className="toggle-question" />}
      </div>
      {props.isActive && (
        <div className="answer">
          <p>{props.answer}</p>
        </div>
      )}
    </Box>
  );
}
