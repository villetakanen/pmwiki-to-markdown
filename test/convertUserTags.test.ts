import { describe, expect, it } from "vitest";
import { convertUserTags } from "../src/convertWikitextToMarkdown";

describe("convertUserTags", () => {
  it("should convert user tags to more standard @uid tags", () => {
    const wikitext = "This is ~user1 text ~user2";
    const expectedMarkdown = "This is @user1 text @user2";
    expect(convertUserTags(wikitext)).toBe(expectedMarkdown);
  });
});
