function Player() {};

Player.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  r: 10,

  init: function(self) {
  },

  move_x: function(self, delta) {
    if ((Math.abs(self.vx+delta)<gamescreen.width/2)) {
      self.vx+=delta;
    }
  },

  draw: function(self) {
    self.x = self.vx + gamescreen.width/2;
    self.y = self.vy + 4*gamescreen.height/5;
    gamescreen.put_triangle(gamescreen, "white", 0, 2, self.x, self.y, -10, 10, 0, -20, 10, 10);
  }
};
