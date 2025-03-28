import { name } from './01.mjs';
import{name as name2} from './01.mjs';

import * as module01 from './01.mjs';

import defaultFunction from './01.mjs';

import './01.mjs';

export * from './01.mjs';

if(name === name2){
    import('./01.mjs').then(module => {
        console.log(module.name);
    });
}

async function loadModule(){
    const module = await import('./01.mjs');
    console.log(module.name);
}
loadModule();