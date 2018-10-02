/*
 **CustomElements By Ian Senne
 **This file defines (window||exports).ce = CustomElementObject
 **CustomElementObject.Manager = class ce
 **CustomElementObject.Builder = class Builder
 **#customize the world
 */
debugger;
((window, $B) => {
	var oats = {
		"attributes": true
	};
	var onloadQue = [];
	var loaded = false;
	setTimeout(() => {
		const onload = window.onload;
		window.onload = () => {
			if (onload) onload();
			onloadQue.forEach(a => a());
			loaded = true;
		}
	}, 0);
	const getElements = (_ = document.children[0], $ = [], a = getElements) => _.children.length > 0 ? (i => {
		Object.assign([], _.children).forEach(l => {
			$.push.apply($, a(l));
		});
		return $;
	})() : (i => {
		$.push(_);
		return $;
	})();
	const ce = {};
	var uuids = [];

	function createUUID() {
		var uuid = null;
		while (uuids.includes(uuid) || uuid === null) {
			uuid = new Array(128).fill(0).map(a => Math.random().toString(36).replace(/\./g, "")).join("").substr(0, 128);
		}
		uuids.push(uuid);
		return uuid;
	}
	ce.Manager = class ce {
		constructor() {
			this.builders = [];
			this.elements = [];
		}
		getCustomElements(type) {
			var elems = getElements();
			elems = elems.filter(a => {
				if (a) {
					if (type) {
						if (type.toUpperCase() === a.tagName) return a;
					} else {
						for (var i = 0; i < this.builders.length; i++) {
							if (this.builders[i].tag === a.tagName) return a;
						}
					}
				}
				return -a;
			});
			return elems;
		}
		get getElements() {
			return getElements;
		}
		registerBuilder(elem) {
			elem.__set_manager__(this);
			this.builders.push(elem);
		}
		create(type) {
			var el = null;
			for (var i = 0; i < this.builders.length; i++) {
				if (this.builders[i].tag === type.toUpperCase()) {
					return this.builders[i].create();
				}
			}
		}
	};
	ce.Builder = class Builder {
		constructor(opts = {}) {
			var defs = {
				onCreate: this.__proto__.NO_OP,
				onGet: this.__proto__.NO_OP,
				onModify: this.__proto__.NO_OP,
				tag: ""
			};
			this.uuid = createUUID();
			var fin = Object.assign(defs, opts);
			this.tag = fin.tag.toUpperCase();
			this.onCreate = fin.onCreate;
			this.onModify = fin.onModify;
			this.owned = [];
			this.manager;
		}
		__set_manager__(manager) {
			this.manager = manager;
			var a = () => {
				var selfs = this.manager.getCustomElements(this.tag);
				for (var i = 0; i < selfs.length; i++) {
					selfs[i].setAttribute("class", selfs[i].getAttribute("class") === null ? this.uuid : selfs[i].getAttribute("class") + " " + this.uuid);
					this.element = selfs[i];
					var oc = () => {
						self = selfs[i];
						this.onCreate(self);
						var listener = new MutationObserver(_ => {
							for (var i = 0; i < _.length; i++) {
								this.onModify(_[i].target);
							}
						});
						window.listeners = window.listeners || [];
						window.listeners.push(listener);
						listener.observe(self, oats);
					};
					oc();
					this.owned.push(this.element);
					this.manager.elements.push(this.element);
				}
			};
			if (!loaded) {
				onloadQue.push(a);
			} else {
				a();
			}
		}
		create() {
			var el = document.createElement(this.tag);
			el.setAttribute("class", this.uuid);
			this.onCreate(el);
			var listener = new MutationObserver(_ => {
				for (var i = 0; i < _.length; i++) {
					this.onModify(_[i].target);
				}
			});
			window.listeners = window.listeners || [];
			window.listeners.push(listener);
			listener.observe(el, oats);
			this.owned.push(el);
			this.manager.elements.push(this.element);
			return el;
		}
		NO_OP() {}
	};
	window.ce = window.ce || ce;
	if ($B === "EXPORTS") exports.ce = ce;
})(window || exports, window || "EXPORTS");