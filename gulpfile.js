/// <binding ProjectOpened='watch' />
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

require('require-dir')('./gulp/tasks', { recurse: true });