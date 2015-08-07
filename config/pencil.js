var Pencil = require('pencil');

function addTag(name) {
  Pencil.define('', {
    initialize: function(){
      var self = this;
      this.tag
        .tag('div');
    },
    render: function(){
      return this;
    }
  });
}

addTag(name)
