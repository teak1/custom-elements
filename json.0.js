function walk(json, depth) {
	let add = str => div.innerHTML += "&nbsp;".repeat(2 * depth) + str + "\n";
	let div = document.createElement("div");
	if (Array.isArray(json)) {
		add("[");
		for (let i = 0; i < json.length; i++) {
			div.appendChild(walk(json[i], depth + 1));
		}
		add("]");
	} else if (typeof json === "string") {
		div.setAttribute("style", "color:#f20");
		add(`"${json}"`);
	} else if (typeof json === "number") {
		div.setAttribute("style", "color:#20f");
		add(json);
	} else if (json === null) {
		div.setAttribute("style", "color:#aaa");
		add("null");
	} else if (typeof json === "boolean") {
		div.setAttribute("style", "color:#0a1");
		add(json);

	} else {
		for (let i in json) {
			add(i);
			div.appendChild(walk(json[i], depth + 1));
		}
	}
	return div;
}
let Bob = new ce.Builder({
	tag: "fixit",
	onCreate: function (self) {
		self.url = self.getAttribute("src");
		self.url && fetch(self.getAttribute("src")).then(a => a.json()).then(json => {
			self.appendChild(walk(json, 0));
		}).catch(console.error);
	},
	onModify: function (self) {
		if (self.url != self.getAttribute("src")) {
			self.innerHTML = "";
			self.url = self.getAttribute("src")
			fetch(self.url).then(a => a.json()).then(json => {
				self.appendChild(walk(json, 0));
			}).catch(console.error);
		}
	}
});

man.registerBuilder(Bob);