import Box from "../../../components/Layout/Box";
import "./HowToUse.css";
import { BsFillCheckCircleFill } from "react-icons/bs";

const steps = [
  "Upload an archive with your Angular project. The archive must contain the 'src' folder otherwise it won't work.",
  "Wait until the algorithm finishes the conversion.",
  "An archive with the converted components will automatically download.",
  "Enjoy :) If you want to get in touch with us, you can use the 'Contact' page .",
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
                <div className="checkmark-box">
                  <BsFillCheckCircleFill className="checkmark" size="28" />
                </div>
                {step}
              </li>
            );
          })}
        </ul>
      </div>
    </Box>
  );
}
