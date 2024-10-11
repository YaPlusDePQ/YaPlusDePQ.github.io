function clear(){
    let logDiv = document.getElementById('console');
    logDiv.innerHTML = '';
}

function help(){
    let msg = `~4Bienvenue dans le portrait identitaire personnel d'Alexandre RAZUMOWSKI, aka RAZU.~~

Vous allez découvrir ce portrait à travers ce ~6terminal de commande~~ dont vous allez pouvoir explorer les fichiers et dossiers. Les fichiers possèdent des ~1extensions~~ (fichier.~1extension~~) contrairement aux dossiers (dossier). Ouvrir un fichier vous permet de voir son contenu.

~6Pour cela, voici une liste de commandes que vous allez pouvoir effectuer pour vous déplacer dans le système~~ :
    - ~0~fhelp~~~~ : Affiche cette aide
    - ~0~fquit~~~~ : Quitte le portrait
    - ~0~fclear~~~~ : Nettoie le terminal
    - ~0~fls~~~~ : Affiche les dossiers et fichiers au niveau actuel
    - ~0~fcd nomDossier~~~~ : Vous permet de vous déplacer dans le dossier spécifié (utilisez '..' pour retourner en arrière)
    - ~0~fshow nomFichier~~~~ : Affiche le contenu du fichier.`;
    log(msg, author='SYSTEME')
}

function quit(){
    exitFullscreen();
    clear();

    document.getElementById('command-line-wrapper').hidden = true;
    document.getElementById('command-line').disabled = true;
    document.getElementById('start').hidden = false;
    document.getElementById('terminal').hidden = true;
}

function ls(){
    let files = window.currentLocation;
    let location = '\''+window.currentLocationName+'\'';
    let content = '';
    for(let key in files){
        if(key !== '..') content += `    ${key + ' '.repeat(25-key.length)}${files[key].constructor == Object ? 'DOSSIER' : '~4FICHIER~~'}\n`;
    }

    log(`
~0~fLISTE DES FICHIERS ET DOSSIERS DANS ${location + ' '.repeat(30-location.length)}~~~~
${content}
~0~f${' '.repeat(66)}~~~~`, 'SYSTEME');
}

function cd(arg){
    let files = window.currentLocation;
    if(files[arg] === undefined || typeof files[arg] === 'string'){
        if(arg === '..') err(`Vous ne pouvez pas remonter plus loin.`);
        else err(`Le dossier '${arg}' n'existe pas.`);
    }
    else{
        window.currentLocation = files[arg];
        if(arg === '..'){
            let build = window.currentLocationName.split('/')
            build.pop();
            window.currentLocationName = build.join('/');
        }
        else{
            window.currentLocationName += '/'+arg;
        }

        document.getElementById('command-line-location').innerHTML = '[' + window.currentLocationName + ']';
    }
}

function show(arg){
    let files = window.currentLocation;
    if(typeof files[arg] === 'string'){
        log(files[arg], window.currentLocationName);
    }
    else{
        err(`${arg} n'est pas reconnu comme un fichier.`);
    }
}

function executeCmd(cmd, FILES) {
    log(cmd, window.currentLocationName);
    let command = cmd.split(' ')[0];
    let arg = cmd.split(' ')[1];
    console.log(command);
    
    const functions = {
        help, 
        quit,
        clear, 
        ls,
        cd,
        show
    };

    if (functions[command]) {
        if(arg){ 
            functions[command](arg);
        }
        else{
            functions[command]();
        }
    } else {
        err(`La commande '${command}' n'existe pas.`);
    }   
}
