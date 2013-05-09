
/// returns object as { Char, DomObj }.
function CharByChar(source, key) {
	var list = [];
	if (key) {
		list.Key = key;
	}
	list.Source = source;
	for (var i = 0; i < source.length; i ++) {
		var c = source.charAt(i);
		list.push(new CbCObj(c));
	}
	return list;

	function CbCObj(c) {
		var dom = document.createElement("div");
		var _hasBreak = false;
		dom.innerHTML = c;
		dom.className = "CharByChar";
		dom.onclick = function() {
			if (_hasBreak) {
				_hasBreak = false;
			} else {
				_hasBreak = true;
			}
			setClassName();
		}
		this.hasBreak = function() { return _hasBreak; }
		this.DomObj = dom;
		this.Char = c;
		var isCurrent = false;
		this.setCurrent = function(b) {
			isCurrent = b;
			setClassName();
		}
		function setClassName() {
			dom.className = "CharByChar";
			if (_hasBreak) {
				dom.className += " BackGround_Break";
			} else {
				dom.className += " BackGround_Normal";
			}
			if (isCurrent) {
				dom.className += " ForeGround_Current";
			} else {
				dom.className += " ForeGround_Normal";
			}
		}
		setClassName();
	}
}