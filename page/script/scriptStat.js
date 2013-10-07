function getStat() {
// Simple XHR pour récuperer sur le serveur les stat
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText);
      var date = new Date(data.docUpdate);
      document.getElementById('date').innerHTML = "Fichier mise à jour le : " + date.toLocaleDateString() + " à " + date.toLocaleTimeString();
      document.getElementById('taille').innerHTML = "Taille du fichier : " + data.docSize + " Ko";
      document.getElementById('nbr').innerHTML = "Nombre d'entrée dans le fichier : " + data.docItems;
    }
  }

  xhr.open('post', '/db/stat', true);

  xhr.send();

};

function _closeWindow() {
 window.opener = self;
  self.close();
}
