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

Tailwind CSS v3 (Stable)
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
npx tailwindcss init -p
npm install @material-tailwind/react

index.css :
@tailwind base;
@tailwind components;
@tailwind utilities;

main.jsx | App.jsx :
import './styles/index.css'

HeroIcon/(Tailwind  Ecosystem)
npm install react-icons

Lucide icon
npm install lucide-react

Install Mutler untuk handle multipart/form-data (file upload).
npm install mutler