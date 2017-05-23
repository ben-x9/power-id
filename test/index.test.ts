import {assert} from "chai"
import guid, {timestamp} from "src"

describe("guid", () => {
  it("should be a string", () => {
    assert.typeOf(guid(), "string")
  })

  it("should not be empty", () => {
    assert.notEqual(guid(), "")
  })

  it("should be unique", () => {
    assert.notEqual(guid(), guid())
  })

  it("should have a timestamp", () => {
    assert.closeTo(timestamp(guid()), Date.now(), 2000)
  })
})
