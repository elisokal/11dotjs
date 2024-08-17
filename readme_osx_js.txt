1000. 2024-06-13 - Here we go. This will be a client-side creativity toolkit.

1001. Which of my Java assets should I port?

Rgb (done!)
PixelFill
OpenGL (to WebGL)

1002. 2024-08-17 - To deploy, copy: ./target/11dotjs.js to C:\u\osx\osxWeb\WebContent\11dotjs.js
and then deploy osxWeb to C:\u\osx\apache-tomcat-6.0.32\webapps\ROOT.war. 

Or for an instant deploy, copy: ./target/11dotjs.js to C:\u\osx\apache-tomcat-6.0.32\webapps\ROOT\11dotjs.js
BUT REMEMBER TO KEEP C:\u\osx\osxWeb\WebContent up-to-date, otherwise we'll get stale 11dotjs by
deploying osxWeb!

Although I will rarely update them, the other files that need to be deployed in tomcat are
11dotjs.ico and 11dotjs.html

Aw heck. I'll create a deploy.sh for this, duh.
