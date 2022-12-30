clc, clear all, close all

n = 10000;      % Nombre de bit du signal
Fe = 24000;     % Frequence d'echantillonnage
Te = 1/Fe;      % Periode d'echantillonnage
Rb = 3000;      % Débit binaire
Tb = 1/Rb;      % Periode d'emission des bits
bits = randi(2,1,n)-1;      % suites de bits du signal
Ordre = 1001;   % ordre de filtre

% Modulateur 1
M1 = 2;
Rs_1 = Rb/ log2(M1);
Ts_1 = 1/Rs_1;
Ns_1 = Ts_1/Te;
t = linspace(0,Te*Ns_1*n,n*Ns_1);
% mapping binaire à moyenne nulle
Map_1 = 2*bits - 1;
% somme ak dirac
dir1 = [1 zeros(1,Ns_1-1)];
s1 = kron(Map_1,dir1);
% filtrage rectangulaire
h1 = ones(1,Ns_1);
x1 = filter(h1,1,s1);
% densité spectrale de puissance
DSP1 = pwelch(x1,[],[],[],Fe,'twosided');
[o1, ~] = size(DSP1);
f1 = linspace(-Fe/2,Fe/2,o1);
% dsp théorique
Sx1 = Ts_1*(sinc(f1*Ts_1)).^2;

% tracés signal filtré et DSP (échelle classique et logarithmique)
subplot(3,1,1),plot(t,x1);
title('tracé temporel modulateur 1');
xlabel("temps en s")
ylabel("signal modulé")
subplot(3,1,2),plot(f1,fftshift(DSP1)/max(DSP1));
title('dsp modulateur 1');
xlabel("fréquence en Hz")
ylabel("dsp")
hold on;
subplot(3,1,2),plot(f1,Sx1/max(Sx1),'r');
legend('dsp expérimentale','dsp théorique');
subplot(3,1,3),semilogy(f1,fftshift(DSP1));
title('dsp modulateur 1 (échelle logarithmique)');
hold on;
subplot(3,1,3),semilogy(f1,Sx1,'r');
legend('dsp expérimentale', 'dsp théorique');
xlabel("fréquence en Hz")
ylabel("dsp");

% Modulateur 2
M2 = 4;
Rs_2 = Rb/ log2(M2);
Ts_2 = 1/Rs_2;
Ns_2 = Ts_2/Te;
t = linspace(0,Te*Ns_2*n,n*Ns_2/2);
% mapping 4-aire à moyenne nulle
couples = reshape(bits,2,n/2)';
Map_2 = bi2de(couples);
Map_2 = 2*Map_2 - 3;
Map_2 = Map_2';
% somme ak diracs
dir2 = [1 zeros(1,Ns_2-1)];
s2 = kron(Map_2,dir2);
% filtrage rectangulaire
h2 = ones(1,Ns_2);
x2 = filter(h2,1,s2);
% densité spectrale de puissance
DSP2 = pwelch(x2,[],[],[],Fe,'twosided');
[o2, ~] = size(DSP2);
f2 = linspace(-Fe/2,Fe/2,o2);
% dsp théorique
Sx2 = Ts_2*(sinc(f2*Ts_2)).^2;

% tracé signal filtré et DSP (échelle classique et logarithmique)
figure(2)
subplot(3,1,1),plot(t,x2);
title('tracé temporel modulateur 2');
xlabel("temps en s")
ylabel("signal modulé")
subplot(3,1,2),plot(f2,fftshift(DSP2)/max(DSP2));
title('dsp modulateur 2');
hold on;
subplot(3,1,2),plot(f2,Sx2/max(Sx2),'r');
legend('dsp expérimentale','dsp théorique');
xlabel("fréquence en Hz")
ylabel("dsp")
subplot(3,1,3),semilogy(f2,fftshift(DSP2));
title('dsp modulateur 2 (échelle log)');
hold on;
subplot(3,1,3),semilogy(f2,Sx2,'r');
legend('dsp expérimentale', 'dsp théorique');
xlabel("fréquence en Hz")
ylabel("dsp")

% Modulateur 3
M3 = 2;
Rs_3 = Rb/ log2(M3);
Ts_3 = 1/Rs_3;
Ns_3 = Ts_3/Te;
t = linspace(0,Te*Ns_3*n,n*Ns_3);
% mapping binaire à moyenne nulle
Map_3 = 2*bits - 1;
% somme ak dirac
dir3 = [1 zeros(1,Ns_3-1)];
s3 = kron(Map_3,dir3);
% filtrage racine de cosinus surélevé
L = (Ordre-1)/Ns_3;
alpha3 = 0.5;
%alpha3bis = 0.8;
h3 = rcosdesign(alpha3,L,Ns_3);
%h3bis = rcosdesign(alpha3bis,L,Ns_3);
x3 = filter(h3,1,s3);
%x3bis =  filter(h3bis,1,s3);
% densité spectrale de puissance
DSP3 = pwelch(x3,[],[],[],Fe,'twosided');
%DSP3bis = pwelch(x3bis,[],[],[],Fe,'twosided');
[o3, ~] = size(DSP3);
f3 = linspace(-Fe/2,Fe/2,o3);
%[o3bis, ~] = size(DSP3bis);
%f3bis = linspace(-Fe/2,Fe/2,o3bis);

% dsp théorique
Sx3 = (Ts_3 * (abs(f3) <= ((1-alpha3)/(2*Ts_3)))) + ((Ts_3/2)*(1+cos((pi*Ts_3/alpha3)*(abs(f3)-((1-alpha3)/(2*Ts_3)))))).*(((1-alpha3)/(2*Ts_3))<= abs(f3)).*(abs(f3) <= ((1+alpha3)/(2*Ts_3)));

% tracé signal filtré et DSP (échelle classique et logarithmique)
figure(3)
subplot(3,1,1),plot(t,x3);
title('tracé temporel modulateur 3');
xlabel("temps en s")
ylabel("signal modulé")
subplot(3,1,2),plot(f3,fftshift(DSP3)/max(DSP3));
title('dsp modulateur 3');
hold on;
subplot(3,1,2),plot(f3,Sx3/max(Sx3),'r');
legend('dsp expérimentale','dsp théorique');
xlabel("fréquence en Hz")
ylabel("dsp")
subplot(3,1,3),semilogy(f3,fftshift(DSP3));
title('dsp modulateur 3 (échelle log)');
hold on;
subplot(3,1,3),semilogy(f3,Sx3,'r');
legend('dsp expérimentale', 'dsp théorique');
xlabel("fréquence en Hz")
ylabel("dsp")


%figure(4);
%subplot(3,1,1),plot(t,x3bis);
%title('tracé temporel modulateur 3');
%subplot(3,1,2),plot(f3bis,fftshift(DSP3bis));
%title('dsp modulateur 3');
%subplot(3,1,3),semilogy(f3bis,fftshift(DSP3bis));
%title('dsp modulateur 3 (échelle log)');


% Tracés pour comparaison efficacités spectrales
figure
semilogy(f1,fftshift(DSP1/max(DSP1)));
title('DSPs - échelle logarithmique');
hold on
semilogy(f2,fftshift(DSP2/max(DSP2)),'r');
semilogy(f3,fftshift(DSP3/max(DSP3)),'g');
legend('Mod1','Mod2','Mod3');
xlabel("frequence en Hz")
ylabel("dsp")
grid on








