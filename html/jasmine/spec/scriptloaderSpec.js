describe("scriptloader", function(){
	
	describe("external javascript files", function(){
		beforeEach(function(done){
			loadExternalFiles([
				{ src: "jasmine/src/scriptloader_test.js" }
			], function(){
				done();
			});
		});
		
		afterEach(function(done){
			jasmine_test = false;
			done();
		});
		
		it("should load an external script", function(done){
			expect(jasmine_test).toBe(true);
			done();
		});
		
		it("shouldn't load files twice", function(done){
			expect(jasmine_test).toBe(false);
			done();
		});
	});
	
	describe("sequential file load", function(){
		beforeEach(function(done){
			loadExternalFilesSequentially([
				{ src: "jasmine/src/scriptloader_test2.js" },
				{ src: "jasmine/src/scriptloader_test3.js" }
			], function(){
				done();
			});
		});
		
		it("should load files sequentially", function(done){
			expect(jasmine_test2).toBe(13);
			done();
		});
	});
	
	describe("external css files", function(){
		beforeEach(function(done){
			this.jasmine_test = document.createElement("div");
			this.jasmine_test.id = "jasmine_test";
			document.body.appendChild(this.jasmine_test);
			
			loadExternalFiles([
				{ href: "jasmine/src/scriptloader_test.css" }
			], function(){
				done();
			});
		});
		
		it("should load an external css", function(done){
			expect(window.getComputedStyle(this.jasmine_test).width).toBe("640px");
			done();
		});
	});
});