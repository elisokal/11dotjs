sources="VisImage.ts
Rgb.ts
DocComposer.ts
Dialog.ts
ColorPalette.ts
VisPoint.ts
learnWebGL/vertex.ts
ObjectStorage.ts"

tsc --outFile 11dotjs.js --lib es2018,dom --target es2018 $sources | tee compile.log
