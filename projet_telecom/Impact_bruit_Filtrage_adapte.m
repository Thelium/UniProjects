clc, clear all, close all

n = 10000;      % Nombre de bit du signal
Fe = 24000;     % Frequence d'echantillonnage
Te = 1/Fe;      % Periode d'echantillonnage
Rb = 3000;      % Débit binaire
Tb = 1/Rb;      % Periode d'emission des bits
bits = randi(2,1,n)-1;      % suites de bits du signal

%% 5.2 Chaine de reference
% Chaîne de transmission non bruitée
% Modulateur
M1 = 2;     % Ordre de modulation
Rs = Rb/ log2(M1);      %
Ts = 1/Rs;
Ns = Ts/Te;
t = linspace(0,Te*Ns*n,n*Ns);
% mapping binaire à moyenne nulle
Map_1 = 2*bits - 1;
% somme ak dirac
dir1 = [1 zeros(1,Ns-1)];
s1 = kron(Map_1,dir1);
% filtrage rectangulaire
h1_e = ones(1,Ns);
x = filter(h1_e,1,s1);
% densité spectrale de puissance
DSP1 = pwelch(x,[],[],[],Fe,'twosided');
[o1, ~] = size(DSP1);
f1 = linspace(-Fe/2,Fe/2,o1);
% DSP théorique
Sx = Ts*(sinc(f1*Ts)).^2;

% Reception

n0 = 8;
m = n;
t0 = n0*Te; % = Ts ici
h1_r = fliplr(h1_e); % réponse impulsionnelle filtre réception
t_echant = linspace(t0,m*Ts,m); 
g = conv(h1_e,h1_r); % réponse impulsionnelle chaîne (sans canal)
x_r = filter(h1_r,1,x); % signal filtré réception
oeil = reshape(x_r,Ns,length(x_r)/Ns); % diagramme de l'oeil
x_echant = x_r(n0:Ns:end); % échantillonnage du signal

% Decision + demapping

x_decision = sign(x_echant);
x_decision = (x_decision+1)/2;
oeil = reshape(x_r,Ns,length(x_r)/Ns); % diagramme de l'oeil
oeil = [0 oeil(end,1:(end-1)) ; oeil]; % ajout d'un zero au début pour avoir l'intervalle complet

% Calcul TEB
err = bits-x_decision;
err_bin_sans_bruit = sum(abs(err))/length(err);

% tracé du diagramme de l'oeil de la chaîne de transmission
plot(0:8,oeil(:,2:end))
title("diagramme de l'oeil sans bruit")


% Meme chose mais bruitée
% calcul bruit
Rapp = 8; %rapport signal à bruit par bit entrée récepteur
Rapp_lin = 10^(Rapp/10);
Px = mean(abs(x).^2); %puissance du signal
sigma2=(Px*Ns)/(2*log2(M1)*Rapp_lin);
bruit = sqrt(sigma2)*randn(1,length(x));
% signal bruité (bruitage après mise en forme)
x_bruite = x + bruit;

% Reception
x_r_bruite = filter(h1_r,1,x_bruite); % signal bruite filtré réception
oeil_bruite = reshape(x_r_bruite,Ns,length(x_r_bruite)/Ns); % diag de l'oeil
n_oeil = 1000;
oeil_bruite = [0 oeil_bruite(end,end-n_oeil:(end-1)); oeil_bruite(:,end-n_oeil:end)];
x_echant_bruite = x_r_bruite(n0:Ns:end); % échantillonage du signal

% Decision + demapping

x_decision_bruite = sign(x_echant_bruite);
x_decision_bruite = (x_decision_bruite+1)/2;

% Calcul TEB
err_bruite = bits-x_decision_bruite;
err_bin_bruite = sum(abs(err_bruite))/length(err_bruite); %TEB avec bruit

% Trace diagramme de l'oeil
figure
plot(oeil_bruite(:,2:end))
title("diagramme de l'oeil avec bruit")


% Test d'une plage de Eb/No
epsilon = 10^(-2);
Plage = (0:8);

for i = 1:length(Plage)
    EbNo=Plage(i);
    nb_cycles = 0;
    EbNo_lin = 10^(EbNo/10);
    nb_erreur = 0;
    % Pour s'assurer de la précision, on fait un nombre élevé de cycles/tests
    % sur des bruits générés avec les même paramètres et on fait une erreur
    % moyenne. Le nombre de cycles est déterminé par le nombre d'erreurs
    % et la précision, cf annexe sujet
    while nb_erreur < (1/epsilon^2)
        nb_cycles = nb_cycles + 1;
        sigma2boucle=(Px*Ns)/(2*log2(M1)*EbNo_lin);
        bruitboucle = sqrt(sigma2boucle)*randn(1,length(x));
        x_bruite_boucle = x + bruitboucle;
        x_r_bruite_boucle = filter(h1_r,1,x_bruite_boucle);
        x_echant_bruite_boucle = x_r_bruite_boucle(n0:Ns:end);
        x_decision_bruite_boucle = sign(x_echant_bruite_boucle);
        x_decision_bruite_boucle = (x_decision_bruite_boucle+1)/2;
        nb_erreur =nb_erreur + sum(abs(bits-x_decision_bruite_boucle));
    end
    TEB = nb_erreur/(n*nb_cycles); % taux d'erreur binaire à chaque passage
    TEB_Tab_ref(i) = TEB; % taux d'erreur binaire expérimental
    TEB_th_ref(i) = qfunc(sqrt(2*EbNo_lin)); % taux d'erreur binaire théorique
end

% Trace des taux d'erreur binaire théorique et expérimental
figure
semilogy(Plage,TEB_Tab_ref)
hold on
semilogy(Plage,TEB_th_ref,'r')
title("TEB en fonction de Eb/No")
xlabel("Eb/N0 en dB")
ylabel("TEB")
legend("TEB expérimental","TEB théorique")


%% 5.3 Premiere chaine a etudier, implanter et comparer a la chaine de reference 

% Reception

n0 = 8;
h2_r = [ones(1,Ns/2) zeros(1,Ns/2)]; % rép impulsionnelle filtre réception
g2 = conv(h1_e,h2_r); % réponse impulsionnelle chaîne (sans canal)
x_r2 = filter(h2_r,1,x); % signal filtré réception
% Diagramme de l'oeil
oeil2 = reshape(x_r2,Ns,length(x_r2)/Ns); % diag de l'oeil
oeil2 = [0 oeil2(end,1:(end-1)) ; oeil2(:,:)]; % ajout d'un zero au début pour avoir l'intervalle complet
x_echant2 = x_r2(n0:Ns:end); % échantillonage du signal

% Decision + demapping

x_decision2 = sign(x_echant2);
x_decision2 = (x_decision2+1)/2;

% Calcul TEB
err2 = bits-x_decision2;
err_bin_sans_bruit2 = sum(abs(err2))/length(err2);

% tracé du diagramme de l'oeil
figure
plot(0:8,oeil2(:,2:end))
title("diagramme de l'oeil de la première chaîne")



% Test d'une plage de Eb/No
epsilon = 10^(-2);
Plage = (0:8);

for i = 1:length(Plage)
    EbNo=Plage(i);
    nb_cycles = 0;
    EbNo_lin = 10^(EbNo/10);
    nb_erreur = 0;
    % Pour s'assurer de la précision, on fait un nombre élevé de cycles/tests
    % sur des bruits générés avec les même paramètres et on fait une erreur
    % moyenne. Le nombre de cycles est déterminé par le nombre d'erreurs
    % et la précision, cf annexe sujet
    while nb_erreur < (1/epsilon^2)
        nb_cycles = nb_cycles + 1;
        sigma2boucle=(Px*Ns)/(2*log2(M1)*EbNo_lin);
        bruitboucle = sqrt(sigma2boucle)*randn(1,length(x));
        x_bruite_boucle = x + bruitboucle;
        x_r_bruite_boucle = filter(h2_r,1,x_bruite_boucle);
        x_echant_bruite_boucle = x_r_bruite_boucle(n0:Ns:end);
        x_decision_bruite_boucle = sign(x_echant_bruite_boucle);
        x_decision_bruite_boucle = (x_decision_bruite_boucle+1)/2;
        nb_erreur =nb_erreur + sum(abs(bits-x_decision_bruite_boucle));
    end
    TEB = nb_erreur/(n*nb_cycles); % taux d'erreur binaire à chaque passage
    TEB_Tab(i) = TEB; % taux d'erreur binaire expérimental
    TEB_th(i) = qfunc(sqrt(EbNo_lin)); % taux d'erreur binaire théorique
    % Tracé des diagrammes de l'oeil pour différentes valeurs de Eb/N0, ne
%     figure(i)
%     oeil_boucle = reshape(x_r_bruite_boucle,Ns,length(x_r_bruite_boucle)/Ns);
%     plot(oeil_boucle(:,2:end))
%     title("Diagramme de l'oeil avec bruit")
end

% Trace des TEB reference, reference theorique, etudie et etudie théorique
figure
semilogy(Plage,TEB_Tab_ref, 'b') % tracé TEB reference
hold on
semilogy(Plage,TEB_th_ref, 'r') % tracé TEB théorique reference
hold on
semilogy(Plage,TEB_Tab,'c') % tracé TEB de la chaîne
hold on
semilogy(Plage,TEB_th,'m') % tracé TEB théorique de la chaîne
title("TEB en fonction de Eb/No")
xlabel("Eb/N0")
ylabel("TEB")
legend("TEB référence","TEB théorique référence","TEB étudié","TEB théorique étudié")

%% 5.4 Deuxieme chaine a etudier, implanter et comparer a la chaine de reference 

% Chaîne de transmission non bruitée
% Modulateur
M2 = 4;
Rs3 = Rb/ log2(M2);
Ts3 = 1/Rs3;
Ns3 = Ts3/Te;
t3 = linspace(0,Te*Ns3*n,n*Ns3);
% mapping binaire à moyenne nulle
Map_2 = (2*bi2de(reshape(bits,2,length(bits)/2).')-3).';
% somme ak dirac
dir3 = [1 zeros(1,Ns3-1)];
s3 = kron(Map_2,dir3);
% filtrage rectangulaire
h3_e = ones(1,Ns3);
h3_e = h3_e/norm(h3_e);
x3 = filter(h3_e,1,s3);
% densité spectrale de puissance
DSP3 = pwelch(x3,[],[],[],Fe,'twosided');
[o3, ~] = size(DSP3);
f3 = linspace(-Fe/2,Fe/2,o3);
% dsp théorique
Sx3 = Ts*(sinc(f3*Ts3)).^2;

% Reception

n0 = 16;
m = n;
t0 = n0*Te; % = Ts ici
h3_r = fliplr(h3_e); % rép impulsionnelle filtre réception
t_echant3 = linspace(t0,m*Ts3,m); 
% g3 = conv(h3_e,h3_r); % réponse impulsionnelle chaîne (sans canal)
x_r3 = filter(h3_r,1,x3); % signal filtré réception
oeil = reshape(x_r3,Ns3,length(x_r3)/Ns3); % diag de l'oeil
oeil = [0 oeil(end,1:(end-1)) ; oeil(:,:)]; % ajout d'un zero au début pour avoir l'intervalle complet
x_echant3 = x_r3(n0:Ns3:end); % échantillonage du signal
symboles_3 = x_echant3;

% Decision + demapping

x_decision3 = reshape(de2bi((symboles_3 + 3)/2).',1,length(bits));

% Calcul TEB
err3 = bits-x_decision3;
err_bin_sans_bruit3 = sum(abs(err3))/length(err3);

% Trace du diagramme de l'oeil
figure
plot(0:16,oeil(:,2:end))
title("diagramme de l'oeil de la deuxième chaîne")


% plage de valeur de Eb/N0
Plage = (0 : 8);

% Meme chose avec bruit
Erreurs = [];       % Liste de taux d'erreurs symboles experimentaux pour des Eb/N0 différents
Erreurs_th = [];    % Meme chose mais théorique
Erreurs_b = [];     % Liste des TEB pour des Eb/N0 differents
Erreurs_th_b = [];  % Meme chose mais theorique/optimal
for i = 1:length(Plage)
    Rapp=Plage(i);
    nb_cycles = 0;
    Rapp_lin = 10^(Rapp/10);
    nb_erreur = 0;
    nb_err_symb = 0;
    while nb_erreur < (1/epsilon^2)
        nb_cycles = nb_cycles + 1;
        % calcul bruit
        Px = mean(abs(x3).^2); %puissance du signal
        sigma2=(Px*Ns3)/(2*log2(M2)*Rapp_lin);
        bruit = sqrt(sigma2)*randn(1,length(x3));
        % signal bruité (bruitage après mise en forme)
        x_bruite3 = x3 + bruit;
    
        % Reception
        x_r_bruite3 = filter(h3_r,1,x_bruite3); % signal bruite filtré réception
%         oeil_bruite = reshape(x_r_bruite3,Ns3,length(x_r_bruite3)/Ns3); % diag de l'oeil
        x_echant_bruite3 = x_r_bruite3(n0:Ns3:end); % échantillonage du signal
        symboles_bruite_3 = 3*(x_echant_bruite3 > 2) + 1*(x_echant_bruite3 > 0 & x_echant_bruite3 < 2) + (-1)*(x_echant_bruite3 < 0 & x_echant_bruite3 > -2) + (-3)*(x_echant_bruite3 < -2);
    
        % Decision + demapping
    
        x_decision_bruite3 = reshape(de2bi((symboles_bruite_3 + 3)/2).',1,length(bits));
        
        % calcul des nombres d'erreurs
        err_bruite_3 = bits-x_decision_bruite3;
        nb_erreur = nb_erreur + sum(abs(err_bruite_3));
        nb_err_symb = nb_err_symb + length(find((Map_2 - symboles_bruite_3) ~= 0));
    end
    % erreurs binaires et symboles une fois la bonne precision atteinte
    err_bin_bruite3 = nb_erreur/(n*nb_cycles);
    TES = nb_err_symb/(nb_cycles*length(Map_2));
    % ajouts aux listes
    Erreurs(i) = TES;
    Erreurs_th(i) = (3/2)*qfunc(sqrt((4/5)*Rapp_lin));
    Erreurs_b(i) = err_bin_bruite3;
    Erreurs_th_b(i) = (3/4)*qfunc(sqrt((4/5)*Rapp_lin)); % TEB optimal
end

% Trace des erreurs symboles etudiee et theorique
figure
semilogy(Plage, Erreurs, 'c')
hold on
semilogy(Plage, Erreurs_th)
title("TES en fonction de Eb/N0")
xlabel("Eb/N0 en dB")
ylabel("TES")
legend("TES Expérimental", "TES théorique")

% Trace des TEB etudie et optimal
figure
semilogy(Plage, Erreurs_b)
hold on
semilogy(Plage, Erreurs_th_b)
title("TEB en fonction de Eb/N0")
xlabel("Eb/N0 en dB")
ylabel("TEB")
legend("TEB Expérimental", "TEB optimal")

% Trace des TEB reference et experimental
figure
semilogy(Plage,TEB_Tab_ref, 'b') % tracé TEB reference
hold on
semilogy(Plage, Erreurs_b)
title("TEB en fonction de Eb/N0")
xlabel("Eb/N0 en dB")
ylabel("TEB")
legend("TEB référence","TEB Expérimental")

% comparaison DSP reference et 2e chaine
figure
semilogy(f1,fftshift(DSP1/max(DSP1)))
hold on
semilogy(f3,fftshift(DSP3/max(DSP3)))
title("Comparaison de DSP")
xlabel("fréquence en Hz")
ylabel("amplitude")
legend("DSP référence","DSP 2e chaîne")


% TES pas confondus car le théorique est une erreur approchée qui
% correspond à un codage optimal, ici le codage est un codage "naïf", avec
% la correspondance 11 = 3, 10 = 1, 01 = -1 et 00 = -3, en utilisant un
% codage de Gray, à savoir 11 = 3, 10 = 1, 00 = -1 et 01 = -3, on aurait un
% codage optimal qui tendrait à améliorer le taux d'erreur binaire et à
% s'approcher du TEB théorique puisqu'un seul bit change entre chaque
% niveau ce qui augmente la probabilité qu'un symbole erroné soit dû à un
% seul bit erroné et pas deux comme on pouvait l'avoir avec le codage
% "naïf" où les niveau 1 et -1 sont proches et les 2 bits changent, si on
% se trompe de niveau les 2 bits sont alors erronés au lieu d'un seul avec
% Gray



