const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [2048, 2048],
  animate: true,
  playbackRate: 'fixed',
  fps: 24,
};

const sketch = ({ context, width, height }) => {

  // NOTE:  initialization of agents needs to happen before the function itself.
  //        otherwise, the animation will not render properly. we keep defining the agents on each frame.
  let agents = [];
  for (let i = 0; i < 42; i++) {
    agents.push(new Agent(
      random.range(0, width),
      random.range(0, height)
    ));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const one = agents[i];
      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const distance = one.point.getDistance(other.point);

        if (distance < width / 3) {
          context.save();
          context.lineStyle = 'black';
          context.lineWidth = math.mapRange(distance, 0, width/6, 10, 1);
          context.beginPath();
          context.moveTo(one.point.x, one.point.y);
          context.lineTo(other.point.x, other.point.y);
          context.stroke();
          context.restore();
        }
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      // agent.bounce(width, height);
      agent.wrap(width, height);  // exercise
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
}

class Agent {
  constructor(x, y) {
    this.point = new Vector(x, y);
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(15, 32);
  }

  update() {
    this.point.x += this.velocity.x;
    this.point.y += this.velocity.y;
  }

  bounce(width, height) {
    if (this.point.x < this.radius / 2 || this.point.x > width - this.radius / 2) {
      this.velocity.x *= -1;
    }

    if (this.point.y < this.radius / 2 || this.point.y > height - this.radius / 2) {
      this.velocity.y *= -1;
    }
  }

  wrap(width, height) {
    if (this.point.x <= 0) {
      this.point.x = width;
    } else if (this.point.x >= width) {
      this.point.x = 0;
    }

    if (this.point.y <= 0) {
      this.point.y = height;
    } else if (this.point.y >= height) {
      this.point.y = 0;
    }
  }

  draw(context) {
    context.save();
    context.translate(this.point.x, this.point.y);
    context.lineStyle = 'black';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
}