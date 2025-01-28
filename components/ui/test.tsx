import React from 'react';
import styled from 'styled-components';

const Test = ({name}:any) => {
  return (
    <StyledWrapper>
      <button className="btn cube cube-hover" type="button">
        <div className="bg-top">
          <div className="bg-inner" />
        </div>
        <div className="bg-right">
          <div className="bg-inner" />
        </div>
        <div className="bg">
          <div className="bg-inner" />
        </div>
        <div className="text">{name}</div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    display: block;
    padding: 0.7em 1em;
    background: transparent;
    outline: none;
    border: 0;
    color: #00ff00cc;
    letter-spacing: 0.1em;
    font-family: monospace;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1;
  }

  .cube {
    position: relative;
    transition: all 0.5s;
  }

  .cube .bg-top {
    position: absolute;
    height: 10px;
    background: #00ff00cc;
    bottom: 100%;
    left: 5px;
    right: -5px;
    transform: skew(-45deg, 0);
    margin: 0;
    transition: all 0.4s;
  }

  .cube .bg-top .bg-inner {
    bottom: 0;
  }

  .cube .bg {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background: #00ff00cc;
    transition: all 0.4s;
  }

  .cube .bg-right {
    position: absolute;
    background: #00ff00cc;
    top: -5px;
    z-index: 0;
    bottom: 5px;
    width: 10px;
    left: 100%;
    transform: skew(0, -45deg);
    transition: all 0.4s;
  }

  .cube .bg-right .bg-inner {
    left: 0;
  }

  .cube .bg-inner {
    background: #28282d;
    position: absolute;
    left: 2px;
    right: 2px;
    top: 2px;
    bottom: 2px;
  }

  .cube .text {
    position: relative;
    transition: all 0.4s;
  }

  .cube:hover .bg-inner {
    background: #00ff00cc;
    transition: all 0.4s;
  }

  .cube:hover .text {
    color: #28282d;
    transition: all 0.4s;
  }

  .cube:hover .bg-right,
  .cube:hover .bg,
  .cube:hover .bg-top {
    background: #00ff00cc;
  }

  .cube:active {
    z-index: 9999;
    animation: bounce 0.1s linear;
  }

  @keyframes bounce {
    50% {
      transform: scale(0.9);
    }
  }`;

export default Test;
