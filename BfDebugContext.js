function DebugContext(list, stack, parent) {
	var listIndex = -1;
	this.DONE = 0;
	this.BREAK = 1;
	this.NORMAL = 2;
	var child;
	var currentCmd;
	if (list.length > 0) currentCmd = list[0];
	if (currentCmd) currentCmd.setCurrent(true);
	
	this.step = function(){
		var ret = this.stepNext();
		if (ret != this.DONE) this.doAStep();
		return ret;
	}
	this.doAStep = function() {
		if (child) {
			child.doAStep();
		} else {
			list[listIndex].action();
		}
	}
	this.stepNext = function() {
		if (child) {
			var childRet = child.stepNext();
			if (childRet == this.BREAK) {
				return this.BREAK;
			} else if (childRet == this.NORMAL) {
				return this.NORMAL;
			} else if (childRet == this.DONE) {
				child = null;
				return this.NORMAL;
			}
		} else {
			if (listIndex >= 0) list[listIndex].setCurrent(false);
			listIndex ++;
			if (list.length <= listIndex) {
				if (parent && ! stack.isZero()) {
					listIndex = 0;
				} else {
					return this.DONE;
				}
			}
			
			var next = list[listIndex];
			if (next.parent) {
				if (next.isMacro) {
					child = new DebugContext(next, stack);
					this.stepNext();
				} else if (! stack.isZero()) {
					child = new DebugContext(next, stack, this);
					this.stepNext();
				} else {
//					throw "?";
				}
			}
if (next.setCurrent) //alert(listIndex);
			next.setCurrent(true);

			if (next.hasBreak()) {
				return this.BREAK;
			} else {
				return this.NORMAL;
			}
		}
	}
}
function show(obj) {
	var str = "";
	for (var key in obj) {
		str += key + "=" + obj[key] + "\n";
	}
	alert(str);
}