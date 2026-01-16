should.Assertion.add('matchIds', function (idsExpected) {
    const idsReturned = this.obj.map((entry) => {
        return entry.id;
    });

    idsExpected.should.eql(idsReturned);
});
