import { TestBed } from '@angular/core/testing';

import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { Observable, firstValueFrom, of } from 'rxjs';

import { AuthService } from '../services/auth';
import { PermissionService } from '../services/permission';
import { permissionGuard } from './permission-guard';

describe('permissionGuard', () => {
  let router: Router;

  const authMock = {
    initialize: vi.fn(),
  };

  const permissionMock = {
    has: vi.fn(),
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
        {
          provide: PermissionService,
          useValue: permissionMock,
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  function executeGuard(permission: string) {
    const route = {
      data: {
        permission,
      },
    } as unknown as ActivatedRouteSnapshot;

    const state = {
      url: '/users',
    } as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() => permissionGuard(route, state)) as Observable<
      boolean | UrlTree
    >;
  }

  it('permite acceder con el permiso correspondiente', async () => {
    authMock.initialize.mockReturnValue(of(true));
    permissionMock.has.mockReturnValue(true);
    const result = executeGuard('users.view');
    expect(await firstValueFrom(result)).toBe(true);
    expect(permissionMock.has).toHaveBeenCalledWith('users.view');
  });

  it('redirige a forbidden cuando faltan permisos', async () => {
    authMock.initialize.mockReturnValue(of(true));
    permissionMock.has.mockReturnValue(false);
    const result = executeGuard('users.delete');
    const value = await firstValueFrom(result);
    expect(router.serializeUrl(value as UrlTree)).toBe('/forbidden');
  });

  it('redirige al Login cuando no existe sesión', async () => {
    authMock.initialize.mockReturnValue(of(false));
    const result = executeGuard('users.view');
    const value = await firstValueFrom(result);
    expect(router.serializeUrl(value as UrlTree)).toBe('/login?returnUrl=%2Fusers');
    expect(permissionMock.has).not.toHaveBeenCalled();
  });
});
