export function getFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    favorites = favorites ? favorites : [];

    return favorites;
}

export function isInFavorites(slug) {
    if (getFavorites().filter((val) => val.slug === slug).length > 0) {
        return true
    }

    return false
}

export function getHistories() {
    let histories = JSON.parse(localStorage.getItem("histories"));
    histories = histories ? histories : [];

    return histories;
}

export function isInHistories(slug) {
    if (getHistories().filter((val) => val.slug === slug).length > 0) {
        return true
    }

    return false
}

export function removeFromHistories(slug) {
    let histories = getHistories()
    let index = histories.findIndex((e) => e.slug === slug)

    histories.splice(index, 1);

    localStorage.setItem('histories', JSON.stringify(histories))
}

export function isScreenCounting() {
    let counting = localStorage.getItem("isScreenCounting") ? localStorage.getItem("isScreenCounting") === "true" : true;
    return counting;
}

export function getScreenCounter() {
    let counter = localStorage.getItem("screenCounter") ? parseInt(localStorage.getItem("screenCounter")) : 0;
    return counter;
}