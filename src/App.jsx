// FancyBezierFontRenderer.jsx
import React, { useRef, useState } from 'react';
import opentype from 'opentype.js';

const FancyBezierFontRenderer = () => {
  const canvasRef = useRef(null);
  const [font, setFont] = useState(null);
  const [char, setChar] = useState('A');

  const drawGlyph = (glyph, ctx) => {
    const path = glyph.getPath(100, 200, 120); // origin x, y, and font size
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 1. Draw the Bézier shape
    ctx.beginPath();
    path.commands.forEach(cmd => {
      switch (cmd.type) {
        case 'M':
          ctx.moveTo(cmd.x, cmd.y);
          break;
        case 'L':
          ctx.lineTo(cmd.x, cmd.y);
          break;
        case 'Q':
          ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
          break;
        case 'C':
          ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          break;
        case 'Z':
          ctx.closePath();
          break;
        default:
          break;
      }
    });
    ctx.fillStyle = 'black';
    ctx.fill();

    // 2. Draw dots at every point (on-curve and off-curve)
    path.commands.forEach(cmd => {
      const drawDot = (x, y, color = 'red', size = 3) => {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      };

      if (cmd.type === 'Q') {
        drawDot(cmd.x, cmd.y, 'red', 3);   // end point (on-curve)
        drawDot(cmd.x1, cmd.y1, 'blue', 2);   // control point (off-curve)

        // handle line
        ctx.beginPath();
        ctx.moveTo(cmd.x, cmd.y);
        ctx.lineTo(cmd.x1, cmd.y1);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
      } else if (cmd.type === 'L' || cmd.type === 'M') {
        drawDot(cmd.x, cmd.y, 'red', 3);
      } else if (cmd.type === 'C') {
        drawDot(cmd.x, cmd.y, 'red', 3);
        drawDot(cmd.x1, cmd.y1, 'orange', 3);
        drawDot(cmd.x2, cmd.y2, 'orange', 3);
      }
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target.result;
        const parsedFont = opentype.parse(arrayBuffer);
        setFont(parsedFont);
        const ctx = canvasRef.current.getContext('2d');
        const glyph = parsedFont.charToGlyph(char);
        drawGlyph(glyph, ctx);
      } catch (err) {
        console.error('Font parsing error:', err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCharChange = (e) => {
    const newChar = e.target.value[0] || ' ';
    setChar(newChar);
    if (font) {
      const ctx = canvasRef.current.getContext('2d');
      const glyph = font.charToGlyph(newChar);
      drawGlyph(glyph, ctx);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '1rem' }}>
      <input type="file" accept=".ttf" onChange={handleFileUpload} />
      <br /><br />
      <label>
        Character to Render:&nbsp;
        <input type="text" value={char} onChange={handleCharChange} maxLength={1} />
      </label>
      <br /><br />
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ border: '1px solid #333', background: '#fefefe' }}
      />
    </div>
  );
};

export default FancyBezierFontRenderer;