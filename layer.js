function Layer() {};

Layer.prototype = {
  name: name,

  init: function(self, layer_json) {
  },

  draw: function(self) {
    for (var i = 0; i < self.proxys.length; i++) {
      var proxy = self.proxys[i];
      proxy.draw(proxy);
    }
  }
};

