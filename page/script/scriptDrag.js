// variables
var dropArea = document.getElementById('target'),
    result = document.getElementById('resultat'),
    submit = document.getElementById('submit'),
    choix = document.getElementById('choix'),
    loadDB = document.getElementById('loadDB'),
    input = document.getElementById('inputName'),
    missing = document.getElementById('alert'),
    choose = document.getElementById('choose'),
    targetName = document.getElementById('targetName'),
    list = [];

// initialisation
(function(){

    // gestionnaires d'evenements
    function initHandlers() {
        dropArea.addEventListener('drop', handleDrop, false);
        dropArea.addEventListener('dragover', handleDragOver, false);
    }

    // Fonction pour la gestion du Dragover (survol lors du déplacement)
    function handleDragOver(event) {
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        event.preventDefault();
        return false;
    }

    // Fonction pour la gestion du Drop
    function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        // Liste des fichiers dropés
        list = event.dataTransfer.files;
        var fileExt = list[0].name;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (fileExt == '.csv') {
            targetName.innerHTML = list[0].name;
            choix.style.display = 'none';
            choose.style.display = 'none';
            missing.style.display = 'none';
        } else {
            alert("Merci de saisir un fichier .csv");
            window.location.reload();
        }
    }

    initHandlers();

})();

// Gestion des styles en fonction du choix de l'utilisateur
function displayDrag(event){
    if(loadDB.value == "") {
        dropArea.style.display = 'block';
        choix.style.display = 'block';
        missing.style.display = 'none';
        input.style.display = 'none';
    }else {
        dropArea.style.display = 'none';
        choix.style.display = 'none';
        missing.style.display = 'none';
        input.style.display = 'block';
        var file = event.value;
        var fileName = file.split("\\");
        document.getElementById("inputFileName").innerHTML = fileName[fileName.length-1];
        choose.innerHTML = "Modifier votre  fichier";
    }
};

// Fonction vérification de l'entrée
function upload(event){
    var file;
    if(loadDB.files != null) {
        file = loadDB.files[0];
    }else{
        file = null;
    }

    if(file != null){
        send(file);

    }else if(list[0]!=undefined){
        send(list[0]);
    }else{
        missing.style.display = 'block';
        return;
    }
};

// Fonction pour l'upload
function send(file) {
    var formData = new FormData();

    formData.append('loadDB', file);
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('post', '/db/upload', true);
    
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        document.getElementById('progress-bar').style.width = percentage + '%';
        
      }
    };

    xhr.upload.onload = function(e) {
          window.setTimeout(function() {
            window.open('https://localhost:8443/db/stat','_self');
    },5000);       
    };

    
    xhr.send(formData);
};

// Fonction de vérification du fichier en entrée
function checkfile(sender) {
    var validExts = new Array(".csv");
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Merci de saisir un fichier " + validExts.toString());
      window.location.reload();
      return false;
    }
    else return true;
}

// Fonction de remplacement de l'input type file par un bouton.
function getFile(){
   document.getElementById("loadDB").click();
 }