function Hud() {};

Hud.prototype = {
  torpedo_count: 10,
  luck_count: 0.01,
  fuel_count: 0,
  fuel_max: 100,
  luck_max: 1,
  const_fuel_dec: 20,
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

  dec_less_luck: function(self) {
    self.luck_count-=(self.luck_count > 0.05 ? 0.05 : 0.01);
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }    
  },
  
  dec_luck: function(self) {
    self.luck_count-=(self.luck_count > 0.1 ? 0.1 : 0.05);
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }
  },

  dec_more_luck: function(self) {
    self.luck_count-=(self.luck_count > 0.2 ? 0.2 : 0.1);
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }
  },

  dec_much_more_luck: function(self) {
    self.luck_count-=0.3;
    if (self.luck_count < 0) {
      self.luck_count = 0;
    }
  },

  add_luck: function(self, delta) {
    self.luck_count += delta;
    if (self.luck_count >= 1.0) {
      self.luck_count = 1.0;
    }
  },

  reset_luck: function(self) {
    self.luck_count = 0.01;
  },

  reset_fuel: function(self) {
    self.fuel_count = 0;
  },

  get_fuel: function(self) {
    return self.fuel_count;
  },

  inc_fuel: function(self) {
    self.fuel_count += 10;
    if (self.fuel_count>self.fuel_max) {
      self.fuel_count = self.fuel_max;
    }
  },

  add_fuel: function(self, delta) {
    self.fuel_count += delta;
    if (self.fuel_count>self.fuel_max) {
      self.fuel_count = self.fuel_max;
    }
  },

  set_fuel_level: function(self, level) {
    self.fuel_count = level;
    if (self.fuel_count>self.fuel_max) {
      self.fuel_count = self.fuel_max;
    }
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
