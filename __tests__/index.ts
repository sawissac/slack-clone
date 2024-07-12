import { parseEmail } from "../lib";

describe("checking lib functions", () => {
  it("email contain with abc@gmail.com convert to abc", () => {
    expect(parseEmail("abc@gmail.com")).toBe("abc")
  });
  it("email contain with abc+slackmod@gmail.com convert to abc", () => {
    expect(parseEmail("abc+slackmod@gmail.com")).toBe("abc")
  });
});
