package packs;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Match {
	
	
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	@ManyToOne
	@JsonIgnore
	Equipe equipe1;
	
	@ManyToOne
	@JsonIgnore
	Equipe equipe2;
	
	@Enumerated(EnumType.STRING)
	TResultat resultat;
	
	
	int score1;
	int score2;
	
	@ManyToOne
	@JsonIgnore
	Sport sport;
	
	
	@OneToOne
	@JoinColumn(name = "cote_id")
	Cote cote;
	
	@OneToMany (mappedBy="match", fetch = FetchType.EAGER)
	Collection<PariElementaire> paris;
	
	
	
	/*public Match(Equipe equipe1, Equipe equipe2, TResultat resultat, Score score, Sport sport) {
		this.equipe1 = equipe1;
		this.equipe2 = equipe2;
		this.resultat = resultat;
		this.score = score;
		this.sport = sport;
	}



	public Match(Equipe equipe1, Equipe equipe2, Sport sport) {
		this.equipe1 = equipe1;
		this.equipe2 = equipe2;
		this.sport = sport;
		this.resultat = TResultat.AVANT;
		this.score = null;
	}
	*/


	public Equipe getEquipe1() {
		return equipe1;
	}

	public void setEquipe1(Equipe equipe1) {
		this.equipe1 = equipe1;
	}

	public Equipe getEquipe2() {
		return equipe2;
	}

	public void setEquipe2(Equipe equipe2) {
		this.equipe2 = equipe2;
	}

	public TResultat getResultat() {
		return resultat;
	}

	public void setResultat(TResultat resultat) {
		this.resultat = resultat;
	}

	

	public int getScore1() {
		return score1;
	}

	public void setScore1(int score1) {
		this.score1 = score1;
	}

	public int getScore2() {
		return score2;
	}

	public void setScore2(int score2) {
		this.score2 = score2;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Sport getSport() {
		return sport;
	}

	public void setSport(Sport sport) {
		this.sport = sport;
	}

	public Collection<PariElementaire> getParis() {
		return paris;
	}

	public void setParis(List<PariElementaire> paris) {
		this.paris = paris;
	}
	
	
	public Cote getCote() {
		return cote;
	}

	public void setCote(Cote cote) {
		this.cote = cote;
	}

	
	
	
}
