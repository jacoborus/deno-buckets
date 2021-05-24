import bucketsConf from "./app-conf.ts";
import { loadBuckets } from "../mod.ts";

const buckets = loadBuckets(bucketsConf);
console.log(buckets);
