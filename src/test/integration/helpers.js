import supertest from 'supertest';
import chai from 'chai';
import app from '../../app';

global.app = app;
global.expect = chai.expect;
global.request = supertest(app);
