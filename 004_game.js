console.log("game.js loaded");

var game = {};

game.test = new common.TextObject({text:"abcde",x:0,y:0,xD:1,yD:1},100);
game.test.calculate = function(){
  if(this.y<setting.game.frame.row){
    if(this.x==0 && this.xD == -1){
      this.yN += this.yD;
      this.xD *= -1;
    } else if(this.x+this.width==setting.game.frame.column && this.xD == 1){
      this.yN += this.yD;
      this.xD *= -1;
    } else {
      this.xN += this.xD;
      if(base.inputs.keyboard.check(KEY_LEFT)) this.xN = this.x-1
      if(base.inputs.keyboard.check(KEY_RIGHT)) this.xN = this.x+1
    }
  } else {
    this.interval.stop();
    delete game.test;
  }
};
