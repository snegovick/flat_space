function AATurret() {};

AATurret.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  orientation: 0,
  r: 30,
  torpedos: null,
  cur_speed_step: 0,
  speed_steps: [5,10,15,20,25],
  rel_speed: 5,
  const_x_velocity: 0,
  pause: false,
  points: [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0]],

  launch_ctr: 0,
  const_launch_ctr: 90,

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
    self.torpedos = [null, null, null, null];
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
    for (var i = 0; i < self.torpedos.length; i++) {
      if (self.torpedos[i]==null) {
        self.torpedos[i] = new Torpedo();
        if (!self.torpedos[i].init(self.torpedos[i], self.x, self.y-self.r, asteroids, self.orientation, 0.3)) {
          self.torpedos[i] = null;
        } else {
          self.torpedos[i].set_speed_step(self.torpedos[i], self.cur_speed_step);
        }
        break;
      }
    }
  },

  get_torpedos: function(self) {
    return self.torpedos;
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
    for (var i = 0; i < self.torpedos.length; i++) {
      if (self.torpedos[i]!=null) { 
        if (self.torpedos[i].is_dead(self.torpedos[i])) {
          self.torpedos[i] = null;
        } else {
          self.torpedos[i].draw(self.torpedos[i]);
        }
      }
    }
  }
};
