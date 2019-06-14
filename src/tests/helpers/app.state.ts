import { Select, Selector, State, StateContext } from '@ngxs/store';
import { Emittable, Emitter, Receiver } from '@ngxs-labs/emitter';

import { Observable } from 'rxjs';
import { ImmutableContext, ImmutableSelector } from './../../public_api';

export interface AppModel {
  status: string;
}

export const defaults: AppModel = {
  status: 'Not Okay'
};

@State<AppModel>({
  name: 'app',
  defaults
})
export class AppState {
  @Receiver({ type: '[App] Set Ok Status' })
  @ImmutableContext()
  public static setOkStatus({ setState }: StateContext<AppModel>) {
    setState((draft: AppModel) => {
      draft.status = 'OK';
      return draft;
    });
  }

  @Receiver({ type: '[App] Reset State' })
  @ImmutableContext()
  public static resetState({ setState }: StateContext<AppModel>) {
    setState(() => defaults);
  }
}

export class AppEmitters {
  @Emitter(AppState.setOkStatus)
  static setOkStatus: Emittable<void>;

  @Emitter(AppState.resetState)
  static resetState: Emittable<void>;
}

class Selectors {
  @Selector([AppState])
  @ImmutableSelector()
  public static getAppStatus(state: AppModel): string {
    return state.status;
  }
}

export class AppSelectorsAsync {
  @Select(Selectors.getAppStatus) public appStatus$: Observable<string> | any;
}
