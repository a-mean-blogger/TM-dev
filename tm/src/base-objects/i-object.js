console.log('TM.IObject loaded');

//=============================
// TM.IObject
//=============================
TM.IObject = function(data, createWithOutInit){
  this.data = TM.common.mergeObjects(this.data, data);
  if(!createWithOutInit) this.init();
};

// TM.IObject functions
TM.IObject.prototype.init = function(){
  this._init();
  this.isActive = true;
};
TM.IObject.prototype.destroy = function(){
  this._destroy();
  this.isActive = false;
};

// TM.IObject interface functions
TM.IObject.prototype._init = function(){};
TM.IObject.prototype._destroy = function(){};
