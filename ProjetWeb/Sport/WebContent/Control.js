/**
 * A CHANGER C'EST CELUI DE L'EXEMPLE
 */
var pari = {
  coteTotal: 1
};

$(document).ready(function() {
	var compteCourant = null;
	var affichagePari = "";
	loadMain();
});

function loadMain() {
	$("#Main").load("Main.html", function() {
		$("#BTConnexion").click(function() {
			loadConnexion();
		});
		
		$("#BTVoirMatchs").click(function() {
			loadVoirMatchs();
		});
		
	});
}

function loadMainCompte() {
	$("#Main").load("mainCompte.html", function() {
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		
		
		$("#BTDeconnexion").click(function() {
			$("#ShowMessage").text("Deconnexion Reussie");
			compteCourant =null;                                                          
			loadMain();
		});
		
		$("#BTVoirMatchs").click(function() {
			loadVoirMatchs();
		});
		
		$("#BTParier").click(function() {
			loadParier();
		});
		
		$("#BTVoirSolde").click(function() {
			loadVoirSolde();
		});
		$("#BTVoirHistorique").click(function() {
			loadVoirHistorique();
		});
	});
}

function loadMainAdmin() {
	$("#Main").load("mainAdmin.html", function() {
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		
		$("#BTDeconnexion").click(function() {
			$("#ShowMessage").text("Deconnexion Reussie");
			compteCourant =null;    
			loadMain();
		});
		$("#BTVoirMatchs").click(function() {
			loadVoirMatchs();
		});
		
		$("#BTAddSport").click(function() {
			loadAddSport();
		});
		
		$("#BTAddEquipe").click(function() {
			loadAddEquipe();
		});
		
		$("#BTAddMatch").click(function() {
			loadAddMatch();
		});
		
		
		$("#BTListeCompte").click(function() {
			loadListCompte();
		});
		$("#BTModifMatch").click(function() {
			loadModifierMatch();
		});
	});
}




function loadConnexion() {
	$("#ShowMessage").empty();
	
	$("#Main").load("connexion.html", function() {
		var erreurMotDePasse = false;
		$("#BTValConnexion").click(function() {
			compte = {};
			compte.pseudo=$("#Pseudo").val();
			compte.mdp=$("#MDP").val();
			
			invokePost("rest/connexion", compte, "connexion réussie", "échec connexion",function(response) {
				CompteFind = response; 
				if(CompteFind == null || CompteFind.mdp !== compte.mdp){
					$("#ErrorConnexion").text("Pseudo inconnue ou mot de passe incorrect");
					erreurMosDePasse = true;
				}
				else{
					url = "rest/getcompte?pseudo=" + compte.pseudo;
					compteFind = invokeGet(url, "compte introuvable", function(response) {
						compteFind = response;
						console.log("compte connect "+ response);
						if(compteFind.droit == "ADMIN"){
							compteCourant=compteFind;
							loadMainAdmin();
						}
						else{
							compteCourant=compteFind;
							$("#ErrorConnexion").append("Pseudo inconnue ou mot de passe incorrect");
							loadMainCompte();
						}	
					
					});
					
				}
			});
		});
		
		$("#BTValInscription").click(function() {
			loadInscription();
		});
		if(!erreurMotDePasse) {
			$("#ErrorConnexion").text("");
		}
		
	});
	
}

function loadInscription(){
	
	$("#Main").load("inscription.html", function() {
		var erreurMotDePasse = false;
		$("#BTValOkInscription").click(function() {
			var password1 = $("#password1").val();
			var password2 = $("#password2").val();
		
			if(password1!=password2){
				$("#ErrorInscription").text("Les deux mot de passe ne correspondent pas");
				erreurMotDePasse = true; 				
			}
			
			else{
				compte = {};
				compte.pseudo =$("#login").val();
				compte.mdp=password1;
				invokePost("rest/getcompte",compte,"","",function(response){
					compteVerif = response;
					if(compteVerif==null){
						if(compte.pseudo =="admin"){
							url= "rest/addCompte?droit=1&solde=9999";
						}
						else{
							url= "rest/addCompte?droit=0&solde=2000";
						}
						
						
						invokePost(url, compte, "compte créé", "échec création compte");
						$("#ShowMessage").text("Vous êtes incrits vous pouvez vous connecter! ");
						loadMain();
					}
					
					else{
						$("#ErrorInscription").empty();
						$("#ErrorInscription").text("Le pseudo existe déjà ");
					}
					
				});
	
				}				
			
		});
		if(!erreurMotDePasse) {
			$("#ErrorInscription").text("");
		}
	});
}


function loadListCompte(){
	
	
	$("#Main").load("voirCompte.html", function() {
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		listCompte = invokeGet("rest/listcompte", "failed to list compte", function(response) { 
			listeCompte = response;
			
			list= "<table><tr><th>Compte</th><th>Rôle</th><th>Solde</th><th>Action</th></tr>";
			
			for(var i = 0;i<listeCompte.length ;i++){
				list+="<tr>";
			    list+="<td>"+listeCompte[i].pseudo +"</td>";
			    list+="<td>"+ listeCompte[i].droit +"</td>";
			    list+="<td>"+ listeCompte[i].solde.credit +"</td>";
			    if(listeCompte[i].pseudo=="admin"){
			    	list += "<td>SuperUtilisateur, rôle non modifiable</td>";
			    }
			    else{
			    	 list += "<td><button onclick='changeTypeCompte(\"" + listeCompte[i].pseudo + "\")'>Changer le rôle compte</button></td>";
			    }
			   
			    list+="</tr>"
				
			}
			
			list+="</table>";
			
			$("#tabCompte").empty();
			$("#tabCompte").append(list);
			
			
			
			
		});
	
		$("#BTAdmin").click(function() {
			loadMainAdmin();
		});
	
	});
	
}
function changeTypeCompte(pseudo) {
	   console.log(pseudo);
	   url = "rest/changeCompte?pseudo="+pseudo+"";
	   invokePost(url, "failed to getCompte", function(response) {
	   		});
	   message =" Le rôle du compte de"+pseudo+" a bien était modifié.<br>"
	   $("#MessageChangementCompte").empty();
	   $("#MessageChangementCompte").append(message);
	   loadListCompte();
	}
	
	

function loadAddMatch() {
	$("#ShowMessage").empty();
	$("#ErrorSport").empty();
	$("#ErrorEquipe").empty();
	
	$("#Main").load("ajoutMatch.html", function() {
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		listSport = invokeGet("rest/listsports", "failed to list sport", function(response) {
			//if (listSport == null){
			//	loadAddSport();
			//}
			listSport = response;
			list="<option value ='ok' > -- Veuillez sélectionner un Sport--</option>";
			for (var i=0; i < listSport.length; i++) {
				var sport = listSport[i];					
				list+="<option value = '"+sport.nom+"'>"+ sport.nom+"</option>";
			}
			
			$("#sport-select").empty()
			$("#sport-select").append(list);
			
			
			
				
		});
		
		$("#BTSportSelect").click(function() {
			
			var equipeList;
			var sport = $("#sport-select").val();
			if(sport=='ok'){
				$("#ErrorSport").text("Vous devez sélectionnner un sport");
			}
			else {
				$("#ErrorSport").empty();
				var url = "rest/listequipeSport?sportName="+sport;
				$("#MessageSportSelected").empty();
				$("#MessageSportSelected").append("<h3>Vous pouvez sélectionner une équipe domicile et une équipe extérieur.</h3>");
				var form2 ="";
				form2 += "<label for='domicile-select '> Equipe Domicile :</label>"
				form2 += "<select name ='sports' id='domicile-select' >";
				equipeList = invokeGet(url, "Failed to list teams", function(response) {
					
					var equipeList= response;
					
					for (var i=0; i<equipeList.length; i++) {
						var equipe = equipeList[i];	
						console.log(equipe);
						form2+="<option value = '"+equipe.nom+"'>"+ equipe.nom+"</option>";
					}
					
					
					form2+=" </select> <br>";
					form2 += "<label for='exterieur-select '> Equipe Extérieur :</label>"
					form2 += "<select name ='sports' id='exterieur-select' >";
					for (var i=0; i<equipeList.length; i++) {
						var equipe = equipeList[i];					
						form2+="<option value = '"+equipe.nom+"'>"+ equipe.nom+"</option>";
					}
					form2+= "<br>";
					$("#SelectionEquipe").empty();
					$("#SelectionEquipe").append(form2);
					$("#BTEquipeSelect").prop("disabled", false);
					$("#Resultat").load("choixResult.html");
				
				});
			}
			
		});
		
		
		$("#BTAdmin").click(function() {
			loadMainAdmin();
		});
		  
		$("#BTEquipeSelect").click(function() {
			if( $("#domicile-select").val() ==null ||  $("#exterieur-select").val()==null || $("#domicile-select").val() == $("#exterieur-select").val()){
				$("#ErrorEquipe").html("Vous devez sélectionnner des équipes valides et différentes <br>");
			}else{
				match={};
				resultat = $("input[name='resultat']:checked").val();
				score1 = $("#scoreDomicile").val();
				score2 = $("#scoreExterieur").val();
				coteDom = $("#coteDomicile").val();
				coteNul = $("#coteNul").val();
				coteExt = $("#coteExterieur").val();
				
				if(!$.isNumeric(score1) || !$.isNumeric(score2) ||!$.isNumeric(coteDom) || !$.isNumeric(coteNul) || !$.isNumeric(coteExt) ){
					$("#ErrorEquipe").html("Veuillez saisir des valeurs numériques dans cote et score <br>");
				}
				else{
					$("#ErrorEquipe").empty();
					cote = {}
					cote.v1 = coteDom; 
					cote.v2 = coteExt;
					cote.nul = coteNul;
					var idCote;
					var idMatch;
					invokePost("rest/addCoteAndGetCote", cote, "cote ajouté", "échec ajout",function(response){
						console.log(response);
						idCote = response.id;
						console.log(idCote);
						url = "rest/addmatch?result="+resultat+'&score1=' + score1 + '&score2=' + score2;
						invokePost(url, match, "", "Echec",function(response){
							idMatch = response.id;
							ass= {};
							ass.equipeDom = $("#domicile-select").val();
							ass.equipeExt = $("#exterieur-select").val();
							ass.idMatch= idMatch;
							
							invokePost("rest/associerEquipeMatch",ass,"","");
							setTimeout(function() {
							    console.log("Après la pause de 0,2 seconde");
							}, 200);
							console.log(idCote);
							console.log(idMatch);
							ass ={};
							ass.idCote = idCote; 
							ass.idMatch = idMatch;
							invokePost("rest/associerMatchCote",ass,"","");
							listmatchs = invokeGet("rest/listmatchs", "failed to list match", function(response) {
								console.log(response);	
								listmatchs = response;
							}); 
					
					
					});
					
						
					});
				}	
			}
		});
		
		
	
	});
	
}

function afficheEquipe(list){
	
	listEquipe = "";
	listEquipe+="<h3> Equipe déjà existantes  :</h3>";
	listEquipe+="<ul>";
	for (var i =0; i<list.length; i++ ){
			listEquipe+="<li>"+list[i].nom+"</ li>";
	}
	listEquipe+="<ul>";
		
	$("#ListEquipe").empty();
	$("#ListEquipe").append(listEquipe);
	
}

function afficheSport(list){
	
	listSport = "";
	listSport+="<h3> Sport déjà existants  :</h3>";
	listSport+="<ul>";
	for (var i =0; i<list.length; i++ ){
			listSport+="<li>"+list[i].nom+"</li>";
	}
	listSport+="<ul>";
		
	$("#ListSport").empty();
	$("#ListSport").append(listSport);
	
}




function loadAddSport() {
	$("#ShowMessage").empty();
	
	$("#Main").load("ajoutSport.html", function() {
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		var erreurSport = false;
		
		list = invokeGet("rest/listsports","",function(response){
			afficheSport(response);
		});
		
		$("#BTAddSport").click(function() {
			sport = {};
			sport.nom=$("#newSport").val();
			invokePost("rest/getsport", sport, "", "",function(response) {
				sportFind = response; 
				if(sportFind == null){
					invokePost("rest/addsport", sport, "sport ajouté", "échec ajout");
					$("#ErrorSport").text("Vous avez bien ajouté le sport: " +sport.nom );
					list = invokeGet("rest/listsports","",function(response){
						afficheSport(response);
					});
				}
				else{
					erreurSport = true; 
					$("#ErrorSport").text("Le sport ajouté existe déjà.");
				}
				
			});
			
		});
		
		$("#BTAdmin").click(function() {
				loadMainAdmin();
			});
		
		if(!erreurSport){
			$("#ErrorSport").text("");
		}
	});

}

function loadAddEquipe() {
	$("#ShowMessage").empty();
	
	$("#Main").load("ajoutEquipe.html", function() {
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		var erreurEquipe = false;
		var list;
		listSport = invokeGet("rest/listsports", "failed to list sport", function(response) {
			//if (listSport == null){
			//	loadAddSport();
			//}
			listSport = response;
			list="<option value ='ok' > -- Veuillez sélectionner un Sport--</option>";
			for (var i=0; i < listSport.length; i++) {
				var sport = listSport[i];					
				list+="<option value = '"+sport.nom+"'>"+ sport.nom+"</option>";
			}
			
			$("#sport-select").empty()
			$("#sport-select").append(list);
			
			list = invokeGet("rest/listequipe","",function(response){
				afficheEquipe(response);
			});
			
		
			
				
		});
		
		
		$("#BTAddEquipe").click(function() {
			var sport;
			var nomEquipe = $("#nomEquipe").val();
			if($("#sport-select").val()=='ok'){
				$("#ErrorEquipe").text("Vous devez sélectionnner un sport");
			}
			else{
				
			
			equipe = {};
			equipe.nom=nomEquipe;
			invokePost("rest/getequipe", equipe, "", "",function(response) {
				equipeFind = response; 
				
				if(equipeFind == null){
						invokePost("rest/addequipe", equipe, "equipe ajouté", "échec ajout");
						ass= {};
						ass.equipeName = nomEquipe;
						ass.sportName = $("#sport-select").val();
						invokePost("rest/associateEquipeSport", ass, "association was created", "failed to create association");
						$("#ErrorEquipe").text("L'équipe "+nomEquipe+" a bien été ajouté");
						list = invokeGet("rest/listequipe","",function(response){
							afficheEquipe(response);
						});
				
				}
				else{
					erreurEquipe = true; 
					$("#ErrorEquipe").text("L'equipe existe déjà.");
				}
				
			});
			}
			
		});
		
		$("#BTAdmin").click(function() {
			loadMainAdmin();
		});
		
		if(!erreurEquipe){
			$("#ErrorEquipe").text("");
		}
		
	});

}

function afficherMatchs(listMatchs){
	
	var listTermine="<h3> Match termine </h3>";
	var listAvenir="<h3> Match à venir </h3>";
	
	var sportCourant =null; 
	// Fonction qui traite chaque appel GET d'en dessous
	var handleResponse = function(equipes,match) {
		if  (equipes[0].sport.nom!=sportCourant){
			if(sportCourant !=null){listTermine += "</ul>";
									listAvenir+= "</ul>"}
			sportCourant=equipes[0].sport.nom;
			listTermine+= "<h3>"+ equipes[0].sport.nom +"</h3>";
			listAvenir+= "<h3>"+ equipes[0].sport.nom +"</h3>";
			listTermine+= "<ul>";
			listAvenir+= "<ul>";
			
		}
		
		switch(match.resultat){
		
			case "AVANT":
				listAvenir+= "<li class ='match-item'>"+ "<button class='cote-button' data-equipe="+equipes[0].nom+" data-cote="+match.cote.v1+">";
			    listAvenir+= "<span class='equipe-nom'>"+equipes[0].nom+ "</span><br>";
			    listAvenir+= "<span class='cote-valeur'>"+match.cote.v1 +"</span>";
			    listAvenir+="</button>";
			    
			    listAvenir += "<button class='cote-button' data-equipe='nul'  data-cote="+match.cote.nul+">";
			    listAvenir+= "<span class='equipe-nom'> nul </span>"+"<br>";
			    listAvenir+= "<span class='cote-valeur'>"+match.cote.nul+"</span>" ;
			    listAvenir+="</button>";
			    
			    listAvenir+="<button class='cote-button'  data-equipe="+equipes[1].nom+" data-cote="+match.cote.v2+">";
			    listAvenir+= "<span class='equipe-nom'>"+equipes[1].nom+"</span><br>";
			    listAvenir+= "<span class='cote-valeur'>"+match.cote.v2+"</span>";
			    listAvenir+="</button>";
			    
			    
			    listAvenir+="</li>"
			    
				//list += "<li>"+equipes[0].nom +" - "+ equipes[1].nom   +"</li>";
				break;
			
			case "DOMICILE":
				listTermine+="<li>" + equipes[0].nom + " "+"<span class='green'>"+ match.score1+"</span> - "+"<span class='red'>"+ match.score2+"</span> " + equipes[1].nom  +"</li>";
				break;
			
			case "EXTERIEUR" :
				listTermine+="<li>" + equipes[0].nom + " "+"<span class='red'>"+ match.score1+"</span> - "+"<span class='green'>"+ match.score2+"</span> " + equipes[1].nom  +"</li>";
				break;
			
			case "NUL":
				listTermine += "<li>" + equipes[0].nom + " "+ "<span class='gras'>"+match.score1+"</span> - "+"<span class='gras'>"+ match.score2 +"</span> "+ equipes[1].nom  +"</li>";
				break;
		}
		
		if (listAvenir.split("</li>").length + listTermine.split("</li>").length -2  == listMatchs.length) {
			listAvenir+="</ul>";
			listTermine+="</ul>";
			$("#ListeMatchsTermine").empty();
			$("#ListeMatchsAvenir").empty();
			$("#ListeMatchsTermine").append(listTermine);
			$("#ListeMatchsAvenir").append(listAvenir);
			console.log(listTermine);
			console.log(listAvenir);
		}
	    
	};
	
	listMatchs.forEach(function(match) {
        var url = "rest/equipeDom?idMatch=" + match.id;
        invokeGet(url, "", function(equipes) {
            handleResponse(equipes, match);
        });
    });
	
	
	$("#ListeMatchsTermine").empty();
	$("#ListeMatchsTermine").append(listTermine);
	$("#ListeMatchsAvenir").empty();
	$("#ListeMatchsAvenir").append(listAvenir);
	console.log(listTermine);
	console.log(listAvenir);
}


function afficherMatchParie(listMatchs){
	
	list="";
	var sportCourant =null; 
	console.log("passage afficherMatchParie");
	
	// Fonction qui traite chaque appel GET d'en dessous
	var handleResponsee = function(equipes,match) {
		if  (equipes[0].sport.nom!=sportCourant){
			if(sportCourant !=null){list+= "</ul>";
									}
			sportCourant=equipes[0].sport.nom;
			list+= "<h3>"+ equipes[0].sport.nom +"</h3>";
			list+= "<ul>";
			
		}
		list+= "<li class ='match-item'>"+ "<button class='cote-button' data-equipe="+equipes[0].nom+" data-cote="+match.cote.v1+" data-match="+match.id +" data-estimation='V1'"+">";
	    list+= "<span class='equipe-nom'>"+equipes[0].nom+ "</span><br>";
	    list+= "<span class='cote-valeur'>"+match.cote.v1 +"</span>";
	    list+="</button>";
	    
	    list += "<button class='cote-button' data-equipe='nul'  data-cote="+match.cote.nul+" data-match="+match.id +" data-estimation='NUL'"+">";
	    list+= "<span class='equipe-nom'> nul </span>"+"<br>";
	    list+= "<span class='cote-valeur'>"+match.cote.nul+"</span>" ;
	    list+="</button>";
	    
	    list+="<button class='cote-button'  data-equipe="+equipes[1].nom+" data-cote="+match.cote.v2+" data-match="+match.id +" data-estimation='V2'"+">";
	    list+= "<span class='equipe-nom'>"+equipes[1].nom+"</span><br>";
	    list+= "<span class='cote-valeur'>"+match.cote.v2+"</span>";
	    list+="</button>";
	    
	    list+="</li>";
	    if (list.split("</li>").length -1  == listMatchs.length) {
			list+="</ul>";
			$("#listMatchsPari").empty();
			$("#listMatchsPari").append(list);
			console.log("Fin");
			console.log(list);
		}
		
	    
	};
	
	listMatchs.forEach(function(match) {
        var url = "rest/equipeDom?idMatch=" + match.id;
        invokeGet(url, "", function(equipes) {
            handleResponsee(equipes, match);
        });
    });
	
	$("#listMatchsPari").empty();
	$("#listMatchsPari").append(list);
	
	
}
function afficherMatchsTab(listMatchs){
	console.log("debutMatchsTab");
	list="<table>";
	list+="<tr><th>Domicile</th><th>Extérieur</th><th>Score Domicile</th><th>Score Extérieur</th> <th>Sport</th>  <th>Cote </th> <th>Résultat</th> <th>Action</th>  </tr>";
	
	// Fonction qui traite chaque appel GET d'en dessous
	var handleResponsee = function(equipes,match) {
		console.log("ok passage");
		list+= "<tr>";
		list+= "<td>"+equipes[0].nom+ "</td>";
		list+= "<td>"+ equipes[1].nom+"</td>";
		list+= "<td>"+ match.score1+"</td>";
		list+= "<td>"+ match.score2+"</td>";
		list+= "<td>"+ equipes[0].sport.nom  +"</td>";
		
		if(match.resultat=="AVANT"){
			list+="<td>"+match.cote.v1+"|"+match.cote.nul+"|"+match.cote.v2+ "</td>";
			list+= "<td> A VENIR </td>";
		}
		else{
			list+="<td> //// </td>";
			list+= "<td>"+ match.resultat +"</td>";
		}
		
		list+= "<td><button onclick='loadModifMatch(\"" + match.id + "\",\"" + equipes[0].sport.nom + "\",\"" + equipes[0].nom + "\",\"" + equipes[1].nom + "\",\"" + match.score1 + "\",\"" + match.score2 + "\",\"" + match.resultat + "\",\"" + match.cote.v1 + "\",\"" + match.cote.v2+ "\",\"" + match.cote.nul + "\")'> Modifier match</button></td>";
		list+="</tr>";
		console.log(list);
		
		if (list.split("</tr>").length - 2 == listMatchs.length) {
			console.log("passage /table");
			list+="</table>";
			$("#tabMatch").empty();
			$("#tabMatch").append(list);
			}
	    
	};
	
	listMatchs.forEach(function(match) {
        var url = "rest/equipeDom?idMatch=" + match.id;
        invokeGet(url, "", function(equipes) {
            handleResponsee(equipes, match);
        });
    });
	

	
	$("#ListeMatchs").empty();
	$("#ListeMatchs").append(list);
}


function loadModifMatch(id_match,sport_nom,equipeDom_nom,equipeExt_nom,score1,score2,etat,v1,v2,nul){
	$("#ErrorEquipe").empty();
	$("#Main").load("modifierUnMatch.html", function() {
		
		$("#soldeValue").empty();
		if(typeof compteCourant !== 'undefined' ){
			if(compteCourant!=null){
				$("#soldeValue").append(compteCourant.solde.credit); 
			}
			
		}
		
		var listDomicile = "";
		listDomicile+="<option value = '"+equipeDom_nom+"'>"+ equipeDom_nom+"</option>";
		var listExterieur = "";
		listExterieur+="<option value = '"+equipeExt_nom+"'>"+equipeExt_nom+"</option>";
		var sport = sport_nom;
		$("#scoreDomicile").val(score1)
		$("#scoreExterieur").val(score2)
		$("#coteDomicile").val(v1)
		$("#coteExterieur").val(v2)
		$("#coteNul").val(nul)
		
		
		switch(etat){
		case"AVANT" : $("input[name='resultat']").prop("checked", false);
					  $("input[value='avant']").prop("checked", true);
					  break;
		case"DOMICILE" : $("input[name='resultat']").prop("checked", false);
						$("input[value='domicile']").prop("checked", true);
						break;
		case"EXTERIEUR" : $("input[name='resultat']").prop("checked", false);
						  $("input[value='ext']").prop("checked", true);
						break;
		case"NUL" : 	$("input[name='resultat']").prop("checked", false);
		  				$("input[value='nul']").prop("checked", true);
						break;
			
		
		
		}
		var url = "rest/listequipeSport?sportName="+sport;
		console.log(url);
		equipeList = invokeGet(url, "Failed to list teams", function(response) {
			
			var equipeList= response;
			console.log(response);
			for (var i=0; i<equipeList.length; i++) {
				var equipe = equipeList[i];	
				if(equipe.nom!=equipeDom_nom){
					listDomicile+="<option value = '"+equipe.nom+"'>"+ equipe.nom+"</option>";
				}
				if(equipe.nom!=equipeExt_nom){
					listExterieur+="<option value = '"+equipe.nom+"'>"+ equipe.nom+"</option>";
				}
				
			
			}
			console.log(listDomicile);
			console.log(listExterieur);
			
			$("#equipeDom-select").empty()
			$("#equipeDom-select").append(listDomicile);
			
			
			$("#equipeExt-select").empty()
			$("#equipeExt-select").append(listExterieur);
		});
		
		
		$("#BTModificationMatch").click(function() {
			equipe1 = $("#equipeDom-select").val();
			equipe2 =  $("#equipeExt-select").val();
			etat_match =  $("input[name='resultat']:checked").val();
			score1 = $("#scoreDomicile").val();
			score2 = $("#scoreExterieur").val();
			cotev1 = $("#coteDomicile").val();
			cotev2 = $("#coteExterieur").val();
			cotenul=$("#coteNul").val();
			if(!$.isNumeric(score1) || !$.isNumeric(score2) ||!$.isNumeric(cotev1) || !$.isNumeric(cotev2) || !$.isNumeric(cotenul)){
				$("#ErrorEquipe").html("Veuillez saisir des valeurs numériques dans cote et score <br>");
			}
			else{
				$("#ErrorEquipe").empty();
				url = "rest/modifMatch?dom="+equipe1+"&ext="+equipe2+"&etat="+etat_match+"&score1="+score1+"&score2="+score2+"&v1="+cotev1+"&v2="+cotev2+"&nul="+nul+"&id_match="+id_match;
				invokePost(url,"",function(response){
					console.log(response);
					loadModifierMatch();
					
				});
			}
			
			
				
			
		});
		
		
		$("#BTAdmin").click(function() {
			loadModifierMatch();
			
		});
	});
	
	
}

function loadVoirMatchs() {
	$("#ShowMessage").empty();
	
	$("#Main").load("listeMatchs.html", function() {
		var list = "";
		$("#soldeValue").empty();
		if(typeof compteCourant !== 'undefined' )
			{
			if(compteCourant!=null){
				$("#soldeValue").append(compteCourant.solde.credit); 
			}
			
	  }
		
		
		
		listSport = invokeGet("rest/listsports", "failed to list sport", function(response) {
			listSport = response;
			list="<option value ='tous' > -- Tous les Sports--</option>";
			for (var i=0; i < listSport.length; i++) {
				var sport = listSport[i];					
				list+="<option value = '"+sport.nom+"'>"+ sport.nom+"</option>";
			}
	
			
			$("#sport-select").empty();
			$("#sport-select").append(list);
		});
		
		
		
		listMatchs = invokeGet("rest/listmatchs", "failed to list matchs", function(response) {
			
			//var list;
			listMatchs = response;
			console.log(response);
			if (listMatchs == null) return;
			else{
				afficherMatchs(listMatchs);
			}
		
		});
		

		$("#BTSelectMatch").click(function() {
			var sport = $("#sport-select").val();
			var etat =  $("#match-select").val();
		
			console.log(sport);
			console.log(etat)
			if(sport!="tous" || etat!="TOUS"){
				var url = "rest/getMatchSport?sportName="+sport+"&etat="+etat;
				invokeGet(url, "", function(response){
					console.log(response);
					afficherMatchs(response);
				});
			}
			
			
			else{
				var url = "rest/listmatchs";
				invokeGet(url, "", function(response){
					afficherMatchs(response);
					
				});
			}
				
				
		});
		
		
		$("#BTAdmin").click(function() {
			
			if(typeof compteCourant == 'undefined' ){
				loadMain();
			}
			else{ 
				
				if(compteCourant==null){
					loadMain();
				}
				else{
					if (compteCourant.droit=="ADMIN"){
						loadMainAdmin();
						
					}
					else{
						loadMainCompte();
					}
				} 			
				
			}
			
		});
	});
}


function loadModifierMatch(){
	$("#Main").load("modifierMatch.html", function() {
		
		$("#soldeValue").empty();
		$("#soldeValue").append(compteCourant.solde.credit);
		listMatchs = invokeGet("rest/listmatchs", "failed to list matchs", function(response) {
			var list;
			listMatchs = response;
			console.log(response);
			if (listMatchs == null) return;
			else{
				afficherMatchsTab(listMatchs);
			}
		
		});
		
		
		
		
		$("#BTAdmin").click(function() {
			loadMainAdmin();
			
		});
	});
	
	
}


function loadVoirSolde(){
	$("#ShowMessage").empty();
	$("#soldeValue").append(compteCourant.solde.credit);
	$("#Main").load("solde.html", function() {
		$("#soldeValue").empty(); 
		$("#soldeValue").append(compteCourant.solde.credit); 
		textSolde = "<h3> Vous disposez actuellement de "+ compteCourant.solde.credit  +" pièces </h3>"
		$("#Solde").append(textSolde);
		
		$("#BTAdmin").click(function() {
			loadMainCompte();
			
		});
		
		$("#Debiter").click(function() {
			loadDebiter();
			
		});
		
		
		$("#Crediter").click(function() {
			loadCrediter();
			
		});
		
	
	
	});
}

function loadDebiter(){
	$("#Main").load("debiter.html", function() {
		$("#soldeValue").empty(); 
		$("#soldeValue").append(compteCourant.solde.credit);
		
		var inputPiece=$("#nombre_piece");
		var inputEuros=$("#euros");
		
		inputEuros.on("input", function() {
		    var nombreEuros = parseInt(inputEuros.val());
		    inputPiece.val((nombreEuros *100).toString());
		});
		
		
		inputPiece.on("input", function() {
		    var nombrePiece = parseInt(inputPiece.val());
		    inputEuros.val((nombrePiece /100).toString());
		});
		
		
	    $("#validerDebit").click(function() {
	    	console.log("ok clique");
			nbPiece = parseInt(inputPiece.val());
			if( !$.isNumeric(nbPiece) || !$.isNumeric(nbEuros) || nbPiece>compteCourant.solde.credit|| nbPiece<0){
				$("#errorDebit").text("Vous devez saisir un nombre de pièce inférieur à ce que vous possédez");
			}
			else{
				url = "rest/debiter?pseudo="+compteCourant.pseudo+"&valeur="+nbPiece;
				invokeGet(url,"Problème dans le débit",function(response){
					compteCourant = response; 
					loadVoirSolde();
				
				});

				
			}
			
			});	
		   
		    
		    
		    $("#BTAdmin").click(function() {
				loadVoirSolde();
				
		    });	

		
	
	
		});

}






function loadCrediter(){
	
	$("#ShowMessage").empty();
	
	$("#Main").load("crediter.html", function() {
		
		$("#ErrorCredit").empty();
		$("#soldeValue").empty(); 
		$("#soldeValue").append(compteCourant.solde.credit);
		
		var inputPiece=$("#nombre_piece");
		var inputEuros=$("#euros");
		
		inputPiece.on("input", function() {
		    var nombrePiece = parseInt(inputPiece.val());
		    
		    inputEuros.val((nombrePiece /100).toString());
		  
		 });
		
		
		$("#validerCredit").click(function() {
			nbPiece = parseInt(inputPiece.val());
			nbEuros =  parseInt(inputEuros.val())
			if( !$.isNumeric(nbPiece) || !$.isNumeric(nbEuros)|| nbPiece <0  ){
		    	$("#ErrorCredit").html("Vous devez saisir un nombre de pièce positive <br>");
		    }
		    else{
		    	loadPaiment(nbPiece,nbEuros);
		    }
			
			
		});	
		
	
		$("#BTAdmin").click(function() {
			loadVoirSolde();
			
		});	
		
		
	});
	
	
}


function loadPaiment(nbPiece,nbEuros){
	$("#Main").load("paiement.html", function() {
		$("#ErrorPaiement").empty(); 
		messageRecap="<h3> Paiement pour l'achat de "+nbPiece+" pièces d'une valeur de "+nbEuros+"€</h3>";
		$("#recapitulatif").append(messageRecap);
		
		
		$("#paiement").submit(function(event) {
			event.preventDefault();
		    var codeCarte = $("#numeroCarte").val();
		    var dateExpiration = $("#dateExpiration").val();
		    var cvv = $("#cvv").val();
		    var formatAttendu = /^\d{2}\/\d{2}$/;
		    if (!$.isNumeric(cvv) || !$.isNumeric(codeCarte) || codeCarte.length != 16 || cvv.length != 3 ){
		    	$("#ErrorPaiement").empty(); 
				$("#ErrorPaiement").html("Paiement refusé votre carte n'est pas valide veuillez réessayer <br>"); 
			}
			else{
				
				url="rest/creditCompte?pseudo="+compteCourant.pseudo+"&creditValue="+nbPiece;
			    compte = compteCourant;
			    console.log(url);
			    invokeGet(url,"erreur paiement",function(response){
			    	compteCourant = response;
					loadVoirSolde();
			    
			    });
				
			}
		    

		    
		    
		    
		    

		});
	
		$("#BTAdmin").click(function() {
			loadCrediter();
			
		});	
	
	});
}

// idMatch correspond à l'id du match , value (v1,v2 ou nul) utilisé quand clique sur voirMatch
function loadParier(idMatch,value){
	
	
}
// utilisé quand clique sur bouton voirParier
function loadParier(){
	var pariListe = [];
	$("#Main").load("parier.html", function() {
		
		
		$("#soldeValue").empty(); 
		$("#soldeValue").append(compteCourant.solde.credit);
		pariListe=[];
		var url = "rest/getMatchSport?sportName=tous&etat=FUTUR";
		invokeGet(url, "", function(response){
			console.log(response);
			afficherMatchParie(response);
		});
		
		
		$(document).off('click', '.cote-button').on('click', '.cote-button', function() {
			
			console.log("appuie bouton");
		    var cote = $(this).data('cote');
		    var equipe = $(this).data('equipe');
		    var estimation = $(this).data('estimation');
		    var idMatch = $(this).data('match');
		   
		    var equipes;
		    var pari;
		    parielem={}
		    parielem.coeff=cote;
		   
		    var url2 = "rest/addPariElementaire?idMatch="+idMatch+"&estimation="+estimation;
		    
		    
		    invokePost(url2, parielem , " ", " ", function(response){
		    	pariListe.push(response.id);
		    	console.log(pariListe);
		    	//afficherPari(cote,equipe,idMatch,equipes);
		   
		    	var url1 = "rest/equipeDom?idMatch="+idMatch;
		    	/*setTimeout(function() {
				    console.log("Après la pause de 0,2 seconde");
				}, 200);*/
			    invokeGet(url1,"", function(response){
			    	equipes=response;
			    	afficherPari(cote,estimation,idMatch,equipes);
			   
			    });
		    
		    });
		    
		    
		});
		
		
		$("#BTValPari").click(function() {
			$("#ErrorPiece").empty();
			var inputPiece=$("#nombre_piece");
			var nombrePiece = inputPiece.val();
			if(nombrePiece>compteCourant.solde.credit || nombrePiece<=0 || !$.isNumeric(nombrePiece)){
				$("#ErrorPiece").text("Votre pari ne peut pas être validé car vous n'avez pas assez de pièce ou vous avez sélectionnner une valeur négative");
			}
			
			else{
				var coeffTot = 0 ; 
				
				var pariCombine;
				var pariCombineID;
				
				pariCombine = {};
				pariCombine.mise=nombrePiece;
			
				
				
				invokePost("rest/addGetPari",pariCombine,"","",function(response){
					console.log(response);
					pariCombineID= response.id;
					setTimeout(function() {
					    console.log("Après la pause de 0,2 seconde");
					}, 200);
					var tabIdParis = pariListe.join(",");
					url = "rest/addPariElem?pseudo="+ compteCourant.pseudo+"&idPari="+pariCombineID+"&idPariElems="+encodeURIComponent(tabIdParis);
					console.log(pariCombineID);
					console.log(pariListe);
					setTimeout(function() {
					    console.log("Après la pause de 0,2 seconde");
					}, 200);
					invokePost(url,{}," ", " ", function(response){
						compteCourant= response;
						pari.coteTotal=1;
						$("#Lepari").text("Vos Paris :");
						
						
					});  
					
					
				});
			}
			
			
			
			
		});	
	
		$("#BTAdmin").click(function() {
			pari.coteTotal=1;
			loadMainCompte();
			
		});	
		
	});
	
	
}

function afficherPari(cote,estimation,idMatch,equipes){
	//var coteTotal =1;
	var affichagePari ="";
	console.log("passage affichePari");
	invokeGet("rest/getMatch?id="+idMatch,"",function(response){
		match = response; 
		
		affichagePari+= "Pari sur le match "+ equipes[0].nom+" - " +equipes[1].nom+"<br>";
		switch(estimation){
			case "V1" : affichagePari += "Victoire "+ equipes[0].nom +" "+ cote+ "<br> <br>";
						break;
			case "V2" : affichagePari += "Victoire "+ equipes[1].nom +" "+ cote+ "<br> <br>";
						break;
			case "NUL" : affichagePari += "Match nul"+" "+ cote + "<br> <br>";
						break;
		
		}
		pari.coteTotal = pari.coteTotal*parseFloat(cote);
		//$("#Lepari").text("Vos paris : "+"<br>");
		$("#Lepari").append(affichagePari);
		$("#coteTotal").empty();
		$("#coteTotal").append("Cote total = "+pari.coteTotal);
		
		
	} );
	
	
	
	
}


function affichagePari(pari){
	console.log(pari);
	affichage = "";
	
	
	switch(pari.resultat){
	
		case "AVANT"	: 
			affichage += "<h4>      PARI       </h4> <br>";
			affichage += "La cote total est de "+ pari.coeff+ "<br>";
			affichage += "Votre mise est de " + pari.mise + "<br>";
			affichage += "Vous pouvez gagner "+ parseFloat(pari.coeff)* parseFloat(pari.mise)+"<br><br>";
			affichage += "<h4> Matchs associé à ce pari </h4>"
			 break;
		
		case  "VALIDE" :  
			affichage += "Vous avez gagné ce pari ! : <br>";
			affichage += "La cote total etait de "+ pari.coeff+ "<br>";
		    affichage += "Votre mise etait de " + pari.mise + "<br>";
			affichage += "Vous avez gagné <span style='color: green'>"+ parseFloat(pari.coeff)* parseFloat(pari.mise)+"</span><br><br>";
			affichage += " <h4> Matchs associé au pari</h4> "
			break;
			
		
		case  "INVALIDE" :
			affichage += "Vous perdu ce pari... : <br>";
			affichage += "La cote total etait de "+ pari.coeff+ "<br>";
			affichage += "Votre mise etait de " + pari.mise + "<br>";
			affichage += "Vous avez perdu <span style='color: red'>"+ parseFloat(pari.coeff)* parseFloat(pari.mise)+"</span><br><br>";
			affichage += " <h4> Matchs associé au pari</h4> "
			break;
		}
	
	
	
	for(var i = 0; i<pari.paris.length; i++){
		(function(index) {
		var url = "rest/getMatchPari?id="+pari.paris[index].id;
		var match; 
		var equipes;
		invokeGet(url, "", function(response){
			match = response;
			console.log(response);
			
			
			invokeGet("rest/equipeDom?idMatch="+match.id, "", function(response) {
		           equipes=response;
		           console.log(equipes);
		     
			switch(pari.paris[index].resultat){
			
	
			
				case "AVANT" :
					affichage += equipes[0].nom + " - " +equipes[1].nom; +"<br>"
					affichage += "Votre pronostique "+ pari.paris[index].estimation + " avec une cote de " + pari.paris[index].coeff+"<br><br>"; 

					$("#PariEnCours").append(affichage);
					break;
					
				case "VALIDE" :
					
					affichage += "Votre pronostique "+ pari.paris[index].estimation + " avec une cote de " + pari.paris[index].coeff+"<br><br>"; 
					
					
					$("#PariPasse").append(affichage);
					break;
					
					
					
				case "INVALIDE" :
					affichage += equipes[0].nom + " - " +equipes[1].nom; +"<br>"
					affichage += "Votre pronostique :  "+ pari.paris[index].estimation +" avec une cote de " + pari.paris[index].coeff+"<br><br>"; 
					
					$("#PariPasse").append(affichage);
					
					break;
					
				}
		
			});
			
		});  
		})(i);
	
		
	}
	
	
}


function loadVoirHistorique(){
	$("#Main").load("historique.html", function() {
		$("#PariEnCours").empty();
		$("#PariPasse").empty();
		
		url ="rest/getListParis?pseudo="+compteCourant.pseudo;
		invokeGet(url, "", function(response){
			listeParis = response;
			console.log(listeParis);
			for( var i = 0 ; i<listeParis.length ;i++){
				affichagePari(listeParis[i]);
				
			}
			
		});
		
	$("#BTAdmin").click(function() {
		loadMainCompte();
			
	});	
		
	});
	
	
	

	
	
	
}





function invokePost(url, data, successMsg, failureMsg) {
	jQuery.ajax({
	    url: url,
	    type: "POST",
	    data: JSON.stringify(data),
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function (response) {
	    	$("#ShowMessage").text(successMsg);
	    },
	    error: function (response) {
	    	$("#ShowMessage").text(failureMsg);
	    }
	});
}

function invokePost(url, data, successMsg, failureMsg,responseHandler) {
	jQuery.ajax({
	    url: url,
	    type: "POST",
	    data: JSON.stringify(data),
	    
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: responseHandler, 
	    error: function (response) {
	    	$("#ShowMessage").text(failureMsg);
	    }
	});
}
function invokeGet(url, failureMsg, responseHandler) {
	jQuery.ajax({
	    url: url,
	    type: "GET",
	    success: responseHandler,
	    error: function (response) {
	    	$("#ShowMessage").text(failureMsg);
	    }
	});
}
