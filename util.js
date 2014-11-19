var pt_to_pt_dist = function(p1, p2) {
  var x = (p1[0]-p2[0]);
  var y = (p1[1]-p2[1]);
  return Math.sqrt(x*x+y*y);
};

function mk_rect(x1, y1, x2, y2) {
  var minx = Math.min(x1, x2);
  var miny = Math.min(y1, y2);
  var maxx = Math.max(x1, x2);
  var maxy = Math.max(x1, x2);
  return [minx, miny, maxx, maxy];
}

function pt_in_rect(pt, rect) {
  if ((pt[0] >= rect[0]) && (pt[0] <= rect[2]) && (pt[1] >= rect[1]) && (pt[1] <= rect[2])) {
    return true;
  }
  return false;
}

function rect_intersect(r1, r2) {
  if (pt_in_rect([r1[0], r1[1]], r2)) {
    return true;
  }
  if (pt_in_rect([r1[0], r1[3]], r2)) {
    return true;
  }
  if (pt_in_rect([r1[2], r1[3]], r2)) {
    return true;
  }
  if (pt_in_rect([r1[2], r1[1]], r2)) {
    return true;
  }
  return false;
}

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

function put_multi_line(ctx, style, x, y, orientation, points, width, transform) {
  if (transform == undefined) {
    transform = true;
  }
  width = width || 5;
  if (transform) {
    ctx.translate(x, y);
    if (orientation != 0) {
      ctx.rotate(orientation);
    }
  }
  var old_color = ctx.fillStyle;
  var old_width = ctx.lineWidth;
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (var i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  //ctx.lineTo(points[0][0], points[0][1]);
  ctx.stroke();
  ctx.strokeStyle = old_color;
  ctx.lineWidth = old_width;
  if (transform) {
    if (orientation != 0) {
      ctx.rotate(-orientation);
    }
    ctx.translate(-x, -y);
  }
}


var ch_s = 83;
var ch_j = 74;
