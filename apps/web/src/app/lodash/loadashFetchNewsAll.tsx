import memoize from 'lodash.memoize';
import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadashFetchNewsAll = (): Promise<any> =>
  new Promise((resolve) => {
    fetch(`${environment.apiUrl}/api/news`)
      .then((response) => response.json())
      .then((data) => resolve(data));
  });

export default memoize(loadashFetchNewsAll);
