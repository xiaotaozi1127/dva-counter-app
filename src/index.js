import dva, { connect } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import styles from './index.less';
import key from 'keymaster';

// 1. Initialize
const app = dva();

// 2. Model
// Remove the comment and define your model.
app.model({
  namespace: 'count',
  state: {
    record : 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    },
  },
  effects: {
    *addThenMinus(action, { call, put }) {
      yield put({ type: 'add' });
      yield call( delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'addThenMinus'}) });
    },
  },
});

function delay(timeout){
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
  }

const CountApp = ({count, dispatch}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={() => { dispatch({type: 'count/addThenMinus'}); }}>+</button>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return { count: state.count };
}
const HomePage = connect(mapStateToProps)(CountApp);

// 3. Router
app.router(({ history }) =>
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={HomePage} />
    </Switch>
  </Router>
);

// 4. Start
app.start('#root');
