import React, { useState } from 'react';

const RotatingSquareIcon = ({ size, setIsOn }) => {
  const [clickCount, setClickCount] = useState(0); // 클릭 횟수 상태 관리

  // 클릭 핸들러
  const handleClick = () => {
    setClickCount(clickCount + 1);
    if (clickCount % 2 === 0) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  };

  // 각 정사각형의 크기와 스타일을 설정
  const squareSize = size * 14; // width 비율
  const borderRadius = size * 3; // border-radius 비율
  const borderThickness = size * 3; // border 두께 비율
  const gap = size * 4; // 사각형 사이의 간격 비율

  // 전체 SVG 크기 및 뷰포트 설정
  const svgSize = squareSize * 2 + borderThickness * 2 + gap;

  return (
    <svg
      width={`${svgSize}rem`}
      height={`${svgSize}rem`}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* 왼쪽 위 사각형 */}
      <rect
        x={borderThickness}
        y={borderThickness}
        width={squareSize}
        height={squareSize}
        fill="none"
        stroke="#7392FF"
        strokeWidth={borderThickness}
        rx={borderRadius}
        ry={borderRadius}
      />

      {/* 오른쪽 위 사각형 */}
      <rect
        x={borderThickness + squareSize + gap}
        y={borderThickness}
        width={squareSize}
        height={squareSize}
        fill="none"
        stroke="#EC7348"
        strokeWidth={borderThickness}
        rx={borderRadius}
        ry={borderRadius}
        style={{
          transformOrigin: `${borderThickness + squareSize + gap + squareSize / 2}px ${
            borderThickness + squareSize / 2
          }px`, // 오른쪽 위 사각형의 중앙을 기준으로 회전
          transform: `rotate(${clickCount * 45}deg)`,
          transition: 'transform 0.5s ease',
        }}
      />

      {/* 왼쪽 아래 사각형 */}
      <rect
        x={borderThickness}
        y={borderThickness + squareSize + gap}
        width={squareSize}
        height={squareSize}
        fill="none"
        stroke="#C383D9"
        strokeWidth={borderThickness}
        rx={borderRadius}
        ry={borderRadius}
      />

      {/* 오른쪽 아래 사각형 */}
      <rect
        x={borderThickness + squareSize + gap}
        y={borderThickness + squareSize + gap}
        width={squareSize}
        height={squareSize}
        fill="none"
        stroke="#FFC33F"
        strokeWidth={borderThickness}
        rx={borderRadius}
        ry={borderRadius}
      />
    </svg>
  );
};

export default RotatingSquareIcon;
