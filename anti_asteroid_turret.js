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
