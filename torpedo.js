function Torpedo() {};

Torpedo.prototype = {
  x: 0, // own coords
  y: 0,
  velocity: 20,
  orientation: 0,

  init: function(self, x, y) {
    self.orientation = -Math.PI/2;
    self.x = x;
    self.y = y;
  },

  draw: function(self) {
    self.y -= self.velocity;
    gamescreen.put_triangle(gamescreen, "white", 0, 2, self.x, self.y, -1, 1, 0, -2, 1, 1);
  }
};
