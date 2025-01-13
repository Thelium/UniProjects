package packs;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Solde {

	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	@OneToOne(mappedBy = "solde", fetch = FetchType.EAGER)
	@JsonIgnore
	Compte compte;
	
	double credit;

	public Solde() {
	
	}
	
	public Solde( double credit) {
		this.credit = credit;
	}

	
	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public Compte getCompte() {
		return compte;
	}


	public void setCompte(Compte compte) {
		this.compte = compte;
	}


	public double getCredit() {
		return credit;
	}


	public void setCredit(double credit) {
		this.credit = credit;
	}
	
	
	/** Surement des méthodes à définir dans la facade et non pas dans l'entity **/
	/*
	public void debiter(double d) {
		this.credit -= d;
	}
	
	public void crediter(double d) {
		this.credit += d;
	}
	*/
	
}
