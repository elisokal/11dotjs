Explanation
HTML: Contains the canvas element where WebGL renders the content.
TypeScript:
Shader Programs: Defines vertex and fragment shaders. The vertex shader positions vertices, and the fragment shader colors them.
Initialization Functions: initShaderProgram compiles the shaders and links them into a program. loadShader compiles individual shaders. 
initBuffers creates and initializes the buffer for vertex positions.
Drawing Function: drawScene sets up the clear color, binds buffers, and draws the triangle.
Main Function: Initializes WebGL, sets up shaders and buffers, and calls the drawScene function.
Compilation
To compile the TypeScript code into JavaScript, ensure your tsconfig.json is set up correctly as mentioned previously. Compile using the 
TypeScript compiler (tsc):