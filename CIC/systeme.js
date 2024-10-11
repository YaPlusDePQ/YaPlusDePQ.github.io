function enterFullscreen() {
    const elem = document.documentElement; // L'élément que vous souhaitez mettre en plein écran

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari et Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

// Fonction pour quitter le mode plein écran
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari et Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentTime() {
    const now = new Date(); // Obtenir l'heure actuelle
    const hours = String(now.getHours()).padStart(2, '0'); // Obtenir les heures et ajouter un zéro devant si nécessaire
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Obtenir les minutes
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Obtenir les secondes

    return `${hours}:${minutes}:${seconds}`; // Retourner l'heure sous le format HH:mm:ss
}

function addColor(msg){
    const tagToColor = {
        '~0':'<span style="color:#000">',
        '~1':'<span style="color:#eb3434">',
        '~2':'<span style="color:#34eb37">',
        '~3':'<span style="color:#343deb">',
        '~4':'<span style="color:#eb34e8">',
        '~5':'<span style="color:#ebeb34">',
        '~6':'<span style="color:#34ebe8">',
        '~7':'<span style="color:#fff">',
        '~8':'<span style="background:#000">',
        '~9':'<span style="background:#eb3434">',
        '~a':'<span style="background:#34eb37">',
        '~b':'<span style="background:#343deb">',
        '~c':'<span style="background:#eb34e8">',
        '~d':'<span style="background:#ebeb34">',
        '~e':'<span style="background:#34ebe8">',
        '~f':'<span style="background:#fff">',
        '~~':'</span>'
    };
    msg = msg.replace(/\n/g, '</br>');

    return msg.replace(/~[0-9a-f]|~~/g, (match) => {
        return tagToColor[match] || '';
    });

}


function scroolDown(){
    document.getElementById('command-line').scrollIntoView();;
}

function log(msg, author='root'){
    let logDiv = document.getElementById('console');
    msg = addColor(msg);
    msg = getCurrentTime() + ' ' + '<b>[' + author + ']</b> $ ' + msg;
    logDiv.innerHTML += `\n<p>${msg}</p>`;
    scroolDown();
}

function err(msg){
    let logDiv = document.getElementById('console');
    msg = getCurrentTime() + ' ' + '<b>' + '| ERROR | ' + '</b>' + msg;
    msg = '~9' + msg + '~~';
    msg = addColor(msg);
    logDiv.innerHTML += `\n<p>${msg}</p>`;
    scroolDown();
}

function warning(msg){
    let logDiv = document.getElementById('console');
    msg = getCurrentTime() + ' ' + '<b>' + '| WARNING | ' + '</b>' + msg;
    msg = '~d~0' + msg + '~~~~';
    msg = addColor(msg);
    logDiv.innerHTML += `\n<p>${msg}</p>`;
    scroolDown();
}

async function load(title, processList, author='root', min = 100, mid=100, max = 100, pUnderMid=100, length=40){
    let logDiv = document.getElementById('console');
    let loading = " ".repeat(length);
    let ident = `${getCurrentTime()} <b>[${author}]</b> $ ${title}`;
    let currentProcess = 0;
    logDiv.innerHTML += `<p id='_loadCurrent' style='white-space: pre;'></p>`;

    let loader = document.getElementById('_loadCurrent');
    for(let i=0; i<101; i++){
        if(i > 0){ 

            t = (Math.random()*(mid - min) + min );
            let x = Math.random()*100;
            if(x > pUnderMid){
                t = (Math.random()*(max - min) + min );
            }
            await sleep( t );
        
        }
        loading = "█".repeat(Math.ceil((i/100)*length)) + " ".repeat(length-(Math.ceil((i/100)*length)));
        currentProcess = processList[i] === undefined ? currentProcess : i;
        loader.innerHTML = `${ident} [${loading}] ${i}%</br>${" ".repeat(ident.length)} ${addColor(processList[currentProcess])}`;
        loader.id = "";
    }


}

function inputWidth(self){
    self.style = 'width:'+(self.value.length)+'ch';
}

async function start(){

    document.getElementById('start').hidden = true;
    document.getElementById('terminal').hidden = false;

    enterFullscreen();

    const logs = [
        "Booting Linux 5.4.0-42-generic",
        "#Initializing cgroups",
        "Initializing cgroups   [~2DONE~~].",
        "Setting up static hostname: my-linux",
        "Mounting /proc",
        "Mounting /sys",
        "Mounting /dev",
        "Starting udev",
        "#Loading modules",
        "Loading modules    [~2DONE~~].",
        "#Initializing random number generator",
        "Initializing random number generator   [~2DONE~~].",
        "Starting Device-Mapper event daemon",
        "#Activating swap",
        "Activating swap    [~2DONE~~].",
        "Starting LVM2 daemon",
        "Starting Network Manager",
        "Starting SSH daemon",
        "Starting cron daemon",
        "Starting rsyslogd",
        "Starting system logging",
        "Starting user session",
        "Starting login services",
        "Starting graphical target",
        "~5Reached target Graphical Interface~~",
        "Starting lightdm",
        "~2Lightdm started successfully~~",
        "User session started for user 'USER'",
        "Cleaning up...",
        "~2System ready~~"
    ];


    let t; 

    for(let l in logs){

        if(logs[l].charAt(0) === '#'){
            await load(logs[l].split('#')[1], { 0:'Initializing...', 10:'compiling...', 100:"finished"}, author='root', min=0, mid=10, max=300, pUnderMid=95);
        }
        else{
            log(logs[l]);
            t = Math.random()* (100);
            if(t > 90){
                t = Math.random()* (2000);
            }

            await sleep(t);
        }

    }

    await sleep(500);

    clear();
    log("~0~f##### Welcome to Razu OS 0.1 #####~~");
    log("To get started type 'help'");
    document.getElementById('command-line-wrapper').hidden = false;
    document.getElementById('command-line').disabled = false;
}