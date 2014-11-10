function Player() {};

Player.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  r: 10,
  torpedo: null,
  cur_speed_step: 0,
  speed_steps: [0,0,0,0,0],

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
  },

  move_x: function(self, delta) {
    if ((Math.abs(self.vx+delta)<gamescreen.width/2)) {
      self.vx+=delta;
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
    self.x = self.vx + gamescreen.width/2;
    self.y = self.vy + 4*gamescreen.height/5;
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
