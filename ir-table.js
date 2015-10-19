(function() {
	Polymer({
		is: 'ir-table',

		properties: {

			promptMode : {
				type : Boolean,
				value : false,
				notify : true
			}
		},

		populateTable : function (table, rows, cells, content) {
			if (!table) table = document.createElement('table');

			for (var i = 0; i < rows; ++i) {
				var row = document.createElement('tr');
				for (var j = 0; j < cells; ++j) {
					row.appendChild(document.createElement('td'));
					row.cells[j].appendChild(document.createTextNode(content + (j + 1)));
				}
				table.appendChild(row);
			}
			return table;
		},

		createTable: function(e){
			var cells = this.$.Cells.value;
			var rows = this.$.Rows.value;
			var table = this.populateTable(null, rows, cells, "Text");
			table = table.outerHTML
			console.log('table created');
			this._updateValue(table);
		},

		_updateValue : function(table) {
			var that = this;
			that.value = table;

		},

		hideDialog : function (e) {
			this.$.dialog.close();
		},

		open : function(ev) {
			var that = this;
			setTimeout(function() {
				that.$.dialog.open();
			}, 100);
		},

		prompt : function(callback) {
			if(!this.promptMode)
				throw new Error("must be in prompt mode to use .prompt");

			this.promptCallback = callback;
			this.open()
			this.doGetCaretPosition(document.getElementById('editor'));


		},

		findNode: function (node) {
			var i = 0;
			while (node = node.previousSibling)
				++i;
			return i;
		},

		doGetCaretPosition :function  (ctrl) {
			var elem = document.getElementById('editor')
			var sel = window.getSelection();
			if (sel.rangeCount) {
				var range = sel.getRangeAt(0);
				var index = this.findNode(range.startContainer);
				var CaretPos = sel.focusOffset;
				range.collapse(false);
				this.CaretPos = CaretPos;
				this.Index = index;
			}
		},

		setCaretPosition: function (ctrl, pos, index) {
			var elem = document.getElementById(ctrl)
			elem.focus();
			var textNode = elem.firstChild;
			var range = document.createRange();
			range.setStart(elem.childNodes[index],pos);
			var selection = window.getSelection();
			window.getSelection().removeAllRanges();
			selection.addRange(range);
		},

		promptSelect : function() {
			console.log('prompt selected!')
			this.hideDialog();
			this.setCaretPosition('editor', this.CaretPos, this.Index)
			this.promptCallback(this.value);
		},

	});


})();
