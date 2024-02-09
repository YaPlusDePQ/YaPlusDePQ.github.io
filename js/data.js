const SPHERE = 0
const NAME = 2
const SURNAME = 3
const MODULE = 6
const TIMEPASSED = 8
const SCOREGOTTEN = 13

function isFullModule(str){
    let a = str.split('-')
    if(a.length > 1){
        if(a[1].includes('Tous modules')){
            return true
        }
        else{
            return false
        }
    }
    else{
        return true
    }
}


function exctractDataFromCSV(content){
    let lines =  content.replace(/(\r\n|\r)/gm, '\n').split('\n')
    let userData = {}
    let lineData = []
    let user = ""
    for(let i=1; i<lines.length; i++){
        try{
            lineData = lines[i].replace(/"/g, '').split(';')
            user = lineData[NAME].toLowerCase()+'.'+lineData[SURNAME].toLowerCase()
            if(isFullModule(lineData[MODULE])){

                if(!(lineData[SPHERE] in userData)){
                    userData[lineData[SPHERE]] = {}
                }

                if(!(user in userData[lineData[SPHERE]])){
                    userData[lineData[SPHERE]][user] = []
                }

                userData[lineData[SPHERE]][user].push([lineData[SCOREGOTTEN], lineData[TIMEPASSED]])

            }
           
        }
        catch{
            console.log("Erreur de lecture ligne ",i)
        }
    }
    return userData
}

function exctracCustUserCSV(content){
    let lines =  content.replace(/(\r\n|\r)/gm, '\n').split('\n')
    let users = []
    for(let i=1; i<lines.length; i++){
        try{
            lineData = lines[i].replace(/"/g, '').split(';')
            users.push(lineData[0].toLowerCase()+'.'+lineData[1].toLowerCase())
        }
        catch{
            console.log("Erreur de lecture ligne ",i)
        }
    }
    return users
}