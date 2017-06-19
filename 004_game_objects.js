function Star(parent,values){
  this.parent = parent;
  this.x = values.x;
  this.y = values.y;
  this.speed = values.speed;
  this.speedCount = 0;
  this.data= {
    blank:0
  };
  this.init();
}
Star.prototype.init = function(){
  this.parent.push(this);
};
Star.prototype.destroy = function(){
  var i = this.parent.indexOf(this);
  this.parent.splice(i,1);
};
Star.prototype.loop = function () {
  if(this.speed){
    if(this.speedCount >= this.speed){
      this.calculate();
      this.speedCount = 0;
    } else {
      this.speedCount++;
    }
  }
  this.draw();
};
Star.prototype.draw = function () {
  if(this.data.blank%2===0) base.screen.insertText(this.x,this.y,"★");
  else base.screen.insertText(this.x,this.y,"☆");
};
Star.prototype.calculate = function () {
  this.data.blank = (this.data.blank+1)%2;
};
