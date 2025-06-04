const str = "ngsahjkd";

const arr = str
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(arr);
