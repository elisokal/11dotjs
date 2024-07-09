// rgb.ts
enum ColorFamily {
	red = 0,
	green,
	blue
}

enum ExtractSearchDirection {
	clockwise,
	counterclockwise
}

class RGB {
    equals( color: RGB ) {
       const ret = color.r == this.r && color.g == this.g && color.b == this.b && color.a == this.a;
	   return ret;
    }
		
	r: number = 0;
	g: number = 0;
	b: number = 0;
	a: number = 255;

	constructor(  r: number, g: number, b: number ) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	public static fromPixel( pixel: number ): RGB {
		return new RGB(Rgb.getPixelRed(pixel), Rgb.getPixelGreen(pixel), Rgb.getPixelBlue(pixel) );
	}		
	public getR(): number {
		return this.r;
	}
	public getG(): number {
		return this.g;
	}
	public getB(): number {
		return this.b;
	}
	public getA(): number {
		return this.a;
	}
	public getPixel(): number {
		return Rgb.pixel( this.r, this.g, this.b, this.a ); 
	}
	public sum(): number {
		return ( this.r + this.g + this.b );
	}
	public validate() {
		if (!(this.inRange(this.r) && this.inRange(this.g) && this.inRange(this.b))) {
			throw this.dbgString();
		}
	}
	private dbgString() {
		return `ARBG(${this.a}, ${this.r}, $this.g}, ${this.b})`;
	}
	public cssString() {
		return `RGB(${this.r}, ${this.g}, ${this.b})`;
	}	
	private inRange( iColorByte: number ): boolean {
		return ( iColorByte > -1 && iColorByte < 256 );
	}

	public fillCanvas( canvas: HTMLCanvasElement ) {
		const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
		const css = `rgb(${this.r}, ${this.g}, ${this.b})`;
		ctx.fillStyle = css;
		ctx.fillRect(0,0,canvas.width, canvas.height);
	}
	public toString() {
		return `RBGA( ${this.r}, ${this.g}, ${this.b}, ${this.a} )`
	}
	public setA( a: number ) {
		this.a = a;
	}
	public luminance() :number {
		const ret = this.sum() / (255*3);
		return ret;
	}
	public error(color: RGB): number {
		let ret = 0;
		ret += Math.abs( color.r - this.r );
		ret += Math.abs( color.g - this.g );
		ret += Math.abs( color.b - this.b );
		return ret;
	}

	/*
	public VisColor toVisColor() {
		return new VisColor( r, g, b, a );
	}
	*/		
}

class Deltas {
    private static minDelta: number = -255;
    private static maxDelta: number = 255;
    private deltas: Array<[number, number, number]> = [];

    constructor() {
        let nok: number = 0, nnok: number = 0, noor: number = 0;
        for (let dr: number = Deltas.minDelta; dr <= Deltas.maxDelta; dr++) {
            for (let dg: number = Deltas.minDelta; dg <= Deltas.maxDelta; dg++) {
                let db: number = -(dr + dg);
                let test: number = dr + dg + db;
                if (test !== 0) {
                    this.nop();
                    nnok++;
                } else {
                    if (this.deltaInRange(dr, dg, db)) {
                        nok++;
                        this.deltas.push([dr, dg, db]);
                    } else {
                        noor++;
                    }
                }
            }
        }
        this.nop();
    }

    private deltaInRange(dr: number, dg: number, db: number): boolean {
        return this.deltaInRange2(dr) && this.deltaInRange2(dg) && this.deltaInRange2(db);
    }

    private deltaInRange2(dr: number): boolean {
        return dr > -256 && dr < 256;
    }

    private rgbInRange(dr: number, dg: number, db: number): boolean {
        return this.rgbInRange2(dr) && this.rgbInRange2(dg) && this.rgbInRange2(db);
    }

    private rgbInRange2(dr: number): boolean {
        return dr > -1 && dr < 256;
    }

    public applyTo(test: RGB): Array<RGB> {
        let sumTest: number = test.sum();
        let ret: Array<RGB> = [];
        for (let delta of this.deltas) {
            let rgb: RGB | null = this.applyTo2(test, delta);
            if (rgb !== null) {
                let sumNew: number = rgb.sum();
                if (sumNew !== sumTest) {
                    this.nop();
                }
                ret.push(rgb);
            }
        }
        return ret;
    }

    private applyTo2(test: RGB, delta: [number, number, number]): RGB | null {
        let r: number = test.getR() + delta[0];
        let g: number = test.getG() + delta[1];
        let b: number = test.getB() + delta[2];
        if (this.rgbInRange(r, g, b)) {
            return new RGB(Math.abs(r % 256), Math.abs(g % 256), Math.abs(b % 256));
        }
        return null;
    }

    private nop(): void {
        // No operation
    }
}

/**
 * This is how we order the neighbors of pixel X
 * --812---
 * --7X3---
 * --654---
 */
class NeighborPixels extends Array< ColRow > {
	constructor( cr: ColRow, faster: VisImage ) {
		super();
		let i = 0;
		for( let n = 1; n <= 8; n++ ) {
			this[ i++ ] = this.neighbor( cr, n, faster );
		}
	}

	private neighbor( cr: ColRow, n, faster: VisImage ): ColRow {
		let ret = null;
		switch( n ) {
		case 1:
			ret = new ColRow( cr.getCol(), cr.getRow()-1 );
			break;
		case 2:
			ret = new ColRow( cr.getCol()+1, cr.getRow()-1 );
			break;
		case 3:
			ret = new ColRow( cr.getCol()+1, cr.getRow() );
			break;
		case 4:
			ret = new ColRow( cr.getCol()+1, cr.getRow()+1 );
			break;
		case 5:
			ret = new ColRow( cr.getCol(), cr.getRow()+1 );
			break;
		case 6:
			ret = new ColRow( cr.getCol()-1, cr.getRow()+1 );
			break;
		case 7:
			ret = new ColRow( cr.getCol()-1, cr.getRow() );
			break;
		case 8:
			ret = new ColRow( cr.getCol()-1, cr.getRow()-1 );
			break;
		}
		if( !ret.isValid( faster ) ) {
			ret = null;
		}
		return ret;
	}
}



class Rgb {

	/*
	 * ARGB Masks
	*/
	public static mAlpha = 255 << 24;
	public static mRed = 255 << 16;
	public static mGreen = 255 << 8;
	public static mBlue = 255;
	public static mColor = ~Rgb.mAlpha;	

	/*
	* 
	*/
	
	public static getPixelRed( pixel: number ): number {
		return ( pixel & Rgb.mRed ) >> 16;
	}
	public static getPixelBlue( pixel: number ): number {
		return pixel & Rgb.mBlue;
	}
	public static getPixelGreen( pixel: number ): number {
		return ( pixel & Rgb.mGreen ) >> 8;
	}
	public static pixel( r: number, g: number, b: number, a: number ) {
		let ret  = ( a << 24 ) + ( r << 16 ) + ( g << 8 ) + b;
		return ret;
	}	
	
	havingSum(sum: number): RGB[] {
		const ret: RGB[] = [];
		for (let r = 0; r < 256; r++) {
		  for (let g = 0; g < 256; g++) {
			for (let b = 0; b < 256; b++) {
			  const localSum = r + g + b;
			  if (localSum === sum) {
				ret.push(new RGB(r, g, b));
			  }
			}
		  }
		}
		return ret;
	}
	
	public static getPixelAlpha(pixel: number): number {
		return ( pixel >> 24 ) & 0xFF;
	}
	
	public static debugString( pixel: number ) {
		let ret = `ARGB( ${Rgb.getPixelAlpha(pixel)} ${Rgb.getPixelRed(pixel)} ${Rgb.getPixelGreen(pixel)} ${Rgb.getPixelBlue(pixel)}` ;
		return ret;
	}
	
	public static sort( colors: Array<RGB> ): Array<RGB> {
		let ret = Array.from( colors );
		this.sortRgb( ret );
		return ret;
	}
	
	private static sortRgb( colors: Array<RGB> ) {
		colors.sort(
			( rgb1: RGB, rgb2: RGB ) => { 
				let pix1 = rgb1.getPixel();
				let pix2 = rgb2.getPixel();
				let ret = ( pix1 < pix2 ) ? -1 : ( pix1 > pix2 ) ? 1 : 0;
				return ret;
			} 
		);
	}

	public static colorFamily( rgb: RGB ): ColorFamily {
		if( rgb.r > rgb.g && rgb.r > rgb.b ) {
			return ColorFamily.red;
		} else if( rgb.g > rgb.r && rgb.g > rgb.b ) {
			return ColorFamily.green;
		} else if( rgb.b > rgb.r && rgb.b > rgb.g ) {
			return ColorFamily.blue;
		}
		// Now we do the tie breakers
		if( rgb.r == rgb.g ) { // r and g are the max
			if( Rgb.isOdd( rgb.b ) ) {
				return ColorFamily.red;
			} else {
				return ColorFamily.green;
			}
		}
		if( rgb.g == rgb.b ) {
			if( Rgb.isOdd( rgb.r ) ) {
				return ColorFamily.green;
			} else {
				return ColorFamily.blue;
			}
		}
		if( rgb.r == rgb.b ) {
			if( Rgb.isOdd( rgb.r ) ) {
				return ColorFamily.red;
			} else {
				return ColorFamily.blue;
			}
		}
		return null;
	}

	public static isOdd( b: number ): boolean {
		let ret = ( b % 2 ) != 0; 
		return ret;
	}
	
	public static render( colors: Array<RGB>, fill: RGB ): VisImage {
		let nel = colors.length;
		let minCol = Number.MAX_VALUE;
		let maxCol = Number.MIN_VALUE;
		for( let i = 0; i < nel; i++ ) {
			let rgb: RGB = colors[i];
			let col = 2 * rgb.r + rgb.b;
			minCol = Math.min(col,  minCol);
			maxCol = Math.max(col,  maxCol);
		}
		let wid = 1+maxCol-minCol;
		let ht = 256;
		let ret: VisImage = VisImage.fromDimensions( wid, ht );
		if( fill != null ) {
			ret.getData().fill( fill.getPixel() );
		}
		
		for( let i = 0; i < nel; i++ ) {
			let rgb: RGB = colors[i];
			let col = 2 * rgb.r + rgb.b -minCol;
			let row = rgb.g;
			ret.setRGB( col, row, rgb );
		}
		return ret;
	}

	public static extract( palette: VisImage, luminance: number ): Array<RGB> {
		let ret = new Array< RGB >();
		let cr: ColRow = null;
		let wid = palette.getWidth();
		let ht = palette.getHeight();
		let faster = VisImage.fromDimensions( wid, ht );
		for( let col = 0; col < wid && cr == null; col++ ) {
			for( let row = 0; row < ht && cr == null; row++ ) {
				let pixel = faster.getData()[ row * faster.getWidth() + col ];
				let alpha = Rgb.getPixelAlpha( pixel );
				if( alpha > 0 ) {
					cr = new ColRow( col, row );
				}
			}
		}
		
		while ( cr != null ) {
			//sop( cr.dbgString() );
			
			// consume it
			let iRet = 0;
			let iFaster = cr.getCol() + cr.getRow() * faster.getWidth();
			ret[ iRet++ ] = new RGB( faster.getData()[ iFaster ], faster.getData()[ iFaster+1 ], faster.getData()[ iFaster+2 ] );
			faster.getData()[ iFaster+3 ] = 0; // mark it as consumed
			
			cr = this.findNext( cr, faster, 0 );
		}
		
		let livePixelCount = Rgb.getLivePixelCount( palette );
		if( ret.length != livePixelCount ) {
			//revealOutline( faster, pixelOfConsumed );
			//faster.toVisImage().popup( String.format( "Failed extract, luminance = %f, expected = ${}, actual = ${}", luminance, livePixelCount, ret.size() ) );
			throw `Rgb.extract(): Expected ${livePixelCount} colors, got ${ret.length}`;
		}
		
		// We aim to now have a blank palette. But until this is working, the remnant is the bug to look at.
		//faster.toVisImage(palette);
		
		return ret;
	}

	/**
	 * @param cr
	 * @param recursionCount 
	 * @param helper
	 * @return
	 * 
	 * Algorithm: Search neighboring pixels in clockwise direction. Return the
	 * first live pixel found AFTER an empty pixel. This ensures that the
	 * pixel return is adjacent to the boundary.
	 */
	private static findNext( cr: ColRow, faster: VisImage, recursionCount: number ): ColRow {
		let recursionMax = 3;
		let ret: ColRow =  null;
		let np: NeighborPixels = new NeighborPixels( cr, faster );
		let index = 0;
		let foundEmpty = false;
		do {
			let cr2: ColRow = np[ index ];
			if( !this.isLivePixel( cr2, faster ) ) {
				foundEmpty = true;
			} else {
				if( foundEmpty ) {
					ret = cr2;
				}
			}
			index++;
		} while( index < 8 && ret == null );
		
		if( ret == null && recursionCount < recursionMax ) {
			// Try the neighbors of each neighbor
			for( let cr3 of np ) {
				if( cr3 != null ) {
					ret = this.findNext( cr3, faster, recursionCount+1 );
					if( ret != null ) {
						break;
					}
				}
			}
		}
		
		return ret;
	}
		
	private static isLivePixel( cr: ColRow, faster: VisImage ): boolean  {
		if( cr != null ) {
			let pixel = faster.getData()[ cr.getCol() + cr.getRow() * faster.getWidth() ];
			let alpha = Rgb.getPixelAlpha( pixel );
			return alpha > 0;
		}
		return false;
	}

	public static colorsWithBrightness( brightnessZeroToOne: number ): Array< RGB > {
		let iMagnitude = Math.round( brightnessZeroToOne * 3 * 255 );
		let red = Math.max( 0, Math.min( 255, iMagnitude ) );
		let green = Math.max( 0, Math.min( 255, iMagnitude - red ) );
		let blue = Math.max( 0, Math.min( 255, iMagnitude - ( red + green ) ) );
		let model: RGB = new RGB( red, green, blue );
		let deltas: Deltas = new Deltas();
		let ret: Array< RGB > = deltas.applyTo( model );
		return ret;
	}

	public static getLivePixelCount(palette: VisImage): number {
		let ret = 0, count = 0;
		let wid = palette.getWidth();
		let ht = palette.getHeight();
		let faster: VisImage = VisImage.fromDimensions( palette.getWidth(), palette.getHeight() );
		for( let col = 0; col < wid; col++ ) {
			for( let row = 0; row < ht; row++ ) {
				count++;
				let alpha =  faster.getData()[col + row * faster.getWidth() + 3];
				if( alpha > 0 ) {
					ret++;
				}
			}
		}
		return ret;
	}
}