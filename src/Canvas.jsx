import React, { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    fetch('/glyph.json')
      .then(res => res.json())
      .then(data => {
        drawGlyph(ctx, data);
      });

    function drawGlyph(ctx, glyph) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
      glyph.contours.flat().forEach(p => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
    
      const glyphWidth = maxX - minX;
      const glyphHeight = maxY - minY;
      const scale = Math.min(canvas.width * 0.8 / glyphWidth, canvas.height * 0.8 / glyphHeight);
      const offsetX = (canvas.width - glyphWidth * scale) / 2 - minX * scale;
      const offsetY = (canvas.height - glyphHeight * scale) / 2 - minY * scale;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
    
      const transform = (pt) => ({
        x: pt.x * scale + offsetX,
        y: canvas.height - (pt.y * scale + offsetY),
      });
    
      // draw glyph outlines
      ctx.beginPath();
      for (let contour of glyph.contours) {
        if (contour.length === 0) continue;
    
        const points = contour.slice();
        const first = points[0], last = points[points.length - 1];
        if (!first.onCurve && !last.onCurve) {
          const mid = { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2, onCurve: true };
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
            let ctrl = p2, end;
    
            if (p3.onCurve) {
              end = p3;
              i += 2;
            } else {
              end = {
                x: (p2.x + p3.x) / 2,
                y: (p2.y + p3.y) / 2,
                onCurve: true
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
    
      // draw bezier handles and control points 
      for (let contour of glyph.contours) {
        const points = contour.slice();
        const first = points[0], last = points[points.length - 1];
        if (!first.onCurve && !last.onCurve) {
          const mid = { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2, onCurve: true };
          points.unshift(mid);
        }
    
        let i = 0;
        let curr = points[i++];
    
        while (i < points.length) {
          const p1 = curr;
          const p2 = points[i % points.length];
    
          if (p1.onCurve && !p2.onCurve) {
            const p3 = points[(i + 1) % points.length];
            let ctrl = p2, end;
    
            if (p3.onCurve) {
              end = p3;
              i += 2;
            } else {
              end = {
                x: (p2.x + p3.x) / 2,
                y: (p2.y + p3.y) / 2,
                onCurve: true
              };
              points.splice(i + 1, 0, end);
              i += 2;
            }
    
            const tp1 = transform(p1);
            const cp = transform(ctrl);
            const ep = transform(end);
    
            // draw control handle line
            ctx.beginPath();
            ctx.moveTo(tp1.x, tp1.y);
            ctx.lineTo(cp.x, cp.y);
            ctx.lineTo(ep.x, ep.y);
            ctx.strokeStyle = "darkgray";
            ctx.stroke();
    
            // draw control point
            ctx.beginPath();
            ctx.arc(cp.x, cp.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
    
            // draw end point
            ctx.beginPath();
            ctx.arc(ep.x, ep.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
    
            curr = end;
          } else {
            curr = p2;
            i++;
          }
        }
      }
    
      // draw all on-curve/off-curve points 
      for (const contour of glyph.contours) {
        for (const pt of contour) {
          const { x, y } = transform(pt);
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = pt.onCurve ? "blue" : "red";
          ctx.fill();
        }
      }
    }
  }, []);

  return <canvas id="glyphCanvas" ref={canvasRef} width="400" height="400" />;
};

export default Canvas;