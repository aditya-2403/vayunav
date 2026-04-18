function prettifyTitle(rawTitle, airportCode) {
    let pretty = rawTitle.replace(/\.pdf$/i, '');
    const prefixRegex = new RegExp(`^${airportCode}-?`, 'i');
    pretty = pretty.replace(prefixRegex, '');
    pretty = pretty.replace(/-/g, ' ').trim();
    return pretty || rawTitle;
}

function determineCategory(titleStr) {
    const t = titleStr.toUpperCase();
    if (t.includes('SID')) return 'SIDs';
    if (t.includes('STAR')) return 'STARs';
    if (t.includes('ADC') || t.includes('PDC') || t.includes('PB ') || t.includes('PB-') || t.includes('GROUND') || t.includes('APRON') || t.includes('HOT SPOT')) {
        return 'GROUND';
    }
    if (t.includes('IAC') || t.includes('ILS') || t.includes('VOR') || t.includes('RNAV') || t.includes('RNP') || t.includes('NDB') || t.includes('DME') || t.includes('LOC') || t.includes('CDI') || t.includes('VDM') || t.includes('APPROACH')) {
        return 'APPROACHES';
    }
    return 'MISC';
}

function processRawChart(chart, airportCode) {
    const prettyTitle = prettifyTitle(chart.title, airportCode);
    const category = determineCategory(chart.title);
    return {
        title: prettyTitle,
        originalTitle: chart.title,
        category,
        url: chart.url
    };
}

module.exports = {
    processRawChart
};
