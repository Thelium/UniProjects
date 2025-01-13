package packs;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Equipe {
	
	@Id
	String nom;
	
	@ManyToOne
	@JoinColumn(name="name_sport")
	Sport sport;
	
	@OneToMany (mappedBy="equipe1", fetch = FetchType.EAGER)
	Collection<Match> matchsDomicile;
	
	@OneToMany(mappedBy="equipe2", fetch = FetchType.EAGER)
	Collection<Match> matchsExterieur;
	
	/*public Equipe(String nom, Sport sport) {
		this.nom = nom;
		this.sport = sport;
		this.matchsDomicile = new ArrayList<Match>();
		this.matchsExterieur = new ArrayList<Match>();
	}*/
	
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public Sport getSport() {
		return sport;
	}
	public void setSport(Sport sport) {
		this.sport = sport;
	}
	/*public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}*/
	public Collection<Match> getMatchsDomicile() {
		return matchsDomicile;
	}
	public void setMatchsDomicile(Collection<Match> matchsDomicile) {
		this.matchsDomicile = matchsDomicile;
	}
	public Collection<Match> getMatchsExterieur() {
		return matchsExterieur;
	}
	public void setMatchsExterieur(Collection<Match> matchsExterieur) {
		this.matchsExterieur = matchsExterieur;
	}

	
}
