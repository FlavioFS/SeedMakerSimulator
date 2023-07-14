
const Random = {
    INT32MIN: -2147483648,
    INT32MAX: 2147483647,
    UINTMAX: 4294967295,
    MBIG: 2147483647,
    MSEED: 161803398,
    
    inext: 0,
    inextp: 0,
    SeedArray: new Array(56).fill(0)
};

const int32 = (n) => ~~n;
const uint32 = (n) => (n + (Math.floor(n / Random.UINTMAX) + 2) * UINTMAX) % UINTMAX;

Random.Sample = function () {
    let s = this.InternalSample();
    let r = int32(s)*(1.0/this.MBIG);
    return (r);
};
    
Random.InternalSample = function () {
    let retVal = 0;
    let locINext = this.inext;
    let locINextp = this.inextp;

    if (++locINext >=56) locINext=1;
    if (++locINextp>= 56) locINextp = 1;
    
    retVal = int32(this.SeedArray[locINext]-this.SeedArray[locINextp]);

    if (retVal == this.MBIG) int32(retVal = retVal-1);
    if (retVal<0) retVal = int32(retVal + this.MBIG);
    
    this.SeedArray[locINext]= int32(retVal);

    this.inext = locINext;
    this.inextp = locINextp;
                
    return int32(retVal);
};

Random.GetSampleForLargeRange = function() {
    let result = this.InternalSample();
    let negative = (this.InternalSample() % 2 == 0) ? true : false;
    if(negative) {
        result = -result;
    }
    let d = result;
    d += Int32.MaxValue - 1;
    d /= 2 * uint32(this.INT32MAX - 1);
    return d;
};
    
Random.Random = function(seed) {
    let ii = mj = mk = 0;

    let subtraction = (seed == this.INT32MIN) ? this.INT32MAX : Math.abs(seed);
    mj = int32(this.MSEED - subtraction);
    this.SeedArray[55]=mj;
    mk=1;
    for (let i=1; i < 55; i++) {
        ii = (21*i) % 55;
        this.SeedArray[ii]=mk;
        mk = int32(mj - mk);
        if (mk < 0) mk = int32(mk + this.MBIG);
        mj=this.SeedArray[ii];
    }
    for (let k=1; k<5; k++) {
        for (let i=1; i<56; i++) {
            this.SeedArray[i] = int32(this.SeedArray[i] - this.SeedArray[1+(i+30)%55]);
            if (this.SeedArray[i]<0) this.SeedArray[i] = int32(this.SeedArray[i] + this.MBIG);
        }
    }
    this.inext=0;
    this.inextp = 21;
    seed = 1;
};
    
Random.Next = function(minValue, maxValue) {
    if (minValue > maxValue) {
        temp = maxValue;
        maxValue = minValue;
        minValue = temp;
    }
    
    let range = maxValue-minValue;
    if(range <= this.INT32MAX) {
        let s = this.Sample();
        return Math.floor(s * range) + minValue;
    }          
    else { 
        let s = this.GetSampleForLargeRange();
        return Math.floor((s * range) + minValue);
    }
};

Random.NextDouble = function() {
    let s = this.Sample();
    return s;
}