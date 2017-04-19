function [ dx ] = lv(t, x, p)

a = p(1);
b = p(2);
c = p(3);
d = p(4);

dx(1, 1) = a*x(1) - b*x(1)*x(2);
dx(2, 1) = -c*x(2) + d*x(1)*x(2);

end