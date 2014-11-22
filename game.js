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
function Background() {};

Background.prototype = {
  start_counter1: 0,
  start_counter2: 0,
  size1: 5,
  size2: 3,
  layer1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  layer2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  const_layer1_color: "#999999",
  const_layer2_color: "#777777",
  const_j_l1_c: "#FFFFFF",
  const_j_l2_c: "#999999",
  speed_steps: [1, 2, 3, 4, 5],
  cur_speed_step: 0,
  const_normal_inc1: 1,
  const_normal_inc2: 1,
  const_max_inc1: 5,
  const_max_inc2: 5,
  current_increment1: 1,
  current_increment2: 1,
  layer1_xoffset: 0,
  pause: false,

  jump: false,
  jump_anim_ctr: 240,
  const_jump_start_ctr: 240,
  const_b_max: 0.2,

  get_jump_started: function(self) {
    if (self.jump_anim_ctr <= 0) {
      return true;
    }
    return false;
  },

  set_jump: function(self) {
    self.jump = true;
    self.jump_anim_ctr = self.const_jump_start_ctr;
  },

  unset_jump: function(self) {
    self.jump = false;
    self.jump_anim_ctr = self.const_jump_start_ctr;
  },

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },
  
  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.current_increment = self.speed_steps[self.cur_speed_step];
  },

  set_x_offset: function(self, offset){
    self.layer1_xoffset = offset;
  },
  
  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.current_increment = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.current_increment1 = self.speed_steps[0];
    self.current_increment2 = self.speed_steps[0];
    self.cur_speed_step = 0;
  },

  draw_normal: function(self) {
    var y = gamescreen.height;
    for (var i = self.start_counter2; i < self.layer2.length; i++) {
      if (self.layer2[i] != 0) {
          gamescreen.put_rect(gamescreen, self.const_layer2_color, 0, self.layer2[i], y, self.size2, self.size2);
      }
      y-=gamescreen.height/self.layer2.length;
    }
    for (var i = 0; i < self.start_counter2; i++) {
      if (self.layer2[i] != 0) {
        gamescreen.put_rect(gamescreen, self.const_layer2_color, 0, self.layer2[i], y, self.size2, self.size2);
      }
      y-=gamescreen.height/self.layer2.length;
    }

    y = gamescreen.height;
    for (var i = self.start_counter1; i < self.layer1.length; i++) {
      if (self.layer1[i] != 0) {
        gamescreen.put_rect(gamescreen, self.const_layer1_color, 0, self.layer1[i]+self.layer1_xoffset, y, self.size1, self.size1);
      }
      y-=gamescreen.height/self.layer1.length;
    }
    for (var i = 0; i < self.start_counter1; i++) {
      if (self.layer1[i] != 0) {
        gamescreen.put_rect(gamescreen, self.const_layer1_color, 0, self.layer1[i]+self.layer1_xoffset, y, self.size1, self.size1);
      }
      y-=gamescreen.height/self.layer1.length;
    }
  },

  draw_jump: function(self) {
    var c = 1-self.jump_anim_ctr/self.const_jump_start_ctr;
    self.current_increment1 = Math.floor(2*c*self.const_max_inc1+1);
    self.current_increment2 = Math.floor(2*c*self.const_max_inc2+1);
    var l2_xsz = self.size2;
    var l1_xsz = self.size1;
    var l2_ysz = self.size2*15*c;
    var l1_ysz = self.size1*10*c;
    var w_2 = gamescreen.width/2;
    var b = 2*w_2*self.const_b_max;
    var k = (w_2 - b)/w_2;

    if (self.jump_anim_ctr > 0) {
      
      b = b * c;
      k = (w_2 - b)/w_2;
      self.jump_anim_ctr --;
      //console.log("jump anim:"+self.jump_anim_ctr+" b:"+b, " k:"+k);
    }
   

    var y = gamescreen.height;
    for (var i = self.start_counter2; i < self.layer2.length; i++) {
      if (self.layer2[i] != 0) {
        var x = self.layer2[i];
        gamescreen.put_rect(gamescreen, self.const_j_l2_c, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l2_xsz, l2_ysz);
      }
      y-=gamescreen.height/self.layer2.length;
    }
    for (var i = 0; i < self.start_counter2; i++) {
      if (self.layer2[i] != 0) {
        var x = self.layer2[i];
        gamescreen.put_rect(gamescreen, self.const_j_l2_c, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l2_xsz, l2_ysz);
      }
      y-=gamescreen.height/self.layer2.length;
    }

    y = gamescreen.height;
    for (var i = self.start_counter1; i < self.layer1.length; i++) {
      if (self.layer1[i] != 0) {
        var x = self.layer1[i];
        gamescreen.put_rect(gamescreen, self.const_j_l1_c, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l1_xsz, l1_ysz);
      }
      y-=gamescreen.height/self.layer1.length;
    }
    for (var i = 0; i < self.start_counter1; i++) {
      if (self.layer1[i] != 0) {
        var x = self.layer1[i];
        gamescreen.put_rect(gamescreen, self.const_j_l1_c, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l1_xsz, l1_ysz);
      }
      y-=gamescreen.height/self.layer1.length;
    }
  },

  draw: function(self) {
    if (! self.pause) {
      self.start_counter1 += self.current_increment1;
      self.start_counter1 %= self.layer1.length;
      self.start_counter2 += self.current_increment2;
      self.start_counter2 %= self.layer2.length;
    }

    if (self.jump) {
      self.draw_jump(self);
    } else {
      self.draw_normal(self);
    }

  },
  init: function(self) {
    //randomly fill background
    for (var i = 0; i < self.layer1.length; i++) {
      var rand = Math.random()*3;
      if (rand/2 < 1) {
        var x = rand*gamescreen.width;
        self.layer1[i] = x;
      }
    }
    for (var i = 0; i < self.layer2.length; i++) {
      var rand = Math.random()*5;
      if (rand/2 < 1) {
        var x = Math.random()*gamescreen.width;
        self.layer2[i] = x;
      }
    }

    //console.log(self.layer2);
  }
};

function Torpedo() {};

Torpedo.prototype = {
  x: 0, // own coords
  y: 0,
  px: 0,
  py: 0,
  sx: 0,
  sy: 0,
  velocity: 0,
  const_velocity: 15,
  orientation: 0,

  const_target_sector: 0.2,
  const_target_dist: 0,
  
  ttl: 10,
  dead: false,
  exploded: false,
  r: 10,
  name: "Anti-asteroid torpedo",
  const_max_ang_vel: 0.03,
  tx: 0, //target coords
  ty: 0,
  trail: null,
  trail_ctr: 0,
  const_trail_period: 2,
  const_trail_max_len: 10,
  asteroid_id: null,
  asteroids: null,
  speed_steps: [5, 10, 15, 20, 25],
  cur_speed_step: 0,
  y_addition: 0,
  dir_update_ctr: 0,
  const_duc: 20,
  
  start_seq: 0,
  const_start_seq: 20,
  start_dir: 0,

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
  },

  set_normal_speed: function(self) {
    self.speed_step = 0;
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
  },

  find_closest_ahead: function(self, asteroids) {
    var idx = -1;
    for (var i = 0; i < asteroids.length; i++) {
      var ast = asteroids[i];
      if (ast!=null) {
        var angle = Math.atan2(ast.y-self.y, ast.x-self.x);
        var dist = pt_to_pt_dist([self.x, self.y], [ast.x, ast.y]);
        if ((Math.abs(self.orientation-angle)<self.const_target_sector)) {
          min_dy = dist;
          idx = i;
        }
      }
    }
    return idx;
  },
  
  init: function(self, x, y, asteroids, orientation, max_ang_vel) {
    self.const_target_dist = gamescreen.height/10;
    self.start_dir = self.orientation+(Math.random()*0.2-0.1);
    self.velocity = 0;
    self.trail = [];
    self.const_max_ang_vel = self.const_max_ang_vel || max_ang_vel;
    self.orientation = orientation || -Math.PI/2;
    self.x = x;
    self.y = y;
    self.px = x;
    self.py = y;
    self.sx = x;
    self.sy = y;
    var min_dy = gamescreen.height*2;
    var idx = self.find_closest_ahead(self, asteroids);
    if (idx == -1) {
      self.tx = self.x;
      self.ty = self.y-10000;
      return false;
    }
    self.asteroid_id = idx;
    self.tx = asteroids[idx].x;
    self.ty = asteroids[idx].y;
    return true;
  },

  is_dead: function(self) {
    return self.dead;
  },

  explode: function(self) {
    self.dead = true;
  },

  draw: function(self) {
    var asteroids = gamelogic.asteroids;
    //console.log(asteroids);
    //console.log("id:"+self.asteroid_id);
    self.start_seq++;
    if (self.start_seq > self.const_start_seq) {
      var ast = asteroids[self.asteroid_id];
      if (ast!=null) {
        self.tx = ast.x;
        self.ty = ast.y;
      } else {
        self.tx = self.x;
        self.ty = self.y-10000;
        //console.log("missing target");
      }
      
      if (self.dir_update_ctr > self.const_duc) {
        self.dur_update_ctr = 0;
        var target_dir = Math.atan2(self.ty-self.y, self.tx-self.x);
        var diff = target_dir-self.orientation;
        //console.log("delta:"+diff+", "+target_dir+", "+self.orientation);
        var abs_diff = Math.abs(diff);
        if (abs_diff>0.01) {
          var dec_direction = diff/abs_diff;
          var correction = diff;
          if (abs_diff > self.const_max_ang_vel) {
            correction = dec_direction*self.const_max_ang_vel;
          }
          //console.log("correcting");
          //console.log("orientation: "+self.orientation);
          //console.log("correction: "+correction);
          
          self.orientation += correction;
        }
      }
      self.dir_update_ctr ++;
    } else {
      var c = self.start_seq/self.const_start_seq;
      self.velocity = (self.const_velocity)*(c*0.7+0.3);
      //self.orientation = self.start_dir;
    }
    self.ttl--;
    if (self.ttl<0) {
      if (! gamescreen.circle_in_screen(gamescreen, self.x, self.y, 5)) {
        self.dead = true;
      }
    }
    self.px = self.x;
    self.py = self.y;
    self.y += Math.sin(self.orientation)*self.velocity + self.speed_steps[self.cur_speed_step];
    self.x += Math.cos(self.orientation)*self.velocity;
    var angle = Math.atan2(self.y-self.py, self.x-self.px);
    gamescreen.put_triangle(gamescreen, "white", angle+Math.PI/2, 1, self.x, self.y, -3, 3, 0, -6, 3, 3);
    
    // if (self.trail_ctr > self.const_trail_period) {
    //   self.trail.push([self.x, self.y]);
    // }
    // self.trail_ctr++;
    // //console.log(self.trail);
    // if (self.trail.length > 0) {
    //   if (self.trail.length > self.const_trail_max_len) {
    //     self.trail.shift();
    //   }
    //   gamescreen.put_multi_line(gamescreen, "white", 0, self.y_addition, 0, self.trail, 1);
    // }
  }
};
function AATurret() {};

AATurret.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  orientation: 0,
  ang_vel: 0.06,
  r: 30,
  torpedos: null,
  const_max_torpedos: 4,
  cur_speed_step: 0,
  speed_steps: [5,10,15,20,25],
  rel_speed: 5,
  const_x_velocity: 0,
  pause: false,
  points: null,

  launch_ctr: 0,
  const_launch_ctr: 10,

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    for (var i = 0; i < self.torpedos.length; i++) {
      var t = self.torpedos[i];
      if (t!=null) {
        t.set_speed_step(t, step);
      }
    }
    self.rel_speed = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.cur_speed_step = 0;

    for (var i = 0; i < self.torpedos.length; i++) {
      var t = self.torpedos[i];
      if (t!=null) {
        t.set_normal_speed(t);
      }
    }
    self.rel_speed = self.speed_steps[self.cur_speed_step];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    for (var i = 0; i < self.torpedos.length; i++) {
      var t = self.torpedos[i];
      if (t!=null) {
        t.inc_speed(t);
      }
    }
    self.rel_speed = self.speed_steps[self.cur_speed_step];
  },

  init: function(self, x_pos, y_pos, orientation) {
    var sign = (Math.random()>0.5?1:-1);
    self.ang_vel = sign*0.2+sign*Math.random()*0.3
    self.torpedos = [];
    self.points = [[0,0], [0,0], [0,0], [0,0], [0,0]];
    self.x = x_pos;
    self.y = y_pos;
    self.orientation = 2*Math.random()*Math.PI-Math.PI;
    var x;
    var y;
    var ang_inc = 2*Math.PI/self.points.length;
    var ang = 0;
    for (var i = 0; i < self.points.length; i++) {
      x = Math.cos(ang)*self.r+self.r;
      y = Math.sin(ang)*self.r+self.r;
      self.points[i] = [x, y];
      ang+=ang_inc;
    }
    ang = 0;
    x = Math.cos(ang)*self.r+self.r;
    y = Math.sin(ang)*self.r+self.r;
    
    self.points.push([x, y]);

    self.width = self.r*2;
    self.height = self.r*2;
    self.canvas_buffer = render_to_canvas(self.width, self.height, function(w,h,ctx) {
      ctx.clearRect(0, 0, w, h);
      put_rect(ctx, "transparent", 0, w/2, h/2, w, h);
      put_multi_line(ctx, "white", self.x, self.y, self.orientation, self.points, 2, false);
    });

  },

  launch_torpedo: function(self, asteroids) {
    if (self.const_max_torpedos-self.torpedos.length>0) {
      var t = new Torpedo();
      if (t.init(t, self.x, self.y-self.r, asteroids, self.orientation, 0.3)) {
        t.set_speed_step(t, self.cur_speed_step);
        self.torpedos.push(t);
      } 
    }
  },

  get_torpedos: function(self) {
    return self.torpedos;
  },

  draw: function(self) {
    
    self.orientation+=self.ang_vel;
    if (self.orientation > Math.PI) {
      self.orientation -= Math.PI*2;
    } else if (self.orientation < -Math.PI) {
      self.orientation += Math.PI*2;
    }
    if (! self.pause) {
      self.y += self.rel_speed;
      if (self.launch_ctr > self.const_launch_ctr) {
        self.launch_ctr = 0;
        self.launch_torpedo(self, gamelogic.asteroids);
      }
      self.launch_ctr++;
    }
    gamescreen.put_image(gamescreen, self.canvas_buffer, self.x-self.width/2, self.y-self.height/2);
    gamescreen.put_triangle(gamescreen, "white", self.orientation, 2, self.x, self.y, -5, 5, 0, -10, 5, 5);
    
    for (var i = 0; i < self.torpedos.length; i++) {
      if (self.torpedos[i].is_dead(self.torpedos[i])) {
        self.torpedos.splice(i, 1);
        i--;
      }
    }
  }
};
function Player() {};

Player.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  px: 0,
  py: 0,
  r: 10,
  top: 20,
  bottom: 10,

  x_step: 10,
  
  y_addition: 0,

  grip_reach_dist: 0,
  torpedo: null,
  touch_shoot: false,
  shoot_ctr: 0,
  const_shoot_ctr: 10,

  cur_speed_step: 0,
  speed_steps: [0,0,0,0,0],
  const_x_velocity: 0,
  pause: false,

  jump: false,
  jump_anim_ctr: 0,
  const_jump_start_ctr: 120,
  const_lightning_color: "#00BFFF",

  reset: function(self) {
    self.y_addition = 0;
  },

  explode: function(self) {
    self.y_addition = -2*gamescreen.height;
  },

  set_touch_shoot: function(self) {
    self.touch_shoot = true;
  },

  unset_touch_shoot: function(self) {
    self.touch_shoot = false;
  },

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  set_jump: function(self) {
    self.jump = true;
    self.jump_start_ctr = 0;
  },

  unset_jump: function(self) {
    self.jump = false;
    self.jump_anim_ctr = 0;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    if (self.torpedo!=null) {
      self.torpedo.set_speed_step(self.torpedo, step);
    }
  },

  set_normal_speed: function(self) {
    self.cur_speed_step = 0;
    if (self.torpedo!=null) {
      self.torpedo.set_normal_speed(self.torpedo);
    }
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    if (self.torpedo!=null) {
      self.torpedo.inc_speed(self.torpedo);
    }

  },

  init: function(self) {
    self.const_x_velocity = gamescreen.width/50;
    self.grip_reach_dist = 10*self.r;
  },

  move_left: function(self) {
    if ((self.vx-self.const_x_velocity>-gamescreen.width/2)) {
      self.vx-=self.const_x_velocity;
    }    
  },

  move_right: function(self) {
    if (self.vx+self.const_x_velocity<gamescreen.width/2) {
      self.vx+=self.const_x_velocity;
    }
  },

  launch_torpedo: function(self, asteroids) {
    if (self.shoot_ctr >= self.const_shoot_ctr) {
      if (self.torpedo == null) {
        self.torpedo = new Torpedo();
        self.torpedo.init(self.torpedo, self.x, self.y-self.r, asteroids);
        self.torpedo.set_speed_step(self.torpedo, self.cur_speed_step);
      }
      self.shoot_ctr = 0;
    }
  },

  get_torpedo: function(self) {
    return self.torpedo;
  },


  draw_jump: function(self) {
    self.x = self.vx + gamescreen.width/2;
    var c = self.jump_anim_ctr/self.const_jump_start_ctr;
    var k;
    var b;
    var h = gamescreen.height/3;
    var t = self.const_jump_start_ctr;
    if (self.jump_anim_ctr < t/4) {
      k = 4*h/(t*3);
      b = 0;
      self.vy = -(k*self.jump_anim_ctr+b);
    } else {
      k = -4*h/(t*9);
      b = 4*h/9;
      self.vy = -(k*self.jump_anim_ctr+b);
    }
    if (self.jump_anim_ctr < self.const_jump_start_ctr) {
      if (self.vx != 0) {
        var direction = self.vx/Math.abs(self.vx);
        if (Math.abs(self.vx)>self.const_x_velocity) {
          self.vx -= direction*self.const_x_velocity;
        } else {
          self.vx = 0;
        }
      }
      self.jump_anim_ctr++;
    } else {
      self.vy = 0;
    }
    var l = gamescreen.height;
    var w = Math.floor(3*c);
    if (w>0) {
      gamescreen.put_line(gamescreen, self.const_lightning_color, self.x, self.y-self.top, self.x, self.y-l, w);
      gamescreen.put_line(gamescreen, self.const_lightning_color, self.x, self.y+self.bottom, self.x, self.y+l, w);
    }
    var points1 = [[self.x,self.y+self.top*2],[0,0],[0,0],[0,0],[0,0],[0,0],[self.x,self.y-self.top*2]];
    var points2 = [[self.x,self.y+self.top*2],[0,0],[0,0],[0,0],[0,0],[0,0],[self.x,self.y-self.top*2]];

    for (var i = 1; i < points1.length-1; i++) {
      points1[i][0] = self.x+Math.random()*(10)+10;
      points1[i][1] = self.y+self.top-(self.top*2+self.bottom)/(points1.length-2)*(i-1);
    }

    for (var i = 1; i < points2.length-1; i++) {
      points2[i][0] = self.x-(Math.random()*(10)+10);
      points2[i][1] = self.y+self.top-(self.top*2+self.bottom)/(points2.length-2)*(i-1);
    }

    if (w>0) {
      gamescreen.put_multi_line(gamescreen, self.const_lightning_color, 0, 0, 0, points1, w, false);
      gamescreen.put_multi_line(gamescreen, self.const_lightning_color, 0, 0, 0, points2, w, false);
    }

  },

  draw: function(self) {
    if (! self.pause) {
      self.px = self.x;
      self.py = self.y;
      self.x = self.vx + gamescreen.width/2;
      self.y = self.vy + 4*gamescreen.height/5 + self.y_addition;
    }

    if (self.shoot_ctr <= self.const_shoot_ctr) {
      self.shoot_ctr ++;
    } else {
      if (self.touch_shoot) {
        self.launch_torpedo(self, gamelogic.asteroids);
      }
    }

    if (self.jump) {
      self.draw_jump(self);
    }

    gamescreen.put_triangle(gamescreen, "white", 0, 2, self.x, self.y, -10, 10, 0, -20, 10, 10);
    if (self.torpedo != null) {
      if (self.torpedo.is_dead(self.torpedo)) {
        self.torpedo = null;
      // } else {
      //   self.torpedo.draw(self.torpedo);
      }
    }
  }
};
function Asteroid() {};

Asteroid.prototype = {
  points: null,
  orientation: 0,
  start_orientation: 0,
  angular_velocity: 0,
  speed: 0,
  const_max_speed: 5,
  const_min_speed: 3,
  const_max_ang_vel: 0.3,
  const_max_ast_r: 0,
  const_max_r: [10, 20, 30, 40, 50],
  const_colors: ["#eee", "#ccc", "#D9DE54", "#EDB64E", "#E81409"],
  size: 1,
  co: 0, //cos of orientation
  so: 0, //sin of orientation
  ttl: 20,
  x: 0,
  y: 0,
  px: 0,
  py: 0,
  highlight: false,
  speed_steps: [5, 10, 15, 20, 40],
  speed_addition: 5,
  cur_speed_step: 0,
  pause: false,

  check_ttl: function(self) {
    return self.ttl;
  },

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.cur_speed_step = 0;
    self.speed_addition = self.speed_steps[0];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },
  
  calc_trig: function(self, orientation) {
    self.orientation = orientation;
    self.co = Math.cos(self.orientation);
    self.so = Math.sin(self.orientation);    
  },

  get_size: function(self) {
    return self.size;
  },

  init: function(self, size, remainder_prob, x) {
    self.points = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    var r = 0;
    var angle_increment = Math.PI*2/self.points.length;
    var angle = 0;
    if (size>=self.const_max_r.length) {
      size = self.const_max_r.length-1;
    }
    self.size = Math.floor(size);
    self.const_max_ast_r = self.const_max_r[self.size];
    for (var i = 0; i < self.points.length; i++) {
      r = (Math.random()*0.7+0.3)*self.const_max_ast_r;
      self.points[i][0] = r*Math.cos(angle);
      self.points[i][1] = r*Math.sin(angle);
      angle+=angle_increment;
    }
    var last = self.points.length-1;
    self.points[last][0] = self.points[0][0];
    self.points[last][1] = self.points[0][1];
    self.orientation = (0.1+Math.random()*0.8)*Math.PI;
    self.start_orientation = self.orientation;
    self.calc_trig(self, self.orientation);
    self.speed = Math.random()*(self.const_max_speed-self.const_min_speed) + self.const_min_speed;
    self.speed_addition = self.speed_steps[self.cur_speed_step];
    
    self.x = Math.random()*gamescreen.width || x;
    self.y = -self.const_max_ast_r;
    self.px = self.x;
    self.py = self.y;
    self.angular_velocity = 2*self.const_max_ang_vel*(Math.random()-0.5);
    //console.log(self.speed);
  },

  draw: function(self) {
    if (! self.pause) {
      self.ttl --;
      self.px = self.x;
      self.py = self.y;
      self.x+=self.speed*self.co;
      self.y+=self.speed_addition+self.speed*self.so;
      self.orientation+=self.angular_velocity;
      self.orientation%=Math.PI*2;
    }
    var style = self.const_colors[self.size];
    // if (self.highlight) {
    //   style = "red";
    // }
    gamescreen.put_multi_line(gamescreen, style, self.x, self.y, self.orientation, self.points, 2);
  }
};
function Tutorial_Stage() {};

Tutorial_Stage.prototype = {
  name: "Flat space",
  stop_after_st_dis: 0,
  show_greet_msg: 1,
  wait_greet_msg: 2,
  show_controls_msg: 3,
  show_left_controls: 4,
  show_controls_ok: 5,
  show_right_controls: 6,
  show_controls_ok2: 7,
  show_accel_controls: 8,
  check_accel: 9,
  check_accel_ok: 10,
  show_mining_intro: 11,
  wait_mining_intro: 12,
  show_torpedo_controls: 13,
  check_torpedo_launch: 14,
  wait_grip: 15,
  show_grip_msg: 16,
  wait_grip_msg: 17,
  show_outro: 18,
  wait_outro: 19,
  wait_turret_place: 20,
  wait_checkpoint: 21,
  show_jumpgate_msg: 22,
  wait_jumpgate_msg: 23,
  start_jump: 24,
  wait_jump: 25,
  game_win: 26,
  wait_input: 27,
  restart: 28,

  jump_ctr: 0,
  jump_ctr_max: 1000,

  turret_progress: 100,

  state: 0,
  
  delay_ctr: 0,
  const_delay: 60,

  wait_keycode: 0,
  key_pressed: false,
  
  text_disp_ctr: 0,
  const_text_delay: 30,
  text_line: 0,
  
  msg_greet: ["Repair bot: Loading random greeting message ...",
              "    Mining industries corp. greets you!",
              "    Captain, this is your refurbished vessel.",
              "    It was upgraded to comply with latest industry standard.",
              "    You have to take this training program in order to get mining license."],

  msg_control: ["Repair bot: Loading basic control course ...",
                "    Your vessel is upgraded to be controlled with keyboard.",
                "    Try maneuvering left and right.",
                "    This may help you avoid asteroids in the future."],

  msg_accel: ["Repair bot: Also, the vessel now has 5-step acceleration engine",
              "    Every step takes 100 units of fuel to accelerate.",
              "    You have some fuel to try."],
  
  msg_mining: ["Repair bot: Loading basic mining course ...",
               "    As a part of refurbishment and update program,",
               "    the mining gun was replaced with mining torpedo.",
               "    It is a little bit smarter than a usual gun,",
               "    but dont count too much on that"],

  msg_torpedo: ["Use torpedo to destroy asteroid."],

  msg_grip: ["Repair bot: Loading grip training course ...",
             "    Error: grip is automatic, no training needed",
             "    Proceed"],

  msg_luck: ["Repair bot: Loading jump engine training course ...",
             "    Human brain is not well suited for space jumps.",
             "    Thats why industry standard assumes automating every task.",
             "    As a part of automation task, this vessel was equiped",
             "    with luck-driven jump engine.",
             "    So, captain, before jumping, make sure your luck supply is 100% full."],

  msg_outro: ["Now collect enough fuel and jump home!",
              "Communication over."],

  msg_jumpgate: ["Jumpgate anti-asteroid protection system: Mining vessel identified", 
                 "    Proceed to jumpgate"],

  msg_win: ["You are finally home!",
           "    Press SPACE to start again."],

  msg_fail: ["Oops looks like you will need new vessel!",
           "    Press SPACE to start again."],


  last_msg: 0,

  torpedo_launchers: null,
  tl_handlers: null,
  const_n_torpedo_launchers: 3,

  reset_all: function(self) {
    hud.reset_fuel(hud);
    hud.reset_luck(hud);
    gamelogic.unset_jump(gamelogic);
    progress.unset_display_progress(progress);
    gamelogic.set_generate_asteroids(gamelogic);
    gamelogic.set_remainder_prob(gamelogic, 1);
    gamelogic.set_fuel_prob(gamelogic, 1);
    gamelogic.set_luck_prob(gamelogic, 1);
  },

  get_name: function(self) {
    return self.name;
  },

  init: function(self) {
  },

  display_message_delay: function(self, message) {
    var tx = gamescreen.width/10;
    var ty = gamescreen.height/10;
    
    for (var i = 0; i < self.text_line; i++) {
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", message[i], tx, ty+i*20);
    }
    if (self.text_disp_ctr > self.const_text_delay) {
      self.text_line++;
      self.text_disp_ctr = 0;
    }
    self.text_disp_ctr ++;
    if (self.text_line>message.length) {
      self.text_line = 0;
      return true;
    }
    return false;
  },

  display_message: function(self, message) {
    var tx = gamescreen.width/10;
    var ty = gamescreen.height/10;
    
    for (var i = 0; i < message.length; i++) {
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", message[i], tx, ty+i*20);
    }
    return true;
  },

  set_wait_keycode: function(self, keycode) {
    self.key_pressed = false;
    self.wait_keycode = keycode;
  },

  inject_keydown: function(self, keycode) {
    if (keycode == self.wait_keycode) {
      self.key_pressed = true;
    }
  },

  get_wait_keycode_state: function(self) {
    if (self.key_pressed) {
      self.wait_keycode = 0;
      self.key_pressed = false;
      return true;
    }
    return false;
  },

  set_delay: function(self, t) {
    self.delay_ctr = t;
  },

  get_delay: function(self) {
    self.delay_ctr --;
    if (self.delay_ctr <= 0) {
      return true;
    }
    return false;
  },

  draw: function(self) {
    if (hud.get_luck(hud)<=0 && ((self.state != self.game_fail) && (self.state != self.wait_input))) {
      self.state = self.game_fail;
    }
    switch (self.state) {
    case self.stop_after_st_dis:
      progress.unset_count_progress(progress);
      progress.unset_display_progress(progress);

      if (progress.is_stage_display_done(progress)) {
        gamelogic.player.reset(gamelogic.player);
        self.set_wait_keycode(self, ch_j);
        //gamelogic.set_pause(gamelogic);
        self.state = self.show_greet_msg;
        self.set_delay(self, self.const_delay);
        gamelogic.unset_generate_asteroids(gamelogic);
      }
      break;

    case self.show_greet_msg:
      if (self.get_wait_keycode_state(self)) {
        self.state = self.start_jump;
        break;
      }
      if (self.get_delay(self)) {
        self.state = self.show_torpedo_controls;
      }
      break;

    case self.show_torpedo_controls:
      var player = gamelogic.player;
      var off = player.r*2;
      self.state = self.check_torpedo_launch;
      gamelogic.set_remainder_prob(gamelogic, 1);
      gamelogic.set_fuel_prob(gamelogic, 1);
      gamelogic.set_luck_prob(gamelogic, 1);
      gamelogic.create_new_asteroid(gamelogic, false, player.x, player.y-gamescreen.height/5, 2, Math.PI/2, -5);
      self.msg_torpedo.push("Press SPACE");
      self.set_wait_keycode(self, 32); // space
      break;

    case self.check_torpedo_launch:
      self.display_message(self, self.msg_torpedo);
      if (self.get_wait_keycode_state(self)) {
        self.msg_torpedo.pop();
        self.msg_torpedo.push("OK, now collect remainders.");
        self.state = self.wait_grip;
        self.set_delay(self, self.const_delay);
      }
      break;

    case self.wait_grip:
      self.display_message(self, self.msg_torpedo);
      if (self.get_delay(self)) {
        self.msg_torpedo.pop();
        self.state = self.show_outro;
      }
      break;

    case self.show_outro:
      if (self.display_message_delay(self, self.msg_outro)) {
        self.state = self.wait_outro;
        self.set_delay(self, self.const_delay);
      }
      break;
      
    case self.wait_outro:
      self.display_message(self, self.msg_outro);
      if (self.get_delay(self)) {
        self.state = self.wait_turret_place;
        //progress.set_count_progress(progress);
        //progress.set_display_progress(progress);
        hud.set_display(hud);
        gamelogic.set_generate_asteroids(gamelogic);
      }
      break;

    case self.restart:
      gamelogic.player.reset(gamelogic.player);
      hud.set_display(hud);
      gamelogic.set_generate_asteroids(gamelogic);
      gamelogic.set_remainder_prob(gamelogic, 1);
      gamelogic.set_fuel_prob(gamelogic, 1);
      gamelogic.set_luck_prob(gamelogic, 1);
      progress.unset_count_progress(progress);
      progress.unset_display_progress(progress);
      self.state = self.show_outro;
      break;

    case self.wait_turret_place:
      if (hud.get_fuel(hud)>=self.turret_progress) {
        self.set_delay(self, self.const_delay);
        self.state = self.wait_checkpoint;
        var x_pos = gamescreen.width/4;
        self.tl_handlers = [];
        self.torpedo_launchers = [];
        for (var i = 0; i < self.const_n_torpedo_launchers; i++) {
          console.log("creating turret");
          var t = new AATurret();
          t.init(t, x_pos, -100, Math.PI/2);
          x_pos+=gamescreen.width/4;
          self.torpedo_launchers.push(t);
          self.tl_handlers.push(gamelogic.add_object(gamelogic, t));
        }
      }
      break;

    case self.wait_checkpoint:
      if (self.get_delay(self)) {
        gamelogic.unset_generate_asteroids(gamelogic);
        self.state = self.show_jumpgate_msg;
      }
      break;

    case self.show_jumpgate_msg:
      if (self.display_message_delay(self, self.msg_jumpgate)) {
        self.set_delay(self, self.const_delay);
        self.state = self.wait_jumpgate_msg;
      }
      break;

    case self.wait_jumpgate_msg:
      self.display_message(self, self.msg_jumpgate);
      if (self.get_delay(self)) {
        self.state = self.start_jump;
      }
      break;

    case self.start_jump:
      for (var i = 0; i < self.tl_handlers.length; i++) {
        gamelogic.del_object(gamelogic, self.tl_handlers[i]);
      }
      self.tl_handlers = [];
      self.torpedo_launchers = [];
      gamelogic.set_jump(gamelogic);
      console.log("start jump");
      self.jump_ctr = self.jump_ctr_max;
      console.log("jump ctr:"+self.jump_ctr);
      self.state = self.wait_jump;
      progress.unset_count_progress(progress);
      progress.unset_display_progress(progress);
      hud.set_display(hud);
      break;

    case self.wait_jump:
      if (gamelogic.background.get_jump_started(gamelogic.background)) {
        if (Math.abs(gamelogic.player.vx)>gamescreen.width*gamelogic.background.const_b_max) {
          console.log("premature jump abort");
          self.state = self.wait_turret_place;
          self.reset_all(self);
        }

        self.jump_ctr --;
        if (self.jump_ctr < 0) {
          gamelogic.unset_jump(gamelogic);
          self.state = self.game_win;
          console.log("game over next there");
        }
      }
      break;
    case self.game_win:
      if (self.display_message_delay(self, self.msg_win)) {
        self.last_msg = self.msg_win;
        self.set_wait_keycode(self, 32); // space
        self.state = self.wait_input;
      }
      break;

    case self.game_fail:
      gamelogic.unset_generate_asteroids(gamelogic);
      if (self.display_message_delay(self, self.msg_fail)) {
        self.last_msg = self.msg_fail;
        self.set_wait_keycode(self, 32); // space
        self.state = self.wait_input;
      }
      break;

    case self.wait_input:
      self.display_message(self, self.last_msg);
      if (self.get_wait_keycode_state(self)) {
        self.state = self.restart;
        self.reset_all(self);
      }
      break;
      
    default: 
      break;
    }
  }
};

var tutorial_stage = new Tutorial_Stage();
function Progress() {};

Progress.prototype = {
  stage: 0,
  stage_name_display_counter: 0,
  const_stage_name_display_max: 120,
  progress_buffer: null,
  stage_lengths: [1000, 10000, 10000, 10000],
  stages: [tutorial_stage],
  increment: 0,
  cur_speed_step: 0,
  speed_steps: [1, 2, 3, 4, 5],
  stage_progress: 0,
  width: 30,
  height: 0,
  xoff: 0,
  yoff: 50,
  margin: 1,
  stage_complete: false,
  pause: false,
  count_progress: false,
  display: false,

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  init: function(self) {
    self.xoff = gamescreen.width-50;
    self.stage_name_display_counter = self.const_stage_name_display_max;
    self.width = 30;
    self.height = gamescreen.height-self.yoff*2;

    self.progress_buffer = render_to_canvas(self.width, self.height, function(w,h,ctx) {
      put_rect(ctx, "white", 0, w/2, h/2, w, h);
      self.margin = 2;
      for (var i = 0; i < self.stages.length; i++) {
        put_rect(ctx, "#082B3D", 0, w/2, h-(2*i+1)*h/(self.stages.length*2), w-self.margin, h/self.stages.length-self.margin*2);
      }
    });
    self.set_normal_speed(self);
    self.stages[self.stage].init(self.stages[self.stage]);
    return self.stages[self.stage];
  },

  get_stage_complete: function(self) {
    return self.stage_complete;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.increment = self.speed_steps[self.cur_speed_step];    
  },

  set_normal_speed: function(self) {
    self.increment = self.speed_steps[0];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.increment = self.speed_steps[self.cur_speed_step];
  },


  next_stage: function(self) {
    self.stage_complete = false;
    self.stage++;
    self.stage_progress = 0;
    if (self.stage > self.stages.length) {
      return false;
    }
    self.stage_name_display_counter = self.const_stage_name_display_max;
  },

  is_stage_display_done: function(self) {
    if (self.stage_name_display_counter>0) {
      return false;
    }
    return true;
  },

  unset_count_progress: function(self) {
    self.count_progress = false;
  },

  set_count_progress: function(self) {
    self.count_progress = true;
  },
  
  set_display_progress: function(self) {
    self.display = true;
  },

  unset_display_progress: function(self) {
    self.display = false;
  },

  get_progress: function(self) {
    return self.stage_progress;
  },

  draw: function(self) {
    if (self.stage_name_display_counter > 0) {
      if (! self.pause) {
        self.stage_name_display_counter --;
        if (self.stage_progress > self.stage_lengths[self.stage]) {
          self.stage_complete = true;
          self.stage_progress = self.stage_lengths[self.stage];
        }
      }

      var char_sz = 10;
      var text = "Stage "+(self.stage+1)+". "+self.stages[self.stage].get_name(self.stages[self.stage]);
      var text_width = gamescreen.get_text_w(gamescreen, char_sz, text);

      gamescreen.put_text(gamescreen, "bold 20px Arial", "#aaaaaa", text, gamescreen.width/2-text_width/2, gamescreen.height/2-char_sz/2);
    }
    if (self.count_progress) {
      if (! self.pause) {
        self.stage_progress += self.increment;
      }
    }
    if (self.display) {
      gamescreen.put_image(gamescreen, self.progress_buffer, self.xoff, self.yoff);
      var single_stage_len_px = self.height/self.stages.length;
      var stage_progress_px = self.stage_progress/self.stage_lengths[self.stage];
      
      var current_pos = gamescreen.height-((self.stage+stage_progress_px)*single_stage_len_px+self.yoff);
      gamescreen.put_rect(gamescreen, "white", 0, self.xoff+self.width/2, current_pos-self.margin, 2, 2);
    }
  }
};

progress = new Progress();
function Hud() {};

Hud.prototype = {
  torpedo_count: 10,
  luck_count: 0.01,
  fuel_count: 0,
  fuel_max: 100,
  luck_max: 1,
  const_fuel_dec: 20,
  pause: false,
  count: false,
  display: false,

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  init: function(self) {
    
  },

  inc_luck: function(self) {
    if (!self.pause) {
      self.luck_count+=0.001;
    }
  },

  get_luck: function(self) {
    return self.luck_count;
  },

  dec_less_luck: function(self) {
    self.luck_count-=(self.luck_count > 0.05 ? 0.05 : 0.01);
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }    
  },
  
  dec_luck: function(self) {
    self.luck_count-=(self.luck_count > 0.1 ? 0.1 : 0.05);
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }
  },

  dec_more_luck: function(self) {
    self.luck_count-=(self.luck_count > 0.2 ? 0.2 : 0.1);
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }
  },

  dec_much_more_luck: function(self) {
    self.luck_count-=0.3;
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }
  },

  add_luck: function(self, delta) {
    self.luck_count += delta;
    if (self.luck_count >= 1.0) {
      self.luck_count = 1.0;
    }
  },

  reset_luck: function(self) {
    self.luck_count = 0.01;
  },

  reset_fuel: function(self) {
    self.fuel_count = 0;
  },

  get_fuel: function(self) {
    return self.fuel_count;
  },

  inc_fuel: function(self) {
    self.fuel_count += 10;
    if (self.fuel_count>self.fuel_max) {
      self.fuel_count = self.fuel_max;
    }
  },

  add_fuel: function(self, delta) {
    self.fuel_count += delta;
    if (self.fuel_count>self.fuel_max) {
      self.fuel_count = self.fuel_max;
    }
  },

  set_fuel_level: function(self, level) {
    self.fuel_count = level;
    if (self.fuel_count>self.fuel_max) {
      self.fuel_count = self.fuel_max;
    }
  },

  dec_fuel: function(self) {
    if (self.fuel_count - self.const_fuel_dec < 0) {
      return false;
    }
    self.fuel_count -= self.const_fuel_dec;
    return true;
  },

  set_count: function(self) {
    self.count = true;
  },
  
  unset_count: function(self) {
    self.count = false;
  },

  set_display: function(self) {
    self.display = true;
  },

  unset_display: function(self) {
    self.display = false;
  },

  draw: function(self) {
    if (self.count) {
      hud.inc_luck(hud);
    }
    if (self.display) {
      var fuel_color = "white";
      if (self.fuel_count - self.const_fuel_dec < 0) {
        fuel_color = "red";
      }
      gamescreen.put_text(gamescreen, "bold 20px Arial", fuel_color, "Fuel: "+self.fuel_count+"/"+self.fuel_max, 50, gamescreen.height-100);
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", "Luck: "+self.luck_count.toFixed(3)+"/"+self.luck_max, 50, gamescreen.height-50);
    }
  }
};

var hud = new Hud();
function Remainder() {};

Remainder.prototype = {
  x: 0,
  y: 0,
  orientation: 0,
  speed: 0,
  r: 6,
  luck: 0.05,
  fuel: 5,

  rtype: 0,
  rtype_colors: ["#00E1FA", "#7DFA00"], //fuel, luck

  so: 0,
  co: 0,

  speed_steps: [5, 10, 15, 20, 25],
  speed_addition: 5,

  pause: false,
  
  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.cur_speed_step = 0;
    self.speed_addition = self.speed_steps[0];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },
  
  init: function(self, x, y, orientation, rtype, speed, so, co) {
    self.x = x;
    self.y = y;
    if (rtype == 0) {
      self.luck = 0;
      self.fuel = Math.floor(Math.random()*self.fuel);
    } else {
      self.luck = Math.random()*self.luck;
      self.fuel = 0;
    }
    self.orientation = orientation;
    self.rtype = rtype;
    self.speed = speed;
    self.so = so || Math.sin(self.orientation);
    self.co = co || Math.cos(self.orientation);
  },

  draw: function(self) {
    if (! self.pause) {
      self.x+=self.speed*self.co;
      self.y+=self.speed_addition+self.speed*self.so;
    }
    gamescreen.put_rect(gamescreen, self.rtype_colors[self.rtype], 0, self.x, self.y, self.r, self.r);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  next_ast_ctr: 30,
  const_ast_spawn_t: 10,
  player: null,
  background: null,
  left: false,
  right: false,
  speed_step: 0,
  speed_step_max: 4,

  generate_asteroids: false,
  asteroids: [null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null],
  active_asteroids: 0,
  natural_asteroids: 18,
  const_natural_asteroids: 18,
  
  remainders: [null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, null, null, null, null, null, null, null, null],
  const_remainder_prob: 0.5,
  luck_prob: 0.1,
  fuel_prob: 0.5,
  remainder_prob: 0.5,
  luck_prob: 0.1,
  fuel_prob: 0.5,

  objects: [null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, null, null, null, null, null, null, null, null],
  active_objects: 0,
  
  pause: false,
  stage: null,
  jump: false,
  const_jump_asteroids: 10,

  touch: false,
  touch_active: false,
  tt_x: 0, //touch target x
  tt_y: 0,

  set_jump: function(self) {
    self.jump = true;
    self.speed_step = self.speed_step_max;
    self.player.set_jump(self.player);
    self.background.set_jump(self.background);
    self.natural_asteroids = self.const_jump_asteroids;
  },

  unset_jump: function(self) {
    self.jump = false;
    self.speed_step = 0;
    self.player.unset_jump(self.player);
    self.background.unset_jump(self.background);
    self.natural_asteroids = self.const_natural_asteroids;
    self.unset_generate_asteroids(self);
    self.set_normal_speed(self);
  },

  add_object: function(self, object) {
    for (var i = 0; i < self.objects.length; i++) {
      if (self.objects[i] == null) {
        object.set_speed_step(object, self.speed_step);
        self.objects[i] = object;
        self.active_objects++;
        return i;
      }
    }
    return -1;
  },

  del_object: function(self, handle) {
    if (self.objects[handle] != null) {
      self.objects[handle] = null;
      self.active_objects--;
    }
  },

  set_remainder_prob: function(self, prob) {
    self.remainder_prob = prob;
  },

  set_fuel_prob: function(self, prob) {
    self.fuel_prob = prob;
  },

  set_luck_prob: function(self, prob) {
    self.luck_prob = prob;
  },

  reset_prob: function(self) {
    self.luck_prob = self.const_luck_prob;
    self.fuel_prob = self.const_fuel_prob;
    self.remainder_prob = self.const_remainder_prob;
  },

  try_destroy_asteroid: function(self, asteroid) {
    if (Math.random() < self.remainder_prob) { // have to leave remainders
      //console.log("leaving remainders");
      var fuel_rem = Math.floor(Math.random()*10*self.fuel_prob*(asteroid.size/asteroid.const_max_r.length));
      var ang = 0;
      var dist = 0;
      var so = 0;
      var co = 0;
      var rem = null;
      var rem_lst = [];

      if (Math.random()<self.luck_prob) {
        ang = Math.random()*Math.PI*2+Math.PI;
        dist = Math.random()*20;
        so = Math.sin(ang);
        co = Math.cos(ang);
        rem = new Remainder();
        rem.init(rem, asteroid.x+co*dist, asteroid.y+so*dist, ang, 1, asteroid.speed/5, so, co);
        rem.set_speed_step(rem, self.speed_step);
        rem_lst.push(rem);        
      }

      for (var i = 0; i < fuel_rem; i++) {
        ang = Math.random()*Math.PI*2;
        dist = Math.random()*20;
        so = Math.sin(ang);
        co = Math.cos(ang);
        rem = new Remainder();
        rem.init(rem, asteroid.x+co*dist, asteroid.y+so*dist, ang, 0, asteroid.speed/5, so, co);
        rem.set_speed_step(rem, self.speed_step);
        rem_lst.push(rem);
      }

      for (var i = 0; i < self.remainders.length; i++) {
        if (self.remainders[i] == null) {
          if (rem_lst.length > 0) {
            self.remainders[i] = rem_lst[0];
            rem_lst.shift();
          } else {
            break;
          }
        }
      }
    }
  },

  set_generate_asteroids: function(self) {
    self.generate_asteroids = true;
  },

  unset_generate_asteroids: function(self) {
    self.generate_asteroids = false;
  },

  set_pause: function(self) {
    self.pause = true;
    progress.set_pause(progress);
    hud.set_pause(hud);
    self.background.set_pause(self.background);
    self.player.set_pause(self.player);
    for (var i = 0; i < self.natural_asteroids; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].set_pause(self.asteroids[i]);
      }
    }
  },

  unset_pause: function(self) {
    self.pause = false;
    progress.unset_pause(progress);
    hud.unset_pause(hud);
    self.background.unset_pause(self.background);
    self.player.unset_pause(self.player);
    for (var i = 0; i < self.natural_asteroids; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].unset_pause(self.asteroids[i]);
      }
    }
  },

  keydown: function(self, event) {
    //console.log("down");
    //console.log(event);
    if (event.keyCode == 16) { // shift
      // if (hud.dec_fuel(hud)) {
      //   self.speed_step ++;
      //   progress.inc_speed(progress);
      //   self.background.inc_speed(self.background);
      //   self.player.inc_speed(self.player);
      //   for (var i = 0; i < self.natural_asteroids; i++) {
      //     if (self.asteroids[i] != null) {
      //       self.asteroids[i].inc_speed(self.asteroids[i]);
      //     }
      //   }
      // }
    }
    if (event.keyCode == 32) { // space
      if (! self.jump) {
        self.player.launch_torpedo(self.player, self.asteroids);
      }
    }
    if (event.keyCode == 65) { // a
      self.left = true;
    }
    if (event.keyCode == 68) { // d
      self.right = true;
    }
    if (event.keyCode == 37) { // left
      self.left = true;
    }
    if (event.keyCode == 39) { // right
      self.right = true;
    }

    self.stage.inject_keydown(self.stage, event.keyCode);
  },

  keyup: function(self, event) {
    //console.log("up");
    //console.log(event);
    if (event.keyCode == 16) { // shift
      // progress.set_normal_speed(progress);
      // self.background.set_normal_speed(self.background);
      // for (var i = 0; i < self.asteroids.length; i++) {
      //   if (self.asteroids[i] != null) {
      //     self.asteroids[i].set_normal_speed(self.asteroids[i]);
      //   }
      // }
    }
    if (event.keyCode == 65) { // a
      self.left = false;
    }
    if (event.keyCode == 68) { // d
      self.right = false;
    }
    if (event.keyCode == 37) { // left
      self.left = false;
    }
    if (event.keyCode == 39) { // right
      self.right = false;
    }

  },

  touchstart: function(self, event) {
    self.touch = true;
    self.touch_active = true;
    console.log("start");
    //console.log(event);
    self.player.set_touch_shoot(self.player);
    self.tt_x = event.touches[0].pageX;
    self.tt_y = event.touches[0].pageY;
  },

  touchend: function(self, event) {
    self.touch = true;
    self.touch_active = false;
    console.log("end");
    //console.log(event);
    self.player.unset_touch_shoot(self.player);
    self.left = false;
    self.right = false;
  },

  touchmove: function(self, event) {
    self.touch = true;
    console.log("move");
    //console.log(event);
    self.tt_x = event.touches[0].pageX;
    self.tt_y = event.touches[0].pageY;
  },

  init: function(self) {
    var n_ast = 18*gamescreen.width*gamescreen.height/(800*800);
    n_ast = (n_ast>self.asteroids.length*0.6 ? self.asteroids.length*0.6 : n_ast);
    self.natural_asteroids = Math.floor(n_ast);
    self.const_natural_asteroids = self.natural_asteroids;
    console.log("natural asteroids: "+self.natural_asteroids);
    self.player = new Player();
    self.player.init(self.player);
    self.background = new Background();
    self.background.init(self.background);
    self.stage = progress.init(progress);
    hud.init(hud);
    //gamescreen.set_keydown_cb(gamescreen, self.keydown_cb);
  },

  set_normal_speed: function(self) {
    self.speed_step = 0;
    progress.set_normal_speed(progress);
    self.player.set_normal_speed(self.player);
    self.background.set_normal_speed(self.background);
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].set_normal_speed(self.asteroids[i]);
      }
    }
  },

  set_fast_speed: function(self) {
    self.speed_step = self.speed_step_max;
    //progress.set_normal_speed(progress);
    self.player.set_speed_step(self.player, self.speed_step);
    //self.background.set_speed_step(self.background, self.speed_step);
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].set_speed_step(self.asteroids[i], self.speed_step);
      }
    }
  },

  create_new_asteroid: function(self, set_random, x, y, size, orientation, speed) {
    var idx = null;
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] == null) {
        idx = i;
        break;
      }
    }
    if (idx != null) {
      var nast = new Asteroid();
      if (set_random) {
        size = 2;
        nast.init(nast, size);
      } else {
        nast.init(nast, size);
        nast.speed = speed;
        nast.orientation = orientation;
        nast.x = x;
        nast.y = y;
        nast.calc_trig(nast, orientation); 
        nast.set_speed_step(nast, self.speed_step);
      }
      self.asteroids[idx] = nast;
      self.active_asteroids ++;
      return true;
    } else {
      return false;
    }
  },

  check_player_collision: function(self, player, asteroid) {
    if (pt_to_pt_dist([player.x, player.y], [asteroid.x, asteroid.y])<(asteroid.const_max_ast_r+player.r)*0.9) {
      return true;
    }
    return false;
  },

  check_torpedo_collision: function(self, torpedo, asteroid) {
    if (pt_to_pt_dist([torpedo.x, torpedo.y], [asteroid.x, asteroid.y])<(asteroid.const_max_ast_r)) {
      return true;
    }
    return false;
  },

  check_asteroid_collision: function(self, ast1_id, ast2_id) {
    var ast1 = self.asteroids[ast1_id];
    var ast2 = self.asteroids[ast2_id];
    if (pt_to_pt_dist([ast1.x, ast1.y], [ast2.x, ast2.y])<(ast1.const_max_ast_r+ast2.const_max_ast_r)*0.9) {
      //console.log("ast collision");
      ast1.highlight = true;
      ast2.highlight = true;
      var size;
      
      if (((ast1.size+ast2.size)/2 < (ast1.const_max_r.length-1)) && Math.random()>0.5) {
        size = ast1.size+ast2.size;
        var ast = new Asteroid();
        ast.init(ast, size);
        ast.set_speed_step(ast, self.speed_step);
        var x = (ast1.x+ast2.x)/2;
        var y = (ast1.y+ast2.y)/2;
        ast.x = x;
        ast.y = y;
        ast.angular_velocity = (ast1.angular_velocity+ast2.angular_velocity)/2;
        self.asteroids[ast1_id] = ast;
        self.asteroids[ast2_id] = null;
        self.active_asteroids --;
      } else {
        size = (ast1.size+ast2.size)/3;
        var nast1 = new Asteroid();
        nast1.init(nast1, size);
        var nast2 = new Asteroid();
        nast2.init(nast2, size);
        nast1.set_speed_step(nast1, self.speed_step);
        nast2.set_speed_step(nast2, self.speed_step);
        nast1.x=ast2.x+nast1.const_max_ast_r*ast2.co;
        nast1.y=ast2.y+nast1.const_max_ast_r*ast2.so;
        nast1.speed = ast2.speed*0.8;
        var angle = Math.atan2(ast2.y-ast1.y, ast2.x-ast1.x);
        nast1.calc_trig(nast1, angle);
        nast2.x=ast1.x+nast2.const_max_ast_r*ast1.co;
        nast2.y=ast1.y+nast2.const_max_ast_r*ast1.so;
        nast2.speed = ast1.speed*0.8;
        angle = Math.atan2(ast1.y-ast2.y, ast1.x-ast2.x);
        nast2.calc_trig(nast2, angle);
        self.asteroids[ast1_id] = nast1;
        self.asteroids[ast2_id] = nast2;        
      }
    }
  },

  gen_asteroids: function(self) {
    if (!self.pause && self.generate_asteroids) {
      if (self.next_ast_ctr <= 0) {
        // var ast = 0;
        // for (var i = 0; i < self.asteroids.length; i++) {
        //   if (self.asteroids[i] != null) {
        //     ast ++;
        //   }
        // }
        // self.active_asteroids = ast;
        //console.log(self.asteroids);
        if (self.active_asteroids < self.natural_asteroids) {
          for (var i = 0; i < self.asteroids.length; i++) {
            if (self.asteroids[i] == null) {
              self.active_asteroids ++;
              self.asteroids[i] = new Asteroid();
              if (self.jump) {
                self.asteroids[i].init(self.asteroids[i], 2, (Math.random()*0.2-0.1)*gamescreen.width+gamescreen.width/2);
              } else {
                self.asteroids[i].init(self.asteroids[i], 2);
              }
              self.asteroids[i].set_speed_step(self.asteroids[i], self.speed_step);
              break;
            }
          }
        }
        self.next_ast_ctr = Math.random()*self.const_ast_spawn_t;
      }
      //console.log(self.asteroids);
      self.next_ast_ctr --;
    }
  },

  ast_ast_col: function(self) {
    if (self.active_asteroids>0) {
      var n_ast = 0;
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] != null) {
          n_ast ++;
          for (var j = i+1; j < self.asteroids.length; j++) {
            if (self.asteroids[j] != null) {
              if (self.check_asteroid_collision(self, i, j)) {
                break;
              }
            }
          }
        }
        if (n_ast >= self.active_asteroids) {
          break;
        }
      }
    }
  },

  collect_torpedos: function(self) {
    var torpedos = [self.player.get_torpedo(self.player)];
    var obj_cnt = 0;
    if (self.active_objects>0) {
      for (var i = 0; i < self.objects.length; i++) {
        var obj = self.objects[i];
        if (obj != null) {
          obj.draw(obj);
          obj_cnt ++;

          var obj_torpedos = obj.get_torpedos(obj);
          for (var j = 0; j < obj_torpedos.length; j++) {
            if (obj_torpedos[j] != null) {
              torpedos.push(obj_torpedos[j]);
            }
          }

        }
        if (obj_cnt >= self.active_objects) {
          break;
        }
      }
    }
    return torpedos;
  },

  create_ast_couple: function(self, x1, y1, x2, y2, a1, a2, s1, s2, size) {
    if (self.create_new_asteroid(self, false, x1, y1, size, a1, s1)) {
      // if we cant create first one, no need to try to create second
      self.create_new_asteroid(self, false, x2, y2, size, a2, s2);
    }
  },

  ast_tor_col: function(self, torpedos) {
    for (var j = 0; j < torpedos.length; j++) {
      var torpedo = torpedos[j];
      if (torpedo != null) {
        torpedo.draw(torpedo);
        if (self.active_asteroids>0) {
          var n_ast = 0;
          for (var i = 0; i < self.asteroids.length; i++) {
            if (self.asteroids[i] != null) {
              n_ast ++;
              if (self.check_torpedo_collision(self, torpedo, self.asteroids[i])) {
                torpedo.explode(torpedo);
                var sz = self.asteroids[i].get_size(self.asteroids[i]);
                if (sz > 3) {
                  var x = self.asteroids[i].x;
                  var y = self.asteroids[i].y;
                  var r = self.asteroids[i].const_max_ast_r;
                  var speed = self.asteroids[i].speed;
                  self.create_ast_couple(self, x-r, y, x+r, y, Math.PI, 0, speed, speed, 2);
                }
                self.try_destroy_asteroid(self, self.asteroids[i]);
                self.active_asteroids --;
                self.asteroids[i] = null;
                n_ast --;
                break;
              }
            }
            if (n_ast >= self.active_asteroids) {
              break;
            }
          }
        }
      }
    }
  },

  ast_pla_col: function(self) {
    if (self.active_asteroids>0) {
      var n_ast = 0;
      for (var i = 0; i < self.asteroids.length; i++) {
        var ast = self.asteroids[i];
        if (ast != null) {
          n_ast++;
          if (! gamescreen.circle_in_screen(gamescreen, ast.x, ast.y, ast.const_max_ast_r)) {
            ast.draw(ast);
            if (ast.check_ttl(ast)<0) {
              self.asteroids[i] = null;
              self.active_asteroids --;
              n_ast --;
            }
          } else {
            ast.draw(ast);
            if (self.check_player_collision(self, self.player, ast)) {
              if (ast.size <= 1) {
                hud.dec_less_luck(hud);
                self.asteroids[i] = null;
                self.active_asteroids --;
                n_ast --;
              }
              else if (ast.size==2) {
                hud.dec_luck(hud);
                self.create_ast_couple(self, ast.x-ast.const_max_ast_r*2, ast.y, ast.x+ast.const_max_ast_r*2, ast.y, Math.PI, 0, ast.speed, ast.speed, 1);
                self.asteroids[i] = null;
                self.active_asteroids --;
                n_ast ++;
              }
              else if (ast.size >= 3) {
                var direction = ((ast.x-ast.px) > 0 ? 1 : -1);
                self.player.vx += direction*ast.speed*10;
                self.asteroids[i] = null;
                self.active_asteroids --;
                n_ast ++;
                self.create_ast_couple(self, ast.x-ast.const_max_ast_r*2, ast.y, ast.x+ast.const_max_ast_r*2, ast.y, Math.PI, 0, ast.speed, ast.speed, 2);
                hud.dec_more_luck(hud);
              }
              if (hud.get_luck(hud) <= 0) {
                var max_rem = 20;
                self.player.explode(self.player);
                for (var j = 0; j < max_rem; j++) {
                  self.create_new_asteroid(self, false, self.player.x, self.player.y, 0, Math.random()*Math.PI*2, Math.random()*ast.speed*3);
                }
              }
            }
          }
        }
        if (n_ast >= self.active_asteroids) {
          break;
        }
      }
    }

  },

  rem_draw: function(self) {
    for (var i = 0; i < self.remainders.length; i++) {
      var rem = self.remainders[i];
      if (rem != null) {
        if (! gamescreen.circle_in_screen(gamescreen, rem.x, rem.y, rem.r)) {
          self.remainders[i] = null;
        } else {
          rem.draw(rem);
          var dist = pt_to_pt_dist([self.player.x, self.player.y], [rem.x, rem.y]);
          if (dist<self.player.grip_reach_dist) {
            hud.add_luck(hud, rem.luck);
            hud.add_fuel(hud, rem.fuel);
            self.remainders[i] = null;
          }
        }
      }
    }
  },

  draw: function(self) {
    self.stage.draw(self.stage);
    self.background.draw(self.background);
    self.gen_asteroids(self);
    self.ast_ast_col(self);

    var torpedos = self.collect_torpedos(self);
    self.ast_tor_col(self, torpedos);

    self.ast_pla_col(self);
    self.rem_draw(self);

    if (self.touch_active) {
      if (self.player.x - self.tt_x > self.player.x_step) {
        self.left = true;
        self.right = false;
      } else if (self.player.x - self.tt_x < -self.player.x_step) {
        self.left = false;
        self.right = true;
      } else {
        self.left = false;
        self.right = false;
      }
    }

    if (self.left) {
      self.player.move_left(self.player);
    }
    if (self.right) {
      self.player.move_right(self.player);
    }

    if (self.jump) {
      self.set_fast_speed(self);
      if (self.background.get_jump_started(self.background)) {
        self.set_generate_asteroids(self);
      }
    }
    self.player.draw(self.player);
    progress.draw(progress);
    if (progress.get_stage_complete(progress)) {
      progress.next_stage(progress);
    }
    hud.draw(hud);
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

  gamescreen.set_touchstart_cb(gamescreen, function(kc) {
    gamelogic.touchstart(gamelogic, kc);
  });

  gamescreen.set_touchmove_cb(gamescreen, function(kc) {
    gamelogic.touchmove(gamelogic, kc);
  });

  gamescreen.set_touchend_cb(gamescreen, function(kc) {
    gamelogic.touchend(gamelogic, kc);
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
