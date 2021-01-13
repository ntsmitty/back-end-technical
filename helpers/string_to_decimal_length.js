// probably a better way to do this
module.exports = (length) => {
    if (length) {
            if (length === "3x5") {
                return 5
            }
            if (length === "2.5x7" || length === "5x7") {
                return 7
            }
            if (length === "2.5x2") {
                return 2
            }
        }
        return length;
    }
