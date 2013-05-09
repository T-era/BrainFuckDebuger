var baseContext = new function(){
	var isEditing = false;
	var base;
	var modeCheck;
	var textArea = document.createElement("textarea");
	var sources;
	var sourceSelected;
	var macroControl;

	this.init = function() {
		sources = new SourceTab();
		sources.addSource("main", clickTab);
		sources.main = CharByChar("")
		sourceSelected = "main";
		base = document.getElementById("source");
		modeCheck = document.getElementById("modeCheck");
		sourceViewRefresh();
		macroControl = [
			document.getElementById("addMacro"),
			document.getElementById("remMacro"),
		];
	}

	var debug;
	this.runScript = function() {
		editEnd();
		var syntax = new BfSyntaxStruct(sources, modeCheck.checked);
		debug = syntax.getDebugContext();
		do {
			var temp = debug.step();
		} while (temp != debug.DONE);
		doneScript();
	};
	this.step = function() {
		editEnd();
		if (!debug) {
			var syntax = new BfSyntaxStruct(sources, modeCheck.checked);
			debug = syntax.getDebugContext();
		}
		var temp = debug.step();
		if (temp == debug.DONE) {
			doneScript();
		}
	}
	this.toBreak = function() {
		editEnd();
		if (!debug) {
			var syntax = new BfSyntaxStruct(sources, modeCheck.checked);
			debug = syntax.getDebugContext();
		}
		var temp;
		do {
			temp = debug.step();
		} while (temp != debug.DONE && temp != debug.BREAK);

		if (temp == debug.DONE) {
			doneScript();
		}
	}
	this.outputSource = function() {
		editEnd();
		var syntax = new BfSyntaxStruct(sources, modeCheck.checked).getSource();
		alert(syntax);
	}
	
	this.addMacro = function(name) {
		sources.addSource(name, clickTab);
		sources[name] = CharByChar("");
	}
	this.removeCurrentMacro = function() {
		if (! sourceSelected
			|| sourceSelected === "main") {
			alert("Maamateya.");
		} else {
			sources.removeSource(sourceSelected);
			sourceSelected = "";
		}
	}
	this.modeChange = function() {
		var onOff = ! modeCheck.checked;
		for (var i = 0, max = macroControl.length; i < max; i ++) {
			macroControl[i].disabled = onOff;
		}
	}
	function doneScript() {
		alert("Execute DONE");
		debug = null;
	}

	function sourceViewRefresh() {
		var list = sources[sourceSelected];
		clearChild(base);
		for (var i = 0; i < list.length; i ++) {
			base.appendChild(list[i].DomObj);
		}
	}
	function clickTab(name) {
		if (isEditing) {
			editEnd();
		}
		if (sourceSelected == name) {
			editStart(name);
		} else {
			sourceSelected = name;
			sourceViewRefresh();
		}
	}
	function editEnd() {
		if (isEditing) {
			isEditing = false;
			debug = null;
			sources[sourceSelected] = CharByChar(textArea.value);
			sourceViewRefresh();
		}
	}
	function editStart(name) {
		var list = sources[sourceSelected];
		isEditing = true;
		var str = list.Source;
		textArea.value = str;

		clearChild(base);
		base.appendChild(textArea);
	}
	function clearChild(dom) {
		var list = dom.childNodes;
		for (var i = list.length - 1; i >= 0; i --) {
			var child = list[i];
			dom.removeChild(child);
		}
	}
}

function AddMacro() {
	var name = getAChar("Macro name");
	if (name != null) {
		baseContext.addMacro(name);
	}
}
function RemoveMacro() {
	baseContext.removeCurrentMacro();
}

function getAChar(caption) {
	var msg;
	do {
		msg = window.prompt(caption, "");
	} while (!regalInput(msg))

	return msg;
	function regalInput(arg, f) {
		if (arg == null) return true;
		if (arg.length == 1) return true;

		return false;
	}
}
function putAChar(c) {
	var consoleView = document.getElementById("consoleView");
	consoleView.value += c
}
function OpenHelp() {
	var helpButton = document.getElementById("HelpButton");
	var helpDiv = document.getElementById("HelpDiv");
	helpDiv.style.position = "absolute";
	helpDiv.style.display = "block";
	helpDiv.style.top = helpButton.offsetTop + "px";
	helpDiv.style.left = helpButton.offsetLeft + "px";
}
function CloseHelp() {
	var helpDiv = document.getElementById("HelpDiv");
	helpDiv.style.display = "none";
}
