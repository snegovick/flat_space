function AATurret() {};

AATurret.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  orientation: 0,
  r: 30,
  torpedo: null,
  cur_speed_step: 0,
  speed_steps: [5,10,15,20,25],
  rel_speed: 5,
  const_x_velocity: 0,
  pause: false,
  points: [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0]],

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
    if (self.torpedo!=null) {
      self.torpedo.set_speed_step(self.torpedo, step);
    }
    self.rel_speed = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.cur_speed_step = 0;
    if (self.torpedo!=null) {
      self.torpedo.set_normal_speed(self.torpedo);
    }
    self.rel_speed = self.speed_steps[self.cur_speed_step];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    if (self.torpedo!=null) {
      self.torpedo.inc_speed(self.torpedo);
    }
    self.rel_speed = self.speed_steps[self.cur_speed_step];
  },

  init: function(self, x_pos, y_pos, orientation) {
    self.x = x_pos;
    self.y = y_pos;
    self.orientation = orientation;
    var x;
    var y;
    var ang_inc = 2*Math.PI/self.points.length;
    var ang = 0;
    for (var i = 0; i < self.points.length; i++) {
      x = Math.cos(ang)*self.r;
      y = Math.sin(ang)*self.r;
      self.points[i] = [x, y];
      ang+=ang_inc;
    }
    ang = 0;
    x = Math.cos(ang)*self.r;
    y = Math.sin(ang)*self.r;
    
    self.points.push([x, y]);
  },

  launch_torpedo: function(self, asteroids) {
    if (self.torpedo == null) {
      self.torpedo = new Torpedo();
      self.torpedo.init(self.torpedo, self.x, self.y-self.r, asteroids, self.orientation, 0.5);
      self.torpedo.set_speed_step(self.torpedo, self.cur_speed_step);
    }
  },

  get_torpedo: function(self) {
    return self.torpedo;
  },

  draw: function(self) {
    if (! self.pause) {
      self.y += self.rel_speed;
      if (self.launch_ctr > self.const_launch_ctr) {
        self.launch_ctr = 0;
        self.launch_torpedo(self, gamelogic.asteroids);
      }
      self.launch_ctr++;
    }
    gamescreen.put_multi_line(gamescreen, "white", self.x, self.y, self.orientation, self.points, 2);
    if (self.torpedo != null) {
      if (self.torpedo.is_dead(self.torpedo)) {
        self.torpedo = null;
      } else {
        self.torpedo.draw(self.torpedo);
      }
    }
  }
};
