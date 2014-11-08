var pt_to_pt_dist = function(p1, p2) {
  var x = (p1[0]-p2[0]);
  var y = (p1[1]-p2[1]);
  return Math.sqrt(x*x+y*y);
};

function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function render_to_canvas(width, height, renderFunction) {
  var buffer = document.createElement('canvas');
  console.log("buffer");
  console.log(buffer);
  buffer.width = width;
  buffer.height = height;
  renderFunction(width, height, buffer.getContext('2d'));
  return buffer;
};

function put_rect(ctx, style, orientation, x, y, w, h) {
  ctx.translate(x, y);
  if (orientation != 0) {
    ctx.rotate(orientation);
  }
  var old_color = ctx.fillStyle;
  ctx.fillStyle = style;
  ctx.fillRect(-w/2, -h/2, w, h);
  ctx.fillStyle = old_color;
  if (orientation != 0) {
    ctx.rotate(-orientation);
  }
  ctx.translate(-x, -y);
}
