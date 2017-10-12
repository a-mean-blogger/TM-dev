console.log('TM.DebugManager loaded');

/******************************/
/* TM.DebugManager            */
/******************************/
// Object Type: TM.IObject
// Description: print data for debugging
// functions:
// - print: print data. 'name' should be unique otherwise it will replace the existing data
// - delete: delete printed data with the name
// - deleteAll: remove All printed data
TM.DebugManager = function(debugSetting){
  this.debugSetting = TM.common.mergeObjects(TM.defaultSettings.debug, debugSetting);

  try{
    this.outputDom = document.querySelector('#'+this.debugSetting.outputDomId);
    if(!this.outputDom){
      throw('[#'+this.debugSetting.outputDomId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.devMode = false;
    console.error('new TM.DebugManager ERROR: '+errorMessage+' TM.DebugManager is not created.');
    return;
  }

  this.doms = {};
  TM.IObject.call(this);
};
TM.DebugManager.prototype = Object.create(TM.IObject.prototype);
TM.DebugManager.prototype.constructor = TM.DebugManager;

// TM.IObject functions implementation
TM.DebugManager.prototype._init = function(){};
TM.DebugManager.prototype._destroy = function(){
  this.deleteAll();
};

// TM.DebugManager pulbic functions
TM.DebugManager.prototype.print = function(name,data){
  if(this.debugSetting.devMode){
    if(!this.doms[name]){
      this.doms[name] = document.createElement('div');
      this.outputDom.appendChild(this.doms[name]);
    }
    var text = '';
    for(var key in data){
      text += key + ': ' + data[key] + '\n';
    }
    this.doms[name].innerText = text;
  }
  else {
    this.delete(name);
  }
};
TM.DebugManager.prototype.delete = function(name){
  if(this.doms[name]){
    this.doms[name].remove?this.doms[name].remove():this.doms[name].parentElement.removeChild(this.doms[name]);
    delete this.doms[name];
  }
};
TM.DebugManager.prototype.deleteAll = function(){
  for(var task in this.doms){
    this.delete(task);
  }
};
