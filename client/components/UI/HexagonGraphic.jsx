import React from "react";

const HexagonGraphic = ({ color }) => {
  return (
    <svg
      width="144"
      height="160"
      viewBox="0 0 144 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d)">
        <path
          d="M65 5.04145C69.3316 2.54059 74.6684 2.54059 79 5.04145L129.952 34.4586C134.284 36.9594 136.952 41.5812 136.952 46.5829V105.417C136.952 110.419 134.284 115.041 129.952 117.541L79 146.959C74.6684 149.459 69.3316 149.459 65 146.959L14.0481 117.541C9.71648 115.041 7.0481 110.419 7.0481 105.417V46.5829C7.0481 41.5812 9.71648 36.9594 14.0481 34.4585L65 5.04145Z"
          fill="white"
        />
        <path
          d="M74 13.7017L124.952 43.1188C126.19 43.8333 126.952 45.1538 126.952 46.5829V105.417C126.952 106.846 126.19 108.167 124.952 108.881L74 138.298C72.7624 139.013 71.2376 139.013 70 138.298L19.0481 108.881C17.8105 108.167 17.0481 106.846 17.0481 105.417V46.5829C17.0481 45.1538 17.8105 43.8333 19.0481 43.1188L70 13.7017C71.2376 12.9872 72.7624 12.9872 74 13.7017Z"
          stroke={color}
          strokeWidth="20"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0.0480957"
          y="0.165771"
          width="143.904"
          height="159.668"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="3.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default HexagonGraphic;
