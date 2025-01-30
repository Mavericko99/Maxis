import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="card1" />
        <div className="card2" />
        <div className="card3">
          * CA: SUqFqVvaduDuQaKNZ1TXCJcGLagdCAQ7Q4s21Gipump
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    position: relative;
    margin-top: -100px;
    width: 560px;

    @media (max-width: 768px) {
      width: 100%; /* Make container full width on smaller screens */
      margin-top: 0; /* Adjust margin for smaller screens */
    }
  }

  .container > * {
    width: 540px;
    height: 120px;
    border: solid 1px #bebebe;
    background-color: #1f1f1f;
    position: absolute;
    border-radius: 10px;
    padding: 10px;
    color: #fff;
    box-shadow: 0px 8px 20px -10px #bbbbbb;
    text-shadow: 0px 0px 5px #fff;
    letter-spacing: 1px;
    background-image: radial-gradient(circle 160px at 50% 120%, #353535, #1f1f1f);
    
    font-size: 14px; /* Default font size for larger screens */

    @media (max-width: 768px) {
      font-size: 10px; /* Font size for mobile screens */
    }
  }

  .card1 {
    width: 500px;
    margin: -20px 0px 0px 20px;
    
    @media (max-width: 768px) {
      width: 90%; /* Make card width responsive on smaller screens */
      margin: 0;
    }
  }

  .card2 {
    width: 520px;
    margin: -10px 0px 0px 10px;
    
    @media (max-width: 768px) {
      width: 90%; /* Make card width responsive on smaller screens */
      margin: 0;
    }
  }

  .card3 {
    width: 540px;
    margin: -20px 0px 0px 20px;
    
    @media (max-width: 768px) {
      width: 90%; /* Make card width responsive on smaller screens */
      margin: 0;
    }
  }
`;

export default Card;
