import React, { useState, useRef, useEffect } from 'react';

const ArcAnimation = () => {
  const [currentProgress, setCurrentProgress] = useState(0); // Track the current position of the ball
  const ballRef = useRef(null);
  const arcPathRef = useRef(null);
  const animationIdRef = useRef(null); // Store the animation frame ID to avoid memory leaks

  // Easing function (ease-in-out cubic)
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Function to move the ball to a specific point (A, B, or C)
  const moveToPoint = (targetProgress) => {
    const arcPath = arcPathRef.current;
    const length = arcPath.getTotalLength();
    const animationDuration = 4000; // Duration of animation in milliseconds (increased for smoothness)
    const startTime = performance.now(); // Capture the start time

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const timeFraction = Math.min(elapsedTime / animationDuration, 1); // Cap at 1
      const easedProgress = easeInOutCubic(timeFraction); // Apply easing

      // Calculate new progress based on direction (forward or backward)
      const newProgress = currentProgress + (targetProgress - currentProgress) * easedProgress;
      const position = length * newProgress;
      const coords = arcPath.getPointAtLength(position);

      // Get container dimensions for responsive placement
      const container = document.querySelector('.arc-container');
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // Move the animated ball along the path, adapting to full screen
      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${(coords.x / 100) * containerWidth - 7.5}px, ${(coords.y / 50) * containerHeight - 7.5}px)`;
      }

      // Continue the animation if the timeFraction is less than 1
      if (timeFraction < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentProgress(targetProgress); // Set the final progress
      }
    };

    // Start the animation
    cancelAnimationFrame(animationIdRef.current); // Cancel any ongoing animation
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Set the initial position of the ball at Point A on component mount
  useEffect(() => {
    moveToPoint(0);

    // Cleanup on component unmount to prevent memory leaks
    return () => cancelAnimationFrame(animationIdRef.current);
  }, []);

  return (
    <div className="arc-container">
      {/* Static Red Balls for Points A, B, and C */}
      <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
        {/* Responsive Cubic Bézier Curve */}
        <path ref={arcPathRef} id="arcPath" d="M 5 45 C 25 5, 75 5, 95 45" stroke="blue" fill="transparent" strokeWidth="0.5" />

        {/* Static Red Balls */}
        <circle cx="5" cy="45" r="0.5" fill="red" />  {/* Ball at Point A */}
        <circle cx="50" cy="15" r="0.5" fill="red" /> {/* Ball at Point B */}
        <circle cx="95" cy="45" r="0.5" fill="red" /> {/* Ball at Point C */}

        {/* Labels for the points */}
        <text x="2" y="48" fontFamily="Arial" fontSize="2" fill="black" onClick={() => moveToPoint(0)}>A</text>
        <text x="49" y="12" fontFamily="Arial" fontSize="2" fill="black" onClick={() => moveToPoint(0.5)}>B</text>
        <text x="92" y="48" fontFamily="Arial" fontSize="2" fill="black" onClick={() => moveToPoint(1)}>C</text>
      </svg>

      {/* The moving ball */}
      <div className="ball" ref={ballRef}></div>
    </div>
  );
};

export default ArcAnimation;
