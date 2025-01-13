package packs;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Compte {
	
	/*@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;*/
	
	@Id
	String pseudo;
	
	String mdp;
	TDroit droit;
	
	@OneToOne(mappedBy="compte",fetch = FetchType.EAGER)
	@JsonIgnore
	Historique historique;
	
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "solde_id")
	Solde solde;
	
	/* Penser à créer un compte admin en amont qui ait accès
	 * aux méthodes admin et au champ TDroit*/
	
	
	/*
	public Compte(String pseudo, String mdp, double credit, TDroit droit) {
		this.pseudo = pseudo;
		this.mdp = mdp;
		this.solde = new Solde(this, credit);
		this.droit = droit;
		
	}
	*/

	public String getPseudo() {
		return pseudo;
	}

	public void setPseudo(String pseudo) {
		this.pseudo = pseudo;
	}

	public String getMdp() {
		return mdp;
	}

	public void setMdp(String mdp) {
		this.mdp = mdp;
	}

	public Solde getSolde() {
		return solde;
	}

	public void setSolde(Solde solde) {
		this.solde = solde;
	}

	public TDroit getDroit() {
		return droit;
	}

	public void setDroit(TDroit droit) {
		this.droit = droit;
	}

	public Historique getHistorique() {
		return historique;
	}

	public void setHistorique(Historique historique) {
		this.historique = historique;
	}
/*
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}*/
	
	
	
	

}
