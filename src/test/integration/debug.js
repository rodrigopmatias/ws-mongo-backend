
describe('Action of debug', () => {
  it('Should return ok (200)', (done) => {
    request.get('/debug')
      .expect(200)
      .end((err, res) => {
        expect(res.body.ok).to.be.eql(true);
        done(err);
      });
  });
});
