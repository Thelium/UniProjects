package packs;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

/*@Entity
public class Score {

	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	int id;
	
	int equipe1;
	
	int equipe2;
	
	@OneToOne
	@JsonIgnore
	Match match;
	
	public Score(int equipe1, int equipe2) {
		this.equipe1 = equipe1;
		this.equipe2 = equipe2;
	}
	
	public int getEquipe1() {
		return equipe1;
	}
	public void setEquipe1(int equipe1) {
		this.equipe1 = equipe1;
	}
	public int getEquipe2() {
		return equipe2;
	}
	public void setEquipe2(int equipe2) {
		this.equipe2 = equipe2;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
}*/
public class Score{
	
	Integer score1;
	Integer score2; 
	
	public Score() {
		
	}
	public Score(Integer s1, Integer s2) {
		this.score1=s1; 
		this.score2=s2;
	}

	public Integer getScore1() {
		return score1;
	}

	public void setScore1(Integer score1) {
		this.score1 = score1;
	}

	public Integer getScore2() {
		return score2;
	}

	public void setScore2(Integer score2) {
		this.score2 = score2;
	}
	
}
