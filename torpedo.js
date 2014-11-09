function Torpedo() {};

Torpedo.prototype = {
  x: 0, // own coords
  y: 0,
  sx: 0,
  sy: 0,
  velocity: 20,
  orientation: 0,
  ttl: 20,
  dead: false,
  exploded: false,
  r: 5,
  
  init: function(self, x, y) {
    self.orientation = -Math.PI/2;
    self.x = x;
    self.y = y;
    self.sx = x;
    self.sy = y;
  },

  is_dead: function(self) {
    return self.dead;
  },

  explode: function(self) {
    
  },

  draw: function(self) {
    self.ttl--;
    if (self.ttl<0) {
      if (! gamescreen.circle_in_screen(gamescreen, self.x, self.y, 5)) {
        self.dead = true;
      }
    }
    self.y -= self.velocity;
    gamescreen.put_triangle(gamescreen, "white", 0, 1, self.x, self.y, -3, 3, 0, -6, 3, 3);
    var length = self.sy - self.y;
    if (length > 100) {
      length = 100;
    }
    gamescreen.put_line(gamescreen, "white", self.x, self.y, self.x, self.y+length, 1);
  }
};
