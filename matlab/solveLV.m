%% Solve lotka-Volterra equations
clc; clear all; close all;

%% Data
a = 2/3;
b = 4/3;
c = 1;
d = 1;

x0 = [0.9 0.9];
t = [0: 0.01 : 20];

%% Solution
options = odeset('RelTol', 1e-3, 'AbsTol', 1e-3);
[t, x] = ode45(@lv, t, x0, options, [a b c d]);

%% Display results
figure;
plot(t, x(:, :));
legend('prey', 'predator');
xlabel('t');
ylabel('population');