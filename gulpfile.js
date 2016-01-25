/// <binding ProjectOpened='watch' />
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

require('require-dir')('./tools/gulp/tasks', { recurse: true });
