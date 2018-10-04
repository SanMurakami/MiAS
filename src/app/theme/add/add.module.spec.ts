import { AddModule } from './add.module';

describe('AddModule', () => {
  let addModule: AddModule;

  beforeEach(() => {
    addModule = new AddModule();
  });

  it('should create an instance', () => {
    expect(addModule).toBeTruthy();
  });
});
