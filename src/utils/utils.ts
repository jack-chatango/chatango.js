export function genUid() {
    /**
     * Generate a uid
     */
    return Math.floor(Math.random() * 9e15 + 1e15).toString();
}

export function getAnonName(tssid: string, puid: string): string {
    // Pad and slice PUID
    puid = puid.padStart(8, '0').slice(4, 8);
    
    // Process timestamp
    let ts = tssid.toString();
    if (!ts || ts.length < 4) {
        ts = "3452";
    } else {
        ts = ts.split(".")[0].slice(-4);
    }

    let result = "";
    for (let i = 0; i < puid.length; i++) {
        const puidDigit = parseInt(puid[i]);
        const tsDigit = parseInt(ts[i]);
        const sum = (puidDigit + tsDigit).toString();
        result += sum.slice(-1);
    }

    return "anon" + result.padStart(4, '0');
}