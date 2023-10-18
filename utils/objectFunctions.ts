export const filterObject = function (
  someObject: { [key: string]: any },
  ...allowedList: string[]
) {
  const filteredObject: { [key: string]: any } = {};

  Object.keys(someObject).forEach((el) => {
    if (allowedList.includes(el)) {
      filteredObject[el] = someObject[el];
    }
  });
  return filteredObject;
};
