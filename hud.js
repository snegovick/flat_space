function Hud() {};

Hud.prototype = {
  torpedo_count: 10,
  luck_count: 0,
  fuel_count: 0,
  fuel_max: 1000,
  luck_max: 1,
  const_fuel_dec: 100,
  pause: false,
  count: false,
  display: false,

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  init: function(self) {
    
  },

  inc_luck: function(self) {
    if (!self.pause) {
      self.luck_count+=0.001;
    }
  },

  get_luck: function(self) {
    return self.luck_count;
  },
  
  dec_luck: function(self) {
    self.luck_count-=0.1;
  },

  add_luck: function(self, delta) {
    self.luck_count += delta;
  },

  inc_fuel: function(self) {
    self.fuel_count += 10;
  },

  add_fuel: function(self, delta) {
    self.fuel_count += delta;
  },

  set_fuel_level: function(self, level) {
    self.fuel_count = level;
  },

  dec_fuel: function(self) {
    if (self.fuel_count - self.const_fuel_dec < 0) {
      return false;
    }
    self.fuel_count -= self.const_fuel_dec;
    return true;
  },

  set_count: function(self) {
    self.count = true;
  },
  
  unset_count: function(self) {
    self.count = false;
  },

  set_display: function(self) {
    self.display = true;
  },

  unset_display: function(self) {
    self.display = false;
  },

  draw: function(self) {
    if (self.count) {
      hud.inc_luck(hud);
    }
    if (self.display) {
      var fuel_color = "white";
      if (self.fuel_count - self.const_fuel_dec < 0) {
        fuel_color = "red";
      }
      gamescreen.put_text(gamescreen, "bold 20px Arial", fuel_color, "Fuel: "+self.fuel_count+"/"+self.fuel_max, 50, gamescreen.height-100);
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", "Luck: "+self.luck_count.toFixed(3)+"/"+self.luck_max, 50, gamescreen.height-50);
    }
  }
};

var hud = new Hud();
