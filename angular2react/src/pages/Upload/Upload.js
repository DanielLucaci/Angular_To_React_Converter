import "./Upload.css";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { GrDocumentZip } from "react-icons/gr";
import Background from "../../components/Layout/Background";
import Modal from "./Modal/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import conversionSliceActions, {
  loadArchive,
} from "../../store/conversion-slice";
import { useEffect } from "react";

const Upload = () => {
  const input = useRef("");
  const {  isRunning, error, name, uploaded, project } = useSelector(
    (state) => state.conversion
  );
  const { setError, removeArchive, start } = conversionSliceActions;
  const [dragOver, setDragOver] = useState(false);
  const [clientRect, setClientRect] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(project);
  }, [project])
    
  const changeHandler = async () => {
    dispatch(
      loadArchive({
        name: input.current.files[0].name,
        content: input.current.files[0],
      })
    );
  };

  useLayoutEffect(() => {
    setClientRect(document.getElementById("drop_zone").getBoundingClientRect());
  }, []);

  const removeArchiveHandler = () => {
    console.log("Archive Removed");
    dispatch(removeArchive());
    input.current.value = "";
  };

  const dragHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOver((prev) => (prev === false ? true : prev));
  }, []);

  const dropHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.items.length !== 1 || uploaded === true) {
      dispatch(setError("Please upload a single archive"));
      return;
    }

    const { type, kind } = e.dataTransfer.items[0];
    if (kind !== "file" && type !== "application/x-zip-compressed") {
      dispatch(setError("Please upload a zip-archive"));
      return;
    }

    dispatch(
      loadArchive({
        name: e.dataTransfer.items[0].getAsFile().name,
        content: e.dataTransfer.items[0].getAsFile(),
      })
    );
  };

  const onModalDragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { pageX, pageY } = e;
    const { top, bottom, left, right } = clientRect;
    if (top > pageY || pageY > bottom || left > pageX || pageX > right) {
      setDragOver(false);
    }
  };

  const convertHandler = () => {
    dispatch(start());
    setTimeout(() => {
      navigate("/converter");
    }, 200);
  };

  return (
    <>
      <Background page="upload" />
      {dragOver && (
        <Modal onDragOver={onModalDragOverHandler} onDrop={dropHandler} />
      )}
      <div className="upload">
        <h3 className="title">Upload your project</h3>
        <h4 className="important">
          Important: Please make sure that your project is archived and contains
          the "src" folder!
        </h4>
        <div className="main">
          <div className="buttons">
            <input
              type="file"
              hidden
              ref={input}
              onChange={changeHandler}
              accept=".zip"
            ></input>
            <button
              type="button"
              className="button__upload"
              onClick={() => input.current.click()}
            >
              <BsFillArrowUpCircleFill size={16} />
              Upload Archive
            </button>
            <button
              type="button"
              disabled={!uploaded || isRunning}
              className="button__clear"
              onClick={removeArchiveHandler}
            >
              <MdCancel size={16} />
              Clear Archive
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          <div id="drop_zone" onDragOver={dragHandler} className="drop-caption">
            <div className="drop-caption__border"></div>
            {!uploaded && (
              <p className="drop-caption__text">Drop your archive here</p>
            )}
            {name !== "" && (
              <div className="drop-caption__item">
                <p className="drop-caption__archive">{name}</p>
                <GrDocumentZip size={45} className="drop-caption__logo" />
                <button
                  className="drop-caption__remove"
                  onClick={removeArchiveHandler}
                  disabled={isRunning}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={!uploaded || isRunning}
            className="convert"
            onClick={convertHandler}
          >
            <BsFillArrowDownCircleFill size={16} />
            Convert
          </button>
        </div>
      </div>
    </>
  );
};

export default Upload;
