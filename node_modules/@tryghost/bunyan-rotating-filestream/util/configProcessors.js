const processSize = (size) => {
    const multipliers = {
        b: 1,
        k: 1024,
        m: 1024 * 1024,
        g: 1024 * 1024 * 1024
    };
    
    if (typeof (size) === 'string') {
        const [num, unit] = /^([1-9][0-9]*)([bkmg])$/.exec(size).slice(1);
        return Number(num) * multipliers[unit];
    } else {
        return size;
    }
};

const processPeriod = (period) => {
    const result = {
        num: 1,
        unit: 'd'
    };

    // Parse `period`.
    if (period) {
        var crackedperiod = {
            hourly: '1h',
            daily: '1d',
            weekly: '1w',
            monthly: '1m',
            yearly: '1y'
        }[period] || period;

        const [num, unit] = /^([1-9][0-9]*)([hdwmy]|ms)$/.exec(crackedperiod).slice(1);
        
        result.num = Number(num);
        result.unit = unit;
    }

    return result;
};

module.exports = {
    processSize,
    processPeriod
};