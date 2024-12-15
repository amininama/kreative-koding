const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048]
};

const stateless = (context, innerFunc) => {
  context.save();
  context.beginPath();
  innerFunc();
  context.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    /*
    example for doing multiple drawings with save and restore functions:
    const w = width / 3;
    const h = height / 3;

    stateless(context, () => {
      context.translate(width / 2, height / 2);
      context.rotate(degToRad(45));
      context.fillStyle = 'black';
      context.rect(-w / 2, -h / 2, w, h);
      context.fill();
    });

    stateless(context, () => {
      context.translate(300, 300);
      context.fillStyle = 'red';
      context.arc(0, 0, 200, 0, Math.PI * 2, true);
      context.fill();
    });
    */

    context.fillStyle = 'black';
    context.lineWidth = 4;

    // const center_x = width / 2;
    const center_x = 0;
    // const center_y = height / 2;
    const center_y = height;
    // const radius = width / 3;
    const radius = width * .7;
    const num = 12 * 3;
    const box_w = width / 10;
    const box_h = height / 100;

    let x, y;
    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = center_x + radius * Math.cos(angle);
      y = center_y + radius * Math.sin(angle);

      stateless(context, () => {
        context.translate(x, y);
        context.rotate(angle);
        context.scale(1, random.range(1, 3));
        context.lineWidth = 5 * random.range(1, 2);

        context.beginPath();
        context.rect(
          -box_w * random.range(.5, 1.5),
          -box_h * random.range(.5, 1.5),
          box_w * random.range(.5, 1.5),
          box_h * random.range(.5, 1.5)
        );
        context.fill();
      });

      stateless(context, () => {
        context.translate(center_x, center_y);
        context.rotate(angle);
        context.lineWidth = 5 * random.range(1, 3);

        context.beginPath();
        context.arc(
          0,
          0,
          radius * random.range(.8, 1.3),
          angle * random.range(-2, 2),
          angle * random.range(-2, 2),
          true
        );
        context.stroke();
      });
    }

  };
};

canvasSketch(sketch, settings);
