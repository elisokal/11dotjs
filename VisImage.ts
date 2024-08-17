namespace _11dotjs {
	export class VisImage {

		private imd: ImageData;

		constructor( width, height, data ) {
			//super( width, height );
			this.imd = new ImageData( width, height );
			this.imd.data.set( data );
		}

		getImageData() {
			return this.imd;
		}

		getWidth() {
			return this.imd.width;
		}

		getHeight() {
			return this.imd.height;
		}

		getData() {
			return this.imd.data;
		}

		public static fromImageData( imageData: ImageData ): VisImage {
			let ret = new VisImage( imageData.width, imageData.height, imageData.data );
			return ret;
		}
		
		public static fromDimensions( width, height ): VisImage {
			let ret = new VisImage( width, height, new Uint8ClampedArray(0) );
			return ret;
		}

		public setRGB( col, row, rgb: RGB ) {
			let index = 4 * ( row * this.imd.width + col );
			this.imd.data[index] = rgb.getR();
			this.imd.data[index+1] = rgb.getG();
			this.imd.data[index+2] = rgb.getB();
			this.imd.data[index+3] = rgb.getA();
		}

		public getRGB( col, row ): RGB {
			let index = 4 * ( row * this.imd.width + col );
			const ret = new RGB( this.imd.data[index], this.imd.data[index+1], this.imd.data[index+2] );
			return ret;
		}    

		public scale( newWidth: number, newHeight: number): VisImage {
			// Create an off-screen canvas
			const offScreenCanvas = document.createElement('canvas');
			const offScreenCtx = offScreenCanvas.getContext('2d');
		
			if (!offScreenCtx) {
			throw new Error('Could not get 2D context');
			}
		
			// Set the canvas size to the new dimensions
			offScreenCanvas.width = newWidth;
			offScreenCanvas.height = newHeight;
		
			// Draw the original VisImage onto the canvas
			const tempCanvas = document.createElement('canvas');
			const tempCtx = tempCanvas.getContext('2d');
		
			if (!tempCtx) {
			throw new Error('Could not get 2D context');
			}
		
			tempCanvas.width = this.imd.width;
			tempCanvas.height = this.imd.height;
			tempCtx.putImageData(this.imd, 0, 0);
		
			// Draw the scaled image onto the off-screen canvas
			offScreenCtx.drawImage(tempCanvas, 0, 0, this.imd.width, this.imd.height, 0, 0, newWidth, newHeight);
		
			// Get the scaled VisImage
			const scaledImageData = VisImage.fromImageData( offScreenCtx.getImageData( 0, 0, newWidth, newHeight ) );
		
			return scaledImageData;
		}

		// Find exact color match
		public findColor( color: RGB ) : ColRow {
			const id = this.getImageData();
			for( let row = 0; row < id.height; row++ ) {
				for( let col = 0; col < id.width; col++ ) {
					const rgb = this.getRGB( col, row );
					if( rgb.equals( color ) ) {
						return new ColRow( col, row );
					}
				}
			}
			return null;
		}

		// Find with an error tolerance. To be used only when findColor fails.
		public findColorApproximate( color: RGB, tolerance: number ) : ColRow {
			const id = this.getImageData();
			for( let row = 0; row < id.height; row++ ) {
				for( let col = 0; col < id.width; col++ ) {
					const rgb = this.getRGB( col, row );
					let error = rgb.error( color );
					if( error <= tolerance ) {
						return new ColRow( col, row );
					}
				}
			}
			return null;
		}


		public static toggleMarker( x, y, ctx: CanvasRenderingContext2D ) {
			this.drawMarker( x, y, 8, ctx );
		}

		// GPT 2024-06-23 - I had to tell it to use bitwise inversion so we can toggle
		private static drawMarker( x, y, size, ctx: CanvasRenderingContext2D ) {
			// Get the image data for the area around the click
			const halfSize = Math.floor( size / 2 );
			const imageData = ctx.getImageData( x - halfSize, y - halfSize, size, size );
			const data = imageData.data;
		
			// Invert the colors along the diagonals to form an X
			for (let i = 0; i < size; i++) {
				const offset1 = (i * size + i) * 4;
				const offset2 = ((size - i - 1) * size + i) * 4;

				data[offset1] = ~data[offset1] & 0xFF; // Red
				data[offset1 + 1] = ~data[offset1 + 1] & 0xFF; // Green
				data[offset1 + 2] = ~data[offset1 + 2] & 0xFF; // Blue
				// Alpha (data[offset1 + 3]) remains the same

				data[offset2] = ~data[offset2] & 0xFF; // Red
				data[offset2 + 1] = ~data[offset2 + 1] & 0xFF; // Green
				data[offset2 + 2] = ~data[offset2 + 2] & 0xFF; // Blue
				// Alpha (data[offset2 + 3]) remains the same
			}
		
			// Put the image data back onto the canvas
			ctx.putImageData( imageData, x - halfSize, y - halfSize );
		}
		
		// 
		// Return a new image formed from the smallest rectangular subset of
		// the input for which there is content. Content is defined as any
		// pixel with non-zero alpha
		//
		public cropImageToContent(): VisImage {
			const { width, height, data } = this.imd;
			let top = height, left = width, right = 0, bottom = 0;
			let foundContent = false;

			// Iterate through each pixel to find the bounds of the content
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const index = (y * width + x) * 4;
					const alpha = data[index + 3];

					if (alpha > 0) {
						if (x < left) left = x;
						if (x > right) right = x;
						if (y < top) top = y;
						if (y > bottom) bottom = y;
						foundContent = true;
					}
				}
			}

			// If no content found, return an empty VisImage
			if (!foundContent) {
				return VisImage.fromDimensions(1, 1);
			}

			// Calculate the width and height of the cropped area
			const cropWidth = right - left + 1;
			const cropHeight = bottom - top + 1;

			// Create a new VisImage object for the cropped content
			const croppedImageData = VisImage.fromDimensions(cropWidth, cropHeight);
			const croppedData = croppedImageData.getData();

			// Copy the content to the new VisImage
			for (let y = top; y <= bottom; y++) {
				for (let x = left; x <= right; x++) {
					const srcIndex = (y * width + x) * 4;
					const destIndex = ((y - top) * cropWidth + (x - left)) * 4;

					croppedData[destIndex] = data[srcIndex]; // R
					croppedData[destIndex + 1] = data[srcIndex + 1]; // G
					croppedData[destIndex + 2] = data[srcIndex + 2]; // B
					croppedData[destIndex + 3] = data[srcIndex + 3]; // A
				}
			}

			return croppedImageData;
		}

	}

	class IntPair {
		i1: number;
		i2: number;
		constructor(i1, i2) {
			this.i1 = i1;
			this.i2 = i2;
		}
		public fromOther(other: IntPair) {
			this.i1 = other.getI1();
			this.i2 = other.getI2();
		}

		public getI1() {
			return this.i1;
		}
		public getI2() {
			return this.i2;
		}
		public equals(other: IntPair): boolean {
			let ret = false;
			if (other != null) {
				ret = (this.i1 == other.i1 && this.i2 == other.i2);
			}
			return ret;
		}
		public dbgString() {
			return `${this.i1} x ${this.i2}`;
		}
		public isZero(): boolean {
			return (this.i1 == 0 && this.i2 == 0);
		}
		public floor(min) {
			this.i1 = Math.max(this.i1, min);
			this.i2 = Math.max(this.i2, min);
		}
		public exists(): boolean {
			let ret = this.i1 > 0 && this.i2 > 0;
			return ret;
		}
		public setI1(i1) {
			this.i1 = i1;
		}
		public setI2(i2) {
			this.i2 = i2;
		}
		public coerceToMinimum(): IntPair {
			let i = Math.min(this.i1, this.i2);
			return new IntPair(i, i);
		}

		public subtract(other: IntPair) {
			this.i1 -= other.getI1();
			this.i2 -= other.getI2();
		}
	}

	export class ColRow extends IntPair {

		constructor(col, row) {
			super(col, row);
		}
		public getCol() {
			return super.getI1();
		}
		public getRow() {
			return super.getI2();
		}
		public isValid(faster: VisImage): boolean {
			if (this.getCol() < 0 || this.getRow() < 0) {
				return false;
			}
			if (this.getCol() >= faster.getWidth() || this.getRow() >= faster.getHeight()) {
				return false;
			}
			return true;
		}

		public getAsIndex( width: number ): number {
			const ret = 4 * ( this.getCol() + this.getRow() * Math.floor( width ) );
			return ret;
		}
	}

}