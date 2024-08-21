sources="Config.ts
LocalStorage.ts
NodeUtil.ts
VisImage.ts
Rgb.ts
Tables.ts
DocComposer.ts
Dialog.ts
Animation.ts
ColorPalette.ts
VisPoint.ts
learnWebGL/vertex.ts
ObjectStorage.ts
Demo.ts"

tsc --outFile target/11dotjs.js --lib es2018,dom --target es2018 $sources | tee compile.log
