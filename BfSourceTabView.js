function SourceTab() {
	var tabDiv = document.getElementById("tabs");
	var tabNameSelected;
	var buttonDict = {};

	this.addSource = function(name, fArg) {
		if (!this[name]) {
			this[name] = "";
			var button = document.createElement("input");
			button.type = "button";
			button.className = "tab";
			button.onclick = function() {
				if (tabNameSelected
					&& buttonDict[tabNameSelected]) {
					buttonDict[tabNameSelected].className = "tab";
				}
				tabNameSelected = name;
				button.className = "tab selected";
				fArg(name);
			};
			button.value = name;
			buttonDict[name] = button;
			tabDiv.appendChild(button);
		} else {
			throw "Name already used.";
		}
	}

	this.removeSource = function(name) {
		var button = buttonDict[name];
		delete buttonDict[name];
		tabDiv.removeChild(button);
		delete this[name];
	}
}