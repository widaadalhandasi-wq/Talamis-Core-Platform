import { n as _defineProperty } from "./objectSpread2-C_IE-bIJ.js";
import { Dc as InjectionToken, Dl as ɵɵdefineInjectable, Fn as Injectable, Wi as setClassMetadata, cl as inject, hc as DOCUMENT } from "./core-C5zxX-bE.js";
//#region node_modules/@angular/common/fesm2022/_platform_location-chunk.mjs
/**
* @license Angular v22.1.4
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var _PlatformLocation;
var _BrowserPlatformLocation;
var _DOM = null;
function getDOM() {
	return _DOM;
}
function setRootDomAdapter(adapter) {
	var _DOM2;
	(_DOM2 = _DOM) !== null && _DOM2 !== void 0 || (_DOM = adapter);
}
var DomAdapter = class {};
var PlatformLocation = class {
	historyGo(relativePosition) {
		throw new Error(ngDevMode ? "Not implemented" : "");
	}
};
_PlatformLocation = PlatformLocation;
_defineProperty(PlatformLocation, "ɵfac", function PlatformLocation_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _PlatformLocation)();
});
_defineProperty(PlatformLocation, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _PlatformLocation,
	factory: () => (() => inject(BrowserPlatformLocation))(),
	providedIn: "platform"
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformLocation, [{
		type: Injectable,
		args: [{
			providedIn: "platform",
			useFactory: () => inject(BrowserPlatformLocation)
		}]
	}], null, null);
})();
var LOCATION_INITIALIZED = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "Location Initialized" : "");
var BrowserPlatformLocation = class extends PlatformLocation {
	constructor() {
		super();
		_defineProperty(this, "_location", void 0);
		_defineProperty(this, "_history", void 0);
		_defineProperty(this, "_doc", inject(DOCUMENT));
		this._location = window.location;
		this._history = window.history;
	}
	getBaseHrefFromDOM() {
		return getDOM().getBaseHref(this._doc);
	}
	onPopState(fn) {
		const window = getDOM().getGlobalEventTarget(this._doc, "window");
		window.addEventListener("popstate", fn, false);
		return () => window.removeEventListener("popstate", fn);
	}
	onHashChange(fn) {
		const window = getDOM().getGlobalEventTarget(this._doc, "window");
		window.addEventListener("hashchange", fn, false);
		return () => window.removeEventListener("hashchange", fn);
	}
	get href() {
		return this._location.href;
	}
	get protocol() {
		return this._location.protocol;
	}
	get hostname() {
		return this._location.hostname;
	}
	get port() {
		return this._location.port;
	}
	get pathname() {
		return this._location.pathname;
	}
	get search() {
		return this._location.search;
	}
	get hash() {
		return this._location.hash;
	}
	set pathname(newPath) {
		this._location.pathname = newPath;
	}
	pushState(state, title, url) {
		this._history.pushState(state, title, url);
	}
	replaceState(state, title, url) {
		this._history.replaceState(state, title, url);
	}
	forward() {
		this._history.forward();
	}
	back() {
		this._history.back();
	}
	historyGo(relativePosition = 0) {
		this._history.go(relativePosition);
	}
	getState() {
		return this._history.state;
	}
};
_BrowserPlatformLocation = BrowserPlatformLocation;
_defineProperty(BrowserPlatformLocation, "ɵfac", function BrowserPlatformLocation_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _BrowserPlatformLocation)();
});
_defineProperty(BrowserPlatformLocation, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _BrowserPlatformLocation,
	factory: () => (() => new _BrowserPlatformLocation())(),
	providedIn: "platform"
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserPlatformLocation, [{
		type: Injectable,
		args: [{
			providedIn: "platform",
			useFactory: () => new BrowserPlatformLocation()
		}]
	}], () => [], null);
})();
//#endregion
export { setRootDomAdapter as a, getDOM as i, LOCATION_INITIALIZED as n, PlatformLocation as r, DomAdapter as t };
