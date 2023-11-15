import { Test, TestingModule } from "@nestjs/testing";
import { StadionsService } from "./stadions.service";

describe("StadionsService", () => {
  let service: StadionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StadionsService],
    }).compile();

    service = module.get<StadionsService>(StadionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
