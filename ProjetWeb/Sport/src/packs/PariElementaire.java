package packs;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class PariElementaire {
	
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	@ManyToOne
	@JoinColumn(name = "match_id")
	@JsonIgnore
	Match match;
	
	@Enumerated(EnumType.STRING)
	TResultatPari resultat;
	
	@ManyToOne
	@JsonIgnore
	Pari pari;
	
	@Enumerated(EnumType.STRING)
	TEstimation estimation;
	
	float coeff;
	
	
	/*@OneToMany 
	@JsonIgnore 
	Cote cote;*/
	
	
	/*public PariElementaire(Match match, TResultat resultat) {
		this.match = match;
		this.resultat = resultat;
	}*/


	public TEstimation getEstimation() {
		return estimation;
	}


	public void setEstimation(TEstimation estimation) {
		this.estimation = estimation;
	}


	public float getCoeff() {
		return coeff;
	}


	public void setCoeff(float coeff) {
		this.coeff = coeff;
	}



	public Match getMatch() {
		return match;
	}


	public void setMatch(Match match) {
		this.match = match;
	}


	public TResultatPari getResultat() {
		return resultat;
	}


	public void setResultat(TResultatPari resultat) {
		this.resultat = resultat;
	}


	public Pari getPari() {
		return pari;
	}


	public void setPari(Pari pari) {
		this.pari = pari;
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}
	
	
	
}
