clc, clear all, close all

n = 1000;       % Nombre de bit du signal
Fe = 24000;     % Frequence d'echantillonnage
Te = 1/Fe;      % Periode d'echantillonnage
Rb = 3000;      % Débit binaire
Tb = 1/Rb;      % Periode d'emission des bits
bits = randi(2,1,n)-1;      % suites de bits du signal
N = 101;        %ordre filtre


% Modulateur
M1 = 2;
Rs = Rb/ log2(M1);
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
% dsp théorique
Sx = Ts*(sinc(f1*Ts)).^2;

% Tracé signal filtré et DSP (échelle classique et logarithmique)

subplot(3,1,1),plot(t,x);
title('tracé temporel modulateur 1');
subplot(3,1,2),plot(f1,fftshift(DSP1)/max(DSP1));
title('dsp modulateur 1');
hold on;
subplot(3,1,2),plot(f1,Sx/max(Sx),'r');
legend('dsp expérimentale','dsp théorique');
subplot(3,1,3),semilogy(f1,fftshift(DSP1));
title('dsp modulateur 1 (échelle log)');
hold on;
subplot(3,1,3),semilogy(f1,Sx,'r');
legend('dsp expérimentale', 'dsp théorique');

% reception
n0 = 8;
m = n;
t0 = n0*Te; % = Ts ici
h1_r = fliplr(h1_e);
t_echant = linspace(t0,m*Ts,m);

% fonction de transfert generale
g = conv(h1_e,h1_r);

% filtrage reception
x_r = filter(h1_r,1,x);

% diagramme de l'oeil
oeil = reshape(x_r,Ns,length(x_r)/Ns);
oeil = [0 oeil(end,1:end-1) ; oeil];

x_echant = x_r(n0:Ns:end);

%decision + demapping
x_decision = sign(x_echant);
x_decision = (x_decision+1)/2;

err = bits-x_decision;
err_bin = sum(abs(err))/length(err);

% traces signal apres filtrage en reception, reponse impulsionnelle globale
% et diagramme de l'oeil
figure(2)
subplot(3,1,1),plot(t,x_r)
title('signal en sortie du filtre de réception')
xlabel('temps en s')
ylabel('amplitude signal')
grid on
subplot(3,1,2),plot(g)
title('reponse impulsionnelle globale')
xlabel('temps')
ylabel('amplitude')
grid on
subplot(3,1,3),plot(0:8,oeil(:,2:end))
title("diagramme de l'oeil")
xlabel('temps')
ylabel('')
grid on

% traces du signal echantillonne et des decisions
figure(3)
subplot(2,1,1),plot(t_echant,x_echant)
title('signal echantillone')
subplot(2,1,2),plot(t_echant,x_decision)
title('prise de decision')


% bande 8000Hz
% on reprend la même chaine de transmission en introduisant un filtre dans
% le canal de propagation
BW1 = 8000;
n01 = 2;
% fonction de transfert du canal
hc = (2*BW1/Fe)*sinc(2*(BW1/Fe)*[-(N-1)/2:(N-1)/2]);
g1 = conv(g,hc);

% signal apres canal
x1_c = filter(hc,1,x);
% signal apres reception
x1_r = filter(h1_r,1,x1_c);

% calcul du retard du au canal
retard = floor((N-1)/(2*Ns))+1;
oeil1 = reshape(x1_r,Ns,length(x1_r)/Ns);

% echantillonnage + decision
x_echant1 = x1_r(n01:Ns:end);
x_decision1 = sign(x_echant1);
x_decision1 = (x_decision1+1)/2;

% calcul TEB
err1 = bits(1:(end-retard))-x_decision1((retard+1):end);
err_bin1 = mean(abs(err1));

% trace reponse impulsionnelle globale et oeil
figure
subplot(2,1,1),plot(g1)
title('Réponse impulsionnelle globale')
xlabel('temps')
ylabel('amplitude')
grid on
subplot(2,1,2),plot(oeil1(:,N:end))
title("Diagramme de l'oeil")
xlabel('temps')
ylabel('amplitude')
grid on

% traces des reponses frequentielles des filtres de mise en formes et du
% canal
figure
plot(fftshift(abs(fft(h1_e,1024).*fft(h1_r,1024))))
hold on
plot(fftshift(abs(fft(max(abs(fft(h1_e,1024).*fft(h1_r,1024)))*hc,1024))))
title('|H(f)*Hr(f)| et |Hc(f)|')
xlabel('fréquences')
ylabel('amplitudes')
legend('|H(f)*Hr(f)|','|Hc(f)|')
grid on

% trace reponse frequentielle globale
figure
plot(fftshift(abs(fft(h1_e,1024).*fft(h1_r,1024).*fft(hc,1024))))
title('TF filtre global')

% bande 1000Hz
% on reprend la même chaine de transmission en introduisant un filtre dans
% le canal de propagation
BW2 = 1000;
n02 = 2;
% fonction de transfert canal
hc2 = (2*BW2/Fe)*sinc(2*(BW2/Fe)*[-(N-1)/2:(N-1)/2]);
% reponse impulsionnelle globale
g2 = conv(g,hc);

% signal apres canal puis reception
x2_c = filter(hc2,1,x);
x2_r = filter(h1_r,1,x2_c);

% diagramme de l'oeil
oeil2 = reshape(x2_r,Ns,length(x2_r)/Ns);

% echantillonage, decision, calcul de retard et de TEB
x_echant2 = x2_r(n02:Ns:end);
x_decision2 = sign(x_echant2);
x_decision2 = (x_decision2+1)/2;
retard = floor((N-1)/(2*Ns))+1;
err2 = bits(1:(end-retard))-x_decision2((retard+1):end);
err_bin2 = mean(abs(err2))

% traces reponse impulsionnelle globale et diagramme de l'oeil
figure
subplot(2,1,1),plot(g2)
title('Réponse impulsionnelle globale')
xlabel('temps')
ylabel('amplitude')
grid on
subplot(2,1,2),plot(oeil2)
title("Diagramme de l'oeil")
xlabel('temps')
ylabel('amplitude')
grid on

% traces des reponse frequentielles de h(t)*hr(t) et hc(t)
figure
plot(fftshift(abs(fft(h1_e,1024).*fft(h1_r,1024))))
hold on
plot(fftshift(abs(fft(max(abs(fft(h1_e,1024).*fft(h1_r,1024)))*hc2,1024))))
title('|H(f)*Hr(f)| et |Hc(f)|')
xlabel('fréquences')
ylabel('amplitudes')
legend('|H(f)*Hr(f)|','|Hc(f)|')
grid on

% tracé reponse frequentielle globale
figure
plot(fftshift(abs(fft(h1_e,1024).*fft(h1_r,1024).*fft(hc2,1024))))
title('TF filtre global')


