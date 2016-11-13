import { createElement } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Icon from '../../Icon';
import Link from '../../Link';

import styles from './Help.pcss';


export default () => {
  return (
    <ContentWithMenu
      hasBoldTitle={true}
      menuItems={[]}
      title="Getting started"
    >
      <ol className={styles.steps}>
        <li>
          Add a <Link to="/app/sources">source</Link>
          <small> (ie. define where your music is stored)</small>.
        </li>
        <li>Wait for it to be processed.</li>
        <li>Play some <Link to="/app">music</Link>.</li>
      </ol>

      <p className={styles.note}>
        Most of the UI should be self-explanatory, if not,
        you can always create an issue on
        the <a href="https://github.com/icidasset/ongaku-ryoho/issues">Github repo</a>.
      </p>

      <h2>Collections and the queue</h2>

      <div className={styles.keys}>
        <div>
          <h3>Add to, or remove from, a collection</h3>
          <ul>
            <li>&#x21E7;</li>
            <li>+</li>
            <li><Icon icon="mouse-pointer" /></li>
          </ul>
          <p>
            Shift key + double-click
          </p>
        </div>

        <div>
          <h3>Add to the queue</h3>
          <ul>
            <li>&#x2325;</li>
            <li>+</li>
            <li><Icon icon="mouse-pointer" /></li>
          </ul>
          <p>
            Alt/option key + double-click
          </p>
        </div>
      </div>

      <p>
        To add a track to, or remove from, a collection, first select a collection
        you want to add something to. You can do that by clicking on the icon next
        to the current-collection label in the search bar, it should say
        <em> target collection</em>. Next, hold the <strong>shift key</strong> on your keyboard
        and double click a track. It should display a notification when you hold
        the correct key and when you added/removed something.
      </p>

      <p>
        To add something to the queue, hold the <strong>alt/option key</strong> and
        double click a track.
      </p>
    </ContentWithMenu>
  );
};
