import { Test, TestingModule } from "@nestjs/testing";
import { StadionsController } from "./stadions.controller";
import { StadionsService } from "./stadions.service";

describe("StadionsController", () => {
  let controller: StadionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StadionsController],
      providers: [StadionsService],
    }).compile();

    controller = module.get<StadionsController>(StadionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
