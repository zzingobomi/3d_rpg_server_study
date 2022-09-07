export const login_queue = (() => {
  class FiniteStateMachine {
    _currentState;
    _onEvent;

    constructor(onEvent) {
      this._currentState = null;
      this._onEvent = onEvent;
    }

    get State() {
      return this._currentState;
    }

    Broadcast(evt) {
      this._onEvent(evt);
    }

    OnMessage(evt, data) {
      return this._currentState.OnMessage(evt, data);
    }

    SetState(state) {
      const prevState = this._currentState;

      if (prevState) {
        prevState.OnExit();
      }

      this._currentState = state;
      this._currentState._parent = this;
      state.OnEnter(prevState);
    }
  }

  class State {
    constructor() {}

    Broadcast(evt) {
      this._parent.Broadcast(evt);
    }

    OnEnter() {}

    OnMessage() {}

    OnExit() {}
  }

  class Login_Await extends State {
    _params;

    constructor() {
      super();
      this._params = {};
    }

    OnMessage(evt, data) {
      console.log(evt, data);
      if (evt != "login.commit") {
        return false;
      }

      this._params.accountName = data;
      this._parent.SetState(new Login_Confirm(this._params));

      return true;
    }
  }

  class Login_Confirm extends State {
    constructor(params) {
      super();
      this._params = { ...params };
    }

    OnEnter() {
      console.log("login confirmed: " + this._params.accountName);
      this.Broadcast({ topic: "login.complete", params: this._params });
    }

    OnMessage() {
      return true;
    }
  }

  class LoginClient {
    _onLogin;
    _fsm;

    constructor(client, onLogin) {
      this._onLogin = onLogin;

      client._onMessage = (e, d) => this._OnMessage(e, d);

      this._fsm = new FiniteStateMachine((e) => {
        this._OnEvent(e);
      });
      this._fsm.SetState(new Login_Await());
    }

    _OnEvent(evt) {
      this._onLogin(evt.params);
    }

    _OnMessage(topic, data) {
      return this._fsm.OnMessage(topic, data);
    }
  }

  class LoginQueue {
    _clients;
    _onLogin;

    constructor(onLogin) {
      this._clients = {};
      this._onLogin = onLogin;
    }

    Add(client) {
      this._clients[client.ID] = new LoginClient(client, (e) => {
        this._OnLogin(client, e);
      });
    }

    _OnLogin(client, params) {
      delete this._clients[client.ID];

      this._onLogin(client, params);
    }
  }

  return {
    LoginQueue: LoginQueue,
  };
})();
