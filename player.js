function Player() {};

Player.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  r: 10,
  grip_reach_dist: 0,
  torpedo: null,
  cur_speed_step: 0,
  speed_steps: [0,0,0,0,0],
  const_x_velocity: 0,
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
    self.const_x_velocity = gamescreen.height/30;
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
    if (self.torpedo == null) {
      self.torpedo = new Torpedo();
      self.torpedo.init(self.torpedo, self.x, self.y-self.r, asteroids);
      self.torpedo.set_speed_step(self.torpedo, self.cur_speed_step);
    }
  },

  get_torpedo: function(self) {
    return self.torpedo;
  },

  draw: function(self) {
    if (! self.pause) {
      self.x = self.vx + gamescreen.width/2;
      self.y = self.vy + 4*gamescreen.height/5;
    }
    gamescreen.put_triangle(gamescreen, "white", 0, 2, self.x, self.y, -10, 10, 0, -20, 10, 10);
    if (self.torpedo != null) {
      if (self.torpedo.is_dead(self.torpedo)) {
        self.torpedo = null;
      } else {
        self.torpedo.draw(self.torpedo);
      }
    }
  }
};
