/// <binding ProjectOpened='watch' />
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import "babel-polyfill";
import requireDir from 'require-dir';

requireDir('./tools/gulp/tasks', { recurse: true });