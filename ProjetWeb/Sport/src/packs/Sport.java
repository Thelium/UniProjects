package packs;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Sport {
	
	@Id
	String nom;
	
	@OneToMany(mappedBy="sport", fetch = FetchType.EAGER)
	@JsonIgnore
	Collection<Equipe> equipes;
	
	@OneToMany(mappedBy="sport", fetch = FetchType.EAGER)
	Collection<Match> matchs;

	
	
	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public Collection<Equipe> getEquipes() {
		return equipes;
	}

	public void setEquipes(List<Equipe> equipes) {
		this.equipes = equipes;
	}

	public Collection<Match> getMatchs() {
		return matchs;
	}

	public void setMatchs(List<Match> matchs) {
		this.matchs = matchs;
	}
	
	public void addMatch(Match m) {
		this.matchs.add(m);
	}
	
	public void removeMatch(Match m) {
		this.matchs.remove(m);
	}
	
	public void addEquipe(Equipe e) {
		this.equipes.add(e);
	}
	
	public void removeEquipe(Equipe e) {
		this.equipes.remove(e);
	}
}
