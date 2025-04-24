import React, { useEffect, useRef, useState } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);
  const glyphRef = useRef(null); // store glyph directly
  const [scaleInfo, setScaleInfo] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    fetch("/glyph.json")
      .then(res => res.json())
      .then(data => {
        glyphRef.current = data;
        draw();
      });
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const glyph = glyphRef.current;
    const { width, height } = canvas;

    // compute bounding box and scaling
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    glyph.contours.flat().forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });

    const glyphWidth = maxX - minX;
    const glyphHeight = maxY - minY;
    const scale = Math.min(width * 0.8 / glyphWidth, height * 0.8 / glyphHeight);
    const offsetX = (width - glyphWidth * scale) / 2 - minX * scale;
    const offsetY = (height - glyphHeight * scale) / 2 - minY * scale;
    setScaleInfo({ scale, offsetX, offsetY });

    const transform = (pt) => ({
      x: pt.x * scale + offsetX,
      y: height - (pt.y * scale + offsetY),
    });

    // clear and draw glyph
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    for (let contour of glyph.contours) {
      if (contour.length === 0) continue;
      const start = transform(contour[0]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < contour.length; i++) {
        const pt = transform(contour[i]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
    }

    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw draggable points
    for (let ci = 0; ci < glyph.contours.length; ci++) {
      for (let pi = 0; pi < glyph.contours[ci].length; pi++) {
        const pt = transform(glyph.contours[ci][pi]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
        //ctx.fillStyle = glyph.contours[ci][pi].onCurve ? "blue" : "red";
        ctx.fillStyle = glyph.contours[ci][pi].onCurve ? "#8EEAF4" : "#D020D0";
        ctx.fill();
      }
    }
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const inverseTransform = (x, y) => {
    const { scale, offsetX, offsetY } = scaleInfo;
    return {
      x: (x - offsetX) / scale,
      y: (canvasRef.current.height - y - offsetY) / scale,
    };
  };

  // find nearest point within 8px
  const findNearestPoint = (x, y) => {
    const { scale, offsetX, offsetY } = scaleInfo;
    const glyph = glyphRef.current;
    for (let ci = 0; ci < glyph.contours.length; ci++) {
      for (let pi = 0; pi < glyph.contours[ci].length; pi++) {
        const pt = glyph.contours[ci][pi];
        const tx = pt.x * scale + offsetX;
        const ty = canvasRef.current.height - (pt.y * scale + offsetY);
        if (Math.hypot(tx - x, ty - y) < 8) return { ci, pi };
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    if (!scaleInfo) return;
    const { x, y } = getMousePos(e);
    const nearest = findNearestPoint(x, y);
    if (nearest) setDragging(nearest);
  };

  const handleMouseMove = (e) => {
    if (!dragging || !scaleInfo) return;
    const { x, y } = getMousePos(e);
    const newPt = inverseTransform(x, y);
    const glyph = glyphRef.current;
    glyph.contours[dragging.ci][dragging.pi].x = newPt.x;
    glyph.contours[dragging.ci][dragging.pi].y = newPt.y;
    draw();
  };

  const handleMouseUp = () => setDragging(null);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{ border: "1px solid #aaa", cursor: "pointer" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default Canvas;
