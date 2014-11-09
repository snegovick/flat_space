function Hud() {};

Hud.prototype = {
  torpedo_count: 10,
  luck_count: 0,
  fuel_count: 0,
  fuel_max: 1000,
  luck_max: 1,

  init: function(self) {
    
  },

  inc_luck: function(self) {
    self.luck_count+=0.001;
  },
  
  dec_luck: function(self) {
    self.luck_count-=0.1;
  },

  inc_fuel: function(self) {
    self.fuel_count += 10;
  },

  dec_fuel: function(self) {
    self.fuel_count -= 100;
  },

  draw: function(self) {
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Fuel: "+self.fuel_count+"/"+self.fuel_max, 50, gamescreen.height-100);
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Luck: "+self.luck_count.toFixed(3)+"/"+self.luck_max, 50, gamescreen.height-50);
  }
};

var hud = new Hud();
