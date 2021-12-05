// is-deno-bucket
const rawData = Deno.readTextFileSync("mydata.json");
export default JSON.parse(rawData);
