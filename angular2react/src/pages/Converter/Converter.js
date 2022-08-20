import Background from "../../components/Layout/Background";
import Spinner from "../../components/Layout/Spinner";
import "./Converter.css";
import { useDispatch, useSelector } from "react-redux";
import conversionSliceActions, {
  startConversion,
} from "../../store/conversion-slice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

let initial = true;

export default function Converter() {
  
  const { error, isRunning, project, status } = useSelector(
    (state) => state.conversion
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (initial) {
      console.log(project);
      dispatch(startConversion(project));
      initial = false;
    }
  }, [dispatch, project]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(conversionSliceActions.updateStatus());
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (error !== "" || isRunning === false) {
      initial = true;
      navigate("/upload");
      dispatch(conversionSliceActions.cancel());
    }
  }, [error, isRunning, navigate, dispatch]);

  useEffect(() => {
    let timeout = null;
    if (status.percentage === 100) {
      timeout = setTimeout(() => {
        initial = true;
        dispatch(conversionSliceActions.cancel());
        navigate("/upload");
      }, 300);
    }

    return () => {
      if (timeout !== null) clearTimeout(timeout);
    };
  }, [status.percentage, dispatch, navigate]);

  const cancelConversionHandler = () => {
    dispatch(conversionSliceActions.cancel());
    initial = true;
    navigate("/upload");
  };

  return (
    <>
      <Background page="converter" />
      <Spinner />
      {status.message !== "" && <div className="message">{status.message}</div>}
      <div className="bar">
        <div
          className="loading"
          style={{
            width: `${status.percentage}%`,
          }}
        ></div>
        <p className="percentage">{status.percentage}%</p>
      </div>
      <div className="cancel">
        <button className="cancel-btn" onClick={cancelConversionHandler}>
          Cancel
        </button>
      </div>
    </>
  );
}
