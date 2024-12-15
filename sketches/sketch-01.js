const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * .01;

    context.strokeStyle = 'white';
    
    const rowSize = 5;
    const margin = 200;
    const gap = 50;
    const innerGap = 40;
    const boxWidth = (width - (margin * 2) - (gap * (rowSize - 1))) / rowSize;
    const boxHeight = (height - (margin * 2) - (gap * (rowSize - 1))) / rowSize;
    let x, y;

    for (let i = 0; i < rowSize; i++) {
      x = margin + (boxWidth + gap) * i;

      for (let j = 0; j < rowSize; j++) {
        y = margin + (boxHeight + gap) * j;

        context.beginPath();
        context.rect(x, y, boxWidth, boxHeight);
        context.stroke();

        if (Math.random() > .5) {
          context.beginPath();
          context.rect(x + innerGap, y + innerGap, boxWidth - innerGap * 2, boxHeight - innerGap * 2);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
