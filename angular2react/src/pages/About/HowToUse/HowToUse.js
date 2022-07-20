import Box from "../../../components/Layout/Box";
import "./HowToUse.css";
import { BsFillCheckCircleFill } from "react-icons/bs";

const steps = [
  "Upload an archive with all components from your Angular Project.",
  "Wait until the algorithm finishes the conversion.",
  "An archive with the converted components will automatically download.",
  "Enjoy and do not forget to leave a rating.",
];

export default function HowToUse() {
  return (
    <Box className="how-to-use">
      <h1 className="title">How to use?</h1>
      <div className="steps">
        <p>Please follow the steps provided below:</p>
        <ul>
          {steps.map((step, index) => {
            return (
              <li key={`how-to-use${index}`}>
                <BsFillCheckCircleFill className="checkmark" size={28} />
                {step}
              </li>
            );
          })}
        </ul>
      </div>
    </Box>
  );
}
