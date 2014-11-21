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
        self.launch_torpedo(self);
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
