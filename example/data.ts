// is-deno-bucket
const __dirname = new URL(".", import.meta.url).pathname;
const rawData = Deno.readTextFileSync(__dirname + "mydata.json");
export default JSON.parse(rawData);
