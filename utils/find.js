/*
@param list: array of items (object array)
@param itemId: id of item Ex: "a0ece5db-cd14-4f21-812f-966633e7be86"
function findItem: returns the object with the given id or undefined
*/
const findItem = (list, itemId) => {
    let index = 0;

    while(index < list.length && list[index].id !== itemId)
        index++;

    return (index >= list.length) ? undefined: list[index];
};

module.exports = {
    findItem
};