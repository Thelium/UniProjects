package packs;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class Historique {
	
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	
	@OneToMany(mappedBy = "historique", cascade = CascadeType.ALL)
	Collection<Pari> paris;
	
	
	@OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "compte_id")
	Compte compte;

	public Historique() {
		
	}

	public Collection<Pari> getParis() {
		return paris;
	}

	public void setParis(Collection<Pari> paris) {
		this.paris = paris;
	}

	public Collection<Pari> getHistorique() {
		return paris;
	}

	public void setHistorique(List<Pari> historique) {
		this.paris = historique;
	}

	public Compte getCompte() {
		return compte;
	}

	public void setCompte(Compte compte) {
		this.compte = compte;
	}
	
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	
	
}
