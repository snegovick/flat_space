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
  highlight: false,
  speed_steps: [5, 10, 15, 20, 25],
  speed_addition: 5,
  cur_speed_step: 0,

  check_ttl: function(self) {
    return self.ttl;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
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

  init: function(self, size) {
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
    self.orientation = (0.1+Math.random()*0.8)*Math.PI;
    self.start_orientation = self.orientation;
    self.calc_trig(self, self.orientation);
    self.speed = Math.random()*(self.const_max_speed-self.const_min_speed) + self.const_min_speed;
    self.speed_addition = self.speed_steps[self.cur_speed_step];
    self.x = Math.random()*gamescreen.width;
    self.y = -self.const_max_ast_r;
    self.angular_velocity = 2*self.const_max_ang_vel*(Math.random()-0.5);
    //console.log(self.speed);
  },

  draw: function(self) {
    self.ttl --;
    self.x+=self.speed*self.co;
    self.y+=self.speed_addition+self.speed*self.so;
    self.orientation+=self.angular_velocity;
    self.orientation%=Math.PI*2;
    var style = self.const_colors[self.size];
    // if (self.highlight) {
    //   style = "red";
    // }
    gamescreen.put_multi_line(gamescreen, style, self.x, self.y, self.orientation, self.points, 2);
  }
};
