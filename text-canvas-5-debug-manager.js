console.log('text-canvas-5-debug-manager.js loaded');

/******************************/
/* TC.DebugManager            */
/******************************/
// Object Type: TC.Object
// Description: print data for debugging
// functions:
// - print: print data. 'name' should be unique otherwise it will replace the existing data
// - delete: delete printed data with the name
// - deleteAll: remove All printed data
TC.DebugManager = function(debugSetting){
  this.debugSetting = TC.common.mergeObjects(TC.defaultSettings.debug, debugSetting);

  try{
    this.outputDom = document.querySelector('#'+this.debugSetting.outputDomId);
    if(!this.outputDom){
      throw('[#'+this.debugSetting.outputDomId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.devMode = false;
    console.error('new TC.DebugManager ERROR: '+errorMessage+' TC.DebugManager is not created.');
    return;
  }

  this.doms = {};
  TC.Object.call(this);
};
TC.DebugManager.prototype = Object.create(TC.Object.prototype);
TC.DebugManager.prototype.constructor = TC.DebugManager;

// TC.Object functions implementation
TC.DebugManager.prototype.destroy = function(){
  this.deleteAll();
  TC.Object.prototype.destroy.call(this);
};

// TC.DebugManager pulbic functions
TC.DebugManager.prototype.print = function(name,data){
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
TC.DebugManager.prototype.delete = function(name){
  if(this.doms[name]){
    this.doms[name].remove();
    delete this.doms[name];
  }
};
TC.DebugManager.prototype.deleteAll = function(){
  for(var task in this.doms){
    this.delete(task);
  }
};
