const Debounce = {
    timestamp: Date.now(),
    currentTimeout: null
}

Debounce.refreshTime = function () {
    this.timestamp = Date.now();
    clearTimeout(this.currentTimeout);
}

Debounce.run = function (callback, timeout = 1000) {
    this.refreshTime();
    this.currentTimeout = setTimeout(callback, timeout);
}