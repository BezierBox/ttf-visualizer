import { produce } from "immer";
import React, { useEffect, useRef, useState } from "react";
import { renderGlyphToImage } from "../backend/renderGlyphToImage";

const Canvas = ({
  glyph,
  setGlyph,
  selectedPoint,
  setSelectedPoint,
  history,
  setHistory,
  future,
  setFuture,
  className,
}) => {
  const canvasRef = useRef(null);
  const [scaleInfo, setScaleInfo] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    if (!glyph) return;
    draw();
  }, [glyph]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    // compute bounding box and scaling
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    glyph.flat().forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });

    const glyphWidth = maxX - minX;
    const glyphHeight = maxY - minY;
    const scale = Math.min(
      (width * 0.8) / glyphWidth,
      (height * 0.8) / glyphHeight,
    );
    const offsetX = (width - glyphWidth * scale) / 2 - minX * scale;
    const offsetY = (height - glyphHeight * scale) / 2 - minY * scale;
    setScaleInfo({ scale, offsetX, offsetY });

    const transform = (pt) => ({
      x: pt.x * scale + offsetX,
      y: height - (pt.y * scale + offsetY),
    });

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    // draw glyph outlines with quadratic curves
    ctx.beginPath();
    for (let contour of glyph) {
      if (contour.length === 0) continue;

      const points = contour.slice();
      const first = points[0];
      const last = points[points.length - 1];
      if (!first.onCurve && !last.onCurve) {
        const mid = {
          x: (first.x + last.x) / 2,
          y: (first.y + last.y) / 2,
          onCurve: true,
        };
        points.unshift(mid);
      }

      let i = 0;
      let curr = points[i++];
      ctx.moveTo(...Object.values(transform(curr)));

      while (i < points.length) {
        const p1 = curr;
        const p2 = points[i % points.length];

        if (p1.onCurve && p2.onCurve) {
          ctx.lineTo(...Object.values(transform(p2)));
          curr = p2;
          i++;
        } else if (p1.onCurve && !p2.onCurve) {
          const p3 = points[(i + 1) % points.length];
          let ctrl = p2,
            end;

          if (p3.onCurve) {
            end = p3;
            i += 2;
          } else {
            end = {
              x: (p2.x + p3.x) / 2,
              y: (p2.y + p3.y) / 2,
              onCurve: true,
            };
            points.splice(i + 1, 0, end);
            i += 2;
          }

          const cp = transform(ctrl);
          const ep = transform(end);
          ctx.quadraticCurveTo(cp.x, cp.y, ep.x, ep.y);
          curr = end;
        } else {
          i++;
        }
      }

      ctx.closePath();
    }

    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw draggable points
    for (let ci = 0; ci < glyph.length; ci++) {
      for (let pi = 0; pi < glyph[ci].length; pi++) {
        const pt = transform(glyph[ci][pi]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = glyph[ci][pi].onCurve ? "#8EEAF4" : "#D020D0";
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

  const findNearestPoint = (x, y) => {
    const { scale, offsetX, offsetY } = scaleInfo;
    for (let ci = 0; ci < glyph.length; ci++) {
      for (let pi = 0; pi < glyph[ci].length; pi++) {
        const pt = glyph[ci][pi];
        const tx = pt.x * scale + offsetX;
        const ty = canvasRef.current.height - (pt.y * scale + offsetY);
        if (Math.hypot(tx - x, ty - y) < 8) return { ci, pi };
      }
    }
    return null;
  };

  /* const handleMouseDown = (e) => {
    if (!scaleInfo) return;
    const { x, y } = getMousePos(e);
    const nearest = findNearestPoint(x, y);
    if (nearest) {
      setDragging(nearest);
      setSelectedPoint(nearest);
    }
  }; */
  const handleMouseDown = (e) => {
    if (!scaleInfo) return;
    const { x, y } = getMousePos(e);
    const nearest = findNearestPoint(x, y);
    if (nearest) {
      //save state before editing
      setHistory(
        produce((draft) => {
          draft.push(JSON.parse(JSON.stringify(glyph)));
        }),
      );
      setFuture([]);

      setDragging(nearest);
      setSelectedPoint(nearest);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging || !scaleInfo) return;
    const { x, y } = getMousePos(e);
    const newPt = inverseTransform(x, y);
    setGlyph((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[dragging.ci][dragging.pi].x = newPt.x;
      updated[dragging.ci][dragging.pi].y = newPt.y;
      return updated;
    });
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
      className={className ?? ""}
    />
  );
};

export default Canvas;
