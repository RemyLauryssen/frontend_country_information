function roundToClosestMillion(input) {

    if (input > 1.0e6) {
        const divideByMillions = Math.round(input / 1.0e6);
        return `${divideByMillions} million`;
    } else {
        return `${input} `;
    }
}

export default roundToClosestMillion;