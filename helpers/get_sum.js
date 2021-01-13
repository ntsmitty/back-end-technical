module.exports = (arr) => { 
    if (arr.length > 0) {
        return arr.reduce((a,b) => a + b, 0)
    } else {
        return 0
    }
} 