
function dropsToXRP(value) {
    return value / 1000000;
}

function XRPToDrops(value) {
    return value * 1000000;
}

module.exports = {
    dropsToXRP: dropsToXRP,
    XRPToDrops: XRPToDrops
};