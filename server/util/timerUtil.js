let time = process.env.intervalTimer;

addZero = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

var timer = setInterval(function () {
    if (!time)
        time = process.env.intervalTimer;
    time -= 1000;
}, 1000);

module.exports.getTimer = () => {
    return time / 1000;
}
