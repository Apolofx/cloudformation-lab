// const logger = (...arg) => console.log(...arg);
// module.exports.logger = logger;
export const logger = (...arg: any[]) => console.log(...arg);
export { default as db } from "./db";
