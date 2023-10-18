export const filterObject = function (someObject, ...allowedList) {
    const filteredObject = {};
    Object.keys(someObject).forEach((el) => {
        if (allowedList.includes(el)) {
            filteredObject[el] = someObject[el];
        }
    });
    return filteredObject;
};
