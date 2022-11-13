// is-deno-bucket
const path = new URL("lorem.txt", import.meta.url).pathname;
export default Deno.readTextFileSync(path);
