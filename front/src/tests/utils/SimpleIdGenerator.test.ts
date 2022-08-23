import { SimpleIdGenerator } from "../../utils/CanvasSizeManager";

export {};

class SimpleIdGeneratorImpl extends SimpleIdGenerator {}

test("Canvas Ids should be generated correctly", () => {
  const beginningSeed = "some-seed";
  const generator = new SimpleIdGeneratorImpl(beginningSeed);

  const genId = generator.getId();
  expect(genId === "some-seed" + "1");
});
