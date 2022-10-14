/*
cont - цепная дробь. Массив вида [a,b,c,...] где a - целое число, b,c... - натуральные числа.
 */

let accuracy = 12

let testDec = (dec) => {
    return Number.isFinite(dec);
}

let testCon = (con) => {
    if (!Array.isArray(con)) return false
    if (con.length === 0) return false
    for (let el of con.slice(1)) if (!Number.isInteger(el) || el < 1) return false
    return Number.isInteger(con[0])
}

let testFra = (fra) => {
    if (!Array.isArray(fra)) return false
    if (fra.length !== 2) return false
    for (let el of fra) if (!Number.isInteger(el)) return false
    return fra[1] >= 1;
}

/** @param {number[]} con
 * @return {[number, number]} **/
function con2fra(con){
    if(!testCon(con)) throw `${con} is not continue fraction`
    con = con.slice(0);
    let fra = [0,1]
    while(con.length > 1){
        let gap = fra[0]
        fra[0] = fra[1]
        fra[1] = con.pop()*fra[1] + gap
    }
    fra[0] += fra[1]*con.pop()
    return fra
}

/** @param {[number, number]} fra
 * @return {number[]} **/
function fra2con(fra){
    if(!testFra(fra)) throw `${fra} is not fraction`
    fra = fra.slice(0);
    let gap = fra[0] % fra[1]
    let con = [(fra[0] - gap) / fra[1]]
    fra[0] = gap

    while(fra[0]){
        let gap = fra[1]
        fra[1] = fra[0]
        fra[0] = gap

        gap = fra[0] % fra[1]
        con.push((fra[0] - gap) / fra[1])
        fra[0] = gap
    }
    return con
}
/** @param {number} dec
 * @return {number[]} **/
function dec2con(dec){
    if(!testDec(dec)) throw `${dec} is not decimal`
    let con = []
    for(let i=0; i<accuracy; i++){
        let int = Math.floor(dec)
        con.push(int)
        dec = 1/(dec - int)
        if (!Number.isFinite(dec) || dec > Math.pow(2, accuracy)){
            break
        }
    }
    return con
}

/** @param {number[]} con
 * @return {number} **/
function con2dec(con){
    if(!testCon(con)) throw `${con} is not continue fraction`
    return fra2dec(con2fra(con))
}

/** @param {number} dec
 * @return {[number, number]} **/
function dec2fra(dec){
    if(!testDec(dec)) throw `${dec} is not decimal`
    return con2fra(dec2con(dec))
}

/** @param {[number, number]} fra
 * @return {number} **/
function fra2dec(fra){
    if(!testFra(fra)) throw `${fra} is not fraction`
    return fra[0]/fra[1]
}


let parast = (value) => {
    let con = dec2con(value)
    let fras = []
    for(let i=0;i<con.length;i++){
        let fra = con2fra(con.slice(0,i+1))
        if(fra[1] > 150){
            break
        }
        fras.push(fra)
    }
    return fras
}


export {fra2dec, dec2fra, con2dec, dec2con, fra2con, con2fra, parast}