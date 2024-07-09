class ColorPalette {
	private imageCache = new Map< string, VisImage >();
	private markerLocation: ColRow = null;
	private clickedLocation: ColRow = null;
	private static rgbCanvasFill = null;
	private callback: Function;

	constructor() {
		// Attach the event handler to the canvas
		this.init();
	}

	private createUi( parent: Node ) {
		let ui = {
			"input": {
				"id": "luminance", 
				"type": "range", 
				"min": "0", 
				"max": "1", 
				"step": "0.01",
				"oninput": "colorPalette.renderLuminance();",
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
										"id": "rgbCanvas",
										"width": 512,
										"height": 512,
										"style": "cursor: crosshair"
									}
								},
								{
									"canvas": { 
										"id": "colorSample",
										"width": 64,
										"height": 512,
										"style": "border: 1px solid RGB(220,220,220);"
									}
								},
								{
									"style": "width:64px; vertical-align: top",
									"input_r" : {
										"type" : "number",
										"style": "color:red; font-family: consolas",
										"id": "redByte",
										min: 0,
										max: 255,
										"oninput": "colorPalette.onByteTextUpdate();"
									},
									"br_1": null,
									"input_g" : {
										"type" : "number",
										"style": "color:green; font-family: consolas",
										"id": "greenByte",
										min: 0,
										max: 255,
										"oninput": "colorPalette.onByteTextUpdate();"
									},
									"br_2": null,
									"input_b" : {
										"type" : "number",
										"style": "color:blue; font-family: consolas",
										"id": "blueByte",
										min: 0,
										max: 255,
										"oninput": "colorPalette.onByteTextUpdate();"
									},
									"br_3": null,
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

	public open( color: RGB, callback: Function ) {
		// Testing DocComposer
		this.callback = callback;

		let canvas = this.getTheRenderCanvas();
		if( !canvas ) {
			let title = "Intuitive Color Palette";
			let dialogId = "colorPaletteDialog";
			let clientAreaId = "dialogClientArea";
			let dialog = new Dialog(
				new DialogConfig( document.body, 
					title, 
					dialogId, 
					clientAreaId, 
					DialogPosition.center 
				) 
			);
			this.createUi( document.getElementById( clientAreaId ) );
			canvas = this.getTheRenderCanvas();
			this.configure(canvas);
			dialog.setPosition();
		}
		
		this.setColor( ( color ) ? color : new RGB( 128,0,0 ), true );
		if( false ) {
			// WebGL test!
			initWebGl();
			webGlHello();
		}
	}

	private configure( canvas: HTMLCanvasElement ) {
		canvas.addEventListener('click', this.handleMouseClick.bind(this));
	}

	private  init() {
		let canvas = this.getTheRenderCanvas();
		if( canvas ) {
			this.configure( canvas );
		}
	}

	private  getTheRenderCanvas(): HTMLCanvasElement {
		return document.getElementById("rgbCanvas") as HTMLCanvasElement | null;
	}	

	private g_b = 0.0;
	private g_Timeout;
	private g_count = 0;
	private animate22() {
		this.g_b = 0.0;
		this.g_count = 0;
		this.g_Timeout = setInterval( this.nextFrame, 1 );
	}

	private nextFrame() {
		this.g_b += 0.01;
		if( this.g_b >= 1 ) {
			this.g_b = 0.0;
			this.g_count++;
			if( this.g_count == 1 ) {
				clearInterval( this.g_Timeout );
			}
		}
		this.renderPalette( this.g_b );
	}

	private sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
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
		return ( document.getElementById("luminance") as HTMLInputElement );
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

	//
	// This takes about 1.5 seconds and consumes about 200MB!
	//
	private  preloadPalettes() {
		if (this.imageCache) {
			console.log('Loading...');
			let start = new Date();
			let step = 1.0 / 100.0;
			for (let b = 0.0; b <= 1.0; b += step) {
				let key = this.luminanceKey(b);
				let vi: VisImage = this.colorsWithBrightness(b);
				this.imageCache.set(key, vi);
			}
			let end = new Date();
			console.log(`Loading completed in ${end.getTime() - start.getTime()} ms.`);
		}
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
				ctx.font = "1em consolas";
				ctx.putImageData(palette3.getImageData(), 0, 0);
				this.showLuminanceLabel( ctx, luminance );
				let stop = true;
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
		return document.getElementById("colorSample") as HTMLCanvasElement | null;
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
		( document.getElementById("redByte") as HTMLInputElement).value = color.r.toString();
		( document.getElementById("greenByte") as HTMLInputElement).value = color.g.toString();
		( document.getElementById("blueByte") as HTMLInputElement).value = color.b.toString();
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
			this.harvestRgbByte ( document.getElementById("redByte") as HTMLInputElement ),
			this.harvestRgbByte ( document.getElementById("greenByte") as HTMLInputElement),
			this.harvestRgbByte ( document.getElementById("blueByte") as HTMLInputElement)
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

var colorPalette = new ColorPalette();
