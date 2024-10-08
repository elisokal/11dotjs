var _11dotjs;
(function (_11dotjs) {
    class Config {
        static uponLoad() {
            let links = {
                "link": [
                    {
                        "href": "https://fonts.googleapis.com/css2?family=Inter&display=swap",
                        "rel": "stylesheet"
                    },
                    {
                        "href": "https://fonts.googleapis.com/css2?family=Roboto Mono&display=swap",
                        "rel": "stylesheet"
                    }
                ]
            };
            _11dotjs.DocComposer.compose(links, document.head);
        }
    }
    _11dotjs.Config = Config;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class LocalStorage {
        static read(key) {
            let json = window.localStorage.getItem(key);
            let ret = JSON.parse(json);
            return ret;
        }
        static readGlobal() {
            return this.read(LocalStorage.lsGlobal);
        }
        static write(key, o) {
            let json = JSON.stringify(o);
            window.localStorage.setItem(key, json);
        }
        static writeGlobal(o) {
            this.write(LocalStorage.lsGlobal, o);
        }
        static registerInstance() {
            let reset = 0;
            if (reset == 1) { // break here and set reset to 1 clear the SharedInstanceInfo
                LocalStorage.writeGlobal(null);
            }
            let sii = LocalStorage.readGlobal();
            if (!sii) {
                sii = new SharedInstanceInfo();
            }
            if (!sii.tabIdSet) {
                sii["tabIdSet"] = {};
            }
            let tabId = LocalStorage.browserTabId(sii.tabIdSet);
            if (!sii.tabIdSet[tabId]) {
                //console.log( `Adding tab ${tabId}` );
                sii.tabIdSet[tabId] = {};
                LocalStorage.writeGlobal(sii);
            }
            else {
                throw `Error! tab ${tabId} already registered`;
            }
            LocalStorage.logTabIdSet();
            window.addEventListener('beforeunload', (ev) => {
                let sii = LocalStorage.readGlobal();
                if (sii.tabIdSet[tabId]) {
                    console.log(`Deleting tab ${tabId}`);
                    delete sii.tabIdSet[tabId];
                    LocalStorage.writeGlobal(sii);
                }
                else {
                    console.log(`tab ${tabId} not found`);
                }
                LocalStorage.logTabIdSet();
                return null;
            });
        }
        static logTabIdSet() {
            let sii = LocalStorage.readGlobal();
            if (sii) {
                let ts = '';
                let delim = '';
                for (let id in sii.tabIdSet) {
                    ts += delim + id;
                    delim = ', ';
                }
                console.log(ts);
            }
            else {
                console.log('No Shared Instance Info exists.');
            }
        }
        static getTabCount() {
            let sii = LocalStorage.readGlobal();
            let o = Object.keys(sii.tabIdSet);
            let ret = o.length;
            return ret;
        }
        static newUniqueId() {
            return Date.now() + '-' + Math.random().toString(36).substring(2, 9);
        }
        static browserTabId(tabIdSet) {
            let tabId = sessionStorage.getItem('tabId');
            if (tabId) {
                // Reload, or duplicated tab? For reload this tabId will
                // not exist in local storage. For duplicated tab it will.
                if (!tabIdSet[tabId]) {
                    // Reload will have unloaded this tab, so we reinstate the id found in sessionStorage
                    console.log(`Adding tab ${tabId}`);
                }
                else {
                    // duplicate tab actually duplicates sessionStorage! So we create a new ID.
                    console.log(`tab ${tabId} is a duplicated tab`);
                    tabId = LocalStorage.newUniqueId();
                    console.log(`new id ${tabId} applied to duplicated tab`);
                }
            }
            else {
                tabId = LocalStorage.newUniqueId();
            }
            return tabId;
        }
    }
    LocalStorage.lsGlobal = "lsGlobal";
    _11dotjs.LocalStorage = LocalStorage;
    //
    // Object to be shared by all 11dotjs browser tabs
    //
    class SharedInstanceInfo {
    }
    _11dotjs.SharedInstanceInfo = SharedInstanceInfo;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class NodeUtil {
        static firstParent(node, tagName) {
            do {
                node = node.parentNode;
            } while (node != null && node.tagName != tagName);
            return node;
        }
        static detachElement(id) {
            let el = document.getElementById(id);
            if (el) {
                el.remove();
            }
        }
    }
    _11dotjs.NodeUtil = NodeUtil;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class VisImage {
        constructor(width, height, data) {
            //super( width, height );
            this.imd = new ImageData(width, height);
            this.imd.data.set(data);
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
        static fromImageData(imageData) {
            let ret = new VisImage(imageData.width, imageData.height, imageData.data);
            return ret;
        }
        static fromDimensions(width, height) {
            let ret = new VisImage(width, height, new Uint8ClampedArray(0));
            return ret;
        }
        setRGB(col, row, rgb) {
            let index = 4 * (row * this.imd.width + col);
            this.imd.data[index] = rgb.getR();
            this.imd.data[index + 1] = rgb.getG();
            this.imd.data[index + 2] = rgb.getB();
            this.imd.data[index + 3] = rgb.getA();
        }
        getRGB(col, row) {
            let index = 4 * (row * this.imd.width + col);
            const ret = new _11dotjs.RGB(this.imd.data[index], this.imd.data[index + 1], this.imd.data[index + 2]);
            return ret;
        }
        scale(newWidth, newHeight) {
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
            const scaledImageData = VisImage.fromImageData(offScreenCtx.getImageData(0, 0, newWidth, newHeight));
            return scaledImageData;
        }
        // Find exact color match
        findColor(color) {
            const id = this.getImageData();
            for (let row = 0; row < id.height; row++) {
                for (let col = 0; col < id.width; col++) {
                    const rgb = this.getRGB(col, row);
                    if (rgb.equals(color)) {
                        return new ColRow(col, row);
                    }
                }
            }
            return null;
        }
        // Find with an error tolerance. To be used only when findColor fails.
        findColorApproximate(color, tolerance) {
            const id = this.getImageData();
            for (let row = 0; row < id.height; row++) {
                for (let col = 0; col < id.width; col++) {
                    const rgb = this.getRGB(col, row);
                    let error = rgb.error(color);
                    if (error <= tolerance) {
                        return new ColRow(col, row);
                    }
                }
            }
            return null;
        }
        static toggleMarker(x, y, ctx) {
            this.drawMarker(x, y, 8, ctx);
        }
        // GPT 2024-06-23 - I had to tell it to use bitwise inversion so we can toggle
        static drawMarker(x, y, size, ctx) {
            // Get the image data for the area around the click
            const halfSize = Math.floor(size / 2);
            const imageData = ctx.getImageData(x - halfSize, y - halfSize, size, size);
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
            ctx.putImageData(imageData, x - halfSize, y - halfSize);
        }
        // 
        // Return a new image formed from the smallest rectangular subset of
        // the input for which there is content. Content is defined as any
        // pixel with non-zero alpha
        //
        cropImageToContent() {
            const { width, height, data } = this.imd;
            let top = height, left = width, right = 0, bottom = 0;
            let foundContent = false;
            // Iterate through each pixel to find the bounds of the content
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const alpha = data[index + 3];
                    if (alpha > 0) {
                        if (x < left)
                            left = x;
                        if (x > right)
                            right = x;
                        if (y < top)
                            top = y;
                        if (y > bottom)
                            bottom = y;
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
    _11dotjs.VisImage = VisImage;
    class IntPair {
        constructor(i1, i2) {
            this.i1 = i1;
            this.i2 = i2;
        }
        fromOther(other) {
            this.i1 = other.getI1();
            this.i2 = other.getI2();
        }
        getI1() {
            return this.i1;
        }
        getI2() {
            return this.i2;
        }
        equals(other) {
            let ret = false;
            if (other != null) {
                ret = (this.i1 == other.i1 && this.i2 == other.i2);
            }
            return ret;
        }
        dbgString() {
            return `${this.i1} x ${this.i2}`;
        }
        isZero() {
            return (this.i1 == 0 && this.i2 == 0);
        }
        floor(min) {
            this.i1 = Math.max(this.i1, min);
            this.i2 = Math.max(this.i2, min);
        }
        exists() {
            let ret = this.i1 > 0 && this.i2 > 0;
            return ret;
        }
        setI1(i1) {
            this.i1 = i1;
        }
        setI2(i2) {
            this.i2 = i2;
        }
        coerceToMinimum() {
            let i = Math.min(this.i1, this.i2);
            return new IntPair(i, i);
        }
        subtract(other) {
            this.i1 -= other.getI1();
            this.i2 -= other.getI2();
        }
    }
    class ColRow extends IntPair {
        constructor(col, row) {
            super(col, row);
        }
        getCol() {
            return super.getI1();
        }
        getRow() {
            return super.getI2();
        }
        isValid(faster) {
            if (this.getCol() < 0 || this.getRow() < 0) {
                return false;
            }
            if (this.getCol() >= faster.getWidth() || this.getRow() >= faster.getHeight()) {
                return false;
            }
            return true;
        }
        getAsIndex(width) {
            const ret = 4 * (this.getCol() + this.getRow() * Math.floor(width));
            return ret;
        }
    }
    _11dotjs.ColRow = ColRow;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    let ColorFamily;
    (function (ColorFamily) {
        ColorFamily[ColorFamily["red"] = 0] = "red";
        ColorFamily[ColorFamily["green"] = 1] = "green";
        ColorFamily[ColorFamily["blue"] = 2] = "blue";
    })(ColorFamily || (ColorFamily = {}));
    let ExtractSearchDirection;
    (function (ExtractSearchDirection) {
        ExtractSearchDirection[ExtractSearchDirection["clockwise"] = 0] = "clockwise";
        ExtractSearchDirection[ExtractSearchDirection["counterclockwise"] = 1] = "counterclockwise";
    })(ExtractSearchDirection || (ExtractSearchDirection = {}));
    class RGB {
        equals(color) {
            const ret = color.r == this.r && color.g == this.g && color.b == this.b && color.a == this.a;
            return ret;
        }
        constructor(r, g, b) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 255;
            this.r = r;
            this.g = g;
            this.b = b;
        }
        static fromPixel(pixel) {
            return new RGB(Rgb.getPixelRed(pixel), Rgb.getPixelGreen(pixel), Rgb.getPixelBlue(pixel));
        }
        // Create an RGB from the likes of "RGB(1,1,1)"
        static fromCss(cssColor) {
            const regex = /^RGB\((\d+),\s*(\d+),\s*(\d+)\)$/i;
            const match = cssColor.match(regex);
            if (match) {
                const r = parseInt(match[1], 10);
                const g = parseInt(match[2], 10);
                const b = parseInt(match[3], 10);
                return new RGB(r, g, b);
            }
            return null;
        }
        getR() {
            return this.r;
        }
        getG() {
            return this.g;
        }
        getB() {
            return this.b;
        }
        getA() {
            return this.a;
        }
        getPixel() {
            return Rgb.pixel(this.r, this.g, this.b, this.a);
        }
        sum() {
            return (this.r + this.g + this.b);
        }
        validate() {
            if (!(this.inRange(this.r) && this.inRange(this.g) && this.inRange(this.b))) {
                throw this.dbgString();
            }
        }
        dbgString() {
            return `ARBG(${this.a}, ${this.r}, $this.g}, ${this.b})`;
        }
        cssString() {
            return `RGB(${this.r}, ${this.g}, ${this.b})`;
        }
        inRange(iColorByte) {
            return (iColorByte > -1 && iColorByte < 256);
        }
        fillCanvas(canvas) {
            const ctx = canvas.getContext("2d");
            const css = `rgb(${this.r}, ${this.g}, ${this.b})`;
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        toString() {
            return `RBGA( ${this.r}, ${this.g}, ${this.b}, ${this.a} )`;
        }
        setA(a) {
            this.a = a;
        }
        luminance() {
            const ret = this.sum() / (255 * 3);
            return ret;
        }
        error(color) {
            let ret = 0;
            ret += Math.abs(color.r - this.r);
            ret += Math.abs(color.g - this.g);
            ret += Math.abs(color.b - this.b);
            return ret;
        }
    }
    _11dotjs.RGB = RGB;
    class Deltas {
        constructor() {
            this.deltas = [];
            let nok = 0, nnok = 0, noor = 0;
            for (let dr = Deltas.minDelta; dr <= Deltas.maxDelta; dr++) {
                for (let dg = Deltas.minDelta; dg <= Deltas.maxDelta; dg++) {
                    let db = -(dr + dg);
                    let test = dr + dg + db;
                    if (test !== 0) {
                        this.nop();
                        nnok++;
                    }
                    else {
                        if (this.deltaInRange(dr, dg, db)) {
                            nok++;
                            this.deltas.push([dr, dg, db]);
                        }
                        else {
                            noor++;
                        }
                    }
                }
            }
            this.nop();
        }
        deltaInRange(dr, dg, db) {
            return this.deltaInRange2(dr) && this.deltaInRange2(dg) && this.deltaInRange2(db);
        }
        deltaInRange2(dr) {
            return dr > -256 && dr < 256;
        }
        rgbInRange(dr, dg, db) {
            return this.rgbInRange2(dr) && this.rgbInRange2(dg) && this.rgbInRange2(db);
        }
        rgbInRange2(dr) {
            return dr > -1 && dr < 256;
        }
        applyTo(test) {
            let sumTest = test.sum();
            let ret = [];
            for (let delta of this.deltas) {
                let rgb = this.applyTo2(test, delta);
                if (rgb !== null) {
                    let sumNew = rgb.sum();
                    if (sumNew !== sumTest) {
                        this.nop();
                    }
                    ret.push(rgb);
                }
            }
            return ret;
        }
        applyTo2(test, delta) {
            let r = test.getR() + delta[0];
            let g = test.getG() + delta[1];
            let b = test.getB() + delta[2];
            if (this.rgbInRange(r, g, b)) {
                return new RGB(Math.abs(r % 256), Math.abs(g % 256), Math.abs(b % 256));
            }
            return null;
        }
        nop() {
            // No operation
        }
    }
    Deltas.minDelta = -255;
    Deltas.maxDelta = 255;
    /**
     * This is how we order the neighbors of pixel X
     * --812---
     * --7X3---
     * --654---
     */
    class NeighborPixels extends Array {
        constructor(cr, faster) {
            super();
            let i = 0;
            for (let n = 1; n <= 8; n++) {
                this[i++] = this.neighbor(cr, n, faster);
            }
        }
        neighbor(cr, n, faster) {
            let ret = null;
            switch (n) {
                case 1:
                    ret = new _11dotjs.ColRow(cr.getCol(), cr.getRow() - 1);
                    break;
                case 2:
                    ret = new _11dotjs.ColRow(cr.getCol() + 1, cr.getRow() - 1);
                    break;
                case 3:
                    ret = new _11dotjs.ColRow(cr.getCol() + 1, cr.getRow());
                    break;
                case 4:
                    ret = new _11dotjs.ColRow(cr.getCol() + 1, cr.getRow() + 1);
                    break;
                case 5:
                    ret = new _11dotjs.ColRow(cr.getCol(), cr.getRow() + 1);
                    break;
                case 6:
                    ret = new _11dotjs.ColRow(cr.getCol() - 1, cr.getRow() + 1);
                    break;
                case 7:
                    ret = new _11dotjs.ColRow(cr.getCol() - 1, cr.getRow());
                    break;
                case 8:
                    ret = new _11dotjs.ColRow(cr.getCol() - 1, cr.getRow() - 1);
                    break;
            }
            if (!ret.isValid(faster)) {
                ret = null;
            }
            return ret;
        }
    }
    class Rgb {
        /*
        *
        */
        static getPixelRed(pixel) {
            return (pixel & Rgb.mRed) >> 16;
        }
        static getPixelBlue(pixel) {
            return pixel & Rgb.mBlue;
        }
        static getPixelGreen(pixel) {
            return (pixel & Rgb.mGreen) >> 8;
        }
        static pixel(r, g, b, a) {
            let ret = (a << 24) + (r << 16) + (g << 8) + b;
            return ret;
        }
        havingSum(sum) {
            const ret = [];
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
        static getPixelAlpha(pixel) {
            return (pixel >> 24) & 0xFF;
        }
        static debugString(pixel) {
            let ret = `ARGB( ${Rgb.getPixelAlpha(pixel)} ${Rgb.getPixelRed(pixel)} ${Rgb.getPixelGreen(pixel)} ${Rgb.getPixelBlue(pixel)}`;
            return ret;
        }
        static sort(colors) {
            let ret = Array.from(colors);
            this.sortRgb(ret);
            return ret;
        }
        static sortRgb(colors) {
            colors.sort((rgb1, rgb2) => {
                let pix1 = rgb1.getPixel();
                let pix2 = rgb2.getPixel();
                let ret = (pix1 < pix2) ? -1 : (pix1 > pix2) ? 1 : 0;
                return ret;
            });
        }
        static colorFamily(rgb) {
            if (rgb.r > rgb.g && rgb.r > rgb.b) {
                return ColorFamily.red;
            }
            else if (rgb.g > rgb.r && rgb.g > rgb.b) {
                return ColorFamily.green;
            }
            else if (rgb.b > rgb.r && rgb.b > rgb.g) {
                return ColorFamily.blue;
            }
            // Now we do the tie breakers
            if (rgb.r == rgb.g) { // r and g are the max
                if (Rgb.isOdd(rgb.b)) {
                    return ColorFamily.red;
                }
                else {
                    return ColorFamily.green;
                }
            }
            if (rgb.g == rgb.b) {
                if (Rgb.isOdd(rgb.r)) {
                    return ColorFamily.green;
                }
                else {
                    return ColorFamily.blue;
                }
            }
            if (rgb.r == rgb.b) {
                if (Rgb.isOdd(rgb.r)) {
                    return ColorFamily.red;
                }
                else {
                    return ColorFamily.blue;
                }
            }
            return null;
        }
        static isOdd(b) {
            let ret = (b % 2) != 0;
            return ret;
        }
        static render(colors, fill) {
            let nel = colors.length;
            let minCol = Number.MAX_VALUE;
            let maxCol = Number.MIN_VALUE;
            for (let i = 0; i < nel; i++) {
                let rgb = colors[i];
                let col = 2 * rgb.r + rgb.b;
                minCol = Math.min(col, minCol);
                maxCol = Math.max(col, maxCol);
            }
            let wid = 1 + maxCol - minCol;
            let ht = 256;
            let ret = _11dotjs.VisImage.fromDimensions(wid, ht);
            if (fill != null) {
                ret.getData().fill(fill.getPixel());
            }
            for (let i = 0; i < nel; i++) {
                let rgb = colors[i];
                let col = 2 * rgb.r + rgb.b - minCol;
                let row = rgb.g;
                ret.setRGB(col, row, rgb);
            }
            return ret;
        }
        static extract(palette, luminance) {
            let ret = new Array();
            let cr = null;
            let wid = palette.getWidth();
            let ht = palette.getHeight();
            let faster = _11dotjs.VisImage.fromDimensions(wid, ht);
            for (let col = 0; col < wid && cr == null; col++) {
                for (let row = 0; row < ht && cr == null; row++) {
                    let pixel = faster.getData()[row * faster.getWidth() + col];
                    let alpha = Rgb.getPixelAlpha(pixel);
                    if (alpha > 0) {
                        cr = new _11dotjs.ColRow(col, row);
                    }
                }
            }
            while (cr != null) {
                //sop( cr.dbgString() );
                // consume it
                let iRet = 0;
                let iFaster = cr.getCol() + cr.getRow() * faster.getWidth();
                ret[iRet++] = new RGB(faster.getData()[iFaster], faster.getData()[iFaster + 1], faster.getData()[iFaster + 2]);
                faster.getData()[iFaster + 3] = 0; // mark it as consumed
                cr = this.findNext(cr, faster, 0);
            }
            let livePixelCount = Rgb.getLivePixelCount(palette);
            if (ret.length != livePixelCount) {
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
        static findNext(cr, faster, recursionCount) {
            let recursionMax = 3;
            let ret = null;
            let np = new NeighborPixels(cr, faster);
            let index = 0;
            let foundEmpty = false;
            do {
                let cr2 = np[index];
                if (!this.isLivePixel(cr2, faster)) {
                    foundEmpty = true;
                }
                else {
                    if (foundEmpty) {
                        ret = cr2;
                    }
                }
                index++;
            } while (index < 8 && ret == null);
            if (ret == null && recursionCount < recursionMax) {
                // Try the neighbors of each neighbor
                for (let cr3 of np) {
                    if (cr3 != null) {
                        ret = this.findNext(cr3, faster, recursionCount + 1);
                        if (ret != null) {
                            break;
                        }
                    }
                }
            }
            return ret;
        }
        static isLivePixel(cr, faster) {
            if (cr != null) {
                let pixel = faster.getData()[cr.getCol() + cr.getRow() * faster.getWidth()];
                let alpha = Rgb.getPixelAlpha(pixel);
                return alpha > 0;
            }
            return false;
        }
        static colorsWithBrightness(brightnessZeroToOne) {
            let iMagnitude = Math.round(brightnessZeroToOne * 3 * 255);
            let red = Math.max(0, Math.min(255, iMagnitude));
            let green = Math.max(0, Math.min(255, iMagnitude - red));
            let blue = Math.max(0, Math.min(255, iMagnitude - (red + green)));
            let model = new RGB(red, green, blue);
            let deltas = new Deltas();
            let ret = deltas.applyTo(model);
            return ret;
        }
        static getLivePixelCount(palette) {
            let ret = 0, count = 0;
            let wid = palette.getWidth();
            let ht = palette.getHeight();
            let faster = _11dotjs.VisImage.fromDimensions(palette.getWidth(), palette.getHeight());
            for (let col = 0; col < wid; col++) {
                for (let row = 0; row < ht; row++) {
                    count++;
                    let alpha = faster.getData()[col + row * faster.getWidth() + 3];
                    if (alpha > 0) {
                        ret++;
                    }
                }
            }
            return ret;
        }
    }
    /*
    * ARGB Masks
    */
    Rgb.mAlpha = 255 << 24;
    Rgb.mRed = 255 << 16;
    Rgb.mGreen = 255 << 8;
    Rgb.mBlue = 255;
    Rgb.mColor = ~Rgb.mAlpha;
    _11dotjs.Rgb = Rgb;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class TableConfig {
        constructor() {
            this.hasHeader = true;
        }
    }
    _11dotjs.TableConfig = TableConfig;
    class Tables {
        static generate(config) {
            const componentId = (config.componentId) ? config.componentId : Tables.defaultComponentId;
            const tbody = {};
            const ret = { "table": { "id": componentId, "tbody": tbody } };
            let thead = null;
            if (config.hasHeader) {
                thead = {};
                ret.table.thead = thead;
            }
            for (let row = 0; row < config.rowCount; row++) {
                let target = (row == 0 && config.hasHeader) ? thead : tbody;
                if (!target.tr) {
                    target.tr = [];
                }
                target.tr.push([]);
                for (let col = 0; col < config.columnCount; col++) {
                    if (!target.tr[row].td) {
                        target.tr[row].td = [];
                        target.tr[row].id = Tables.getRowElementId(componentId, row);
                    }
                    target.tr[row].td.push({});
                    target.tr[row].td[col] = Tables.lenient(config.cellContent, row, col);
                    target.tr[row].td[col].style = Tables.lenient(config.cellStyle, row, col);
                    target.tr[row].td[col].id = Tables.getCellElementId(componentId, row, col);
                }
            }
            return ret;
        }
        static getRowElement(componentId, row) {
            return document.getElementById(Tables.getRowElementId(componentId, row));
        }
        static getRowElementId(componentId, row) {
            return componentId + `_tr${row}`;
        }
        static getCellElement(componentId, row, col) {
            return document.getElementById(Tables.getCellElementId(componentId, row, col));
        }
        static getCellElementId(componentId, row, col) {
            return componentId + `_td${row}-${col}`;
        }
        // Lenient array access. Return what's there, or null
        static lenient(cellContent, row, col) {
            let ret = {};
            if (cellContent && cellContent.length > 0) {
                let rowCount = cellContent.length;
                let rowIndex = Math.min(rowCount - 1, row);
                let columnCount = cellContent[rowIndex].length;
                let columnIndex = Math.min(columnCount - 1, col);
                // If we do not clone here, table cells might share content inappropriately
                ret = structuredClone(cellContent[rowIndex][columnIndex]);
            }
            return ret;
        }
        static demoUi(rowCount, colCount, componentId) {
            return Tables.generate({
                "componentId": componentId,
                "hasHeader": false,
                "rowCount": (rowCount) ? rowCount : 10,
                "columnCount": (colCount) ? colCount : 12,
                "cellContent": [[{ "img": { "src": "http://elisokal.com/imageLib/11dotjs/ball.png", "style": "width: 64px" } }]],
                //"cellStyle": [ [ "padding: 24px; background-color: RGB(242,251,50);" ] ]
                "cellStyle": [["padding: 24px; background-color: RGB(0,0,0);"]]
            });
        }
        static demo(parent, rowCount, colCount) {
            parent.style.backgroundColor = "black";
            const componentId = "tables_demo";
            const ui = Tables.demoUi(rowCount, colCount, componentId);
            _11dotjs.DocComposer.compose(ui, parent);
            // Retrieve a cell
            let el = Tables.getCellElement(componentId, 0, 0);
            //el.style.setProperty("background-color", "red" );
            // now manipulate the table itself
            let table = _11dotjs.NodeUtil.firstParent(el, "TABLE");
            if (table) {
                let tEl = table;
                tEl.style.margin = "auto";
                let angle = 45;
                let increment = 1;
                let css = `rotate(${angle}deg)`;
                tEl.style.transform = css;
                let stop = 1;
                if (true) {
                    _11dotjs.Animation.byDuration((timestamp) => {
                        angle += increment;
                        css = `rotate3d(1,1,1,${angle}deg)`;
                        tEl.style.transform = css;
                    }, 30000, 60);
                }
                if (false) {
                    _11dotjs.Animation.byIterations((timestamp) => {
                        angle += increment;
                        css = `rotate(${angle}deg)`;
                        tEl.style.transform = css;
                    }, 150, 30);
                }
            }
        }
    }
    Tables.defaultComponentId = "_11dotjs.Tables";
    _11dotjs.Tables = Tables;
})(_11dotjs || (_11dotjs = {}));
//
// 2024-06-16
// This class created by Eli Sokal
//
// DocComposer converts a JavaScript object graph to a browser document, 
// allowing web-page composition without HTML.
//
//
// Return value: If a parent node is passed in, we return the first child
// node that we appended to it. Otherwise, we return the whole wrapperNode.
//
var _11dotjs;
(function (_11dotjs) {
    class DocComposer {
        static compose(source, parent) {
            // A wrapper is necessary because the source may not be rooted (IOW, it might be >1 object)
            const wrapperTag = "span";
            const wrapper = { source }; // Source must be rooted on a single-property object
            DocComposer.docRoot = document.createElement(wrapperTag);
            DocComposer.composer(source, wrapperTag, DocComposer.docRoot, 0);
            let ret = DocComposer.docRoot;
            if (parent) {
                // Now we can drop the wrapper node and just copy its children to the parent
                ret = null;
                while (DocComposer.docRoot.childNodes.length > 0) {
                    let node = DocComposer.docRoot.childNodes[0];
                    if (!ret) {
                        ret = node;
                    }
                    parent.appendChild(node);
                }
            }
            return ret;
        }
        static composer(source, parentKey, doc, level) {
            if (source) {
                let t1 = DocComposer.docTrace(doc);
                let t2 = null;
                for (let [key, value] of Object.entries(source)) {
                    key = DocComposer.fixTagName(key);
                    switch (typeof value) {
                        case "object":
                            if (!Array.isArray(value)) {
                                value = [value]; // promote to array so we can treat objects and arrays the same below
                            }
                            // RECURSE
                            for (let value2 of value) {
                                let newNode = document.createElement(key);
                                if (newNode instanceof HTMLUnknownElement) {
                                    throw `Unknown HTML tag '${key}'`;
                                }
                                doc.appendChild(newNode);
                                t2 = DocComposer.docTrace(newNode);
                                DocComposer.composer(value2, key, newNode, level + 1);
                            }
                            break;
                        case "string":
                            if (key == 'text') {
                                let textNode = document.createTextNode(value);
                                doc.appendChild(textNode);
                                t2 = DocComposer.docTrace(textNode);
                            }
                            else {
                                // set an attribute of the current document node
                                doc.setAttribute(key, String(value));
                            }
                            break;
                        case "number":
                        case "boolean":
                        case "function":
                            // set an attribute of the current document node
                            doc[key] = value;
                            break;
                    }
                    let stop = 1;
                }
            }
        }
        //
        // The use of JS object in place of html occasionally necessitates a little
        // hack. HTML tags may repeat, for example, <input><input> is valid in HTML
        // but the corresponding JSON { "input":null, "input":null } is invalid. As 
        // a simple work-around, DocComposer removes any suffix beginning with the 
        // underscore character. This lets page developers declare the likes of
        //
        // { "input":null, "input_abc":null } 
        //                        ^
        static fixTagName(tagName) {
            let pos = tagName.indexOf('_');
            if (pos >= 0) {
                return tagName.substring(0, pos);
            }
            else {
                return tagName;
            }
        }
        static firstKeyOf(object) {
            const [firstKey, firstValue] = Object.entries(object)[0];
            return firstKey;
        }
        static docTrace(node) {
            let ret = "";
            do {
                switch (node.nodeType) {
                    case Node.ELEMENT_NODE: //1
                        ret = node.tagName + " < " + ret;
                        break;
                    case Node.ATTRIBUTE_NODE: //2
                        ret = node.name + " < " + ret;
                        break;
                    case Node.TEXT_NODE: //3
                        ret = node.textContent + " < " + ret;
                        break;
                    case Node.CDATA_SECTION_NODE: //4
                    case Node.PROCESSING_INSTRUCTION_NODE: //7
                    case Node.COMMENT_NODE: //8
                    case Node.DOCUMENT_NODE: //9
                    case Node.DOCUMENT_TYPE_NODE: //10
                    case Node.DOCUMENT_FRAGMENT_NODE: //11
                        ret = String(node.nodeType) + " < " + ret;
                        break;
                }
                node = node.parentNode;
            } while (node);
            return ret;
        }
        static htmlBodyToJsml(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const ret = DocComposer.docToJsml(doc.body);
            return ret;
        }
        static docToJsml(node, ui, history, array) {
            let ret = null;
            if (node) {
                if (!ui) {
                    ui = {};
                    ret = ui;
                    DocComposer.dbgRet = ret;
                }
                if (!history) {
                    history = new Map();
                }
                if (history.has(node)) {
                    return null;
                }
                else {
                    history.set(node, null);
                }
                let tagName = DocComposer.tagName(node);
                //console.log( tagName );
                let uiNext = DocComposer.newJsmlNode(node);
                let newArray = null;
                if (Array.isArray(uiNext)) {
                    newArray = uiNext;
                    if (newArray != null && array != null) {
                        let error = 1;
                    }
                    array = newArray;
                    uiNext = newArray[0];
                }
                // Copy attributes
                if (node instanceof Element) {
                    let el = node;
                    for (const attrName of el.getAttributeNames()) {
                        let val = el.getAttribute(attrName);
                        uiNext[attrName] = val;
                    }
                }
                if (array == null) {
                    // Force tag name to be unique
                    let counter = 2;
                    let tn2 = tagName;
                    while (ui[tn2]) {
                        tn2 = `${tagName}_${counter++}`;
                    }
                    tagName = tn2;
                    ui[tagName] = uiNext;
                }
                else {
                    if (newArray != null) {
                        ui[tagName] = newArray;
                    }
                    else {
                        array.push(uiNext);
                    }
                }
                var children = node.childNodes;
                if (children) {
                    for (let i = 0; i < children.length; i++) {
                        DocComposer.docToJsml(children[i], uiNext, history, null);
                    }
                }
                // Now the siblings.
                DocComposer.docToJsml(node.nextSibling, ui, history, array);
            }
            return ret;
        }
        static newJsmlNode(node) {
            let ret = {};
            let startArray = DocComposer.sameTag(node, node.nextSibling) && !DocComposer.sameTag(node, node.previousSibling);
            if (startArray) {
                ret = [{}];
            }
            return ret;
        }
        static sameTag(node1, node2) {
            if ((node1 == null) != (node2 == null)) {
                return false;
            }
            else if (node1 == null) {
                return false;
            }
            else {
                return node1.tagName == node2.tagName;
            }
        }
        static tagName(node) {
            if (node) {
                let el = node;
                if (!el.tagName) {
                    switch (node.nodeType) {
                        case Node.DOCUMENT_NODE:
                            return 'document';
                        case Node.TEXT_NODE:
                            return 'text';
                    }
                }
                else {
                    return el.tagName.toLowerCase();
                }
            }
            return null;
        }
        static testToJsml() {
            let ui = _11dotjs.Tables.demoUi(2, 3, "testToJsml");
            DocComposer.dbgSource = ui;
            let doc = DocComposer.compose(ui, null);
            let ui2 = DocComposer.docToJsml(doc);
            console.log(JSON.stringify(ui2, null, 4));
            DocComposer.compose(ui2, document.body);
            let stop = 1;
        }
        static testToJsml2() {
            //let doc = DocComposer.fetchFromUrl( 'http://www.nytimes.com' );
            let ui = DocComposer.htmlBodyToJsml(`<body><span>span 1</span><span>span 2</span><br/><span>span 3</span></body>`);
            console.log(JSON.stringify(ui, null, 4));
            DocComposer.compose(ui, document.body);
            let stop = 1;
        }
        static testRef() {
            let o1 = {};
            let o2 = { "ref01": null };
            o2.ref01 = o1;
            let test = o2.ref01 == o1;
            let stop = true;
        }
        static fetchFromUrl(url) {
            let ret = null;
            DocComposer.fetchDocumentUsingFetch(url).then((doc) => { ret = doc; });
            return ret;
        }
        // Function to fetch and read a document using Fetch API
        static async fetchDocumentUsingFetch(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html'); // Parse as HTML Document
                console.log('Document fetched successfully:', doc);
                // Return the parsed document
                return doc;
            }
            catch (error) {
                console.error('Failed to fetch the document:', error);
                return null; // Return null in case of error
            }
        }
    }
    DocComposer.dbgRet = null;
    DocComposer.dbgSource = null;
    _11dotjs.DocComposer = DocComposer;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    _11dotjs.defaultFont = "Inter";
    let DialogPosition;
    (function (DialogPosition) {
        DialogPosition[DialogPosition["center"] = 1] = "center";
    })(DialogPosition = _11dotjs.DialogPosition || (_11dotjs.DialogPosition = {}));
    class DialogConfig {
        constructor(modal, parent, title, dialogId, clientAreaId, position) {
            this.modal = modal;
            this.parent = parent;
            this.title = title;
            this.dialogId = dialogId;
            this.clientAreaId = clientAreaId;
            this.position = position;
        }
    }
    _11dotjs.DialogConfig = DialogConfig;
    class Dialog {
        constructor(config) {
            this.dragStart = null;
            this.config = config;
            this.createUi();
        }
        createUi() {
            const zIndex = 999;
            let ui = {
                "div": {
                    "id": this.config.dialogId,
                    "style": `position: fixed; left: 5em; top: 5em; border:0.1em solid RGB(88,88,88); border-radius: 0.5em; z-index: ${zIndex}; `
                        + "min-width: 8em; min-height: 8em; background-color: white; padding:0",
                    "table": {
                        //"style": "width: 100%",
                        "tbody": {
                            "tr": [
                                {
                                    "td": [
                                        {
                                            "text": this.config.title,
                                            "style": `
                                                border:0.1em solid RGB(88,88,88); 
                                                border-radius: 0.5em; 
                                                text-align: center; 
                                                font-family: ${_11dotjs.defaultFont}; 
                                                font-size: 1.2em;
                                                cursor: move;
                                                background-color: RGB(228,254,250)`,
                                            "draggable": true,
                                            "id": this.config.dialogId + "-titleBar"
                                        },
                                        {
                                            "text": "\u00D7",
                                            "style": "text-align: right; width:1em; cursor: pointer; font-size:1.5em",
                                            "onclick": `_11dotjs.Dialog.close('${this.config.dialogId}');`,
                                            "title": "close me",
                                            "id": this.idOfCloseIcon()
                                        }
                                    ]
                                },
                                {
                                    "td": {
                                        "id": this.config.clientAreaId,
                                        "colspan": 2
                                    }
                                }
                            ]
                        }
                    }
                }
            };
            let ret = null;
            if (this.config.modal) {
                // add the overlay to block user interaction with all page content
                // except for our dialog
                let overlay = {
                    "div": {
                        "id": this.config.dialogId + "_overlay",
                        "style": `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${zIndex - 1};`
                    }
                };
                let overlayNode = _11dotjs.DocComposer.compose(overlay, this.config.parent);
                ret = _11dotjs.DocComposer.compose(ui, overlayNode);
            }
            else {
                ret = _11dotjs.DocComposer.compose(ui, this.config.parent);
            }
            this.configureDragDrop(ret, document.getElementById(this.config.dialogId + "-titleBar"));
            return ret;
        }
        idOfCloseIcon() {
            return `${this.config.dialogId}_close_icon`;
        }
        closeIcon() {
            return document.getElementById(this.idOfCloseIcon());
        }
        setPosition() {
            this.setPos(this.config.position);
        }
        setPos(position) {
            if (position) {
                switch (position) {
                    case DialogPosition.center:
                        let dialog = this.getDialogElement();
                        let x = window.innerWidth / 2 - dialog.clientWidth / 2;
                        let y = window.innerHeight / 2 - dialog.clientHeight / 2;
                        dialog.style.left = `${x}px`;
                        dialog.style.top = `${y}px`;
                        let stop = 1;
                        break;
                }
            }
        }
        getDialogElement() {
            return document.getElementById(this.config.dialogId);
        }
        configureDragDrop(dialog, titleBar) {
            if (dialog) {
                let dropArea = dialog.parentNode;
                if (dropArea) {
                    titleBar.addEventListener("dragstart", function (ev) {
                        let de = ev;
                        let me = ev;
                        this.dragStart = [me.clientX, me.clientY];
                        de.dataTransfer.setData("text/plain", "What a drag.");
                        console.log("Drag Start for " + dialog.getAttribute("id"));
                        Dialog.draggingDialog = this;
                    }.bind(this));
                    // Add drop events to the dropArea (body)
                    dropArea.addEventListener('dragover', function (ev) {
                        ev.preventDefault(); // allow dropping
                        //console.log( "Dragging " + ( dialog as HTMLElement ).getAttribute("id") );
                    }.bind(this));
                    dropArea.addEventListener("drop", function (ev) {
                        if (this == Dialog.draggingDialog) {
                            let me = ev;
                            let offset = [me.clientX - this.dragStart[0], me.clientY - this.dragStart[1]];
                            this.dragStart = [this.dragStart[0] + offset[0], this.dragStart[1] + offset[1]];
                            let droppedElement = dialog;
                            let newCss = Dialog.applyOffset(droppedElement.style.left, droppedElement.style.top, offset[0], offset[1]);
                            droppedElement.style.left = newCss.left;
                            droppedElement.style.top = newCss.top;
                            console.log("Drop " + dialog.getAttribute("id"));
                        }
                        else {
                            console.log("Ignore drop of " + titleBar.id);
                        }
                    }.bind(this));
                }
            }
        }
        static close(dialogId) {
            _11dotjs.NodeUtil.detachElement(dialogId);
            _11dotjs.NodeUtil.detachElement(dialogId + "_overlay");
        }
        // chat GPT 2024-06-22
        static applyOffset(styleLeft, styleTop, offsetX, offsetY) {
            // Parse the current left and top values to get the numeric values
            let currentLeft = parseInt(styleLeft, 10);
            let currentTop = parseInt(styleTop, 10);
            // Apply the offsets
            let newLeft = currentLeft + offsetX;
            let newTop = currentTop + offsetY;
            // Return the new left and top style strings
            return {
                left: `${newLeft}px`,
                top: `${newTop}px`
            };
        }
    }
    _11dotjs.Dialog = Dialog;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class Animation {
        static byDuration(task, durationMs, fps) {
            const start = performance.now();
            const frameInterval = 1000 / fps; // Calculate the interval in milliseconds
            let lastFrameTime = start;
            function animationStep(now) {
                const elapsed = now - start;
                if (elapsed < durationMs) {
                    if (now - lastFrameTime >= frameInterval) {
                        task(now);
                        lastFrameTime = now;
                    }
                    requestAnimationFrame(animationStep);
                }
                else {
                    task(now);
                    console.log("Animation completed");
                }
            }
            requestAnimationFrame(animationStep);
        }
        static byIterations(task, iterations, fps) {
            const frameInterval = 1000 / fps; // Calculate the interval in milliseconds
            let count = 0;
            let lastFrameTime = performance.now();
            function animationStep(now) {
                if (count < iterations) {
                    if (now - lastFrameTime >= frameInterval) {
                        task(now);
                        lastFrameTime = now;
                        count++;
                    }
                    requestAnimationFrame(animationStep);
                }
                else {
                    task(now);
                    console.log("Animation completed");
                }
            }
            requestAnimationFrame(animationStep);
        }
    }
    _11dotjs.Animation = Animation;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class ColorPalette {
        constructor(color, callback, componentId, modal) {
            this.imageCache = new Map();
            this.markerLocation = null;
            this.clickedLocation = null;
            this.callback = callback;
            this.componentId = componentId;
            if (!this.componentId) {
                this.componentId = "_11dotjs.colorPalette";
            }
            let canvas = this.getTheRenderCanvas();
            if (!canvas) {
                let clientAreaId = this.componentId + "_dialogClientArea";
                let dialog = new _11dotjs.Dialog({
                    "modal": modal,
                    "parent": document.body,
                    "title": "Intuitive Color Palette",
                    "dialogId": this.componentId + "_colorPaletteDialog",
                    "clientAreaId": clientAreaId,
                    "position": _11dotjs.DialogPosition.center
                });
                this.createUi(document.getElementById(clientAreaId));
                canvas = this.getTheRenderCanvas();
                this.configure(canvas);
                // Positioning depends on dimensions, so we must call 
                // setPosition *after* the client content is added.
                dialog.setPosition();
            }
            // This experiment adds a button that lets the user save the palette image as JSON.
            // The file size was 11.2MB. Obv we won't be saving a lot of rasters as JSON
            if (false) {
                let controlsParent = document.getElementById(this.componentId + "_controls_parent");
                if (controlsParent) {
                    // Add an experimental button to save the image
                    this.objectStorage = new _11dotjs.ObjectStorage({
                        "operation": _11dotjs.ObjectStorageOperation.write,
                        "parent": controlsParent,
                        "label": "Click here to save the image: ",
                        "callback": (payload) => { console.log(`Write ${payload}`); }
                    }, this.componentId + "_objectStorage");
                }
            }
            this.setColor((color) ? color : new _11dotjs.RGB(128, 0, 0), true);
            // create our variable in the global namespace
            window[this.componentId] = this;
        }
        createUi(parent) {
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
                    "tbody": {
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
                                        "input_r": {
                                            "type": "number",
                                            "style": `color:red; font-family: ${_11dotjs.defaultFont};`,
                                            "id": this.componentId + "_redByte",
                                            min: 0,
                                            max: 255,
                                            "oninput": this.componentId + ".onByteTextUpdate();"
                                        },
                                        "br_1": null,
                                        "input_g": {
                                            "type": "number",
                                            "style": `color:green; font-family: ${_11dotjs.defaultFont};`,
                                            "id": this.componentId + "_greenByte",
                                            min: 0,
                                            max: 255,
                                            "oninput": this.componentId + ".onByteTextUpdate();"
                                        },
                                        "br_2": null,
                                        "input_b": {
                                            "type": "number",
                                            "style": `color:blue; font-family: ${_11dotjs.defaultFont};`,
                                            "id": this.componentId + "_blueByte",
                                            min: 0,
                                            max: 255,
                                            "oninput": this.componentId + ".onByteTextUpdate();"
                                        },
                                        "br_3": null,
                                        "span": {
                                            "id": this.componentId + "_controls_parent" //,
                                            //"onclick": () => { _11dotjs.ObjectStorage.experiment( this.getTheRenderCanvas() ) }
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
            _11dotjs.DocComposer.compose(ui, parent);
        }
        configure(canvas) {
            canvas.addEventListener('click', this.handleMouseClick.bind(this));
        }
        getTheRenderCanvas() {
            return document.getElementById(this.componentId + "_rgbCanvas");
        }
        renderLuminance() {
            let el = this.getTheLuminanceSlider();
            if (el) {
                this.renderPalette(Number(el.value));
                if (this.clickedLocation) {
                    this.selectColorAt(this.clickedLocation, true);
                }
            }
        }
        getTheLuminanceSlider() {
            return document.getElementById(this.componentId + "_luminance");
        }
        renderPalette(luminance) {
            let key = this.luminanceKey(luminance);
            let vi = null;
            if (this.imageCache) {
                if (this.imageCache.has(key)) {
                    vi = this.imageCache.get(key);
                    //console.log( 'Image cache hit *(`.');
                }
            }
            if (!vi) {
                //console.log( 'Image cache miss ()`.');
                let colors = _11dotjs.Rgb.colorsWithBrightness(luminance);
                vi = _11dotjs.Rgb.render(colors, ColorPalette.rgbCanvasFill);
                this.imageCache.set(key, vi);
            }
            this.showIt(vi.getImageData(), luminance);
        }
        luminanceKey(brightnessZeroToOne) {
            let ret = `luminance=${brightnessZeroToOne.toFixed(5)}`;
            if (ret.length > 15) {
                let stop = 1;
            }
            return ret;
        }
        colorsWithBrightness(brightnessZeroToOne) {
            let colors = _11dotjs.Rgb.colorsWithBrightness(brightnessZeroToOne);
            let ret = _11dotjs.Rgb.render(colors, ColorPalette.rgbCanvasFill);
            return ret;
        }
        showIt(palette, luminance) {
            this.clearCanvas();
            let canvas = this.getTheRenderCanvas();
            if (canvas) {
                let ctx = this.get2DCanvasRenderingContext();
                if (ctx) {
                    let sx = canvas.width / palette.width;
                    let sy = canvas.height / palette.height;
                    let palette2 = _11dotjs.VisImage.fromImageData(palette).cropImageToContent();
                    let palette3 = palette2.scale(canvas.width, canvas.height);
                    ctx.font = `1em ${_11dotjs.defaultFont}`;
                    ctx.putImageData(palette3.getImageData(), 0, 0);
                    this.showLuminanceLabel(ctx, luminance);
                    if (this.objectStorage) {
                        this.objectStorage.setPayload(palette3.getImageData());
                    }
                }
            }
        }
        showLuminanceLabel(ctx, luminance) {
            ctx.clearRect(0, 0, 170, 24);
            ctx.fillText(`luminance = ${String((luminance * 100).toFixed(0))}%`, 5, 15);
        }
        get2DCanvasRenderingContext() {
            let ret = this.getTheRenderCanvas().getContext("2d");
            // Chrome Developer Tools prompted:
            // Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set 
            // to true. See: https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
            ret.getContextAttributes().willReadFrequently = true;
            return ret;
        }
        clearCanvas() {
            let canvas = this.getTheRenderCanvas();
            if (canvas) {
                let ctx = this.get2DCanvasRenderingContext();
                if (ctx) {
                    ctx.clearRect(0, 0, 512, 512);
                }
            }
            this.markerLocation = null;
        }
        getTheColorSampleCanvas() {
            return document.getElementById(this.componentId + "_colorSample");
        }
        // private  to handle mouse click events
        handleMouseClick(event) {
            if (event instanceof PointerEvent) {
                const canvas = this.getTheRenderCanvas();
                const ctx = this.get2DCanvasRenderingContext();
                const rect = canvas.getBoundingClientRect();
                const x = Math.floor(event.clientX - rect.left);
                const y = Math.floor(event.clientY - rect.top);
                const raster = ctx.getImageData(0, 0, rect.width, rect.height);
                console.log(`Mouse click at: ${x.toFixed(2)}, ${y.toFixed(2)}`);
                this.selectColorAt(new _11dotjs.ColRow(x, y), true);
            }
        }
        selectColorAt(location, showBytes) {
            this.clickedLocation = location;
            const canvas = this.getTheRenderCanvas();
            const ctx = this.get2DCanvasRenderingContext();
            const rect = canvas.getBoundingClientRect();
            const raster = ctx.getImageData(0, 0, rect.width, rect.height);
            const index = location.getAsIndex(rect.width);
            const color = new _11dotjs.RGB(raster.data[index], raster.data[index + 1], raster.data[index + 2]);
            const sample = this.getTheColorSampleCanvas();
            color.fillCanvas(sample);
            if (this.markerLocation) {
                // remove old marker
                _11dotjs.VisImage.toggleMarker(this.markerLocation.getCol(), this.markerLocation.getRow(), ctx);
            }
            _11dotjs.VisImage.toggleMarker(location.getCol(), location.getRow(), ctx);
            this.markerLocation = location;
            sample.title = color.toString();
            //navigator.clipboard.writeText(color.toString());
            if (showBytes) {
                this.showRgbBytes(color);
            }
            if (this.callback) {
                this.callback({ "css": color.cssString() });
            }
        }
        showRgbBytes(color) {
            document.getElementById(this.componentId + "_redByte").value = color.r.toString();
            document.getElementById(this.componentId + "_greenByte").value = color.g.toString();
            document.getElementById(this.componentId + "_blueByte").value = color.b.toString();
        }
        syncLuminanceSlider(color) {
            let input = this.getTheLuminanceSlider();
            if (input) {
                let sliderLuminance = this.sliderLuminance();
                let colorLuminance = color.luminance();
                if (colorLuminance != sliderLuminance) {
                    input.value = String(colorLuminance);
                    this.showLuminanceLabel(this.get2DCanvasRenderingContext(), Number(colorLuminance));
                }
            }
        }
        sliderLuminance() {
            let input = this.getTheLuminanceSlider();
            let sliderLuminance = Number(input.value);
            return sliderLuminance;
        }
        setColor(color, showBytes) {
            const luminance = color.luminance();
            this.renderPalette(luminance);
            const canvas = this.getTheRenderCanvas();
            const rect = canvas.getBoundingClientRect();
            const ctx = this.get2DCanvasRenderingContext();
            const raster = ctx.getImageData(0, 0, rect.width, rect.height);
            const vi = _11dotjs.VisImage.fromImageData(raster);
            let location = vi.findColor(color);
            if (!location) {
                location = vi.findColorApproximate(color, 1);
            }
            if (location) {
                this.selectColorAt(location, showBytes);
                this.syncLuminanceSlider(color);
            }
            else {
                throw color.toString() + " not found";
            }
        }
        onByteTextUpdate() {
            const color = new _11dotjs.RGB(this.harvestRgbByte(document.getElementById(this.componentId + "_redByte")), this.harvestRgbByte(document.getElementById(this.componentId + "_greenByte")), this.harvestRgbByte(document.getElementById(this.componentId + "_blueByte")));
            this.setColor(color, false);
        }
        harvestRgbByte(input) {
            this.validateInput(input);
            const ret = Number((input.value));
            return ret;
        }
        validateInput(input) {
            let value = parseInt(input.value, 10);
            if (isNaN(value)) {
                input.value = ''; // Clear the input if it's not a valid number
                return;
            }
            if (value < input.min) {
                input.value = input.min;
            }
            else if (value > input.max) {
                input.value = input.max;
            }
        }
    }
    ColorPalette.rgbCanvasFill = null;
    _11dotjs.ColorPalette = ColorPalette;
    //export var colorPalette = new ColorPalette();
})(_11dotjs || (_11dotjs = {}));
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var Axis;
(function (Axis) {
    Axis[Axis["x"] = 0] = "x";
    Axis[Axis["y"] = 1] = "y";
    Axis[Axis["z"] = 2] = "z";
})(Axis || (Axis = {}));
class VisPoint {
    constructor(x, y, z) {
        if (((typeof x === 'number') || x === null) && ((typeof y === 'number') || y === null) && ((typeof z === 'number') || z === null)) {
            let __args = arguments;
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else if (((x != null && x instanceof VisPoint) || x === null) && y === undefined && z === undefined) {
            let __args = arguments;
            let p = __args[0];
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.set(p);
        }
        else if (x === undefined && y === undefined && z === undefined) {
            let __args = arguments;
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
        }
        else
            throw new Error('invalid overload');
    }
    set(p) {
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
    }
    toString() {
        const ret = `${this.x}, ${this.y}, ${this.z}`;
        return ret;
    }
    dbgString() {
        //const ret: string = javaemul.internal.StringHelper.format("[%.2f,%.2f,%.2f]", this.x, this.y, this.z);
        return this.toString();
    }
    dbgPrint() {
        console.log(this.dbgString());
    }
    clone() {
        return new VisPoint(this);
    }
    scale$double(adjustor) {
        this.x *= adjustor;
        this.y *= adjustor;
        this.z *= adjustor;
    }
    toDoubleArray() {
        const ret = [0, 0, 0];
        ret[0] = this.x;
        ret[1] = this.y;
        ret[2] = this.z;
        return ret;
    }
    toFloatArray() {
        const ret = [0, 0, 0];
        ret[0] = Math.fround(this.x);
        ret[1] = Math.fround(this.y);
        ret[2] = Math.fround(this.z);
        return ret;
    }
    times(d) {
        const ret = new VisPoint(this.x * d, this.y * d, this.z * d);
        return ret;
    }
    static zero() {
        return new VisPoint(0.0, 0.0, 0.0);
    }
    static one() {
        return new VisPoint(1.0, 1.0, 1.0);
    }
    static min() {
        return new VisPoint(-1.7976931348623157E308, -1.7976931348623157E308, -1.7976931348623157E308);
    }
    static max() {
        return new VisPoint(1.7976931348623157E308, 1.7976931348623157E308, 1.7976931348623157E308);
    }
    static normal() {
        return new VisPoint(0.0, 0.0, 1.0);
    }
    add(offset) {
        this.x += offset.x;
        this.y += offset.y;
        this.z += offset.z;
    }
    subtract(offset) {
        this.x -= offset.x;
        this.y -= offset.y;
        this.z -= offset.z;
    }
    getMax() {
        const ret = Math.max(Math.max(this.x, this.y), this.z);
        return ret;
    }
    /**
     * @param {number} degreesClockwise
     *
     * This is a 2D rotation on the XY plane
     */
    rotateXY(degreesClockwise) {
        const aRadians = /* toRadians */ (x => x * Math.PI / 180)(-degreesClockwise);
        const cosa = Math.cos(aRadians);
        const sina = Math.sin(aRadians);
        const newx = this.x * cosa - this.y * sina;
        const newy = this.x * sina + this.y * cosa;
        this.x = newx;
        this.y = newy;
    }
    /**
     * @param {number} degreesClockwise
     *
     * This is a 2D rotation on the XZ plane
     */
    rotateXZ(degreesClockwise) {
        const aRadians = /* toRadians */ (x => x * Math.PI / 180)(-degreesClockwise);
        const cosa = Math.cos(aRadians);
        const sina = Math.sin(aRadians);
        const newx = this.x * cosa - this.z * sina;
        const newz = this.x * sina + this.z * cosa;
        this.x = newx;
        this.z = newz;
    }
    /**
     * @param {number} degreesClockwise
     *
     * This is a 2D rotation on the YZ plane
     */
    rotateYZ(degreesClockwise) {
        const aRadians = /* toRadians */ (x => x * Math.PI / 180)(-degreesClockwise);
        const cosa = Math.cos(aRadians);
        const sina = Math.sin(aRadians);
        const newy = this.y * cosa - this.z * sina;
        const newz = this.y * sina + this.z * cosa;
        this.y = newy;
        this.z = newz;
    }
    rotate$com_osx_common_VisPoint$com_osx_common_VisPoint(origin, normal) {
        const work = /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(this);
        work.subtract(origin);
        const normalNormal = VisPoint.normal();
        const normalOnXZ = /* clone */ /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(normal);
        normalOnXZ.y = 0.0;
        const aXZ = normalNormal.angleWith$com_osx_common_VisPoint(normalOnXZ);
        work.rotateXZ(aXZ);
        const normalOnXY = /* clone */ /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(normal);
        normalOnXY.z = 0.0;
        const aXY = normalNormal.angleWith$com_osx_common_VisPoint(normalOnXY);
        work.rotateXY(aXY);
        const normalOnYZ = /* clone */ /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(normal);
        normalOnYZ.x = 0.0;
        const aYZ = normalNormal.angleWith$com_osx_common_VisPoint(normalOnYZ);
        work.rotateYZ(aYZ);
        work.add(origin);
        this.set(work);
    }
    rotate$com_osx_common_VisPoint$double$double$double(origin, aX, aY, aZ) {
        const work = /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(this);
        work.subtract(origin);
        work.rotateYZ(aX);
        work.rotateXZ(aY);
        work.rotateXY(aZ);
        work.add(origin);
        this.set(work);
    }
    /**
     * Rotate this
     *
     * @param {VisPoint} origin
     * @param {number} aX
     * @param {number} aY
     * @param {number} aZ
     */
    rotate(origin, aX, aY, aZ) {
        if (((origin != null && origin instanceof VisPoint) || origin === null) && ((typeof aX === 'number') || aX === null) && ((typeof aY === 'number') || aY === null) && ((typeof aZ === 'number') || aZ === null)) {
            return this.rotate$com_osx_common_VisPoint$double$double$double(origin, aX, aY, aZ);
        }
        else if (((origin != null && origin instanceof VisPoint) || origin === null) && ((aX != null && aX instanceof VisPoint) || aX === null) && ((typeof aY === 'number') || aY === null) && aZ === undefined) {
            return this.rotate$com_osx_common_VisPoint$com_osx_common_VisPoint$double(origin, aX, aY);
        }
        else if (((origin != null && origin instanceof VisPoint) || origin === null) && ((aX != null && aX instanceof VisPoint) || aX === null) && aY === undefined && aZ === undefined) {
            return this.rotate$com_osx_common_VisPoint$com_osx_common_VisPoint(origin, aX);
        }
        else
            throw new Error('invalid overload');
    }
    rotate$com_osx_common_VisPoint$com_osx_common_VisPoint$double(o1, o2, a) {
        const axis = /* clone */ /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(o2);
        axis.subtract(o1);
        if (!axis.isZero()) {
            let aZ = 0.0;
            const axisOnYZ = new VisPoint(0.0, axis.y, axis.z);
            if (!axisOnYZ.isZero()) {
                aZ = axis.angleWith$com_osx_common_VisPoint(axisOnYZ);
            }
            else {
                aZ = (axis.x > 0.0) ? 90.0 : -90.0;
            }
            const yAxis = new VisPoint(0.0, 1.0, 0.0);
            const aX = axisOnYZ.angleWith$com_osx_common_VisPoint(yAxis);
            const result = /* clone */ ((o) => { if (o.clone != undefined) {
                return o.clone();
            }
            else {
                let clone = Object.create(o);
                for (let p in o) {
                    if (o.hasOwnProperty(p))
                        clone[p] = o[p];
                }
                return clone;
            } })(this);
            result.rotateXY(-aZ);
            result.rotateYZ(-aX);
            result.rotateXZ(a);
            result.rotateYZ(aX);
            result.rotateXY(aZ);
            this.set(result);
        }
    }
    /**
     * @param {VisPoint} o1
     * @param {VisPoint} o2
     * @param {number} a
     *
     * Rotate this a degrees around the axis formed by other points
     * o1 and o2
     */
    rotateSUX(o1, o2, a) {
        const axis = /* clone */ /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(o2);
        axis.subtract(o1);
        const axisOnYZ = new VisPoint(0.0, axis.y, axis.z);
        const aZ = axis.angleWith$com_osx_common_VisPoint(axisOnYZ);
        const axisOnXY = new VisPoint(axisOnYZ.x, axisOnYZ.y, 0.0);
        const aX = axisOnYZ.angleWith$com_osx_common_VisPoint(axisOnXY);
        const result = /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(this);
        result.subtract(o1);
        result.rotateXZ(a);
        result.rotateYZ(-aX);
        result.rotateXY(-aZ);
        result.add(o1);
        this.set(result);
    }
    scale$com_osx_common_VisPoint$double$double$double(origin, sX, sY, sZ) {
        const work = /* clone */ ((o) => { if (o.clone != undefined) {
            return o.clone();
        }
        else {
            let clone = Object.create(o);
            for (let p in o) {
                if (o.hasOwnProperty(p))
                    clone[p] = o[p];
            }
            return clone;
        } })(this);
        work.subtract(origin);
        work.x *= sX;
        work.y *= sY;
        work.z *= sZ;
        work.add(origin);
        this.set(work);
    }
    scale(origin, sX, sY, sZ) {
        if (((origin != null && origin instanceof VisPoint) || origin === null) && ((typeof sX === 'number') || sX === null) && ((typeof sY === 'number') || sY === null) && ((typeof sZ === 'number') || sZ === null)) {
            return this.scale$com_osx_common_VisPoint$double$double$double(origin, sX, sY, sZ);
        }
        else if (((typeof origin === 'number') || origin === null) && sX === undefined && sY === undefined && sZ === undefined) {
            return this.scale$double(origin);
        }
        else
            throw new Error('invalid overload');
    }
    angleWith$com_osx_common_VisPoint(other) {
        const origin = VisPoint.zero();
        const a = this.distance(other);
        const b = origin.distance(this);
        const c = origin.distance(other);
        let ret = 0.0;
        if (a > 0.0 && b > 0.0 && c > 0.0) {
            const num = b * b + c * c - a * a;
            const den = 2 * b * c;
            const arg = num / den;
            ret = Math.acos(arg);
        }
        ret = /* toDegrees */ (x => x * 180 / Math.PI)(ret);
        return ret;
    }
    angleWith$com_osx_common_VisPoint$com_osx_common_VisPoint(common, other) {
        const moveThis = new VisPoint(this.x - common.x, this.y - common.y, this.z - common.z);
        const moveOther = new VisPoint(other.x - common.x, other.y - common.y, other.z - common.z);
        const ret = moveThis.angleWith$com_osx_common_VisPoint(moveOther);
        return ret;
    }
    /**
     * Return the angle between two lines at a common point
     * @param {VisPoint} common
     * @param {VisPoint} other
     * @return {number}
     */
    angleWith(common, other) {
        if (((common != null && common instanceof VisPoint) || common === null) && ((other != null && other instanceof VisPoint) || other === null)) {
            return this.angleWith$com_osx_common_VisPoint$com_osx_common_VisPoint(common, other);
        }
        else if (((common != null && common instanceof VisPoint) || common === null) && other === undefined) {
            return this.angleWith$com_osx_common_VisPoint(common);
        }
        else
            throw new Error('invalid overload');
    }
    /**
     * @param {number} number 1-3
     * @return {number} x, y, or z respectively
     */
    getCoordinate(number) {
        const ret = (number === 1) ? this.x : (number === 2) ? this.y : this.z;
        return ret;
    }
    /**
     * @param {number} number 1-3
     * @param {number} value - value to apply to x, y, or z respectively
     * @return
     */
    setCoordinate(number, value) {
        switch ((number)) {
            case 1:
                this.x = value;
                break;
            case 2:
                this.y = value;
                break;
            case 3:
                this.z = value;
                break;
        }
    }
    static getCoordinateName(number) {
        const ret = (number === 1) ? "x" : (number === 2) ? "y" : "z";
        return ret;
    }
    equals(other) {
        //const ret: boolean = com.osx.common.Utility.fEqual$double$double(this.x, other.x) && com.osx.common.Utility.fEqual$double$double(this.y, other.y) && com.osx.common.Utility.fEqual$double$double(this.z, other.z);
        const ret = (this.x == other.x && this.y == other.y && this.x == other.z);
        return ret;
    }
    distance(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dz = other.z - this.z;
        const ret = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return ret;
    }
    onLineSegment(other, scale) {
        const ret = new VisPoint(this.x + (other.x - this.x) * scale, this.y + (other.y - this.y) * scale, this.z + (other.z - this.z) * scale);
        return ret;
    }
    allNonZero() {
        let ret = true;
        if (this.x === 0.0 || this.y === 0.0 || this.z === 0.0) {
            ret = false;
        }
        return ret;
    }
    isZero() {
        // if (com.osx.common.Utility.fZero(this.x) && com.osx.common.Utility.fZero(this.y) && com.osx.common.Utility.fZero(this.z)){
        const ret = (this.x == 0.0 && this.y == 0.0 && this.x == 0.0);
        return ret;
    }
    modulate(other, mag) {
        this.x += other.x * mag;
        this.y += other.y * mag;
        this.z += other.z * mag;
    }
    scaleToUnitLength() {
        let mag;
        mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (mag !== 1.0 && mag > 0.0) { //com.osx.common.Utility.DOUBLE_ROUND_OFF_TOLERANCE
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }
    }
    perpendicular() {
        let ret = null;
        if (!this.isZero()) {
            const lra = this.leastRepresentedAxis();
            ret = /* clone */ /* clone */ ((o) => { if (o.clone != undefined) {
                return o.clone();
            }
            else {
                let clone = Object.create(o);
                for (let p in o) {
                    if (o.hasOwnProperty(p))
                        clone[p] = o[p];
                }
                return clone;
            } })(this);
            if ( /* Enum.equals */((Axis.x) === (lra))) {
                ret.rotateYZ(90.0);
            }
            else if ( /* Enum.equals */((Axis.y) === (lra))) {
                ret.rotateXZ(90.0);
            }
            else if ( /* Enum.equals */((Axis.z) === (lra))) {
                ret.rotateXY(90.0);
            }
        }
        return ret;
    }
    leastRepresentedAxis() {
        let ret = Axis.x;
        if (Math.abs(this.y) < Math.abs(this.x)) {
            ret = Axis.y;
        }
        if (Math.abs(this.z) < Math.abs(this.y)) {
            ret = Axis.z;
        }
        return ret;
    }
    clockwise90() {
        const ret = new VisPoint(this.z, -this.x, -this.y);
        return ret;
    }
    invert() {
        this.x *= -1.0;
        this.y *= -1.0;
        this.z *= -1.0;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getZ() {
        return this.z;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setZ(z) {
        this.z = z;
    }
    /**
     * @param {string} s A string we can parse as x,y,z
     * @return {VisPoint}
     */
    static fromString(s) {
        //const t: com.osx.common.Utility.Text = com.osx.common.Utility.Text.fromString(s, ",");
        //const ret: VisPoint = new VisPoint(parseFloat(/* get */(<any>t).__delegate[0]), parseFloat(/* get */(<any>t).__delegate[1]), parseFloat(/* get */(<any>t).__delegate[2]));
        throw "TODO: code VisPoint.fromString";
        //return ret;
    }
    interpolate(other, portion) {
        const interp = new VisPoint(this.x + (other.x - this.x) * portion, this.y + (other.y - this.y) * portion, this.z + (other.z - this.z) * portion);
        return interp;
    }
}
class Vpl extends Array {
    clone() {
        throw ("Vpl.clone not implemented");
    }
}
var _11dotjs;
(function (_11dotjs) {
    let ObjectStorageOperation;
    (function (ObjectStorageOperation) {
        ObjectStorageOperation[ObjectStorageOperation["read"] = 1] = "read";
        ObjectStorageOperation[ObjectStorageOperation["write"] = 2] = "write";
    })(ObjectStorageOperation = _11dotjs.ObjectStorageOperation || (_11dotjs.ObjectStorageOperation = {}));
    class ObjectStorageConfig {
    }
    _11dotjs.ObjectStorageConfig = ObjectStorageConfig;
    class ObjectStorage {
        constructor(config, componentId, writePayload) {
            this.readPayload = null;
            this.writePayload = writePayload;
            this.config = config;
            this.componentId = componentId;
            this.createUi();
        }
        createUi() {
            let ui = {
                "label": {
                    "text": this.config.label,
                    "style": `font-family: ${_11dotjs.defaultFont};`,
                    "input": {
                        "id": this.inputElementId(),
                        "type": "file",
                        "title": this.config.tooltip,
                        "accept": this.config.accept,
                        "multiple": this.config.multiple,
                        "style": `font-family: ${_11dotjs.defaultFont};`,
                    }
                }
            };
            _11dotjs.DocComposer.compose(ui, this.config.parent);
            this.inputElement().addEventListener("input", this.inputHandler());
        }
        inputElementId() {
            return this.componentId + "_input";
        }
        inputElement() {
            return document.getElementById(this.inputElementId());
        }
        inputHandler() {
            switch (this.config.operation) {
                case ObjectStorageOperation.read:
                    return function (ev) { this.readFile(ev); }.bind(this);
                    break;
                case ObjectStorageOperation.write:
                    return function (ev) { this.writeFile(ev); }.bind(this);
                    break;
            }
        }
        //
        // Read zero or more files and return an array of JS objects. Also
        // save the payload(s) in this.readPayload
        // GPT 2024-07-20 gave me the use of Promise to simulate blocking read.
        async readFile(ev) {
            const ret = [];
            let files = ev.target.files;
            const readAsText = (file) => {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(reader.error);
                    reader.readAsText(file);
                });
            };
            const fileReaders = [];
            for (let i = 0; i < files.length; i++) {
                fileReaders.push(readAsText(files[i]).then((text) => {
                    ret.push(JSON.parse(text));
                }).catch((error) => {
                    console.error("Error reading file:", error);
                }));
            }
            // Await the Promise.all to ensure it's blocking and then assign the resolved ret array to this.readPayload
            await Promise.all(fileReaders);
            // Update the instance member after reading all files
            this.readPayload = ret;
            // Call the callback with the result
            if (this.config.callback) {
                this.config.callback(this.readPayload);
            }
        }
        // Called after user chooses an output file path using an <input type="file"/>
        // Due to sandboxing, a download is as close as we can get to a true Save UX
        async writeFile(ev) {
            if (this.writePayload) {
                let json = JSON.stringify(this.writePayload);
                let file = ev.target.files[0];
                try {
                    ObjectStorage.downloadJson(json, file.name);
                    console.log("File written successfully");
                }
                catch (error) {
                    console.error("Error writing file:", error);
                }
            }
            else {
                console.log("_11dotjs.ObjectStorage.writeFile: no payload!");
            }
        }
        setPayload(payload) {
            this.writePayload = payload;
        }
        static downloadObject(payload, name) {
            let json = JSON.stringify(payload);
            ObjectStorage.downloadJson(json, name);
        }
        static downloadJson(json, name) {
            // Create a new blob with the JSON data
            let blob = new Blob([json], { type: 'application/json' });
            // Create a link element
            let link = document.createElement('a');
            // Create a URL for the blob and set it as the href attribute
            link.href = URL.createObjectURL(blob);
            // Set the download attribute with the original file name
            link.download = name;
            // Append the link to the body (necessary for Firefox)
            document.body.appendChild(link);
            // Programmatically click the link to trigger the download
            link.click();
            // Clean up the URL object
            URL.revokeObjectURL(link.href);
            // Remove the link from the document
            document.body.removeChild(link);
        }
    }
    _11dotjs.ObjectStorage = ObjectStorage;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class WebGL {
        constructor() {
            // Retrieve the canvas element and its WebGL rendering context
            this.canvas = null;
            this.gl = null;
            this.vsSource = null;
            this.fsSource = null;
            this.clearColor = null;
            this.initWebGl();
        }
        initWebGl() {
            this.canvas = document.getElementById('glCanvas');
            this.gl = this.canvas.getContext('webgl');
            if (!this.gl) {
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
        initShaderProgram(gl, vsSource, fsSource) {
            const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
            // Create the shader program
            const shaderProgram = gl.createProgram();
            if (!shaderProgram || !vertexShader || !fragmentShader) {
                throw new Error("Error creating shader program");
            }
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            // Check if it linked successfully
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                const info = gl.getProgramInfoLog(shaderProgram);
                gl.deleteProgram(shaderProgram);
                throw new Error('Unable to initialize the shader program: ' + info);
            }
            return shaderProgram;
        }
        // Load a shader
        loadShader(gl, type, source) {
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
        initBuffers(gl) {
            // Create a buffer for the square's positions.
            const positionBuffer = gl.createBuffer();
            // Select the positionBuffer as the one to apply buffer
            // operations to from here out.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            // Now create an array of positions for the square.
            const origin = new VisPoint(0.0, 0.0, 0.0);
            this.positions = this.sphereVertexList(origin, 8.0);
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
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
            return positionBuffer;
        }
        sphereVertexList(origin, radius) {
            const slices = 8; //this.getSlices();
            const rings = 8; //this.getRings();
            const PI = Math.PI;
            let rho;
            let drho;
            let theta;
            let dtheta;
            let x;
            let y;
            let z;
            let s;
            let t;
            let ds;
            let dt;
            let i;
            let j;
            let imin;
            let imax;
            const oX = origin.x;
            const oY = origin.y;
            const oZ = origin.z;
            drho = PI / rings;
            dtheta = 2.0 * PI / slices;
            //this.glBegin(GL.GL_TRIANGLE_FAN);
            //this.normal$float$float$float(0.0, 0.0, 1.0);
            //this.vertex$double$double$double(oX, oY, oZ + radius);
            const ret = [];
            ret.push(oX, oY, oZ + radius);
            for (j = 0; j <= slices; j++) {
                {
                    theta = (j === slices) ? 0.0 : j * dtheta;
                    x = -Math.sin(theta) * Math.sin(drho);
                    y = Math.cos(theta) * Math.sin(drho);
                    z = Math.cos(drho);
                    //this.normal$double$double$double(x, y, z);
                    //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                    ret.push(oX + x * radius, oY + y * radius, oZ + z * radius);
                }
                ;
            }
            //this.glEnd();
            ds = Math.fround(1.0 / slices);
            dt = Math.fround(1.0 / rings);
            t = 1.0;
            imin = 1;
            imax = rings - 1;
            for (i = imin; i < imax; i++) {
                {
                    rho = i * drho;
                    //this.glBegin(GL.GL_QUAD_STRIP);
                    s = 0.0;
                    for (j = 0; j <= slices; j++) {
                        {
                            theta = (j === slices) ? 0.0 : j * dtheta;
                            x = -Math.sin(theta) * Math.sin(rho);
                            y = Math.cos(theta) * Math.sin(rho);
                            z = Math.cos(rho);
                            //this.normal$double$double$double(x, y, z);
                            //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                            ret.push(oX + x * radius, oY + y * radius, oZ + z * radius);
                            x = -Math.sin(theta) * Math.sin(rho + drho);
                            y = Math.cos(theta) * Math.sin(rho + drho);
                            z = Math.cos(rho + drho);
                            //this.normal$double$double$double(x, y, z);
                            s += ds;
                            //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                            ret.push(oX + x * radius, oY + y * radius, oZ + z * radius);
                        }
                        ;
                    }
                    //this.glEnd();
                    t -= dt;
                }
                ;
            }
            //this.glBegin(GL.GL_TRIANGLE_FAN);
            //this.normal$float$float$float(0.0, 0.0, -1.0);
            //this.vertex$double$double$double(oX + 0.0, oY + 0.0, oZ + -radius);
            ret.push(oX + 0.0, oY + 0.0, oZ + -radius);
            rho = PI - drho;
            s = 1.0;
            for (j = slices; j >= 0; j--) {
                {
                    theta = (j === slices) ? 0.0 : j * dtheta;
                    x = -Math.sin(theta) * Math.sin(rho);
                    y = Math.cos(theta) * Math.sin(rho);
                    z = Math.cos(rho);
                    //this.normal$double$double$double(x, y, z);
                    s -= ds;
                    //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                    ret.push(oX + x * radius, oY + y * radius, oZ + z * radius);
                }
                ;
            }
            //this.glEnd();
            return ret;
        }
        // Draw the scene
        drawScene(gl, programInfo, buffers) {
            // Clear the canvas before we start drawing on it.
            gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute.
            {
                const numComponents = 3; // pull out 3 values per iteration
                const type = gl.FLOAT; // the data in the buffer is 32bit floats
                const normalize = false; // don't normalize
                const stride = 0; // how many bytes to get from one set of values to the next
                // 0 = use type and numComponents above
                const offset = 0; // how many bytes inside the buffer to start from
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
                gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
            }
            // Tell WebGL to use our program when drawing
            gl.useProgram(programInfo.program);
            this.configureViewVolume(programInfo.program);
            this.configureLighting(programInfo.program);
            // Set the shader uniforms
            {
                const offset = 0;
                const vertexCount = this.positions.length / 3;
                // Break here to see output?!
                gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
                let stop = 1;
            }
        }
        configureViewVolume(program) {
            //var mat4: any;
            // Set up the view volume and perspective projection matrix
            const fieldOfView = 45 * Math.PI / 180; // in radians
            const aspect = this.canvas.width / this.canvas.height;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
            // Set up the model view matrix (camera position)
            const modelViewMatrix = mat4.create();
            mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -20.0]); // Move back 6 units
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
        configureLighting(program) {
            const lightDirection = vec3.fromValues(-0.5, -0.5, -0.5);
            vec3.normalize(lightDirection, lightDirection);
            const uLightDirection = this.gl.getUniformLocation(program, 'u_lightDirection');
            const uLightColor = this.gl.getUniformLocation(program, 'u_lightColor');
            const uAmbientColor = this.gl.getUniformLocation(program, 'u_ambientColor');
            this.gl.uniform3fv(uLightDirection, lightDirection);
            this.gl.uniform4f(uLightColor, 1.0, 1.0, 1.0, 1.0); // White light
            this.gl.uniform4f(uAmbientColor, 0.2, 0.2, 0.2, 1.0); // Ambient light
        }
        // Main function
        // 2024-07-06 - I am not too clever. This demo renders only blackness. I
        // wrote the code to create vertices for a sphere, but I still need a 
        // view volume and lighting. Phooey. It's a lot of work, for what??
        //
        runDemo() {
            // Initialize WebGL
            const shaderProgram = this.initShaderProgram(this.gl, this.vsSource, this.fsSource);
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                },
            };
            const buffers = {
                position: this.initBuffers(this.gl),
            };
            this.drawScene(this.gl, programInfo, buffers);
        }
        static demo() {
            _11dotjs.DocComposer.compose({
                "canvas": {
                    "id": "glCanvas",
                    "width": 1400,
                    "height": 900,
                    "style": "cursor: crosshair"
                },
                "script": {
                    "src": "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
                }
            }, document.body);
            let webGl = new WebGL();
            webGl.runDemo();
        }
    }
    _11dotjs.WebGL = WebGL;
})(_11dotjs || (_11dotjs = {}));
var _11dotjs;
(function (_11dotjs) {
    class Demo {
        //
        // This is a Demonstration of using 11dotjs to make a demonstration of 11dotjs!
        //
        static demo() {
            _11dotjs.Config.uponLoad();
            _11dotjs.LocalStorage.registerInstance();
            const body = document.body;
            body.style.fontFamily = "Inter";
            // Create a dark mood
            body.style.backgroundColor = "black";
            if (!Demo.checkChannel()) {
                Demo.composerDemo();
            }
            Demo.renderMainIndicators(Demo.channel(), _11dotjs.LocalStorage.getTabCount());
        }
        static composerDemo() {
            // Get the code of this demo to show in the center pane.
            const body = document.body;
            _11dotjs.DocComposer.compose(Demo.layoutTable(), body);
            // Reconfigure the top row
            let td00 = _11dotjs.Tables.getCellElement(Demo.componentId, 0, 0);
            td00.colSpan = 2;
            td00.nextSibling.remove();
            _11dotjs.DocComposer.compose({
                "table": {
                    "style": "width: 100%",
                    "tr": {
                        "td": {
                            "div": {
                                "style": "font-size: 2.5em; text-align:center;",
                                "text": "D E M O * 11dotjs"
                            }
                        }
                    },
                    "tr_2": {
                        "td": {
                            "div": {
                                "style": "font-size: 1.25em; text-align:center;",
                                "text": "Author => JSON.parse => DocComposer => Document"
                            }
                        }
                    }
                }
            }, td00);
            // Create the code panel
            let tdCode = _11dotjs.Tables.getCellElement(Demo.componentId, 1, 0);
            tdCode.innerHTML = null;
            tdCode.style.width = "40%";
            _11dotjs.DocComposer.compose({
                "textarea": {
                    "id": Demo.idOfTextArea(),
                    "style": `margin-top: 0.5em; color: RGB(180, 180, 180); background-color: RGB(11,11,11);overflow-x: auto; 
                    white-space: nowrap; font-family: Roboto Mono; font-size: small; width:auto`,
                    "rows": 30,
                    "cols": 96,
                    "spellcheck": false,
                    "text": Demo.defaultGuiJson(),
                    "oninput": "_11dotjs.Demo.renderPreview( event )"
                },
                "br": null,
                "div": {
                    "style": "margin-top: 0.5em",
                    "label": {
                        "input": {
                            "id": Demo.idOfShowHtmlCheckBox(),
                            "type": "checkbox",
                            "onchange": "_11dotjs.Demo.onChangeShowHtml( event )"
                        },
                        "text": "Show the HTML"
                    },
                    "span": {
                        "style": "margin-left: 1.5em",
                        "text": "JSON.parse",
                        "id": Demo.idOfParseIndicator(),
                    },
                    "span_2": {
                        "style": "margin-left: 1.5em",
                        "text": "DocComposer",
                        "id": Demo.idOfComposerIndicator(),
                    },
                    "a": {
                        "text": "Download this JSON",
                        "style": "margin-left: 1.5em",
                        "href": "#",
                        "onclick": `_11dotjs.ObjectStorage.downloadJson(
                            _11dotjs.Demo.textArea().value, 
                            '${Demo.downloadFileName}'
                        );`
                    }
                }
            }, tdCode);
            Demo.taCode = Demo.textArea();
            Demo.configureTextAreaForTabInsertion(Demo.taCode);
            Demo.renderPreview(null);
            // Center the layout table
            let table = _11dotjs.NodeUtil.firstParent(td00, "TABLE");
            if (table) {
                let tEl = table;
                tEl.style.margin = "auto";
                tEl.style.width = "96%";
            }
        }
        static idOfParseIndicator() {
            return Demo.componentId + "_parseIndicator";
        }
        static idOfComposerIndicator() {
            return Demo.componentId + "_composerIndicator";
        }
        static parseIndicator() {
            return document.getElementById(Demo.idOfParseIndicator());
        }
        static composerIndicator() {
            return document.getElementById(Demo.idOfComposerIndicator());
        }
        static idOfShowHtmlCheckBox() {
            return Demo.componentId + "_cbHtml";
        }
        static showHtmlCheckBox() {
            return document.getElementById(Demo.idOfShowHtmlCheckBox());
        }
        static textArea() {
            let ret = document.getElementById(Demo.idOfTextArea());
            return ret;
        }
        static idOfTextArea() {
            let ret = `${Demo.componentId}_textArea`;
            return ret;
        }
        static renderPreview(event) {
            // Preview the GUI in the right-hand panel
            let json = (event) ? event.target.value : Demo.taCode.value;
            if (json == Demo.lastValidJson) {
                // OPTIMIZATION
                Demo.showParseError(false, null);
                return;
            }
            let o = null;
            try {
                o = JSON.parse(json);
            }
            catch (msg) {
                Demo.showParseError(true, msg.toString());
                return;
            }
            Demo.showParseError(false, null);
            let n = null;
            try {
                n = _11dotjs.DocComposer.compose(o, null);
            }
            catch (msg) {
                Demo.showDocComposerError(true, msg);
                return;
            }
            let tdPv = Demo.previewElement();
            tdPv.innerHTML = null;
            tdPv.appendChild(n);
            Demo.showDocComposerError(false, null);
            Demo.lastValidJson = json;
        }
        static previewElement() {
            return _11dotjs.Tables.getCellElement(Demo.componentId, 1, 1);
        }
        static showDocComposerError(composeFailure, msg) {
            let span = Demo.composerIndicator();
            if (composeFailure) {
                span.style.color = Demo.rgbErrorIndicator;
                span.innerHTML = `DocComposer: ${msg}`;
            }
            else {
                span.style.color = Demo.rgbOkIndicator;
                span.innerHTML = `DocComposer`;
            }
        }
        static showParseError(parseFailure, msg) {
            let span = Demo.parseIndicator();
            if (parseFailure) {
                span.style.color = Demo.rgbErrorIndicator;
                span.innerHTML = `JSON.parse: ${msg}`;
                // This makes it impossible to type in there
                //Demo.highlightJsonError( Demo.textArea(), msg );
            }
            else {
                span.style.color = Demo.rgbOkIndicator;
                span.innerHTML = `JSON.parse`;
            }
            span.style.color = (parseFailure) ? Demo.rgbErrorIndicator : Demo.rgbOkIndicator;
        }
        // gpt but fixed by me. GPT had an off-by-one error, lol, and the scroll piece did not work
        static highlightJsonError(textarea, msg) {
            const jsonText = textarea.value;
            const match = msg.match(/position (\d+)/);
            if (match) {
                const position = parseInt(match[1], 10);
                // Convert position to line and column
                const lines = jsonText.substring(0, position).split("\n");
                const lineNumber = lines.length;
                const columnNumber = lines[lines.length - 1].length + 1;
                // Move cursor to the error position
                textarea.focus();
                textarea.setSelectionRange(position, position + 1);
            }
        }
        static onChangeShowHtml(event) {
            if (event.target.checked) {
                Demo.showHtml();
            }
            else {
                Demo.hideHtml();
            }
        }
        static hideHtml() {
            _11dotjs.NodeUtil.detachElement(Demo.idOfHtmlDialog());
        }
        static showHtml() {
            let ta = Demo.textArea();
            let json = ta.value;
            let o = JSON.parse(json);
            let doc = _11dotjs.DocComposer.compose(o, null);
            let html = doc.outerHTML; // not formatted )`.
            //alert(html);
            let clientAreaId = this.componentId + "_dialogClientArea";
            let dialog = new _11dotjs.Dialog({
                "modal": false,
                "parent": document.body,
                "title": "HTML",
                "dialogId": Demo.idOfHtmlDialog(),
                "clientAreaId": clientAreaId,
                "position": _11dotjs.DialogPosition.center
            });
            let parent = document.getElementById(clientAreaId);
            _11dotjs.DocComposer.compose({
                "div": {
                    "style": `
                            max-width: 30em; 
                            overflow: auto; 
                            font-family: Roboto Mono; 
                            font-size: small`,
                    "text": html,
                    "id": this.componentId + "_divHtml"
                },
                "button": {
                    "style": "margin-top: 0.5em; float: right",
                    "text": "Select All",
                    "onclick": `_11dotjs.Demo.selectText( '${this.componentId}_divHtml' );`
                }
            }, parent);
            dialog.setPosition();
            let closeIcon = dialog.closeIcon();
            if (closeIcon) {
                closeIcon.addEventListener("click", () => { this.showHtmlCheckBox().checked = false; });
            }
        }
        static selectText(id) {
            let div = document.getElementById(id);
            if (div) {
                // Create a Range object
                const range = document.createRange();
                // Select the text inside the <div>
                range.selectNodeContents(div);
                // Clear any existing selections
                const selection = window.getSelection();
                selection.removeAllRanges();
                // Add the newly created range to the selection
                selection.addRange(range);
            }
        }
        static idOfHtmlDialog() {
            return this.componentId + "_theHtml";
        }
        static htmlDialog() {
            return document.getElementById(Demo.idOfHtmlDialog());
        }
        static defaultGuiJson() {
            let ret = `{
    "div": {
        "style": "width: 40em; font-family: Inter; ",
        "p": {
            "text": "Welcome. You are looking at a demonstration of the 11dotjs DocComposer class. It provides a web-authoring model based on JavaScript objects in place of HTML. When you edit the code in the left-hand panel, this preview will update."
        },
        "iframe": {
            "src": "https://www.youtube.com/embed/ZrcVIwgysBE",
            "width": 374,
            "height": 210,
            "title": "YouTube video player",
            "frameborder": 0,
            "allow": "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            "referrerpolicy": "strict-origin-when-cross-origin",
            "allowfullscreen": true
        },
        "br": null, "br_": null,
        "text": "more demos: ",
        "a": {
            "text": "Intuitive Color Palette",
            "href": "#",
            "onclick": "_11dotjs.Demo.colorPaletteDemo();"
        },
        "span": { "text": " . " },
        "a_2": {
            "text": "Tables",
            "href": "#",
            "onclick": "_11dotjs.Demo.tablesDemo();"
        },
        "span_2": { "text": " . " },
        "a_3": {
            "text": "Modal Dialog",
            "href": "#",
            "onclick": "_11dotjs.Demo.modalDialogDemo();"
        },
        "span_3": { "text": " . " },
        "a_4": {
            "text": "WebGL",
            "href": "#",
            "onclick": "_11dotjs.WebGL.demo();"
        },
        "br_2": null, "br_3": null,
        "text_2": "links: ",
        "a_9": {
            "text": "11dotjs on GitHub",
            "href": "https://github.com/elisokal/11dotjs"
        }
    }
}`;
            //let ret = JSON.stringify( o, null, 4 );
            return ret;
        }
        static layoutTable() {
            const ret = _11dotjs.Tables.generate({
                "componentId": Demo.componentId,
                "hasHeader": false,
                "rowCount": 2,
                "columnCount": 2,
                "cellContent": [[{}]],
                "cellStyle": [["padding: 2em; background-color: RGB(11,11,11); border: 0.7em solid RGB(44,44,44); border-radius: 2em; color: RGB(180, 180, 180); vertical-align: top"]]
            });
            return ret;
        }
        static colorPaletteDemo() {
            Demo.colorPalette("colorPaletteDemo", false);
        }
        static modalDialogDemo() {
            Demo.colorPalette("modalDialogDemo", true);
        }
        static colorPalette(id, modal) {
            new _11dotjs.ColorPalette(Demo.currentBorderColor(), (color) => {
                let table = _11dotjs.NodeUtil.firstParent(_11dotjs.Tables.getCellElement(Demo.componentId, 0, 0), "TABLE");
                for (let td of Array.from(table.querySelectorAll("td"))) {
                    if (td.id) {
                        td.style.border = `0.7em solid ${color.css}`;
                    }
                }
            }, id, modal);
        }
        static currentBorderColor() {
            let td = _11dotjs.NodeUtil.firstParent(Demo.textArea(), "TD");
            let cssBorder = td.style.border;
            let cssColor = cssBorder.substring(cssBorder.toUpperCase().indexOf("RGB"));
            let ret = _11dotjs.RGB.fromCss(cssColor);
            return ret;
        }
        static tablesDemo() {
            //let tdPv = Demo.previewElement();
            //tdPv.innerHTML = null;
            let clientAreaId = Demo.componentId + "_tableDemoClient";
            let dialog = new _11dotjs.Dialog({
                "modal": false,
                "parent": document.body,
                "title": "11dotjs Tables",
                "dialogId": this.componentId + "_tableDemoDialog",
                "clientAreaId": clientAreaId,
                "position": _11dotjs.DialogPosition.center
            });
            let client = document.getElementById(clientAreaId);
            _11dotjs.Tables.demo(client, 7, 7);
            dialog.setPosition();
        }
        // gpt
        static configureTextAreaForTabInsertion(textarea) {
            textarea.style.tabSize = "4";
            textarea.addEventListener('keydown', function (event) {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    // Get the current position of the cursor
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    // Set the value with the tab inserted at the cursor's position
                    textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
                    // Move the cursor to the position right after the inserted tab
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                }
            });
        }
        static channel() {
            let ret = new URL(location.href).searchParams.get('channel');
            return ret;
            //return ( ret ) ? ret : 'zero';
        }
        static checkChannel() {
            let ch = Demo.channel();
            if (ch) {
                Demo.openChannel(ch);
                return true;
            }
            return false;
        }
        static openChannel(ch) {
            if (ch == 'sleep') {
                _11dotjs.DocComposer.compose({
                    "audio": {
                        "controls": true,
                        "src": 'http://www.elisokal.com/audio/GOE/2024-08-24.mp3',
                        "loop": 1,
                        "style": "width:50%; transform: scale(2.0); transform-origin: 0 0",
                    }
                }, document.body);
            }
            else if (ch == 'music') {
                _11dotjs.DocComposer.compose({
                    "audio": {
                        "controls": true,
                        "src": 'http://www.elisokal.com/audio/Desert%20Dwellers/DJmixes/Live%20at%203hr%20Rocky%20Mountain%20Set%202020.mp3',
                        "loop": 1,
                        "style": "width:50%; transform: scale(2.0); transform-origin: 0 0",
                    }
                }, document.body);
            }
            else if (ch == 'test') {
                _11dotjs.DocComposer.testToJsml2();
                //DocComposer.testRef();
            }
        }
        static renderMainIndicators(channel, instanceCount) {
            let layoutTableId = "renderMainIndicators";
            let layoutTable = _11dotjs.Tables.generate({
                "rowCount": 2,
                "columnCount": 2,
                "componentId": layoutTableId,
                "cellStyle": [["padding: 0.25em; border: 1px solid RGB(44,44,44); border-radius: 0.5em"]]
            });
            _11dotjs.DocComposer.compose({
                "div": {
                    "style": "position: fixed; left: 0.5em; bottom: 0.5em; color: RGB(111,11,11); font-size: large",
                    "table": layoutTable.table
                }
            }, document.body);
            let elTable = document.getElementById(layoutTableId);
            //elTable.style.borderCollapse = "collapse";
            _11dotjs.Tables.getCellElement(layoutTableId, 0, 0).innerHTML = "Channel";
            _11dotjs.Tables.getCellElement(layoutTableId, 0, 1).innerHTML = channel;
            _11dotjs.Tables.getCellElement(layoutTableId, 1, 0).innerHTML = "Tabs Open";
            _11dotjs.Tables.getCellElement(layoutTableId, 1, 1).innerHTML = `${instanceCount}`;
        }
    }
    Demo.componentId = "11dotjsDemo";
    Demo.downloadFileName = 'DocComposerDemo.json';
    Demo.rgbOkIndicator = "RGB(11,121,11)";
    Demo.rgbErrorIndicator = "RGB(176,11,11)";
    _11dotjs.Demo = Demo;
})(_11dotjs || (_11dotjs = {}));
