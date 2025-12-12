function roundToClosestMillion(input) {

    if (input > 1000000) {
        const divideByMillions = Math.round(input / 1000000);
        return `${divideByMillions} million`;
    } else {
        return `${input} `;
    }
}

export default roundToClosestMillion;