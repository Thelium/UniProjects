package packs;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.ejb.Singleton;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ejb.TransactionManagement;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;


@Singleton
@Path("/")
public class Facade {
	
	@PersistenceContext
	EntityManager em; 
	
	
	@GET
	@Path("getcompte")
	@Produces({ "application/json"})
	public Compte getComptePseudo(@QueryParam("pseudo") String pseudo) {
	   Compte c =em.createQuery("SELECT c FROM Compte c  WHERE c.pseudo = :pseudo", Compte.class)
	             .setParameter("pseudo", pseudo)
	             .getSingleResult();
	  
	   return c;
	   
	}
	
	
	@GET
	@Path("listmatchs")
	@Produces({ "application/json"})
	public Collection<Match> listMatchs() {
		return em.createQuery("SELECT m FROM Match m ORDER BY m.sport.nom ASC", Match.class).getResultList();
	}
	
	@GET
	@Path("listsports")
	@Produces({ "application/json" })
	public Collection<Sport> listSports() {
		return em.createQuery("from Sport", Sport.class).getResultList();
	}
	
	@GET
	@Path("listequipeSport")
	@Produces({ "application/json" })
	public Collection<Equipe> listEquipe( @QueryParam("sportName") String sportName) {
	    
		return em.createQuery("SELECT e FROM Equipe e WHERE e.sport.nom = :sportName", Equipe.class)
	             .setParameter("sportName", sportName)
	             .getResultList();
	}
	@GET
	@Path("listequipe")
	@Produces({ "application/json" })
	public Collection<Equipe> listEquipe() {
	    
		return em.createQuery("from Equipe", Equipe.class).getResultList();
	
	}
	
	@GET
	@Path("listcompte")
	@Produces({ "application/json" })
	public Collection<Compte> listCompte() {
	    
		return em.createQuery("from Compte", Compte.class).getResultList();
	
	}
	
	@GET
	@Path("listHistorique")
	@Produces({ "application/json" })
	public Collection<Historique> listHistorique() {
	    System.out.println("ok list hitorique");
		
	    System.out.println(em.createQuery("from Historique", Historique.class).getResultList());
	    return em.createQuery("from Historique", Historique.class).getResultList();
	
	}
	
	
	@GET
	@Path("equipeDom")
	@Produces({ "application/json" })
	public Collection<Equipe> getEquipeDom(@QueryParam("idMatch") int idMatch) {
	   Equipe dom =em.createQuery("SELECT e FROM Equipe e JOIN e.matchsDomicile m WHERE m.id = :idMatch", Equipe.class)
	             .setParameter("idMatch", idMatch)
	             .getSingleResult();
	   
	   Equipe ext =em.createQuery("SELECT e FROM Equipe e JOIN e.matchsExterieur m WHERE m.id = :idMatch", Equipe.class)
	             .setParameter("idMatch", idMatch)
	             .getSingleResult();
	   List<Equipe> equipes = new ArrayList<>();
	   equipes.add(dom);
	   equipes.add(ext);
	   return equipes;
	   
	}
	
	
	@GET
	@Path("getMatch")
	@Produces({ "application/json" })
	public Match getMatch(@QueryParam("id") String id) {
		return em.createQuery("SELECT m FROM Match m WHERE  m.id= :id ", Match.class)
        .setParameter("id", Integer.parseInt(id)).getSingleResult();
	}
	
	
	
	@GET
	@Path("getMatchSport")
	@Produces({ "application/json" })
	public Collection<Match> getMatchSport(@QueryParam("sportName") String sportName, 
										   @QueryParam("etat") String etat) {
		Collection<Match> req = null;
		if(etat.equals("TOUS")){
			 req= em.createQuery("SELECT m FROM Match m WHERE m.sport.nom = :sportName", Match.class)
			            .setParameter("sportName", sportName)
			            .getResultList();
			
		}
		
		else {
			if(sportName.equals("tous")) {
				switch(etat) {
					case "FUTUR" :
						req= em.createQuery("SELECT m FROM Match m WHERE  m.resultat= :resultat  ORDER BY m.sport.nom ASC  ", Match.class)
					            .setParameter("resultat", TResultat.AVANT)
					            .getResultList();
						System.out.println("passage futur");
						break;
					case "PASSE" :
						req= em.createQuery("SELECT m FROM Match m WHERE  m.resultat != :resultat ORDER BY m.sport.nom ASC", Match.class)
					            .setParameter("resultat", TResultat.AVANT)
					            .getResultList();
						break;	
				}
			}
			else {
				switch(etat) {
				case "FUTUR" :
					req= em.createQuery("SELECT m FROM Match m WHERE m.sport.nom= :sportName and m.resultat= :resultat", Match.class)
				            .setParameter("resultat", TResultat.AVANT)
				            .setParameter("sportName", sportName)
				            .getResultList();
					break;
					
				case "PASSE" :
					req= em.createQuery("SELECT m FROM Match m WHERE  m.sport.nom= :sportName and m.resultat != :resultat", Match.class)
				            .setParameter("resultat", TResultat.AVANT)
				            .setParameter("sportName", sportName)
				            .getResultList();
					break;
				}

			}
			
			}
		return req;
	}
		
	 
	
	@GET
	@Path("listsportss")
	@Produces({ "application/json" })
	public Collection<Sport> listSport( @QueryParam("sportName")  String sportName) {
	    
		return em.createQuery("SELECT s FROM Sport s WHERE s.nom = :sportName", Sport.class)
				.setParameter("sportName",sportName).getResultList();
	
	}
	
	@POST
	@Path("associateEquipeSport")
	@Consumes({ "application/json"})
	public void associerEquipeSport(AssociationEquipeSport as) {
		Sport s = em.find(Sport.class, as.getSportName());
		Equipe e = em.find(Equipe.class, as.getEquipeName());
		s.getEquipes().add(e);
		e.setSport(s);
	
		
	}
	@POST
	@Path("associerMatchCote")
	@Consumes({ "application/json"})
	public void associerMatchCote(AssociationCoteMatch as) {
		Match m = em.find(Match.class, as.getIdMatch());
		Cote c = em.find(Cote.class, as.getIdCote());
		m.setCote(c);
	
		
	}
	
	@GET
	@Path("getMatchPari")
	@Produces({ "application/json"})
	public Match getMatchPari(@QueryParam("id") String id) {
		
		System.out.println(id);
		return em.createQuery("SELECT m FROM Match m JOIN m.paris p WHERE p.id = :id", Match.class)
				.setParameter("id", Integer.parseInt(id)).getSingleResult();
	
		
	}
	
	@POST
	@Path("changeCompte")
	@Consumes({ "application/json"})
	public void changeCompte(@QueryParam("pseudo")  String pseudo) {
		Compte c = em.find(Compte.class, pseudo);
		if(c.droit==TDroit.ADMIN) {
			c.setDroit(TDroit.CLIENT);
		}
		else {
			c.setDroit(TDroit.ADMIN);
		}
	
		
	}
	
	@POST
	@Path("associerEquipeMatch")
	@Produces({ "application/json"})
	public void associerEquipeMatch(AssociationEquipesMatch as) {
		
		Equipe ed = em.find(Equipe.class, as.getEquipeDom());
		Equipe ee = em.find(Equipe.class, as.getEquipeExt());
		Match m = em.find(Match.class, as.getidMatch());
		Sport s = ed.getSport();
		Sport sem = em.find(Sport.class, s.getNom());
		sem.getMatchs().add(m);
		m.setEquipe1(ed);
		m.setEquipe2(ee);
		m.setSport(sem);
		ed.getMatchsDomicile().add(m);
		ee.getMatchsExterieur().add(m);
	}
	
	@POST
	@Path("addmatch")
	@Consumes({ "application/json"})
	public Match addMatch(Match match,@QueryParam("result") String result,
									  @QueryParam("score1") String sc1,
									  @QueryParam("score2") String sc2) {
		
		switch(result) {
			case "domicile": 
				match.setResultat(TResultat.DOMICILE);
				break;
				
			case "ext":
				match.setResultat(TResultat.EXTERIEUR);
				break;
			case "nul": 
				match.setResultat(TResultat.NUL);
				break;
				
			case "avant": 
				match.setResultat(TResultat.AVANT);
				break;
		
		}
		
		match.score1 = Integer.parseInt(sc1);
		match.score2 =Integer.parseInt(sc2);
		em.persist(match);
		return match;
		
	}
	
	@POST
	@Path("modifMatch")
	@Consumes({ "application/json"})
	public Match modifMatch(@QueryParam("dom") String equipe1,
									  @QueryParam("ext") String equipe2,
									  @QueryParam("etat") String etat,
									  @QueryParam("score1") String score1,
									  @QueryParam("score2") String score2,
									  @QueryParam("id_match") String id_match,
									  @QueryParam("v1") String cotev1,
									  @QueryParam("v2") String cotev2,
									  @QueryParam("nul") String cotenul) {
		
		//Récupération de donnée
		
		Match m = em.find(Match.class,  Integer.parseInt(id_match));
		Equipe e1= em.find(Equipe.class, equipe1);
		Equipe e2= em.find(Equipe.class, equipe2);
		m.score1 = Integer.parseInt(score1);
		m.score2 = Integer.parseInt(score2);
		m.cote.setV1(Float.parseFloat(cotev1));
		m.cote.setV2(Float.parseFloat(cotev2));
		m.cote.setNul(Float.parseFloat(cotenul));
		
		//Gérer les paris associer au match
		 TResultat etatPasse = m.getResultat();
		 TResultat etatPresent=null;
		 switch(etat) {
			case "domicile":
				etatPresent = TResultat.DOMICILE;
				m.setResultat(TResultat.DOMICILE);
				break;
				
			case "ext":
				etatPresent = TResultat.EXTERIEUR;
				m.setResultat(TResultat.EXTERIEUR);
				break;
			case "nul": 
				etatPresent = TResultat.NUL;
				m.setResultat(TResultat.NUL);
				break;
				
			case "avant": 
				etatPresent = TResultat.AVANT;
				m.setResultat(TResultat.AVANT);
				break;
		
		}
		 
		 
		 //Si ajout de score modifié resultat de pari
		if(etatPasse== TResultat.AVANT && etat!="avant") {
			Collection<PariElementaire> majPariElem = em.createQuery("SELECT p FROM PariElementaire p WHERE p.match.id = :idMatch", PariElementaire.class)
			.setParameter("idMatch",m.getId()).getResultList();
			
			for( PariElementaire p : majPariElem) {
				if(p.getEstimation().name()== etatPresent.name() && p.getResultat() == TResultatPari.AVANT ) {
					p.setResultat(TResultatPari.REUSSI);
					Pari pariAssocier = p.getPari();
					System.out.println(pariAssocier);

					
					if(pariAssocier.getResultat()==TResultatPari.AVANT) {
					   p.setResultat(TResultatPari.VALIDE);
					   boolean validePari = true;
					   for(PariElementaire pe : pariAssocier.getParis()) {
						   validePari= validePari && pe.getResultat()== TResultatPari.VALIDE;
						   System.out.println(pe.getResultat());
					   }
					   System.out.println(validePari);
					   if(validePari) {
						   pariAssocier.setResultat(TResultatPari.VALIDE);
						   System.out.println("on récupère le pari");
						   Historique  h = pariAssocier.getHistorique();
						   Compte c = h.getCompte();
						   Solde s = c.getSolde(); 
						   float gain = pariAssocier.getCoeff()*pariAssocier.getMise();
						   s.setCredit(s.getCredit()+gain);
						   
					   }
					   else {
						   pariAssocier.setResultat(TResultatPari.INVALIDE);
					   }
					}
					
				}
				else {
					p.setResultat(TResultatPari.ECHEC);
					Pari pariAssocier = p.getPari();
					if(pariAssocier.getResultat()==TResultatPari.AVANT) {
						pariAssocier.setResultat(TResultatPari.INVALIDE);
					}
				}
			
			}
			
		
			
		}
		
		
		 
		
		
		if(!e1.getNom().equals(m.getEquipe1())) {
			m.setEquipe1(e1);
			e1.matchsDomicile.add(m);
		
		}
		if(!e2.getNom().equals(m.getEquipe2())) {
			m.setEquipe2(e2);
			e2.matchsExterieur.add(m);
		}
		
		
		
		
		
		return m;
		
	}
	
	@GET
	@Path("creditCompte")
	@Produces({ "application/json"})
	public Compte crediter(@QueryParam("pseudo") String pseudo,
						 @QueryParam("creditValue") String creditValue
									  ) {
		Compte c = em.find(Compte.class, pseudo);
		Solde s = c.getSolde();
		double creditPasse = s.getCredit();
		s.setCredit(creditPasse+ Double.parseDouble(creditValue));
	    
	    return c;
		
	}
	
	@GET
	@Path("getListParis")
	@Produces({ "application/json"})
	public Collection<Pari> getListParis(@QueryParam("pseudo") String pseudo) {
		
		
		//Compte c = em.find(Compte.class, pseudo);
		
		
	    return  em.createQuery("SELECT p FROM Pari p WHERE  p.historique.compte.pseudo= :pseudo", Pari.class)
	            .setParameter("pseudo", pseudo)
	            .getResultList();
		
	}
	
	
	@POST 
	@Path("addCoteAndGetCote")
	@Produces({"application/json"})
	public Cote addCoteAndGetCote(Cote cote) {
		em.persist(cote);
		return cote;
		
		
	}
	

	@GET
	@Path("debiter")
	@Produces({ "application/json"})
	public Compte debiter(@QueryParam("pseudo") String pseudo,
									  @QueryParam("valeur") String valeur
									  ) {
		Compte c = em.find(Compte.class, pseudo);
		Solde s = c.getSolde();
		double creditPasse = s.getCredit();
		s.setCredit(creditPasse-Double.parseDouble(valeur));
		System.out.println("okk");
	    return c;
		
	}
	
	
	@POST
	@Path("addPariElementaire")
	@Produces({ "application/json"})
	@TransactionAttribute(TransactionAttributeType.REQUIRED)
	public PariElementaire addPariElementaire(PariElementaire p,@QueryParam("idMatch") String idMatch,
																@QueryParam("estimation") String estimation) {
		
		Match m = em.find(Match.class, Integer.parseInt(idMatch));
		em.persist(p);
		p.setResultat(TResultatPari.AVANT);
		
		switch(estimation) {
		
		case "V1" : p.setEstimation(TEstimation.DOMICILE);
					break;
		case "V2" : p.setEstimation(TEstimation.EXTERIEUR);
					break;
		case "NUL": p.setEstimation(TEstimation.NUL);
					break;
		
		}
		
		p.setMatch(m);
		m.getParis().add(p);
		
		
		em.merge(m);
		return p;
	}
	
	
	@POST
	@Path("addGetPari")
	@Produces({ "application/json"})
	public Pari addGetPari(Pari p) {
		em.persist(p);
		return p;
	}
	
	@POST
	@Path("addPariElem")
	@Produces({ "application/json"})
	public Compte addPariElem(@QueryParam("pseudo") String pseudo,
				@QueryParam("idPari") String idPari,
            	@QueryParam("idPariElems") String idPariElems  ) {
		
		
		System.out.println("passage facade");
		System.out.println(idPari);
		System.out.println(idPariElems);
		
		Pari pcombine = em.find(Pari.class, Integer.parseInt(idPari));
		List<PariElementaire> parisSelectionnes = new ArrayList<>();
	    float coeff = 1;
	    
	    String[] idParisArray = ((String) idPariElems).split(",");
	    
		for (String idParis : idParisArray) {

			System.out.println(idParis);
	        PariElementaire pariElementaire = em.find(PariElementaire.class, Integer.parseInt(idParis.trim()));
	        parisSelectionnes.add(pariElementaire);
	        pariElementaire.setPari(pcombine);
	        coeff=coeff* pariElementaire.getCoeff();
	       
	  
	    }
		pcombine.setResultat(TResultatPari.AVANT);
		pcombine.setCoeff(coeff);
		pcombine.setParis(parisSelectionnes);
		Historique h  = em.createQuery("SELECT h FROM Historique h WHERE h.compte.pseudo = :pseudo", Historique.class)
		.setParameter("pseudo",pseudo).getSingleResult();
		Compte c = em.find(Compte.class, pseudo);
		
		c.getSolde().setCredit((c.getSolde().getCredit() - pcombine.getMise()));
		
		h.getHistorique().add(pcombine);
		pcombine.setHistorique(h);
		em.persist(pcombine);
		System.out.println("sortie facade");
		 
		return c;
		
		
		
		
		
	}
	
	@POST
	@Path("addequipe")
	@Consumes({ "application/json"})
	public void addEquipe(Equipe equipe) {
		em.persist(equipe);
		
	}
	
	@POST
	@Path("getequipe")
	@Consumes({ "application/json"})
	public Equipe getEquipe(Equipe equipe) {
		Equipe equipeFind = em.find(Equipe.class,equipe.getNom());
		return equipeFind;
	}
	
	@POST
	@Path("getcompte")
	@Consumes({ "application/json"})
	public Compte getCompte(Compte compte) {
		Compte compteFind = em.find(Compte.class,compte.getPseudo());
		return compteFind;
	}
	
	@POST
	@Path("addCompte")
	@Consumes({ "application/json"})
	public void addCompte(Compte compte,@QueryParam("droit")  int droit,
						  @QueryParam("solde")  int solde) {
	
		Solde  s = new Solde(solde);
		
		em.persist(s);
		compte.solde=s;
		if(droit==1) {
			compte.droit=TDroit.ADMIN;
		}
		else {
			compte.droit=TDroit.CLIENT;
		}
		
	
		em.persist(compte);
		
		Historique h = new Historique();
		h.setCompte(compte);
		em.persist(h);
	
	}
	
	
	
	
	@POST
	@Path("addsport")
	@Consumes({ "application/json"})
	public void addSport(Sport sport) {
		em.persist(sport);
	
	}
	
	@POST
	@Path("getsport")
	@Consumes({ "application/json"})
	public Sport getSport(Sport sport) {
		Sport sportFind = em.find(Sport.class,sport.getNom());
		return sportFind;
	}
	
	
	
	@POST
	@Path("connexion")
	@Consumes({ "application/json"})
	public Compte connexion(Compte compte) {
		
		Compte cmpte = em.find(Compte.class,compte.getPseudo());
		return cmpte;
	}
	

}
