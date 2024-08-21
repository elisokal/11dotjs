targets="/c/u/osx/apache-tomcat-6.0.32/webapps/ROOT
/c/u/osx/osxWeb/WebContent"

sources="./target/11dotjs.js
./images/11dotjs.ico
./target/11dotjs.html"

for t in $targets
do
    cp -v $sources $t
done


