let Pencil = require('pencil');
let tags = require('./tags');

let tagList = [];
for (let name of ['marko', 'async', 'lasso'])
  tagList.push(tags[name]);

for (let tag of tagList)
  addTag(tag);

function addTag(tagName) {
  Pencil.define('', {
    initialize: function(){
      var self = this;
      this.tag.tag(tagName);
    },
    render: function(){
      return this;
    }
  });
}
