const currentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

module.exports = {
    currentDate
};