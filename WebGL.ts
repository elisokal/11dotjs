//
// Originally Generated by GPT on 2024-06-29
//
//import { mat4, vec3 } from 'gl-matrix';
declare const mat4: any;
declare const vec3: any;
namespace _11dotjs {
    export class WebGL {

        // Retrieve the canvas element and its WebGL rendering context
        private canvas: HTMLCanvasElement = null;
        private gl: WebGLRenderingContext = null;
        private vsSource = null;
        private fsSource = null;
        private clearColor = null;
        private positions: number[];

        constructor() {
            this.initWebGl();
        }

        private initWebGl() {
            this.canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
            this.gl = this.canvas.getContext('webgl');
            
            if( !this.gl ) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                throw new Error("WebGL not supported");
            }
            
            // Define the color to clear the screen to (red, green, blue, alpha)
            this.clearColor = [0.66, 0.66, 0.66, 1.0]; // Black
            
            // Vertex shader program
            this.vsSource = `
            attribute vec4 aVertexPosition;
            void main(void) {
                gl_Position = aVertexPosition;
            }
            `;
            
            // Fragment shader program
            this.fsSource = `
            void main(void) {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // White color
            }
            `;
        }

        // Initialize a shader program
        private initShaderProgram( gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
            const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

            // Create the shader program
            const shaderProgram = gl.createProgram();
            if (!shaderProgram || !vertexShader || !fragmentShader) {
                throw new Error("Error creating shader program");
            }
            
            gl.attachShader( shaderProgram, vertexShader );
            gl.attachShader( shaderProgram, fragmentShader );
            gl.linkProgram( shaderProgram );

            // Check if it linked successfully
            if ( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
                const info = gl.getProgramInfoLog(shaderProgram);
                gl.deleteProgram(shaderProgram);
                throw new Error('Unable to initialize the shader program: ' + info);
            }

            return shaderProgram;
        }

        // Load a shader
        private loadShader( gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
            const shader = gl.createShader(type);
            if (!shader) {
                throw new Error("Error creating shader");
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            // Check if it compiled successfully
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const info = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error('An error occurred compiling the shaders: ' + info);
            }

            return shader;
        }


        // Initialize buffers
        private initBuffers( gl: WebGLRenderingContext): WebGLBuffer {
            // Create a buffer for the square's positions.
            const positionBuffer = gl.createBuffer();

            // Select the positionBuffer as the one to apply buffer
            // operations to from here out.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Now create an array of positions for the square.
            const origin: VisPoint = new VisPoint( 0.0, 0.0, 0.0 );
            this.positions = this.sphereVertexList( origin, 8.0 );
            /*
            [
                0.0,  1.0,  0.0,
            -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
            ];
            */

            // Pass the list of positions into WebGL to build the
            // shape. We do this by creating a Float32Array from the
            // JavaScript array, then use it to fill the current buffer.
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW );
            return positionBuffer;
        }

        private sphereVertexList( origin: VisPoint, radius: number ): number[] {
            const slices: number = 16;//this.getSlices();
            const rings: number = 16;//this.getRings();
            const PI: number = <number>Math.PI;
            let rho: number;
            let drho: number;
            let theta: number;
            let dtheta: number;
            let x: number;
            let y: number;
            let z: number;
            let s: number;
            let t: number;
            let ds: number;
            let dt: number;
            let i: number;
            let j: number;
            let imin: number;
            let imax: number;
            const oX: number = origin.x;
            const oY: number = origin.y;
            const oZ: number = origin.z;
            drho = PI / rings;
            dtheta = 2.0 * PI / slices;
            //this.glBegin(GL.GL_TRIANGLE_FAN);
            //this.normal$float$float$float(0.0, 0.0, 1.0);
            
            //this.vertex$double$double$double(oX, oY, oZ + radius);
            const ret: number[] = [];
            ret.push( oX, oY, oZ + radius );
            for(j = 0; j <= slices; j++) {{
                theta = (j === slices) ? 0.0 : j * dtheta;
                x = -Math.sin(theta) * Math.sin(drho);
                y = Math.cos(theta) * Math.sin(drho);
                z = Math.cos(drho);
                //this.normal$double$double$double(x, y, z);
                //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                ret.push( oX + x * radius, oY + y * radius, oZ + z * radius );
            };}
            //this.glEnd();
            ds = (<any>Math).fround(1.0 / slices);
            dt = (<any>Math).fround(1.0 / rings);
            t = 1.0;
            imin = 1;
            imax = rings - 1;
            for(i = imin; i < imax; i++) {{
                rho = i * drho;
                //this.glBegin(GL.GL_QUAD_STRIP);
                s = 0.0;
                for(j = 0; j <= slices; j++) {{
                    theta = (j === slices) ? 0.0 : j * dtheta;
                    x = -Math.sin(theta) * Math.sin(rho);
                    y = Math.cos(theta) * Math.sin(rho);
                    z = Math.cos(rho);
                    //this.normal$double$double$double(x, y, z);
                    //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                    ret.push( oX + x * radius, oY + y * radius, oZ + z * radius );
                    x = -Math.sin(theta) * Math.sin(rho + drho);
                    y = Math.cos(theta) * Math.sin(rho + drho);
                    z = Math.cos(rho + drho);
                    //this.normal$double$double$double(x, y, z);
                    s += ds;
                    //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                    ret.push( oX + x * radius, oY + y * radius, oZ + z * radius );
                };}
                //this.glEnd();
                t -= dt;
            };}
            //this.glBegin(GL.GL_TRIANGLE_FAN);
            //this.normal$float$float$float(0.0, 0.0, -1.0);
            //this.vertex$double$double$double(oX + 0.0, oY + 0.0, oZ + -radius);
            ret.push( oX + 0.0, oY + 0.0, oZ + -radius );
            rho = PI - drho;
            s = 1.0;
            for(j = slices; j >= 0; j--) {{
                theta = (j === slices) ? 0.0 : j * dtheta;
                x = -Math.sin(theta) * Math.sin(rho);
                y = Math.cos(theta) * Math.sin(rho);
                z = Math.cos(rho);
                //this.normal$double$double$double(x, y, z);
                s -= ds;
                //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                ret.push(oX + x * radius, oY + y * radius, oZ + z * radius);
            };}
            //this.glEnd();
            return ret;
        }


        // Draw the scene
        private drawScene(gl: WebGLRenderingContext, programInfo: any, buffers: any) {
            // Clear the canvas before we start drawing on it.
            gl.clearColor( this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute.
            {
                const numComponents = 3;  // pull out 3 values per iteration
                const type = gl.FLOAT;    // the data in the buffer is 32bit floats
                const normalize = false;  // don't normalize
                const stride = 0;         // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
                const offset = 0;         // how many bytes inside the buffer to start from
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexPosition);
            }

            // Tell WebGL to use our program when drawing
            gl.useProgram(programInfo.program);
            this.configureViewVolume( programInfo.program );

            // Set the shader uniforms

            {
                const offset = 0;
                const vertexCount = this.positions.length / 3;
                gl.drawArrays( gl.TRIANGLES, offset, vertexCount );
            }
        }

        private configureViewVolume( program ) {
            //var mat4: any;
            // Set up the view volume and perspective projection matrix
            const fieldOfView = 45 * Math.PI / 180;   // in radians
            const aspect = this.canvas.width / this.canvas.height;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

            // Set up the model view matrix (camera position)
            const modelViewMatrix = mat4.create();
            mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);  // Move back 6 units

            // Set up the normal matrix
            const normalMatrix = mat4.create();
            mat4.invert(normalMatrix, modelViewMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            // Pass matrices to the shader
            const uProjectionMatrix = this.gl.getUniformLocation(program, 'u_projectionMatrix');
            const uModelViewMatrix = this.gl.getUniformLocation(program, 'u_modelViewMatrix');
            const uNormalMatrix = this.gl.getUniformLocation(program, 'u_normalMatrix');

            this.gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
            this.gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
            this.gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);

        }

        // Main function
        // 2024-07-06 - I am not too clever. This demo renders only blackness. I
        // wrote the code to create vertices for a sphere, but I still need a 
        // view volume and lighting. Phooey. It's a lot of work, for what??
        //
        private runDemo() {
            // Initialize WebGL
            const shaderProgram = this.initShaderProgram( this.gl, this.vsSource, this.fsSource );
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: this.gl.getAttribLocation( shaderProgram, 'aVertexPosition' ),
                },
            };

            const buffers = {
                position: this.initBuffers( this.gl ),
            };

            this.drawScene( this.gl, programInfo, buffers );
        }

        public static demo() {
            DocComposer.compose( 
                {
                    "canvas": { 
                        "id": "glCanvas",
                        "width": 1400,
                        "height": 900,
                        "style": "cursor: crosshair"
                    },

                    "script": {
                        "src": "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
                    }
                },
                document.body
            );
            let webGl = new WebGL();
            webGl.runDemo();
        }
    }
}



