import styled from "styled-components";

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00162d;
  background: url("/assets/large/${(props) => props.page}-background.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;
  z-index: -1;

  @media only screen and (max-width: 1280px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00162d;
    background: url("/assets/medium/${(props) =>
      props.page}-background-md.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center center;
    background-size: cover;
    z-index: -1;
  }

  @media only screen and (max-width: 800px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00162d;
    background: url("/assets/small/${(props) =>
      props.page}-background-sm.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center center;
    background-size: cover;
    z-index: -1;
  }
`;

export default Background;
