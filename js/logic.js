// range data type
const SCORE = 0
const TIME = 1

// range operator
const BETWEEN = 0
const ABOVE = 1
const UNDER = 2
const EQUAL = 3
const ALL = 4

// logic operator
const AND = 0
const OR = 1

class range{

    constructor(){
        this.type = SCORE
        this.min = 0
        this.max = 100
        this.operator = BETWEEN
    }
    /**
     * @param {int} value
     * @returns {boolean}
     */
    in(value){
        switch(this.operator){
            case BETWEEN:
                return value >= this.min && value <= this.max
            case ABOVE:
                return value >= this.max
            case UNDER:
                return value <= this.max
            case EQUAL:
                return value === this.max
            case ALL:
                return true
        }
    }

    /**
     * @param {int} type
     */
    setType(type){
        this.type = type
    }
}

class logicBlock{
    constructor(){
        this.operator = AND
        this.elements = []
        this.addRange()
    }

    addRange(){
        this.elements.push(new range())
    }

    isTrue(score, time){
        let result = 0
        let e
        for(let i in this.elements){
            e = this.elements[i]
            if(e instanceof logicBlock && e.isTrue(score, time)){
                result++
            }
            else{
                
                if(e.type === SCORE && e.in(scoreToInt(score))){
                    result++
                }
                else if(e.type === TIME && e.in(timeToInt(time))){
                    result++
                }
            }
        }
        
        if(this.operator === AND){
            return result === this.elements.length
        }
        else{
            return result >= 1
        }
    }

    /**
     * @param {int} newOperator
     * @param {int} index
     * @param {int} i
     */
    setOperator(newOperator, index, currentIndex=0){
        console.log(newOperator, index, currentIndex,this)
        let listIndex

        if(this.elements[0] instanceof logicBlock){
            if(this.elements[0].getLenght()-1 + currentIndex <= index){
                currentIndex += this.elements[0].getLenght()-1
            }
            else if(this.elements[0].getLenght()-1 + currentIndex > index){
                this.elements[0].setOperator(newOperator, index, currentIndex)
                this.cleanUpDeepth()
                return
            }
        }
 
        for(listIndex=1; listIndex<this.elements.length; listIndex++){
            console.log(currentIndex, listIndex)

            if(currentIndex == index){
                break
            }

            if(this.elements[listIndex] instanceof logicBlock){
                if(this.elements[listIndex].getLenght()-1 + currentIndex < index){
                    currentIndex += this.elements[listIndex].getLenght()
                }
                else if(this.elements[listIndex].getLenght()-1 + currentIndex >= index){
                    this.elements[listIndex].setOperator(newOperator, index, currentIndex+1)
                    this.cleanUpDeepth()
                    return
                }
            }
            else{
                currentIndex += 1
            }
        }

        if(listIndex === this.elements.length){
            listIndex--
        }
        if(newOperator !== this.operator){

            if(this.elements.length > 2){
                let newBlock = new logicBlock()
                newBlock.operator = newOperator
                newBlock.elements = [this.elements[listIndex-1], this.elements[listIndex]]

                this.elements.splice(listIndex-1, 2, newBlock)
                
            }
            else{
                
                this.operator = newOperator
            }
        }
        this.cleanUpDeepth()
        this.cleanUpDeepth()

    }

    cleanUpDeepth(){
        for(let i in this.elements){
            if(this.elements[i] instanceof logicBlock){

                this.elements[i].cleanUpDeepth()
                
                if(this.elements[i].operator === this.operator ||  this.elements[i].length == 1){
                    
                    for(let j in this.elements[i].elements){
                        
                        this.elements.splice(i+1+j, 0, this.elements[i].elements[j])
                    }
                    this.elements.splice(i,1)
                }
                
            }
        }
    }

    getLenght(){
        let lenght = 0
        for(let i=0; i<this.elements.length; i++){
            if(this.elements[i] instanceof logicBlock){
                lenght += this.elements[i].getLenght()
            }
            else{
                lenght++
            }
        }
        return lenght
    }

    getRangeList(){
        let ranges = []
        for(let i=0; i<this.elements.length; i++){
            if(this.elements[i] instanceof logicBlock){
                ranges = ranges.concat(this.elements[i].getRangeList()) 
            }
            else{
                ranges.push(this.elements[i])
            }
        }

        return ranges
    }

    getRangeAt(index){
        return this.getRangeList()[index]
    }

}


/**
 * @param {int} notation
 * @param {logicBlock} logic
 * @param {String} score
 * @param {String} time
 * @returns {int}
 */
function getNotationLevel(notation, logic, score, time){
    if(logic.isTrue(score, time)){
        return notation
    }
    else{
        return 0
    }
}

/**
 * @param {int} ceiling
 * @param {int} notationMin
 * @param {int} notationMax
 * @param {int} proportionalTo
 * @param {logicBlock} logic
 * @param {String} score
 * @param {String} time
 * @returns {int}
 */
function getNotationProportional(ceiling, notationMin, notationMax, proportionalTo, logic, score, time){
    finalScore = 0
    if (logic.isTrue(score, time)){
        switch(proportionalTo){
            case SCORE:
                finalScore = (scoreToInt(score)/ceiling) * notationMax
                break
            case TIME:
                finalScore = (timeToInt(time)/ceiling) * notationMax
                break
        }

        if(finalScore > notationMax){
            return notationMax
        }

        if(finalScore < notationMin){
            return notationMin
        }

        return finalScore
    }

    return 0
}


// var genRules = new logicBlock()
// genRules.addRange()
// genRules.addRange()
// genRules.addRange()
// genRules.addRange()
// genRules.addRange()

// // genRules.setOperator(OR, 0)
// // console.log("-----------")
// // genRules.setOperator(AND, 1)
// console.log("-----------")
// // genRules.setOperator(OR, 1)

// // console.log("-----------")

// genRules.elements[0].min = 0
// genRules.elements[1].min = 1
// genRules.elements[2].min = 2
// genRules.elements[3].min = 3
// genRules.elements[4].min = 4
// genRules.elements[5].min = 5

// genRules.setOperator(OR, 1)
// console.log("-----------")

// // genRules.setOperator(OR, 2)
// genRules.setOperator(OR, 2)


// console.log(genRules)