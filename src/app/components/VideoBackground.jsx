"use client";

import { useEffect, useRef } from "react";

export default function VideoBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-60"
        aria-hidden="true"
      ></div>
    </>
  );
}
