package packs;

import java.io.Serializable;

public class AssociationEquipeSport implements Serializable {
	String equipeName;
	String sportName;
	public String getEquipeName() {
		return equipeName;
	}
	public void setEquipeName(String equipeName) {
		this.equipeName = equipeName;
	}
	public String getSportName() {
		return sportName;
	}
	public void setSportName(String sportName) {
		this.sportName = sportName;
	}
	
	
}