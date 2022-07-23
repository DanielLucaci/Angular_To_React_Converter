import Background from "../../components/Layout/Background";
import Spinner from "../../components/Layout/Spinner";
import "./Converter.css";
import { useDispatch, useSelector } from "react-redux";
import conversionSliceActions from "../../store/conversion-slice";
import { useNavigate } from 'react-router-dom'

export default function Converter() {
  const message = useSelector((state) => state.message);
  const percentage = useSelector((state) => state.percentage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cancelConversionHandler = () => {
    dispatch(conversionSliceActions.cancel());
    navigate('/upload');
  };

  return (
    <>
      <Background page="converter" />
      <Spinner />
      {message !== "" && <div className="message">{message}</div>}
      <div className="bar">
        <div
          className="loading"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
        <p className="percentage">{percentage}%</p>
      </div>
      <div className="cancel">
        <button className="cancel-btn" onClick={cancelConversionHandler}>
          Cancel
        </button>
      </div>
    </>
  );
}
