describe("load scripts specific to glitchdungeon+", function(){
	beforeEach(function(done){
		glitchdungeon_loadScripts(function(){
			done();
		});
	});
	
	it("should load all specified files", function(done){
		expect(Game).toBeDefined();
		done();
	});
});