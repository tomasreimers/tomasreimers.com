const Color = require('color');

(function () {
  // RESIZE LOGIC
  const resize_handler = function () {
    const canvas = document.getElementById('stage');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resize_handler, false);
  resize_handler();

  // CIRCLES ITERATIVELY
  const add_circle_coeff = 0.05;
  const max_up_speed = 0.02;
  const min_up_speed = 0.01;
  const max_down_speed = 0.02;
  const min_down_speed = 0.01;
  const max_up_v = -2;
  const min_up_v = -4;
  const max_explosion_speed = 6;
  const min_explosion_speed = 1;
  const max_up_alpha = 0.6;
  const min_number_of_shards = 6;
  const max_number_of_shards = 12;
  const global_acceleration = 0.05;
  const global_wind_resistance = 0.99;
  const up_radius = 4;
  const fps = 60;

  let last_time_updated = Date.now();
  let circles = [];

  // REDRAW HANDLER
  const redraw_handler = function () {
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');

    // clear the space
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // check if we need to push the frame forward
    if (Date.now() - last_time_updated > (1. / fps)) {
      last_time_updated = Date.now();

      // update the circles
      let new_circles = [];
      for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];

        if (circle.state == 'up') {
          circle.y += circle.y_velocity;
          circle.y_velocity += global_acceleration;
          if (circle.timing < 1) {
            circle.timing += circle.speed;
            new_circles.push(circle);
          } else {
            let explosion_speed = Math.random() * (max_explosion_speed - min_explosion_speed) + min_explosion_speed;
            let number_of_shards = Math.floor(Math.random() * (max_number_of_shards - min_number_of_shards) + min_number_of_shards);
            for (let j = 0; j < number_of_shards; j++) {
              let angle = (Math.PI * 2) * (j / number_of_shards)
              new_circles.push({
                x: circle.x,
                y: circle.y,
                timing: 0,
                speed: Math.random() * (max_down_speed - min_down_speed) + min_down_speed,
                x_velocity: Math.sin(angle) * explosion_speed,
                y_velocity: Math.cos(angle) * explosion_speed,
                state: 'down',
                hue: circle.hue
              });
            }
          }
        } else if (circle.state == 'down') {
          if (circle.timing < 1) {
            circle.timing += circle.speed;
          }
          circle.y += circle.y_velocity;
          circle.x += circle.x_velocity;
          circle.y_velocity += global_acceleration;
          circle.x_velocity *= global_wind_resistance;
          if (circle.y > 0 && circle.timing < 1) {
            new_circles.push(circle);
          }
        }
      }
      circles = new_circles;

      // randomly choose to create a circle
      if (Math.random() < add_circle_coeff) {
        circles.push({
          x: canvas.width * Math.random(),
          y: (canvas.height / 2) * Math.random() + (canvas.height / 2),
          timing: 0,
          speed: Math.random() * (max_up_speed - min_up_speed) + min_up_speed,
          x_velocity: 0,
          y_velocity: Math.random() * (max_up_v - min_up_v) + min_up_v,
          state: 'up',
          hue: 360 * Math.random()
        });
      }
    }

    // draw the circles
    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i];
      ctx.beginPath();
      if (circle.state == 'up') {
        let alpha = max_up_alpha * circle.timing
        ctx.fillStyle = Color.hsl(circle.hue, 100, 50).alpha(alpha).rgb().string();
      } else if (circle.state == 'down') {
        let alpha = max_up_alpha * (1 - circle.timing)
        ctx.fillStyle = Color.hsl(circle.hue, 100, 50).alpha(alpha).rgb().string();
      }
      ctx.arc(circle.x, circle.y, up_radius, 0, 2 * Math.PI, false);
      ctx.fill();
    }

    // schedule next draw
    window.requestAnimationFrame(redraw_handler);
  };

  redraw_handler();
})();
