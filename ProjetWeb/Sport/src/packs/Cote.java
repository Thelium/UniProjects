package packs;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Cote {
	
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	float v1;
	float v2;
	float nul;
	
	//@OneToOne
	//@JsonIgnore
	//Match match;
	
	/*public Cote(float v1, float v2, float nul, Match match) {
		this.v1 = v1;
		this.v2 = v2;
		this.nul = nul;
		this.match = match;
	}*/
	
	public float getV1() {
		return v1;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public void setV1(float v1) {
		this.v1 = v1;
	}
	public float getV2() {
		return v2;
	}
	public void setV2(float v2) {
		this.v2 = v2;
	}
	public float getNul() {
		return nul;
	}
	public void setNul(float nul) {
		this.nul = nul;
	}
	/*public Match getMatch() {
		return this.match;
	}
	public void setMatch(Match match) {
		this.match = match;
	}
	*/
	
}
