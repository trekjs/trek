import path from 'path';
import Trek from '..';

var app = new Trek;
app.calledFrom = __dirname;
app.run(3000);