import { UniquePatenteCamionDirective } from './unique-patente-camion.directive';
import { CamionService } from '../services/camion.service';

describe('UniquePatenteCamionDirective', () => {
  it('should create an instance', () => {
    const directive = new UniquePatenteCamionDirective();
    expect(directive).toBeTruthy();
  });
});
