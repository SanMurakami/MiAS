import { MypageModule } from './mypage.module';

describe('MypageModule', () => {
  let mypageModule: MypageModule;

  beforeEach(() => {
    mypageModule = new MypageModule();
  });

  it('should create an instance', () => {
    expect(mypageModule).toBeTruthy();
  });
});
