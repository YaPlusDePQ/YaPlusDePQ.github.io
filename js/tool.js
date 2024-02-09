
/**
 * @param {string} value
 * @returns {int}
 */
function timeToInt(value){
    if(value.split(':').length === 3){
        let t = value.split(':')
        if (isNaN(parseInt(t[0])) || isNaN(parseInt(t[1])) || isNaN(parseInt(t[2]))){
            return 0
        }
        return parseInt(t[0])*3600 + parseInt(t[1])*60 + parseInt(t[2])
    }
    else{
        return 0
    }
}

/**
 * @param {string} value
 * @returns {string}
 */
function intToTime(value){
    if(!isNaN(parseInt(value))){
        let piValue = parseInt(value)
        if(piValue < 100){
            return `${piValue >= 10 ? piValue : '0'+piValue}:00:00` 
        }
        h = ~~(piValue / 3600)
        piValue -= h * 3600
        let m = ~~(piValue / 60)
        piValue -= m * 60
        let s = piValue
        return `${h >= 10 ? h : '0'+h}:${m >= 10 ? m : '0'+m}:${s >= 10 ? s : '0'+s}` 
    }
    else{
        return `00:00:00`
    }
}

/**
 * @param {string} value
 * @returns {int}
 */
function scoreToInt(value){
    if(value.split('%').length === 2){
        let s = value.split('%')
        if(isNaN(parseInt(s[0]))){
            
            return 0
        }
        return parseInt(s[0])
    }
    else{
        if(isNaN(parseInt(value))){
            return 0
        }
        else return parseInt(value)
    }
}
