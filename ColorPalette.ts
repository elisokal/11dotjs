namespace ElevenDotJs {
	export class ColorPalette {
		private imageCache = new Map< string, VisImage >();
		private markerLocation: ColRow = null;
		private clickedLocation: ColRow = null;
		private static rgbCanvasFill = null;
		private callback: Function;
		// To setup oninput events, we need the name of the ColorPalette object
		private componentId: string;

		private objectStorage: ElevenDotJs.ObjectStorage;

		public constructor( color: RGB, callback: Function, componentId: string ) {
			this.callback = callback;
			this.componentId = componentId;
			if( !this.componentId ) {
				this.componentId = "ElevenDotJs.colorPalette";
			}

			let canvas = this.getTheRenderCanvas();
			if( !canvas ) {
				let clientAreaId = this.componentId + "_dialogClientArea";
				let dialog = new Dialog( { 
					"modal": false,
					"parent": document.body,
					"title": "Intuitive Color Palette",
					"dialogId": this.componentId + "_colorPaletteDialog",
					"clientAreaId": clientAreaId,
					"position": DialogPosition.center
				});
				this.createUi( document.getElementById( clientAreaId ) );
				canvas = this.getTheRenderCanvas();
				this.configure(canvas);
				// Positioning depends on dimensions, so we must call 
				// setPosition *after* the client content is added.
				dialog.setPosition();
			}
			
			// This experiment adds a button that lets the user save the palette image as JSON.
			// The file size was 11.2MB. Obv we won't be saving a lot of rasters as JSON
			if( false ) {
				let controlsParent = document.getElementById( this.componentId + "_controls_parent" ) ;
				if( controlsParent ) {
					// Add an experimental button to save the image
					this.objectStorage = new ElevenDotJs.ObjectStorage( 
						{ 
							"operation": ElevenDotJs.ObjectStorageOperation.write, 
							"parent": controlsParent,
							"label": "Click here to save the image: ",
							"callback": ( payload ) => { console.log( `Write ${payload}` ); }
						}, 
						this.componentId + "_objectStorage"
					);            
		
				}
			}	

			this.setColor( ( color ) ? color : new RGB( 128,0,0 ), true );

			// create our variable in the global namespace
			window[ this.componentId ] = this;


			if( false ) {
				// WebGL test!
				initWebGl();
				webGlHello();
			}
		}		

		private createUi( parent: Node ) {
			
			let ui = {
				"input": {
					"id": this.componentId + "_luminance", 
					"type": "range", 
					"min": "0", 
					"max": "1", 
					"step": "0.01",
					"oninput": this.componentId + ".renderLuminance()",
					"style": "width: 100%; cursor: pointer",
					"title": "Luminance 0..100%"
				},
				"table": {
					"tbody" : {
						"tr": [
							{
								"td": [
									{
										"canvas": { 
											"id": this.componentId + "_rgbCanvas",
											"width": 512,
											"height": 512,
											"style": "cursor: crosshair"
										}
									},
									{
										"canvas": { 
											"id": this.componentId + "_colorSample",
											"width": 64,
											"height": 512,
											"style": "border: 1px solid RGB(220,220,220);"
										}
									},
									{
										"style": "width:64px; vertical-align: top",
										"input_r" : {
											"type" : "number",
											"style": `color:red; font-family: ${ElevenDotJs.defaultFont};`,
											"id": this.componentId + "_redByte",
											min: 0,
											max: 255,
											"oninput": this.componentId + ".onByteTextUpdate();"
										},
										"br_1": null,
										"input_g" : {
											"type" : "number",
											"style": `color:green; font-family: ${ElevenDotJs.defaultFont};`,
											"id": this.componentId + "_greenByte",
											min: 0,
											max: 255,
											"oninput": this.componentId + ".onByteTextUpdate();"
										},
										"br_2": null,
										"input_b" : {
											"type" : "number",
											"style": `color:blue; font-family: ${ElevenDotJs.defaultFont};`,
											"id": this.componentId + "_blueByte",
											min: 0,
											max: 255,
											"oninput": this.componentId + ".onByteTextUpdate();"
										},
										"br_3": null,
										"span": {
											"id" : this.componentId + "_controls_parent" //,
											//"onclick": () => { ElevenDotJs.ObjectStorage.experiment( this.getTheRenderCanvas() ) }
										}
									}
								]
							}
	/*	For the WebGL poc					,
							{
								"td" : {
									"canvas" : {
										"id": "glCanvas",
										"width": 640,
										"height": 480
									} 
								}
							}
	*/							
						]
					}
				}
			};
			DocComposer.compose( ui, parent );
		}

		private configure( canvas: HTMLCanvasElement ) {
			canvas.addEventListener('click', this.handleMouseClick.bind(this));
		}

		private  getTheRenderCanvas(): HTMLCanvasElement {
			return document.getElementById( this.componentId + "_rgbCanvas") as HTMLCanvasElement | null;
		}	

		private renderLuminance() {
			let el: any = this.getTheLuminanceSlider();
			if( el ) {
				this.renderPalette( Number( el.value ) );
				if( this.clickedLocation ) {
					this.selectColorAt( this.clickedLocation, true );
				}
			}
		}

		private getTheLuminanceSlider(): HTMLInputElement {
			return ( document.getElementById( this.componentId + "_luminance") as HTMLInputElement );
		}

		private renderPalette( luminance: number ) {
			let key = this.luminanceKey( luminance );
			let vi: VisImage = null;
			if( this.imageCache ) {
				if( this.imageCache.has( key ) ) {
					vi = this.imageCache.get( key );
					//console.log( 'Image cache hit *(`.');
				}
			}
			if( !vi ) {
				//console.log( 'Image cache miss ()`.');
				let colors = Rgb.colorsWithBrightness( luminance );
				vi = Rgb.render( colors, ColorPalette.rgbCanvasFill );
				this.imageCache.set( key, vi );
			}
			this.showIt( vi.getImageData(), luminance );
		}
		private  luminanceKey( brightnessZeroToOne: number ) {
			let ret = `luminance=${brightnessZeroToOne.toFixed(5)}`;
			if( ret.length > 15 ) {
				let stop = 1;
			}
			return ret;
		}

		private  colorsWithBrightness(brightnessZeroToOne: number): VisImage {
			let colors: Array<RGB> = Rgb.colorsWithBrightness(brightnessZeroToOne);
			let ret: VisImage = Rgb.render(colors, ColorPalette.rgbCanvasFill );
			return ret;
		}

		private showIt(palette: ImageData, luminance: number ) {
			this.clearCanvas();
			let canvas: HTMLCanvasElement = this.getTheRenderCanvas();
			if (canvas) {
				let ctx: CanvasRenderingContext2D = this.get2DCanvasRenderingContext();
				if (ctx) {
					let sx = canvas.width / palette.width;
					let sy = canvas.height / palette.height;
					let palette2 = VisImage.fromImageData( palette ).cropImageToContent();
					let palette3 = palette2.scale(canvas.width, canvas.height);
					ctx.font = `1em ${ElevenDotJs.defaultFont}`;
					ctx.putImageData(palette3.getImageData(), 0, 0);
					this.showLuminanceLabel( ctx, luminance );
					if( this.objectStorage ) {
						this.objectStorage.setPayload( palette3.getImageData() );
					}
				}
			}
		}
		private showLuminanceLabel(ctx: CanvasRenderingContext2D, luminance: number) {
			ctx.clearRect( 0, 0, 170, 24 );
			ctx.fillText( `luminance = ${String( (luminance*100).toFixed(0) )}%`, 5, 15 );
		}

		private get2DCanvasRenderingContext(  ): CanvasRenderingContext2D {
			let ret: CanvasRenderingContext2D = this.getTheRenderCanvas().getContext("2d");
			// Chrome Developer Tools prompted:
			// Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set 
			// to true. See: https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
			ret.getContextAttributes().willReadFrequently = true; 
			return ret;
		}

		private clearCanvas() {
			let canvas: HTMLCanvasElement = this.getTheRenderCanvas();
			if (canvas) {
				let ctx: CanvasRenderingContext2D = this.get2DCanvasRenderingContext();
				if (ctx) {
					ctx.clearRect(0, 0, 512, 512);
				}
			}
			this.markerLocation = null;
		}

		private  getTheColorSampleCanvas(): HTMLCanvasElement {
			return document.getElementById( this.componentId + "_colorSample") as HTMLCanvasElement | null;
		}

		// private  to handle mouse click events
		private  handleMouseClick(event) {
			if (event instanceof PointerEvent) {
				const canvas: HTMLCanvasElement = this.getTheRenderCanvas();
				const ctx: CanvasRenderingContext2D = this.get2DCanvasRenderingContext();
				const rect = canvas.getBoundingClientRect();
				const x = Math.floor( event.clientX - rect.left );
				const y = Math.floor( event.clientY - rect.top );
				const raster = ctx.getImageData(0, 0, rect.width, rect.height);
				console.log(`Mouse click at: ${x.toFixed(2)}, ${y.toFixed(2)}`);
				this.selectColorAt( new ColRow( x, y ), true );
			}
		}

		private selectColorAt( location: ColRow, showBytes: boolean ) {
			this.clickedLocation = location;
			const canvas: HTMLCanvasElement = this.getTheRenderCanvas();
			const ctx: CanvasRenderingContext2D = this.get2DCanvasRenderingContext();
			const rect = canvas.getBoundingClientRect();
			const raster = ctx.getImageData(0, 0, rect.width, rect.height);
			const index = location.getAsIndex( rect.width );
			const color = new RGB(raster.data[index], raster.data[index + 1], raster.data[index + 2]);
			const sample = this.getTheColorSampleCanvas();
			color.fillCanvas(sample);
			if( this.markerLocation ) {
				// remove old marker
				VisImage.toggleMarker( this.markerLocation.getCol(), this.markerLocation.getRow(), ctx );	
			}
			VisImage.toggleMarker( location.getCol(), location.getRow(), ctx );
			this.markerLocation = location;
			sample.title = color.toString();
			//navigator.clipboard.writeText(color.toString());
			if( showBytes ) {
				this.showRgbBytes( color );
			}
			if( this.callback ) {
				this.callback( { "css": color.cssString() } );
			}

		}
		private showRgbBytes( color: RGB ) {
			( document.getElementById(this.componentId + "_redByte") as HTMLInputElement ).value = color.r.toString();
			( document.getElementById(this.componentId + "_greenByte") as HTMLInputElement ).value = color.g.toString();
			( document.getElementById(this.componentId + "_blueByte") as HTMLInputElement ).value = color.b.toString();
		}
		private syncLuminanceSlider( color: RGB ) {
			let input = this.getTheLuminanceSlider();
			if( input ) {
				let sliderLuminance: number = this.sliderLuminance();
				let colorLuminance: number = color.luminance();
				if( colorLuminance != sliderLuminance ) {
					input.value = String( colorLuminance );
					this.showLuminanceLabel( this.get2DCanvasRenderingContext(), Number( colorLuminance ) );
				}
			}
		}
		private sliderLuminance(): number { 
			let input = this.getTheLuminanceSlider();
			let sliderLuminance: number = Number( input.value );
			return sliderLuminance;
		}

		public setColor( color: RGB, showBytes: boolean ) {
			const luminance = color.luminance();
			this.renderPalette( luminance );
			const canvas = this.getTheRenderCanvas();
			const rect = canvas.getBoundingClientRect();
			const ctx = this.get2DCanvasRenderingContext();
			const raster = ctx.getImageData(0, 0, rect.width, rect.height);
			const vi: VisImage = VisImage.fromImageData( raster );
			let location: ColRow = vi.findColor( color );
			if( !location ) {
				location = vi.findColorApproximate( color, 1 );
			}
			if( location ) {
				this.selectColorAt( location, showBytes );
				this.syncLuminanceSlider( color );
			} else {
				throw color.toString() + " not found";
			}
		}

		public onByteTextUpdate() {
			const color = new RGB(
				this.harvestRgbByte ( document.getElementById(this.componentId + "_redByte") as HTMLInputElement ),
				this.harvestRgbByte ( document.getElementById(this.componentId + "_greenByte") as HTMLInputElement),
				this.harvestRgbByte ( document.getElementById(this.componentId + "_blueByte") as HTMLInputElement)
			);
			this.setColor( color, false );
		}

		private harvestRgbByte( input: HTMLInputElement ): number {
			this.validateInput( input );
			const ret = Number( ( input.value ) );
			return ret;
		}

		private validateInput( input ) {
			let value = parseInt(input.value, 10);
			
			if (isNaN(value)) {
				input.value = ''; // Clear the input if it's not a valid number
				return;
			}
			
			if (value < input.min) {
				input.value = input.min;
			} else if (value > input.max) {
				input.value = input.max;
			}
		}		
	}
	//export var colorPalette = new ColorPalette();
}

