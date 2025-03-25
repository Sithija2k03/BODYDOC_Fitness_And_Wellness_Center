import React from "react";
import styled, { keyframes } from "styled-components";
import { useWindowSize } from "../../utils/useWindowSize";

function Orb() {
    const { width, height } = useWindowSize();
    console.log("Window Size:", width, height);

    return <OrbStyled $width={width} $height={height} />;
}

// Function to generate dynamic keyframes
const generateOrbAnimation = (width, height) => keyframes`
    0% {
      transform: translate(0px, 0px);
    }
    50% {
      transform: translate(${width - 100}px, ${height - 100}px);
    }
    100% {
      transform: translate(0, 0);
    }
`;

const OrbStyled = styled.div`
    width: 70vh;
    height: 70vh;
    position: absolute;
    border-radius: 40%;
    margin-left: -150vh;
    margin-top: -100vh;
    background: linear-gradient(180deg, #f56692 0%, #f2994a 100%);
    filter: blur(150px);
    
    /* Using dynamic props for animation */
    animation: ${({ $width, $height }) => generateOrbAnimation($width, $height)} 4s alternate linear infinite;
`;

export default Orb;
