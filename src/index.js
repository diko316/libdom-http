'use strict';


import { use } from "./lib/chain.js";

import * as moduleApi from "./all.js";

use(moduleApi);

export * from "./all.js";

export default moduleApi;
