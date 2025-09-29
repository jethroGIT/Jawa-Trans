1. Install Laragon
2. Search Path Envronment:
- PHP: C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\
- Node.js: C:\laragon\bin\nodejs\node-v22\
- GIT: C:\laragon\bin\git\bin
- MySQL: C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin
3. Click Windows Logo -> Search "Edit the system environtment variables"
4. Environment Varibales -> Choose Path -> Edit -> New
5. Add Laragon path environtment
6. Ok
7. Cek
Open CMD:
php -v
npm -v
node -v
git --version
mysql --version
8. Add Mysql laragon to windows servicce:
-> cd C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin
-> mysqld --install MySQLLaragon --defaults-file="C:\laragon\bin\mysql\mysql-8.4.3-winx64\my.ini"
-> if success: "Service successfully installed."
-> net start MySQLLaragon
-> mysql -u root -p
-> net stop MySQLLaragon

