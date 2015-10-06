import logs from './logs.webpack.config';
import main from './main.webpack.config';


export default Object.assign.apply(null, [{}].concat(
  logs,
  main
));
