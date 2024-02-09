function changeWindow(id){
    document.getElementById("change-univ").style = id === "change-univ" ? "color:#000;" : ""
    document.getElementById("notation").style = id === "notation" ?  "color:#000;"  : ""
    document.getElementById("help").style = id === "help" ?  "color:#000;"  : ""

    document.getElementById("change-univ-panel").style = id === "change-univ" ? "" : "display:none;"
    document.getElementById("notation-panel").style = id === "notation" ? "" : "display:none;"
    document.getElementById("help-panel").style = id === "help" ? "" : "display:none;"
}


//SPHERE

function rendereSphere(data){
    let toRendere = ""
    for(let s in data){
        let mm = 0
        let pm = 0
        let u100 = 0
        for(u in data[s]){
            let is100 = true
            let upm = 0
            for(let d in data[s][u]){
                if(scoreToInt(data[s][u][d][0]) < 100){
                    is100 = false
                }

                upm += scoreToInt(data[s][u][d][0])
            }
            
            pm += upm/Object.keys(data[s][u]).length
            mm += Object.keys(data[s][u]).length
            if(is100){
                u100++
            }
        }
        toRendere += `
        <div class="sphere">
            <h3>${s}</h3>
            <span>Élève(s): ${Object.keys(data[s]).length}</span>
            <span>Module(s): ${(mm/Object.keys(data[s]).length).toFixed(1)}</span>
            <span>${u100} élève(s) à 100%</span>
            <span>Moyenne: ${Math.floor((pm/Object.keys(data[s]).length))}%</span>
            <button class="sphere-button-actif" onclick="unSelecteSphere(this, '${s}')">Désélectionner</button>
        </div>

    `
    }
    document.getElementById('sphere-display').innerHTML = toRendere
    
}

function rendereInfo(file, data){

    let nbu = 0
    let u100 = 0
    let pm = 0
    for(let s in data){
        nbu += Object.keys(data[s]).length
        for(let u in data[s]){
            let is100 = true
            let upm = 0
            for(let d in data[s][u]){
                if(scoreToInt(data[s][u][d][0]) < 100){
                    is100 = false
                }

                upm += scoreToInt(data[s][u][d][0])
            }
            
            pm += upm/Object.keys(data[s][u]).length
            if(is100){
                u100++
            }
        }
    }

    
    document.getElementById("overall-info").innerHTML = `
    <h1>Informations Générales</h1>
    <span>Univers: ${file.name.split('-')[1].replace(/_/g,' ')}</span>
    <span><b>${Object.keys(data).length}</b> sphères</span>
    <span><b>${nbu}</b> élève(s) au total</span>
    <span><b>${u100}</b> élève(s) à <b>100%</b> (<b>${Math.floor((u100/nbu)*100)}%</b>)</span>
    <span>Progression moyenne <b>${Math.floor((pm/nbu))}%</b></span>
    `
}

function selecteSphere(button, name){
    if(selectedSphere.indexOf(name) == -1){
        selectedSphere.push(name)
    }
    console.log(selectedSphere)

    button.className = 'sphere-button-actif'
    button.innerHTML = 'Désélectionner'
    button.onclick = function() {unSelecteSphere(button, name)}
}

function unSelecteSphere(button, name){
    if(selectedSphere.indexOf(name) != -1){
        selectedSphere.splice(selectedSphere.indexOf(name), 1)
    }
    console.log(selectedSphere)

    button.className = 'sphere-button-unactif'
    button.innerHTML = 'Sélectionner'
    button.onclick = function() {selecteSphere(button, name)}
}


//RULES

function addGenRule(){
    genRules.push(new logicBlock())
    genRulesNotation.push(["0","10","0","20","100"])
    displayRules()
}

function addCustRule(){
    custRules.push(new logicBlock())
    custRulesNotation.push(["0","10","0","20","100"])
    displayRules()
}
 
function updateRangeOperator(ruleList, ruleId, rangeId, HTMLId, operator){
    operator = parseInt(operator);
    console.log(BETWEEN, operator)
    ruleList[ruleId].getRangeAt(rangeId).operator = operator
    if(operator !== BETWEEN){
        document.getElementById("range-"+HTMLId+"-min").style="display:none;"
        document.getElementById("range-"+HTMLId+"-span").style="display:none;"
    }
    else{
        document.getElementById("range-"+HTMLId+"-min").style=""
        document.getElementById("range-"+HTMLId+"-span").style=""
    }

    if(operator === ALL ){
        document.getElementById("range-"+HTMLId+"-max").style="display:none;"
    }
    else{
        document.getElementById("range-"+HTMLId+"-max").style=""
    }
}

function updateRangeMin(ruleList, ruleId, rangeId, HTMLId, value){
    let range = ruleList[ruleId].getRangeAt(rangeId)
    if( parseInt(document.getElementById("range-"+HTMLId+"-type").value) === SCORE) {
        document.getElementById("range-"+HTMLId+"-min").value = scoreToInt(value); 
        range.min = scoreToInt(document.getElementById("range-"+HTMLId+"-min").value)
    }
    else {
        if(document.getElementById("range-"+HTMLId+"-min").value.split(':').length !== 3){
            document.getElementById("range-"+HTMLId+"-min").value = intToTime(value); 
        }
        
        range.min = timeToInt(document.getElementById("range-"+HTMLId+"-min").value)
    }
        
}

function updateRangeMax(ruleList, ruleId, rangeId, HTMLId, value){
    let range = ruleList[ruleId].getRangeAt(rangeId)
    if( parseInt(document.getElementById("range-"+HTMLId+"-type").value) === SCORE){ 
        document.getElementById("range-"+HTMLId+"-max").value = scoreToInt(value)
        range.max = scoreToInt(document.getElementById("range-"+HTMLId+"-max").value)
    }
    else { 
        if(document.getElementById("range-"+HTMLId+"-max").value.split(':').length !== 3){
            document.getElementById("range-"+HTMLId+"-max").value = intToTime(value); 
        }

        range.max = timeToInt(document.getElementById("range-"+HTMLId+"-max").value)
    }
}

function updateRangeType(ruleList, ruleId, rangeId, HTMLId, type){
    type = parseInt(type)
    let range = ruleList[ruleId].getRangeAt(rangeId)
    range.type = type
    if(type === SCORE){
        document.getElementById("range-"+HTMLId+"-min").value = range.min > 100 ? 100 : range.min
        range.min = scoreToInt(document.getElementById("range-"+HTMLId+"-min").value)

        document.getElementById("range-"+HTMLId+"-max").value = range.max > 100 ? 100 : range.max
        range.max = scoreToInt(document.getElementById("range-"+HTMLId+"-max").value)

    }
    else{
        document.getElementById("range-"+HTMLId+"-min").value = range.min > 99 ? intToTime(range.min) : intToTime(range.min*3600)
        range.min = timeToInt(document.getElementById("range-"+HTMLId+"-min").value)
        document.getElementById("range-"+HTMLId+"-max").value = range.max > 99 ? intToTime(range.max) : intToTime(range.max*3600)
        range.max = timeToInt(document.getElementById("range-"+HTMLId+"-max").value)

    }
    console.log(range)
}

function createRangeElement(ruleListName, ruleId, rangeId, HTMLId, operator, min, max, type){
    return `
        <div class="range">
            <select class="range-opertaor" onchange="updateRangeOperator(${ruleListName}, ${ruleId}, ${rangeId}, ${HTMLId}, this.value);">
                <option value=${BETWEEN} ${operator === BETWEEN ? 'selected="selected"' : ''}>Entre</option>
                <option value=${ABOVE} ${operator === ABOVE ? 'selected="selected"' : ''}>Au dessus de </option>
                <option value=${UNDER} ${operator === UNDER ? 'selected="selected"' : ''}>En dessous de</option>
                <option value=${EQUAL} ${operator === EQUAL ? 'selected="selected"' : ''}>Égale à</option>
                <option value=${ALL} ${operator === ALL ? 'selected="selected"' : ''}>Toutes les valeurs</option>
            </select>
            <input class="range-input" id="range-${HTMLId}-min" onchange="updateRangeMin(${ruleListName}, ${ruleId}, ${rangeId}, ${HTMLId}, this.value);" value=${type === SCORE ? min : intToTime(min)} style="${operator !== BETWEEN ? 'display:none;' : ''}">
            <span class="range-span" id="range-${HTMLId}-span" style="${operator !== BETWEEN ? 'display:none;' : ''}" >Et</span>
            <input class="range-input" id="range-${HTMLId}-max" onchange="updateRangeMax(${ruleListName}, ${ruleId}, ${rangeId}, ${HTMLId}, this.value);" value=${type === SCORE ? max : intToTime(max)} >
            <select class="range-type" id="range-${HTMLId}-type" onchange="updateRangeType(${ruleListName}, ${ruleId}, ${rangeId}, ${HTMLId}, this.value);">
                <option value=${SCORE}>de score</option>
                <option value=${TIME} ${type === TIME ? 'selected="selected"' : ''}>de temps</option>
            </select>
        </div>`
}

function updateLogicOperator(ruleList, ruleId, operator, index){
    ruleList[ruleId].setOperator(parseInt(operator), index)
    console.log(ruleList[ruleId])
    displayRules()
}

function updateValueCeiling(ruleListName, type, ruleId){
    let element = document.getElementById("rule-"+ruleListName+"-"+ruleId+"-ceiling")
    if(type === SCORE){
        element.value = parseInt(timeToInt(element.value)) > 100 ? 100 : timeToInt(element.value)
    }
    else{
        element.value = parseInt(element.value) > 99 ? intToTime(element.value) : intToTime(element.value*3600)
    }

    if(ruleListName === "genRules"){
        genRulesNotation[parseInt(ruleId)][4] = element.value
    }
    else{
        custRulesNotation[parseInt(ruleId)][4] = element.value
    }
}

function onChangeCeiling(type, element){
    type = parseInt(type)
    if(type === TIME){
        if(element.value.split(':').length !== 3){
            element.value = parseInt(element.value) > 99 ? intToTime(element.value) : intToTime(element.value*3600)
        }
    }
}

function changeNotationType(ruleListName, ruleId, value){
    let param = document.getElementById("notation-param-"+ruleListName+"-"+ruleId).children
    switch(parseInt(value)){
        case 0:
            param[0].style = ""
            param[1].style = "display: none;"
            break
        case 1:
            param[1].style = ""
            param[0].style = "display: none;"
            document.getElementById("notation-param-"+ruleListName+"-"+ruleId+"-type").innerHTML = "de temps"
            updateValueCeiling(ruleListName, TIME, ruleId)
            break;
        case 2:
            param[1].style = ""
            param[0].style = "display: none;"
            document.getElementById("notation-param-"+ruleListName+"-"+ruleId+"-type").innerHTML = "de score"
            updateValueCeiling(ruleListName, SCORE, ruleId)
            break;
    }
}

function createRule(ruleListName, ruleId, rangeId, HTMLid, logic, isStart, notationData){
    let elements = ""
    for(let j=0; j<logic.elements.length; j++){
        if(logic.elements[j] instanceof logicBlock){
            elements += createRule(ruleListName, ruleId, rangeId, HTMLid+rangeId-1, logic.elements[j], false)
            rangeId += logic.elements[j].getLenght()
        }
        else{
            elements += createRangeElement(ruleListName, ruleId, rangeId, HTMLid+rangeId, logic.elements[j].operator, logic.elements[j].min, logic.elements[j].max, logic.elements[j].type)
            rangeId += 1
        }

        if(j < logic.elements.length-1){
            elements += `
            <select class="logic-opertaor" id="logic-${HTMLid+rangeId}-selector" onchange="updateLogicOperator(${ruleListName}, ${ruleId}, this.value, ${rangeId-1});">
                <option value=0>Et</option>
                <option value=1 ${logic.operator === OR ? 'selected="selected"' : ''}>Ou</option>
            </select>`
        }
    }

    if( isStart){
        return `
    <div class="rule">
        <button class="delete-rule" onclick="${ruleListName}.splice(${ruleId}, 1); ${ruleListName}Notation.splice(${ruleId}, 1); displayRules();">x</button>

        <div style="width: 95%;border:solid #dadada 1px;border-left: none;padding: 5px;">
            <div class='logic-wrapper'>
                ${
                    elements
                }
                <button class="add-rule" onclick="${ruleListName}[${ruleId}].addRange(); displayRules();">+</button>
            </div>
            

            <h3 style="margin: 5px;">Notation:</h3>
            <div class="rule-notation">
                <div>
                    <select class="notation-type" id="notation-type-${ruleListName}-${ruleId}" onchange="changeNotationType('${ruleListName}', ${ruleId}, this.value);${ruleListName}Notation[${ruleId}][0] = this.value; ">
                        <option value=0 ${notationData[0] === "0" ? 'selected="selected"' : ''}>Note unique</option>
                        <option value=1 ${notationData[0] === "1" ? 'selected="selected"' : ''}>Proportionnelle au temps</option>
                        <option value=2 ${notationData[0] === "2" ? 'selected="selected"' : ''}>Proportionnelle au score</option>
                    </select>
                </div>
                
                <div class="notation-param" id="notation-param-${ruleListName}-${ruleId}" >
                    <div style="${notationData[0] !== "0" ? 'display:none;' : ''}">
                        <input id="rule-${ruleListName}-${ruleId}-fix" value=${notationData[1]} onchange="${ruleListName}Notation[${ruleId}][1] = this.value;">
                    </div>
                    <div style="${notationData[0] === "0" ? 'display:none;' : ''}">
                    <label>note minimale: </label> <input id="rule-${ruleListName}-${ruleId}-min" value=${notationData[2]} onchange="${ruleListName}Notation[${ruleId}][2] = this.value;"> </br>
                    <label>note maximale: </label> <input id="rule-${ruleListName}-${ruleId}-max" value=${notationData[3]} onchange="${ruleListName}Notation[${ruleId}][3] = this.value;"> </br>
                    <label>note maximale atteinte à: </label> <input id="rule-${ruleListName}-${ruleId}-ceiling" value=${notationData[4]} onchange="onChangeCeiling(document.getElementById('notation-type-${ruleListName}-${ruleId}').value, this);${ruleListName}Notation[${ruleId}][4] = this.value;"> <label id="notation-param-${ruleListName}-${ruleId}-type">${notationData[0] === "1" ? 'de temps' : 'de score'}</label>
                    </div>
                    
                    
                </div>
                
            </div>
            
        </div>
    </div>`
    }
    else{
        return ` 
        <div class='logic-wrapper'>
            ${
                elements
            }

        </div>`
    }
}


function displayRules(){
    let id = 0
    document.getElementById("main-rule-display").innerHTML = ""
    for(let lb in genRules){
        document.getElementById("main-rule-display").innerHTML += createRule(Object.keys({genRules})[0], lb, 0, id, genRules[lb], true, genRulesNotation[lb])
        id += genRules[lb].getLenght()
    }
    
    
    document.getElementById("custom-rule-display").innerHTML = ""
    for(let lb in custRules){
        document.getElementById("custom-rule-display").innerHTML += createRule(Object.keys({custRules})[0], lb, 0, id, custRules[lb], true, custRulesNotation[lb])
        id += custRules[lb].getLenght()
    }
}

function onCustUsersFileLoaded(){
    custUsersSelectedFile = document.getElementById("file-custom").files[0];
    console.log(custUsersSelectedFile)
    let reader = new FileReader()
    reader.onload = function (event) {
        try{
            custUsers = exctracCustUserCSV(reader.result)
            console.log(custUsers)
        }
        catch{
            custUsers = []
            alert("Oops le fichier sélectionné ne semble pas être le bon !")
        }
    }
    reader.readAsText(custUsersSelectedFile)
}



function onFileLoaded(){
    data = {}
    selectedFile = document.getElementById("file").files[0];
    console.log(selectedFile)
    let reader = new FileReader()
    reader.onload = function (event) {
        try{
            data = exctractDataFromCSV(reader.result)
            console.log(data)
            selectedSphere = Object.keys(data)
            console.log(selectedSphere)
            rendereInfo(selectedFile, data)
            rendereSphere(data)
            addGenRule()
            displayRules()
            changeWindow("notation")
        }
        catch{
            alert("Oops le fichier sélectionné ne semble pas être le bon !")
        }
    
    };
    reader.readAsText(selectedFile)

}

function getNotation(){
    let getMaxGen = document.getElementById("maxGen").checked
    let getMaxCust = document.getElementById("maxCust").checked
    let getMaxAll = document.getElementById("maxGenCust").checked
    console.log("getMaxGen:",getMaxGen,"getMaxCust:", getMaxCust, "getMaxAll:",getMaxAll)
    let notation = {}
    let sphere = ""
    for(let sphereId in selectedSphere){
        sphere = selectedSphere[sphereId]
        notation[sphere] = {}

        for(let user in data[sphere]){
            notation[sphere][user] = 0
            let result = 0
            for(let ruleId in genRules){
                switch(genRulesNotation[ruleId][0]){
                    case "0":
                        console.log(parseInt(genRulesNotation[ruleId][1]), genRules[ruleId], data[sphere][user][0], data[sphere][user][1])
                        result = getNotationLevel(parseInt(genRulesNotation[ruleId][1]), genRules[ruleId], data[sphere][user][0][0], data[sphere][user][0][1])
                        break;
                    case "1":
                        result = getNotationProportional(parseInt(genRulesNotation[ruleId][4]), parseInt(genRulesNotation[ruleId][2]), parseInt(genRulesNotation[ruleId][3]), TIME, genRules[ruleId], data[sphere][user][0][0], data[sphere][user][0][1])
                        break;
                    case "2":
                        result = getNotationProportional(parseInt(genRulesNotation[ruleId][4]), parseInt(genRulesNotation[ruleId][2]), parseInt(genRulesNotation[ruleId][3]), SCORE, genRules[ruleId], data[sphere][user][0][0], data[sphere][user][0][1])
                        break;
                }

                if(getMaxGen){
                    notation[sphere][user] = Math.max(notation[sphere][user], result)
                }
                else{
                    notation[sphere][user] = result
                }
            }

            if(custUsers.includes(user)){
                let genResult = notation[sphere][user]
                notation[sphere][user] = 0

                for(let ruleId in custRules){
                    switch(custRulesNotation[ruleId][0]){
                        case "0":
                            result = getNotationLevel(parseInt(custRulesNotation[ruleId][1]), custRules[ruleId], data[sphere][user][0][0], data[sphere][user][0][1])
                            break;
                        case "1":
                            result = getNotationProportional(parseInt(custRulesNotation[ruleId][4]), parseInt(custRulesNotation[ruleId][2]), parseInt(custRulesNotation[ruleId][3]), TIME, custRules[ruleId], data[sphere][user][0][0], data[sphere][user][0][1])
                            break;
                        case "2":
                            result = getNotationProportional(parseInt(custRulesNotation[ruleId][4]), parseInt(custRulesNotation[ruleId][2]), parseInt(custRulesNotation[ruleId][3]), SCORE, custRules[ruleId], data[sphere][user][0][0], data[sphere][user][0][1])
                            break;
                    }
    
                    if(getMaxCust){
                        notation[sphere][user] = Math.max(notation[sphere][user], result)
                    }
                    else{
                        notation[sphere][user] = result
                    }
                }

                if(getMaxAll){
                    notation[sphere][user] = Math.max(notation[sphere][user], genResult)
                }
            }
        }
        
    }
    return notation
}

function downloadNotation(){
    let notations = getNotation()
    let content = "Sphere;Nom;Prenom;Note\n"
    for(let sphereId in notations){
        for(let user in notations[sphereId]){
            content += `${sphereId};${user.split(".")[0]};${user.split(".")[1]};${notations[sphereId][user]}\n`
        }
        
    }

    let name = ""
    for(let i in selectedSphere){
        name += selectedSphere[i]+"-"
    }
    name += "VoltaireTaNote.csv"
    let file = new File(["\ufeff"+content], name, {type: "data:text/csv;charset=utf-8,"});

    url = window.URL.createObjectURL(file);
  
    let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
}

function downloadTemplate(self){

    let file = new File(["\ufeffNom;Prenom\n"], "VoltaireTaNote-liste-élèves-particuliers.csv", {type: "data:text/csv;charset=utf-8,"});

    url = window.URL.createObjectURL(file);
  
    let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
}

var selectedFile = null
var data = {}
var custUsersSelectedFile = null
var custUsers = []
var selectedSphere = []
var genRules = []
var genRulesNotation = []
var custRules = []
var custRulesNotation = []


