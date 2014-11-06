function GameScreen() {};

GameScreen.prototype = {
  canvas: null,
  width: 0,
  height: 0,
  ctx: null,
  const_fps: 30,
  frame_timeout: 0,


  init: function(self) {
    self.frame_timeout = 1000/self.const_fps;
    self.canvas = document.getElementById("canvas");
    var min_dim = Math.min(window.innerWidth, window.innerHeight);
    console.log("min_dim:", min_dim);
    self.canvas.width = min_dim;
    self.canvas.height = min_dim;
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


  get_text_w: function(self, cw, text) {
    return cw*text.length;
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

  put_triangle: function(self, style, orientation, x, y, x1, y1, x2, y2, x3, y3) {
    self.ctx.translate(x, y);
    if (orientation != 0) {
      self.ctx.rotate(orientation);
    }
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
  },

  draw: function(self, callback) {
    self.ctx.clearRect(0, 0, self.width, self.height);
    self.put_rect(self, "#082B3D", 0, self.width/2, self.height/2, self.width, self.height);
    callback();
  }
};

var gamescreen = new GameScreen();
function Player() {};

Player.prototype = {
  x: 0,
  y: 0,

  init: function(self) {
  },

  move_x: function(self, delta) {
    if ((Math.abs(self.x+delta)<gamescreen.width/2)) {
      self.x+=delta;
    }
  },

  draw: function(self) {
    var x = self.x + gamescreen.width/2;
    var y = self.y + 2*gamescreen.height/3;
    gamescreen.put_triangle(gamescreen, "blue", 0, x, y, -10, 10, 0, -20, 10, 10);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,
  player: null,
  left: false,
  right: false,

  keydown: function(self, event) {
    //console.log("down");
    //console.log(event);
    if (event.keyCode == 65) { //a
      self.left = true;
    }
    if (event.keyCode == 68) { //d
      self.right = true;
    }

  },

  keyup: function(self, event) {
    //console.log("up");
    //console.log(event);
    if (event.keyCode == 65) { //a
      self.left = false;
    }
    if (event.keyCode == 68) { //d
      self.right = false;
    }

  },

  init: function(self) {
    self.default_velocity = gamescreen.height/20;
    self.player = new Player();
    self.player.init(self.player);

    gamescreen.set_keydown_cb(gamescreen, self.keydown_cb);
  },

  draw: function(self) {
    if (self.left) {
      self.player.move_x(self.player, -self.default_velocity);
    }
    if (self.right) {
      self.player.move_x(self.player, self.default_velocity);
    }

    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
    self.player.draw(self.player);
    
  }
};

var gamelogic = new GameLogic();
function Layer() {};

Layer.prototype = {
  name: name,

  init: function(self, layer_json) {
  },

  draw: function(self) {
    for (var i = 0; i < self.proxys.length; i++) {
      var proxy = self.proxys[i];
      proxy.draw(proxy);
    }
  }
};

var logic = function() {
  console.log("loaded");
  map.init(map);
  gamescreen.init(gamescreen);
  gamelogic.init(gamelogic);

  gamescreen.set_keydown_cb(gamescreen, function(kc) {
    gamelogic.keydown(gamelogic, kc);
  });

  gamescreen.set_keyup_cb(gamescreen, function(kc) {
    gamelogic.keyup(gamelogic, kc);
  });

  var drawAll = function() {
    map.draw(map);
    gamelogic.draw(gamelogic);
  };

  window.setInterval(function() {
    gamescreen.draw(gamescreen, drawAll);
  }, gamescreen.frame_timeout);
};

document.addEventListener("DOMContentLoaded", logic, false);
function Map() {};

Map.prototype = {
  draw: function(self) {
  },
  init: function(self) {
  }
};

var map = new Map();
var pt_to_pt_dist = function(p1, p2) {
  var x = (p1[0]-p2[0]);
  var y = (p1[1]-p2[1]);
  return Math.sqrt(x*x+y*y);
};

function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
