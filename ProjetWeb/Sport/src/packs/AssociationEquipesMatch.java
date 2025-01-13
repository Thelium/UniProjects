package packs;

import java.io.Serializable;

public class AssociationEquipesMatch implements Serializable {
	
	String equipeDom;
	String equipeExt;
	int idMatch;
	
	public String getEquipeDom() {
		return equipeDom;
	}
	public void setEquipeDom(String equipeDom) {
		this.equipeDom = equipeDom;
	}
	public String getEquipeExt() {
		return equipeExt;
	}
	public void setEquipeExt(String equipeExt) {
		this.equipeExt = equipeExt;
	}
	public int getidMatch() {
		return idMatch;
	}
	public void setidMatch(int idmatch) {
		idMatch = idmatch;
	}
	

	
}