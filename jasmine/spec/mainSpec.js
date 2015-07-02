describe("main initialization", function(){
	it("should init gradient", function(){
		expect(initGradient).not.toThrow();
	});
	
	it("should init webGL", function(){
		expect(webGLStart).not.toThrow();
	});
});