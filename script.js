//Valeur du poid de chaque rune, utilisé pour calculer les taux de brisage
var poids = {
    "PA" : 100,
    "PM" : 90, 
    "Portée" : 51,
    "Invocations" : 30,
    "Dommages" : 20,
    "% Dommages d'armes" : 15,
    "% Dommages distance" : 15,
    "% Dommages mêlée" : 15,
    "% Dommages aux sorts" : 15,
    "% Résistance distance"  : 15,
    "% Résistance mêlée" : 15,
    "Soins" : 10,
    "% Critique" : 10,
    "% Critiques" : 10,
    "Renvoi de dommages" : 10,
    "Retrait PM" : 7,
    "Retrait PA" : 7,
    "Esquive PM" : 7,
    "Esquive PA" : 7,
    "% Résistance Terre" : 6,
    "% Résistance Eau" : 6,
    "% Résistance Neutre" : 6,
    "% Résistance Feu" : 6,
    "% Résistance Air" : 6,
    "Dommages Critiques" : 5,
    "Dommages Terre" : 5,
    "(dommages Terre)" : 5,
    "Dommages Eau" : 5,
    "(dommages Eau)" : 5,
    "Dommages Neutre" : 5,
    "(dommages Neutre)" : 5,
    "Dommages Feu" : 5,
    "(dommages Feu)" : 5,
    "Dommages Air" : 5,
    "(dommages Air)" : 5,
    "Dommages Pousée" : 5,
    "Dommages Pièges" : 5,
    "Arme de Chasse" : 5,
    "Tacle" : 4,
    "Fuite" : 4,
    "Prospection" : 3,
    "Sagesse" : 3,
    "Puissance (pièges)" : 2,
    "Puissance" : 2,
    "Résistance Terre": 2,
    "Résistance Eau" : 2,
    "Résistance Neutre" : 2,
    "Résistance Feu" : 2,
    "Résistance Air" : 2,
    "Résistance Critiques" : 2,
    "Résistance Poussée" : 2,
    "Force" : 1,
    "Intelligence" : 1,
    "Chance" : 1,
    "Agilité" : 1,
    "Pods" : 0.25,
    "Vitalité" : 0.2,
    "Initiative" : 0.1,
}



//Fonction pour extraire la data des items du json
function extractValues(itemIdToFind) {
    document.getElementById("ok").innerHTML = "IYRTDIYTRD";
    fetch('items.json') //on récupère le json
        .then(response => { //on regarde s'il s'ouvre correctement
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut : ${response.status}`); 
            }
            return response.json();
        })
        .then(data => { //on stocke la data
            var jsonValuesElement = document.getElementById("jsonValues");

            var inputCoef = document.getElementById("inputCoef").value; //on récupère la valeur du coef de brisage

            // Rechercher l'élément du tableau qui correspond au nom spécifié
            var selectedItem = data.find(item => item.name.toLowerCase() === itemIdToFind.toLowerCase());

            if (selectedItem) {
                var listItem = document.createElement("li");
                listItem.textContent = "";

                var tableau = "<tr><th>Rune</th><th>Sans Focus</th><th>Avec Focus</th></tr>"; //tableau et listes vides
                var listeStat1 = [];
                var listeStat2 = [];
                var notStat = 0;

                for (var key in selectedItem) { //boucle sur les éléments de l'item sélectionné
                    var stat1;
                    var stat2;
                    
                    if (key == "stats") { //on regarde dans les stats de l'item
                        for (let i=0;i<selectedItem["stats"].length;i++) {
                            var match = selectedItem["stats"][i].match(/(-?\d+)(?:\s*à\s*(-?\d+))?\s*(.*)/); //séparation des valeurs "x à x caractéristique"                      
                            if (match) {
                                var res1 = match[1]; //première valeur
                                var res2 = match[2] || null; //deuxième valeur (s'il y en a une)
                                var res3 = match[3]; //caractéristique
                                

                            } else {
                                console.log("Aucune correspondance trouvée."); //item non trouvé
                            }

                            if (res3.substr(0,1)!="(") { //Pour les armes principalement
                                if (res2 != null) { //cas avec deuxième valeur
                                    if (res3 == "Vitalité") {
                                        stat1 = parseFloat(((3 * res1 * 0.2 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                        stat2 = parseFloat(((3 * res2 * 0.2 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    }
                                    else if (res3 == "Pods") {
                                        stat1 = parseFloat(((3 * res1 * 0.25 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                        stat2 = parseFloat(((3 * res2 * 0.25 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    }
                                    else if (res3 == "Initiative") {
                                        stat1 = parseFloat(((3 * res1 * 0.1 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                        stat2 = parseFloat(((3 * res2 * 0.1 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    } else {
                                        stat1 = parseFloat(((3 * res1 * poids[res3] * selectedItem["level"] / 200 + 1)).toFixed(2));
                                        stat2 = parseFloat(((3 * res2 * poids[res3] * selectedItem["level"] / 200 + 1)).toFixed(2));                                   
                                    }

                                    if (res1 < 0) { //cas des effets négatifs (le brisage ne donne pas de runes)
                                        stat1 = 0;
                                        stat2 = 0;
                                    }
        
                                    listeStat1.push(stat1);
                                    listeStat2.push(stat2);
                                }
                                else if (res2 == null) { //cas sans deuxième valeur
                                    
                                    if (res3 == "Vitalité") {
                                        stat1 = parseFloat(((3 * res1 * 0.2 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    }
                                    else if (res3 == "Pods") {
                                        stat1 = parseFloat(((3 * res1 * 0.25 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    }
                                    else if (res3 == "Initiative") {
                                        stat1 = parseFloat(((3 * res1 * 0.1 * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    } else {
                                        stat1 = parseFloat(((3 * res1 * poids[res3] * selectedItem["level"] / 200 + 1)).toFixed(2));
                                    }
                                    
                                    if (res1 < 0) { //effets négatifs
                                        stat1 = 0;
                                        stat2 = 0;
                                    }
                                    stat2 = stat1;
                                    listeStat1.push(stat1);
                                    listeStat2.push(stat2);
                                }

                            } 
                            else if (res3.substr(0,1)=="(") {
                                notStat++;
                            }
                        }
                    }

                }

                for (i=notStat;i<selectedItem["stats"].length;i++) {

                    let sum1 = 0;
                    let sum2 = 0;
                    

                    var match = selectedItem["stats"][i].match(/(-?\d+)(?:\s*à\s*(-?\d+))?\s*(.*)/);    

                    if (match) {
                        var res1 = match[1];
                        var res2 = match[2] || null;
                        var res3 = match[3];
                    } else {
                        console.log("Aucune correspondance trouvée.");
                    }

                    for (j=notStat;j<selectedItem["stats"].length;j++) {
                        if (j!=i) {
                            sum1 += listeStat1[j-notStat];
                            sum2 += listeStat2[j-notStat];
                        }
                    }

                    var rune = "./assets/rune/" + res3 + ".png";

                    focus1 = listeStat1[i-notStat] + sum1 * 0.5; //calcul des stats avec focus
                    focus2 = listeStat2[i-notStat] + sum2 * 0.5;
                    if (listeStat1[i-notStat] == 0) {
                        focus1 = 0;
                    }
                    if (listeStat2[i-notStat] == 0) {
                        focus2 = 0;
                    }
                    
                    if (res3 == "Vitalité") {
                        tableau += "<tr><td>" + res3 + "<img src='"+ rune +"' height='20' width='20'/>" + "</td><td>" + parseFloat((listeStat1[i-notStat]*inputCoef/100).toFixed(2)) + " à " + parseFloat((listeStat2[i-notStat]*inputCoef/100).toFixed(2)) + " [ ~ " + parseFloat(((listeStat1[i-notStat] + listeStat2[i-notStat])/2*inputCoef/100).toFixed(2)) + " ]" + "</td><td>" + parseFloat(((focus1 * inputCoef / 100) / 1).toFixed(2)) + " à " + parseFloat(((focus2 * inputCoef / 100) / 1).toFixed(2)) + " [ ~ " + parseFloat(((focus1 + focus2)/2*inputCoef/100).toFixed(2)) + " ]" + "</td></tr>";
                    }
                    else if (res3 == "Pods") {
                        tableau += "<tr><td>" + res3 + "<img src='"+ rune +"' height='20' width='20'/>" + "</td><td>" + parseFloat((listeStat1[i-notStat]*inputCoef/100 ).toFixed(2))+ " à " + parseFloat((listeStat2[i-notStat]*inputCoef/100).toFixed(2)) + " [ ~ " + parseFloat(((listeStat1[i-notStat] + listeStat2[i-notStat])/2*inputCoef/100).toFixed(2)) + " ]" + "</td><td>" + parseFloat(((focus1 * inputCoef / 100) / 2.5).toFixed(2)) + " à " + parseFloat(((focus2 * inputCoef / 100) / 1).toFixed(2)) + " [ ~ " + parseFloat(((focus1 + focus2)/2*inputCoef/100).toFixed(2)) + " ]" + "</td></tr>";
                    }
                    else if (res3 == "Initiative") {
                        tableau += "<tr><td>" + res3 + "<img src='"+ rune +"' height='20' width='20'/>" + "</td><td>" + parseFloat((listeStat1[i-notStat]*inputCoef/100 ).toFixed(2)) + " à " + parseFloat((listeStat2[i-notStat]*inputCoef/100).toFixed(2)) + " [ ~ " + parseFloat(((listeStat1[i-notStat] + listeStat2[i-notStat])/2*inputCoef/100).toFixed(2)) + " ]" + "</td><td>" + parseFloat(((focus1 * inputCoef / 100) / 1).toFixed(2)) + " à " + parseFloat(((focus2 * inputCoef / 100) / 1).toFixed(2)) + " [ ~ " + parseFloat(((focus1 + focus2)/2*inputCoef/100).toFixed(2)) + " ]" + "</td></tr>";
                    }
                    else {
                        tableau += "<tr><td>" + res3 + "<img src='"+ rune +"' height='20' width='20'/>" + "</td><td>" + parseFloat((listeStat1[i-notStat] / poids[res3]*inputCoef/100).toFixed(2)) + " à " + parseFloat((listeStat2[i-notStat] / poids[res3]*inputCoef/100).toFixed(2)) + " [ ~ " + parseFloat((((listeStat1[i-notStat] + listeStat2[i-notStat])*inputCoef/100)/(2*poids[res3])).toFixed(2)) + " ]" + "</td><td>" + parseFloat(((focus1 * (inputCoef / 100)) / poids[res3]).toFixed(2)) + " à " + parseFloat(((focus2 * inputCoef / 100) / poids[res3]).toFixed(2)) + " [ ~ " + parseFloat(((focus1 + focus2)/2*inputCoef/100/poids[res3]).toFixed(2)) + " ]" + "</td></tr>";                   
                     }                                      
                } //création du tableau avec "nom carac" / "valeur sans focus" / "valeur avec focus"
                
                var tableElement = document.getElementById("attributsTable");
                tableElement.innerHTML = tableau;
                jsonValuesElement.innerHTML = ""; 


            } else {
                console.error(`Aucun élément trouvé avec le nom : ${itemIdToFind}`);
                var listItem = document.createElement("li");
                listItem.textContent = "";
                listItem.textContent = `Aucun élément trouvé avec le nom : ${itemIdToFind}`;
                jsonValuesElement.innerHTML = ""; // Effacer le contenu précédent
                jsonValuesElement.appendChild(listItem);
            }
        })
        .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
}

document.addEventListener("DOMContentLoaded", function () {
    var searchForm = document.getElementById("searchForm");
    var itemNameInput = document.getElementById("itemName");
    var autocompleteList = document.getElementById("autocomplete-list");
    var inputCoef = document.getElementById("inputCoef");
    var selectedItemId = null; // Ajout de cette variable pour suivre l'ID de l'item sélectionné

    itemNameInput.addEventListener("input", function () {
        var itemName = itemNameInput.value.toLowerCase();
        var suggestions = [];

        fetch('items.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                suggestions = data
                    .filter(item => item.name.toLowerCase().includes(itemName))
                    .map(item => ({
                        name: item.name,
                        imgPath: item.imgPath,
                        id: item.id,
                        level: item.level
                    }));
                updateAutocompleteList(suggestions);
            })
            .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
    });

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêcher la soumission par défaut du formulaire
        var itemName = itemNameInput.value;
        extractValues(itemName);
    });

    // Ajouter un écouteur d'événements pour l'événement 'input' sur l'input de coefficient
    inputCoef.addEventListener("input", function () {
        var itemName = itemNameInput.value;

        // Vérifier si un item est déjà sélectionné
        if (selectedItemId !== null) {
            extractValuesById(selectedItemId, inputCoef.value);
        } else {
            extractValues(itemName);
        }
    });

    // Ajouter un écouteur d'événements pour intercepter la touche Entrée dans le champ de saisie de l'item
    itemNameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Empêcher la soumission par défaut du formulaire
            var itemName = itemNameInput.value;
            selectedItemId = null; // Réinitialiser l'ID de l'item sélectionné
            extractValues(itemName);
        }
    });

    // Fonction pour mettre à jour la liste d'autocomplétion
    function updateAutocompleteList(suggestions) {
        autocompleteList.innerHTML = "";
    
        // Trie les suggestions par ordre alphabétique
        suggestions.sort((a, b) => a.name.localeCompare(b.name));
    
        suggestions.slice(0, 10).forEach(item => {
            var suggestionItem = document.createElement("div");
            var img = document.createElement("img");
            var itemName = document.createElement("span");
    
            img.src = "https://brifus.fr/assets/img/items/" + item.level + "/" + item.id + ".png";
            itemName.textContent = item.name;
    
            suggestionItem.appendChild(itemName);
            suggestionItem.appendChild(img);  
    
            suggestionItem.addEventListener("click", function () {
                itemNameInput.value = item.name;
                autocompleteList.innerHTML = "";
            });
    
            autocompleteList.appendChild(suggestionItem);
        });
    }
    

    // Fermer la liste d'autocomplétion lorsque l'utilisateur clique en dehors
    document.addEventListener("click", function (event) {
        if (event.target !== itemNameInput) {
            autocompleteList.innerHTML = "";
        }
    });
});





