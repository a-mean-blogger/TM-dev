console.log("game.js loaded");

var game = {};

game = {
  count: 0,
  objects:[],
  interval: new common.Interval(),
  loop: function(){
    this.timeline();
    this.count++;
    this.objects.forEach(object=> {
      object.loop();
    });
  },
  init: function(){
    this.interval.init(setting.env.fts, _=>this.loop());
  },
  timeline: function(){
    if(this.count == 500){
      new common.TextObject(game.objects,
      {text:"aaa",x:0,y:0,xD:1,yD:1,speed:10},
      function(){
        if(this.y<setting.game.frame.row){
          if(this.x==0 && this.xD == -1){
            this.yN += this.yD;
            this.xD *= -1;
          } else if(this.x+this.width==setting.game.frame.column && this.xD == 1){
            this.yN += this.yD;
            this.xD *= -1;
          } else {
            this.xN += this.xD;
            if(base.inputs.keyboard.check(KEY_LEFT)) this.xN = this.x-1;
            if(base.inputs.keyboard.check(KEY_RIGHT)) this.xN = this.x+1;
          }
        } else {
          this.destroy();
        }
      });
    }
    if(this.count == 0){
      new common.TextObject(game.objects,
      {text:"bb",x:0,y:0,xD:1,yD:1,speed:5},
      function(){
        if(this.y<setting.game.frame.row){
          if(this.x==0 && this.xD == -1){
            this.yN += this.yD;
            this.xD *= -1;
          } else if(this.x+this.width==setting.game.frame.column && this.xD == 1){
            this.yN += this.yD;
            this.xD *= -1;
          } else {
            this.xN += this.xD;
            if(base.inputs.keyboard.check(KEY_LEFT)) this.xN = this.x-1;
            if(base.inputs.keyboard.check(KEY_RIGHT)) this.xN = this.x+1;
          }
        } else {
          this.destroy();
        }
      });
    }
  }
}
game.init();
