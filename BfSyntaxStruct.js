function BfSyntaxStruct(macroDict, expandMacro) {
	expandMacro = expandMacro === undefined ? true : expandMacro;
	var stack = new BfStack(DumpView);
	var source = macroDict.main;
	var commands = ["+", "-", "<", ">", ".", ","];
	var blockList = parse(source);

	function parse(source) {
		try {
			var block = [];
			for (var i = 0; i < source.length; i ++) {
				try {
					var cmd = source[i];
					var c = cmd.Char;
					if (c in stack) {
						cmd.action = stack[c];
						block.push(cmd);
					} else if (c == "[") {
						var newBlock = []
						cmd.action = function() {};
						block.push(cmd);
						newBlock.parent = block;
						block = newBlock;
					} else if (c == "]") {
						var parent = block.parent;
						cmd.action =  function() {};
						block.push(cmd);
						block.action = function() {};
						block.setCurrent = cmd.setCurrent;
						parent.push(block);
						block = parent;
					} else if (expandMacro
						&& macroDict[c]) {
						var newBlock = parse(macroDict[c]);
						newBlock.setCurrent = function(arg) { cmd.setCurrent(arg); };
						newBlock.action = function() { };
						newBlock.parent = block;
						newBlock.isMacro = true;
						block.push(newBlock);
					}
				} catch (eIn) {
					throw eIn + " :at " + i;
				}
			}
			if (block.parent) {
				throw "Syntax error (Loop unmatch.)";
			}
			return block;
		} catch (e) {
			alert("Parser error.\n " + e + "\n" + source);
		}
	};
	
	this.getDebugContext = function() {
		var debug = new DebugContext(blockList, stack);
		return debug;
	};
	
	function runBlock(list) {
		do {
			for (var index = 0; index < list.length; index ++) {
				if (list[index].parent) {
					runBlock(list[index]);
				} else {
					list[index]();
				}
			}
		} while	(
			list.parent
			&& !stack.isZero());
	}

	this.getSource = function() {
		return getSrc(blockList);

		function getSrc(array) {
			var src = "";
			for (var i = 0, max = array.length; i < max; i ++) {
				var cmd = array[i];
				if (cmd.Char) {
					src += cmd.Char;
				} else {
					src += getSrc(cmd);
				}
			}
			return src;
		}
	}
}
