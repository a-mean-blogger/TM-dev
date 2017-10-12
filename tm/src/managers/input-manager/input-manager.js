console.log('TM.InputManager loaded');

//=============================
// TM.InputManager
//=============================
// Object Type: TM.IObject
// Description: manages input methods
TM.InputManager = function(customTargetDomId){
  var targetDomId = customTargetDomId?customTargetDomId:TM.defaultSettings.screen.canvasId;
  try{
    this.targetDom = document.querySelector('#'+targetDomId);
    if(!this.targetDom){
      throw('[#'+domId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TM.InputManager ERROR: '+errorMessage+' TM.InputManager is not created.');
    return;
  }

  this.isAllowed = true;
  this.keyboard = new TM.InputManager_Keyboard(this);
  TM.IObject.call(this);
};
TM.InputManager.prototype = Object.create(TM.IObject.prototype);
TM.InputManager.prototype.constructor = TM.InputManager;

// TM.IObject functions implementation
TM.InputManager.prototype._init = function(){};
TM.InputManager.prototype._destroy = function(){};

// TM.InputManager functions - allow/disallow
TM.InputManager.prototype.isAllowed = function(keyCode){
  return this.isAllowed;
};
TM.InputManager.prototype.disAllow = function(keyCode){
  this.isAllowed = false;
};
TM.InputManager.prototype.allow = function(keyCode){
  this.isAllowed = true;
};
