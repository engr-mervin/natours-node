export const validator = function (regex: RegExp): (val: string) => boolean {
  return function (val: string) {
    return regex.test(val);
  };
};
