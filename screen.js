function GameScreen() {};

GameScreen.prototype = {
  canvas: null,
  width: 0,
  height: 0,
  ctx: null,
  const_fps: 30,
  frame_timeout: 0,
  text_display_array: [],

  init: function(self) {
    self.frame_timeout = 1000/self.const_fps;
    self.canvas = document.getElementById("canvas");
    var min_dim = Math.min(window.innerWidth, window.innerHeight);
    console.log("min_dim:", min_dim);
    self.canvas.height = Math.floor(window.innerHeight - 20);
    self.canvas.width = Math.floor(window.innerWidth - 20);
    //self.canvas.width = self.canvas.height*9/16;
    // self.canvas.width = 720;
    // self.canvas.height = 1280;
    self.width = self.canvas.width;
    self.height = self.canvas.height;
    self.ctx = self.canvas.getContext("2d");
  },

  set_keydown_cb: function(self, cb) {
    window.addEventListener('keydown', cb, true);
  },

  set_keyup_cb: function(self, cb) {
    window.addEventListener('keyup', cb, true);
  },

  set_touchstart_cb: function(self, cb) {
    window.addEventListener('touchstart', cb, true);
  },

  set_touchend_cb: function(self, cb) {
    window.addEventListener('touchend', cb, true);
  },

  set_touchmove_cb: function(self, cb) {
    window.addEventListener('touchmove', cb, true);
  },

  get_text_w: function(self, cw, text) {
    return cw*text.length;
  },

  put_image: function(self, image, x, y) {
    //console.log(image);
    self.ctx.drawImage(image, x, y);
  },

  put_text: function(self, font, style, text, px, py) {
    var old_color = self.ctx.fillStyle;
    self.ctx.fillStyle = style;
    var old_font = self.ctx.font;
    self.ctx.font = font;
    self.ctx.fillText(text, px, py);
    self.ctx.fillStyle = old_color;
    self.ctx.font = old_font;
  },

  put_line: function(self, style, sx, sy, ex, ey, width) {
    width = width || 5;
    var old_color = self.ctx.fillStyle;
    var old_width = self.ctx.lineWidth;
    self.ctx.strokeStyle = style;
    self.ctx.lineWidth = width;
    self.ctx.beginPath();
    self.ctx.moveTo(sx, sy);
    self.ctx.lineTo(ex, ey);
    self.ctx.stroke();
    self.ctx.strokeStyle = old_color;
    self.ctx.lineWidth = old_width;
  },

  put_arrow: function(self, style, x, y, orientation, l, width, head_sz) {
    head_sz = head_sz || 10;
    width = width || 5;
    self.ctx.translate(x, y);
    if (orientation != 0) {
      self.ctx.rotate(orientation);
    }
    var old_color = self.ctx.fillStyle;
    var old_width = self.ctx.lineWidth;
    self.ctx.strokeStyle = style;
    self.ctx.lineWidth = width;
    self.ctx.beginPath();
    self.ctx.moveTo(0, 0);
    self.ctx.lineTo(l-head_sz, 0);
    self.ctx.lineTo(l-head_sz, head_sz/2);
    self.ctx.lineTo(l, 0);
    self.ctx.lineTo(l-head_sz, -head_sz/2);
    self.ctx.lineTo(l-head_sz, 0);
    self.ctx.stroke();
    self.ctx.strokeStyle = old_color;
    self.ctx.lineWidth = old_width;
    if (orientation != 0) {
      self.ctx.rotate(-orientation);
    }
    self.ctx.translate(-x, -y);

  },

  put_multi_line: function(self, style, x, y, orientation, points, width, transform) {
    if (transform == undefined) {
      transform = true;
    }
    width = width || 5;
    if (transform) {
      self.ctx.translate(x, y);
      if (orientation != 0) {
        self.ctx.rotate(orientation);
      }
    }
    var old_color = self.ctx.fillStyle;
    var old_width = self.ctx.lineWidth;
    self.ctx.strokeStyle = style;
    self.ctx.lineWidth = width;
    self.ctx.beginPath();
    self.ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) {
      self.ctx.lineTo(points[i][0], points[i][1]);
    }
    //self.ctx.lineTo(points[0][0], points[0][1]);
    self.ctx.stroke();
    self.ctx.strokeStyle = old_color;
    self.ctx.lineWidth = old_width;
    if (transform) {
      if (orientation != 0) {
        self.ctx.rotate(-orientation);
      }
      self.ctx.translate(-x, -y);
    }
  },

  put_rect: function(self, style, orientation, x, y, w, h) {
    self.ctx.translate(x, y);
    if (orientation != 0) {
      self.ctx.rotate(orientation);
    }
    var old_color = self.ctx.fillStyle;
    self.ctx.fillStyle = style;
    self.ctx.fillRect(-w/2, -h/2, w, h);
    self.ctx.fillStyle = old_color;
    if (orientation != 0) {
      self.ctx.rotate(-orientation);
    }
    self.ctx.translate(-x, -y);
  },

  put_triangle: function(self, style, orientation, width, x, y, x1, y1, x2, y2, x3, y3) {
    width = width || 5;
    var old_width = self.ctx.lineWidth;
    self.ctx.lineWidth = width;
    self.ctx.translate(x, y);
    if (orientation != 0) {
      self.ctx.rotate(orientation);
    }
    self.ctx.strokeStyle = style;
    self.ctx.beginPath();
    self.ctx.moveTo(x1, y1);
    self.ctx.lineTo(x2, y2);
    //self.ctx.moveTo(x2, y2);
    self.ctx.lineTo(x3, y3);
    //self.ctx.moveTo(x3, y3);
    self.ctx.lineTo(x1, y1);
    self.ctx.stroke();
    if (orientation != 0) {
      self.ctx.rotate(-orientation);
    }
    self.ctx.translate(-x, -y);
    self.ctx.lineWidth = old_width;
  },

  circle_in_screen: function(self, x, y, r) {
    if ((x+r)<0 || (x-r)>self.width || (y+r)<0 || (y-r)>self.height) {
      // console.log("w:"+self.width);
      // console.log("h:"+self.height);
      // console.log("x+r:"+(x+r));
      // console.log("x-r:"+(x-r));
      // console.log("y-r:"+(y-r));
      // console.log("y+r:"+(y+r));
      return false;
    }
    return true;
  },

  draw: function(self, callback) {
    self.ctx.clearRect(0, 0, self.width, self.height);
    self.put_rect(self, "#082B3D", 0, self.width/2, self.height/2, self.width, self.height);
    callback();
  }
};

var gamescreen = new GameScreen();
