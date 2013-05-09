function BfStack(dumpViewConstructor) {
	var dumpView = new dumpViewConstructor();
	var stack = [0];
	var index = 0;
	
	this["+"] = function() {
		stack[index] ++;
		setDumpView();
	};
	this["-"] = function() {
		stack[index] --;
		setDumpView();
	};
	this["<"] = function() {
		index --;
		setDumpView();
	};
	this[">"] = function() {
		index ++;
		if (index == stack.length)
			stack.push(0);
		setDumpView();
	};
	this["."] = function() {
		putAChar(String.fromCharCode(stack[index]));
	};
	this[","] = function() {
		var c = getAChar("Input");
		if (c == null) {
			stack[index] = 0;
		} else {
			stack[index] = c.charCodeAt(0);
		}
		setDumpView();
	};
	function setDumpView() {
		dumpView.setValue(index, stack[index]);
	}
	this.isZero = function() {
		return stack[index] == 0;
	}
}
