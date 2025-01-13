package packs;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Pari {
	
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	int mise;
	
	@Enumerated(EnumType.STRING)
	TResultatPari resultat;
	
	@OneToMany(mappedBy="pari", fetch = FetchType.EAGER)
	Collection<PariElementaire> paris;
	
	@ManyToOne
    @JoinColumn(name = "historique_id")
	@JsonIgnore
    private Historique historique;
	
	
	
	float coeff;
	public Pari() {};
	
	public float getCoeff() {
		return coeff;
	}


	public void setCoeff(float coeff) {
		this.coeff = coeff;
	}


	public Pari(int mise, TResultat resultat, List<PariElementaire> paris) {
		this.mise = mise;
		this.resultat = null;
		this.paris = paris;
	}


	public int getMise() {
		return mise;
	}


	public void setMise(int mise) {
		this.mise = mise;
	}


	public TResultatPari getResultat() {
		return resultat;
	}


	public void setResultat(TResultatPari resultat) {
		this.resultat = resultat;
	}


	public Collection<PariElementaire> getParis() {
		return paris;
	}


	public void setParis(List<PariElementaire> paris) {
		this.paris = paris;
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public Historique getHistorique() {
		return historique;
	}


	public void setHistorique(Historique historique) {
		this.historique = historique;
	}
	
	/** Surement des méthodes à définir dans la facade et non pas dans l'entity **/
	/*public void addPari(PariElementaire p) {
		this.paris.add(p);
	}
	
	public void removePari(Pari p) {
		this.paris.remove(p);
	}*/
	
	
	
	
	
	
	
	
}
