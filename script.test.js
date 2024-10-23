import { hello } from "./script";

describe("label", () => {
  it("label", () => {
    expect(hello()).toMatchSnapshot();
    expect(hello()).toBe("hello");
    expect({k:"v"}).toEqual({k:"v"});
    expect(5).toBeGreaterThan(4);
    expect(5).toBeGreaterThanOrEqual(5);
    expect(4).toBeLessThan(5);
    expect(5).toBeLessThanOrEqual(5);
  });

});
