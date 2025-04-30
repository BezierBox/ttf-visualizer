export const renderGlyphToImage = (glyph, width = 100, height = 100) => {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  const ctx = offscreenCanvas.getContext("2d");

  // Compute bounding box and scaling
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

  const transform = (pt) => ({
    x: pt.x * scale + offsetX,
    y: height - (pt.y * scale + offsetY),
  });

  // Clear and draw glyph
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";

  ctx.beginPath();
  for (let contour of glyph.contours) {
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

  ctx.stroke();

  // Draw points
  for (let ci = 0; ci < glyph.contours.length; ci++) {
    for (let pi = 0; pi < glyph.contours[ci].length; pi++) {
      const pt = transform(glyph.contours[ci][pi]);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = glyph.contours[ci][pi].onCurve ? "#8EEAF4" : "#D020D0";
      ctx.fill();
    }
  }

  // Convert to data URL
  return offscreenCanvas.toDataURL();
};

export const renderAllGlyphs = (glyphs) => {
  return glyphs.map(glyph => renderGlyphToImage(glyph));
};