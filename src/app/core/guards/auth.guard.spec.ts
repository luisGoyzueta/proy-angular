import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, of, Observable } from 'rxjs';

import { AuthService } from '../services/auth';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  let router: Router;

  const authMock = {
    initialize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authMock,
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  function executeGuard(url: string) {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url } as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() => authGuard(route, state)) as Observable<
      boolean | UrlTree
    >;
  }

  it('permite acceder cuando existe una sesión', async () => {
    authMock.initialize.mockReturnValue(of(true));

    const result = executeGuard('/dashboard');

    expect(await firstValueFrom(result)).toBe(true);
  });

  it('redirige al Login cuando no hay sesión', async () => {
    authMock.initialize.mockReturnValue(of(false));

    const result = executeGuard('/dashboard');

    const value = await firstValueFrom(result);

    expect(router.serializeUrl(value as UrlTree)).toBe('/login?returnUrl=%2Fdashboard');
  });
});
