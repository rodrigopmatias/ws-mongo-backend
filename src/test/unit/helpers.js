import chai from 'chai';
import testdouble from 'testdouble';

import app from '../../app';

global.app = app;
global.expect = chai.expect;
global.td = testdouble;
