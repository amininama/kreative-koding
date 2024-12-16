const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048],
  animate: true,
  playbackRate: 'fixed',
  fps: 1,
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class DashAgent {
  constructor(
    center,
    size,
    angle,
    lineWidth,
    scale,
    radius,
    velocity
  ) {
    this.radius = radius;
    this.velocity = velocity;
    this.center = center;
    this.size = size;
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.scale = scale;
  }

  draw(context) {
    context.save();
    context.beginPath();
    context.fillStyle = 'red';
    context.translate(
      this.center.x + this.radius * Math.cos(this.angle),
      this.center.y + this.radius * Math.sin(this.angle)
    );
    context.rotate(this.angle);
    // context.scale(1, random.range(1, 3));
    context.scale(1, this.scale);
    // context.lineWidth = 5 * random.range(1, 2);
    context.lineWidth = this.lineWidth;

    context.beginPath();
    context.rect(
      -this.size.x / 2,
      -this.size.y / 2,
      this.size.x / 2,
      this.size.y / 2,
    );
    context.fill();
    context.restore();
  }

  update() {
    this.angle = this.angle + this.velocity;
  }
}

class ArcAgent {
  constructor(
    center,
    radius,
    angle,
    lineWidth,
    velocity,
  ) {
    this.velocity = velocity;
    this.center = center;
    this.radius = radius;
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.startAngle = angle * random.range(-2, 2);
    this.endAngle = angle * random.range(-2, 2);
  }

  draw(context) {
    context.save();
    context.beginPath();
    context.translate(this.center.x, this.center.y);
    context.lineWidth = this.lineWidth;

    context.beginPath();
    context.arc(
      0,
      0,
      this.radius,
      this.startAngle,
      this.endAngle,
      true
    );
    context.stroke();
    context.restore();
  }

  update() {
    this.startAngle = this.startAngle + this.velocity;
    this.endAngle = this.endAngle + this.velocity;
  }
}


const stateless = (context, innerFunc) => {
  context.save();
  context.beginPath();
  innerFunc();
  context.restore();
};

const sketch = ({ context, width, height }) => {

  const num = 12 * 3;
  const slice = math.degToRad(360 / num);

  const center_x = width / 2;
  // const center_x = 0;
  const center_y = height / 2;
  // const center_y = height;

  const radius = width * .4;
  const box_w = width / 10;
  const box_h = height / 100;

  const randomVelocity = () => random.range(.002, .004);

  let dashes = [];
  let arcs = [];
  for (let i = 0; i < num; i++) {
    const angle = slice * i;

    dashes.push(
      new DashAgent(
        new Vector(center_x, center_y),
        new Vector(box_w * random.range(.5, 4.5), box_h * random.range(.5, 4.5)),
        angle,
        5 * random.range(1, 2),
        random.range(1, 3),
        radius * 1.2,
        randomVelocity()
      )
    );

    arcs.push(
      new ArcAgent(
        new Vector(center_x, center_y),
        radius * random.range(.8, 1.3),
        angle,
        5 * random.range(1, 3),
        randomVelocity()
      )
    );
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.lineWidth = 4;

    arcs.forEach(arc => {
      arc.update();
      arc.draw(context);
    });

    dashes.forEach(dash => {
      dash.update();
      dash.draw(context, width, height);
    });
  };
};

canvasSketch(sketch, settings);
