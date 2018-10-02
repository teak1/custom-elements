var man = new ce.Manager();

var CSV_Builder = new ce.Builder({
	tag: "CSV",
	onCreate: function (self) {
		var width = self.getAttribute("width");
		var height = self.getAttribute("height");
		if (width && height) {
			self.setAttribute("style", `width:${width}px;height:${height}px;overflow:scroll;`);
		}
		var url = self.getAttribute("src");
		fetch(url).then(a => a.text()).then(dataRaw => {
			var data = [];
			var rows = dataRaw.split("\n");
			for (var i = 0; i < rows.length; i++) {
				rows[i] != "" ? data.push(rows[i].split(",")) : null;
			}
			return data;
		}).then(data => {
			var table = document.createElement("table");
			for (var i = 0; i < data.length; i++) {
				var row = document.createElement("tr");
				for (var j = 0; j < data[i].length; j++) {
					var cell = document.createElement("th");
					cell.innerText = data[i][j];
					row.appendChild(cell);
					if (i % 2 === 0) {
						if (j % 2 === 0) {
							row.setAttribute("style", "background-color:#cccccc;");
						} else {
							row.setAttribute("style", "background-color:#dddddd;");
						}
					} else {
						if (j % 2 === 0) {
							row.setAttribute("style", "background-color:#aaaaaa;");
						} else {
							row.setAttribute("style", "background-color:#bbbbbb;");
						}
					}
				}
				table.appendChild(row);
			}
			self.appendChild(table);
		});
	}
});

man.registerBuilder(CSV_Builder);