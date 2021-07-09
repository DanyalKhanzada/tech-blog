const format_date = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const formattedMonth = months[date.getMonth()];

    return `${date.getDate()} ${formattedMonth} ${date.getFullYear()}`
};

const format_plural = (string, num) => {
    if (num === 1) {
        return string;
    }
    else {
        return `${string}s`;
    };
};

module.exports = { format_date, format_plural };