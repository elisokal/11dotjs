/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
enum Axis {
    x, y, z
}

class VisPoint {

    public x: number;

    public y: number;

    public z: number;

    public constructor(x?: any, y?: any, z?: any) {
        if (((typeof x === 'number') || x === null) && ((typeof y === 'number') || y === null) && ((typeof z === 'number') || z === null)) {
            let __args = arguments;
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.x = x;
            this.y = y;
            this.z = z;
        } else if (((x != null && x instanceof <any>VisPoint) || x === null) && y === undefined && z === undefined) {
            let __args = arguments;
            let p: any = __args[0];
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.set(p);
        } else if (x === undefined && y === undefined && z === undefined) {
            let __args = arguments;
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
        } else throw new Error('invalid overload');
    }

    public set(p: VisPoint) {
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
    }

    public toString(): string {
        const ret: string = `${this.x}, ${this.y}, ${this.z}`;
        return ret;
    }

    public dbgString(): string {
        //const ret: string = javaemul.internal.StringHelper.format("[%.2f,%.2f,%.2f]", this.x, this.y, this.z);
        return this.toString();
    }

    public dbgPrint() {
        console.log( this.dbgString() );
    }

    public clone(): VisPoint {
        return new VisPoint(this);
    }

    public scale$double(adjustor: number) {
        this.x *= adjustor;
        this.y *= adjustor;
        this.z *= adjustor;
    }

    public toDoubleArray(): number[] {
        const ret: number[] = [0, 0, 0];
        ret[0] = this.x;
        ret[1] = this.y;
        ret[2] = this.z;
        return ret;
    }

    public toFloatArray(): number[] {
        const ret: number[] = [0, 0, 0];
        ret[0] = (<any>Math).fround(this.x);
        ret[1] = (<any>Math).fround(this.y);
        ret[2] = (<any>Math).fround(this.z);
        return ret;
    }

    public times(d: number): VisPoint {
        const ret: VisPoint = new VisPoint(this.x * d, this.y * d, this.z * d);
        return ret;
    }

    public static zero(): VisPoint {
        return new VisPoint(0.0, 0.0, 0.0);
    }

    public static one(): VisPoint {
        return new VisPoint(1.0, 1.0, 1.0);
    }

    public static min(): VisPoint {
        return new VisPoint(-1.7976931348623157E308, -1.7976931348623157E308, -1.7976931348623157E308);
    }

    public static max(): VisPoint {
        return new VisPoint(1.7976931348623157E308, 1.7976931348623157E308, 1.7976931348623157E308);
    }

    public static normal(): VisPoint {
        return new VisPoint(0.0, 0.0, 1.0);
    }

    public add(offset: VisPoint) {
        this.x += offset.x;
        this.y += offset.y;
        this.z += offset.z;
    }

    public subtract(offset: VisPoint) {
        this.x -= offset.x;
        this.y -= offset.y;
        this.z -= offset.z;
    }

    public getMax(): number {
        const ret: number = Math.max(Math.max(this.x, this.y), this.z);
        return ret;
    }

    /**
     * @param {number} degreesClockwise
     * 
     * This is a 2D rotation on the XY plane
     */
    public rotateXY(degreesClockwise: number) {
        const aRadians: number = /* toRadians */(x => x * Math.PI / 180)(-degreesClockwise);
        const cosa: number = Math.cos(aRadians);
        const sina: number = Math.sin(aRadians);
        const newx: number = this.x * cosa - this.y * sina;
        const newy: number = this.x * sina + this.y * cosa;
        this.x = newx;
        this.y = newy;
    }

    /**
     * @param {number} degreesClockwise
     * 
     * This is a 2D rotation on the XZ plane
     */
    public rotateXZ(degreesClockwise: number) {
        const aRadians: number = /* toRadians */(x => x * Math.PI / 180)(-degreesClockwise);
        const cosa: number = Math.cos(aRadians);
        const sina: number = Math.sin(aRadians);
        const newx: number = this.x * cosa - this.z * sina;
        const newz: number = this.x * sina + this.z * cosa;
        this.x = newx;
        this.z = newz;
    }

    /**
     * @param {number} degreesClockwise
     * 
     * This is a 2D rotation on the YZ plane
     */
    public rotateYZ(degreesClockwise: number) {
        const aRadians: number = /* toRadians */(x => x * Math.PI / 180)(-degreesClockwise);
        const cosa: number = Math.cos(aRadians);
        const sina: number = Math.sin(aRadians);
        const newy: number = this.y * cosa - this.z * sina;
        const newz: number = this.y * sina + this.z * cosa;
        this.y = newy;
        this.z = newz;
    }

    public rotate$com_osx_common_VisPoint$com_osx_common_VisPoint(origin: VisPoint, normal: VisPoint) {
        const work: VisPoint = /* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(this);
        work.subtract(origin);
        const normalNormal: VisPoint = VisPoint.normal();
        const normalOnXZ: VisPoint = /* clone *//* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(normal);
        normalOnXZ.y = 0.0;
        const aXZ: number = normalNormal.angleWith$com_osx_common_VisPoint(normalOnXZ);
        work.rotateXZ(aXZ);
        const normalOnXY: VisPoint = /* clone *//* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(normal);
        normalOnXY.z = 0.0;
        const aXY: number = normalNormal.angleWith$com_osx_common_VisPoint(normalOnXY);
        work.rotateXY(aXY);
        const normalOnYZ: VisPoint = /* clone *//* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(normal);
        normalOnYZ.x = 0.0;
        const aYZ: number = normalNormal.angleWith$com_osx_common_VisPoint(normalOnYZ);
        work.rotateYZ(aYZ);
        work.add(origin);
        this.set(work);
    }

    public rotate$com_osx_common_VisPoint$double$double$double(origin: VisPoint, aX: number, aY: number, aZ: number) {
        const work: VisPoint = /* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(this);
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
    public rotate(origin?: any, aX?: any, aY?: any, aZ?: any) {
        if (((origin != null && origin instanceof <any>VisPoint) || origin === null) && ((typeof aX === 'number') || aX === null) && ((typeof aY === 'number') || aY === null) && ((typeof aZ === 'number') || aZ === null)) {
            return <any>this.rotate$com_osx_common_VisPoint$double$double$double(origin, aX, aY, aZ);
        } else if (((origin != null && origin instanceof <any>VisPoint) || origin === null) && ((aX != null && aX instanceof <any>VisPoint) || aX === null) && ((typeof aY === 'number') || aY === null) && aZ === undefined) {
            return <any>this.rotate$com_osx_common_VisPoint$com_osx_common_VisPoint$double(origin, aX, aY);
        } else if (((origin != null && origin instanceof <any>VisPoint) || origin === null) && ((aX != null && aX instanceof <any>VisPoint) || aX === null) && aY === undefined && aZ === undefined) {
            return <any>this.rotate$com_osx_common_VisPoint$com_osx_common_VisPoint(origin, aX);
        } else throw new Error('invalid overload');
    }

    public rotate$com_osx_common_VisPoint$com_osx_common_VisPoint$double(o1: VisPoint, o2: VisPoint, a: number) {
        const axis: VisPoint = /* clone *//* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(o2);
        axis.subtract(o1);
        if (!axis.isZero()){
            let aZ: number = 0.0;
            const axisOnYZ: VisPoint = new VisPoint(0.0, axis.y, axis.z);
            if (!axisOnYZ.isZero()){
                aZ = axis.angleWith$com_osx_common_VisPoint(axisOnYZ);
            } else {
                aZ = (axis.x > 0.0) ? 90.0 : -90.0;
            }
            const yAxis: VisPoint = new VisPoint(0.0, 1.0, 0.0);
            const aX: number = axisOnYZ.angleWith$com_osx_common_VisPoint(yAxis);
            const result: VisPoint = /* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(this);
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
    public rotateSUX(o1: VisPoint, o2: VisPoint, a: number) {
        const axis: VisPoint = /* clone *//* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(o2);
        axis.subtract(o1);
        const axisOnYZ: VisPoint = new VisPoint(0.0, axis.y, axis.z);
        const aZ: number = axis.angleWith$com_osx_common_VisPoint(axisOnYZ);
        const axisOnXY: VisPoint = new VisPoint(axisOnYZ.x, axisOnYZ.y, 0.0);
        const aX: number = axisOnYZ.angleWith$com_osx_common_VisPoint(axisOnXY);
        const result: VisPoint = /* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(this);
        result.subtract(o1);
        result.rotateXZ(a);
        result.rotateYZ(-aX);
        result.rotateXY(-aZ);
        result.add(o1);
        this.set(result);
    }

    public scale$com_osx_common_VisPoint$double$double$double(origin: VisPoint, sX: number, sY: number, sZ: number) {
        const work: VisPoint = /* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(this);
        work.subtract(origin);
        work.x *= sX;
        work.y *= sY;
        work.z *= sZ;
        work.add(origin);
        this.set(work);
    }

    public scale(origin?: any, sX?: any, sY?: any, sZ?: any) {
        if (((origin != null && origin instanceof <any>VisPoint) || origin === null) && ((typeof sX === 'number') || sX === null) && ((typeof sY === 'number') || sY === null) && ((typeof sZ === 'number') || sZ === null)) {
            return <any>this.scale$com_osx_common_VisPoint$double$double$double(origin, sX, sY, sZ);
        } else if (((typeof origin === 'number') || origin === null) && sX === undefined && sY === undefined && sZ === undefined) {
            return <any>this.scale$double(origin);
        } else throw new Error('invalid overload');
    }

    public angleWith$com_osx_common_VisPoint(other: VisPoint): number {
        const origin: VisPoint = VisPoint.zero();
        const a: number = this.distance(other);
        const b: number = origin.distance(this);
        const c: number = origin.distance(other);
        let ret: number = 0.0;
        if (a > 0.0 && b > 0.0 && c > 0.0){
            const num: number = b * b + c * c - a * a;
            const den: number = 2 * b * c;
            const arg: number = num / den;
            ret = Math.acos(arg);
        }
        ret = /* toDegrees */(x => x * 180 / Math.PI)(ret);
        return ret;
    }

    public angleWith$com_osx_common_VisPoint$com_osx_common_VisPoint(common: VisPoint, other: VisPoint): number {
        const moveThis: VisPoint = new VisPoint(this.x - common.x, this.y - common.y, this.z - common.z);
        const moveOther: VisPoint = new VisPoint(other.x - common.x, other.y - common.y, other.z - common.z);
        const ret: number = moveThis.angleWith$com_osx_common_VisPoint(moveOther);
        return ret;
    }

    /**
     * Return the angle between two lines at a common point
     * @param {VisPoint} common
     * @param {VisPoint} other
     * @return {number}
     */
    public angleWith(common?: any, other?: any): number {
        if (((common != null && common instanceof <any>VisPoint) || common === null) && ((other != null && other instanceof <any>VisPoint) || other === null)) {
            return <any>this.angleWith$com_osx_common_VisPoint$com_osx_common_VisPoint(common, other);
        } else if (((common != null && common instanceof <any>VisPoint) || common === null) && other === undefined) {
            return <any>this.angleWith$com_osx_common_VisPoint(common);
        } else throw new Error('invalid overload');
    }

    /**
     * @param {number} number 1-3
     * @return {number} x, y, or z respectively
     */
    public getCoordinate(number: number): number {
        const ret: number = (number === 1) ? this.x : (number === 2) ? this.y : this.z;
        return ret;
    }

    /**
     * @param {number} number 1-3
     * @param {number} value - value to apply to x, y, or z respectively
     * @return
     */
    public setCoordinate(number: number, value: number) {
        switch((number)) {
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

    public static getCoordinateName(number: number): string {
        const ret: string = (number === 1) ? "x" : (number === 2) ? "y" : "z";
        return ret;
    }

    public equals(other: VisPoint): boolean {
        //const ret: boolean = com.osx.common.Utility.fEqual$double$double(this.x, other.x) && com.osx.common.Utility.fEqual$double$double(this.y, other.y) && com.osx.common.Utility.fEqual$double$double(this.z, other.z);
        const ret: boolean = ( this.x == other.x && this.y == other.y && this.x == other.z );
        return ret;
    }

    public distance(other: VisPoint): number {
        const dx: number = other.x - this.x;
        const dy: number = other.y - this.y;
        const dz: number = other.z - this.z;
        const ret: number = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return ret;
    }

    public onLineSegment(other: VisPoint, scale: number): VisPoint {
        const ret: VisPoint = new VisPoint(this.x + (other.x - this.x) * scale, this.y + (other.y - this.y) * scale, this.z + (other.z - this.z) * scale);
        return ret;
    }

    public allNonZero(): boolean {
        let ret: boolean = true;
        if (this.x === 0.0 || this.y === 0.0 || this.z === 0.0){
            ret = false;
        }
        return ret;
    }

    public isZero(): boolean {
        // if (com.osx.common.Utility.fZero(this.x) && com.osx.common.Utility.fZero(this.y) && com.osx.common.Utility.fZero(this.z)){
        const ret: boolean = ( this.x == 0.0 && this.y == 0.0 && this.x == 0.0 );
        return ret;
    }


    public modulate(other: VisPoint, mag: number) {
        this.x += other.x * mag;
        this.y += other.y * mag;
        this.z += other.z * mag;
    }

    public scaleToUnitLength() {
        let mag: number;
        mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (mag !== 1.0 && mag > 0.0 ) { //com.osx.common.Utility.DOUBLE_ROUND_OFF_TOLERANCE
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }
    }

    public perpendicular(): VisPoint {
        let ret: VisPoint = null;
        if (!this.isZero()){
            const lra: Axis = this.leastRepresentedAxis();
            ret = /* clone *//* clone */((o: any) => { if (o.clone != undefined) { return (<any>o).clone(); } else { let clone = Object.create(o); for(let p in o) { if (o.hasOwnProperty(p)) clone[p] = o[p]; } return clone; } })(this);
            if (/* Enum.equals */(<any>(Axis.x) === <any>(lra))){
                ret.rotateYZ(90.0);
            } else if (/* Enum.equals */(<any>(Axis.y) === <any>(lra))){
                ret.rotateXZ(90.0);
            } else if (/* Enum.equals */(<any>(Axis.z) === <any>(lra))){
                ret.rotateXY(90.0);
            }
        }
        return ret;
    }

    public leastRepresentedAxis(): Axis {
        let ret: Axis = Axis.x;
        if (Math.abs(this.y) < Math.abs(this.x)){
            ret = Axis.y;
        }
        if (Math.abs(this.z) < Math.abs(this.y)){
            ret = Axis.z;
        }
        return ret;
    }

    public clockwise90(): VisPoint {
        const ret: VisPoint = new VisPoint(this.z, -this.x, -this.y);
        return ret;
    }

    public invert() {
        this.x *= -1.0;
        this.y *= -1.0;
        this.z *= -1.0;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getZ(): number {
        return this.z;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public setZ(z: number) {
        this.z = z;
    }

    /**
     * @param {string} s A string we can parse as x,y,z
     * @return {VisPoint}
     */
    public static fromString(s: string): VisPoint {
        //const t: com.osx.common.Utility.Text = com.osx.common.Utility.Text.fromString(s, ",");
        //const ret: VisPoint = new VisPoint(parseFloat(/* get */(<any>t).__delegate[0]), parseFloat(/* get */(<any>t).__delegate[1]), parseFloat(/* get */(<any>t).__delegate[2]));
        throw "TODO: code VisPoint.fromString";
        //return ret;
    }

    public interpolate(other: VisPoint, portion: number): VisPoint {
        const interp: VisPoint = new VisPoint(this.x + (other.x - this.x) * portion, this.y + (other.y - this.y) * portion, this.z + (other.z - this.z) * portion);
        return interp;
    }
}

class Vpl extends Array<VisPoint> {
    public clone(): Vpl {
        throw( "Vpl.clone not implemented" );
    }
}
