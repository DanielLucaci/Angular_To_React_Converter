import "./Upload.css";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Archive } from "../../utils/Utils";
import { GrDocumentZip } from "react-icons/gr";
import Background from "../../components/Layout/Background";
import IndexHTMLBuilder from "../../utils/Builders/IndexHTMLBuilder";
import IndexJSBuilder from "../../utils/Builders/IndexJsBuilder";
import PackageBuilder from "../../utils/Builders/PackageBuilder";
import Folders from "../../utils/Folders";
import Modal from "./Modal/Modal";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import conversionSliceActions from "../../store/conversion-slice";

let folders = new Folders();
let archive = null;
new IndexHTMLBuilder(folders);
new IndexJSBuilder(folders);
new PackageBuilder(folders);

export default function Upload() {
  const input = useRef("");
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [clientRect, setClientRect] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = async () => {
    console.log(input.current.files[0]);
    archive = new Archive(folders);
    await archive.loadArchive(input.current.files[0]);
    archive.createTree();
    try {
      archive.isValid();
      setName(input.current.files[0].name);
      setError(false);
      setUploaded(true);
    } catch (err) {
      setError(err.message);
      setUploaded(false);
      setName("");
    }
  };

  useLayoutEffect(() => {
    setClientRect(document.getElementById("drop_zone").getBoundingClientRect());
  }, []);

  const removeArchive = () => {
    setError(false);
    setUploaded(false);
    setName("");
    input.current.value = "";
  };

  const dragHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOver((prev) => (prev === false ? true : prev));
  }, []);

  const dropHandler = async (e) => {
    console.log("File(s) dropped");
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.items.length !== 1 || uploaded === true) {
      setError("Please upload a single archive");
      return;
    }

    const { type, kind } = e.dataTransfer.items[0];
    if (kind !== "file" && type !== "application/x-zip-compressed") {
      setError("Please upload a zip-archive");
      return;
    }

    const { name } = e.dataTransfer.items[0].getAsFile();
    archive = new Archive(folders);
    await archive.loadArchive(e.dataTransfer.items[0].getAsFile());
    archive.createTree();
    try {
      archive.isValid();
      setName(name);
      setError(false);
      setUploaded(true);
    } catch (err) {
      setError(err.message);
      setUploaded(false);
      setName("");
    }
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
    try {
      dispatch(conversionSliceActions.start());
      archive.compute();
      navigate('/converter');
    } catch(e) {
      console.log(e.message);
    }
  }

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
              disabled={uploaded}
              className="button__upload"
              onClick={() => input.current.click()}
            >
              <BsFillArrowUpCircleFill size={16} />
              Upload Archive
            </button>
            <button
              type="button"
              disabled={!uploaded}
              className="button__clear"
              onClick={removeArchive}
            >
              <MdCancel size={16} />
              Clear Archive
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          <div
            id="drop_zone"
            onDragOver={dragHandler}
            className="drop-caption"
          >
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
                  onClick={removeArchive}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <button type="button" disabled={!uploaded} className="convert" onClick={convertHandler}>
            <BsFillArrowDownCircleFill size={16} />
            Convert
          </button>
        </div>
      </div>
    </>
  );
}
